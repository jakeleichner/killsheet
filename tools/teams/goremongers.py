AUTOPISTOL = ("Autopistol", 4, "4+", "2/3", 'Range 8"')

def gm(oid, name, ranged, melee, abilities, kw, wounds=10):
    return {"id": oid, "name": "Goremonger " + name, "apl": 2, "move": '7"', "save": "5+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "goremongers", "source": "goremongers", "name": "Goremongers", "badge": "CHAOS", "color": "#B3262E",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 8,
        "groups": [
            {"name": "Leader", "desc": "1 Blood Herald", "min": 1, "max": 1, "ids": ["blood_herald"]},
            {"name": "Operatives", "desc": "7 Goremongers from the list below", "min": 7, "max": 7,
             "ids": ["aspirant", "bloodtaker", "impaler", "inciter", "skullclaimer", "stalker"]},
        ],
        "repeatable": ["aspirant"],
        "rules": [
            "Select 1 Blood Herald.",
            "Select 7 other operatives. You can take several Aspirants, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Gore Tanks", "Each Goremonger has a gore tank that is empty, half or full (it starts at half). When it incapacitates an operative in its control range or visible within 2\", you can raise its tank one level. Using a Sanguavitae rule lowers it one level."),
        ("Sanguavitae", "Spend a level to use one of these. Each once per activation, two per activation at most, and not Mania with Fury. Mania: +1 APL until its next activation. Fury: Fight twice, and the second is free. Rejuvenate: regain D3+1 wounds. Rage: +1 Atk on melee weapons for a Fight. Rake: after a Charge in its own activation, inflict D3 damage on an enemy in its control range. Surge: +1\" Move for a Charge or Reposition."),
        ("Runes of Khorne", "A Goremonger can't lose more than 8 wounds from a single Shoot action."),
    ],
    "ploys": {
        "strategy": [
            ("Gory Tenacity", "When one fights or retaliates, the first enemy strike on it each sequence is halved (rounding up, to a minimum of 2)."),
            ("Hunt for Blood", "One Goremonger switches to Engage (if it has a Conceal order) and makes a free Charge of up to 3\"."),
            ("Enhanced Violence", "With a half gore tank, melee weapons gain Balanced. With a full tank, they gain Relentless."),
            ("Augmented Endurance", "When one is shot with a half gore tank, re-roll one defence die. With a full tank, re-roll any."),
        ],
        "firefight": [
            ("Destructive Demise", "When a Goremonger is incapacitated, inflict damage on an enemy in its control range based on its tank: D3 if empty, D3+1 if half, D3+2 if full."),
            ("Lacerate Flesh", "When a Goremonger with an empty tank activates or counteracts, raise its tank. At the end, lower it again (unless it used it for Sanguavitae), or take D3 damage if you can't."),
            ("Unbridled Aggression", "When one fights after Charging this activation, its melee weapons gain Severe at the end of the Roll Attack Dice step."),
            ("Gorethirst", "When you'd counteract, a Goremonger with a Conceal order can do so, switching to Engage, but it can only Charge, Shoot or Fight."),
        ],
    },
    "equipment": [
        {"id": "chaos_sigil", "name": "Chaos Sigil", "desc": "Once per turning point, when a Goremonger is shot, the attacker's Piercing gets worse by 1."},
        {"id": "wrist_chains", "name": "Wrist Chains", "desc": "Once per turning point when one Shoots, a chainblade, chainglaive, great chainaxe (without Brutal) or pickrippers count as a ranged weapon with Range 2\", keeping their Enhanced Violence rules."},
        {"id": "gory_totem", "name": "Gory Totem", "desc": "Before the battle, place it wholly in your territory. Enemies within 3\" of it can't re-roll attack dice."},
        {"id": "bloody_cadaver", "name": "Bloody Cadaver", "desc": "Before the battle, place it wholly in your territory. Goremongers can pick it up. In the Ready step, the operative carrying it (if outside enemy control range) raises its tank."},
    ],
    "operatives": [
        gm("blood_herald", "Blood Herald", [("Icon of Khorne", 4, "2+", "4/4", 'Range 8", Saturate')], [("Chainblade", 4, "3+", "4/5", "Rending")],
           ["Khorne's Favour: Once per activation, if its tank is empty, raise it.",
            "Impending Apotheosis: Once per battle, ignore the Normal Dmg from one attack die."],
           "LEADER, BLOOD HERALD", wounds=11),
        gm("aspirant", "Aspirant", [AUTOPISTOL], [("Chainglaive", 4, "3+", "4/5", "Rending")],
           ["Obsessive Bloodlust: Once per turning point after a Fight, if it's outside enemy control range, it makes a free Charge of up to 2\", even if it already Charged. It can still Charge, Dash or Reposition afterwards."],
           "ASPIRANT"),
        gm("bloodtaker", "Bloodtaker", [AUTOPISTOL], [("Ritual blade", 4, "3+", "3/5", "Ritual")],
           ["Ritual (weapon rule): The first damage it inflicts each sequence on an operative in its control range can raise its tank, on top of the normal rule for kills.",
            "Transfusion Ritual (1AP): Lower its tank to raise the tank of another Goremonger within 8\" (instead of using Sanguavitae). It can't do this within enemy control range or with an empty tank."],
           "BLOODTAKER"),
        gm("impaler", "Impaler", [AUTOPISTOL, ("Fleshskewer (ranged)", 4, "3+", "4/5", 'Range 8", Piercing Crits 1, Stun, Drag')], [("Fleshskewer (stab)", 4, "3+", "3/4", "-")],
           ["Drag (weapon rule): Before inflicting damage, move the target up to 2\" toward this operative for each unblocked success, ignoring drops. Then you can discard any of those successes.",
            "Gore-fuel (1AP): Lower its tank. The fleshskewer gains Severe until it next uses it. It can't do this within enemy control range or with an empty tank."],
           "IMPALER"),
        gm("inciter", "Inciter", [("Dual autopistols (focused)", 4, "3+", "2/2", 'Range 8", Ceaseless, Devastating 1, Rending')], [("Dual autopistols (point-blank)", 4, "3+", "3/4", "Ceaseless, Rending")],
           ["Dash and Spray (1AP): Make a free Dash and a free Shoot (focused profile), in either order. It can't do this with a Conceal order or within enemy control range.",
            "Incite the Hunt: When it kills an enemy from more than 2\" away, raise the tank of a Goremonger within 8\" of that enemy.",
            "Bleeding: When its autopistols damage an enemy without killing it, the enemy gains a Bleeding token. A Goremonger within 8\" of that enemy can remove the token to raise its tank."],
           "INCITER"),
        gm("skullclaimer", "Skullclaimer", [AUTOPISTOL], [("Great chainaxe", 4, "3+", "5/6", "Brutal")],
           ["Brutish: When an attack die would inflict Critical Dmg on it, you can make it Normal Dmg instead.",
            "Claim Skull: Once per turning point, when it kills an enemy with its great chainaxe, gain 1CP."],
           "SKULLCLAIMER"),
        gm("stalker", "Stalker", [AUTOPISTOL], [("Pickrippers", 4, "3+", "4/5", "Rending")],
           ["Climbing Picks: Climbing counts as 2\" vertically.",
            "Rooftop Stalker: When it fights after dropping from Vantage terrain 2\" or higher this activation, or against an enemy on Vantage 2\" or higher, melee weapons gain Relentless."],
           "STALKER"),
    ],
}
