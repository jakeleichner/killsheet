#!/usr/bin/env python3
"""Pre-ship checks for killsheet.html.

Catches the mistakes that have broken the live app before. Run before every push:

    python3 tools/check.py            # checks killsheet.html
    python3 tools/check.py other.html # checks another copy

Exits 0 when everything passes, 1 when any check fails.

These checks read the file's layout (2-space indents, one statement per line,
components declared as `function Name(` at column 0). They do not parse
JavaScript, so a clean run does not prove the file has no syntax errors:
still load it in the preview and check the console.
"""
import re
import sys
from pathlib import Path

HOOK_CALL = re.compile(r"\b(?:React\.)?use[A-Z]\w*\(")


def indent(line):
    return len(line) - len(line.lstrip(" "))


def components(lines):
    """Yield (name, start, end) for each top-level `function Capitalized(` block."""
    for i, line in enumerate(lines):
        m = re.match(r"function ([A-Z]\w*)\(", line)
        if not m:
            continue
        for j in range(i + 1, len(lines)):
            if lines[j].startswith("}"):
                yield m.group(1), i, j
                break


def check_hooks(lines):
    """No hook calls after a component's early return (React error #310)."""
    problems = []
    for name, start, end in components(lines):
        early = None  # (line index, description) of the first early return
        i = start + 1
        while i < end and early is None:
            line = lines[i]
            if indent(line) == 2 and line.lstrip().startswith("if ("):
                if re.search(r"\breturn\b", line) and not line.rstrip().endswith("{"):
                    early = (i, "one-line `if (...) return`")
                elif line.rstrip().endswith("{"):
                    # Scan the if-block for a return at the block's own level.
                    k = i + 1
                    while k < end and not (indent(lines[k]) == 2 and lines[k].strip().startswith("}")):
                        if indent(lines[k]) == 4 and re.match(r"return\b", lines[k].strip()):
                            early = (i, "`if (...) { return }` block")
                            break
                        k += 1
            i += 1
        if early is None:
            continue
        for k in range(early[0] + 1, end):
            line = lines[k]
            if indent(line) == 2 and HOOK_CALL.search(line) and not line.strip().startswith("//"):
                problems.append(
                    f"{name}: hook on line {k + 1} comes after the early return on line {early[0] + 1} "
                    f"({early[1]}). Move it above line {early[0] + 1}."
                )
    return problems


def check_tab_icons(text):
    """Every nav tab has a TAB_ICONS entry and a content panel."""
    app = text.split("\nfunction App(", 1)
    tabs_line = re.search(r"const tabs = \[(.*)\];", app[1]) if len(app) == 2 else None
    if not tabs_line:
        return ["Couldn't find `const tabs = [...]` in App."]
    tab_ids = re.findall(r'\["(\w+)"', tabs_line.group(1))
    icons_block = re.search(r"const TAB_ICONS = \{(.*?)\n\};", text, re.S)
    if not icons_block:
        return ["Couldn't find the `const TAB_ICONS = { ... };` block."]
    icon_ids = re.findall(r"^\s*(\w+):", icons_block.group(1), re.M)
    problems = []
    for t in tab_ids:
        if t not in icon_ids:
            problems.append(f'Tab "{t}" has no TAB_ICONS entry, so its nav button will be blank.')
        if f'tab === "{t}" ? "block"' not in text:
            problems.append(f'Tab "{t}" has no content panel (`tab === "{t}" ? "block" : "none"`).')
    for t in icon_ids:
        if t not in tab_ids:
            problems.append(f'TAB_ICONS has "{t}" but there is no tab with that id (leftover?).')
    return problems


def check_storage_keys(text):
    """useLocalStorage keys are unique."""
    keys = re.findall(r'useLocalStorage\("(\w+)"', text)
    dupes = sorted({k for k in keys if keys.count(k) > 1})
    return [f'useLocalStorage key "{k}" is used {keys.count(k)} times; keys must be unique.' for k in dupes]


def check_direct_storage(lines):
    """localStorage is only touched inside useLocalStorage and the clear/snapshot/restore helpers."""
    allowed = {"useLocalStorage", "clearKillSheetStorage", "snapshotKillSheetStorage", "restoreKillSheetStorage"}
    problems = []
    current = None
    for i, line in enumerate(lines):
        m = re.match(r"(?:function|const) (\w+)", line)
        if m:
            current = m.group(1)
        if "localStorage." in line and current not in allowed and not line.strip().startswith("//"):
            problems.append(f"Line {i + 1} uses localStorage directly in {current}; go through useLocalStorage.")
    return problems


def check_print_class(text):
    """Datacard keeps the className the print system relies on."""
    return [] if 'className="datacard-print"' in text else ['Datacard lost className="datacard-print"; printing will break.']


def check_babel_script(text):
    """Exactly one in-browser JSX script, and it is closed."""
    opens = text.count('<script type="text/babel">')
    if opens != 1:
        return [f'Expected 1 <script type="text/babel"> tag, found {opens}.']
    after = text.split('<script type="text/babel">', 1)[1]
    return [] if "</script>" in after else ["The text/babel script tag is never closed."]


def check_setters(text):
    """Every setX(...) call has something that defines setX (catches leftovers after removing state)."""
    code = text.split('<script type="text/babel">', 1)[1] if '<script type="text/babel">' in text else text
    used = set(re.findall(r"\b(set[A-Z]\w*)\(", code))
    defined = set(re.findall(r"\[\w*,\s*(set[A-Z]\w*)\]", code))
    defined |= set(re.findall(r"(?:const|let|var|function)\s+(set[A-Z]\w*)\b", code))
    for params in re.findall(r"function\s+\w+\s*\(\{([^}]*)\}", code):
        defined |= set(re.findall(r"\b(set[A-Z]\w*)\b", params))
    defined |= {"setTimeout", "setInterval", "setItem", "setAttribute", "setProperty", "setState"}  # setState: React class components
    return [f"`{name}(...)` is called but never defined (leftover from removed state?)." for name in sorted(used - defined)]


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "killsheet.html"
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    checks = [
        ("Hooks come before early returns", check_hooks(lines)),
        ("Every tab has an icon and a panel", check_tab_icons(text)),
        ("localStorage keys are unique", check_storage_keys(text)),
        ("localStorage only via useLocalStorage", check_direct_storage(lines)),
        ("Datacard print class present", check_print_class(text)),
        ("JSX script tag intact", check_babel_script(text)),
        ("Every setX() call is defined", check_setters(text)),
    ]
    failed = 0
    for label, problems in checks:
        print(f"{'PASS' if not problems else 'FAIL'}  {label}")
        for p in problems:
            print(f"      - {p}")
        failed += bool(problems)
    print()
    print("All checks passed." if not failed else f"{failed} check(s) failed. Fix these before pushing.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
