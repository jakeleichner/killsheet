"""Build the deploy folder: a pre-compiled copy of killsheet.html plus the maps.

Usage: python3 tools/build_deploy.py

killsheet.html stays the source (its JSX is compiled in the browser by Babel, which is
handy for previewing edits). For the live site this compiles the JSX once, here, with
macOS's built-in JavaScriptCore (`jsc`) and the vendored tools/vendor/babel.min.js, then
writes deploy/index.html without the 2.8 MB Babel download or the in-browser compile.
"""
import os
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
            sys.exit("Compile failed:\n" + (res.stderr or res.stdout)[-3000:])
        return res.stdout


def main():
    started = time.time()
    html = open(os.path.join(ROOT, "killsheet.html")).read()
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
    shutil.rmtree(os.path.join(deploy, "maps"), ignore_errors=True)
    shutil.copytree(os.path.join(ROOT, "maps"), os.path.join(deploy, "maps"))
    print("Built deploy/index.html (%d KB) and deploy/maps in %.1fs." % (len(out.encode()) // 1024, time.time() - started))


if __name__ == "__main__":
    main()
