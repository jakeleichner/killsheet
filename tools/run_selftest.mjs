// Runs the in-app self-test (?selftest) in headless Chrome and fails if any step fails.
// Used by .github/workflows/selftest.yml on every push; runs locally too (needs Node 22+ and Google Chrome).
//
//   node tools/run_selftest.mjs
//
// Three runs: the page as written (killsheet.html) at phone and desktop width, then the upload build
// (deploy/, made by tools/build_deploy.py) at phone width. Each serves its files on a local port, opens the page
// in Chrome through the DevTools protocol, waits for window.__ksSelfTest and prints every step.
// No npm packages: Node's own http server and WebSocket, and the Chrome already installed.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333; // DevTools
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webmanifest": "application/manifest+json", ".json": "application/json" };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// A static server: "/" is the page, anything else comes from the folder.
function serve(page, folder) {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split("?")[0]);
    const file = p === "/" || p === "/index.html" ? page : path.join(folder, p);
    if (!file.startsWith(folder) && file !== page) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

// One DevTools connection to a page.
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  let id = 0;
  const waiting = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((ok, fail) => {
    const n = ++id;
    waiting.set(n, (m) => m.error ? fail(new Error(method + ": " + m.error.message)) : ok(m.result));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  return { send, close: () => ws.close() };
}

async function run(label, url, width, height, mobile, page) {
  console.log(`\n== ${label} (${width}x${height}) ==`);
  await page.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile });
  await page.send("Page.navigate", { url: url + "?selftest&v=" + Date.now() });
  const started = Date.now();
  for (;;) {
    await sleep(2000);
    const r = await page.send("Runtime.evaluate", { expression: "window.__ksSelfTest ? JSON.stringify(window.__ksSelfTest) : null", returnByValue: true });
    const v = r.result && r.result.value;
    if (v) {
      const t = JSON.parse(v);
      t.results.forEach(x => console.log(`${x.ok ? "PASS" : "FAIL"}  ${x.name}${x.note ? ": " + x.note : ""} (${(x.ms / 1000).toFixed(1)}s)`));
      console.log(`${t.passed} of ${t.passed + t.failed} passed in ${Math.round((Date.now() - started) / 1000)}s`);
      return t.failed === 0;
    }
    if (Date.now() - started > 10 * 60 * 1000) { console.log("FAIL  the self-test didn't finish in 10 minutes"); return false; }
  }
}

async function main() {
  if (!fs.existsSync(CHROME)) { console.error("Google Chrome not found at " + CHROME + " (set CHROME to its path)"); process.exit(1); }
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ks-chrome-"));
  const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + PORT, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--user-data-dir=" + profile, "about:blank"], { stdio: "ignore" });
  let ok = true;
  const servers = [];
  try {
    let target = null;
    for (let i = 0; i < 50 && !target; i++) {
      await sleep(200);
      try { target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json(); } catch (e) { /* Chrome still starting */ }
    }
    if (!target) throw new Error("Chrome didn't start");
    const page = await connect(target.webSocketDebuggerUrl);
    await page.send("Page.enable");
    await page.send("Runtime.enable");

    const dev = await serve(path.join(ROOT, "killsheet.html"), ROOT); servers.push(dev);
    const devUrl = `http://127.0.0.1:${dev.address().port}/`;
    ok = await run("killsheet.html, phone", devUrl, 375, 812, true, page) && ok;
    ok = await run("killsheet.html, desktop", devUrl, 1280, 900, false, page) && ok;

    const deployDir = path.join(ROOT, "deploy");
    if (fs.existsSync(path.join(deployDir, "index.html"))) {
      const up = await serve(path.join(deployDir, "index.html"), deployDir); servers.push(up);
      ok = await run("upload build (deploy/), phone", `http://127.0.0.1:${up.address().port}/`, 375, 812, true, page) && ok;
    } else {
      console.log("\n(no deploy/ folder: run python3 tools/build_deploy.py first to test the upload build too)");
    }
    page.close();
  } catch (e) {
    console.error(e); ok = false;
  } finally {
    servers.forEach(s => s.close());
    chrome.kill();
  }
  console.log(ok ? "\nSelf-test passed." : "\nSelf-test FAILED.");
  process.exit(ok ? 0 : 1);
}

main();
