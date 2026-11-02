// Tests the server code in server/ (what runs at killsheet.app/api) against a real SQLite database, the same engine
// as Cloudflare D1. Runs on every push in .github/workflows/selftest.yml, before anything is published.
//
//   node --experimental-sqlite tools/test_api.mjs        (Node 22+)
import { DatabaseSync } from "node:sqlite";
import { postFeedback, listFeedback, deleteFeedback } from "../server/feedback.js";

// A D1 lookalike over node:sqlite: prepare(sql).bind(...).run() / .all() / .first().
function fakeD1() {
  const db = new DatabaseSync(":memory:");
  const prepare = (sql, args = []) => ({
    bind: (...a) => prepare(sql, a),
    run: async () => { const r = db.prepare(sql).run(...args); return { meta: { changes: r.changes, last_row_id: Number(r.lastInsertRowid) } }; },
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    first: async () => db.prepare(sql).get(...args) || null,
  });
  return { prepare };
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

console.log(failed ? "\n" + failed + " API test(s) FAILED." : "\nAPI tests passed.");
process.exit(failed ? 1 : 0);
