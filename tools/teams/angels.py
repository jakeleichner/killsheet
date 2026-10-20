FISTS = ("Fists", 4, "3+", "3/4", "-")
HBP = ("Heavy bolt pistol", 4, "3+", "3/4", 'Range 8", Piercing Crits 1')
PLASMA = [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
RIFLES = {
    "auto": [("Auto bolt rifle", 4, "3+", "3/4", 'Torrent 1"')],
    "bolt": [("Bolt rifle", 4, "3+", "3/4", "Piercing Crits 1")],
    "stalker": [("Stalker bolt rifle (heavy)", 4, "3+", "3/5", "Heavy (Dash only), Lethal 5+, Piercing Crits 1"), ("Stalker bolt rifle (mobile)", 4, "3+", "3/4", "-")],
}
RIFLE_NAMES = {"auto": "auto bolt rifle", "bolt": "bolt rifle", "stalker": "stalker bolt rifle"}
AUX_GL = [("Auxiliary grenade launcher (frag)", 4, "3+", "2/4", 'Blast 2"'), ("Auxiliary grenade launcher (krak)", 4, "3+", "4/5", "Piercing 1")]
CHAPTER_VET = "Chapter Veteran: At the end of Select Operatives, pick one extra Chapter Tactic for it (can differ each battle)."

def marine(oid, name, ranged, melee, abilities, kw, wounds=14, move='6"', pts=32):
    return {"id": oid, "name": name, "apl": 3, "move": move, "save": "3+", "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

GUNNERS = [marine("int_gunner_" + k, "Intercessor Gunner (" + RIFLE_NAMES[k] + ")", RIFLES[k] + AUX_GL, [FISTS], [], "INTERCESSOR, GUNNER") for k in RIFLES]
WARRIORS = [marine("int_warrior_" + k, "Intercessor Warrior (" + RIFLE_NAMES[k] + ")", RIFLES[k], [FISTS], [], "INTERCESSOR, WARRIOR") for k in RIFLES]

TEAM = {
    "id": "angels", "source": "angels_of_death", "name": "Angels of Death", "badge": "ADEPTUS ASTARTES", "color": "#3B6FD4",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Leader", "desc": "1 Leader (Captain, Assault Intercessor Sgt or Intercessor Sgt)", "min": 1, "max": 1, "ids": ["captain", "ai_sgt", "int_sgt"]},
            {"name": "Operatives", "desc": "5 Angel of Death operatives from the list below", "min": 5, "max": 5,
             "ids": ["ai_gren", "ai_warrior", "elim", "heavy_gun"] + [o["id"] for o in GUNNERS] + [o["id"] for o in WARRIORS]},
        ],
        "repeatable": ["ai_warrior"] + [o["id"] for o in WARRIORS],
        "caps": [{"ids": [o["id"] for o in GUNNERS], "max": 1, "label": "Only 1 Intercessor Gunner"}],
        "rules": [
            "Select 1 leader: Space Marine Captain, Assault Intercessor Sergeant or Intercessor Sergeant.",
            "Select 5 other operatives. Other than Warriors, each only once.",
            "Bolt weapons are ranged weapons with 'bolt' in the name.",
        ],
    },
    "factionRules": [
        ("Astartes", "Two Shoot or two Fight per activation. Two Shoots: a bolt weapon for at least one; +1AP for the second if both use a bolt sniper rifle or heavy bolter. Counteract regardless of order."),
        ("Chapter Tactics", "Pick a primary and secondary tactic for the battle (same ones for a whole campaign or tournament). 1 Aggressive: melee Rending. 2 Dueller: normals can block crits (not vs Brutal). 3 Resolute: ignore APL changes and Shock. 4 Stealthy: retain an extra cover save, or one as a crit. 5 Mobile: Fall Back -1AP; can Charge out of enemy control range. 6 Hardy: defence 5+ are crits vs shooting. 7 Sharpshooter: no Charge/Fall Back/Reposition this activation: bolt weapons gain Accurate 1 and Severe. 8 Siege Specialist: ranged Saturate; enemies can't assist vs it."),
    ],
    "ploys": {
        "strategy": [
            ("Combat Doctrine", "Pick one: Devastator (shooting >6\" away), Tactical (shooting within 6\") or Assault (fighting/retaliating). Those attacks gain Balanced."),
            ("Indomitus", "Being shot: with 2+ fails, discard one to retain another as a normal success."),
            ("And They Shall Know No Fear", "Ignore injured stat changes (incl. weapons)."),
            ("Adaptive Tactics", "Change your secondary Chapter Tactic until end of TP."),
        ],
        "firefight": [
            ("Adjust Doctrine", "During an activation, if you used Combat Doctrine this TP: change the doctrine."),
            ("Wrath of Vengeance", "Counteracting: a free extra 1AP action (must be different)."),
            ("Transhuman Physiology", "Being shot: retain one normal defence success as a crit."),
            ("Shock Assault", "Fighting in an activation it Charged: melee weapon gains Shock and the first strike deals +1 dmg (max 7)."),
        ],
    },
    "equipment": [
        {"id": "purity_seals", "name": "Purity Seals", "desc": "Once/TP attacking: with 2+ fails, discard one to retain another as a normal success."},
        {"id": "auspex", "name": "Auspex", "desc": "Once/TP on a Shoot: enemies within 8\" can't be obscured until end of activation."},
        {"id": "chapter_reliq", "name": "Chapter Reliquaries", "desc": "Wrath of Vengeance costs 0CP for an operative on Engage."},
        {"id": "tilting_shields", "name": "Tilting Shields", "desc": "Once/TP fighting/retaliating, after the opponent rolls: they can't retain results below 6 as crits that sequence."},
    ],
    "operatives": [
        marine("captain", "Space Marine Captain", PLASMA, [("Power fist", 5, "3+", "5/7", "Brutal")],
               ["Heroic Leader: Once/TP: a firefight ploy for 0CP on this operative (not Command Re-roll); or Combat Doctrine when activating another operative (pay CP; once per TP); or Adjust Doctrine for 0CP. Last two need it in the killzone, not in enemy control range.",
                "Iron Halo: Once/battle, ignore the Normal Dmg from one attack dice."],
               "LEADER, SPACE MARINE CAPTAIN", wounds=15, pts=40),
        marine("ai_sgt", "Assault Intercessor Sergeant", [("Hand flamer", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1"'), HBP] + PLASMA,
               [("Chainsword", 5, "3+", "4/5", "-"), ("Power fist", 5, "4+", "5/7", "Brutal"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+"), ("Thunder hammer", 5, "4+", "5/6", "Shock, Stun")],
               ["Loadout: (hand flamer or heavy bolt pistol) + (chainsword, power fist, power weapon or thunder hammer), or plasma pistol + chainsword.",
                "Doctrine Warfare: Once/battle each, while in killzone: Combat Doctrine (Assault) for 0CP, and Combat Doctrine (Tactical) for 0CP.",
                CHAPTER_VET],
               "LEADER, ASSAULT INTERCESSOR, SERGEANT", wounds=15),
        marine("int_sgt", "Intercessor Sergeant", RIFLES["auto"] + RIFLES["bolt"] + RIFLES["stalker"],
               [("Chainsword", 4, "3+", "4/5", "-"), FISTS, ("Power fist", 4, "4+", "5/7", "Brutal"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+"), ("Thunder hammer", 4, "4+", "5/6", "Shock, Stun")],
               ["Loadout: auto bolt rifle, bolt rifle or stalker bolt rifle + chainsword, fists, power fist, power weapon or thunder hammer.",
                "Doctrine Warfare: Once/battle each, while in killzone: Combat Doctrine (Devastator) for 0CP, and Combat Doctrine (Tactical) for 0CP.",
                CHAPTER_VET],
               "LEADER, INTERCESSOR, SERGEANT", wounds=15),
        marine("ai_gren", "Assault Intercessor Grenadier", [HBP], [("Chainsword", 5, "3+", "4/5", "-")],
               ["Grenadier: Can use frag and krak grenades without using up equipment limits; Hit +1 with them."],
               "ASSAULT INTERCESSOR, GRENADIER"),
        marine("ai_warrior", "Assault Intercessor Warrior", [HBP], [("Chainsword", 5, "3+", "4/5", "-")], [], "ASSAULT INTERCESSOR, WARRIOR"),
        marine("elim", "Eliminator Sniper", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'),
                                             ("Bolt sniper rifle (executioner)", 4, "2+", "3/4", "Heavy (Dash only), Saturate, Seek Light, Silent"),
                                             ("Bolt sniper rifle (hyperfrag)", 4, "2+", "2/4", 'Blast 1", Heavy (Dash only), Silent'),
                                             ("Bolt sniper rifle (mortis)", 4, "2+", "3/3", "Devastating 3, Heavy (Dash only), Piercing 1, Silent")], [FISTS],
               ["Camo Cloak: Ignore Saturate when shot. Has the Stealthy tactic; if you picked Stealthy too, it can use both options (one normal and one crit cover save).",
                "Optics (1AP): Until its next activation, enemies can't be obscured when it shoots. Not within enemy control range."],
               "ELIMINATOR, SNIPER", wounds=12, move='7"', pts=40),
        marine("heavy_gun", "Heavy Intercessor Gunner", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Heavy bolter (focused)", 5, "3+", "4/5", "Piercing Crits 1"),
                                                          ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Piercing Crits 1, Torrent 1"')], [FISTS],
               [], "HEAVY INTERCESSOR, GUNNER", wounds=18, move='5"', pts=40),
    ] + GUNNERS + WARRIORS,
}
