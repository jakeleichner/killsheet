BOLTER = ("Autoch-pattern bolter", 4, "4+", "3/4", "Accurate 1")
ION = ("Ion blaster", 4, "4+", "3/4", "Piercing Crits 1")
BOLT_PISTOL = ("Autoch-pattern bolt pistol", 4, "4+", "3/4", 'Range 8", Accurate 1')
FISTS = ("Fists", 3, "4+", "2/3", "-")
CHOICE = "Loadout: an Autoch-pattern bolter or ion blaster, plus fists."

def hk(oid, name, ranged, melee, abilities, kw, wounds=8, move='5"'):
    return {"id": oid, "name": "Hearthkyn " + name, "apl": 2, "move": move, "save": "3+", "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged, abilities=None):
    return hk(oid, "Gunner (" + label + ")", ranged, [FISTS], abilities or [], "GUNNER")

GUNNERS = ["gunner_beamer", "gunner_auto", "gunner_rotary", "gunner_missile", "gunner_rail"]

TEAM = {
    "id": "hearthkyn", "source": "hearthkyn_salvagers", "name": "Hearthkyn Salvagers", "badge": "LEAGUES OF VOTANN", "color": "#C2873A",
    "archetypes": "Recon, Security",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Theyn", "min": 1, "max": 1, "ids": ["theyn"]},
            {"name": "Operatives", "desc": "9 Hearthkyn Salvager operatives from the list below", "min": 9, "max": 9,
             "ids": ["dozr", "field_medic", "grenadier"] + GUNNERS + ["jump_pack", "kinlynk", "kognitaar", "lokatr", "lugger", "warrior_bolter", "warrior_ion"]},
        ],
        "repeatable": ["warrior_bolter", "warrior_ion"],
        "caps": [{"ids": GUNNERS, "max": 3, "label": "Up to 3 Gunners (each with a different weapon)"}],
        "rules": [
            "Select 1 Theyn, armed with one ranged weapon (bolt pistol, bolter, bolt revolver, EtaCarn plasma pistol, ion blaster or ion pistol) plus a concussion gauntlet or plasma weapon.",
            "Select 9 other operatives. You can take up to 3 Gunners (each with a different weapon) and several Warriors, but every other operative only once.",
            "Kinlynk, Kognitâar, Lokâtr, Lugger and Warriors carry an Autoch-pattern bolter or ion blaster.",
        ],
    },
    "factionRules": [
        ("Grudge", "An enemy that incapacitates a Salvager gains a Grudge token for the battle. When attacking an enemy, retain one normal success as a critical success for each of its Grudge tokens (Accurate ones included). Tokens aren't removed."),
    ],
    "ploys": {
        "strategy": [
            ("Wrought Defence", "When one is shot and has one or fewer successes after re-rolls, retain one fail as a normal success."),
            ("Proximate Firepower", "When shooting an enemy within 6\", ranged weapons improve their Hit by 1 (to a maximum of 3+)."),
            ("Need Keeps", "Pick an objective or mission marker. When working out who controls it, your contesting operatives' total APL counts as 1 higher. Salvagers within 3\" of it get +1 Atk on melee weapons (to a maximum of 4, or Balanced if already 4)."),
            ("Toil Earns", "Pick an objective or mission marker. Enemies within 3\" of it count as having one extra Grudge token."),
        ],
        "firefight": [
            ("Sturdy", "When one is shot, as you collect defence dice, the attacker's retained critical successes become normal successes."),
            ("Engage to Acquire", "After rolling attack dice against an enemy that controls an objective or one of your mission markers, re-roll any of them."),
            ("The Ancestors Are Watching", "This activation, make a free Shoot or Fight, ignoring changes to weapon stats from being injured."),
            ("Worth It", "When a Salvager is incapacitated, it makes a free mission action before it's removed."),
        ],
    },
    "equipment": [
        {"id": "excavation_tools", "name": "Excavation Tools", "desc": "Pick Up Marker costs 1 less AP and only needs the marker contested, not controlled."},
        {"id": "writ_of_claim", "name": "Writ of Claim", "desc": "Once per battle, while contesting two or more objectives, re-roll your initiative roll-off."},
        {"id": "plasma_knives", "name": "Plasma Knives", "desc": "Salvagers get a plasma knife (the Field Medic uses its own better one).", "gw": ("melee", "Plasma knife", 3, "4+", "3/5", "Lethal 5+")},
        {"id": "climbing_rigs", "name": "Climbing Rigs", "desc": "In each activation, climbing counts as 2\" vertically, or it can ignore a drop."},
    ],
    "operatives": [
        hk("theyn", "Theyn", [BOLT_PISTOL, BOLTER, ("Bolt revolver", 4, "3+", "3/5", 'Range 8"'), ("EtaCarn plasma pistol", 4, "4+", "3/5", 'Range 8", Piercing 1'), ION, ("Ion pistol", 4, "3+", "3/4", 'Range 8", Piercing Crits 1')],
           [("Concussion gauntlet", 4, "4+", "5/7", "Brutal, Shock"), ("Plasma weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: one ranged weapon from its datacard, plus a concussion gauntlet or plasma weapon.",
            "Eye of the Ancestors: STRATEGIC GAMBIT, while it's in the killzone. One enemy (two if three or more Salvagers are incapacitated) gains a Grudge token.",
            "Weavefield Crest: Once per battle, ignore the Normal Dmg from one attack die."],
           "LEADER, THEYN", wounds=9),
        hk("dozr", "Dôzr", [("Autoch-pattern bolt pistol", 4, "4+", "3/4", 'Range 8", Accurate 1')], [("Concussion knux", 4, "3+", "4/4", "Ceaseless, Lethal 5+, Shock")],
           ["Brawler: When it fights or retaliates, enemies can't assist, and Normal Dmg of 4 or more inflicts 1 less damage on it. If it's incapacitated, it strikes with one unresolved success first.",
            "Knux Smash (1AP): Move an enemy in its control range up to 3\", then inflict D3+1 damage on it (on a 3, it also gets -1 APL until the end of its next activation). Then this operative can make a free Charge of up to 3\"."],
           "DÔZR"),
        hk("field_medic", "Field Medic", [("Bolt revolver", 4, "4+", "3/5", 'Range 8"')], [("Plasma knife", 4, "4+", "3/5", "Lethal 5+")],
           ["Medic!: The first time each turning point another Salvager visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends.",
            "Medikit (1AP): A Salvager in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
           "MEDIC, FIELD MEDIC"),
        hk("grenadier", "Grenadier", [BOLT_PISTOL, ("C8 HX charge", 4, "3+", "4/6", 'Range 4", Blast 1", Heavy (Reposition only), Limited 1, Piercing 1, Saturate')], [FISTS],
           ["Grenadier: It can use frag, krak, smoke and stun grenades without using up equipment, and gets +1 to Hit with frag and krak grenades.",
            "Vâyr-3 Utility Grenade (1AP): Place a Utility Grenade marker visible within 6\" (or on visible Vantage terrain). Operatives within 3\" of it pay 1 extra AP for Pick Up Marker and mission actions. Remove it after D3 activations in the next turning point, or at the end of the turning point. It can't do this within enemy control range."],
           "GRENADIER"),
        gunner("gunner_beamer", "EtaCarn plasma beamer", [("EtaCarn plasma beamer", 4, "4+", "5/6", "Piercing 1, Beam")],
               ["Beam (weapon rule): Each retained critical success inflicts D3 damage on every other operative along one beam line through the target's base (not crossing Heavy terrain). The target itself isn't affected."]),
        gunner("gunner_auto", "HYLas auto rifle", [("HYLas auto rifle", 4, "4+", "4/5", "Ceaseless, Rending")]),
        gunner("gunner_rotary", "HYLas rotary cannon", [("HYLas rotary cannon (focused)", 5, "4+", "4/5", "Ceaseless, Heavy (Reposition only), Saturate"), ("HYLas rotary cannon (sweeping)", 4, "4+", "4/5", 'Ceaseless, Heavy (Reposition only), Saturate, Torrent 1"')]),
        gunner("gunner_missile", "L7 missile launcher", [("L7 missile launcher (blast)", 4, "4+", "3/5", 'Blast 2"'), ("L7 missile launcher (focused)", 4, "4+", "5/6", "Piercing 1")]),
        gunner("gunner_rail", "magna rail rifle", [("Magna rail rifle", 4, "4+", "4/2", "Devastating 3, Heavy (Dash only), Piercing 2")]),
        hk("jump_pack", "Jump Pack Warrior", [BOLT_PISTOL], [("Plasma weapon", 4, "3+", "4/6", "Lethal 5+, Force Impact")],
           ["Jump Pack: When an action moves it, it can fly instead: set it up wholly within its Move (3\" for a Dash) horizontally, and not in enemy control range unless it's Charging. It gets no extra Charge distance, and in close quarters it can't fly through walls or hatchways.",
            "Force Impact (weapon rule): When it fights after Charging this activation, it gains Brutal."],
           "JUMP PACK WARRIOR", move='8"'),
        hk("kinlynk", "Kinlynk", [BOLTER, ION], [FISTS],
           [CHOICE, "Signal (1AP): SUPPORT. Another Salvager in the killzone gets +1 APL until the end of its next activation. It can't do this within enemy control range.",
            "System Jam (1AP): An enemy that's a valid target and has no System Jam token gains one. It can't activate until every enemy without a token is expended, and loses the token when it activates. It can't do this within enemy control range."],
           "KINLYNK"),
        hk("kognitaar", "Kognitâar", [BOLTER, ION], [FISTS],
           [CHOICE, "Tactician: STRATEGIC GAMBIT, while it's in the killzone. Place your Attack marker (Salvagers attacking enemies within 3\" of it gain Balanced) or your Defence marker (Salvagers within 3\" of it re-roll one defence die when shot). Remove it in the next Ready step.",
            "Accelerated Appraisal (1AP): Place or move your Attack or Defence marker. It can't do this within enemy control range."],
           "KOGNITÂAR"),
        hk("lokatr", "Lokâtr", [BOLTER, ION], [FISTS],
           [CHOICE, "Spot (1AP): SUPPORT. Pick a visible enemy. Until the end of the turning point, Salvagers within 3\" of this operative gain Seek Light when shooting it, and it can't be obscured. It can't do this within enemy control range.",
            "Pan Spectral Scan (1AP): Place your scan marker. Salvagers shooting enemies within 3\" of it gain Accurate 1 and Saturate. Remove it at this operative's next activation. It can't do this within enemy control range."],
           "LOKÂTR"),
        hk("lugger", "Lugger", [BOLTER, ION], [FISTS],
           [CHOICE, "Well Supplied: Take one extra equipment option, and gain 1CP in the first Ready step.",
            "I've Got It: Once per activation, a mission action costs it 1 less AP."],
           "LUGGER"),
        hk("warrior_bolter", "Warrior (bolter)", [BOLTER], [FISTS],
           ["Secure Salvage: While it contests an objective or one of your mission markers, subtract 1 damage from one success when it's attacked."], "WARRIOR"),
        hk("warrior_ion", "Warrior (ion blaster)", [ION], [FISTS],
           ["Secure Salvage: While it contests an objective or one of your mission markers, subtract 1 damage from one success when it's attacked."], "WARRIOR"),
    ],
}
