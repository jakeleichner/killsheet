CLAWS_TAIL = ("Claws & tail", 3, "4+", "3/4", "-")
CRAWLER_ABILITIES = [
    "Weapon Sentinel: While it has a Conceal order, it can't use Light terrain for cover when it's targeted. It still keeps its cover save.",
    "Steadfast: For marker control, you can treat its APL as 3, ignoring any changes.",
]
WARRIOR_ABILITIES = [
    "Aggressive Defence: When an enemy within 2\" incapacitates it, roll a D3. On a 2+, that enemy takes 1 damage.",
    "Expendable Construct: It doesn't count for kill or elimination ops, or for escape and survive scoring.",
    "A Ceaseless Scuttling: STRATEGIC GAMBIT in each turning point after the first. If fewer than three Warriors are alive, set up another one, ready and with a Conceal order, wholly in your drop zone.",
]

def crawler(oid, name, ranged):
    return {"id": oid, "name": "Tomb Crawler (" + name + ")", "apl": 2, "move": '5"', "save": "3+", "wounds": 18, "pts": 50,
            "ranged": ranged, "melee": [("Claws", 4, "4+", "4/4", "-")], "abilities": CRAWLER_ABILITIES, "kw": "CANOPTEK, TOMB CRAWLER"}

def macro(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": "Macrocyte " + name, "apl": 2, "move": '7"', "save": "4+", "wounds": 7, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": "CANOPTEK, MACROCYTE, " + kw}

TEAM = {
    "id": "canoptek", "source": "canoptek_circle", "name": "Canoptek Circle", "badge": "NECRONS", "color": "#2FA36B",
    "archetypes": "Recon, Security",
    "composition": {
        "total": 8,
        "groups": [
            {"name": "Leader", "desc": "1 Geomancer", "min": 1, "max": 1, "ids": ["geomancer"]},
            {"name": "Tomb Crawlers", "desc": "2 Tomb Crawlers", "min": 2, "max": 2, "ids": ["crawler_reapers", "crawler_isolator"]},
            {"name": "Macrocytes", "desc": "1 Accelerator and 1 Reanimator", "min": 2, "max": 2, "ids": ["accelerator", "reanimator"]},
            {"name": "Warriors", "desc": "3 Warriors", "min": 3, "max": 3, "ids": ["warrior_scalpel", "warrior_tesla"]},
        ],
        "repeatable": ["crawler_reapers", "warrior_scalpel", "warrior_tesla"],
        "rules": [
            "The team is fixed: 1 Geomancer, 2 Tomb Crawlers, 1 Accelerator, 1 Reanimator and 3 Warriors.",
            "Tomb Crawlers carry twin gauss reapers or a transdimensional isolator (only 1 isolator in the team).",
            "Warriors carry a gauss scalpel or a tesla caster.",
        ],
    },
    "factionRules": [
        ("Obelisk Node Matrix", "STRATEGIC GAMBIT in the first turning point: place three Obelisk Node markers wholly in your territory. In later turning points, move each one up to 3\". Nodes control uncontested markers within 1\" (none if both players' nodes would). Nodes within 6\" of each other horizontally form a matrix: the nodes and the 20mm-wide lines between them (not the whole triangle), at any height, and not through walls. Friendly operatives in your matrix get Accurate 1 on datacard weapons and +1 APL (to a maximum of 3)."),
    ],
    "ploys": {
        "strategy": [
            ("Cryptogravitic Repulsion", "Once per action, the first time an enemy would move into your matrix, it costs that enemy an extra 1\"."),
            ("Souldrain", "Enemies in your matrix, or fighting a Canoptek in it, get -1 Normal and Critical Dmg on melee weapons (to a minimum of 2) until the end of the activation."),
            ("Hypershielding", "When one is shot while your matrix intervenes or it's in your matrix, re-roll any defence dice showing one result of your choice."),
            ("Transdynamic Amplification", "When shooting with your matrix intervening, or at a target in it, weapons gain Ceaseless."),
        ],
        "firefight": [
            ("Nodal Response", "Use during an activation. Swap a strategy ploy you used this turning point for another (paying any extra CP), or use one now."),
            ("Sacrificial Thrall", "When the Geomancer is picked as the target of a Shoot or Fight, a Canoptek visible within 3\" of it becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."),
            ("Shield Flare", "When an attack die inflicts Normal Dmg on an operative in your matrix, or with your matrix intervening, ignore that damage."),
            ("Animate Obelisk Nodes", "Use instead of activating or counteracting. Move your nodes up to 6\" in total (rounding up per node), then your opponent activates."),
        ],
    },
    "equipment": [
        {"id": "nanoscarab_caskets", "name": "Nanoscarab Caskets", "desc": "When an operative is activated, it regains up to D3 wounds."},
        {"id": "phase_shifter", "name": "Phase Shifter", "desc": "Once per turning point, when the Geomancer is shot, the attacker's Piercing gets worse by 1."},
        {"id": "matrix_manipulator", "name": "Matrix Manipulator", "desc": "Once per battle during an activation, the Geomancer counts as a fourth Obelisk Node."},
        {"id": "awakened_nodes", "name": "Awakened Obelisk Nodes", "desc": "When you reveal this, roll a D3. Animate Obelisk Nodes costs 0CP that many times."},
    ],
    "operatives": [
        {"id": "geomancer", "name": "Geomancer", "apl": 3, "move": '6"', "save": "3+", "wounds": 14, "pts": 50,
         "ranged": [("Tremorglaive (part matter)", 4, "3+", "4/5", "Piercing 1, Piercing Crits 2"), ("Tremorglaive (quake)", 5, "3+", "1/2", 'Blast 2", Seek Light, Stun')],
         "melee": [("Tremorglaive (sweep)", 4, "4+", "4/5", "Severe, Shock, Stun")],
         "abilities": ["Obelisk Node Control: Mission actions that need it to control an objective (but not Pick Up or Retrieve) can use one of your Obelisk Nodes instead. Operate Hatch can open a hatch within 1\" of a node.",
                       "Geomantic Disturbance (1AP): Pick a point on terrain visible within 8\". Roll 2D6 for each operative within 2\" of it. If the roll beats that operative's remaining wounds, it takes the difference as damage. It can't do this with a Conceal order or within enemy control range.",
                       "Canoptek Control (1AP): SUPPORT. A Canoptek visible within 6\" (or visible and in your matrix) makes a free 1AP action, moving no more than 2\". It can't do this within enemy control range or while counteracting.",
                       "Molecular Breach (1AP): SUPPORT. Pick a friendly operative visible within 6\" (or visible and in your matrix). Its next move is a set-up wholly within its Move (3\" for a Dash), even through walls in close quarters, and not in enemy control range unless it's Charging. It can't do this within enemy control range."],
         "kw": "LEADER, CRYPTEK, GEOMANCER"},
        crawler("crawler_reapers", "twin gauss reapers", [("Twin gauss reapers (focused)", 5, "4+", "4/5", "Piercing 1, Severe"), ("Twin gauss reapers (sweeping)", 4, "4+", "4/5", 'Piercing 1, Severe, Torrent 1"')]),
        crawler("crawler_isolator", "transdimensional isolator", [("Transdimensional isolator", 5, "4+", "5/6", "Dimensional Banishment")]),
        macro("accelerator", "Accelerator", [("Spark", 4, "4+", "2/3", 'Range 4", Piercing 1')], [("Claws & spark", 3, "4+", "3/4", "Lethal 5+, Stun")],
              ["Overcharge (1AP): Another Canoptek visible within 3\" (or any in your matrix, if this one is too) gets +1 APL until the end of its next activation. It can't do this within enemy control range.",
               "Cranial Overload (1AP): An enemy visible within 3\" (or any in your matrix, if this one is in it) gets -1 APL until the end of its next activation. It can't do this within enemy control range."],
              "ACCELERATOR"),
        macro("reanimator", "Reanimator", [("Atomiser beam", 4, "4+", "3/4", 'Range 6", Lethal 5+')], [("Claws & tail", 4, "4+", "3/4", "-")],
              ["Reanimate: Once per turning point, when another friendly operative visible within 6\" (or with both in your matrix) would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range or your matrix. Both get -1 APL until their next activations. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
               "Nanoscarab Beam (1AP): A friendly operative visible within 6\" (or in your matrix) regains up to 3D3 wounds. Not one saved by Reanimate this turning point. Once per turning point, and not within enemy control range."],
              "MEDIC, REANIMATOR"),
        macro("warrior_scalpel", "Warrior (gauss scalpel)", [("Gauss scalpel", 4, "4+", "2/3", "Piercing 1")], [CLAWS_TAIL], WARRIOR_ABILITIES, "WARRIOR"),
        macro("warrior_tesla", "Warrior (tesla caster)", [("Tesla caster (focused)", 4, "4+", "2/3", "-"), ("Tesla caster (living lightning)", 4, "4+", "2/3", 'Blast 2"')], [CLAWS_TAIL], WARRIOR_ABILITIES, "WARRIOR"),
    ],
}
TEAM["operatives"][1]["abilities"] = TEAM["operatives"][1]["abilities"]
TEAM["operatives"][2]["abilities"] = ["Dimensional Banishment (weapon rule): After using it, if you inflicted damage or retained a critical success and the target survived, roll 2D6. If the roll beats its remaining wounds, it's incapacitated. This overrides rules like Medic!, and it leaves no Reanimation marker. Not against NEMESIS or Red Terror."] + CRAWLER_ABILITIES
