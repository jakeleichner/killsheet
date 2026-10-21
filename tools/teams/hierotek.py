MAGNIFY = "Magnify (weapon rule): When shooting a target visible to it, if another Apprentek or Cryptek with an Engage order (outside enemy control range) is visible to it, that one can count as the active operative for picking a valid target, conditions, cover and obscured. The weapon gains Ceaseless."
INTERSTITIAL = "Interstitial Command (1AP): SUPPORT. Another operative (not an Apprentek or Cryptek) visible within 6\" (or within 6\" of a visible Despotek) makes a free 1AP action. It can't move more than 2\", can't repeat an action it already did this turning point, and can't do this action again this turning point. It can't do this within enemy control range or while counteracting."
SCUTTLER = "Scuttler: While it has a Conceal order and is in cover, enemies more than 2\" away can't target it. Fall Back costs it 1 less AP. It can only use its own weapons and has no unique actions except {}."
STEADFAST = "Steadfast: For marker control, you can treat its APL as 3, ignoring any changes."
CLAWS = ("Claws", 3, "5+", "1/2", "-")
BAYONET = ("Bayonet", 4, "3+", "3/4", "-")
GAUSS = ("Gauss blaster", 4, "3+", "4/5", "Piercing 1")
TESLA = ("Tesla carbine", 5, "3+", "3/3", '2" Devastating 1')

def cryptek(oid, name, ranged, melee, actions, pts=40):
    return {"id": oid, "name": name, "apl": 3, "move": '6"', "save": "3+", "wounds": 14, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": [MAGNIFY] + actions, "kw": "LEADER, CRYPTEK, " + name.split(" (")[0].upper()}

CHRONO_ACTIONS = [
    INTERSTITIAL,
    "Timesplinter (1AP): Pick another expended friendly operative visible within 5\". Remove it and set it up visible within 5\" horizontally. Not in the first turning point, once per turning point for the whole team, and not within enemy control range.",
    "Countertemporal Nanomine (1AP): Place the marker visible within 8\" (or on visible Vantage terrain within 8\"). Enemies within 4\" of it get -2\" Move. Remove it at this operative's next activation. It can't do this within enemy control range.",
    "Chronometron (1AP): SUPPORT. Pick a friendly operative visible within 6\". Until this operative's next activation, enemies attacking it get -1 Atk. It can't do this within enemy control range.",
]

def immortal(oid, name, gun, wounds, abilities, kw):
    return {"id": oid, "name": name, "apl": 2, "move": '5"', "save": "3+", "wounds": wounds, "pts": 32,
            "ranged": [gun], "melee": [BAYONET], "abilities": abilities, "kw": "IMMORTAL, " + kw}

TEAM = {
    "id": "hierotek", "source": "hierotek_circle", "name": "Hierotek Circle", "badge": "NECRONS", "color": "#4FC27A",
    "archetypes": "Recon, Security",
    "composition": {
        "total": 8,
        "groups": [
            {"name": "Cryptek", "desc": "1 Cryptek: Chronomancer, Psychomancer or Technomancer", "min": 1, "max": 1,
             "ids": ["chrono_aeonstave", "chrono_entropic", "psychomancer", "technomancer"]},
            {"name": "Plasmacytes", "desc": "1 Plasmacyte Accelerator and 1 Plasmacyte Reanimator", "min": 2, "max": 2, "ids": ["accelerator", "reanimator"]},
            {"name": "Operatives", "desc": "5 Hierotek Circle operatives from the list below", "min": 5, "max": 5,
             "ids": ["apprentek", "deathmark", "despotek_gauss", "despotek_tesla", "guardian_gauss", "guardian_tesla"]},
        ],
        "repeatable": ["deathmark", "guardian_gauss", "guardian_tesla"],
        "caps": [{"ids": ["despotek_gauss", "despotek_tesla"], "max": 1, "label": "Only 1 Despotek"}],
        "rules": [
            "Select 1 Cryptek: a Chronomancer (with an aeonstave or entropic lance), Psychomancer or Technomancer.",
            "Select 1 Plasmacyte Accelerator and 1 Plasmacyte Reanimator.",
            "Select 5 other operatives. You can take several Deathmarks and Guardians, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Reanimation Protocols", "The first time each operative is incapacitated, place a Reanimation marker in its control range, then remove the operative along with all its tokens and effects. In the Ready step, pick a marker and roll a D6. On a 1-2, try another marker (each once per turning point). On a 3+, it's reanimated: set it up within 3\" of the marker (outside enemy control range) with 1 wound, ready, with an order of your choice."),
        ("Magnify", "Some Apprentek and Cryptek weapons have Magnify. When shooting, another visible Apprentek or Cryptek with an Engage order (outside enemy control range) can count as the active operative for targeting, cover and obscured. The weapon gains Ceaseless."),
        ("Living Metal", "In the Ready step of each Strategy phase (before Reanimation), each operative regains up to D3+1 wounds."),
    ],
    "ploys": {
        "strategy": [
            ("Relentless Onslaught", "When shooting an operative within 8\", ranged weapons gain Balanced. The shooter must be within 8\" even when using Magnify."),
            ("Command Underlings", "SUPPORT. Pick one: other operatives visible within 6\" of a Cryptek make a free Dash, or non-Crypteks visible within 3\" of an Apprentek make a free Dash."),
            ("Undying Androids", "When one is shot and can't retain any cover saves, retain one defence die as a normal success without rolling it."),
            ("Methodical Elimination", "Melee weapons gain Accurate 1, or Accurate 2 when retaliating or fighting without having moved more than its Move this activation."),
        ],
        "firefight": [
            ("Cortical Control", "When an Apprentek or Cryptek does a SUPPORT action, ignore the distance requirement. It only needs to see the target."),
            ("Dimensional Ambush", "During a Deathmark's activation while it has a Conceal order, it can Guard with a Conceal order in any killzone, and switch to Engage for the interrupting Shoot or Fight."),
            ("Reanimated Function", "When working out marker control, a Reanimation marker counts as a friendly operative with APL 1 until the next turning point (not for Martyrs)."),
            ("Living Lightning", "When an Immortal shoots a tesla carbine, it loses the 2\" from Devastating and gains Blast 2\"."),
        ],
    },
    "equipment": [
        {"id": "magnification_conduits", "name": "Magnification Conduits", "desc": "Once per turning point, an Apprentek or Cryptek shooting can Magnify through another visible non-Plasmacyte with an Engage order (outside enemy control range)."},
        {"id": "tesla_weave", "name": "Tesla Weave", "desc": "Once per turning point, when an enemy ends a Charge with your operatives in its control range, inflict D3+1 damage on it."},
        {"id": "phase_shifter", "name": "Phase Shifter", "desc": "Once per turning point, when a Cryptek is shot, the attacker's Piercing gets worse by 1."},
        {"id": "tesseract_cube", "name": "Tesseract Cube", "desc": "In the Ready step, if the Cryptek is alive, outside enemy control range and wasn't reanimated this turning point, roll a D6. On a 1, you can't use this again. On a 4+, gain 1CP (2CP per battle at most)."},
    ],
    "operatives": [
        cryptek("chrono_aeonstave", "Chronomancer (aeonstave)", [("Aeonstave (ranged)", 5, "3+", "3/3", 'Blast 2", Lethal 5+, Stun, Magnify')], [("Aeonstave (melee)", 4, "4+", "3/4", "Lethal 5+, Shock")], CHRONO_ACTIONS),
        cryptek("chrono_entropic", "Chronomancer (entropic lance)", [("Entropic lance (ranged)", 4, "3+", "5/3", "Devastating 3, Piercing 1, Magnify")], [("Entropic lance (melee)", 4, "4+", "3/6", "-")], CHRONO_ACTIONS),
        cryptek("psychomancer", "Psychomancer", [("Abyssal lance (ranged)", 5, "3+", "2/2", 'Blast 2", 2" Devastating 1, Piercing 2, Magnify')], [("Abyssal lance (melee)", 4, "4+", "4/4", "Devastating 1")],
                [INTERSTITIAL,
                 "Nightmare Shroud (1AP): Until its next activation, enemies within 4\" of it can't re-roll attack dice or retain results below 6 as critical successes. It can't do this within enemy control range.",
                 "Vision of Madness (1AP): A visible enemy gains a Madness token until this operative's next activation. When your opponent would activate it, roll a D6. If the roll equals or beats its APL, they can't activate it yet. It can't do this within enemy control range.",
                 "Harbinger of Despair (1AP): Place your Despair marker somewhere visible (or on visible Vantage terrain). Enemies within 2\" of it pay 1 extra AP for Pick Up Marker and mission actions, and for markers they contest, their total APL counts as 1 lower. Remove it at this operative's next activation. It can't do this within enemy control range."]),
        cryptek("technomancer", "Technomancer", [("Staff of light (ranged)", 6, "3+", "3/4", "Rending, Magnify")], [("Staff of light (melee)", 4, "4+", "3/5", "Rending")],
                [INTERSTITIAL,
                 "Canoptek Repair (1AP): SUPPORT. A friendly operative visible within 6\" regains up to 2D3 wounds. Once per turning point for the whole team, and not within enemy control range.",
                 "Augment Weapon (1AP): SUPPORT. Pick a friendly operative visible within 6\". One profile of one of its datacard weapons gains two of Lethal 5+, Rending, Saturate and Severe until this operative's next activation. It can't do this within enemy control range.",
                 "Reinforce Metal (1AP): SUPPORT. Pick a friendly operative visible within 6\". Until this operative's next activation, damage of 3 or more on it is reduced by 1. It can't do this within enemy control range."],
                pts=50),
        {"id": "accelerator", "name": "Plasmacyte Accelerator", "apl": 2, "move": '7"', "save": "5+", "wounds": 5, "pts": 25,
         "ranged": [("Spark", 4, "4+", "2/3", 'Range 4", Piercing 1')], "melee": [CLAWS],
         "abilities": [SCUTTLER.format("Accelerate"),
                       "Accelerate (1AP): A Deathmark or Immortal visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
         "kw": "PLASMACYTE, ACCELERATOR"},
        {"id": "reanimator", "name": "Plasmacyte Reanimator", "apl": 2, "move": '7"', "save": "5+", "wounds": 5, "pts": 25,
         "ranged": [("Atomiser beam", 4, "4+", "3/4", 'Range 6", Lethal 5+')], "melee": [CLAWS],
         "abilities": [SCUTTLER.format("Reanimate"),
                       "Reanimate (1/2AP): Pick a Reanimation marker visible within 6\". On a D6 roll of 3+ (or automatically for 2AP), that operative is reanimated. It's set up expended if it was already expended this turning point. It can't do this within enemy control range."],
         "kw": "MEDIC, PLASMACYTE, REANIMATOR"},
        {"id": "apprentek", "name": "Apprentek", "apl": 3, "move": '6"', "save": "3+", "wounds": 11, "pts": 32,
         "ranged": [("Arcane conduit (ranged)", 4, "3+", "4/5", "Piercing 1, Magnify")], "melee": [("Arcane conduit (melee)", 3, "4+", "3/5", "-")],
         "abilities": [MAGNIFY, "Apprentek Assistance: It has your Cryptek's unique actions, but can only use one of them per turning point."],
         "kw": "APPRENTEK"},
        {"id": "deathmark", "name": "Deathmark", "apl": 2, "move": '5"', "save": "3+", "wounds": 10, "pts": 32,
         "ranged": [("Synaptic disintegrator", 4, "2+", "4/3", "Devastating 2, Heavy (Dash only), Piercing 1, Severe")], "melee": [("Fists", 3, "3+", "3/4", "-")],
         "abilities": ["Deathmarked: After it Shoots, a (primary) target that survives gains a Deathmarked token. Deathmarks shooting a Deathmarked enemy gain Seek.",
                       "Multi-Dimensional Vision (1AP): Until its next activation, enemies can't be obscured when it shoots. It can't do this within enemy control range."],
         "kw": "DEATHMARK"},
        immortal("despotek_gauss", "Immortal Despotek (gauss)", GAUSS, 11,
                 [STEADFAST, "Interstitial Command (1AP): SUPPORT. Another operative (not an Apprentek or Cryptek) visible within 6\" makes a free 1AP action (not Accelerate). It can't move more than 2\", can't repeat an action it already did this turning point, and can't do this action again this turning point. It can't do this within enemy control range or while counteracting."], "DESPOTEK"),
        immortal("despotek_tesla", "Immortal Despotek (tesla)", TESLA, 11,
                 [STEADFAST, "Interstitial Command (1AP): SUPPORT. Another operative (not an Apprentek or Cryptek) visible within 6\" makes a free 1AP action (not Accelerate). It can't move more than 2\", can't repeat an action it already did this turning point, and can't do this action again this turning point. It can't do this within enemy control range or while counteracting."], "DESPOTEK"),
        immortal("guardian_gauss", "Immortal Guardian (gauss)", GAUSS, 10, [STEADFAST], "GUARDIAN"),
        immortal("guardian_tesla", "Immortal Guardian (tesla)", TESLA, 10, [STEADFAST], "GUARDIAN"),
    ],
}
