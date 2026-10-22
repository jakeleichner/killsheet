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
            "Select 9 other operatives. You can take several Warriors, but every other operative only once.",
            "Warriors carry a bolt revolver and plasma knife, or a bolt shotgun and fists.",
        ],
    },
    "factionRules": [
        ("Resourceful", "In the Ready step of each Strategy phase after the first, gain points for Yaegirs in the killzone outside enemy control range: 2 points for five or more, 1 point for one to four. Discard them at the end of the turning point. Spend 1 per activation, outside enemy control range: +1 APL for that activation, or regain up to D3+1 wounds when it activates."),
        ("Dauntless Explorers", "STRATEGIC GAMBIT in the first turning point: each Yaegir wholly in your drop zone can make a free Reposition, ending wholly within 4\" of it."),
    ],
    "ploys": {
        "strategy": [
            ("Masterful Bladework", "When one fights, or retaliates with a Conceal order, melee weapons get +1 Atk (to a maximum of 4) and Balanced (or Ceaseless if they already have Balanced)."),
            ("Tough Survivalists", "The first time each Yaegir takes damage from an attack die this turning point, halve it (rounding up, to a minimum of 2)."),
            ("Hidden Engagement", "When shooting while in cover from the target's view, weapons gain Balanced."),
            ("In Position", "While Yaegirs have a Conceal order and are in cover, enemies more than 2\" away can't target them. This overrides every other rule."),
        ],
        "firefight": [
            ("Bonds That Bind", "When one is activated, pick another ready Yaegir visible within 3\" and activate it next. Neither can be a Bombast that used Wroughtlock Negotiation this turning point."),
            ("No Kin Left Behind", "When a Yaegir is incapacitated, move your Fallen Kin marker to it. Yaegirs within 3\" of the marker can retain one fail as a normal success, or one normal success as a critical success, when attacking."),
            ("Sturdy", "When a Yaegir is shot, as you collect defence dice, the attacker's retained critical successes become normal successes."),
            ("Stalwart Defence", "When an enemy ends a Charge in a Yaegir's control range, another Yaegir visible within 6\" (and outside enemy control range) makes a free Shoot at that enemy only. No grenades, Blast or x\" Devastating."),
        ],
    },
    "equipment": [
        {"id": "stabilised_shells", "name": "Stabilised Bolt Shells", "desc": "Up to twice per turning point, a bolt shotgun (long range) improves its Hit by 1, gets +1 Normal and Critical Dmg, and gains Accurate 1."},
        {"id": "firestorm_shells", "name": "Firestorm Bolt Shells", "desc": "Once per turning point, a bolt shotgun (short range) gains Blast 1\"."},
        {"id": "plasma_knives", "name": "Plasma Knives", "desc": "All Yaegirs get a plasma knife. Operatives that already have a better one use theirs, and it gains Balanced.",
         "gw": ("melee", "Plasma knife", 3, "4+", "3/5", "Lethal 5+")},
        {"id": "undersuit", "name": "Kv-ceramide Undersuit", "desc": "When one is shot by Blast or Torrent, re-roll one defence die. It isn't affected by x\" Devastating unless it's the target."},
    ],
    "operatives": [
        op("theyn", "Yaegir Theyn", [("Bolt revolver", 4, "3+", "3/5", 'Range 8"')] + SHOTGUN, [("Plasma knife", 4, "3+", "3/5", "Lethal 5+")],
           ["Veteran Adventurer: In the Ready step of each Strategy phase after the first, if it's in the killzone and outside enemy control range, gain 1 extra Resourceful point.",
            "Outright Conviction: The first time it would be incapacitated, it stays on 1 wound and can't be incapacitated for the rest of that action. All remaining attack dice are discarded."],
           "LEADER, THEYN", wounds=9),
        op("bladekyn", "Yaegir Bladekyn", [("Throwing plasma knife", 4, "3+", "3/5", 'Range 6", Lethal 5+, Limited 1, Silent')], [("Dual plasma knives", 4, "3+", "3/5", "Ceaseless, Lethal 5+")],
           ["Stalker: It can Charge while it has a Conceal order.",
            "Irrepressible Hardiness: If it's incapacitated during a Fight action, it strikes with one unresolved success before it's removed."],
           "BLADEKYN"),
        op("bombast", "Yaegir Bombast", [("Wroughtlock revolvers", 4, "3+", "3/5", 'Range 9", Ceaseless, Lethal 5+')], [FISTS],
           ["Wroughtlock Negotiation: STRATEGIC GAMBIT. It makes a free Shoot, and can switch to Engage to do so.",
            "Brazen Killer: When it incapacitates an enemy with its revolvers, roll a D6 for each other enemy visible within 2\" of that enemy. If the roll beats its APL, it gets -1 APL until the end of its next activation."],
           "BOMBAST"),
        op("gunner", "Yaegir Gunner", [("APM launcher (armour piercing)", 5, "4+", "4/5", "Heavy (Reposition only), Piercing 1, Bipod"),
                                       ("APM launcher (breaching)", 5, "4+", "3/5", 'Blast 2", Heavy (Reposition only), Bipod'),
                                       ("APM launcher (high explosive)", 5, "4+", "2/4", 'Blast 3", Heavy (Reposition only), Bipod')], [FISTS],
           ["Bipod (weapon rule): If it hasn't moved this activation, or it's counteracting, the APM launcher gains Ceaseless. It can still move afterwards."],
           "GUNNER"),
        op("ironbraek", "Yaegir Ironbraek", [REVOLVER], [("Entrencher", 3, "4+", "3/4", "-")],
           ["Minefield: Set up 5 face-down Minefield markers (3 HY-Pex mines and 2 blanks) as one equipment item. Each must be more than 2\" from markers, access points and Accessible terrain, and more than 6\" from the enemy drop zone and each other. When this operative is readied outside enemy control range, reset one flipped marker in its control range.",
            "HY-Pex Mines: A face-down marker in an enemy's control range (and no Yaegir's) flips over. If it's a mine, inflict 3 damage, then roll a D6. If the roll is below the enemy's Save, inflict extra damage equal to the roll. If it survives, its action ends."],
           "IRONBRAEK"),
        op("riflekyn", "Yaegir Riflekyn", [("Magna-coil rifle (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Piercing 1, Silent, Concealed Position"),
                                           ("Magna-coil rifle (mobile)", 4, "3+", "3/4", "Heavy (Reposition only), Piercing 1"),
                                           ("Magna-coil rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy, Piercing 1")], [FISTS],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
            "Weavewërke Cloak: When it's shot, ignore Saturate. If it retains cover saves, it can retain one extra, or one as a critical success. This doesn't stack with Vantage terrain."],
           "RIFLEKYN"),
        op("tracker", "Yaegir Tracker", [("SiNR handbow", 4, "4+", "3/5", "Silent"), ("Throwing hatchet", 4, "3+", "3/5", 'Range 6", Limited 1, Rending, Silent')],
           [("Hatchet", 4, "3+", "4/5", "-")],
           ["Pan Spectral Visor: When it shoots an operative within 6\", its weapon gains Seek Light, and the target can't be obscured.",
            "Tracker: When it attacks an expended operative within 6\", its weapons gain Punishing."],
           "TRACKER"),
        op("warrior_revolver", "Yaegir Warrior (revolver)", [REVOLVER], [("Plasma knife", 4, "4+", "3/5", "Lethal 5+")],
           ["Intrepid: When you spend a Resourceful point on it, the +1 APL lasts until its next activation starts, or it regains up to 4 wounds."], "WARRIOR"),
        op("warrior_shotgun", "Yaegir Warrior (shotgun)", SHOTGUN, [FISTS],
           ["Intrepid: When you spend a Resourceful point on it, the +1 APL lasts until its next activation starts, or it regains up to 4 wounds."], "WARRIOR"),
    ],
}
