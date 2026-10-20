BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
BOLTGUN = ("Boltgun", 4, "3+", "3/4", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
CHAINSWORD = ("Chainsword", 5, "3+", "4/5", "-")
PLASMA_PISTOL = [("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
TAINTED = ("Tainted bolt pistol", 4, "3+", "3/5", 'Range 8", Rending')
ICON = ["Icon Bearer: Counts as APL 1 higher for marker control.",
        "Favoured of the Dark Gods: Ready step: if it controls an objective no one has tainted, that objective is tainted for the battle and you gain 1CP."]
INFERNAL = ["Infernal Pact: Once/battle, when a Warrior activates, change its Mark of Chaos."]

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
            "Select 1 leader: Aspiring Champion (plasma pistol or tainted bolt pistol, + power fist, power maul, power weapon or tainted chainsword) or Chosen (plasma pistol or tainted bolt pistol, + daemon blade).",
            "Select 5 other operatives. Other than Warriors, each only once.",
            "Give each operative a Mark of Chaos: Khorne, Nurgle, Slaanesh, Tzeentch or Undivided. A Balefire Acolyte can't be Khorne.",
        ],
    },
    "factionRules": [
        ("Astartes", "Each activation, a Legionary can Shoot twice or Fight twice. If Shooting twice, one must use a bolt pistol, boltgun or tainted bolt pistol. Legionaries can counteract regardless of order."),
        ("Marks of Chaos", "Each Legionary takes one Mark for the battle (marks can differ). Ploys give extra benefits to operatives with the matching Mark."),
        ("Khorne: Wrathful Onslaught", "Melee weapons gain Severe."),
        ("Nurgle: Disgusting Vigour", "Normal Dmg of 3+ on it: D6, on 5+ subtract 1."),
        ("Slaanesh: Unnatural Agility", "+1\" Move."),
        ("Tzeentch: Empyreal Guidance", "Ranged weapons gain Severe."),
        ("Undivided: Vicious Reavers", "Attacking an enemy within 6\": weapons gain Ceaseless."),
    ],
    "ploys": {
        "strategy": [
            ("Blood for the Blood God", "Fighting (not Khorne): first strike each sequence +1 dmg (max 7). Khorne: melee Dmg stats +1 (max 7)."),
            ("Implacable", "Being shot: Piercing 1 becomes Piercing Crits 1. Nurgle: ignore injured stat changes."),
            ("Quicksilver Speed", "Fighting after moving this TP: enemy melee Hit worsened by 1. Slaanesh that moved this TP, shot from more than 6\": enemy Hit worsened by 1. Not cumulative with injured."),
            ("Fickle Fates", "Shooting a ready enemy: Balanced. A ready Tzeentch being shot: if you retain any crits, retain one fail as a normal."),
        ],
        "firefight": [
            ("Unending Bloodshed", "A Khorne Legionary is incapacitated while fighting/retaliating: strike with one unresolved success first."),
            ("Mutability and Change", "A Tzeentch Legionary activates: +1 APL, but no action more than once this activation. A Warrior can't change its Mark this TP."),
            ("Malignant Aura", "A Nurgle Legionary shooting, on picking a target: vs enemies within 3\" its ranged weapons gain Piercing 1 for the action."),
            ("Sickening Captivation", "During a Slaanesh Legionary's activation: an enemy visible within 4\" gets -1 APL until end of its next activation."),
        ],
    },
    "equipment": [
        {"id": "warded_armour", "name": "Warded Armour", "desc": "STRATEGIC GAMBIT: one Legionary has Save 2+ until the next Ready step."},
        {"id": "tainted_rounds", "name": "Tainted Rounds", "desc": "Once/TP shooting with a bolt pistol or boltgun: Rending for that action."},
        {"id": "chaos_talismans", "name": "Chaos Talismans", "desc": "STRATEGIC GAMBIT: pick a Mark. Once per activation, a Legionary with it rolling 2+ fails can take D3 dmg to discard one fail and retain another as a normal."},
        {"id": "malefic_blades", "name": "Malefic Blades", "desc": "Legionaries gain a malefic blade.", "gw": ("melee", "Malefic blade", 5, "3+", "3/4", "-")},
    ],
    "operatives": [
        leg("aspiring_champion", "Aspiring Champion", PLASMA_PISTOL + [TAINTED],
            [("Power fist", 5, "4+", "5/7", "Brutal"), ("Power maul", 5, "3+", "4/6", "Shock"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+"), ("Tainted chainsword", 5, "3+", "4/5", "Rending")],
            ["Loadout: plasma pistol or tainted bolt pistol, + power fist, power maul, power weapon or tainted chainsword.",
             "In the Eyes of the Gods: Once per activation, if it incapacitates an enemy: +1 APL for that activation."],
            "LEADER, ASPIRING CHAMPION", wounds=15),
        leg("chosen", "Chosen", PLASMA_PISTOL + [TAINTED], [("Daemon blade", 5, "3+", "4/7", "Lethal 5+")],
            ["Loadout: plasma pistol or tainted bolt pistol, + daemon blade.",
             "Daemonic Aura: An enemy in its control range tries to Fall Back: D6, on 3+ it can't (AP refunded).",
             "Soul Gorge: After fighting/retaliating, if it killed an enemy and survived: regain up to D3+1 wounds."],
            "LEADER, CHOSEN", wounds=15),
        leg("anointed", "Anointed", [BOLT_PISTOL], [("Daemonic claw", 5, "3+", "4/5", "Rending")],
            ["Unleash Daemon: Once/battle on activation, for the rest of the battle: no Pick Up or mission actions (not Operate Hatch; drop any marker for 0AP); Normal and Crit Dmg of 4+ inflicts 1 less (Nurgle: max 1 less in total); daemonic claw gains Ceaseless and Lethal 5+."],
            "ANOINTED"),
        leg("balefire_acolyte", "Balefire Acolyte",
            [BOLT_PISTOL, ("Fireblast", 4, "3+", "3/4", 'PSYCHIC, Blast 2", 1" Devastating 1, Saturate'), ("Life siphon", 5, "3+", "3/3", "PSYCHIC, Saturate, Siphon Life")],
            [("Fell dagger", 5, "3+", "3/4", "PSYCHIC, Rending, Siphon Life")],
            ["Siphon Life (weapon rule): Once/TP: pick a Legionary visible within 6\"; it regains 1 wound per damaging success (D3 per crit).",
             "Can't take the Khorne Mark."],
            "PSYKER, BALEFIRE ACOLYTE"),
        leg("butcher", "Butcher", [BOLT_PISTOL], [("Double-handed chainaxe", 5, "4+", "5/7", "Brutal")],
            ["Devastating Onslaught: Enemies can't assist against it. End of each enemy activation/counteraction: it can make a free Charge of up to 2\" (can switch to Engage) to end in control range of an enemy within 2\"."],
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
            ["Vicious Reflexes: Retaliating, it resolves the first attack dice.",
             "Horrifying Dismemberment: Kills an enemy while fighting/retaliating: another enemy visible within 3\" of either gets -1 APL until end of its next activation.",
             "Grisly Mark (2AP): Once/battle, place your Grisly marker in its control range. Enemies within 3\" pay +1AP for Pick Up and mission actions, and count total APL 1 lower when contesting markers. Not within enemy control range."],
            "SHRIVETALON"),
        leg("warrior_boltgun", "Warrior (boltgun)", [BOLTGUN], [FISTS], INFERNAL, "WARRIOR"),
        leg("warrior_chainsword", "Warrior (chainsword)", [BOLT_PISTOL], [CHAINSWORD], INFERNAL, "WARRIOR"),
    ],
}
