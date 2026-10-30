"""How fast KillSheet opens on a mid-range phone: headless Chrome with a 4x slower processor and mobile data.

Usage: python3 tools/measure_speed.py [url]     (default https://killsheet.pages.dev/)

Starts Google Chrome headless, then opens the page twice: a first visit (empty cache) and a return visit, each
on a phone-sized screen with Chrome's CPU throttling (4x) and network throttling (1.6 Mbps down, 150 ms latency).
Prints when the first content showed, when the app had drawn, how much long blocking work the page did, and how
many bytes came over the network, split by where they came from. No packages: a tiny DevTools client on the
standard library.
"""
import base64
import json
import os
import socket
import struct
import subprocess
import sys
import tempfile
import time
import urllib.request

CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
PORT = 9335
URL = sys.argv[1] if len(sys.argv) > 1 else "https://killsheet.pages.dev/"
# SLOW=fonts.googleapis.com,unpkg.com holds requests to those hosts for 8 seconds (a stalling server on venue Wi-Fi).
SLOW = [h for h in os.environ.get("SLOW", "").split(",") if h]

# Recorded inside the page from the very start: first paint, when the app first drew into #root, long tasks.
PROBE = """
window.__perf = { long: 0, longCount: 0, drawn: null };
new PerformanceObserver(l => l.getEntries().forEach(e => { window.__perf.long += e.duration; window.__perf.longCount++; })).observe({ type: "longtask", buffered: true });
new MutationObserver((m, o) => { const r = document.getElementById("root"); if (r && r.children.length && !window.__perf.drawn) { window.__perf.drawn = performance.now(); o.disconnect(); } }).observe(document, { childList: true, subtree: true });
"""


class Page:
    """A minimal DevTools WebSocket client: send a command, read until its reply, keep events."""

    def __init__(self, ws_url):
        host, path = ws_url[len("ws://"):].split("/", 1)
        h, p = host.split(":")
        self.s = socket.create_connection((h, int(p)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall(("GET /%s HTTP/1.1\r\nHost: %s\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: %s\r\nSec-WebSocket-Version: 13\r\n\r\n" % (path, host, key)).encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        self.rest = buf.split(b"\r\n\r\n", 1)[1]
        self.id = 0
        self.events = []

    def _read(self, n):
        while len(self.rest) < n:
            self.rest += self.s.recv(65536)
        out, self.rest = self.rest[:n], self.rest[n:]
        return out

    def _frame(self):
        b1, b2 = self._read(2)
        n = b2 & 127
        if n == 126:
            n = struct.unpack(">H", self._read(2))[0]
        elif n == 127:
            n = struct.unpack(">Q", self._read(8))[0]
        data = self._read(n)
        return b1 & 15, data

    def send(self, method, params=None):
        self.id += 1
        msg = json.dumps({"id": self.id, "method": method, "params": params or {}}).encode()
        mask = os.urandom(4)
        head = bytes([0x81])
        n = len(msg)
        head += bytes([0x80 | n]) if n < 126 else bytes([0x80 | 126]) + struct.pack(">H", n) if n < 65536 else bytes([0x80 | 127]) + struct.pack(">Q", n)
        self.s.sendall(head + mask + bytes(c ^ mask[i % 4] for i, c in enumerate(msg)))
        want = self.id
        while True:
            op, data = self._frame()
            if op != 1:
                continue
            m = json.loads(data)
            if m.get("id") == want:
                if "error" in m:
                    raise RuntimeError(method + ": " + m["error"]["message"])
                return m.get("result", {})
            self.events.append(m)

    def evaluate(self, expr):
        r = self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        return r.get("result", {}).get("value")


def visit(page, label, cold):
    page.events = []
    page.send("Network.setCacheDisabled", {"cacheDisabled": cold})
    if cold:
        page.send("Network.clearBrowserCache")
        page.send("Storage.clearDataForOrigin", {"origin": "/".join(URL.split("/")[:3]), "storageTypes": "all"})  # and the offline copy
    started = time.time()
    page.send("Page.navigate", {"url": URL})
    perf = None
    held = {}
    while time.time() - started < 90:
        time.sleep(0.5)
        # Let held requests go after 8 seconds.
        for e in page.events:
            if e.get("method") == "Fetch.requestPaused" and e["params"]["requestId"] not in held:
                held[e["params"]["requestId"]] = time.time()
        for rid, t in list(held.items()):
            if t and time.time() - t > 8:
                page.send("Fetch.continueRequest", {"requestId": rid}); held[rid] = 0
        perf = page.evaluate("window.__perf && window.__perf.drawn && document.readyState === 'complete' ? JSON.stringify({ perf: window.__perf, nav: performance.getEntriesByType('navigation')[0].toJSON(), fcp: (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime }) : null")
        if perf:
            break
    time.sleep(3)  # let late requests (fonts, the offline cache filling) land in the byte count
    page.send("Runtime.evaluate", {"expression": "1"})  # drain events
    if not perf:
        print("%-12s didn't finish in 90s" % label)
        return
    p = json.loads(perf)
    by = {}
    urls = {}
    for e in page.events:
        if e.get("method") == "Network.responseReceived":
            urls[e["params"]["requestId"]] = e["params"]["response"]["url"]
        if e.get("method") == "Network.loadingFinished":
            u = urls.get(e["params"]["requestId"], "?")
            host = u.split("/")[2] if "://" in u else "?"
            kind = "maps" if "/maps/" in u else host
            by[kind] = by.get(kind, 0) + e["params"]["encodedDataLength"]
    total = sum(by.values())
    print("%-12s first content %5.1fs   app drawn %5.1fs   page loaded %5.1fs   blocking work %4.1fs (%d long tasks)   %d KB over the network" % (
        label, (p["fcp"] or 0) / 1000, p["perf"]["drawn"] / 1000, p["nav"]["loadEventEnd"] / 1000, p["perf"]["long"] / 1000, p["perf"]["longCount"], total // 1024))
    for k, v in sorted(by.items(), key=lambda kv: -kv[1]):
        if v > 2048:
            print("             %-40s %6d KB" % (k, v // 1024))


def main():
    profile = tempfile.mkdtemp(prefix="ks-speed-")
    chrome = subprocess.Popen([CHROME, "--headless=new", "--remote-debugging-port=%d" % PORT, "--no-first-run", "--no-default-browser-check", "--user-data-dir=" + profile, "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        target = None
        for _ in range(50):
            time.sleep(0.2)
            try:
                req = urllib.request.Request("http://127.0.0.1:%d/json/new?about:blank" % PORT, method="PUT")
                target = json.loads(urllib.request.urlopen(req).read())
                break
            except Exception:
                pass
        page = Page(target["webSocketDebuggerUrl"])
        for m in ("Page.enable", "Network.enable", "Runtime.enable"):
            page.send(m)
        page.send("Page.addScriptToEvaluateOnNewDocument", {"source": PROBE})
        if SLOW:
            page.send("Fetch.enable", {"patterns": [{"urlPattern": "*://" + h + "/*"} for h in SLOW]})
        page.send("Emulation.setDeviceMetricsOverride", {"width": 375, "height": 812, "deviceScaleFactor": 3, "mobile": True})
        page.send("Emulation.setCPUThrottlingRate", {"rate": 4})
        page.send("Network.emulateNetworkConditions", {"offline": False, "latency": 150, "downloadThroughput": 1.6 * 1024 * 1024 / 8, "uploadThroughput": 750 * 1024 / 8})
        print("%s on a phone-sized screen, 4x slower processor, 1.6 Mbps mobile data%s:" % (URL, ", " + " and ".join(SLOW) + " stalling 8s" if SLOW else ""))
        visit(page, "First visit", True)
        visit(page, "Return visit", False)
    finally:
        chrome.kill()


if __name__ == "__main__":
    main()
