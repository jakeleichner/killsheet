// Accounts and cloud backup, stored in the Cloudflare D1 database bound as DB. The route files in functions/api/ call these.
// tools/test_api.mjs runs them against a real SQLite database on every push.
//
// No passwords. You prove you own an email with a 6-digit code sent to it (Resend, RESEND_API_KEY), or with Google
// (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET). The same email is the same account either way. A session is a random token in
// an HttpOnly cookie, so page scripts can't read it; the database keeps only its hash.

const CODE_MINUTES = 15;
const CODE_TRIES = 5;
const CODES_PER_EMAIL = 3; // in CODE_MINUTES
const CODES_PER_SENDER = 10; // an hour, from one IP address
const SESSION_DAYS = 365;
const MAX_SYNC = 900000; // characters; D1 rows stop at 2 MB and a row holds this and the previous copy
const PREV_EVERY = 24 * 3600 * 1000; // the older copy kept with each backup is at least a day old
const FROM = "KillSheet <signin@mail.killsheet.app>";
const REPLY_TO = "killsheet-support@googlegroups.com";
const GOOGLE_REDIRECT = "https://killsheet.app/api/auth/google/callback";

const json = (status, body, cookies) => {
  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store" });
  (cookies || []).forEach(c => headers.append("Set-Cookie", c));
  return new Response(JSON.stringify(body), { status, headers });
};
const redirect = (to, cookies) => {
  const headers = new Headers({ Location: to, "Cache-Control": "no-store" });
  (cookies || []).forEach(c => headers.append("Set-Cookie", c));
  return new Response(null, { status: 302, headers });
};
const hex = (bytes) => [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
const sha = async (text) => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))));
const randomHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const randomCode = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
const cookieOf = (request, name) => {
  const m = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? m[1] : "";
};
const sessionCookie = (token) => "ks_session=" + token + "; Path=/; Max-Age=" + SESSION_DAYS * 86400 + "; HttpOnly; Secure; SameSite=Lax";
const clearSession = "ks_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax";
const stateCookie = (state, age) => "ks_gstate=" + state + "; Path=/api/auth/google; Max-Age=" + age + "; HttpOnly; Secure; SameSite=Lax";
const normalEmail = (e) => {
  const email = typeof e === "string" ? e.trim().toLowerCase() : "";
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};
async function readJson(request, limit) {
  const text = await request.text();
  if (text.length > limit) return { tooBig: true };
  try { const v = JSON.parse(text); return v && typeof v === "object" ? { body: v } : {}; } catch (e) { return {}; }
}

const ready = new WeakSet();
export async function setUpAccounts(db) {
  if (ready.has(db)) return;
  for (const sql of [
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, google_sub TEXT UNIQUE, created_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS login_codes (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, code_hash TEXT NOT NULL, tries INTEGER NOT NULL DEFAULT 0, sender TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL)",
    "CREATE INDEX IF NOT EXISTS login_codes_email ON login_codes (email, created_at)",
    "CREATE INDEX IF NOT EXISTS login_codes_sender ON login_codes (sender, created_at)",
    "CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL)",
    "CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id)",
    "CREATE TABLE IF NOT EXISTS user_data (user_id TEXT PRIMARY KEY, data TEXT NOT NULL, rev INTEGER NOT NULL, updated_at INTEGER NOT NULL, prev_data TEXT, prev_at INTEGER)",
  ]) await db.prepare(sql).run();
  ready.add(db);
}

async function userForRequest(request, env, now) {
  const token = cookieOf(request, "ks_session");
  if (!token) return null;
  const row = await env.DB.prepare("SELECT u.id, u.email, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?").bind(await sha(token), now).first();
  return row || null;
}
async function newSession(env, userId, now) {
  const token = randomHex(32);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)").bind(await sha(token), userId, now, now + SESSION_DAYS * 86400000).run();
  return sessionCookie(token);
}
async function userForEmail(env, email, now) {
  const found = await env.DB.prepare("SELECT id, email, google_sub FROM users WHERE email = ?").bind(email).first();
  if (found) return found;
  const id = randomHex(16);
  await env.DB.prepare("INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)").bind(id, email, now).run();
  return { id, email, google_sub: null };
}

// POST /api/auth/email/start { email }: send a sign-in code. Says the same whether or not the email has an account.
export async function startEmail(request, env, now = Date.now()) {
  if (!env.DB || !env.RESEND_API_KEY) return json(503, { error: "not set up" });
  const { body } = await readJson(request, 2000);
  const email = normalEmail(body && body.email);
  if (!email) return json(400, { error: "bad email" });
  await setUpAccounts(env.DB);
  const quarter = now - CODE_MINUTES * 60000;
  const sender = (await sha((request.headers.get("CF-Connecting-IP") || "unknown") + "|" + new Date(now).toISOString().slice(0, 10))).slice(0, 16);
  const forEmail = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_codes WHERE email = ? AND created_at > ?").bind(email, quarter).first();
  const fromSender = await env.DB.prepare("SELECT COUNT(*) AS n FROM login_codes WHERE sender = ? AND created_at > ?").bind(sender, now - 3600000).first();
  if (forEmail.n >= CODES_PER_EMAIL || fromSender.n >= CODES_PER_SENDER) return json(429, { error: "too many" });
  const code = randomCode();
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM, to: [email], reply_to: REPLY_TO,
      subject: "Your KillSheet code: " + code,
      text: "Your KillSheet sign-in code is " + code + ".\n\nType it into KillSheet to sign in. It works for " + CODE_MINUTES + " minutes.\n\nIf you didn't ask for this, you can ignore this email.",
    }),
  });
  if (!sent.ok) return json(502, { error: "couldn't send" });
  await env.DB.prepare("DELETE FROM login_codes WHERE expires_at < ?").bind(now - 86400000).run();
  await env.DB.prepare("INSERT INTO login_codes (email, code_hash, sender, created_at, expires_at) VALUES (?, ?, ?, ?, ?)").bind(email, await sha(email + "|" + code), sender, now, now + CODE_MINUTES * 60000).run();
  return json(200, { ok: true });
}

// POST /api/auth/email/verify { email, code }: the newest code for that email, with a limited number of tries.
export async function verifyEmail(request, env, now = Date.now()) {
  if (!env.DB) return json(503, { error: "not set up" });
  const { body } = await readJson(request, 2000);
  const email = normalEmail(body && body.email);
  const code = body && typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";
  if (!email || code.length !== 6) return json(400, { error: "wrong code" });
  await setUpAccounts(env.DB);
  const row = await env.DB.prepare("SELECT id, code_hash, tries, expires_at FROM login_codes WHERE email = ? ORDER BY id DESC LIMIT 1").bind(email).first();
  if (!row || row.expires_at <= now || row.tries >= CODE_TRIES) return json(400, { error: "expired" });
  if (row.code_hash !== await sha(email + "|" + code)) {
    await env.DB.prepare("UPDATE login_codes SET tries = tries + 1 WHERE id = ?").bind(row.id).run();
    return json(400, { error: row.tries + 1 >= CODE_TRIES ? "expired" : "wrong code" });
  }
  await env.DB.prepare("DELETE FROM login_codes WHERE email = ?").bind(email).run();
  const user = await userForEmail(env, email, now);
  return json(200, { user: { email: user.email } }, [await newSession(env, user.id, now)]);
}

// GET /api/auth/google/start: off to Google's sign-in page. The state in the cookie must come back, so only a sign-in
// started from this browser can finish in it.
export async function googleStart(request, env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return redirect("/?signin=failed");
  const state = randomHex(16);
  const q = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: GOOGLE_REDIRECT, response_type: "code", scope: "openid email", state, prompt: "select_account" });
  return redirect("https://accounts.google.com/o/oauth2/v2/auth?" + q, [stateCookie(state, 600)]);
}

// GET /api/auth/google/callback?code&state: Google sends the player back here.
export async function googleCallback(request, env, now = Date.now()) {
  const clear = stateCookie("", 0);
  const failed = () => redirect("/?signin=failed", [clear]);
  if (!env.DB || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return failed();
  const url = new URL(request.url);
  const state = url.searchParams.get("state") || "", code = url.searchParams.get("code") || "";
  if (!code || !state || state !== cookieOf(request, "ks_gstate")) return failed();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: GOOGLE_REDIRECT, grant_type: "authorization_code" }).toString(),
  });
  if (!res.ok) return failed();
  let claims;
  try {
    const part = (await res.json()).id_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    claims = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(part), c => c.charCodeAt(0))));
  } catch (e) { return failed(); }
  const email = normalEmail(claims.email);
  if (!email || !claims.sub || claims.email_verified !== true || claims.aud !== env.GOOGLE_CLIENT_ID) return failed();
  await setUpAccounts(env.DB);
  const bySub = await env.DB.prepare("SELECT id, email, google_sub FROM users WHERE google_sub = ?").bind(claims.sub).first();
  const user = bySub || await userForEmail(env, email, now);
  if (!bySub) await env.DB.prepare("UPDATE users SET google_sub = ? WHERE id = ?").bind(claims.sub, user.id).run();
  return redirect("/?signedin=1", [clear, await newSession(env, user.id, now)]);
}

// GET /api/account: who's signed in.
export async function getAccount(request, env, now = Date.now()) {
  if (!env.DB) return json(503, { error: "not set up" });
  await setUpAccounts(env.DB);
  const user = await userForRequest(request, env, now);
  return user ? json(200, { user: { email: user.email } }) : json(401, { error: "signed out" });
}

// POST /api/auth/signout
export async function signOut(request, env) {
  if (env.DB) {
    await setUpAccounts(env.DB);
    const token = cookieOf(request, "ks_session");
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha(token)).run();
  }
  return json(200, { ok: true }, [clearSession]);
}

// DELETE /api/account { confirm: "DELETE" }: the account, its sessions, sign-in codes and backup, all gone.
export async function deleteAccount(request, env, now = Date.now()) {
  if (!env.DB) return json(503, { error: "not set up" });
  await setUpAccounts(env.DB);
  const user = await userForRequest(request, env, now);
  if (!user) return json(401, { error: "signed out" });
  const { body } = await readJson(request, 2000);
  if (!body || body.confirm !== "DELETE") return json(400, { error: "not confirmed" });
  await env.DB.batch([
    env.DB.prepare("DELETE FROM user_data WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id),
    env.DB.prepare("DELETE FROM login_codes WHERE email = ?").bind(user.email),
    env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id),
  ]);
  return json(200, { ok: true }, [clearSession]);
}

// GET /api/sync: this account's backup and its revision (0 before the first one).
export async function getSync(request, env, now = Date.now()) {
  if (!env.DB) return json(503, { error: "not set up" });
  await setUpAccounts(env.DB);
  const user = await userForRequest(request, env, now);
  if (!user) return json(401, { error: "signed out" });
  const row = await env.DB.prepare("SELECT data, rev FROM user_data WHERE user_id = ?").bind(user.id).first();
  return json(200, row ? { data: JSON.parse(row.data), rev: row.rev } : { data: null, rev: 0 });
}

// PUT /api/sync { rev, data }: saved only if rev is still the latest. Otherwise 409, and the app merges and tries again,
// so two devices can't overwrite each other. A copy at least a day old is kept beside it, for recovery by hand.
export async function putSync(request, env, now = Date.now()) {
  if (!env.DB) return json(503, { error: "not set up" });
  await setUpAccounts(env.DB);
  const user = await userForRequest(request, env, now);
  if (!user) return json(401, { error: "signed out" });
  const { body, tooBig } = await readJson(request, MAX_SYNC + 100);
  if (tooBig) return json(413, { error: "too big" });
  if (!body || !Number.isInteger(body.rev) || !body.data || typeof body.data !== "object" || Array.isArray(body.data)) return json(400, { error: "bad backup" });
  const data = JSON.stringify(body.data);
  if (data.length > MAX_SYNC) return json(413, { error: "too big" });
  const next = body.rev + 1;
  let changed;
  if (body.rev === 0) {
    changed = await env.DB.prepare("INSERT OR IGNORE INTO user_data (user_id, data, rev, updated_at) VALUES (?, ?, 1, ?)").bind(user.id, data, now).run();
  } else {
    changed = await env.DB.prepare(`UPDATE user_data SET
        prev_data = CASE WHEN COALESCE(prev_at, 0) < ? THEN data ELSE prev_data END,
        prev_at = CASE WHEN COALESCE(prev_at, 0) < ? THEN updated_at ELSE prev_at END,
        data = ?, rev = ?, updated_at = ?
      WHERE user_id = ? AND rev = ?`).bind(now - PREV_EVERY, now - PREV_EVERY, data, next, now, user.id, body.rev).run();
  }
  if (!changed.meta || !changed.meta.changes) return json(409, { error: "changed elsewhere" });
  return json(200, { rev: next });
}
