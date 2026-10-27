FISTS = ("Fists", 3, "5+", "1/2", "-")
SNIPER = [("Sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sniper rifle (stationary)", 4, "3+", "3/3", "Devastating 3, Heavy")]
SNIPER2 = [("Sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")]
SUPPRESSED = [("Suppressed sniper rifle (mobile)", 4, "3+", "3/4", "Silent"), ("Suppressed sniper rifle (stationary)", 4, "3+", "3/3", "Devastating 2, Heavy, Silent")]
BRUTE = "Brute: While Concealed, it can't use Light terrain for cover when targeted (it keeps any cover save)."
SLOW = "Slow-witted: Pick Up Marker and mission actions cost it 1 extra AP (but not Operate Hatch)."

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
            {"name": "Ogryns", "desc": "Bullgryns and Ogryns (up to 3 combined)", "min": 0, "max": 3, "ids": ["bullgryn", "ogryn"]},
        ],
        "pools": [{"groups": ["Ratlings", "Ogryns"], "min": 7, "max": 10, "label": "Operatives (both lists)"}],
        "repeatable": ["sniper", "bullgryn", "ogryn"],
        "rules": [
            "Select 1 Fixer, armed with a battle rifle or sniper rifle, plus fists.",
            "Select 10 other operatives. You can take several Bullgryns, Ogryns and Snipers, but every other operative only once.",
            "Up to 3 Bullgryns and Ogryns combined. Up to three times, instead of taking one of these, you can make one Ratling ploy cost 0CP for the battle.",
            "A rifle is any ranged weapon with \"rifle\" in its name.",
        ],
    },
    "factionRules": [
        ("Scarper", "After each enemy activation, one Ratling (not a Bullgryn, Ogryn or Sneak) can make a free Dash. It can't end within 3\" of enemies unless it's hidden from all of them. Each Ratling once per turning point, and not after the turning point's last activation."),
    ],
    "ploys": {
        "strategy": [
            ("Shifty", "While a Ratling (not an Ogryn or Bullgryn) has a Conceal order and is in cover, enemies more than 2\" away can't target it."),
            ("Frontline Assault", "Bullgryns and Ogryns in your opponent's territory, or within 3\" of an objective, gain Balanced on their weapons."),
            ("Sniper Positions", "When it's more than 6\" from enemies and within 1\" of Heavy terrain, the stationary profile of its rifle gains Silent."),
            ("Crack Shots", "When it shoots an enemy more than 6\" away before any Charge, Fall Back or Reposition this activation (or while counteracting), rifles gain Balanced."),
        ],
        "firefight": [
            ("Larcenous", "During a Ratling's activation (not an Ogryn or Bullgryn), Pick Up Marker and mission actions only need it to contest the marker, even in enemy control range."),
            ("Shoot and Hide", "After a Ratling with an Engage order shoots with a rifle, if it's more than 3\" from enemies or hidden from all of them, it switches to Conceal."),
            ("Survival Instincts", "When an enemy shoots or fights a Ratling (not an Ogryn or Bullgryn) and you block, a normal success can block a critical success, and a critical success can block two successes."),
            ("Sharpshot", "When shooting with a rifle, friendly Ratlings in an enemy's control range don't stop you targeting it."),
        ],
    },
    "equipment": [
        {"id": "stolen_goods", "name": "Stolen Goods", "desc": "At the end of Select Operatives, roll a D3. On a 1, you lose 1CP. On a 2, you gain 1CP. On a 3, your opponent loses 1CP."},
        {"id": "improvised_armour", "name": "Improvised Armor", "desc": "When Bullgryns and Ogryns are shot, defense results of 5+ are critical successes."},
        {"id": "purloined_rations", "name": "Purloined Rations", "desc": "Once per turning point, after rolling attack dice with a rifle, it improves its Hit by 1 for that sequence."},
        {"id": "lucky_round", "name": "Lucky Round", "desc": "Once per turning point, after rolling attack dice with a rifle, it gains Severe for that sequence."},
    ],
    "operatives": [
        rat("fixer", "Fixer", [("Battle rifle", 4, "2+", "3/4", "-")] + SNIPER2, [FISTS],
            ["Loadout: a battle rifle or sniper rifle, plus fists.",
             "Munitorum Contacts: You can take one extra equipment option.",
             "Target Designation: STRATEGIC GAMBIT. Pick an enemy. Until the end of the turning point, Ratlings shooting it with a rifle gain Lethal 5+."],
            "LEADER, FIXER", wounds=7),
        rat("battlemutt", "Battlemutt", [], [("Bite", 4, "3+", "2/4", "-")],
            ["Early Warning: Once per turning point, after an enemy moves or is set up, each Ratling (not an Ogryn or Bullgryn) within 6\" of this operative and 2\" of that enemy can make a free Dash or Fall Back of up to 3\". It can't end within 2\" of enemies unless it's hidden from all of them.",
             "Beast: It can only Charge, Dash, Fall Back, Fight and Reposition, and only with its own weapons."],
            "BATTLEMUTT", wounds=4, move='6"'),
        rat("big_shot", "Big Shot", [("Tankstopper rifle (mobile)", 4, "3+", "4/4", "Devastating 1, Heavy (Dash only), Piercing 1"), ("Tankstopper rifle (stationary)", 4, "2+", "4/2", "Devastating 4, Heavy, Piercing 1, Severe")], [FISTS],
            [], "BIG SHOT", pts=28),
        rat("bomber", "Bomber", [("Explosive arsenal", 5, "3+", "4/5", 'Range 3", Blast 1", Heavy (Reposition only), Limited 1, Piercing 1, Saturate')] + SNIPER, [("Bionic arm", 3, "5+", "3/4", "-")],
            ["Tripwire: When setting up equipment, set up to two Tripwire markers wholly in your territory, more than 2\" from other markers, access points and Accessible terrain. The first time one is in an enemy's control range, remove it. That enemy gets -1 APL until the end of its next activation, and its action ends.",
             "Mine: Your universal mines inflict 2D3+3 damage, and Ratlings (not Ogryns or Bullgryns) don't set them off or take damage from them."],
            "BOMBER", save="4+"),
        rat("hardbit", "Hardbit", [("Battle rifle", 4, "3+", "3/4", "-")], [("Combat knife", 3, "3+", "3/5", "Balanced")],
            ["Hunter: It can Charge with a Conceal order. If it does, its combat knife gets +1 Atk and Brutal for that activation.",
             "Lie in Wait: When it retaliates with Light or Heavy terrain in its control range, it resolves the first attack die."],
            "HARDBIT"),
        rat("raider", "Raider", SUPPRESSED, [("Dagger", 3, "4+", "2/3", "-")],
            ["Grappling Hook: Climbing counts as 2\" vertically.",
             "Slingshot (1AP): Pick a point on terrain visible within 6\". Set it up wholly within 6\" of that point horizontally, outside enemy control range, with the point visible. This counts as a Reposition. It can't do this within enemy control range, or in an activation where it Charges, Falls Back or Shoots (before or after)."],
            "RAIDER"),
        rat("sneak", "Sneak", SUPPRESSED, [FISTS],
            ["Evade: Once per turning point, after an enemy action, interrupt with a free Dash. It can't use Scarper.",
             "Optics (1AP): Until its next activation, enemies can't be obscured when it shoots, and its stationary suppressed sniper rifle gains Lethal 5+. It can't do this within enemy control range."],
            "SNEAK"),
        rat("sniper", "Sniper", SNIPER2, [FISTS], [], "SNIPER"),
        rat("spotter", "Spotter", SNIPER, [FISTS],
            ["Spot (1AP): SUPPORT. Pick a visible enemy. Until the end of the turning point, Ratlings within 3\" of this operative gain Seek Light when shooting it, and it can't be obscured. It can't do this within enemy control range."],
            "SPOTTER"),
        rat("stashmaster", "Stashmaster", SNIPER, [FISTS],
            ["Light-fingered: Once per activation, Pick Up Marker, Place Marker or a mission action costs it 1 less AP.",
             "Well Stocked: If you take an Ammo Cache, set up one extra Ammo Cache marker."],
            "STASHMASTER"),
        rat("vox_thief", "Vox-thief", SNIPER, [FISTS],
            ["Intercept Communications (1AP): SUPPORT. Another Ratling visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
            "VOX-THIEF"),
        rat("bullgryn", "Bullgryn", [("Grenadier gauntlet", 4, "4+", "3/5", 'Blast 2"')],
            [("Power maul", 4, "3+", "4/6", "Shock"), ("Brute shield", 4, "3+", "3/4", "-"), ("Slabshield", 4, "4+", "3/4", "-")],
            ["Loadout: a grenadier gauntlet or power maul, plus a brute shield or slabshield.",
             "Shield: With a slabshield, its Save is 3+. With a brute shield, each block can block two successes when it fights or retaliates.", BRUTE, SLOW],
            "BULLGRYN", save="4+", wounds=16, move='6"', pts=40, prefix=""),
        rat("ogryn", "Ogryn", [("Ripper gun", 4, "3+", "4/5", 'Range 8", Punishing')], [("Bayonet", 4, "3+", "4/5", "-")],
            ["Bayonet Charge: When it finishes a Charge move, inflict D3+1 damage on an enemy in its control range.", BRUTE, SLOW],
            "OGRYN", wounds=16, move='6"', pts=40, prefix=""),
    ],
}
