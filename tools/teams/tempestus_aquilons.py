LASPISTOL = ("Hot-shot laspistol", 4, "3+", "3/4", 'Range 8"')
LASCARBINE = ("Hot-shot lascarbine", 4, "3+", "3/4", "-")
FISTS = ("Fists", 3, "4+", "2/3", "-")
MACHINE = ["Machine: Only Dash, Fall Back, Reposition and Shoot; can't retaliate, assist or use other weapons.",
           "Turret: Can Shoot twice per activation."]

def aq(oid, name, ranged, melee, abilities, kw, apl=2, wounds=8, save="4+", move='6"', pts=28):
    return {"id": oid, "name": "Aquilon " + name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def sentry(oid, label, ranged):
    return aq(oid, "Servo-sentry (" + label + ")", ranged, [], MACHINE, "SERVO-SENTRY", wounds=10, save="3+", move='4"', pts=40)

TEAM = {
    "id": "aquilons", "source": "tempestus_aquilons", "name": "Tempestus Aquilons", "badge": "ASTRA MILITARUM", "color": "#4A5A7A",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Tempestor", "min": 1, "max": 1, "ids": ["tempestor"]},
            {"name": "Servo-sentry", "desc": "1 Servo-sentry", "min": 1, "max": 1, "ids": ["sentry_flamer", "sentry_launcher", "sentry_volley"]},
            {"name": "Operatives", "desc": "9 Aquilons from the list below", "min": 9, "max": 9,
             "ids": ["grenadier", "gunfighter", "gunner_melta", "gunner_plasma", "marksman", "precursor", "trooper"]},
        ],
        "repeatable": ["trooper"],
        "rules": [
            "Select 1 Tempestor: hot-shot laspistol + power weapon, relic bolt pistol + chainsword, or hot-shot lascarbine + fists.",
            "Select 1 Servo-sentry: flamer, grenade launcher or hot-shot volley gun.",
            "Select 9 other operatives. Other than Troopers, each only once (the two Gunners are separate entries).",
        ],
    },
    "factionRules": [
        ("Drop Insertion", "Set up the first third of your team as normal. Each later third can be set up above (the whole third), placing a Drop marker wholly in your drop zone. STRATEGIC GAMBIT in turning point 1 and turning point 2: move Drop markers up to 4\" horizontally."),
        ("Landing", "An operative set up above activates as normal: expend it or land it within 3\" horizontally of a Drop marker or wholly in your drop zone, not in enemy control range (Precursor can be), not under Vantage, with any order. It counts as a Reposition and is obscured until the end of the next activation or the turning point."),
        ("Drop limits", "By the end of turning point 1, more than half your operatives must have been set up in the killzone. In the turning point 2 and turning point 3 Ready steps, remove a Drop marker; any still above at end of turning point 2 are incapacitated."),
        ("Grav-chute", "When dropping, ignore the vertical distance."),
    ],
    "ploys": {
        "strategy": [
            ("Sudden Offensive", "Halve your surviving operatives (round up) = x: the first x operatives you activate this turning point gain Balanced for their activation."),
            ("Maintain Momentum", "Attacking a ready enemy: Severe."),
            ("Eye Above", "An enemy and others within 3\" gain Detected tokens this turning point. When they shoot an Aquilon, re-roll one defence die; when they fight one, one block can block two successes."),
            ("Drop and Secure", "Pick a marker: until the next Ready step, your contesting total APL counts +1, and Aquilons within 3\" get +1 melee Atk (max 4)."),
        ],
        "firefight": [
            ("Hot Drop", "After rolling attack dice for an Aquilon wholly in enemy territory, or that landed or dropped 2\"+ from Vantage this activation: if the target is within 6\", re-roll any."),
            ("Adjust Coordinates", "An Aquilon lands: set it up within 5\" of a Drop marker; it can't Dash, Shoot or Fight this turning point."),
            ("Tempestus Exemplars", "During an activation (not Servo-sentry or APL above 2): Pick Up, Place Marker or a mission action costs 1 less AP."),
            ("Progena", "An Aquilon (not Servo-sentry) activates: regain up to 2D3 wounds and ignore APL changes this activation."),
        ],
    },
    "equipment": [
        {"id": "tempestus_daggers", "name": "Tempestus Daggers", "desc": "Aquilons (not Servo-sentry) gain a Tempestus dagger.", "gw": ("melee", "Tempestus dagger", 3, "4+", "3/4", "-"), "ex": ["sentry_flamer", "sentry_launcher", "sentry_volley"]},
        {"id": "combat_stimms", "name": "Combat Stimms", "desc": "Ignore Move changes from being injured."},
        {"id": "drop_augury", "name": "Drop Augury", "desc": "Once per battle, when an operative set up above activates: move one Drop marker again, not closer to the enemy drop zone."},
        {"id": "remote_overseer", "name": "Remote Overseer", "desc": "Once per battle, re-roll your initiative roll-off."},
    ],
    "operatives": [
        aq("tempestor", "Tempestor", [LASCARBINE, LASPISTOL, ("Relic bolt pistol", 4, "3+", "3/5", 'Range 8", Lethal 5+')],
           [("Chainsword", 4, "3+", "4/5", "-"), ("Fists", 3, "3+", "2/3", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: hot-shot laspistol + power weapon, relic bolt pistol + chainsword, or hot-shot lascarbine + fists.",
            "Tempestus Veteran: Once per battle, a firefight ploy for 0CP on this operative, or Command Re-roll for 0CP on its dice.",
            "Command (1AP): SUPPORT. Another Aquilon (not Servo-sentry) visible within 6\": +1 APL until end of its next activation. Not within enemy control range."],
           "LEADER, TEMPESTOR", apl=3, wounds=9),
        sentry("sentry_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
        sentry("sentry_launcher", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
        sentry("sentry_volley", "hot-shot volley gun", [("Hot-shot volley gun (focused)", 5, "4+", "3/4", "Piercing Crits 1"), ("Hot-shot volley gun (sweeping)", 4, "4+", "3/4", 'Piercing Crits 1, Torrent 1"')]),
        aq("grenadier", "Grenadier", [LASPISTOL, ("Melta bomb", 4, "3+", "5/3", 'Range 3", Devastating 3, Heavy (Reposition only), Limited 1, Piercing 2')], [FISTS],
           ["Grenadier: Can use frag, krak, smoke and stun grenades without using up equipment limits; frag/krak Hit +1."], "GRENADIER"),
        aq("gunfighter", "Gunfighter", [("Hot-shot laspistols (focused)", 4, "3+", "3/4", 'Range 8", Ceaseless, Rending'), ("Hot-shot laspistols (salvo)", 4, "4+", "3/4", 'Range 8", Salvo')],
           [("Hot-shot laspistols (point-blank)", 4, "3+", "3/4", "Ceaseless")],
           ["Salvo (weapon rule): Shoot two different valid targets not in friendly control range, rolling separately.",
            "Gunfight: An enemy within 8\" shoots it: after the action (before removals), it can make a free Shoot back at that enemy with the focused profile, rolling attack dice equal to the enemy's failed dice + 1 (max 4); it can switch to Engage."],
           "GUNFIGHTER"),
        aq("gunner_melta", "Gunner (melta carbine)", [("Melta carbine", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "GUNNER"),
        aq("gunner_plasma", "Gunner (plasma carbine)", [("Plasma carbine (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma carbine (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "GUNNER"),
        aq("marksman", "Marksman", [("Hot-shot long-las (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Hot-shot long-las (mobile)", 4, "3+", "3/4", "-"), ("Hot-shot long-las (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [FISTS],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
            "Sniper's Vantage: On Vantage, shooting an operative on Engage at least 2\" lower: long-las gains Severe."],
           "MARKSMAN"),
        aq("precursor", "Precursor", [LASPISTOL], [("Tempestus dagger", 4, "3+", "3/4", "Ceaseless, Lethal 5+")],
           ["Vicious Knife Fighter: Fighting: after resolving your first attack dice, resolve another immediately.",
            "Dynamic: After a Shoot or Fight, a free Dash (even if it Charged)."],
           "PRECURSOR"),
        aq("trooper", "Trooper", [LASCARBINE], [FISTS],
           ["Rapid Insertion: STRATEGIC GAMBIT in turning point 1: each Trooper wholly in your drop zone makes a free Reposition, ending wholly within 3\" of it.",
            "Swift Landing: When it lands, it can be set up within 4\" of a Drop marker."],
           "TROOPER"),
    ],
}
