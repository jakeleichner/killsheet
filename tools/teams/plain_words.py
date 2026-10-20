"""Expand rules shorthand in team text into plain words (run once over the team files; safe to re-run).

Usage: python3 tools/teams/plain_words.py [--dry]

Only string literals that contain a space are touched, so ids and keys stay as they are.
"""
import io
import os
import re
import sys
import tokenize

HERE = os.path.dirname(os.path.abspath(__file__))

RULES = [
    (r"-per-TP\b", "-per-turning-point"),
    (r"\b([Oo]nce|[Tt]wice|1|2)/TP\b", lambda m: {"1": "once", "2": "twice"}.get(m.group(1), m.group(1)) + " per turning point"),
    (r"\b([Oo]nce|[Tt]wice|1|2)/battle\b", lambda m: {"1": "once", "2": "twice"}.get(m.group(1), m.group(1)) + " per battle"),
    (r"\bNot TP1\b", "Not in the first turning point"),
    (r"\bnot TP1\b", "not in the first turning point"),
    (r"\b(in|from|during|after|before|until) TP(\d)\b", r"\1 turning point \2"),
    (r"\bTP(\d)\b", r"turning point \1"),
    (r"\bTPs\b", "turning points"),
    (r"\bTP\b", "turning point"),
    (r"\bdmg\b", "damage"),
    (r"\bexcl\.?(?=\s|\))", "excluding"),
    (r"\bincl\.?(?=\s|\))", "including"),
    (r"\bvs\.?(?=\s)", "against"),
    (r"\bVs\.?(?=\s)", "Against"),
    (r"\bNormal/Crit Dmg\b", "Normal or Critical Dmg"),
    (r"\bCrit Dmg\b", "Critical Dmg"),
    (r"\bboth Dmg\b", "both Normal and Critical Dmg"),
]


def plain(text):
    for pat, rep in RULES:
        text = re.sub(pat, rep, text)
    return text


def fix_file(path, dry):
    src = open(path).read()
    out, changed = [], []
    for tok in tokenize.generate_tokens(io.StringIO(src).readline):
        if tok.type == tokenize.STRING and " " in tok.string:
            new = plain(tok.string)
            if new != tok.string:
                changed.append((tok.string, new))
                tok = tok._replace(string=new)
        out.append(tok)
    if changed and not dry:
        open(path, "w").write(tokenize.untokenize(out))
    return changed


def main():
    dry = "--dry" in sys.argv
    total = 0
    for name in sorted(os.listdir(HERE)):
        if not name.endswith(".py") or name in ("build.py", "plain_words.py"):
            continue
        changed = fix_file(os.path.join(HERE, name), dry)
        total += len(changed)
        if dry:
            for old, new in changed[:2]:
                print(name, "|", old[:110], "\n   ->", new[:110])
    print(("Would change" if dry else "Changed"), total, "strings.")


if __name__ == "__main__":
    main()
