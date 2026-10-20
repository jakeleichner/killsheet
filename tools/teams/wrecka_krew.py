FISTS = ("Fists", 3, "3+", "3/4", "-")
ROKKIT = ("Rokkit launcha", 6, "5+", "4/5", 'Blast 1"')
HAMMER = ("Smash hammer", 4, "3+", "5/6", "Brutal")
KOMPETITIVE = "Kompetitive Streak: Once per Shoot, if it shoots an enemy another friendly operative already shot this TP (secondary targets count): gain 1 Wrecka point."
PULSA = ["Pulsa (weapon rule): No target. Place your Pulsa marker visible (or on visible Vantage) with 1 Pulsa point, then roll attack dice: +1 point per success (max +3). D3 dmg to each operative wholly within x\" (x = its points).",
         "Shokkwave: Operatives within x\" of your Pulsa marker get -2\" Move and Hit worsened by 1 (cumulative with injured). The marker loses 1 point each Ready step and is removed at 0."]

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
            "Select 1 Boss Nob: rokkit pistol + smash hammer, or two rokkit pistols + choppa.",
            "Select 2 Bomb Squigs.",
            "Select 5 other operatives. Other than Breaka Boy Fighters and Tankbusta Gunners, each only once.",
        ],
    },
    "factionRules": [
        ("Wrecka Rampage", "Shooting, fighting or retaliating, Roll Attack Dice step: gain 1 Wrecka point per retained 6, and spend up to 2 points (not for Bomb Squigs) to retain fails as normals. Max 6 points; if you start the action on 6, you can only spend."),
        ("Tanked Up", "The first Charge, Shoot or Fight (not Guard) an operative on Engage makes each activation/counteraction (not Bomb Squigs): +1 APL until the start of its next activation."),
    ],
    "ploys": {
        "strategy": [
            ("Destruction", "Ranged weapons gain Saturate."),
            ("Amped Up", "Each operative on Engage regains up to D3+1 wounds."),
            ("Waaagh!", "Melee weapons gain Balanced."),
            ("Tuff Gitz", "An operative on Engage being shot: re-roll one defence die."),
        ],
        "firefight": [
            ("Proppa Scrap", "A Breaka Boy or the Boss Nob can Fight twice this activation."),
            ("Kaboom!", "Shooting a Blast weapon: +1\" Blast and Severe vs the primary target for the action (not with Drill Rokkits)."),
            ("Just a Scratch", "Normal Dmg on an operative (not a Bomb Squig): ignore it."),
            ("Demolition Job", "After a Shoot or Fight (before removals): place a Demolition marker in the target's control range. Until the next Ready step, attacking an operative within 3\" of it lets you spend a Wrecka point for free."),
        ],
    },
    "equipment": [
        {"id": "engine_oil", "name": "Engine Oil", "desc": "Once/TP, an operative (not a Bomb Squig) activates: ignore injured stat changes this activation."},
        {"id": "glyphs", "name": "Glyphs", "desc": "Pick Waaagh! or Destruction: its first use costs 0CP, and later uses cost 0CP if you have any Wrecka points."},
        {"id": "drill_rokkits", "name": "Drill Rokkits", "desc": "Once/TP shooting a rokkit launcha or 'eavy rokkit launcha: it loses Blast and gains Piercing 1 for the action."},
        {"id": "extra_armour", "name": "Extra Armour", "desc": "Operatives (not Bomb Squigs) get -1\" Move and Save +1 (not with a Portable Barricade's Protective rule)."},
    ],
    "operatives": [
        wk("boss_nob", "Wrecka Boss Nob",
           [("Rokkit pistol", 6, "5+", "4/5", 'Range 8", Blast 1"'), ("Two rokkit pistols (focused)", 6, "4+", "4/5", 'Range 8", Blast 1", Ceaseless'), ("Two rokkit pistols (salvo)", 6, "5+", "4/5", 'Range 8", Blast 1", Salvo')],
           [("Choppa", 4, "3+", "4/5", "-"), HAMMER],
           ["Loadout: rokkit pistol + smash hammer, or two rokkit pistols + choppa.",
            "Wrecka Boss: Gain 1 Wrecka point when it Shoots or Fights (not Guard).",
            "Salvo (weapon rule): Pick two valid targets not in friendly control range; shoot both primaries, then each secondary, each only once, rolling separately."],
           "LEADER, BOSS NOB", wounds=14, pts=40),
        wk("bomb_squig", "Wrecka Bomb Squig", [("Explosives", 6, "4+", "4/5", 'Blast 1", Limited 1, Explosive')], [("Bite", 3, "4+", "4/5", "-")],
           ["Explosive (weapon rule): Can shoot in enemy control range; it is the primary target (no cover or obscured).",
            "Stoopid: Can't be given Conceal in the Firefight phase. Only Charge, Dash, Fight, Reposition and Shoot; own weapons only.",
            "Boom!: Incapacitated without having used its explosives: roll one or two D6; on any 4+ it shoots its explosives before removal.",
            "Expendable: Ignored for kill/elimination ops and for escape/survive/incapacitate scoring."],
           "BOMB SQUIG", wounds=5, save="5+", pts=25),
        wk("demolisha", "Breaka Boy Demolisha", [], [("Tankhammer (bash)", 4, "3+", "4/5", "-"), ("Tankhammer (detonate)", 4, "3+", "0/0", "Lethal 5+, Limited 1, Detonate")],
           ["Detonate (weapon rule): First time it would damage an enemy: D6+6 (2D6+6 for a crit) to that enemy and each other operative in its control range, which can't be ignored or reduced. Then the action ends; gain 1 Wrecka point +1 per operative incapacitated.",
            "Reckless Temperament: Normal Dmg of 4+ inflicts 1 less on it; on Engage, Crit Dmg of 4+ too."],
           "BREAKA BOY, DEMOLISHA"),
        wk("fighter", "Breaka Boy Fighter", [], [HAMMER],
           ["Break Stuff (1AP): A terrain feature in control range: remove it if it's equipment terrain; otherwise place a Breach marker by it. Operatives within 1\" of the marker treat parts of it up to 1\" thick as Accessible. Not within enemy control range."],
           "BREAKA BOY, FIGHTER"),
        wk("krusha", "Breaka Boy Krusha", [], [("Knucklebustas", 4, "3+", "5/6", "Brutal, Shock, Smash")],
           ["Smash (weapon rule): Each strike, you can push the enemy up to 1\" straight away from this, then move this up to 1\" to stay in its control range.",
            "Armoured Up: When it's shot, fighting or retaliating, your opponent can only retain 6s as crits."],
           "BREAKA BOY, KRUSHA"),
        wk("gunner_eavy", "Tankbusta Gunner ('eavy rokkit launcha)", [("'Eavy rokkit launcha", 6, "4+", "4/5", 'Blast 1", Heavy (Dash only)')], [FISTS], [KOMPETITIVE], "TANKBUSTA, GUNNER"),
        wk("gunner_rokkit", "Tankbusta Gunner (rokkit launcha)", [ROKKIT], [FISTS], [KOMPETITIVE], "TANKBUSTA, GUNNER"),
        wk("rokkiteer_pulsa", "Tankbusta Rokkiteer (pulsa rokkit)", [("Pulsa rokkit", 6, "5+", "0/0", "Heavy (Reposition only), Limited 1, Pulsa"), ROKKIT], [FISTS], PULSA, "TANKBUSTA, ROKKITEER"),
        wk("rokkiteer_rack", "Tankbusta Rokkiteer (rokkit rack)", [ROKKIT, ("Rokkit rack", 6, "5+", "4/5", 'Blast 2", Heavy (Reposition only), Limited 1, Relentless')], [FISTS], [], "TANKBUSTA, ROKKITEER"),
    ],
}
