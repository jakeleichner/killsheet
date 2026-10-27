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
            "Select 8 other operatives. You can take several Combat Servitors, but every other operative only once.",
            "Combat Servitors: at most 1 with a meltagun and at most 3 with an incendine igniter.",
        ],
    },
    "factionRules": [
        ("Noospheric Network", "Once in each Servitor's activation, you can spend 1AP to Transfer Power. After that activation, before your opponent activates, another Servitor can Network Counteract: set its order, then take a free 1AP action (moving no more than 2\"). It can't if its APL is below 2. It can still activate later, but can't counteract again that turning point."),
    ],
    "ploys": {
        "strategy": [
            ("Duty of Reclamation", "Once per action, Command Re-roll costs 0CP for a Battleclade operative contesting an objective or one of your mission markers."),
            ("Incantation of the Iron Soul", "Whenever an attack die inflicts 3 or more damage on a Battleclade operative, roll one D6: on a 4+, subtract 1 from that damage."),
            ("Noospheric Possession", "SUPPORT. Servitors within 6\" of the Auto-proxy or Underseer get Accurate 1 on their weapons."),
            ("Prioritized Acquisition", "Pick an objective or one of your mission markers. When working out who controls it, your contesting operatives' total APL counts as 1 higher. Battleclade operatives within 3\" of it get +1 Atk on melee weapons (to a maximum of 4)."),
        ],
        "firefight": [
            ("Remote Access", "Once during a Tech-Priest's activation, it can do a mission action on a marker within 4\" (that no enemy contests) instead of in its control range, or Operate Hatch within 4\"."),
            ("Auto-ferric Supplication", "When a Tech-Priest is shot, ignore Piercing for that sequence."),
            ("Servile Surrogacy", "When a Tech-Priest is picked as the target of a Shoot or Fight, a Servitor visible within 3\" of it becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."),
            ("System Exorcism", "When you activate a Battleclade operative, remove one effect or stat change your opponent put on it. This doesn't cover wounds, injury, mission rules or the -1 APL from your own Transfer Power."),
        ],
    },
    "equipment": [
        {"id": "capacitors", "name": "Electromantic Capacitors", "desc": "Melee weapons gain Shock, and also Severe when retaliating."},
        {"id": "concealed_apparatus", "name": "Concealed Apparatus", "desc": "Once per battle, one Combat or Gun Servitor can use another weapon option from its datacard."},
        {"id": "covert_guises", "name": "Covert Guises", "desc": "Roll a D3. In the first turning point's Strategy phase, that many operatives wholly in your drop zone get a free Reposition, ending wholly within 3\" of it. The Technoarcheologist can make only one Reposition in that phase."},
        {"id": "reserve_cells", "name": "Neurocyclic Reserve Cells", "desc": "Once per turning point, Transfer Power costs 0AP."},
    ],
    "operatives": [
        {"id": "technoarcheologist", "name": "Technoarcheologist", "apl": 3, "move": '6"', "save": "3+", "wounds": 9, "pts": 32,
         "ranged": [("Eradication pistol", 4, "3+", "4/2", 'Range 8", 1" Devastating 3, Lethal 5+')],
         "melee": [("Servo-arc claw", 4, "3+", "3/4", "Severe, Shock")],
         "abilities": ["Seeker of Divine Arcana: STRATEGIC GAMBIT. Change its order, take a free Omniscanner, Fall Back, Place Marker, Pick Up Marker, Reposition or mission action, or both. If it Falls Back or Repositions without carrying a marker, it must end in your drop zone or with an objective or mission marker in its control range.",
                       "Omniscanner (1AP): An enemy visible to it or within 8\" gains an Omniscanner token. Battleclade weapons attacking that enemy gain Ceaseless. It can't do this within enemy control range."],
         "kw": "TECH-PRIEST, LEADER, TECHNOARCHEOLOGIST"},
        {"id": "underseer", "name": "Servitor Underseer", "apl": 3, "move": '6"', "save": "3+", "wounds": 9, "pts": 32,
         "ranged": [("Master-crafted radium pistol", 4, "3+", "2/4", 'Range 8", Balanced, Rending')],
         "melee": [("Dataspikes", 3, "5+", "2/3", "-")],
         "abilities": ["Datacoronal Accumulator (1AP): SUPPORT. Roll a D3. If the result is no more than the number of objectives contested by Battleclade operatives within 6\" of it or the Auto-proxy, gain 1CP. It can't do this within enemy control range.",
                       "Network Override (1AP): SUPPORT. A Servitor within 6\" of it or the Auto-proxy can Network Counteract straight away (no Transfer Power needed) or Dash. It can do this twice per activation, on different operatives, but not within enemy control range."],
         "kw": "TECH-PRIEST, SERVITOR UNDERSEER"},
        {"id": "auto_proxy", "name": "Auto-proxy Servitor", "apl": 2, "move": '5"', "save": "4+", "wounds": 8, "pts": 25,
         "ranged": [], "melee": [("Taser goad", 4, "4+", "3/4", "Lethal 5+, Shock")],
         "abilities": ["Achillan Eye: When a Battleclade operative shoots an enemy visible to it, the ranged weapon gains Saturate. This stops while it's in enemy control range.",
                       "Gaze of the Omnissiah (1AP): Pick a visible enemy. Until the end of the turning point, Battleclade weapons shooting it gain Seek Light, and it can't be obscured. It can't do this within enemy control range."],
         "kw": "AUTO-PROXY, SERVITOR"},
        {"id": "breacher_servitor", "name": "Breacher Servitor", "apl": 2, "move": '5"', "save": "4+", "wounds": 8, "pts": 25,
         "ranged": [("Lascutter (close)", 4, "3+", "4/5", 'Range 2", Lethal 5+, Piercing 2'), ("Lascutter (short)", 4, "3+", "4/5", 'Range 6", Lethal 5+')],
         "melee": [("Hydraulic pincer & lascutter", 4, "4+", "4/6", "Lethal 5+")],
         "abilities": ["Breach (1AP): Place a Breach marker as close as possible to a terrain feature within its control range. Operatives within 1\" of the marker treat parts of that terrain feature up to 1\" thick as Accessible. It can't do this within enemy control range."],
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
         "abilities": ["Mechanosuture Array: Once per turning point, when another Battleclade operative visible within 3\" would be incapacitated (and neither is in enemy control range), it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
                       "Expedient Repair (1AP): A Battleclade operative in its control range regains up to D3+3 wounds. Not one saved by Mechanosuture Array this turning point. It can't do this within enemy control range."],
         "kw": "MEDIC, TECHNOMEDIC, SERVITOR"},
    ],
}
