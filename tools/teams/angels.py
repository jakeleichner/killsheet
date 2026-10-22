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
CHAPTER_VET = "Chapter Veteran: At the end of Select Operatives, pick one extra Chapter Tactic for it. It can be a different one each battle."

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
            "Select 5 other operatives. You can take several Warriors, but every other operative only once.",
            "Bolt weapons are ranged weapons with \"bolt\" in their name.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, an operative can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt weapon, and the second Shoot costs 1 extra AP if both use a bolt sniper rifle or heavy bolter. These operatives can counteract whatever their order."),
        ("Chapter Tactics", "Pick a primary and a secondary tactic for the battle (keep the same ones for a whole campaign or tournament). 1 Aggressive: melee weapons gain Rending. 2 Dueller: normal successes can block critical successes, except against Brutal. 3 Resolute: ignore APL changes and Shock. 4 Stealthy: when shot, if it can retain a cover save, retain one extra cover save, or one cover save as a critical success (not on top of Vantage terrain's improved cover save). 5 Mobile: Fall Back costs 1 less AP, and it can Charge while in enemy control range. 6 Hardy: when shot, defence results of 5+ are critical successes. 7 Sharpshooter: if it hasn't Charged, Fallen Back or Repositioned this activation, bolt weapons gain Accurate 1 and Severe. 8 Siege Specialist: ranged weapons gain Saturate, and enemies can't assist in fights against it."),
    ],
    "ploys": {
        "strategy": [
            ("Combat Doctrine", "Pick one doctrine. Devastator: shooting targets more than 6\" away. Tactical: shooting targets within 6\". Assault: fighting or retaliating. Those attacks gain Balanced."),
            ("Indomitus", "When one is shot and you fail two or more defence dice, discard one failure to retain another as a normal success."),
            ("And They Shall Know No Fear", "Ignore stat changes from being injured, including weapon stats."),
            ("Adaptive Tactics", "Change your secondary Chapter Tactic until the end of the turning point."),
        ],
        "firefight": [
            ("Adjust Doctrine", "Use during an activation, if you used Combat Doctrine this turning point. Change the doctrine you picked."),
            ("Wrath of Vengeance", "When one counteracts, it can take a free extra 1AP action. The two actions must be different."),
            ("Transhuman Physiology", "When one is shot, retain one normal defence success as a critical success."),
            ("Shock Assault", "When it fights in an activation in which it Charged, its melee weapon gains Shock and its first strike deals 1 extra damage (to a maximum of 7)."),
        ],
    },
    "equipment": [
        {"id": "purity_seals", "name": "Purity Seals", "desc": "Once per turning point when attacking, if you fail two or more attack dice, discard one failure to retain another as a normal success."},
        {"id": "auspex", "name": "Auspex", "desc": "Once per turning point when one Shoots, enemies within 8\" of it can't be obscured until the end of that activation."},
        {"id": "chapter_reliq", "name": "Chapter Reliquaries", "desc": "Wrath of Vengeance costs 0CP for an operative with an Engage order."},
        {"id": "tilting_shields", "name": "Tilting Shields", "desc": "Once per turning point, when one fights or retaliates, use this after your opponent rolls their attack dice but before re-rolls. They can't retain results below 6 as critical successes in that sequence."},
    ],
    "operatives": [
        marine("captain", "Space Marine Captain", PLASMA, [("Power fist", 5, "3+", "5/7", "Brutal")],
               ["Heroic Leader: Once per turning point, pick one: use a firefight ploy for 0CP on it (not Command Re-roll); use Combat Doctrine when activating another operative (paying the CP, once per turning point); or use Adjust Doctrine for 0CP. The last two need it in the killzone and outside enemy control range.",
                "Iron Halo: Once per battle, ignore the Normal Dmg from one attack die."],
               "LEADER, SPACE MARINE CAPTAIN", wounds=15, pts=40),
        marine("ai_sgt", "Assault Intercessor Sergeant", [("Hand flamer", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1"'), HBP] + PLASMA,
               [("Chainsword", 5, "3+", "4/5", "-"), ("Power fist", 5, "4+", "5/7", "Brutal"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+"), ("Thunder hammer", 5, "4+", "5/6", "Shock, Stun")],
               ["Loadout: a hand flamer or heavy bolt pistol, plus a chainsword, power fist, power weapon or thunder hammer. Or a plasma pistol and a chainsword.",
                "Doctrine Warfare: Once per battle each, while it's in the killzone, you can use Combat Doctrine (Assault) for 0CP and Combat Doctrine (Tactical) for 0CP.",
                CHAPTER_VET],
               "LEADER, ASSAULT INTERCESSOR, SERGEANT", wounds=15),
        marine("int_sgt", "Intercessor Sergeant", RIFLES["auto"] + RIFLES["bolt"] + RIFLES["stalker"],
               [("Chainsword", 4, "3+", "4/5", "-"), FISTS, ("Power fist", 4, "4+", "5/7", "Brutal"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+"), ("Thunder hammer", 4, "4+", "5/6", "Shock, Stun")],
               ["Loadout: an auto bolt rifle, bolt rifle or stalker bolt rifle, plus a chainsword, fists, power fist, power weapon or thunder hammer.",
                "Doctrine Warfare: Once per battle each, while it's in the killzone, you can use Combat Doctrine (Devastator) for 0CP and Combat Doctrine (Tactical) for 0CP.",
                CHAPTER_VET],
               "LEADER, INTERCESSOR, SERGEANT", wounds=15),
        marine("ai_gren", "Assault Intercessor Grenadier", [HBP], [("Chainsword", 5, "3+", "4/5", "-")],
               ["Grenadier: It can use frag and krak grenades without using up equipment, and gets +1 to Hit with them."],
               "ASSAULT INTERCESSOR, GRENADIER"),
        marine("ai_warrior", "Assault Intercessor Warrior", [HBP], [("Chainsword", 5, "3+", "4/5", "-")], [], "ASSAULT INTERCESSOR, WARRIOR"),
        marine("elim", "Eliminator Sniper", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'),
                                             ("Bolt sniper rifle (executioner)", 4, "2+", "3/4", "Heavy (Dash only), Saturate, Seek Light, Silent"),
                                             ("Bolt sniper rifle (hyperfrag)", 4, "2+", "2/4", 'Blast 1", Heavy (Dash only), Silent'),
                                             ("Bolt sniper rifle (mortis)", 4, "2+", "3/3", "Devastating 3, Heavy (Dash only), Piercing 1, Silent")], [FISTS],
               ["Camo Cloak: Ignore Saturate when it's shot. It has the Stealthy tactic. If you also picked Stealthy, it can use both options: one extra normal cover save and one critical cover save.",
                "Optics (1AP): Until its next activation, enemies can't be obscured when it shoots. It can't do this within enemy control range."],
               "ELIMINATOR, SNIPER", wounds=12, move='7"', pts=40),
        marine("heavy_gun", "Heavy Intercessor Gunner", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Heavy bolter (focused)", 5, "3+", "4/5", "Piercing Crits 1"),
                                                          ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Piercing Crits 1, Torrent 1"')], [FISTS],
               [], "HEAVY INTERCESSOR, GUNNER", wounds=18, move='5"', pts=40),
    ] + GUNNERS + WARRIORS,
}
