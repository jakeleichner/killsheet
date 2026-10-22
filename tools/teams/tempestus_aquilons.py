LASPISTOL = ("Hot-shot laspistol", 4, "3+", "3/4", 'Range 8"')
LASCARBINE = ("Hot-shot lascarbine", 4, "3+", "3/4", "-")
FISTS = ("Fists", 3, "4+", "2/3", "-")
MACHINE = ["Machine: It can only Dash, Fall Back, Reposition and Shoot. It can't retaliate, assist or use other weapons.",
           "Turret: It can Shoot twice in each activation."]

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
            "Select 1 Tempestor, armed with a hot-shot laspistol and power weapon, a relic bolt pistol and chainsword, or a hot-shot lascarbine and fists.",
            "Select 1 Servo-sentry with a flamer, grenade launcher or hot-shot volley gun.",
            "Select 9 other operatives. You can take several Troopers, but every other operative only once (the two Gunners count as separate operatives).",
        ],
    },
    "factionRules": [
        ("Drop Insertion", "Set up the first third of your team as normal. Each later third can be set up above instead (the whole third), placing a Drop marker wholly in your drop zone. As a STRATEGIC GAMBIT in the first and second turning points, move Drop markers up to 4\" horizontally."),
        ("Landing", "An operative set up above activates as normal: expend it, or land it within 3\" horizontally of a Drop marker or wholly in your drop zone. It can't land in enemy control range (the Precursor can) or under Vantage terrain, and takes any order. Landing counts as a Reposition, and it's obscured until the end of the next activation or the turning point."),
        ("Drop limits", "By the end of the first turning point, more than half your operatives must have been set up in the killzone. In the Ready steps of the second and third turning points, remove a Drop marker. Any operatives still above at the end of the second turning point are incapacitated."),
        ("Grav-chute", "When dropping, ignore the vertical distance."),
    ],
    "ploys": {
        "strategy": [
            ("Sudden Offensive", "Halve your surviving operatives (rounding up). That many operatives, the first ones you activate this turning point, gain Balanced for their activation."),
            ("Maintain Momentum", "When shooting or fighting a ready enemy (not retaliating), weapons gain Severe."),
            ("Eye Above", "An enemy and others within 3\" of it gain Detected tokens this turning point. When they shoot an Aquilon, re-roll one defence die. When they fight one, one block can block two successes."),
            ("Drop and Secure", "Pick a marker. Until the next Ready step, your contesting operatives' total APL counts as 1 higher, and Aquilons within 3\" of it get +1 Atk on melee weapons (to a maximum of 4)."),
        ],
        "firefight": [
            ("Hot Drop", "After rolling attack dice for an Aquilon that's wholly in enemy territory, or that landed or dropped 2\" or more from Vantage terrain this activation, re-roll any of them if the target is within 6\"."),
            ("Adjust Coordinates", "When an Aquilon lands, set it up within 5\" of a Drop marker. It can't Dash, Shoot or Fight this turning point."),
            ("Tempestus Exemplars", "During an activation (not the Servo-sentry, and not with APL above 2), Pick Up Marker, Place Marker or a mission action costs 1 less AP."),
            ("Progena", "When an Aquilon (not the Servo-sentry) activates, it regains up to 2D3 wounds and ignores APL changes for that activation."),
        ],
    },
    "equipment": [
        {"id": "tempestus_daggers", "name": "Tempestus Daggers", "desc": "Aquilons (not the Servo-sentry) get a Tempestus dagger.", "gw": ("melee", "Tempestus dagger", 3, "4+", "3/4", "-"), "ex": ["sentry_flamer", "sentry_launcher", "sentry_volley"]},
        {"id": "combat_stimms", "name": "Combat Stimms", "desc": "Ignore Move changes from being injured."},
        {"id": "drop_augury", "name": "Drop Augury", "desc": "Once per battle, when an operative set up above activates, move one Drop marker again, not closer to the enemy drop zone."},
        {"id": "remote_overseer", "name": "Remote Overseer", "desc": "Once per battle, re-roll your initiative roll-off."},
    ],
    "operatives": [
        aq("tempestor", "Tempestor", [LASCARBINE, LASPISTOL, ("Relic bolt pistol", 4, "3+", "3/5", 'Range 8", Lethal 5+')],
           [("Chainsword", 4, "3+", "4/5", "-"), ("Fists", 3, "3+", "2/3", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: a hot-shot laspistol and power weapon, a relic bolt pistol and chainsword, or a hot-shot lascarbine and fists.",
            "Tempestus Veteran: Once per battle, use a firefight ploy for 0CP on it, or Command Re-roll for 0CP on its dice.",
            "Command (1AP): SUPPORT. Another Aquilon (not the Servo-sentry) visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
           "LEADER, TEMPESTOR", apl=3, wounds=9),
        sentry("sentry_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
        sentry("sentry_launcher", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
        sentry("sentry_volley", "hot-shot volley gun", [("Hot-shot volley gun (focused)", 5, "4+", "3/4", "Piercing Crits 1"), ("Hot-shot volley gun (sweeping)", 4, "4+", "3/4", 'Piercing Crits 1, Torrent 1"')]),
        aq("grenadier", "Grenadier", [LASPISTOL, ("Melta bomb", 4, "3+", "5/3", 'Range 3", Devastating 3, Heavy (Reposition only), Limited 1, Piercing 2')], [FISTS],
           ["Grenadier: It can use frag, krak, smoke and stun grenades without using up equipment, and gets +1 to Hit with frag and krak grenades."], "GRENADIER"),
        aq("gunfighter", "Gunfighter", [("Hot-shot laspistols (focused)", 4, "3+", "3/4", 'Range 8", Ceaseless, Rending'), ("Hot-shot laspistols (salvo)", 4, "4+", "3/4", 'Range 8", Salvo')],
           [("Hot-shot laspistols (point-blank)", 4, "3+", "3/4", "Ceaseless")],
           ["Salvo (weapon rule): Shoot two different valid targets that aren't in friendly control range, rolling separately.",
            "Gunfight: When an enemy within 8\" shoots it, after the action (before removing anything), it can make a free Shoot back at that enemy with the focused profile. It rolls attack dice equal to the enemy's failed dice plus 1 (up to 4), and can switch to Engage to do so."],
           "GUNFIGHTER"),
        aq("gunner_melta", "Gunner (melta carbine)", [("Melta carbine", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "GUNNER"),
        aq("gunner_plasma", "Gunner (plasma carbine)", [("Plasma carbine (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma carbine (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "GUNNER"),
        aq("marksman", "Marksman", [("Hot-shot long-las (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Hot-shot long-las (mobile)", 4, "3+", "3/4", "-"), ("Hot-shot long-las (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [FISTS],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
            "Sniper's Vantage: When it's on Vantage terrain and shoots an operative with an Engage order at least 2\" lower, its long-las gains Severe."],
           "MARKSMAN"),
        aq("precursor", "Precursor", [LASPISTOL], [("Tempestus dagger", 4, "3+", "3/4", "Ceaseless, Lethal 5+")],
           ["Vicious Knife Fighter: When it fights, after resolving your first attack die, resolve another straight away.",
            "Dynamic: After a Shoot or Fight, it makes a free Dash, even if it Charged."],
           "PRECURSOR"),
        aq("trooper", "Trooper", [LASCARBINE], [FISTS],
           ["Rapid Insertion: STRATEGIC GAMBIT in the first turning point. Each Trooper wholly in your drop zone makes a free Reposition, ending wholly within 3\" of it.",
            "Swift Landing: When it lands, it can be set up within 4\" of a Drop marker."],
           "TROOPER"),
    ],
}
