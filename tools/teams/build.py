"""Turn team data (teams/*.py, each defining TEAM) into FACTIONS entries in killsheet.html.

Usage: python3 tools/teams/build.py killsheet.html [team1 team2 ...]  (no names = everything in ORDER.txt)
Teams are inserted after the existing ones, in the order given, between the marker
comment and the end of the FACTIONS object. Re-running replaces that section.
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
START = "const FACTIONS = {\n"
END = "};\n\n/* ═══ ROSTER & COMPOSITION HELPERS"


def js(v, ind=0):
    """Compact JS literal in the file's house style (unquoted keys, one-line objects)."""
    if v is None:
        return "null"
    if v is True:
        return "true"
    if v is False:
        return "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        return json.dumps(v)
    if isinstance(v, list):
        return "[" + ", ".join(js(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{ " + ", ".join(f"{k}: {js(x)}" for k, x in v.items()) + " }"
    raise TypeError(v)


def weapon(w):
    name, atk, hit, dmg, wr = w
    return {"name": name, "atk": atk, "hit": hit, "dmg": dmg, "wr": wr or "-"}


def emit(t):
    P = "    "
    out = [f"  {t['id']}: {{"]
    out.append(f"{P}id: {js(t['id'])}, name: {js(t['name'])}, badge: {js(t['badge'])}, color: {js(t['color'])},")
    out.append(f"{P}archetypes: {js(t['archetypes'])},")
    c = t["composition"]
    out.append(f"{P}composition: {{")
    out.append(f"{P}  total: {c['total']},")
    out.append(f"{P}  groups: [")
    for g in c["groups"]:
        out.append(f"{P}    {js(g)},")
    out.append(f"{P}  ],")
    for key in ("repeatable", "maxCount", "cost"):
        if c.get(key):
            out.append(f"{P}  {key}: {js(c[key])},")
    for key in ("caps", "requires", "exclusive", "pools"):
        if c.get(key):
            out.append(f"{P}  {key}: [")
            for x in c[key]:
                out.append(f"{P}    {js(x)},")
            out.append(f"{P}  ],")
    out.append(f"{P}  rules: [")
    for r in c["rules"]:
        out.append(f"{P}    {js(r)},")
    out.append(f"{P}  ],")
    out.append(f"{P}}},")
    out.append(f"{P}factionRules: [")
    for r in t["factionRules"]:
        out.append(f"{P}  {js({'name': r[0], 'desc': r[1]})},")
    out.append(f"{P}],")
    out.append(f"{P}ploys: {{")
    for kind in ("strategy", "firefight"):
        out.append(f"{P}  {kind}: [")
        for r in t["ploys"][kind]:
            out.append(f"{P}    {js({'name': r[0], 'desc': r[1]})},")
        out.append(f"{P}  ],")
    out.append(f"{P}}},")
    out.append(f"{P}equipment: [")
    for q in t["equipment"]:
        gw = None
        if q.get("gw"):
            g = q["gw"]
            gw = {"type": g[0], **weapon(g[1:6]), "note": g[6] if len(g) > 6 else "Equipment"}
        out.append(f"{P}  {js({'id': q['id'], 'name': q['name'], 'desc': q['desc'], 'gw': gw, 'mod': q.get('mod'), 'ex': q.get('ex', [])})},")
    out.append(f"{P}],")
    out.append(f"{P}operatives: [")
    for o in t["operatives"]:
        head = {k: o[k] for k in ("id", "name", "apl", "move", "save", "wounds", "pts")}
        out.append(f"{P}  {js(head)[:-2]},")
        out.append(f"{P}    ranged: {js([weapon(w) for w in o.get('ranged', [])])},")
        out.append(f"{P}    melee: {js([weapon(w) for w in o.get('melee', [])])},")
        out.append(f"{P}    abilities: {js(o.get('abilities', []))},")
        out.append(f"{P}    kw: {js(o['kw'])}, ex: {js(o.get('ex', []))} }},")
    out.append(f"{P}],")
    out.append("  },")
    return "\n".join(out)


def check(t):
    errs = []
    ops = {o["id"]: o for o in t["operatives"]}
    eqs = {q["id"] for q in t["equipment"]}
    if len(ops) != len(t["operatives"]):
        errs.append("duplicate operative ids")
    c = t["composition"]
    grouped = [i for g in c["groups"] for i in g["ids"]]
    for i in grouped:
        if i not in ops:
            errs.append(f"group id {i} has no operative")
    for i in ops:
        if grouped.count(i) != 1:
            errs.append(f"operative {i} is in {grouped.count(i)} groups (needs exactly 1)")
    for g in c["groups"]:
        if g.get("equip") and g["equip"] not in eqs:
            errs.append(f"group {g['name']} gated by unknown equipment {g['equip']}")
        if g["min"] > g["max"]:
            errs.append(f"group {g['name']} min > max")
    refs = list(c.get("repeatable", [])) + list(c.get("maxCount", {})) + list(c.get("cost", {}))
    refs += [i for cap in c.get("caps", []) for i in cap["ids"] + cap.get("whenAny", [])]
    refs += [x for rq in c.get("requires", []) for x in (rq["id"], rq["needs"])]
    refs += [i for ex in c.get("exclusive", []) for s in ex["sets"] for i in s]
    for i in refs:
        if i not in ops:
            errs.append(f"composition references unknown operative {i}")
    gnames = [g["name"] for g in c["groups"]]
    for pool in c.get("pools", []):
        for i in pool.get("whenAny", {}).get("ids", []):
            if i not in ops:
                errs.append(f"pool whenAny references unknown operative {i}")
        for n in pool["groups"]:
            if n not in gnames:
                errs.append(f"pool {pool['label']} names unknown group {n}")
    for q in t["equipment"]:
        for i in q.get("ex", []):
            if i not in ops:
                errs.append(f"equipment {q['id']} excludes unknown operative {i}")
        if q.get("mod") not in (None, "remove_range", "poison_bolts", "ignore_injured"):
            errs.append(f"equipment {q['id']} has unsupported mod {q['mod']}")
    for o in t["operatives"]:
        for i in o.get("ex", []):
            if i not in eqs:
                errs.append(f"operative {o['id']} excludes unknown equipment {i}")
        for w in o.get("ranged", []) + o.get("melee", []):
            if len(w) != 5 or not re.fullmatch(r"\d", str(w[1])) or not re.fullmatch(r"\d\+", w[2]) or not re.fullmatch(r"\d+/\d+", w[3]):
                errs.append(f"{o['id']} weapon looks wrong: {w}")
        if not re.fullmatch(r'\d+"', o["move"]) or not re.fullmatch(r"\d\+", o["save"]) or not re.fullmatch(r"\d+(x\d+)?", str(o["pts"])):
            errs.append(f"{o['id']} stats look wrong")
    if len(t["ploys"]["strategy"]) < 1 or len(t["ploys"]["firefight"]) < 1:
        errs.append("missing ploys")
    # Weapon types vs the PDF (ranged/melee read from icon offsets by wtypes.py)
    def pdf_types(src):
        wt_path = HERE.parent / "text" / f"{src}.wtypes.json"
        if not wt_path.exists():
            return None
        raw = json.loads(wt_path.read_text())
        types = {k.lower().replace("\u2019", "'").replace("\u2011", "-"): set(v) for k, v in raw.items()}          # exact profile names
        for k, v in raw.items():                                      # plus merged base names
            types.setdefault("base:" + base(k), set()).update(v)
        return types
    for o in t["operatives"]:
        pdf = pdf_types(o.get("source", t["source"]))
        if pdf is None:
            errs.append(f"{o['id']}: no weapon-type data for source {o.get('source', t['source'])}")
            continue
        if True:
            for kind in ("ranged", "melee"):
                for w in o.get(kind, []):
                    seen = pdf.get(w[0].lower().replace("\u2019", "'").replace("\u2011", "-")) or pdf.get("base:" + base(w[0]))
                    if seen is None:  # PDF may wrap a long name onto two lines: match on its first line
                        mine = base(w[0])
                        hits = [v for k, v in pdf.items() if k.startswith("base:") and len(k) > 13 and mine.startswith(k[5:])]
                        seen = set().union(*hits) if hits else None
                    if seen is None:
                        errs.append(f"{o['id']}: weapon '{w[0]}' not found in PDF")
                    elif kind not in seen and set(seen) != {"?"}:
                        errs.append(f"{o['id']}: '{w[0]}' listed as {kind}, PDF says {seen}")
    return errs


def base(name):
    """Weapon name without its profile, for matching against the PDF."""
    return re.sub(r"\s*\(.*$", "", name).strip().lower().replace("\u2019", "'").replace("\u2011", "-")


def load(name):
    spec = importlib.util.spec_from_file_location(name, HERE / f"{name}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.TEAM


def main():
    html = Path(sys.argv[1])
    names = sys.argv[2:] or [l.strip() for l in (HERE / "ORDER.txt").read_text().splitlines() if l.strip() and not l.startswith("#")]
    teams = [load(n) for n in names]
    bad = False
    for t in teams:
        errs = check(t)
        print(f"{t['id']:22s} {len(t['operatives']):2d} operatives  {'OK' if not errs else 'PROBLEMS'}")
        for e in errs:
            print("   -", e)
        bad |= bool(errs)
    ids = [t["id"] for t in teams]
    if len(ids) != len(set(ids)):
        print("duplicate faction ids"); bad = True
    if bad:
        sys.exit(1)
    s = html.read_text(encoding="utf-8")
    start = s.index(START) + len(START)
    end = s.index(END)
    s = s[:start] + "\n".join(emit(t) for t in teams) + "\n" + s[end:]
    html.write_text(s, encoding="utf-8")
    print(f"wrote {len(teams)} teams into {html.name}")


if __name__ == "__main__":
    main()
