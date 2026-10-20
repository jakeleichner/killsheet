"""Helpers for mission pack data files. Each pack file defines PACK = dict(...).

Text is condensed from GW's free mission pack PDFs, in plain language.
Maps are page images cut from those PDFs (see render_maps.py) and live in maps/<pack>-pNN.jpg.
"""


def R(name, summary, detail=None, steps=None, tag=None):
    """A rule card: same shape as the Rules tab's RuleItem."""
    d = {"name": name, "summary": summary}
    if detail:
        d["detail"] = detail
    if steps:
        d["steps"] = steps
    if tag:
        d["tag"] = tag
    return d


def A(name, ap, effect, restrict=None):
    """A mission action, shown as a rule card with an AP tag."""
    return R(name, effect, restrict, tag=None if ap in (None, "-") else f"{ap}AP")


def W(name, kind, atk, hit, dmg, wr="-"):
    assert kind in ("ranged", "melee"), name
    return {"name": name, "type": kind, "atk": atk, "hit": hit, "dmg": dmg, "wr": wr}


def NPO(name, apl, move, save, wounds, weapons, behaviour, priorities, rules=(), base=None, note=None):
    d = {"name": name, "apl": apl, "move": move, "save": save, "wounds": wounds,
         "weapons": list(weapons), "behaviour": behaviour, "priorities": list(priorities),
         "rules": [{"name": n, "desc": t} for n, t in rules]}
    if base:
        d["base"] = base
    if note:
        d["note"] = note
    return d


def M(num, name, mode, summary, maps=(), rules=(), actions=(), victory=(), cards=(), cards_title="NPO activation cards", extra=(), next_win=None, next_lose=None, **setup):
    """A mission. cards = [(result, effect)] for the NPO activation table."""
    d = {"num": num, "name": name, "mode": mode, "summary": summary, "maps": list(maps),
         "rules": list(rules), "actions": list(actions), "victory": list(victory)}
    if cards:
        d["cards"] = [{"roll": r, "effect": e} for r, e in cards]
        d["cardsTitle"] = cards_title
    if extra:
        d["extra"] = list(extra)
    if next_win:
        d["nextWin"] = next_win
    if next_lose:
        d["nextLose"] = next_lose
    # Mission Setup defaults when this mission is picked in the Builder: kz, tps, equip, tacOps.
    d.update(setup)
    return d


# Rules shared by most Joint Ops packs, worded once here.
THREAT_PRINCIPLE = R(
    "Threat principle",
    "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    [
        "Which NPO activates: the one that can Shoot or Fight and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
        "Where to set it up: where it's most likely to stop you winning, then where it isn't a valid target, then where it can best Charge, Shoot or Fight.",
        "Who it fights: the operative it's most likely to incapacitate, then a ready one.",
        "Who it shoots: the operative it's most likely to incapacitate, then one not obscured, not in cover, closest, then ready.",
    ],
)

BEHAVIOUR = R(
    "NPO behaviour",
    "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "The behaviour also says which order (Engage or Conceal) to give it when it activates.",
)

COOP_TEAM = R(
    "Your kill team",
    "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    [
        "Co-op players count as one player: you share CP and equipment.",
        "If you mix two teams, one team's rules may not affect the other's operatives.",
        "One player can act as game master and run the NPOs instead of playing.",
    ],
)
