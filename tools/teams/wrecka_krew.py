FISTS = ("Fists", 3, "3+", "3/4", "-")
ROKKIT = ("Rokkit launcha", 6, "5+", "4/5", 'Blast 1"')
HAMMER = ("Smash hammer", 4, "3+", "5/6", "Brutal")
KOMPETITIVE = "Kompetitive Streak: Once per Shoot, if it shoots an enemy that another friendly operative already shot this turning point (secondary targets count), gain 1 Wrecka point."
PULSA = ["Pulsa (weapon rule): Don't pick a target. Place your Pulsa marker somewhere visible (or on visible Vantage terrain) with 1 Pulsa point, then roll attack dice. Add 1 point for each success (up to 3 more). Inflict D3 damage on each operative wholly within x\" of the marker, where x is its points.",
         "Shokkwave: Operatives within x\" of your Pulsa marker get -2\" Move and a worse Hit by 1 (this stacks with being injured). The marker loses 1 point each Ready step and is removed at 0."]

def wk(oid, name, ranged, melee, abilities, kw, wounds=12, save="4+", pts=32):
    return {"id": oid, "name": name, "apl": 2, "move": '6"', "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "wreckakrew", "source": "wrecka_krew", "name": "Wrecka Krew", "badge": "ORKS", "color": "#5E8C2E",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 8,
        "groups": [
            {"name": "Leader", "desc": "1 Boss Nob", "min": 1, "max": 1, "ids": ["boss_nob"]},
            {"name": "Bomb Squigs", "desc": "2 Bomb Squigs", "min": 2, "max": 2, "ids": ["bomb_squig"]},
            {"name": "Operatives", "desc": "5 Wrecka Krew operatives from the list below", "min": 5, "max": 5,
             "ids": ["demolisha", "fighter", "krusha", "gunner_eavy", "gunner_rokkit", "rokkiteer_pulsa", "rokkiteer_rack"]},
        ],
        "repeatable": ["bomb_squig", "fighter", "gunner_eavy", "gunner_rokkit"],
        "caps": [{"ids": ["rokkiteer_pulsa", "rokkiteer_rack"], "max": 1, "label": "Only 1 Tankbusta Rokkiteer"}],
        "rules": [
            "Select 1 Boss Nob, armed with a rokkit pistol and smash hammer, or two rokkit pistols and a choppa.",
            "Select 2 Bomb Squigs.",
            "Select 5 other operatives. You can take several Breaka Boy Fighters and Tankbusta Gunners, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Wrecka Rampage", "When one shoots, fights or retaliates, in the Roll Attack Dice step, gain 1 Wrecka point for each retained 6, and spend up to 2 points (not for Bomb Squigs) to retain fails as normal successes. You can hold up to 6 points, and if you start the action on 6, you can only spend them."),
        ("Tanked Up", "The first Charge, Shoot or Fight (not Guard) that an operative with an Engage order makes each activation or counteraction (not Bomb Squigs) gives it +1 APL until the start of its next activation."),
    ],
    "ploys": {
        "strategy": [
            ("Destruction", "Ranged weapons gain Saturate."),
            ("Amped Up", "Each operative with an Engage order regains up to D3+1 wounds."),
            ("Waaagh!", "Melee weapons gain Balanced."),
            ("Tuff Gitz", "When an operative with an Engage order is shot, re-roll one defence die."),
        ],
        "firefight": [
            ("Proppa Scrap", "A Breaka Boy or the Boss Nob can Fight twice this activation."),
            ("Kaboom!", "When shooting a Blast weapon, it gets 1\" more Blast and gains Severe against the primary target for that action. Not with Drill Rokkits."),
            ("Just a Scratch", "When an attack die inflicts Normal Dmg on an operative (not a Bomb Squig), ignore that damage."),
            ("Demolition Job", "After a Shoot or Fight (before removing anything), place a Demolition marker in the target's control range. Until the next Ready step, when attacking an operative within 3\" of it, you can spend one Wrecka point for free."),
        ],
    },
    "equipment": [
        {"id": "engine_oil", "name": "Engine Oil", "desc": "Once per turning point, when an operative (not a Bomb Squig) activates, it ignores stat changes from being injured for that activation."},
        {"id": "glyphs", "name": "Glyphs", "desc": "Pick Waaagh! or Destruction. Its first use costs 0CP, and later uses cost 0CP if you have any Wrecka points."},
        {"id": "drill_rokkits", "name": "Drill Rokkits", "desc": "Once per turning point, a rokkit launcha or 'eavy rokkit launcha loses Blast and gains Piercing 1 for that Shoot."},
        {"id": "extra_armour", "name": "Extra Armour", "desc": "Operatives (not Bomb Squigs) get -1\" Move and improve their Save by 1. Not with a Portable Barricade's Protective rule."},
    ],
    "operatives": [
        wk("boss_nob", "Wrecka Boss Nob",
           [("Rokkit pistol", 6, "5+", "4/5", 'Range 8", Blast 1"'), ("Two rokkit pistols (focused)", 6, "4+", "4/5", 'Range 8", Blast 1", Ceaseless'), ("Two rokkit pistols (salvo)", 6, "5+", "4/5", 'Range 8", Blast 1", Salvo')],
           [("Choppa", 4, "3+", "4/5", "-"), HAMMER],
           ["Loadout: a rokkit pistol and smash hammer, or two rokkit pistols and a choppa.",
            "Wrecka Boss: Gain 1 Wrecka point when it Shoots or Fights (not Guard).",
            "Salvo (weapon rule): Pick two valid targets that aren't in friendly control range. Shoot both primary targets, then each secondary target, each only once, rolling separately."],
           "LEADER, BOSS NOB", wounds=14, pts=40),
        wk("bomb_squig", "Wrecka Bomb Squig", [("Explosives", 6, "4+", "4/5", 'Blast 1", Limited 1, Explosive')], [("Bite", 3, "4+", "4/5", "-")],
           ["Explosive (weapon rule): It can shoot while in enemy control range. It's the primary target itself, with no cover and not obscured.",
            "Stoopid: It can't be given a Conceal order in the Firefight phase. It can only Charge, Dash, Fight, Reposition and Shoot, and only with its own weapons.",
            "Boom!: If it's incapacitated before using its explosives, roll one or two D6. On any 4+, it shoots its explosives before it's removed.",
            "Expendable: It doesn't count for kill or elimination ops, or for escape, survive and incapacitate scoring."],
           "BOMB SQUIG", wounds=5, save="5+", pts=25),
        wk("demolisha", "Breaka Boy Demolisha", [], [("Tankhammer (bash)", 4, "3+", "4/5", "-"), ("Tankhammer (detonate)", 4, "3+", "0/0", "Lethal 5+, Limited 1, Detonate")],
           ["Detonate (weapon rule): The first time it would damage an enemy, inflict D6+6 damage (2D6+6 for a critical success) on that enemy and each other operative in its control range. This damage can't be ignored or reduced. Then the action ends. Gain 1 Wrecka point, plus 1 for each operative incapacitated.",
            "Reckless Temperament: Normal Dmg of 4 or more inflicts 1 less damage on it. With an Engage order, Critical Dmg of 4 or more does too."],
           "BREAKA BOY, DEMOLISHA"),
        wk("fighter", "Breaka Boy Fighter", [], [HAMMER],
           ["Break Stuff (1AP): Pick a terrain feature in its control range. If it's equipment terrain, remove it. Otherwise, place a Breach marker next to it. Operatives within 1\" of the marker treat parts of it up to 1\" thick as Accessible. It can't do this within enemy control range."],
           "BREAKA BOY, FIGHTER"),
        wk("krusha", "Breaka Boy Krusha", [], [("Knucklebustas", 4, "3+", "5/6", "Brutal, Shock, Smash")],
           ["Smash (weapon rule): With each strike, you can push the enemy up to 1\" straight away from this operative, then move this one up to 1\" to stay in its control range.",
            "Armoured Up: When it's shot, fights or retaliates, your opponent can only retain 6s as critical successes."],
           "BREAKA BOY, KRUSHA"),
        wk("gunner_eavy", "Tankbusta Gunner ('eavy rokkit launcha)", [("'Eavy rokkit launcha", 6, "4+", "4/5", 'Blast 1", Heavy (Dash only)')], [FISTS], [KOMPETITIVE], "TANKBUSTA, GUNNER"),
        wk("gunner_rokkit", "Tankbusta Gunner (rokkit launcha)", [ROKKIT], [FISTS], [KOMPETITIVE], "TANKBUSTA, GUNNER"),
        wk("rokkiteer_pulsa", "Tankbusta Rokkiteer (pulsa rokkit)", [("Pulsa rokkit", 6, "5+", "0/0", "Heavy (Reposition only), Limited 1, Pulsa"), ROKKIT], [FISTS], PULSA, "TANKBUSTA, ROKKITEER"),
        wk("rokkiteer_rack", "Tankbusta Rokkiteer (rokkit rack)", [ROKKIT, ("Rokkit rack", 6, "5+", "4/5", 'Blast 2", Heavy (Reposition only), Limited 1, Relentless')], [FISTS], [], "TANKBUSTA, ROKKITEER"),
    ],
}
