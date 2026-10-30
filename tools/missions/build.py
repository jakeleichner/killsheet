"""Build MISSION_PACKS into src/15-missions-data.jsx from tools/missions/<pack>.py.

Usage: python3 tools/missions/build.py

Writes `const MISSION_PACKS = [...]` between the MISSION_PACKS:BEGIN/END markers, checks that every map image the
data names exists in maps/, then rejoins killsheet.html from src/ (tools/assemble.py).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

BEGIN, END = "/* MISSION_PACKS:BEGIN */", "/* MISSION_PACKS:END */"
MAP_ID = re.compile(r"^[a-z_]+-p\d\d$")


def load_packs():
    order = [l.strip() for l in open(os.path.join(HERE, "ORDER.txt")) if l.strip() and not l.startswith("#")]
    packs = []
    for name in order:
        mod = __import__(name)
        packs.append(mod.PACK)
    return packs


def check(packs):
    errors = []
    ids = set()
    for p in packs:
        pid = p["id"]
        if pid in ids:
            errors.append(f"duplicate pack id {pid}")
        ids.add(pid)
        for key in ("name", "kind", "modes", "summary", "source", "rules", "npos", "missions"):
            if key not in p:
                errors.append(f"{pid}: missing {key}")
        maps = list(p.get("keyMaps", [])) + list(p.get("maps", []))
        for m in p["missions"]:
            maps += m["maps"]
            if not m["name"] or m["mode"] not in ("Co-op", "Head-to-head"):
                errors.append(f"{pid} mission {m['num']}: bad name or mode")
        for mid in maps:
            if not MAP_ID.match(mid):
                errors.append(f"{pid}: bad map id {mid}")
            elif not os.path.exists(os.path.join(ROOT, "maps", mid + ".jpg")):
                errors.append(f"{pid}: maps/{mid}.jpg is missing (run render_maps.py)")
        for n in p["npos"]:
            for w in n["weapons"]:
                if not re.match(r"^\d+/\d+$", w["dmg"]) or not re.match(r"^\d\+$", w["hit"]):
                    errors.append(f"{pid} {n['name']}: bad weapon stats {w}")
    return errors


def main():
    html_path = os.path.join(ROOT, "src", "15-missions-data.jsx")
    packs = load_packs()
    errors = check(packs)
    if errors:
        print("\n".join(errors))
        sys.exit(1)
    js = BEGIN + "\nconst MISSION_PACKS = " + json.dumps(packs, ensure_ascii=False, indent=1) + ";\n" + END
    s = open(html_path).read()
    assert BEGIN in s and END in s, "the MISSION_PACKS markers are missing from " + html_path
    s = s[:s.index(BEGIN)] + js + s[s.index(END) + len(END):]
    open(html_path, "w").write(s)
    n_missions = sum(len(p["missions"]) for p in packs)
    print(f"Built {len(packs)} packs, {n_missions} missions.")
    sys.path.insert(0, os.path.join(ROOT, "tools"))
    import assemble
    assemble.main()


if __name__ == "__main__":
    main()
