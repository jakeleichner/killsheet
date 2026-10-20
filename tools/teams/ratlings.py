FISTS = ("Fists", 3, "5+", "1/2", "-")
SNIPER = [("Sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sniper rifle (stationary)", 4, "3+", "3/3", "Devastating 3, Heavy")]
SNIPER2 = [("Sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")]
SUPPRESSED = [("Suppressed sniper rifle (mobile)", 4, "3+", "3/4", "Silent"), ("Suppressed sniper rifle (stationary)", 4, "3+", "3/3", "Devastating 2, Heavy, Silent")]
BRUTE = "Brute: While Concealed, it can't use Light terrain for cover when targeted (it keeps any cover save)."
SLOW = "Slow-witted: Pick Up Marker and mission actions cost +1AP (not Operate Hatch)."

def rat(oid, name, ranged, melee, abilities, kw, save="5+", wounds=6, move='5"', pts=25, apl=2, prefix="Ratling "):
    return {"id": oid, "name": prefix + name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

RATLINGS = ["battlemutt", "big_shot", "bomber", "hardbit", "raider", "sneak", "sniper", "spotter", "stashmaster", "vox_thief"]

TEAM = {
    "id": "ratlings", "source": "ratlings", "name": "Ratlings", "badge": "ASTRA MILITARUM", "color": "#7A6A3A",
    "archetypes": "Security, Infiltration",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Fixer", "min": 1, "max": 1, "ids": ["fixer"]},
            {"name": "Ratlings", "desc": "Ratling operatives from the list below", "min": 7, "max": 10, "ids": RATLINGS},
            {"name": "Ogryns", "desc": "Bullgryns and Ogryns (max 3 combined)", "min": 0, "max": 3, "ids": ["bullgryn", "ogryn"]},
        ],
        "pools": [{"groups": ["Ratlings", "Ogryns"], "min": 7, "max": 10, "label": "Operatives (both lists)"}],
        "repeatable": ["sniper", "bullgryn", "ogryn"],
        "rules": [
            "Select 1 Fixer: battle rifle + fists, or sniper rifle + fists.",
            "Select 10 other operatives. Other than Bullgryns, Ogryns and Snipers, each only once.",
            "Max 3 Bullgryns and Ogryns combined. Up to three times, instead of one of these, you can pick a Ratling ploy to cost 0CP for the battle (so pick fewer operatives).",
            "A 'rifle' is any ranged weapon with 'rifle' in its name.",
        ],
    },
    "factionRules": [
        ("Scarper", "After each enemy activation: one Ratling (not Bullgryn, Ogryn or Sneak) can make a free Dash, not ending within 3\" of enemies unless hidden from all of them. Each once per TP, and not after the TP's final activation."),
    ],
    "ploys": {
        "strategy": [
            ("Shifty", "A Ratling (not Ogryn/Bullgryn) Concealed and in cover can't be targeted (except within 2\")."),
            ("Frontline Assault", "Bullgryns and Ogryns in the opponent's territory or within 3\" of an objective: weapons gain Balanced."),
            ("Sniper Positions", "More than 6\" from enemies and within 1\" of Heavy terrain: the stationary profile of its rifle gains Silent."),
            ("Crack Shots", "Shooting an enemy more than 6\" away, before any Charge, Fall Back or Reposition this activation (or as a counteraction): rifles gain Balanced."),
        ],
        "firefight": [
            ("Larcenous", "During a Ratling's activation (not Ogryn/Bullgryn): Pick Up and mission actions only need it to contest the marker, even in enemy control range."),
            ("Shoot and Hide", "After a Ratling on Engage shoots with a rifle: if more than 3\" from enemies or hidden from all of them, switch to Conceal."),
            ("Survival Instincts", "A Ratling (not Ogryn/Bullgryn) blocking: a normal can block a crit; a crit can block two successes."),
            ("Sharpshot", "Shooting with a rifle: friendly Ratlings in an enemy's control range don't stop you targeting it."),
        ],
    },
    "equipment": [
        {"id": "stolen_goods", "name": "Stolen Goods", "desc": "End of Select Operatives, roll D3: 1 you lose 1CP; 2 you gain 1CP; 3 your opponent loses 1CP."},
        {"id": "improvised_armour", "name": "Improvised Armour", "desc": "Bullgryns and Ogryns being shot: defence results of 5+ are crits."},
        {"id": "purloined_rations", "name": "Purloined Rations", "desc": "Once/TP after rolling attack dice with a rifle: Hit +1 for that sequence."},
        {"id": "lucky_round", "name": "Lucky Round", "desc": "Once/TP after rolling attack dice with a rifle: Severe for that sequence."},
    ],
    "operatives": [
        rat("fixer", "Fixer", [("Battle rifle", 4, "2+", "3/4", "-")] + SNIPER2, [FISTS],
            ["Loadout: battle rifle or sniper rifle, + fists.",
             "Munitorum Contacts: You can select one extra equipment option.",
             "Target Designation: STRATEGIC GAMBIT: pick an enemy. Until end of TP, Ratlings shooting it with a rifle gain Lethal 5+."],
            "LEADER, FIXER", wounds=7),
        rat("battlemutt", "Battlemutt", [], [("Bite", 4, "3+", "2/4", "-")],
            ["Early Warning: Once/TP, after an enemy moves or is set up: each Ratling (not Ogryn/Bullgryn) within 6\" of this and 2\" of that enemy can make a free Dash or Fall Back of up to 3\", not ending within 2\" of enemies unless hidden from all of them.",
             "Beast: Only Charge, Dash, Fall Back, Fight and Reposition; own weapons only."],
            "BATTLEMUTT", wounds=4, move='6"'),
        rat("big_shot", "Big Shot", [("Tankstopper rifle (mobile)", 4, "3+", "4/4", "Devastating 1, Heavy (Dash only), Piercing 1"), ("Tankstopper rifle (stationary)", 4, "2+", "4/2", "Devastating 4, Heavy, Piercing 1, Severe")], [FISTS],
            [], "BIG SHOT", pts=28),
        rat("bomber", "Bomber", [("Explosive arsenal", 5, "3+", "4/5", 'Range 3", Blast 1", Heavy (Reposition only), Limited 1, Piercing 1, Saturate')] + SNIPER, [("Bionic arm", 3, "5+", "3/4", "-")],
            ["Tripwire: When setting up equipment, set up to two Tripwire markers wholly in your territory, more than 2\" from other markers, access points and Accessible terrain. First time one is in an enemy's control range: remove it, that enemy gets -1 APL until end of its next activation and its action ends.",
             "Mine: Your universal mines deal 2D3+3, and Ratlings (not Ogryn/Bullgryn) don't trigger or take damage from them."],
            "BOMBER", save="4+"),
        rat("hardbit", "Hardbit", [("Battle rifle", 4, "3+", "3/4", "-")], [("Combat knife", 3, "3+", "3/5", "Balanced")],
            ["Hunter: Can Charge while Concealed; if it does, its combat knife gets +1 Atk and Brutal for the activation.",
             "Lie in Wait: Retaliating with Light or Heavy terrain in its control range: it resolves the first attack dice."],
            "HARDBIT"),
        rat("raider", "Raider", SUPPRESSED, [("Dagger", 3, "4+", "2/3", "-")],
            ["Grappling Hook: Climbing up counts as 2\" vertical.",
             "Slingshot (1AP): Pick a point on terrain visible within 6\": set this up wholly within 6\" horizontally of it, out of enemy control range, with the point visible. Counts as Reposition. Not within enemy control range or in an activation with Charge, Fall Back or Shoot."],
            "RAIDER"),
        rat("sneak", "Sneak", SUPPRESSED, [FISTS],
            ["Evade: Once/TP after an enemy action: interrupt with a free Dash. It can't use Scarper.",
             "Optics (1AP): Until its next activation, enemies can't be obscured when it shoots, and its stationary suppressed sniper rifle gains Lethal 5+. Not within enemy control range."],
            "SNEAK"),
        rat("sniper", "Sniper", SNIPER2, [FISTS], [], "SNIPER"),
        rat("spotter", "Spotter", SNIPER, [FISTS],
            ["Spot (1AP): SUPPORT. A visible enemy: until end of TP, Ratlings within 3\" of this shooting it gain Seek Light and it can't be obscured. Not within enemy control range."],
            "SPOTTER"),
        rat("stashmaster", "Stashmaster", SNIPER, [FISTS],
            ["Light-fingered: Once per activation, Pick Up Marker, Place Marker or a mission action costs 1 less AP.",
             "Well Stocked: If you take an Ammo Cache, set up one extra Ammo Cache marker."],
            "STASHMASTER"),
        rat("vox_thief", "Vox-thief", SNIPER, [FISTS],
            ["Intercept Communications (1AP): SUPPORT. Another Ratling visible within 6\": +1 APL until end of its next activation. Not within enemy control range."],
            "VOX-THIEF"),
        rat("bullgryn", "Bullgryn", [("Grenadier gauntlet", 4, "4+", "3/5", 'Blast 2"')],
            [("Power maul", 4, "3+", "4/6", "Shock"), ("Brute shield", 4, "3+", "3/4", "-"), ("Slabshield", 4, "4+", "3/4", "-")],
            ["Loadout: grenadier gauntlet or power maul, + brute shield or slabshield.",
             "Shield: Slabshield: Save 3+. Brute shield: fighting/retaliating, each block can block two successes.", BRUTE, SLOW],
            "BULLGRYN", save="4+", wounds=16, move='6"', pts=40, prefix=""),
        rat("ogryn", "Ogryn", [("Ripper gun", 4, "3+", "4/5", 'Range 8", Punishing')], [("Bayonet", 4, "3+", "4/5", "-")],
            ["Bayonet Charge: When it finishes a Charge move: D3+1 dmg to an enemy in its control range.", BRUTE, SLOW],
            "OGRYN", wounds=16, move='6"', pts=40, prefix=""),
    ],
}
