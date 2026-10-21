"""Compare tools/teams/*.py against the official team PDFs (see DATA_CHECK.md).

Usage: python3 tools/teams/pdfcheck.py <folder> [team ...]
<folder> holds a pdftxt/ subfolder with one .txt per team PDF (pypdf page text, joined),
named after GW's download so it contains the team's source id (e.g. ..._kommandos_...txt).
Prints every mismatch; most are PDF text noise (see DATA_CHECK.md), so review each by hand.
"""
import glob, importlib.util, os, re, sys
SP = sys.argv[1]
ROOT = os.path.dirname(os.path.abspath(__file__)) + "/"
TXT = SP + "/pdftxt/"
ALIAS = {"void_dancer_troupe": "void-dancer_troupe"}

def load(n):
    spec = importlib.util.spec_from_file_location(n, ROOT + n + ".py"); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m.TEAM

def norm(s):
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace("‑", "-").replace(" ", " ")
    s = re.sub(r"\(\s+", "(", s); s = re.sub(r"\s+\)", ")", s)
    return re.sub(r"\s+", " ", s).strip()

def wr_set(s):
    s = norm(s).replace("*", "")
    if s in ("-", ""): return frozenset()
    return frozenset(re.sub(r"\s+", " ", t).strip().lower() for t in s.split(",") if t.strip())

def parse(text):
    raw = [norm(l) for l in text.split("\n")]
    lines = []
    for l in raw:
        if lines and lines[-1].endswith(",") and re.match(r"^\s*\d\s+\d\+\s+\d+/\d+", l) is None and len(l) < 60:
            lines[-1] = lines[-1] + " " + l
        else:
            lines.append(l)
    cards, weapons = {}, {}
    for i, l in enumerate(lines):
        if l.startswith("APL WOUNDS") and i >= 1 and i + 1 < len(lines):
            m = re.match(r"^(.*?)\s+(\d)$", lines[i - 1])
            s = re.match(r'^(\d+)"\s+(\d)\+\s+(\d+)', lines[i + 1])
            if m and s:
                base = lines[i + 2] if i + 2 < len(lines) and re.fullmatch(r"\d+(x\d+)?", lines[i + 2]) else None
                cards[m.group(1).upper()] = (int(m.group(2)), s.group(1) + '"', s.group(2) + "+", int(s.group(3)), base)
        one = re.match(r'^([A-Z][A-Z \-\'\.]+?)\s+(\d)\s+(\d+)"\s+(\d)\+\s+(\d+)$', l)
        if one:
            base = lines[i + 1] if i + 1 < len(lines) and re.fullmatch(r"\d+(x\d+)?", lines[i + 1]) else None
            cards[one.group(1).upper()] = (int(one.group(2)), one.group(3) + '"', one.group(4) + "+", int(one.group(5)), base)
        w = re.match(r"^(.+?)\s+(\d)\s+(\d)\+\s+(\d+/\d+)\s*(.*)$", l)
        if w and not l.startswith("NAME"):
            name = w.group(1).strip().lower()
            weapons.setdefault(name, set()).add((int(w.group(2)), w.group(3) + "+", w.group(4), wr_set(w.group(5))))
    return cards, weapons, "\n".join(lines).upper()

def find_card(cards, opname):
    on = norm(opname).upper()
    on = re.sub(r"\s*\(.*\)$", "", on)
    exact = [k for k in cards if k == on or k.endswith(" " + on) or k.replace("-", " ").endswith(on.replace("-", " "))]
    if exact: return cards[min(exact, key=len)]
    pre = [k for k in cards if k.startswith(on + " ")]
    if pre: return cards[min(pre, key=len)]
    loose = [k for k in cards if on.endswith(" " + k)]
    return cards[max(loose, key=len)] if loose else None

def check(team):
    t = load(team)
    cache = {}
    def pdf(source):
        if source not in cache:
            src = ALIAS.get(source, source)
            files = [f for f in os.listdir(TXT) if src in f]
            cache[source] = parse(open(TXT + files[0]).read()) if files else None
        return cache[source]
    if not pdf(t["source"]): return [("NO PDF", t["source"])]
    upper = pdf(t["source"])[2]
    out = []
    for o in t["operatives"]:
        got = pdf(o.get("source", t["source"]))
        if not got:
            out.append(("NO PDF for operative source", o["name"], o.get("source"))); continue
        cards, weapons, _ = got
        c = find_card(cards, o["name"])
        if not c:
            out.append(("no datacard found", o["name"])); continue
        apl, mv, sv, wd, base = c
        mine = (o["apl"], o["move"], o["save"], o["wounds"])
        if mine != (apl, mv, sv, wd):
            out.append(("STATS", o["name"], "ours APL/Move/Save/W", mine, "pdf", (apl, mv, sv, wd)))
        if base and str(o["pts"]) != base:
            out.append(("BASE", o["name"], o["pts"], base))
        for kind in ("ranged", "melee"):
            for w in o.get(kind, []):
                name, atk, hit, dmg, wr = w[0], w[1], w[2], w[3], w[4]
                key = norm(name).lower()
                cands = weapons.get(key) or weapons.get(re.sub(r"\s*\(.*\)$", "", key))
                if not cands:
                    alt = [k for k in weapons if k.replace(" - ", " (") .startswith(re.sub(r"\s*\(.*\)$", "", key))]
                    cands = set().union(*[weapons[k] for k in alt]) if alt else None
                if not cands:
                    out.append(("weapon not in pdf", o["name"], name)); continue
                me = (atk, hit, dmg, wr_set(wr))
                if me not in cands:
                    near = sorted(cands, key=lambda c: (c[0] != atk) + (c[1] != hit) + (c[2] != dmg) + len(c[3] ^ me[3]))[0]
                    out.append(("WEAPON", o["name"], name, (atk, hit, dmg, sorted(me[3])), "pdf", (near[0], near[1], near[2], sorted(near[3]))))
    for kind in ("strategy", "firefight"):
        for p in t["ploys"][kind]:
            nm = p[0] if isinstance(p, (list, tuple)) else p["name"]
            if norm(nm).upper().replace("’", "'") not in upper.replace("’", "'"):
                out.append(("ploy name not in pdf", nm))
    for q in t["equipment"]:
        if norm(q["name"]).upper() not in upper:
            out.append(("equipment name not in pdf", q["name"]))
    return out

if __name__ == "__main__":
    teams = sys.argv[2:] or sorted(os.path.basename(p)[:-3] for p in glob.glob(ROOT + "*.py") if os.path.basename(p) not in ("build.py", "plain_words.py"))
    total = 0
    for tm in teams:
        res = check(tm)
        total += len(res)
        print("==", tm, len(res))
        for r in res: print("   ", r)
    print("TOTAL", total)
