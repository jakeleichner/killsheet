// Feedback from players, stored in the Cloudflare D1 database bound to the Pages project as DB.
// functions/api/feedback.js (POST, anyone) and functions/api/admin/feedback.js (GET and DELETE, the owner) call these.
// tools/test_api.mjs runs them against a real SQLite database on every push.
//
// No accounts and no IP addresses are stored. Each message keeps a short code made from the sender's IP address and
// the day, only so one person can't send more than LIMIT_PER_HOUR messages an hour; the code changes every day.

const KINDS = ["problem", "idea", "other"];
const LIMIT_PER_HOUR = 5;
const MAX_BODY = 20000;
// Field: longest it may be. Longer text is cut, except the message, which is refused (the form stops at this length).
const FIELDS = { message: 2000, contact: 200, version: 40, device: 80, screen: 20, tab: 20, error: 1000 };

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export async function setUp(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    kind TEXT NOT NULL,
    message TEXT NOT NULL,
    contact TEXT,
    version TEXT,
    device TEXT,
    screen TEXT,
    tab TEXT,
    error TEXT,
    sender TEXT NOT NULL
  )`).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS feedback_sender ON feedback (sender, created_at)").run();
}

async function hex(text) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

// POST /api/feedback with JSON { kind, message, contact?, version?, device?, screen?, tab?, error?, website? }.
// "website" is a field people can't see: a filled-in one means a spam robot, which is told it worked and ignored.
export async function postFeedback(request, env, now = new Date()) {
  if (!env.DB) return json(503, { error: "not set up" });
  const text = await request.text();
  if (text.length > MAX_BODY) return json(413, { error: "too long" });
  let b;
  try { b = JSON.parse(text); } catch (e) { return json(400, { error: "not JSON" }); }
  if (!b || typeof b !== "object") return json(400, { error: "not JSON" });
  if (b.website) return json(200, { ok: true });
  const str = (k) => typeof b[k] === "string" ? b[k].trim().slice(0, FIELDS[k]) : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!message) return json(400, { error: "empty message" });
  if (message.length > FIELDS.message) return json(400, { error: "message too long" });
  const kind = KINDS.includes(b.kind) ? b.kind : "other";
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const sender = (await hex(ip + "|" + now.toISOString().slice(0, 10))).slice(0, 16);
  await setUp(env.DB);
  const hourAgo = new Date(now.getTime() - 3600 * 1000).toISOString();
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM feedback WHERE sender = ? AND created_at > ?").bind(sender, hourAgo).first();
  if (recent && recent.n >= LIMIT_PER_HOUR) return json(429, { error: "too many" });
  await env.DB.prepare("INSERT INTO feedback (created_at, kind, message, contact, version, device, screen, tab, error, sender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(now.toISOString(), kind, message, str("contact"), str("version"), str("device"), str("screen"), str("tab"), str("error"), sender).run();
  return json(200, { ok: true });
}

// The owner's admin password (the ADMIN_KEY secret on the Pages project), sent as "Authorization: Bearer <password>".
// Compared by hash, so the time it takes doesn't hint at how much of a guess was right.
async function isOwner(request, env) {
  const got = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
  return !!(env.ADMIN_KEY && got && (await hex(got)) === (await hex(env.ADMIN_KEY)));
}

// GET /api/admin/feedback: the newest 200 messages.
export async function listFeedback(request, env) {
  if (!env.DB || !env.ADMIN_KEY) return json(503, { error: "not set up" });
  if (!(await isOwner(request, env))) return json(401, { error: "wrong password" });
  await setUp(env.DB);
  const r = await env.DB.prepare("SELECT id, created_at, kind, message, contact, version, device, screen, tab, error FROM feedback ORDER BY id DESC LIMIT 200").all();
  return json(200, { items: r.results || [] });
}

// DELETE /api/admin/feedback?id=N
export async function deleteFeedback(request, env) {
  if (!env.DB || !env.ADMIN_KEY) return json(503, { error: "not set up" });
  if (!(await isOwner(request, env))) return json(401, { error: "wrong password" });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return json(400, { error: "no id" });
  await setUp(env.DB);
  await env.DB.prepare("DELETE FROM feedback WHERE id = ?").bind(id).run();
  return json(200, { ok: true });
}
