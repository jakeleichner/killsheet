SERVO_CLAW = ("Servo-claw", 3, "4+", "3/4", "-")
AUG_CLAW = ("Augmetic claw", 3, "4+", "4/5", "Brutal")

def combat(oid, name, gun):
    return {"id": oid, "name": "Combat Servitor (" + name + ")", "apl": 2, "move": '5"', "save": "4+", "wounds": 8, "pts": 25,
            "ranged": [gun], "melee": [SERVO_CLAW], "abilities": [], "kw": "COMBAT, SERVITOR"}

TEAM = {
    "id": "battleclade", "source": "battleclade", "name": "Battleclade", "badge": "ADEPTUS MECHANICUS", "color": "#2F9E8F",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Technoarcheologist", "min": 1, "max": 1, "ids": ["technoarcheologist"]},
            {"name": "Servitor Underseer", "desc": "1 Servitor Underseer", "min": 1, "max": 1, "ids": ["underseer"]},
            {"name": "Servitors", "desc": "8 Battleclade operatives from the list below", "min": 8, "max": 8,
             "ids": ["auto_proxy", "breacher_servitor", "cs_igniter", "cs_melta", "cs_phosphor", "gs_arc", "gs_heavy_bolter", "technomedic"]},
        ],
        "repeatable": ["cs_igniter", "cs_phosphor"],
        "maxCount": {"cs_igniter": 3},
        "rules": [
            "Select 1 Technoarcheologist and 1 Servitor Underseer.",
            "Select 8 other operatives. Other than Combat Servitors, each only once.",
            "Combat Servitors: max 1 with meltagun, max 3 with incendine igniter.",
        ],
    },
    "factionRules": [
        ("Noospheric Network", "Once per Servitor activation, spend 1AP to TRANSFER POWER. After that activation, another Servitor can NETWORK COUNTERACT before the opponent activates: set its order, then a free 1AP action (max 2\" move). Not if APL < 2. A Network-counteracted operative can still activate later, but can't counteract again that turning point."),
    ],
    "ploys": {
        "strategy": [
            ("Duty of Reclamation", "Once per action: Command Re-roll costs 0CP for a Battleclade operative contesting an objective or your mission marker."),
            ("Incantation of the Iron Soul", "Whenever an attack die inflicts 3 or more damage on a Battleclade operative, roll one D6: on a 4+, subtract 1 from that damage."),
            ("Noospheric Possession", "SUPPORT. Servitors within 6\" of the Auto-proxy or Underseer: weapons gain Accurate 1."),
            ("Prioritised Acquisition", "Pick an objective/mission marker: your contesting total APL counts +1; Battleclade within 3\" get +1 melee Atk (max 4)."),
        ],
        "firefight": [
            ("Remote Access", "During a Tech-Priest's activation, once: do a marker mission action with the marker within 4\" (uncontested) instead of in control range, or Operate Hatch within 4\"."),
            ("Auto-ferric Supplication", "A Tech-Priest is being shot: ignore Piercing for that sequence."),
            ("Servile Surrogacy", "Tech-Priest targeted by Shoot/Fight: a Servitor visible within 3\" becomes the target instead (cover/obscured only if the original was). Not against Blast or Torrent."),
            ("System Exorcism", "When activating a Battleclade operative: remove one opponent effect or stat change from it (not wounds, injury, mission rules or your own Transfer Power -1APL)."),
        ],
    },
    "equipment": [
        {"id": "capacitors", "name": "Electromantic Capacitors", "desc": "Melee weapons gain Shock; when retaliating also Severe."},
        {"id": "concealed_apparatus", "name": "Concealed Apparatus", "desc": "Once per battle, one Combat or Gun Servitor can use another weapon option from its datacard."},
        {"id": "covert_guises", "name": "Covert Guises", "desc": "Roll D3: in turning point 1 Strategy phase, that many operatives wholly in your drop zone get a free Reposition (end wholly within 3\" of it). Technoarcheologist max one such Reposition."},
        {"id": "reserve_cells", "name": "Neurocyclic Reserve Cells", "desc": "Once per turning point: TRANSFER POWER for 0AP."},
    ],
    "operatives": [
        {"id": "technoarcheologist", "name": "Technoarcheologist", "apl": 3, "move": '6"', "save": "3+", "wounds": 9, "pts": 32,
         "ranged": [("Eradication pistol", 4, "3+", "4/2", 'Range 8", 1" Devastating 3, Lethal 5+')],
         "melee": [("Servo-arc claw", 4, "3+", "3/4", "Severe, Shock")],
         "abilities": ["Seeker of Divine Arcana: STRATEGIC GAMBIT. Change its order and/or a free Omniscanner, Fall Back, Place/Pick Up Marker, Reposition or mission action. Fall Back/Reposition without a marker must end in your drop zone or with an objective/mission marker in control range.",
                       "Omniscanner (1AP): Enemy visible or within 8\" gains an Omniscanner token; Battleclade attacking it gain Ceaseless. Not within enemy control range."],
         "kw": "TECH-PRIEST, LEADER, TECHNOARCHEOLOGIST"},
        {"id": "underseer", "name": "Servitor Underseer", "apl": 3, "move": '6"', "save": "3+", "wounds": 9, "pts": 32,
         "ranged": [("Master-crafted radium pistol", 4, "3+", "2/4", 'Range 8", Balanced, Rending')],
         "melee": [("Dataspikes", 3, "5+", "2/3", "-")],
         "abilities": ["Datacoronal Accumulator (1AP): SUPPORT. Roll D3: if ≤ the objectives contested by Battleclade within 6\" of this or the Auto-proxy, gain 1CP. Not within enemy control range.",
                       "Network Override (1AP): SUPPORT. A Servitor within 6\" of this or the Auto-proxy immediately Network Counteracts (no Transfer Power needed) or Dashes. Twice per activation (different operatives). Not within enemy control range."],
         "kw": "TECH-PRIEST, SERVITOR UNDERSEER"},
        {"id": "auto_proxy", "name": "Auto-proxy Servitor", "apl": 2, "move": '5"', "save": "4+", "wounds": 8, "pts": 25,
         "ranged": [], "melee": [("Taser goad", 4, "4+", "3/4", "Lethal 5+, Shock")],
         "abilities": ["Achillan Eye: Battleclade shooting an enemy visible to this operative: ranged weapons gain Saturate (not while this is in enemy control range).",
                       "Gaze of the Omnissiah (1AP): Visible enemy: until end of turning point, Battleclade shooting it gain Seek Light and it can't be obscured. Not within enemy control range."],
         "kw": "AUTO-PROXY, SERVITOR"},
        {"id": "breacher_servitor", "name": "Breacher Servitor", "apl": 2, "move": '5"', "save": "4+", "wounds": 8, "pts": 25,
         "ranged": [("Lascutter (close)", 4, "3+", "4/5", 'Range 2", Lethal 5+, Piercing 2'), ("Lascutter (short)", 4, "3+", "4/5", 'Range 6", Lethal 5+')],
         "melee": [("Hydraulic pincer & lascutter", 4, "4+", "4/6", "Lethal 5+")],
         "abilities": ["Breach (1AP): Place a Breach marker by a terrain feature in control range; within 1\" of it, parts up to 1\" thick are Accessible. Not within enemy control range."],
         "kw": "BREACHER, SERVITOR"},
        combat("cs_igniter", "incendine igniter", ("Incendine igniter", 4, "2+", "4/4", 'Range 6", Saturate, Torrent 1"')),
        combat("cs_melta", "meltagun", ("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')),
        combat("cs_phosphor", "phosphor blaster", ("Phosphor blaster", 4, "4+", "3/4", 'Blast 1", Severe')),
        {"id": "gs_arc", "name": "Gun Servitor (heavy arc rifle)", "apl": 2, "move": '5"', "save": "4+", "wounds": 11, "pts": 32,
         "ranged": [("Heavy arc rifle", 5, "4+", "4/6", "Heavy (Dash only), Piercing 1, Stun")], "melee": [AUG_CLAW], "abilities": [], "kw": "GUN, SERVITOR"},
        {"id": "gs_heavy_bolter", "name": "Gun Servitor (heavy bolter)", "apl": 2, "move": '5"', "save": "4+", "wounds": 11, "pts": 32,
         "ranged": [("Heavy bolter (focused)", 5, "4+", "4/5", "Heavy (Dash only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Piercing Crits 1, Torrent 1"')],
         "melee": [AUG_CLAW], "abilities": [], "kw": "GUN, SERVITOR"},
        {"id": "technomedic", "name": "Technomedic Servitor", "apl": 2, "move": '5"', "save": "4+", "wounds": 8, "pts": 25,
         "ranged": [], "melee": [("Servo-chirurgic claw", 4, "4+", "3/4", "Rending")],
         "abilities": ["Mechanosuture Array: Once per turning point, another Battleclade visible within 3\" would be incapacitated (neither in enemy control range): stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range; ends its activation if during it.",
                       "Expedient Repair (1AP): Battleclade in control range regains up to D3+3 wounds (not one saved by Mechanosuture this turning point). Not within enemy control range."],
         "kw": "MEDIC, TECHNOMEDIC, SERVITOR"},
    ],
}
