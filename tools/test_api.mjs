// Tests the server code in server/ (what runs at killsheet.app/api) against a real SQLite database, the same engine
// as Cloudflare D1. Runs on every push in .github/workflows/selftest.yml, before anything is published.
//
//   node --experimental-sqlite tools/test_api.mjs        (Node 22+)
import { DatabaseSync } from "node:sqlite";
import { postFeedback, listFeedback, deleteFeedback } from "../server/feedback.js";
import { startEmail, verifyEmail, googleStart, googleCallback, getAccount, signOut, deleteAccount, getSync, putSync } from "../server/account.js";

// A D1 lookalike over node:sqlite: prepare(sql).bind(...).run() / .all() / .first().
function fakeD1() {
  const db = new DatabaseSync(":memory:");
  const prepare = (sql, args = []) => ({
    bind: (...a) => prepare(sql, a),
    run: async () => { const r = db.prepare(sql).run(...args); return { meta: { changes: r.changes, last_row_id: Number(r.lastInsertRowid) } }; },
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    first: async () => db.prepare(sql).get(...args) || null,
  });
  return { prepare, batch: async (stmts) => { for (const st of stmts) await st.run(); } };
}

let failed = 0;
const check = (ok, what) => { console.log((ok ? "PASS  " : "FAIL  ") + what); if (!ok) failed++; };
const post = (env, body, ip = "1.2.3.4", now) => postFeedback(new Request("https://killsheet.app/api/feedback", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body), headers: { "Content-Type": "application/json", "CF-Connecting-IP": ip } }), env, now);
const admin = (env, method, key, query = "") => (method === "GET" ? listFeedback : deleteFeedback)(new Request("https://killsheet.app/api/admin/feedback" + query, { method, headers: key ? { Authorization: "Bearer " + key } : {} }), env);

const env = { DB: fakeD1(), ADMIN_KEY: "correct horse battery staple" };

// Not set up yet: no database bound, or no admin password.
check((await post({}, { message: "hi" })).status === 503, "no database: 503");
check((await admin({ DB: env.DB }, "GET", "x")).status === 503, "no admin password set: 503");

// Sending.
const ok = await post(env, { kind: "problem", message: "  The dice froze  ", contact: "me@example.com", version: "abc123", device: "iPhone · Safari", screen: "390x844", tab: "builder", error: "" });
check(ok.status === 200 && (await ok.json()).ok === true, "a message is accepted");
check((await post(env, { message: "   " })).status === 400, "an empty message is refused");
check((await post(env, { message: "x".repeat(2001) })).status === 400, "a message over 2000 characters is refused");
check((await post(env, "not json")).status === 400, "a body that isn't JSON is refused");
check((await post(env, "x".repeat(20001))).status === 413, "a body over 20 KB is refused");
const robot = await post(env, { message: "buy now", website: "spam.example" });
check(robot.status === 200, "a filled-in hidden field is told it worked");
check((await post(env, { kind: "nonsense", message: "odd kind", contact: "c".repeat(500) }, "5.6.7.8")).status === 200, "an unknown kind and a long contact are still accepted");

// Reading (the owner).
check((await admin(env, "GET", "wrong")).status === 401, "a wrong password can't read messages");
check((await admin(env, "GET", "")).status === 401, "no password can't read messages");
const list = await (await admin(env, "GET", env.ADMIN_KEY)).json();
check(Array.isArray(list.items) && list.items.length === 2, "the owner sees the two real messages (not the robot's): " + (list.items || []).length);
const [odd, first] = list.items;
check(first.message === "The dice froze" && first.kind === "problem" && first.version === "abc123" && first.device === "iPhone · Safari", "the message is stored trimmed, with its details");
check(odd.kind === "other" && odd.contact.length === 200, "an unknown kind becomes other; contact is cut to 200 characters");
check(!("sender" in first), "the sender code isn't sent to the admin page");

// Too many from one person in an hour.
const t0 = new Date("2026-11-02T10:00:00Z");
const burst = [];
for (let i = 0; i < 6; i++) burst.push((await post(env, { message: "again " + i }, "9.9.9.9", new Date(t0.getTime() + i * 1000))).status);
check(burst.slice(0, 5).every(s => s === 200) && burst[5] === 429, "the sixth message in an hour is refused: " + burst.join(","));
check((await post(env, { message: "an hour later" }, "9.9.9.9", new Date(t0.getTime() + 3601 * 1000))).status === 200, "an hour later it's accepted again");

// Deleting (the owner).
check((await admin(env, "DELETE", "wrong", "?id=" + first.id)).status === 401, "a wrong password can't delete");
check((await admin(env, "DELETE", env.ADMIN_KEY, "?id=abc")).status === 400, "a delete without a number is refused");
check((await admin(env, "DELETE", env.ADMIN_KEY, "?id=" + first.id)).status === 200, "the owner can delete a message");
const after = await (await admin(env, "GET", env.ADMIN_KEY)).json();
check(!after.items.some(m => m.id === first.id), "the deleted message is gone");

// ── Accounts ──
const realFetch = globalThis.fetch;
const mails = [];
let resendOk = true, googleClaims = null;
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
globalThis.fetch = async (url, opts = {}) => {
  if (String(url).startsWith("https://api.resend.com/")) { mails.push({ auth: opts.headers.Authorization, ...JSON.parse(opts.body) }); return new Response("{}", { status: resendOk ? 200 : 500 }); }
  if (String(url).startsWith("https://oauth2.googleapis.com/token")) return googleClaims ? new Response(JSON.stringify({ id_token: "x." + b64u(googleClaims) + ".y" }), { status: 200 }) : new Response("{}", { status: 400 });
  return realFetch(url, opts);
};
const acct = { DB: fakeD1(), RESEND_API_KEY: "re_test", GOOGLE_CLIENT_ID: "client-1", GOOGLE_CLIENT_SECRET: "shh" };
const site = "https://killsheet.app";
const req = (path, method, body, cookie, ip = "1.1.1.1") => new Request(site + path, { method, headers: { "Content-Type": "application/json", "CF-Connecting-IP": ip, ...(cookie ? { Cookie: cookie } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
const cookieFrom = (res, name) => { const hit = (res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get("set-cookie") || ""]).find(c => c.startsWith(name + "=")); return hit || ""; };
const pair = (setCookie) => setCookie.split(";")[0];
const codeIn = (mail) => (mail.subject.match(/(\d{6})/) || [])[1];
const signIn = async (email, ip) => { await startEmail(req("/api/auth/email/start", "POST", { email }, null, ip), acct); return pair(cookieFrom(await verifyEmail(req("/api/auth/email/verify", "POST", { email, code: codeIn(mails[mails.length - 1]) }), acct), "ks_session")); };

check((await startEmail(req("/x", "POST", { email: "a@b.co" }), { DB: acct.DB })).status === 503, "no email key: 503");
check((await getAccount(req("/x", "GET"), {})).status === 503, "no database: account 503");
check((await startEmail(req("/x", "POST", { email: "not an email" }), acct)).status === 400, "a bad email is refused");
check((await getAccount(req("/x", "GET"), acct)).status === 401, "signed out without a cookie");
check((await getAccount(req("/x", "GET", undefined, "ks_session=made-up"), acct)).status === 401, "a made-up session is refused");

const started = await startEmail(req("/x", "POST", { email: "  Player@Example.COM " }), acct);
const mail = mails[mails.length - 1];
check(started.status === 200 && mail.to[0] === "player@example.com" && mail.auth === "Bearer re_test" && /mail\.killsheet\.app/.test(mail.from), "a code is emailed to the trimmed, lowercase address");
check(/^\d{6}$/.test(codeIn(mail)) && mail.text.includes(codeIn(mail)), "the email holds a 6-digit code");
const wrongCode = codeIn(mail) === "000000" ? "111111" : "000000";
const bad = await verifyEmail(req("/x", "POST", { email: "player@example.com", code: wrongCode }), acct);
check(bad.status === 400 && (await bad.json()).error === "wrong code" && !cookieFrom(bad, "ks_session"), "a wrong code is refused, with no session");
const good = await verifyEmail(req("/x", "POST", { email: "Player@example.com", code: codeIn(mail) }), acct);
const setC = cookieFrom(good, "ks_session");
check(good.status === 200 && (await good.json()).user.email === "player@example.com", "the right code signs in");
check(/HttpOnly/.test(setC) && /Secure/.test(setC) && /SameSite=Lax/.test(setC), "the session cookie is HttpOnly, Secure and SameSite");
const session = pair(setC);
check((await (await getAccount(req("/x", "GET", undefined, session), acct)).json()).user.email === "player@example.com", "the session finds the account");
check((await verifyEmail(req("/x", "POST", { email: "player@example.com", code: codeIn(mail) }), acct)).status === 400, "a code works only once");

// Too many tries, expiry, too many emails, and a failed send.
await startEmail(req("/x", "POST", { email: "tries@example.com" }, null, "2.2.2.2"), acct);
const triesCode = codeIn(mails[mails.length - 1]), nope = triesCode === "000000" ? "111111" : "000000";
for (let i = 0; i < 5; i++) await verifyEmail(req("/x", "POST", { email: "tries@example.com", code: nope }), acct);
check((await verifyEmail(req("/x", "POST", { email: "tries@example.com", code: triesCode }), acct)).status === 400, "after 5 wrong tries even the right code fails");
const t0a = Date.now();
await startEmail(req("/x", "POST", { email: "late@example.com" }, null, "3.3.3.3"), acct, t0a);
check((await verifyEmail(req("/x", "POST", { email: "late@example.com", code: codeIn(mails[mails.length - 1]) }), acct, t0a + 16 * 60000)).status === 400, "a code expires after 15 minutes");
const sends = [];
for (let i = 0; i < 4; i++) sends.push((await startEmail(req("/x", "POST", { email: "many@example.com" }, null, "4.4.4." + i), acct)).status);
check(sends.join() === "200,200,200,429", "a fourth code in 15 minutes is refused: " + sends.join());
const ipSends = [];
for (let i = 0; i < 11; i++) ipSends.push((await startEmail(req("/x", "POST", { email: "ip" + i + "@example.com" }, null, "5.5.5.5"), acct)).status);
check(ipSends.slice(0, 10).every(x => x === 200) && ipSends[10] === 429, "an eleventh code in an hour from one address is refused");
resendOk = false;
check((await startEmail(req("/x", "POST", { email: "down@example.com" }, null, "6.6.6.6"), acct)).status === 502, "a failed send says so");
resendOk = true;

// Google: same email, same account.
const gs = await googleStart(req("/api/auth/google/start", "GET"), acct);
const gLoc = new URL(gs.headers.get("location")), gState = gLoc.searchParams.get("state");
check(gs.status === 302 && gLoc.origin === "https://accounts.google.com" && gLoc.searchParams.get("redirect_uri") === site + "/api/auth/google/callback" && !!gState && cookieFrom(gs, "ks_gstate").includes(gState), "Google sign-in starts with a state cookie");
check(!gs.headers.get("location").includes("shh"), "the Google secret isn't in the address");
const gCall = (state, cookieState) => googleCallback(req("/api/auth/google/callback?code=abc&state=" + state, "GET", undefined, cookieState ? "ks_gstate=" + cookieState : null), acct);
googleClaims = { sub: "g-1", email: "player@example.com", email_verified: true, aud: "client-1" };
check((await gCall(gState, "other")).headers.get("location") === "/?signin=failed", "a state that doesn't match fails");
check((await gCall(gState, null)).headers.get("location") === "/?signin=failed", "no state cookie fails");
const gOk = await gCall(gState, gState);
check(gOk.headers.get("location") === "/?signedin=1" && !!cookieFrom(gOk, "ks_session"), "Google sign-in finishes with a session");
const gSession = pair(cookieFrom(gOk, "ks_session"));
check((await (await getAccount(req("/x", "GET", undefined, gSession), acct)).json()).user.email === "player@example.com", "Google with the same email is the same account");
googleClaims = { sub: "g-1", email: "changed@example.com", email_verified: true, aud: "client-1" };
check((await (await getAccount(req("/x", "GET", undefined, pair(cookieFrom(await gCall(gState, gState), "ks_session"))), acct)).json()).user.email === "player@example.com", "a changed Google email stays on the same account");
googleClaims = { sub: "g-2", email: "new@example.com", email_verified: false, aud: "client-1" };
check((await gCall(gState, gState)).headers.get("location") === "/?signin=failed", "an unverified Google email fails");
googleClaims = { sub: "g-2", email: "new@example.com", email_verified: true, aud: "someone-else" };
check((await gCall(gState, gState)).headers.get("location") === "/?signin=failed", "a token for another app fails");
googleClaims = null;
check((await gCall(gState, gState)).headers.get("location") === "/?signin=failed", "a failed Google exchange fails");

// Cloud backup: conflicts, other accounts, size.
check((await getSync(req("/x", "GET"), acct)).status === 401, "backup needs a session");
check((await putSync(req("/x", "PUT", { rev: 0, data: {} }), acct)).status === 401, "saving a backup needs a session");
const firstSync = await (await getSync(req("/x", "GET", undefined, session), acct)).json();
check(firstSync.rev === 0 && firstSync.data === null, "a new account has no backup");
const v1 = await putSync(req("/x", "PUT", { rev: 0, data: { savedRosters: [{ id: "a" }] } }, session), acct);
check(v1.status === 200 && (await v1.json()).rev === 1, "the first backup saves as revision 1");
check((await putSync(req("/x", "PUT", { rev: 0, data: { savedRosters: [] } }, session), acct)).status === 409, "a second first backup conflicts instead of overwriting");
const other = await signIn("other@example.com", "7.7.7.7");
check((await (await getSync(req("/x", "GET", undefined, other), acct)).json()).data === null, "another account can't see this backup");
const t0s = Date.now();
check((await putSync(req("/x", "PUT", { rev: 1, data: { savedRosters: [{ id: "b" }] } }, gSession), acct, t0s)).status === 200, "the same account on another device saves on top");
check((await putSync(req("/x", "PUT", { rev: 1, data: { savedRosters: [{ id: "stale" }] } }, session), acct, t0s)).status === 409, "a device with an old revision gets a conflict");
const now2 = await (await getSync(req("/x", "GET", undefined, session), acct)).json();
check(now2.rev === 2 && now2.data.savedRosters[0].id === "b", "the conflict didn't overwrite the newer backup");
check((await putSync(req("/x", "PUT", { rev: 2, data: { big: "x".repeat(900001) } }, session), acct)).status === 413, "an oversized backup is refused");
for (const bodyBad of [{ rev: "2", data: {} }, { rev: 2 }, { rev: 2, data: [] }]) check((await putSync(req("/x", "PUT", bodyBad, session), acct)).status === 400, "a malformed backup is refused: " + JSON.stringify(bodyBad));

// Signing out, then deleting.
const so = await signOut(req("/x", "POST", undefined, gSession), acct);
check(so.status === 200 && /Max-Age=0/.test(cookieFrom(so, "ks_session")), "signing out clears the cookie");
check((await getAccount(req("/x", "GET", undefined, gSession), acct)).status === 401, "a signed-out session stops working");
check((await getAccount(req("/x", "GET", undefined, session), acct)).status === 200, "other devices stay signed in");
check((await deleteAccount(req("/x", "DELETE", {}, session), acct)).status === 400, "deleting needs confirming");
check((await deleteAccount(req("/x", "DELETE", { confirm: "DELETE" }), acct)).status === 401, "deleting needs a session");
const del = await deleteAccount(req("/x", "DELETE", { confirm: "DELETE" }, session), acct);
check(del.status === 200 && /Max-Age=0/.test(cookieFrom(del, "ks_session")), "the owner of an account can delete it");
check((await getAccount(req("/x", "GET", undefined, session), acct)).status === 401, "a deleted account's session stops working");
const again = await signIn("player@example.com", "8.8.8.8");
check((await (await getSync(req("/x", "GET", undefined, again), acct)).json()).data === null, "signing up again after deleting starts empty");
check((await (await getSync(req("/x", "GET", undefined, other), acct)).json()).rev === 0 && (await getAccount(req("/x", "GET", undefined, other), acct)).status === 200, "deleting one account leaves others alone");
globalThis.fetch = realFetch;

console.log(failed ? "\n" + failed + " API test(s) FAILED." : "\nAPI tests passed.");
process.exit(failed ? 1 : 0);
