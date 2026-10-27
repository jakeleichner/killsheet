HAND_FLAMER = ("Hand flamer", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1", Blaze')
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")
CHAINSWORD = ("Chainsword", 4, "4+", "4/5", "-")
MIN_FLAMER = ("Ministorum flamer", 4, "2+", "4/4", 'Range 8", Saturate, Torrent 2", Blaze')
BRAZIER_R = ("Brazier of holy fire", 4, "2+", "4/4", 'Range 4", Saturate, Torrent 1", Blaze')
BRAZIER_M = ("Brazier of holy fire", 4, "4+", "4/4", "Shock, Blaze")
MELTA = ("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')
PLASMA = [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]
RELIC = "Holy Relic: It always benefits from the Sermon."
SPREAD = "Spread the Word of the God-Emperor: While it's more than 6\" from other friendly operatives, its weapons gain Severe."

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
            {"ids": MISS_B, "max": 1, "label": "Only 1 Missionary with a meltagun or plasma gun"},
            {"ids": ["missionary_flamer_brazier", "missionary_plasma"], "max": 1, "label": "Only 1 brazier of holy fire"},
        ],
        "rules": [
            "Select 1 Confessor and 1 Cherub.",
            "Select 9 other operatives. You can take up to 4 Preachers, but every other operative only once.",
            "Missionaries pick one weapon from each of two lists. First: a Ministorum flamer with a brazier of holy fire, or with a gun butt and holy relic. Second: a meltagun, chainsword and holy relic, or a plasma gun, chainsword and brazier of holy fire.",
            "Only one option with a brazier of holy fire.",
        ],
    },
    "factionRules": [
        ("Ministorum Sermon", "STRATEGIC GAMBIT: pick a Sanctifier (the Confessor, if it's alive) to be your Orator until you use this again. Sanctifiers within 3\" of the Orator (6\" if it's the Confessor) benefit from the Sermon."),
        ("Blaze", "Weapon rule. If any critical successes inflict damage, the target gains your Blaze token. When it activates, it takes D3 damage, then its player either rolls a D6 (removing the token on a 3+) or takes -1 APL for that activation to remove it."),
    ],
    "ploys": {
        "strategy": [
            ("The Emperor Protects", "When a Sanctifier benefiting from the Sermon is shot, re-roll any defense dice showing one result of your choice."),
            ("Fervent Brawl", "While one benefits from the Sermon, melee weapons gain Ceaseless, and Normal and Critical Dmg of 4 or more inflicts 1 less damage on it. One that activates in range of the Orator keeps the Sermon for that whole activation."),
            ("Zealous Persecution", "When one fights after Charging this activation, melee weapons gain Lethal 5+."),
            ("Rally the Flock", "Each Sanctifier (not the Orator) benefiting from the Sermon makes a free Dash or Fall Back of up to 3\", ending closer to the Orator and visible to it. You can't use this in the first turning point."),
        ],
        "firefight": [
            ("Rosarius", "When an attack die inflicts Normal Dmg on a Sanctifier, ignore that damage."),
            ("Ardent Eradication", "After rolling attack dice against an enemy within 3\" of the Orator (6\" for the Confessor), re-roll any of them."),
            ("Redeemed Through Fire", "When a Sanctifier with a Blaze weapon is incapacitated, each enemy visible within 2\" of it gains your Blaze token."),
            ("Unwavering Devotion", "When the Orator or Miraculist is picked as the target of a Shoot or Fight, another Sanctifier (not the Confessor, Miraculist or Orator) visible within 3\" takes its place. No effect against Blast or Torrent."),
        ],
    },
    "equipment": [
        {"id": "sanctification_orbs", "name": "Sanctification Orbs", "desc": "Once per turning point, a Sanctifier (not the Cherub, Assassin or Miraculist) can take Sanctification Orb (1AP). An enemy visible within 6\", and others within 1\" of it, roll a D6. On a 3+, they gain a Doused token. Blaze weapons gain Seek against Doused enemies, and the token goes after a Blaze attack. It can't do this within enemy control range."},
        {"id": "imperial_cult_symbols", "name": "Imperial Cult Symbols", "desc": "Once per turning point, when a Sanctifier benefiting from the Sermon is shot, change one of the attacker's retained critical successes to a normal success."},
        {"id": "purity_seals", "name": "Purity Seals", "desc": "Once per turning point when shooting or fighting, if you fail two or more dice, discard one failure to retain another as a normal success."},
        {"id": "ecclesiarchy_texts", "name": "Ecclesiarchy Texts", "desc": "In the Ready step, roll 3D6. If the result is less than the Orator's remaining wounds, gain 1CP."},
    ],
    "operatives": [
        sc("confessor", "Confessor", [], [("Mace of Censure", 4, "3+", "5/5", "Brutal, Shock")],
           ["Commanding Declamation: When an enemy visible within 6\" would take an action, roll a D6. If it beats that enemy's APL, it can't take that action this activation (its AP isn't refunded, and a counteraction ends), and you can't use this rule again in the battle.",
            "Lead the Procession: After the first turning point, when it's the Orator and it Charges, Falls Back or Repositions, Sanctifiers benefiting from the Sermon and visible to it can each make a free Charge, Fall Back or Reposition of up to 3\", ending still in the Sermon."],
           "LEADER, CONFESSOR", wounds=10, pts=32),
        sc("cherub", "Cherub", [], [("Incentiviser", 3, "5+", "1/3", "Shock")],
           ["Cherub: Its APL counts as 1 lower for objective control. While it has a Conceal order and is in cover, enemies more than 2\" away can't target it. It can only use its own weapons, and has no unique actions except Incentivize.",
            "Fly: When it Charges, Falls Back or Repositions, it can fly instead: set it up wholly within its Move horizontally, and not in enemy control range unless it's Charging.",
            "Incentivize (1AP): SUPPORT. Another Sanctifier (not the Confessor, Death Cult Assassin, Miraculist or Orator) visible within 2\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
           "CHERUB", wounds=5, move='7"'),
        sc("conflagrator", "Conflagrator", [("Twin hand flamers (focused)", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 2", Blaze'), ("Twin hand flamers (twin torrent)", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 0", Twin Torrent, Blaze')],
           [("Gun butts", 4, "4+", "2/3", "-")],
           ["Twin Torrent (weapon rule): Shoot two different valid targets that aren't in friendly control range, rolling separately. No secondary targets.",
            "Sanctification Rack: It can take Sanctification Orb without using up the once-per-turning-point limit."],
           "CONFLAGRATOR"),
        sc("death_cult_assassin", "Death Cult Assassin", [("Throwing knives", 4, "3+", "2/5", 'Range 6", Silent')], [("Ritual blades", 4, "2+", "4/6", "-")],
           ["Bladed Stance: When it fights or retaliates, resolve one success early, as a block.",
            "Trained Assassin (1AP): Change its order. It can't do this within enemy control range."],
           "DEATH CULT ASSASSIN", wounds=8, apl=3),
        sc("drill_abbot", "Drill Abbot", [], [("Great hammer", 4, "4+", "4/4", "Brutal, Shock")],
           ["Schola Progenium Disciplinarian: Sanctifiers within 6\" of it ignore stat changes from being injured.",
            "Null Skull: Enemies within 4\" of it can't have their APL increased, and lose any increases they have."],
           "DRILL ABBOT"),
        sc("miraculist", "Miraculist",
           [("Holy light", 4, "2+", "4/3", 'Range 8", Devastating 3, Limited 1, Piercing 1, Saturate, Blaze'), ("Wreathe in fire", 4, "2+", "4/4", 'Blast 1", Limited 1, Wreathed, Blaze')],
           [("Burning hands", 1, "2+", "7/8", "Brutal, Limited 1, Blaze"), ("Fists", 2, "5+", "1/2", "-")],
           ["Wreathed (weapon rule): It can shoot while in enemy control range. It's the primary target but isn't affected. Shoot only the secondary targets, which can't be in cover or obscured.",
            "Miracle: The first time it would be incapacitated, it stays on 1 wound and can't be incapacitated for the rest of that action. All remaining attack dice are discarded, and it makes a free Dash or Fall Back of up to 3\"."],
           "MIRACULIST", save="4+"),
        missionary("missionary_flamer_brazier", "flamer & brazier", [MIN_FLAMER, BRAZIER_R], [BRAZIER_M], False),
        missionary("missionary_flamer_relic", "flamer & holy relic", [MIN_FLAMER], [GUN_BUTT], True),
        missionary("missionary_melta", "meltagun & holy relic", [MELTA], [CHAINSWORD], True),
        missionary("missionary_plasma", "plasma gun & brazier", PLASMA + [BRAZIER_R], [BRAZIER_M, CHAINSWORD], False),
        sc("persecutor", "Persecutor", [HAND_FLAMER[:2] + ("3+",) + HAND_FLAMER[3:]], [("Eviscerator", 4, "4+", "5/6", "Brutal")],
           ["Merciless Castigation: After its first Fight each activation, if both survive, it makes a free Fight against the same enemy.",
            "Fanatical Retribution: If it's incapacitated during a Fight, it strikes with one unresolved success first."],
           "PERSECUTOR"),
        sc("preacher", "Preacher", [HAND_FLAMER], [CHAINSWORD],
           ["Defend the Faith: While it controls an objective, it benefits from the Sermon."], "PREACHER"),
        sc("reliquant", "Reliquant", [HAND_FLAMER], [GUN_BUTT],
           ["Cult Icon: For markers within 4\" of it that Sanctifiers contest, your total APL counts as 1 higher.",
            "Imperial Cult Devotion: Once per turning point, when a ready Sanctifier visible within 6\" is incapacitated, it makes one free action before it's removed (not Fight, and it can change order)."],
           "RELIQUANT"),
        sc("salvationist", "Salvationist", [], [("Soulstave", 3, "5+", "2/3", "-")],
           ["Conversion Field: When enemies more than 6\" from it shoot a Sanctifier within 6\" of it, that Sanctifier's Save improves by 1.",
            "Medikit (1AP): A Sanctifier in its control range regains up to 2D3 wounds. It can't do this within enemy control range."],
           "MEDIC, SALVATIONIST"),
    ],
}
