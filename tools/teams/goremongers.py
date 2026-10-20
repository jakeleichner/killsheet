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
            "Select 7 other operatives. Other than Aspirants, each only once.",
        ],
    },
    "factionRules": [
        ("Gore Tanks", "Each Goremonger has a GORE TANK: empty, half or full (starts half). Incapacitating an operative in its control range, or visible within 2\", can raise it one level. Using a Sanguavitae rule lowers it one level."),
        ("Sanguavitae", "Spend a level to use one (each once per activation, max two per activation, not Mania with Fury). Mania: +1 APL until its next activation. Fury: Fight twice, the second free. Rejuvenate: regain D3+1 wounds. Rage: +1 melee Atk for a Fight. Rake: after a Charge, D3 dmg to an enemy in control range. Surge: +1\" Move for a Charge or Reposition."),
        ("Runes of Khorne", "A Goremonger can't lose more than 8 wounds per Shoot action."),
    ],
    "ploys": {
        "strategy": [
            ("Gory Tenacity", "Fighting/retaliating: the first enemy strike on it each sequence is halved (round up, min 2)."),
            ("Hunt for Blood", "One Goremonger switches to Engage (if Concealed) and makes a free Charge of up to 3\"."),
            ("Enhanced Violence", "Gore tank half: melee Balanced; full: melee Relentless."),
            ("Augmented Endurance", "Shot with gore tank half: re-roll one defence die; full: re-roll any."),
        ],
        "firefight": [
            ("Destructive Demise", "A Goremonger is incapacitated: damage to an enemy in its control range by tank level (empty D3, half D3+1, full D3+2)."),
            ("Lacerate Flesh", "A Goremonger with an empty tank activates or counteracts: raise its tank; at the end, lower it again (not for Sanguavitae), or take D3 if you can't."),
            ("Unbridled Aggression", "Fighting after Charging this activation, end of Roll Attack Dice: melee weapons gain Severe."),
            ("Gorethirst", "When you'd counteract: a Concealed Goremonger can, switching to Engage, but only Charge, Shoot or Fight."),
        ],
    },
    "equipment": [
        {"id": "chaos_sigil", "name": "Chaos Sigil", "desc": "Once/TP, a Goremonger being shot: attacker's Piercing worsened by 1."},
        {"id": "wrist_chains", "name": "Wrist Chains", "desc": "Once/TP on a Shoot: chainblade, chainglaive, great chainaxe (no Brutal) or pickrippers count as ranged with Range 2\" (keeping Enhanced Violence rules)."},
        {"id": "gory_totem", "name": "Gory Totem", "desc": "Before the battle, place it wholly in your territory: enemies within 3\" of it can't re-roll attack dice."},
        {"id": "bloody_cadaver", "name": "Bloody Cadaver", "desc": "Before the battle, place it wholly in your territory; Goremongers can pick it up. Ready step: the operative controlling it (not in enemy control range) raises its tank."},
    ],
    "operatives": [
        gm("blood_herald", "Blood Herald", [("Icon of Khorne", 4, "2+", "4/4", 'Range 8", Saturate')], [("Chainblade", 4, "3+", "4/5", "Rending")],
           ["Khorne's Favour: Once per activation, if its tank is empty, raise it.",
            "Impending Apotheosis: Once/battle, ignore the Normal Dmg from one attack dice."],
           "LEADER, BLOOD HERALD", wounds=11),
        gm("aspirant", "Aspirant", [AUTOPISTOL], [("Chainglaive", 4, "3+", "4/5", "Rending")],
           ["Obsessive Bloodlust: Once/TP after a Fight, if out of enemy control range: a free Charge of up to 2\" (even if it already Charged; it can still Charge, Dash or Reposition afterwards)."],
           "ASPIRANT"),
        gm("bloodtaker", "Bloodtaker", [AUTOPISTOL], [("Ritual blade", 4, "3+", "3/5", "Ritual")],
           ["Ritual (weapon rule): First damage it deals each sequence to an operative in its control range can raise its tank (as well as the normal kill rule).",
            "Transfusion Ritual (1AP): Lower its tank to raise another Goremonger's within 8\" (instead of a Sanguavitae). Not within enemy control range or with an empty tank."],
           "BLOODTAKER"),
        gm("impaler", "Impaler", [AUTOPISTOL, ("Fleshskewer (ranged)", 4, "3+", "4/5", 'Range 8", Piercing Crits 1, Stun, Drag')], [("Fleshskewer (stab)", 4, "3+", "3/4", "-")],
           ["Drag (weapon rule): Before inflicting damage, move the target up to 2\" per unblocked success toward this operative (ignore drops); then you can discard any of those successes.",
            "Gore-fuel (1AP): Lower its tank: the fleshskewer gains Severe until it next uses it. Not within enemy control range or with an empty tank."],
           "IMPALER"),
        gm("inciter", "Inciter", [("Dual autopistols (focused)", 4, "3+", "2/2", 'Range 8", Ceaseless, Devastating 1, Rending')], [("Dual autopistols (point-blank)", 4, "3+", "3/4", "Ceaseless, Rending")],
           ["Dash and Spray (1AP): A free Dash and a free Shoot (focused profile), in either order. Not on Conceal or within enemy control range.",
            "Incite the Hunt: Kills an enemy from more than 2\" away: raise the tank of a Goremonger within 8\" of it.",
            "Bleeding: Its autopistols damage but don't kill: the enemy gains a Bleeding token. A Goremonger within 8\" of that enemy can remove the token to raise its tank."],
           "INCITER"),
        gm("skullclaimer", "Skullclaimer", [AUTOPISTOL], [("Great chainaxe", 4, "3+", "5/6", "Brutal")],
           ["Brutish: An attack dice would inflict Critical Dmg on it: you can make it Normal Dmg.",
            "Claim Skull: Once/TP, kills an enemy with its great chainaxe: gain 1CP."],
           "SKULLCLAIMER"),
        gm("stalker", "Stalker", [AUTOPISTOL], [("Pickrippers", 4, "3+", "4/5", "Rending")],
           ["Climbing Picks: Climbing counts as 2\" vertical.",
            "Rooftop Stalker: Fighting after dropping from Vantage 2\"+ high this activation, or vs an enemy on Vantage 2\"+ high: melee Relentless."],
           "STALKER"),
    ],
}
