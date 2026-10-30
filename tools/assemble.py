"""Join src/ into killsheet.html.

The app's source lives in src/, one file per area (src/00-head.html, src/01-setup.jsx, ...). This joins them, in
file-name order, into killsheet.html, which everything else uses as before: the preview, tools/check.py, the
self-test and tools/build_deploy.py. Edit the files in src/, never killsheet.html, then run:

    python3 tools/assemble.py          # writes killsheet.html
    python3 tools/assemble.py --check  # exits 1 if killsheet.html doesn't match src/ (used by tools/check.py)

The files are joined exactly as they are, so a new file only needs a name that sorts where it belongs.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "killsheet.html")


def parts():
    """The src files in the order they're joined."""
    return sorted(n for n in os.listdir(SRC) if not n.startswith(".") and n.endswith((".html", ".jsx")))


def joined():
    return "".join(open(os.path.join(SRC, n), encoding="utf-8").read() for n in parts())


def line_map():
    """[(first line in killsheet.html, src file name)], for turning a killsheet.html line into src/<file>:<line>."""
    out, line = [], 1
    for n in parts():
        out.append((line, n))
        line += open(os.path.join(SRC, n), encoding="utf-8").read().count("\n")
    return out


def where(line):
    """'src/13-builder.jsx:120' for line 2840 of killsheet.html."""
    name, first = None, 1
    for start, n in line_map():
        if start <= line:
            name, first = n, start
    return "src/%s:%d" % (name, line - first + 1) if name else "line %d" % line


def main():
    text = joined()
    if "--check" in sys.argv:
        current = open(OUT, encoding="utf-8").read() if os.path.exists(OUT) else ""
        if current != text:
            print("killsheet.html doesn't match src/. Edit src/, then run: python3 tools/assemble.py")
            sys.exit(1)
        print("killsheet.html matches src/ (%d files)." % len(parts()))
        return
    open(OUT, "w", encoding="utf-8").write(text)
    print("Wrote killsheet.html from %d files in src/ (%d lines)." % (len(parts()), text.count("\n")))


if __name__ == "__main__":
    main()
