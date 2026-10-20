FISTS = ("Fists", 3, "4+", "2/3", "-")
REVOLVER = ("Bolt revolver", 4, "4+", "3/5", 'Range 8"')
SHOTGUN = [("Bolt shotgun (short)", 4, "3+", "4/4", 'Range 6"'), ("Bolt shotgun (long)", 4, "5+", "2/3", "-")]

def op(oid, name, ranged, melee, abilities, kw, wounds=8):
    return {"id": oid, "name": name, "apl": 2, "move": '5"', "save": "4+", "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "hernkyn", "source": "hernkyn_yaegirs", "name": "Hernkyn Yaegirs", "badge": "LEAGUES OF VOTANN", "color": "#9C6B3F",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Theyn", "min": 1, "max": 1, "ids": ["theyn"]},
            {"name": "Operatives", "desc": "9 Hernkyn Yaegir operatives from the list below", "min": 9, "max": 9,
             "ids": ["bladekyn", "bombast", "gunner", "ironbraek", "riflekyn", "tracker", "warrior_revolver", "warrior_shotgun"]},
        ],
        "repeatable": ["warrior_revolver", "warrior_shotgun"],
        "rules": [
            "Select 1 Theyn.",
            "Select 9 other operatives. Other than Warriors, each only once.",
            "Warriors carry a bolt revolver + plasma knife, or a bolt shotgun + fists.",
        ],
    },
    "factionRules": [
        ("Resourceful", "Ready step of each Strategy phase after the first: gain points by Yaegirs in the killzone not in enemy control range (5+: 2, 1-4: 1). Discarded at end of TP. Spend 1 per activation: +1 APL for the activation (not in enemy control range), or on activation regain up to D3+1 wounds (not in enemy control range)."),
        ("Dauntless Explorers", "STRATEGIC GAMBIT in TP1: each Yaegir wholly in your drop zone can make a free Reposition, ending wholly within 4\" of it."),
    ],
    "ploys": {
        "strategy": [
            ("Masterful Bladework", "Fighting, or retaliating on Conceal: +1 melee Atk (max 4) and Balanced (Ceaseless instead if already Balanced)."),
            ("Tough Survivalists", "First time each Yaegir takes damage from an attack dice this TP: halve it (round up, min 2)."),
            ("Hidden Engagement", "Shooting while in cover from the target's view: weapons gain Balanced."),
            ("In Position", "Yaegirs on Conceal and in cover can't be targeted (overrides everything except within 2\")."),
        ],
        "firefight": [
            ("Bonds That Bind", "On activation, pick another ready Yaegir visible within 3\": activate it next. Not a Bombast that used Wroughtlock Negotiation this TP."),
            ("No Kin Left Behind", "Yaegir incapacitated: move your Fallen Kin marker to it. Yaegirs within 3\" of the marker attacking: retain a fail as normal or a normal as crit."),
            ("Sturdy", "Yaegir being shot, when collecting defence dice: attacker's retained crits become normals."),
            ("Stalwart Defence", "Enemy ends a Charge in a Yaegir's control range: another Yaegir visible within 6\" (not in enemy control range) gets a free Shoot at that enemy only. No grenades, Blast or x\" Devastating."),
        ],
    },
    "equipment": [
        {"id": "stabilised_shells", "name": "Stabilised Bolt Shells", "desc": "Up to 2x/TP, bolt shotgun (long): Hit +1, +1 both Dmg, gains Accurate 1."},
        {"id": "firestorm_shells", "name": "Firestorm Bolt Shells", "desc": "Once/TP, bolt shotgun (short) gains Blast 1\"."},
        {"id": "plasma_knives", "name": "Plasma Knives", "desc": "All Yaegirs gain a plasma knife. Operatives with a better one use theirs, which gains Balanced.",
         "gw": ("melee", "Plasma knife", 3, "4+", "3/5", "Lethal 5+")},
        {"id": "undersuit", "name": "Kv-ceramide Undersuit", "desc": "Shot by Blast/Torrent: re-roll one defence die. Unaffected by x\" Devastating unless the target."},
    ],
    "operatives": [
        op("theyn", "Yaegir Theyn", [("Bolt revolver", 4, "3+", "3/5", 'Range 8"')] + SHOTGUN, [("Plasma knife", 4, "3+", "3/5", "Lethal 5+")],
           ["Veteran Adventurer: Ready step of each Strategy phase after the first, if in killzone and not in enemy control range: +1 Resourceful point.",
            "Outright Conviction: First time it would be incapacitated: stays on 1 wound, can't be incapacitated that action; all remaining attack dice discarded."],
           "LEADER, THEYN", wounds=9),
        op("bladekyn", "Yaegir Bladekyn", [("Throwing plasma knife", 4, "3+", "3/5", 'Range 6", Lethal 5+, Limited 1, Silent')], [("Dual plasma knives", 4, "3+", "3/5", "Ceaseless, Lethal 5+")],
           ["Stalker: Can Charge while Concealed.",
            "Irrepressible Hardiness: Incapacitated during the Fight action: strike with one unresolved success before removal."],
           "BLADEKYN"),
        op("bombast", "Yaegir Bombast", [("Wroughtlock revolvers", 4, "3+", "3/5", 'Range 9", Ceaseless, Lethal 5+')], [FISTS],
           ["Wroughtlock Negotiation: STRATEGIC GAMBIT. Free Shoot (can switch to Engage to do so).",
            "Brazen Killer: Incapacitates an enemy with its revolvers: roll D6 for each other enemy visible within 2\" of it; if higher than its APL, -1 APL until end of its next activation."],
           "BOMBAST"),
        op("gunner", "Yaegir Gunner", [("APM launcher (armour piercing)", 5, "4+", "4/5", "Heavy (Reposition only), Piercing 1, Bipod"),
                                       ("APM launcher (breaching)", 5, "4+", "3/5", 'Blast 2", Heavy (Reposition only), Bipod'),
                                       ("APM launcher (high explosive)", 5, "4+", "2/4", 'Blast 3", Heavy (Reposition only), Bipod')], [FISTS],
           ["Bipod (weapon rule): If it hasn't moved this activation, or it's a counteraction, the APM launcher gains Ceaseless (can still move after)."],
           "GUNNER"),
        op("ironbraek", "Yaegir Ironbraek", [REVOLVER], [("Entrencher", 3, "4+", "3/4", "-")],
           ["Minefield: Set up 5 face-down Minefield markers (3 HY-Pex mines, 2 blanks) as one equipment item: >2\" from markers/access points/Accessible terrain, >6\" from enemy drop zone and each other. When readied (not in enemy control range), reset one flipped marker in its control range.",
            "HY-Pex Mines: A face-down marker in an enemy's control range (and no Yaegir's) flips. Mine: 3 dmg, then D6; if below its Save, extra dmg equal to the roll. If it survives, its action ends."],
           "IRONBRAEK"),
        op("riflekyn", "Yaegir Riflekyn", [("Magna-coil rifle (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Piercing 1, Silent, Concealed Position"),
                                           ("Magna-coil rifle (mobile)", 4, "3+", "3/4", "Heavy (Reposition only), Piercing 1"),
                                           ("Magna-coil rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy, Piercing 1")], [FISTS],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
            "Weavewërke Cloak: When shot: ignore Saturate; if retaining cover saves, retain one extra or one as a crit (not cumulative with Vantage)."],
           "RIFLEKYN"),
        op("tracker", "Yaegir Tracker", [("SiNR handbow", 4, "4+", "3/5", "Silent"), ("Throwing hatchet", 4, "3+", "3/5", 'Range 6", Limited 1, Rending, Silent')],
           [("Hatchet", 4, "3+", "4/5", "-")],
           ["Pan Spectral Visor: Shooting an operative within 6\": Seek Light and it can't be obscured.",
            "Tracker: Attacking an expended operative within 6\": weapons gain Punishing."],
           "TRACKER"),
        op("warrior_revolver", "Yaegir Warrior (revolver)", [REVOLVER], [("Plasma knife", 4, "4+", "3/5", "Lethal 5+")],
           ["Intrepid: Spending a Resourceful point on it: +1 APL lasts until its next activation starts; or regains up to 4 wounds."], "WARRIOR"),
        op("warrior_shotgun", "Yaegir Warrior (shotgun)", SHOTGUN, [FISTS],
           ["Intrepid: Spending a Resourceful point on it: +1 APL lasts until its next activation starts; or regains up to 4 wounds."], "WARRIOR"),
    ],
}
