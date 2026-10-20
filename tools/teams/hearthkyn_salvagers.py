BOLTER = ("Autoch-pattern bolter", 4, "4+", "3/4", "Accurate 1")
ION = ("Ion blaster", 4, "4+", "3/4", "Piercing Crits 1")
BOLT_PISTOL = ("Autoch-pattern bolt pistol", 4, "4+", "3/4", 'Range 8", Accurate 1')
FISTS = ("Fists", 3, "4+", "2/3", "-")
CHOICE = "Loadout: Autoch-pattern bolter or ion blaster, + fists."

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
        "caps": [{"ids": GUNNERS, "max": 3, "label": "Max 3 Gunners (each a different weapon)"}],
        "rules": [
            "Select 1 Theyn: one ranged weapon (bolt pistol, bolter, bolt revolver, EtaCarn plasma pistol, ion blaster or ion pistol) + concussion gauntlet or plasma weapon.",
            "Select 9 other operatives. Other than Gunners and Warriors, each only once. Max 3 Gunners, each with a different weapon.",
            "Kinlynk, Kognitâar, Lokâtr, Lugger and Warriors carry an Autoch-pattern bolter or ion blaster.",
        ],
    },
    "factionRules": [
        ("Grudge", "An enemy that incapacitates a Salvager gains a Grudge token for the battle. Attacking an enemy: for each of its Grudge tokens, retain one normal success as a crit (including Accurate ones). Tokens aren't removed."),
    ],
    "ploys": {
        "strategy": [
            ("Wrought Defence", "Being shot, with one or fewer successes (after re-rolls): retain a fail as a normal success."),
            ("Proximate Firepower", "Shooting an enemy within 6\": ranged Hit +1 (max 3+)."),
            ("Need Keeps", "Pick an objective or mission marker: your contesting total APL counts +1; Salvagers within 3\" get +1 melee Atk (max 4; Balanced if already 4)."),
            ("Toil Earns", "Pick an objective or mission marker: enemies within 3\" count as having one extra Grudge token."),
        ],
        "firefight": [
            ("Sturdy", "Being shot, when collecting defence dice: attacker's retained crits become normals."),
            ("Engage to Acquire", "After rolling attack dice vs an enemy that controls an objective or your mission marker: re-roll any."),
            ("The Ancestors Are Watching", "This activation, a free Shoot or Fight, ignoring injured weapon stat changes."),
            ("Worth It", "A Salvager is incapacitated: it makes a free mission action before removal."),
        ],
    },
    "equipment": [
        {"id": "excavation_tools", "name": "Excavation Tools", "desc": "Pick Up Marker costs 1 less AP and only needs the marker contested, not controlled."},
        {"id": "writ_of_claim", "name": "Writ of Claim", "desc": "Once/battle, contesting 2+ objectives: re-roll your initiative roll-off."},
        {"id": "plasma_knives", "name": "Plasma Knives", "desc": "Salvagers gain a plasma knife (the Field Medic uses its better one).", "gw": ("melee", "Plasma knife", 3, "4+", "3/5", "Lethal 5+")},
        {"id": "climbing_rigs", "name": "Climbing Rigs", "desc": "Each activation: climbing counts as 2\" vertical, or ignore a drop."},
    ],
    "operatives": [
        hk("theyn", "Theyn", [BOLT_PISTOL, BOLTER, ("Bolt revolver", 4, "3+", "3/5", 'Range 8"'), ("EtaCarn plasma pistol", 4, "4+", "3/5", 'Range 8", Piercing 1'), ION, ("Ion pistol", 4, "3+", "3/4", 'Range 8", Piercing Crits 1')],
           [("Concussion gauntlet", 4, "4+", "5/7", "Brutal, Shock"), ("Plasma weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: one ranged weapon from its card + concussion gauntlet or plasma weapon.",
            "Eye of the Ancestors: STRATEGIC GAMBIT (in killzone): one enemy (two if 3+ Salvagers are incapacitated) gains a Grudge token.",
            "Weavefield Crest: Once/battle, ignore the Normal Dmg from one attack dice."],
           "LEADER, THEYN", wounds=9),
        hk("dozr", "Dôzr", [("Autoch-pattern bolt pistol", 4, "4+", "3/4", 'Range 8", Accurate 1')], [("Concussion knux", 4, "3+", "4/4", "Ceaseless, Lethal 5+, Shock")],
           ["Brawler: Fighting/retaliating: enemies can't assist; if incapacitated, strike with one unresolved success first; Normal Dmg of 4+ inflicts 1 less.",
            "Knux Smash (1AP): An enemy in its control range: move it up to 3\", then D3+1 dmg (on a 3, also -1 APL until end of its next activation); then this can make a free Charge up to 3\"."],
           "DÔZR"),
        hk("field_medic", "Field Medic", [("Bolt revolver", 4, "4+", "3/5", 'Range 8"')], [("Plasma knife", 4, "4+", "3/5", "Lethal 5+")],
           ["Medic!: First time each TP another Salvager visible within 3\" would be incapacitated (neither in enemy control range): it stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
            "Medikit (1AP): A Salvager in control range regains up to 2D3 wounds (not one saved by Medic! this TP). Not within enemy control range."],
           "MEDIC, FIELD MEDIC"),
        hk("grenadier", "Grenadier", [BOLT_PISTOL, ("C8 HX charge", 4, "3+", "4/6", 'Range 4", Blast 1", Heavy (Reposition only), Limited 1, Piercing 1, Saturate')], [FISTS],
           ["Grenadier: Can use frag, krak, smoke and stun grenades without using up equipment limits; frag/krak Hit +1.",
            "Vâyr-3 Utility Grenade (1AP): Place a Utility Grenade marker visible within 6\" (or on visible Vantage): operatives within 3\" pay +1AP for Pick Up Marker and mission actions. Removed after D3 activations next TP or at end of TP. Not within enemy control range."],
           "GRENADIER"),
        gunner("gunner_beamer", "EtaCarn plasma beamer", [("EtaCarn plasma beamer", 4, "4+", "5/6", "Piercing 1, Beam")],
               ["Beam (weapon rule): Each retained crit deals D3 to every other operative along one beam line through the target's base (not crossing Heavy terrain); the target itself isn't affected."]),
        gunner("gunner_auto", "HYLas auto rifle", [("HYLas auto rifle", 4, "4+", "4/5", "Ceaseless, Rending")]),
        gunner("gunner_rotary", "HYLas rotary cannon", [("HYLas rotary cannon (focused)", 5, "4+", "4/5", "Ceaseless, Heavy (Reposition only), Saturate"), ("HYLas rotary cannon (sweeping)", 4, "4+", "4/5", 'Ceaseless, Heavy (Reposition only), Saturate, Torrent 1"')]),
        gunner("gunner_missile", "L7 missile launcher", [("L7 missile launcher (blast)", 4, "4+", "3/5", 'Blast 2"'), ("L7 missile launcher (focused)", 4, "4+", "5/6", "Piercing 1")]),
        gunner("gunner_rail", "magna rail rifle", [("Magna rail rifle", 4, "4+", "4/2", "Devastating 3, Heavy (Dash only), Piercing 2")]),
        hk("jump_pack", "Jump Pack Warrior", [BOLT_PISTOL], [("Plasma weapon", 4, "3+", "4/6", "Lethal 5+, Force Impact")],
           ["Jump Pack: When an action moves it, it can FLY: set up wholly within its Move (Dash 3\") horizontally, not in enemy control range unless Charging (no extra Charge distance; not through walls or hatchways in close quarters).",
            "Force Impact (weapon rule): Fighting after Charging this activation: Brutal."],
           "JUMP PACK WARRIOR", move='8"'),
        hk("kinlynk", "Kinlynk", [BOLTER, ION], [FISTS],
           [CHOICE, "Signal (1AP): SUPPORT. Another Salvager in the killzone: +1 APL until end of its next activation. Not within enemy control range.",
            "System Jam (1AP): An enemy valid target without a System Jam token gains one: it can't activate until every enemy without one is expended (removed when it activates). Not within enemy control range."],
           "KINLYNK"),
        hk("kognitaar", "Kognitâar", [BOLTER, ION], [FISTS],
           [CHOICE, "Tactician: STRATEGIC GAMBIT (in killzone): place your Attack marker (Salvagers attacking enemies within 3\" gain Balanced) or Defence marker (Salvagers within 3\" re-roll one defence die when shot). Removed next Ready step.",
            "Accelerated Appraisal (1AP): (Re)place your Attack or Defence marker. Not within enemy control range."],
           "KOGNITÂAR"),
        hk("lokatr", "Lokâtr", [BOLTER, ION], [FISTS],
           [CHOICE, "Spot (1AP): SUPPORT. A visible enemy: until end of TP, Salvagers within 3\" of this shooting it gain Seek Light and it can't be obscured. Not within enemy control range.",
            "Pan Spectral Scan (1AP): Place your scan marker: Salvagers shooting enemies within 3\" of it gain Accurate 1 and Saturate. Removed at this one's next activation. Not within enemy control range."],
           "LOKÂTR"),
        hk("lugger", "Lugger", [BOLTER, ION], [FISTS],
           [CHOICE, "Well Supplied: One extra equipment option, and +1CP in the first Ready step.",
            "I've Got It: Once per activation, a mission action costs 1 less AP."],
           "LUGGER"),
        hk("warrior_bolter", "Warrior (bolter)", [BOLTER], [FISTS],
           ["Secure Salvage: While contesting an objective or your mission marker, when attacked: -1 dmg from one success."], "WARRIOR"),
        hk("warrior_ion", "Warrior (ion blaster)", [ION], [FISTS],
           ["Secure Salvage: While contesting an objective or your mission marker, when attacked: -1 dmg from one success."], "WARRIOR"),
    ],
}
