CLAWS_TAIL = ("Claws & tail", 3, "4+", "3/4", "-")
CRAWLER_ABILITIES = [
    "Weapon Sentinel: On Conceal, can't use Light terrain for cover when targeted (keeps cover save).",
    "Steadfast: For marker control, can treat its APL as 3 (ignoring changes).",
]
WARRIOR_ABILITIES = [
    "Aggressive Defence: Incapacitated by an enemy within 2\": roll D3, on 2+ that enemy takes 1 damage.",
    "Expendable Construct: Ignored for kill/elimination ops and escape/survive scoring.",
    "A Ceaseless Scuttling: STRATEGIC GAMBIT each turning point after the first: with fewer than three Warriors alive, set up another one ready, Concealed, wholly in your drop zone.",
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
            "Tomb Crawlers carry twin gauss reapers or a transdimensional isolator (max 1 isolator in the team).",
            "Warriors carry a gauss scalpel or a tesla caster.",
        ],
    },
    "factionRules": [
        ("Obelisk Node Matrix", "turning point 1 STRATEGIC GAMBIT: place three Obelisk Node markers wholly in your territory; later turning points: move each up to 3\". Nodes control uncontested markers within 1\" (none if both players' nodes would). Nodes within 6\" horizontally of each other form a matrix with the area between them. Friendlies in your matrix: datacard weapons gain Accurate 1 and +1 APL (max 3)."),
    ],
    "ploys": {
        "strategy": [
            ("Cryptogravitic Repulsion", "Once per action, the first time an enemy would move into your matrix, it costs an extra 1\"."),
            ("Souldrain", "Enemies in your matrix, or fighting a Canoptek in it: melee weapons -1 to both Normal and Critical Dmg (min 2) until end of activation."),
            ("Hypershielding", "Shot while your matrix intervenes or it's in your matrix: re-roll defence dice of one result."),
            ("Transdynamic Amplification", "Shooting with your matrix intervening, or at a target in it: weapons gain Ceaseless."),
        ],
        "firefight": [
            ("Nodal Response", "During an activation: swap a strategy ploy you used this turning point for another (pay any extra CP), or use one now."),
            ("Sacrificial Thrall", "The Geomancer is targeted by a Shoot or Fight: a Canoptek visible within 3\" becomes the target instead (cover/obscured only if the original was). Not against Blast/Torrent."),
            ("Shield Flare", "Normal Dmg on an operative in your matrix (or with the matrix intervening): ignore it."),
            ("Animate Obelisk Nodes", "Instead of activating or counteracting: move your nodes up to 6\" combined (rounded up per node), then the opponent activates."),
        ],
    },
    "equipment": [
        {"id": "nanoscarab_caskets", "name": "Nanoscarab Caskets", "desc": "When activated, an operative regains up to D3 wounds."},
        {"id": "phase_shifter", "name": "Phase Shifter", "desc": "Once per turning point, the Geomancer being shot: attacker's Piercing worsened by 1."},
        {"id": "matrix_manipulator", "name": "Matrix Manipulator", "desc": "Once per battle during an activation: the Geomancer counts as a fourth Obelisk Node."},
        {"id": "awakened_nodes", "name": "Awakened Obelisk Nodes", "desc": "Roll D3 when revealed: Animate Obelisk Nodes costs 0CP that many times."},
    ],
    "operatives": [
        {"id": "geomancer", "name": "Geomancer", "apl": 3, "move": '6"', "save": "3+", "wounds": 14, "pts": 50,
         "ranged": [("Tremorglaive (part matter)", 4, "3+", "4/5", "Piercing 1, Piercing Crits 2"), ("Tremorglaive (quake)", 5, "3+", "1/2", 'Blast 2", Seek Light, Stun')],
         "melee": [("Tremorglaive (sweep)", 4, "4+", "4/5", "Severe, Shock, Stun")],
         "abilities": ["Obelisk Node Control: Mission actions needing it to control an objective (not Pick Up/Retrieve) can use one of your Obelisk Nodes instead; Operate Hatch can work a hatch within 1\" of a node.",
                       "Geomantic Disturbance (1AP): A point on terrain visible within 8\": roll 2D6 for each operative within 2\"; if higher than its remaining wounds, it takes the difference. Not on Conceal or within enemy control range.",
                       "Canoptek Control (1AP): SUPPORT. A Canoptek visible within 6\" (or visible and in your matrix) makes a free 1AP action (max 2\" move). Not within enemy control range or while counteracting.",
                       "Molecular Breach (1AP): SUPPORT. A friendly visible within 6\" (or in your matrix): its next move is a set-up wholly within its Move (Dash 3\"), even through walls in close quarters; not in enemy control range unless Charging. Not within enemy control range."],
         "kw": "LEADER, CRYPTEK, GEOMANCER"},
        crawler("crawler_reapers", "twin gauss reapers", [("Twin gauss reapers (focused)", 5, "4+", "4/5", "Piercing 1, Severe"), ("Twin gauss reapers (sweeping)", 4, "4+", "4/5", 'Piercing 1, Severe, Torrent 1"')]),
        crawler("crawler_isolator", "transdimensional isolator", [("Transdimensional isolator", 5, "4+", "5/6", "Dimensional Banishment")]),
        macro("accelerator", "Accelerator", [("Spark", 4, "4+", "2/3", 'Range 4", Piercing 1')], [("Claws & spark", 3, "4+", "3/4", "Lethal 5+, Stun")],
              ["Overcharge (1AP): Another Canoptek visible within 3\" (or any in your matrix, if this is): +1 APL until end of its next activation. Not within enemy control range.",
               "Cranial Overload (1AP): An enemy visible within 3\" (or any in your matrix, if this is): -1 APL until end of its next activation. Not within enemy control range."],
              "ACCELERATOR"),
        macro("reanimator", "Reanimator", [("Atomiser beam", 4, "4+", "3/4", 'Range 6", Lethal 5+')], [("Claws & tail", 4, "4+", "3/4", "-")],
              ["Reanimate: Once per turning point, another friendly visible within 6\" (or both in your matrix) would be incapacitated (neither in enemy control range): it stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range or your matrix. Both -1 APL until their next activations; ends its activation if during it.",
               "Nanoscarab Beam (1AP): A friendly visible within 6\" (or in your matrix) regains up to 3D3 wounds (not one saved by Reanimate this turning point). Once per turning point; not within enemy control range."],
              "MEDIC, REANIMATOR"),
        macro("warrior_scalpel", "Warrior (gauss scalpel)", [("Gauss scalpel", 4, "4+", "2/3", "Piercing 1")], [CLAWS_TAIL], WARRIOR_ABILITIES, "WARRIOR"),
        macro("warrior_tesla", "Warrior (tesla caster)", [("Tesla caster (focused)", 4, "4+", "2/3", "-"), ("Tesla caster (living lightning)", 4, "4+", "2/3", 'Blast 2"')], [CLAWS_TAIL], WARRIOR_ABILITIES, "WARRIOR"),
    ],
}
TEAM["operatives"][1]["abilities"] = TEAM["operatives"][1]["abilities"]
TEAM["operatives"][2]["abilities"] = ["Dimensional Banishment (weapon rule): After using it, if you dealt damage or retained a crit and the target survived: roll 2D6; if higher than its remaining wounds, it's incapacitated (overrides Medic!-style rules; no Reanimation marker). Not against NEMESIS or Red Terror."] + CRAWLER_ABILITIES
