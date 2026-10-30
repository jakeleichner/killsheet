"""Build the deploy folder: a pre-compiled copy of killsheet.html plus the maps.

Usage: python3 tools/build_deploy.py

killsheet.html stays the source (its JSX is compiled in the browser by Babel, which is
handy for previewing edits). For the live site this compiles the JSX once, here, with
macOS's built-in JavaScriptCore (`jsc`) and the vendored tools/vendor/babel.min.js, then
writes deploy/index.html without the 2.8 MB Babel download or the in-browser compile,
and copies maps/, icons/ and the manifest beside it. It also writes deploy/sw.js, the
offline service worker, from tools/sw.js.
"""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSC = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
BABEL = os.path.join(ROOT, "tools", "vendor", "babel.min.js")
OPEN_TAG = '<script type="text/babel">'
BABEL_TAG = '<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"></script>'


def compile_jsx(src):
    with tempfile.TemporaryDirectory() as tmp:
        src_path = os.path.join(tmp, "app.jsx")
        runner = os.path.join(tmp, "run.js")
        open(src_path, "w").write(src)
        open(runner, "w").write(
            'var console = (typeof console !== "undefined") ? console : {};\n'
            '["log", "debug", "info", "warn", "error", "trace"].forEach(function (k) { if (!console[k]) console[k] = function () {}; });\n'
            'load(%r);\n'
            'var out = Babel.transform(read(%r), { presets: ["react"], comments: false, sourceType: "script" }).code;\n'
            'print(out);\n' % (BABEL, src_path))
        res = subprocess.run([JSC, runner], capture_output=True, text=True)
        if res.returncode != 0 or not res.stdout.strip():
            sys.exit("Compile failed:\n" + (res.stderr or res.stdout)[:1500])  # the error message comes first; the stack after it
        return res.stdout


def main():
    started = time.time()
    sys.path.insert(0, os.path.join(ROOT, "tools"))
    import assemble
    html = open(os.path.join(ROOT, "killsheet.html")).read()
    if html != assemble.joined():
        sys.exit("killsheet.html doesn't match src/. Edit the files in src/, then run: python3 tools/assemble.py")
    assert html.count(OPEN_TAG) == 1, "expected one text/babel script"
    assert html.count(BABEL_TAG) == 1, "Babel script tag not found"
    a = html.index(OPEN_TAG) + len(OPEN_TAG)
    b = html.index("</script>", a)
    code = compile_jsx(html[a:b])
    if "</script" in code.lower():
        code = code.replace("</script", "<\\/script").replace("</SCRIPT", "<\\/SCRIPT")
    out = html[:a - len(OPEN_TAG)] + "<script>\n" + code + "\n" + html[b:]
    out = out.replace(BABEL_TAG + "\n", "").replace(BABEL_TAG, "")
    deploy = os.path.join(ROOT, "deploy")
    os.makedirs(deploy, exist_ok=True)
    for folder in ("maps", "icons"):
        shutil.rmtree(os.path.join(deploy, folder), ignore_errors=True)
        shutil.copytree(os.path.join(ROOT, folder), os.path.join(deploy, folder))
    shutil.copy(os.path.join(ROOT, "manifest.webmanifest"), os.path.join(deploy, "manifest.webmanifest"))
    # The build's version (it changes whenever the page or its files change) goes in three places: sw.js (offline
    # cache), version.json (what a running copy compares itself with, for "A new version is ready") and the page
    # itself as window.KS_VERSION, with the build date as window.KS_BUILT (online play says which phone is older).
    version = site_version(deploy, out)
    built = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    stamp = '<script>window.KS_VERSION = "%s"; window.KS_BUILT = "%s";</script>' % (version, built)
    out = out.replace("<head>", "<head>\n  " + stamp, 1)
    open(os.path.join(deploy, "index.html"), "w").write(out)
    open(os.path.join(deploy, "version.json"), "w").write(json.dumps({"version": version, "built": built}))
    write_service_worker(deploy, out, version)
    write_zip(deploy)
    print("Built deploy/index.html (%d KB), sw.js, manifest, maps and icons in %.1fs." % (len(out.encode()) // 1024, time.time() - started))
    print("Upload either the deploy/ folder or killsheet-upload.zip (the same files; the zip avoids browsers that drop files from a dragged folder).")


def write_zip(deploy):
    """killsheet-upload.zip: deploy/'s files with index.html at the top level, as Cloudflare Pages wants."""
    import zipfile
    path = os.path.join(ROOT, "killsheet-upload.zip")
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for base, dirs, files in os.walk(deploy):
            dirs[:] = sorted(d for d in dirs if not d.startswith("."))
            for n in sorted(files):
                if n.startswith("."):
                    continue
                full = os.path.join(base, n)
                z.write(full, os.path.relpath(full, deploy))


def offline_files(deploy):
    """The site's own files the service worker keeps for offline use, saved on the first visit. Maps: the drawn
    diagrams, and the photographed page only for missions without a diagram. The other photos (shown only when
    someone taps to see the original page) are saved the first time they're viewed instead, which keeps the first
    visit's download about 3.4 MB smaller."""
    local = ["./", "manifest.webmanifest"]
    local += ["icons/" + n for n in sorted(os.listdir(os.path.join(deploy, "icons"))) if not n.startswith(".")]
    maps = sorted(n for n in os.listdir(os.path.join(deploy, "maps")) if not n.startswith("."))
    local += ["maps/" + n for n in maps if n.endswith(".svg") or (n.endswith(".jpg") and n[:-4] + ".svg" not in maps)]
    return local


def site_version(deploy, html):
    """Changes whenever the compiled page or the offline file list changes (taken before the page is stamped with it)."""
    return hashlib.sha256((html + json.dumps(offline_files(deploy))).encode()).hexdigest()[:10]


def write_service_worker(deploy, html, version):
    """deploy/sw.js from tools/sw.js: the offline file list plus this build's version."""
    local = offline_files(deploy)
    remote = re.findall(r'<script[^>]*src="(https://[^"]+)"', html)
    fonts = sorted(set(re.findall(r'href="(https://fonts\.googleapis\.com/[^"]+)"', html)))
    sw = open(os.path.join(ROOT, "tools", "sw.js")).read()
    sw = sw.replace("__VERSION__", version).replace("__LOCAL__", json.dumps(local)).replace("__REMOTE__", json.dumps(remote)).replace("__FONTS__", json.dumps(fonts))
    open(os.path.join(deploy, "sw.js"), "w").write(sw)


if __name__ == "__main__":
    main()
