"""Runs ?selftest on the local preview in headless Chrome, without the browser pane (which runs slowly when hidden).

Usage: python3 tools/selftest_local.py tools                   (1280, 375 and 320 px)
       python3 tools/selftest_local.py tools "[375,812,true]"  (one size: width, height, phone)
       KS_URL=http://localhost:3456/live/ python3 tools/selftest_local.py tools   (the upload build)

Needs the preview server on port 3456 (CLAUDE.md, Previewing changes). Uses the DevTools client in tools/measure_speed.py,
so no Node is needed on this Mac; GitHub's run (tools/run_selftest.mjs) stays the check before publishing.
"""
import json, os, subprocess, sys, tempfile, time, urllib.request
sys.path.insert(0, sys.argv[1])
from measure_speed import Page, CHROME
PORT = 9337
URL = os.environ.get("KS_URL", "http://localhost:3456/") + "?selftest&v=" + str(int(time.time()))
sizes = [(1280, 900, False), (375, 812, True), (320, 640, True)] if len(sys.argv) < 3 else [tuple(json.loads(x)) for x in sys.argv[2:]]
prof = tempfile.mkdtemp(prefix="ks-st-")
chrome = subprocess.Popen([CHROME, "--headless=new", "--remote-debugging-port=%d" % PORT, "--no-first-run", "--user-data-dir=" + prof, "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
ok_all = True
try:
    target = None
    for _ in range(50):
        time.sleep(0.2)
        try:
            target = json.loads(urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:%d/json/new?about:blank" % PORT, method="PUT")).read()); break
        except Exception: pass
    page = Page(target["webSocketDebuggerUrl"])
    page.send("Page.enable"); page.send("Runtime.enable")
    for w, h, mobile in sizes:
        page.send("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 2, "mobile": mobile})
        page.send("Emulation.setTouchEmulationEnabled", {"enabled": mobile, "maxTouchPoints": 5 if mobile else 1})
        page.send("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "no-preference"}]})
        page.send("Page.navigate", {"url": URL + "-" + str(w)})
        start = time.time(); res = None
        while time.time() - start < 600:
            time.sleep(2)
            res = page.evaluate("window.__ksSelfTest ? JSON.stringify(window.__ksSelfTest) : null")
            if res: break
        if not res:
            print("%d: didn't finish" % w); ok_all = False; continue
        t = json.loads(res)
        fails = [r for r in t["results"] if not r["ok"]]
        print("%dpx: %d of %d passed in %ds" % (w, t["passed"], t["passed"] + t["failed"], time.time() - start))
        for r in fails: print("   FAIL %s: %s" % (r["name"], r["note"][:300]))
        ok_all = ok_all and not fails
finally:
    chrome.kill()
print("ALL PASSED" if ok_all else "SOME FAILED")
