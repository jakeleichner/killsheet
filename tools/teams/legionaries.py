BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
BOLTGUN = ("Boltgun", 4, "3+", "3/4", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
CHAINSWORD = ("Chainsword", 5, "3+", "4/5", "-")
PLASMA_PISTOL = [("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
TAINTED = ("Tainted bolt pistol", 4, "3+", "3/5", 'Range 8", Rending')
ICON = ["Icon Bearer: Its APL counts as 1 higher for marker control.",
        "Favoured of the Dark Gods: In the Ready step, if it controls an objective that no one has tainted, that objective is tainted for the battle and you gain 1CP."]
INFERNAL = ["Infernal Pact: Once per battle, when a Warrior activates, change its Mark of Chaos."]

def leg(oid, name, ranged, melee, abilities, kw, wounds=14):
    return {"id": oid, "name": "Legionary " + name, "apl": 3, "move": '6"', "save": "3+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

GUNNERS = ["gunner_flamer", "gunner_melta", "gunner_plasma"]
HEAVIES = ["heavy_bolter", "heavy_missile", "heavy_reaper"]

TEAM = {
    "id": "legionaries", "source": "legionaries", "name": "Legionaries", "badge": "CHAOS SPACE MARINES", "color": "#8E1B1B",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Leader", "desc": "1 Aspiring Champion or Chosen", "min": 1, "max": 1, "ids": ["aspiring_champion", "chosen"]},
            {"name": "Operatives", "desc": "5 Legionaries from the list below", "min": 5, "max": 5,
             "ids": ["anointed", "balefire_acolyte", "butcher"] + GUNNERS + HEAVIES + ["icon_boltgun", "icon_chainsword", "shrivetalon", "warrior_boltgun", "warrior_chainsword"]},
        ],
        "repeatable": ["warrior_boltgun", "warrior_chainsword"],
        "caps": [
            {"ids": GUNNERS, "max": 1, "label": "Only 1 Gunner"},
            {"ids": HEAVIES, "max": 1, "label": "Only 1 Heavy Gunner"},
            {"ids": ["icon_boltgun", "icon_chainsword"], "max": 1, "label": "Only 1 Icon Bearer"},
        ],
        "rules": [
            "Select 1 leader: an Aspiring Champion (plasma pistol or tainted bolt pistol, plus a power fist, power maul, power weapon or tainted chainsword) or a Chosen (plasma pistol or tainted bolt pistol, plus a daemon blade).",
            "Select 5 other operatives. You can take several Warriors, but every other operative only once.",
            "Give each operative a Mark of Chaos: Khorne, Nurgle, Slaanesh, Tzeentch or Undivided. A Balefire Acolyte can't be Khorne.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, a Legionary can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt pistol, boltgun or tainted bolt pistol. Legionaries can counteract whatever their order."),
        ("Marks of Chaos", "Each Legionary takes one Mark for the battle, and they can differ. Ploys give extra benefits to operatives with the matching Mark."),
        ("Khorne: Wrathful Onslaught", "Melee weapons gain Severe."),
        ("Nurgle: Disgusting Vigour", "When Normal Dmg of 3 or more is inflicted on it, roll a D6: on a 5+, subtract 1 from that damage."),
        ("Slaanesh: Unnatural Agility", "+1\" Move."),
        ("Tzeentch: Empyreal Guidance", "Ranged weapons gain Severe."),
        ("Undivided: Vicious Reavers", "When attacking an enemy within 6\", weapons gain Ceaseless."),
    ],
    "ploys": {
        "strategy": [
            ("Blood for the Blood God", "When one fights (if it isn't Khorne), its first strike each sequence deals 1 extra damage (to a maximum of 7). Khorne: melee weapons get +1 Normal and Critical Dmg (to a maximum of 7)."),
            ("Implacable", "When one is shot, Piercing 1 becomes Piercing Crits 1. Nurgle: also ignore stat changes from being injured."),
            ("Quicksilver Speed", "When one fights after moving this turning point, enemy melee weapons get a worse Hit by 1. When a Slaanesh Legionary that moved this turning point is shot from more than 6\" away, the enemy's Hit gets worse by 1. Neither stacks with being injured."),
            ("Fickle Fates", "When shooting a ready enemy, weapons gain Balanced. When a ready Tzeentch Legionary is shot and you retain any critical successes, retain one fail as a normal success."),
        ],
        "firefight": [
            ("Unending Bloodshed", "When a Khorne Legionary is incapacitated while fighting or retaliating, it strikes with one unresolved success first."),
            ("Mutability and Change", "When a Tzeentch Legionary activates, it gets +1 APL, but can't take any action more than once this activation. A Warrior can't change its Mark this turning point."),
            ("Malignant Aura", "When a Nurgle Legionary shoots, as it picks a target, its ranged weapons gain Piercing 1 against enemies within 3\" for that action."),
            ("Sickening Captivation", "During a Slaanesh Legionary's activation, an enemy visible within 4\" gets -1 APL until the end of its next activation."),
        ],
    },
    "equipment": [
        {"id": "warded_armour", "name": "Warded Armour", "desc": "STRATEGIC GAMBIT: one Legionary has a 2+ Save until the next Ready step."},
        {"id": "tainted_rounds", "name": "Tainted Rounds", "desc": "Once per turning point, a bolt pistol or boltgun gains Rending for that Shoot."},
        {"id": "chaos_talismans", "name": "Chaos Talismans", "desc": "STRATEGIC GAMBIT: pick a Mark. Once per activation, when a Legionary with that Mark fails two or more dice, it can take D3 damage to discard one failure and retain another as a normal success."},
        {"id": "malefic_blades", "name": "Malefic Blades", "desc": "Legionaries get a malefic blade.", "gw": ("melee", "Malefic blade", 5, "3+", "3/4", "-")},
    ],
    "operatives": [
        leg("aspiring_champion", "Aspiring Champion", PLASMA_PISTOL + [TAINTED],
            [("Power fist", 5, "4+", "5/7", "Brutal"), ("Power maul", 5, "3+", "4/6", "Shock"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+"), ("Tainted chainsword", 5, "3+", "4/5", "Rending")],
            ["Loadout: a plasma pistol or tainted bolt pistol, plus a power fist, power maul, power weapon or tainted chainsword.",
             "In the Eyes of the Gods: Once per activation, if it incapacitates an enemy, it gets +1 APL for that activation."],
            "LEADER, ASPIRING CHAMPION", wounds=15),
        leg("chosen", "Chosen", PLASMA_PISTOL + [TAINTED], [("Daemon blade", 5, "3+", "4/7", "Lethal 5+")],
            ["Loadout: a plasma pistol or tainted bolt pistol, plus a daemon blade.",
             "Daemonic Aura: When an enemy in its control range tries to Fall Back, roll a D6. On a 3+, it can't, and its AP is refunded.",
             "Soul Gorge: After it fights or retaliates, if it killed an enemy and survived, it regains up to D3+1 wounds."],
            "LEADER, CHOSEN", wounds=15),
        leg("anointed", "Anointed", [BOLT_PISTOL], [("Daemonic claw", 5, "3+", "4/5", "Rending")],
            ["Unleash Daemon: Once per battle when it's activated, for the rest of the battle: it can't Pick Up Marker or take mission actions (except Operate Hatch), and drops any marker it carries for 0AP. Normal and Critical Dmg of 4 or more inflicts 1 less damage on it (for Nurgle, no more than 1 less in total). Its daemonic claw gains Ceaseless and Lethal 5+."],
            "ANOINTED"),
        leg("balefire_acolyte", "Balefire Acolyte",
            [BOLT_PISTOL, ("Fireblast", 4, "3+", "3/4", 'PSYCHIC, Blast 2", 1" Devastating 1, Saturate'), ("Life siphon", 5, "3+", "3/3", "PSYCHIC, Saturate, Siphon Life")],
            [("Fell dagger", 5, "3+", "3/4", "PSYCHIC, Rending, Siphon Life")],
            ["Siphon Life (weapon rule): Once per turning point, pick a Legionary visible within 6\". It regains 1 wound for each success that inflicts damage (D3 for each critical success).",
             "It can't take the Mark of Khorne."],
            "PSYKER, BALEFIRE ACOLYTE"),
        leg("butcher", "Butcher", [BOLT_PISTOL], [("Double-handed chainaxe", 5, "4+", "5/7", "Brutal")],
            ["Devastating Onslaught: Enemies can't assist against it. At the end of each enemy activation or counteraction, it can make a free Charge of up to 2\" (switching to Engage if needed) to end in the control range of an enemy within 2\"."],
            "BUTCHER"),
        leg("gunner_flamer", "Gunner (flamer)", [BOLT_PISTOL, ("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [FISTS], [], "GUNNER"),
        leg("gunner_melta", "Gunner (meltagun)", [BOLT_PISTOL, ("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "GUNNER"),
        leg("gunner_plasma", "Gunner (plasma gun)", [BOLT_PISTOL, ("Plasma gun (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "GUNNER"),
        leg("heavy_bolter", "Heavy Gunner (heavy bolter)", [BOLT_PISTOL, ("Heavy bolter (focused)", 5, "3+", "4/5", "Heavy (Reposition only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Heavy (Reposition only), Piercing Crits 1, Torrent 1"')], [FISTS], [], "HEAVY GUNNER"),
        leg("heavy_missile", "Heavy Gunner (missile launcher)", [BOLT_PISTOL, ("Missile launcher (frag)", 4, "3+", "3/5", 'Blast 2", Heavy (Reposition only)'), ("Missile launcher (krak)", 4, "3+", "5/7", "Heavy (Reposition only), Piercing 1")], [FISTS], [], "HEAVY GUNNER"),
        leg("heavy_reaper", "Heavy Gunner (reaper chaincannon)", [BOLT_PISTOL, ("Reaper chaincannon (focused)", 5, "3+", "3/4", "Ceaseless, Heavy (Reposition only), Punishing"), ("Reaper chaincannon (sweeping)", 4, "3+", "3/4", 'Ceaseless, Heavy (Reposition only), Punishing, Torrent 2"')], [FISTS], [], "HEAVY GUNNER"),
        leg("icon_boltgun", "Icon Bearer (boltgun)", [BOLTGUN], [FISTS], ICON, "ICON BEARER"),
        leg("icon_chainsword", "Icon Bearer (chainsword)", [BOLT_PISTOL], [CHAINSWORD], ICON, "ICON BEARER"),
        leg("shrivetalon", "Shrivetalon", [BOLT_PISTOL], [("Flensing blades", 5, "3+", "3/5", "Lethal 5+")],
            ["Vicious Reflexes: When it retaliates, it resolves the first attack die.",
             "Horrifying Dismemberment: When it kills an enemy while fighting or retaliating, another enemy visible within 3\" of either gets -1 APL until the end of its next activation.",
             "Grisly Mark (2AP): Once per battle, place your Grisly marker in its control range. Enemies within 3\" of it pay 1 extra AP for Pick Up Marker and mission actions, and their total APL counts as 1 lower when contesting markers. It can't do this within enemy control range."],
            "SHRIVETALON"),
        leg("warrior_boltgun", "Warrior (boltgun)", [BOLTGUN], [FISTS], INFERNAL, "WARRIOR"),
        leg("warrior_chainsword", "Warrior (chainsword)", [BOLT_PISTOL], [CHAINSWORD], INFERNAL, "WARRIOR"),
    ],
}
