LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
BAYONET = ("Bayonet", 3, "4+", "2/3", "-")

def tr(oid, name, ranged, melee, abilities, kw, save="5+", wounds=7, pts=25):
    return {"id": oid, "name": "Traitor " + name, "apl": 2, "move": '6"', "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return tr(oid, "Gunner (" + label + ")", ranged, [BAYONET], [], "GUNNER")

CHIEF_ABILITIES = [
    "Blooded Icon: Once per turning point, when a friendly with your Blooded token is incapacitated within 6\" of this, regain that token.",
    "Lead With Strength: While it has a Blooded token or is wholly in the opponent's territory, it counts as under the GAZE OF THE GODS.",
]
CHIEF_MELEE_ALL = [BAYONET, ("Chainsword", 4, "3+", "4/5", "-"), ("Improvised blade", 4, "3+", "2/3", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")]
LIST1 = ["grenadier", "butcher", "commsman", "corpseman", "flenser", "gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "sharpshooter", "thug", "trench_sweeper"]

TEAM = {
    "id": "blooded", "source": "blooded", "name": "Blooded", "badge": "CHAOS", "color": "#9C3B2E",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 14,
        "groups": [
            {"name": "Leader", "desc": "1 Chieftain", "min": 1, "max": 1, "ids": ["chieftain", "chieftain_plasma"]},
            {"name": "Operatives", "desc": "9 operatives from the first list", "min": 9, "max": 13, "ids": LIST1 + ["trooper"]},
            {"name": "Enforcer & Ogryn", "desc": "4 more from: Enforcer (2 selections), Ogryn (2 selections), Troopers", "min": 0, "max": 4, "ids": ["enforcer", "ogryn"]},
        ],
        "pools": [{"groups": ["Operatives", "Enforcer & Ogryn"], "min": 13, "max": 13, "label": "Operatives (both lists)"}],
        "repeatable": ["trooper"],
        "cost": {"enforcer": 2, "ogryn": 2},
        "caps": [
            {"ids": LIST1, "max": 9, "label": "Max 9 operatives from the first list (besides Troopers)"},
            {"ids": ["gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "sharpshooter"], "max": 3, "label": "Max 3 Gunners and Sharpshooter combined"},
            {"ids": ["chieftain_plasma", "gunner_plasma"], "max": 1, "label": "Only one operative with a plasma weapon"},
        ],
        "rules": [
            "Select 1 Chieftain: (autopistol or laspistol) + (chainsword or power weapon), bolt pistol + chainsword, boltgun + bayonet, or plasma pistol + improvised blade.",
            "Select 9 from the first list, then 4 more selections from Enforcer (counts as 2), Ogryn (counts as 2) and Troopers. Troopers can fill either list.",
            "Other than Troopers, each operative only once.",
            "Max 3 Gunners and Sharpshooter combined. Only one plasma weapon in the team (plasma pistol Chieftain or plasma Gunner).",
        ],
    },
    "factionRules": [
        ("Blooded", "Gain a Blooded token each Ready step, the first time each turning point an enemy is incapacitated, and the first time each turning point a friendly dies within 6\" of an enemy. STRATEGIC GAMBIT: assign tokens (max one per operative); with 4+ token-holders in the killzone, one is under the GAZE OF THE GODS until end of turning point. Token-holders' weapons gain Accurate 1; under the Gaze, one of those Accurate successes can be a crit."),
    ],
    "ploys": {
        "strategy": [
            ("Reckless Aspirant", "Wholly in the opponent's territory: without a token, weapons gain Accurate 1 when shooting/fighting; with a token, Punishing."),
            ("Malevolent Grit", "Shot while holding a token or wholly in the opponent's territory: re-roll one defence die."),
            ("Glory Kill", "Pick an enemy until end of turning point: attacking it gives Ceaseless (Relentless with a token)."),
            ("Bitter Demise", "Blooded incapacitated: roll D3, on 3 (2+ with a token) that much damage to an enemy visible within 2\"."),
        ],
        "firefight": [
            ("Moment of Repute", "During the activation of the operative under the Gaze: +1 APL."),
            ("Reward Earned", "An enemy is incapacitated by a token-holder within 2\" of it: gain a Blooded token."),
            ("Callous Disregard", "On a Shoot, friendlies in the target's control range don't block targeting; each failed attack die deals its value as damage to one friendly in the target's control range."),
            ("Dark Favour", "A token-holder is targeted by a Shoot or Fight: another Blooded visible within 3\" becomes the target instead (cover/obscured only if the original was). Not against Blast/Torrent."),
        ],
    },
    "equipment": [
        {"id": "sinister_trophies", "name": "Sinister Trophies", "desc": "Enemies attacking a token-holder within 2\" can't re-roll attack dice results of 1."},
        {"id": "bloody_worship", "name": "Symbols of Bloody Worship", "desc": "After an action in which it damaged an enemy (and survived): regain 1 wound."},
        {"id": "chaos_sigil", "name": "Chaos Sigil", "desc": "Reward Earned costs 0CP."},
        {"id": "wicked_blades", "name": "Wicked Blades", "desc": "Bayonets, bayonet & shield and improvised blades get +1 to both Normal and Critical Dmg."},
    ],
    "operatives": [
        tr("chieftain", "Chieftain", [("Autopistol", 4, "3+", "2/3", 'Range 8"'), ("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Boltgun", 4, "3+", "3/4", "-"), ("Laspistol", 4, "3+", "2/3", 'Range 8"')],
           [("Bayonet", 3, "3+", "2/3", "-"), ("Chainsword", 4, "3+", "4/5", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: (autopistol or laspistol) + (chainsword or power weapon), bolt pistol + chainsword, or boltgun + bayonet."] + CHIEF_ABILITIES,
           "LEADER, CHIEFTAIN", wounds=8),
        tr("chieftain_plasma", "Chieftain (plasma pistol)", [("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [("Improvised blade", 4, "3+", "2/3", "-")], ["Loadout: plasma pistol + improvised blade."] + CHIEF_ABILITIES,
           "LEADER, CHIEFTAIN", wounds=8),
        tr("grenadier", "Brimstone Grenadier", [("Diabolyk bomb", 4, "3+", "4/3", 'Range 6", Blast 2", Devastating 2, Limited 1, Heavy (Reposition only), Piercing 1, Saturate'), LASGUN], [BAYONET],
           ["Grenadier: Can use frag and krak grenades without using up equipment limits; Hit +1 with them.",
            "Explosive Demise: When incapacitated, roll 2D6 (1D6 if in enemy control range); any 4+: D3+2 damage (D6+2 if its bomb is unused) to each operative visible within 2\"."],
           "BRIMSTONE GRENADIER"),
        tr("butcher", "Butcher", [], [("Power weapon & cleaver", 4, "3+", "4/6", "Ceaseless, Lethal 5+, Blood Offering")],
           ["Blood Offering (weapon rule): First crit strike in a sequence: gain a Blooded token.",
            "Unholy Sustenance: Kills the enemy while fighting/retaliating: regain up to D3 wounds."],
           "BUTCHER", wounds=8),
        tr("commsman", "Commsman", [LASGUN], [BAYONET],
           ["Signal (1AP): SUPPORT. Another Blooded (not Ogryn) visible within 6\": +1 APL until end of its next activation. Not within enemy control range.",
            "Sacrilegious Actuation (1AP): If it holds a Blooded token, gain another token. Not within enemy control range."],
           "COMMSMAN"),
        tr("corpseman", "Corpseman", [LASGUN], [BAYONET, ("Stimm needle", 3, "5+", "1/4", "Lethal 5+")],
           ["Regular Dosage: End of Select Operatives: one other Blooded gains a STIMM rule for the battle (not Rejuvenated).",
            "Stimms (1AP): A Blooded in control range gains Rejuvenated or another STIMM rule (each once per operative). Not within enemy control range.",
            "STIMM rules: Rejuvenated (regain up to 2D3 wounds); Enraged (melee Relentless); Fortified (Whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 5+, subtract 1 from that damage)."],
           "CORPSEMAN"),
        tr("enforcer", "Enforcer", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"')], [("Power fist", 4, "4+", "5/7", "Brutal")],
           ["Gruelling Disciplinarian: Blooded within 6\" ignore injured stat changes; Blooded activated within 6\" ignore them for that activation.",
            "Enforce (1AP): Another Blooded visible within 3\" makes a free 1AP action (max 2\" move; a Commsman can't Signal or Actuate). Not within enemy control range."],
           "ENFORCER", save="4+", wounds=9, pts=32),
        tr("flenser", "Flenser", [], [("Skinning blades", 4, "3+", "3/4", "Ceaseless, Stalk")],
           ["Stalk (weapon rule): Light or Heavy terrain in its control range: gains Lethal 5+.",
            "Wretched: Can Charge while Concealed. If incapacitated during the Fight action, strike with one unresolved success before removal."],
           "FLENSER"),
        gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
        gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
        gunner("gunner_melta", "meltagun", [("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
        gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
        tr("ogryn", "Ogryn", [], [("Power maul & mutant claw", 4, "3+", "5/6", "Rending, Shock")],
           ["Avalanche of Muscle: After its Charge move: D3 damage to one enemy in its control range.",
            "Chem-enhanced: Ignore APL changes; unaffected by enemy Shock and Stun.",
            "Brute: On Conceal, can't use Light terrain for cover when targeted (keeps cover save).",
            "Slow-witted: Pick Up Marker and mission actions cost +1AP (not Operate Hatch)."],
           "OGRYN", wounds=16, pts=40),
        tr("sharpshooter", "Sharpshooter", [("Long-las (mobile)", 4, "3+", "3/4", "-"), ("Long-las (stationary)", 4, "2+", "3/3", "Devastating 1, Heavy (Dash only), Silent")], [BAYONET],
           ["Camo Cloak: When shot, if retaining cover saves, retain one extra (not with Vantage).",
            "A Name Whispered In Blood: STRATEGIC GAMBIT in turning point 1. Pick an enemy: when shooting it, this counts as holding a token and under the Gaze."],
           "SHARPSHOOTER"),
        tr("thug", "Thug", [], [("Heavy club", 4, "3+", "4/4", "Brutal")],
           ["Tough: Fighting, retaliating or being shot: Normal Dmg of 3+ inflicts 1 less."], "THUG", save="4+"),
        tr("trench_sweeper", "Trench Sweeper", [("Shotgun", 4, "3+", "3/3", 'Range 6"')], [("Bayonet & shield", 3, "3+", "2/3", "Shield")],
           ["Shield (weapon rule): Fighting/retaliating with it, each block can block two unresolved successes.",
            "Shielding: On activation, until its next: -2\" Move, and re-roll any defence dice when shot."],
           "TRENCH SWEEPER", save="4+", wounds=9),
        tr("trooper", "Trooper", [LASGUN], [BAYONET],
           ["Group Activation: When expended, activate another ready Trooper next (max two in a row)."], "TROOPER"),
    ],
}
