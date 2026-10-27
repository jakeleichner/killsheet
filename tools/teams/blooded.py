LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
BAYONET = ("Bayonet", 3, "4+", "2/3", "-")

def tr(oid, name, ranged, melee, abilities, kw, save="5+", wounds=7, pts=25):
    return {"id": oid, "name": "Traitor " + name, "apl": 2, "move": '6"', "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return tr(oid, "Gunner (" + label + ")", ranged, [BAYONET], [], "GUNNER")

CHIEF_ABILITIES = [
    "Blooded Icon: Once per turning point, when a friendly operative holding your Blooded token is incapacitated within 6\" of it, you regain that token.",
    "Lead With Strength: While it holds a Blooded token or is wholly in your opponent's territory, it counts as being under the Gaze of the Gods.",
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
            {"ids": LIST1, "max": 9, "label": "Up to 9 operatives from the first list (not counting Troopers)"},
            {"ids": ["gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "sharpshooter"], "max": 3, "label": "Up to 3 Gunners and Sharpshooters combined"},
            {"ids": ["chieftain_plasma", "gunner_plasma"], "max": 1, "label": "Only one operative with a plasma weapon"},
        ],
        "rules": [
            "Select 1 Chieftain, armed with an autopistol or laspistol plus a chainsword or power weapon; a bolt pistol and chainsword; a boltgun and bayonet; or a plasma pistol and improvised blade.",
            "Select 9 from the first list, then 4 more selections from Enforcer (counts as 2), Ogryn (counts as 2) and Troopers. Troopers can go in either list.",
            "You can take several Troopers, but every other operative only once.",
            "Up to 3 Gunners and Sharpshooters combined. Only one plasma weapon in the team (a plasma pistol Chieftain or a plasma Gunner).",
        ],
    },
    "factionRules": [
        ("Blooded", "You gain a Blooded token in each Ready step, the first time each turning point an enemy is incapacitated, and the first time each turning point a friendly operative dies within 6\" of an enemy. As a STRATEGIC GAMBIT, hand out your tokens (one per operative at most). If 4 or more token holders are in the killzone, one of them is under the Gaze of the Gods until the end of the turning point. Token holders' weapons gain Accurate 1, and under the Gaze, one of those Accurate successes can be a critical success."),
    ],
    "ploys": {
        "strategy": [
            ("Reckless Aspirant", "When it's wholly in your opponent's territory, its weapons gain Accurate 1 when it shoots or fights, or Punishing if it holds a token."),
            ("Malevolent Grit", "When one holding a token, or wholly in your opponent's territory, is shot, re-roll one defense die."),
            ("Glory Kill", "Pick an enemy visible to one of your Blooded operatives. Until the end of the turning point, weapons attacking it gain Ceaseless, or Relentless if the attacker holds a token."),
            ("Bitter Demise", "When a Blooded operative is incapacitated, roll a D3. On a 3 (or 2+ if it held a token), inflict that much damage on an enemy visible within 2\" of it."),
        ],
        "firefight": [
            ("Moment of Repute", "During the activation of the operative under the Gaze of the Gods, it gets +1 APL."),
            ("Reward Earned", "When a token holder incapacitates an enemy within 2\" of it, gain a Blooded token."),
            ("Callous Disregard", "When one Shoots, friendly operatives in the target's control range don't stop it targeting. Each failed attack die inflicts damage equal to its result on one friendly operative in the target's control range."),
            ("Dark Favor", "When a token holder is picked as the target of a Shoot or Fight, another Blooded operative visible within 3\" becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."),
        ],
    },
    "equipment": [
        {"id": "sinister_trophies", "name": "Sinister Trophies", "desc": "Enemies attacking a token holder within 2\" of it can't re-roll attack dice results of 1."},
        {"id": "bloody_worship", "name": "Symbols of Bloody Worship", "desc": "After an action in which it damaged an enemy and survived, it regains 1 wound."},
        {"id": "chaos_sigil", "name": "Chaos Sigil", "desc": "Reward Earned costs 0CP."},
        {"id": "wicked_blades", "name": "Wicked Blades", "desc": "Bayonets, bayonet and shield, and improvised blades get +1 Normal and Critical Dmg."},
    ],
    "operatives": [
        tr("chieftain", "Chieftain", [("Autopistol", 4, "3+", "2/3", 'Range 8"'), ("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Boltgun", 4, "3+", "3/4", "-"), ("Laspistol", 4, "3+", "2/3", 'Range 8"')],
           [("Bayonet", 3, "3+", "2/3", "-"), ("Chainsword", 4, "3+", "4/5", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: an autopistol or laspistol plus a chainsword or power weapon; a bolt pistol and chainsword; or a boltgun and bayonet."] + CHIEF_ABILITIES,
           "LEADER, CHIEFTAIN", wounds=8),
        tr("chieftain_plasma", "Chieftain (plasma pistol)", [("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [("Improvised blade", 4, "3+", "2/3", "-")], ["Loadout: a plasma pistol and an improvised blade."] + CHIEF_ABILITIES,
           "LEADER, CHIEFTAIN", wounds=8),
        tr("grenadier", "Brimstone Grenadier", [("Diabolyk bomb", 4, "3+", "4/3", 'Range 6", Blast 2", Devastating 2, Limited 1, Heavy (Reposition only), Piercing 1, Saturate'), LASGUN], [BAYONET],
           ["Grenadier: It can use frag and krak grenades without using up equipment, and gets +1 to Hit with them.",
            "Explosive Demise: When it's incapacitated, roll 2D6 (1D6 if it's in enemy control range). On any 4+, inflict D3+2 damage (D6+2 if its bomb is unused) on each operative visible within 2\" of it."],
           "BRIMSTONE GRENADIER"),
        tr("butcher", "Butcher", [], [("Power weapon & cleaver", 4, "3+", "4/6", "Ceaseless, Lethal 5+, Blood Offering")],
           ["Blood Offering (weapon rule): On your first critical strike in a sequence, gain a Blooded token.",
            "Unholy Sustenance: When it kills an enemy while fighting or retaliating, it regains up to D3 wounds."],
           "BUTCHER", wounds=8),
        tr("commsman", "Commsman", [LASGUN], [BAYONET],
           ["Signal (1AP): SUPPORT. Pick another Blooded operative (not an Ogryn) visible within 6\". It gets +1 APL until the end of its next activation. It can't do this within enemy control range.",
            "Sacrilegious Actuation (1AP): If it holds a Blooded token, gain another token. It can't do this within enemy control range."],
           "COMMSMAN"),
        tr("corpseman", "Corpseman", [LASGUN], [BAYONET, ("Stimm needle", 3, "5+", "1/4", "Lethal 5+")],
           ["Regular Dosage: At the end of Select Operatives, one other Blooded operative gains a STIMM rule for the battle (not Rejuvenated).",
            "Stimms (1AP): A Blooded operative in its control range gains Rejuvenated or another STIMM rule (each one once per operative). It can't do this within enemy control range.",
            "STIMM rules: Rejuvenated (regain up to 2D3 wounds). Enraged (melee weapons gain Relentless). Fortified (whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 5+, subtract 1 from that damage)."],
           "CORPSEMAN"),
        tr("enforcer", "Enforcer", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"')], [("Power fist", 4, "4+", "5/7", "Brutal")],
           ["Grueling Disciplinarian: Blooded operatives within 6\" of it ignore stat changes from being injured. One activated within 6\" ignores them for that whole activation.",
            "Enforce (1AP): Another Blooded operative visible within 3\" makes a free 1AP action, moving no more than 2\". A Commsman can't Signal or use Sacrilegious Actuation this way. It can't do this within enemy control range."],
           "ENFORCER", save="4+", wounds=9, pts=32),
        tr("flenser", "Flenser", [], [("Skinning blades", 4, "3+", "3/4", "Ceaseless, Stalk")],
           ["Stalk (weapon rule): While Light or Heavy terrain is in its control range, it gains Lethal 5+.",
            "Wretched: It can Charge while it has a Conceal order. If it's incapacitated during a Fight action, it strikes with one unresolved success before it's removed."],
           "FLENSER"),
        gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
        gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
        gunner("gunner_melta", "meltagun", [("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
        gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
        tr("ogryn", "Ogryn", [], [("Power maul & mutant claw", 4, "3+", "5/6", "Rending, Shock")],
           ["Avalanche of Muscle: After its Charge move, inflict D3 damage on one enemy in its control range.",
            "Chem-enhanced: It ignores APL changes and isn't affected by enemy Shock or Stun.",
            "Brute: While it has a Conceal order, it can't use Light terrain for cover when it's targeted. It still keeps its cover save.",
            "Slow-witted: Pick Up Marker and mission actions cost it 1 extra AP (but not Operate Hatch)."],
           "OGRYN", wounds=16, pts=40),
        tr("sharpshooter", "Sharpshooter", [("Long-las (mobile)", 4, "3+", "3/4", "-"), ("Long-las (stationary)", 4, "2+", "3/3", "Devastating 1, Heavy (Dash only), Silent")], [BAYONET],
           ["Camo Cloak: When it's shot and retains cover saves, it can retain one extra. Not with Vantage terrain.",
            "A Name Whispered In Blood: STRATEGIC GAMBIT in the first turning point. Pick an enemy. When it shoots that enemy, it counts as holding a token and being under the Gaze of the Gods."],
           "SHARPSHOOTER"),
        tr("thug", "Thug", [], [("Heavy club", 4, "3+", "4/4", "Brutal")],
           ["Tough: When it fights, retaliates or is shot, Normal Dmg of 3 or more inflicts 1 less damage."], "THUG", save="4+"),
        tr("trench_sweeper", "Trench Sweeper", [("Shotgun", 4, "3+", "3/3", 'Range 6"')], [("Bayonet & shield", 3, "3+", "2/3", "Shield")],
           ["Shield (weapon rule): When fighting or retaliating with it, each block can block two unresolved successes.",
            "Shielding: When activated, until its next activation it gets -2\" Move and can re-roll any defense dice when shot."],
           "TRENCH SWEEPER", save="4+", wounds=9),
        tr("trooper", "Trooper", [LASGUN], [BAYONET],
           ["Group Activation: When it's expended, activate another ready Trooper next (no more than two in a row)."], "TROOPER"),
    ],
}
