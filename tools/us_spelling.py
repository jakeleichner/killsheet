"""British -> US spellings used in KillSheet's text. The app is written in US English (owner, Oct 2026).

`us(text)` converts a string. `BRITISH` finds the British forms (check.py uses it to keep them out).
Team names stay as Games Workshop prints them (Spectre Squad), so "spectre" isn't listed.
"""
import re

WORDS = {
    "defence": "defense", "offence": "offense", "behaviour": "behavior", "colour": "color", "colours": "colors",
    "coloured": "colored", "recoloured": "recolored", "armour": "armor", "armoured": "armored", "centre": "center",
    "reconnoitre": "reconnoiter", "favour": "favor", "favoured": "favored", "honour": "honor", "saviour": "savior",
    "vigour": "vigor", "ardour": "ardor", "neighbours": "neighbors", "analyse": "analyze", "lobotomised": "lobotomized",
    "incentivise": "incentivize", "vitalised": "vitalized", "stabilised": "stabilized", "prioritised": "prioritized",
    "optimisation": "optimization", "neutralise": "neutralize", "idolisation": "idolization", "energise": "energize",
    "unrecognised": "unrecognized", "recognise": "recognize", "cancelled": "canceled", "duelling": "dueling",
    "gruelling": "grueling", "totalled": "totaled", "dueller": "dueler",
}
BRITISH = re.compile(r"\b(" + "|".join(WORDS) + r")\b", re.I)


def _case(src, dst):
    if src.isupper():
        return dst.upper()
    if src[0].isupper():
        return dst[0].upper() + dst[1:]
    return dst


def us(text):
    return BRITISH.sub(lambda m: _case(m.group(0), WORDS[m.group(0).lower()]), text)
