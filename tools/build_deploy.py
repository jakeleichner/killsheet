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
    open(os.path.join(deploy, "index.html"), "w").write(out)
    for folder in ("maps", "icons"):
        shutil.rmtree(os.path.join(deploy, folder), ignore_errors=True)
        shutil.copytree(os.path.join(ROOT, folder), os.path.join(deploy, folder))
    shutil.copy(os.path.join(ROOT, "manifest.webmanifest"), os.path.join(deploy, "manifest.webmanifest"))
    write_service_worker(deploy, out)
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


def write_service_worker(deploy, html):
    """deploy/sw.js from tools/sw.js: the offline file list plus a version that changes with every build."""
    local = ["./", "manifest.webmanifest"]
    for folder in ("icons", "maps"):
        local += [folder + "/" + n for n in sorted(os.listdir(os.path.join(deploy, folder))) if not n.startswith(".")]
    remote = re.findall(r'<script[^>]*src="(https://[^"]+)"', html)
    fonts = sorted(set(re.findall(r'href="(https://fonts\.googleapis\.com/[^"]+)"', html)))
    version = hashlib.sha256((html + json.dumps(local)).encode()).hexdigest()[:10]
    sw = open(os.path.join(ROOT, "tools", "sw.js")).read()
    sw = sw.replace("__VERSION__", version).replace("__LOCAL__", json.dumps(local)).replace("__REMOTE__", json.dumps(remote)).replace("__FONTS__", json.dumps(fonts))
    open(os.path.join(deploy, "sw.js"), "w").write(sw)


if __name__ == "__main__":
    main()
