HAND_FLAMER = ("Hand flamer", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1", Blaze')
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")
CHAINSWORD = ("Chainsword", 4, "4+", "4/5", "-")
MIN_FLAMER = ("Ministorum flamer", 4, "2+", "4/4", 'Range 8", Saturate, Torrent 2", Blaze')
BRAZIER_R = ("Brazier of holy fire", 4, "2+", "4/4", 'Range 4", Saturate, Torrent 1", Blaze')
BRAZIER_M = ("Brazier of holy fire", 4, "4+", "4/4", "Shock, Blaze")
MELTA = ("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')
PLASMA = [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]
RELIC = "Holy Relic: It's always benefitting from the SERMON."
SPREAD = "Spread the Word of the God-Emperor: More than 6\" from other friendly operatives: weapons gain Severe."

def sc(oid, name, ranged, melee, abilities, kw, save="5+", wounds=7, move='6"', pts=25, apl=2):
    return {"id": oid, "name": "Sanctifier " + name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def missionary(oid, label, ranged, melee, relic):
    return sc(oid, "Missionary (" + label + ")", ranged, melee, ([RELIC] if relic else []) + [SPREAD], "MISSIONARY", wounds=8)

MISS_A = ["missionary_flamer_brazier", "missionary_flamer_relic"]
MISS_B = ["missionary_melta", "missionary_plasma"]

TEAM = {
    "id": "sanctifiers", "source": "sanctifiers", "name": "Sanctifiers", "badge": "ADEPTUS MINISTORUM", "color": "#A33B2B",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Confessor", "min": 1, "max": 1, "ids": ["confessor"]},
            {"name": "Cherub", "desc": "1 Cherub", "min": 1, "max": 1, "ids": ["cherub"]},
            {"name": "Operatives", "desc": "9 Sanctifiers from the list below", "min": 9, "max": 9,
             "ids": ["conflagrator", "death_cult_assassin", "drill_abbot", "miraculist"] + MISS_A + MISS_B + ["persecutor", "preacher", "reliquant", "salvationist"]},
        ],
        "repeatable": ["preacher"],
        "maxCount": {"preacher": 4},
        "caps": [
            {"ids": MISS_A, "max": 1, "label": "Only 1 flamer Missionary"},
            {"ids": MISS_B, "max": 1, "label": "Only 1 melta/plasma Missionary"},
            {"ids": ["missionary_flamer_brazier", "missionary_plasma"], "max": 1, "label": "Only 1 brazier of holy fire"},
        ],
        "rules": [
            "Select 1 Confessor and 1 Cherub.",
            "Select 9 other operatives. Other than Preachers (max 4), each only once.",
            "Missionaries come from two lists, one of each: Ministorum flamer + brazier of holy fire, or + gun butt and holy relic; meltagun + chainsword + holy relic, or plasma gun + chainsword + brazier of holy fire.",
            "Only one option with a brazier of holy fire.",
        ],
    },
    "factionRules": [
        ("Ministorum Sermon", "STRATEGIC GAMBIT: pick a Sanctifier (must be the Confessor if alive) to be your ORATOR until you use this again. Sanctifiers within 3\" of the Orator (6\" if it's the Confessor) are benefitting from the SERMON."),
        ("Blaze", "Weapon rule. If any crits inflict damage, the target gains your Blaze token. When it activates: D3 dmg, then its player either rolls D6 (3+ removes the token) or takes -1 APL for the activation to remove it."),
    ],
    "ploys": {
        "strategy": [
            ("The Emperor Protects", "A Sanctifier benefitting from the SERMON being shot: re-roll any defence dice results of one value."),
            ("Fervent Brawl", "Benefitting from the SERMON: melee Ceaseless; Normal and Crit Dmg of 4+ inflicts 1 less. Activating in range of the Orator keeps the SERMON for that whole activation."),
            ("Zealous Persecution", "Fighting after Charging this activation: melee Lethal 5+."),
            ("Rally the Flock", "Each Sanctifier (not the Orator) benefitting from the SERMON makes a free Dash or Fall Back (max 3\"), ending closer to and visible to the Orator. Not in TP1."),
        ],
        "firefight": [
            ("Rosarius", "An attack dice inflicts Normal Dmg on a Sanctifier: ignore it."),
            ("Ardent Eradication", "After rolling attack dice vs an enemy within 3\" of the Orator (6\" for the Confessor): re-roll any."),
            ("Redeemed Through Fire", "A Sanctifier with a Blaze weapon is incapacitated: each enemy visible within 2\" gains your Blaze token."),
            ("Unwavering Devotion", "The Orator or Miraculist is picked as a Shoot target or to fight: another Sanctifier (not Confessor, Miraculist or Orator) visible within 3\" takes its place. No effect vs Blast or Torrent."),
        ],
    },
    "equipment": [
        {"id": "sanctification_orbs", "name": "Sanctification Orbs", "desc": "Once/TP a Sanctifier (not Cherub, Assassin or Miraculist) can Sanctification Orb (1AP): an enemy visible within 6\" and others within 1\" of it roll D6, on 3+ gain a Doused token. Blaze weapons vs Doused enemies gain Seek; the token goes after a Blaze attack. Not within enemy control range."},
        {"id": "imperial_cult_symbols", "name": "Imperial Cult Symbols", "desc": "Once/TP, a Sanctifier benefitting from the SERMON being shot: change one of the attacker's retained crits to a normal."},
        {"id": "purity_seals", "name": "Purity Seals", "desc": "Once/TP shooting or fighting with 2+ fails: discard one to retain another as a normal."},
        {"id": "ecclesiarchy_texts", "name": "Ecclesiarchy Texts", "desc": "Ready step: roll 3D6; if less than the Orator's remaining wounds, gain 1CP."},
    ],
    "operatives": [
        sc("confessor", "Confessor", [], [("Mace of Censure", 4, "3+", "5/5", "Brutal, Shock")],
           ["Commanding Declamation: Once/battle, an enemy visible within 6\" would act: D6; if higher than its APL it can't do that action this activation (AP not refunded; a counteraction ends).",
            "Lead the Procession: After TP1, when it's the Orator and Charges, Falls Back or Repositions: Sanctifiers benefitting from the SERMON and visible to it can then each make a free Charge, Fall Back or Reposition of up to 3\", ending still in the SERMON."],
           "LEADER, CONFESSOR", wounds=10, pts=32),
        sc("cherub", "Cherub", [], [("Incentiviser", 3, "5+", "1/3", "Shock")],
           ["Cherub: Counts as APL 1 lower for objective control. Concealed and in cover: can't be targeted (except within 2\"). Own weapons only; no unique actions except Incentivise.",
            "Fly: When it Charges, Falls Back or Repositions it can FLY: set up wholly within its Move horizontally, not in enemy control range unless Charging.",
            "Incentivise (1AP): SUPPORT. Another Sanctifier (not Confessor, Death Cult Assassin, Miraculist or Orator) visible within 2\": +1 APL until end of its next activation. Not within enemy control range."],
           "CHERUB", wounds=5, move='7"'),
        sc("conflagrator", "Conflagrator", [("Twin hand flamers (focused)", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 2", Blaze'), ("Twin hand flamers (twin torrent)", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 0", Twin Torrent, Blaze')],
           [("Gun butts", 4, "4+", "2/3", "-")],
           ["Twin Torrent (weapon rule): Shoot two different valid targets not in friendly control range, rolling separately. No secondary targets.",
            "Sanctification Rack: Can do Sanctification Orb without using its once-per-TP limit."],
           "CONFLAGRATOR"),
        sc("death_cult_assassin", "Death Cult Assassin", [("Throwing knives", 4, "3+", "2/5", 'Range 6", Silent')], [("Ritual blades", 4, "2+", "4/6", "-")],
           ["Bladed Stance: Fighting/retaliating, resolve one success early as a block.",
            "Trained Assassin (1AP): Change its order. Not within enemy control range."],
           "DEATH CULT ASSASSIN", wounds=8, apl=3),
        sc("drill_abbot", "Drill Abbot", [], [("Great hammer", 4, "4+", "4/4", "Brutal, Shock")],
           ["Schola Progenium Disciplinarian: Sanctifiers within 6\" ignore injured stat changes.",
            "Null Skull: Enemies within 4\" can't have their APL added to (positive changes removed)."],
           "DRILL ABBOT"),
        sc("miraculist", "Miraculist",
           [("Holy light", 4, "2+", "4/3", 'Range 8", Devastating 3, Limited 1, Piercing 1, Saturate, Blaze'), ("Wreathe in fire", 4, "2+", "4/4", 'Blast 1", Limited 1, Wreathed, Blaze')],
           [("Burning hands", 1, "2+", "7/8", "Brutal, Limited 1, Blaze"), ("Fists", 2, "5+", "1/2", "-")],
           ["Wreathed (weapon rule): Can shoot in enemy control range. This is the primary target but isn't affected; shoot only the secondary targets, which can't be in cover or obscured.",
            "Miracle: The first time it would be incapacitated, it stays on 1 wound, can't be incapacitated that action, all remaining attack dice are discarded, and it makes a free Dash or Fall Back (max 3\")."],
           "MIRACULIST", save="4+"),
        missionary("missionary_flamer_brazier", "flamer & brazier", [MIN_FLAMER, BRAZIER_R], [BRAZIER_M], False),
        missionary("missionary_flamer_relic", "flamer & holy relic", [MIN_FLAMER], [GUN_BUTT], True),
        missionary("missionary_melta", "meltagun & holy relic", [MELTA], [CHAINSWORD], True),
        missionary("missionary_plasma", "plasma gun & brazier", PLASMA + [BRAZIER_R], [BRAZIER_M, CHAINSWORD], False),
        sc("persecutor", "Persecutor", [HAND_FLAMER[:2] + ("3+",) + HAND_FLAMER[3:]], [("Eviscerator", 4, "4+", "5/6", "Brutal")],
           ["Merciless Castigation: First Fight each activation, if both survive: a free Fight against the same enemy.",
            "Fanatical Retribution: Incapacitated during a Fight: strike with one unresolved success first."],
           "PERSECUTOR"),
        sc("preacher", "Preacher", [HAND_FLAMER], [CHAINSWORD],
           ["Defend the Faith: While it controls an objective, it's benefitting from the SERMON."], "PREACHER"),
        sc("reliquant", "Reliquant", [HAND_FLAMER], [GUN_BUTT],
           ["Cult Icon: Markers within 4\" of it that Sanctifiers contest: your total APL counts 1 higher.",
            "Imperial Cult Devotion: Once/TP, a ready Sanctifier visible within 6\" is incapacitated: it makes one free action (not Fight, can change order) before removal."],
           "RELIQUANT"),
        sc("salvationist", "Salvationist", [], [("Soulstave", 3, "5+", "2/3", "-")],
           ["Conversion Field: Enemies more than 6\" from this shooting a Sanctifier within 6\" of this: that Sanctifier's Save +1.",
            "Medikit (1AP): A Sanctifier in control range regains up to 2D3 wounds. Not within enemy control range."],
           "MEDIC, SALVATIONIST"),
    ],
}
