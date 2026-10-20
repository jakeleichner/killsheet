MAGNIFY = "Magnify (weapon rule): Shooting a target visible to it, if another Apprentek/Cryptek on Engage (not in enemy control range) is visible to it, that one can be the active operative for valid target, conditions, cover and obscured; the weapon gains Ceaseless."
INTERSTITIAL = "Interstitial Command (1AP): SUPPORT. Another operative (not Apprentek/Cryptek) visible within 6\" (or within 6\" of a visible Despotek) makes a free 1AP action: max 2\" move, not one it already did this TP, and not again this TP. Not within enemy control range or while counteracting."
SCUTTLER = "Scuttler: On Conceal and in cover: can't be targeted (except within 2\"). Fall Back costs 1 less AP. Own weapons only; no unique actions except {}."
STEADFAST = "Steadfast: For marker control, can treat its APL as 3 (ignoring changes)."
CLAWS = ("Claws", 3, "5+", "1/2", "-")
BAYONET = ("Bayonet", 4, "3+", "3/4", "-")
GAUSS = ("Gauss blaster", 4, "3+", "4/5", "Piercing 1")
TESLA = ("Tesla carbine", 5, "3+", "3/3", '2" Devastating 1')

def cryptek(oid, name, ranged, melee, actions, pts=40):
    return {"id": oid, "name": name, "apl": 3, "move": '6"', "save": "3+", "wounds": 14, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": [MAGNIFY] + actions, "kw": "LEADER, CRYPTEK, " + name.split(" (")[0].upper()}

CHRONO_ACTIONS = [
    INTERSTITIAL,
    "Timesplinter (1AP): Another expended friendly visible within 5\": remove and set up visible within 5\" horizontally. Not TP1, once per TP (team), not within enemy control range.",
    "Countertemporal Nanomine (1AP): Place the marker visible within 8\" (or on visible Vantage within 8\"). Enemies within 4\" of it: -2\" Move. Removed at this one's next activation. Not within enemy control range.",
    "Chronometron (1AP): SUPPORT. Friendly visible within 6\": until this one's next activation, attackers vs it get -1 Atk. Not within enemy control range.",
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
            "Select 1 Cryptek: Chronomancer (aeonstave or entropic lance), Psychomancer or Technomancer.",
            "Select 1 Plasmacyte Accelerator and 1 Plasmacyte Reanimator.",
            "Select 5 other operatives. Other than Deathmarks and Guardians, each only once.",
        ],
    },
    "factionRules": [
        ("Reanimation Protocols", "First time each operative is incapacitated: place a Reanimation marker in its control range, then remove it (and all its tokens/effects). Ready step: pick a marker, D6: 1-2 try another (each once per TP); 3+ it's REANIMATED: set up within 3\" of the marker (not in enemy control range), 1 wound, ready, order of your choice."),
        ("Magnify", "Some Apprentek/Cryptek weapons have Magnify: when shooting, another visible Apprentek/Cryptek on Engage (not in enemy control range) can be treated as the active operative for targeting, cover and obscured; the weapon gains Ceaseless."),
        ("Living Metal", "Ready step of each Strategy phase (before Reanimation): each operative regains up to D3+1 wounds."),
    ],
    "ploys": {
        "strategy": [
            ("Relentless Onslaught", "Shooting an operative within 8\": ranged weapons gain Balanced (the shooter must be within 8\" even when Magnifying)."),
            ("Command Underlings", "SUPPORT. Either: others visible within 6\" of a Cryptek make a free Dash; or non-Crypteks visible within 3\" of an Apprentek make a free Dash."),
            ("Undying Androids", "Shot and can't retain any cover saves: retain one defence die as a normal success without rolling."),
            ("Methodical Elimination", "Melee weapons gain Accurate 1; Accurate 2 when retaliating or fighting without having moved more than its Move stat."),
        ],
        "firefight": [
            ("Cortical Control", "An Apprentek/Cryptek does a SUPPORT action: ignore the distance requirement (visibility only)."),
            ("Dimensional Ambush", "Concealed Deathmark's activation: can Guard on Conceal in any killzone; switch to Engage for the interrupting Shoot/Fight."),
            ("Reanimated Function", "Determining marker control: a Reanimation marker counts as a friendly with APL 1 until next TP (not for Martyrs)."),
            ("Living Lightning", "Immortal shooting a tesla carbine: loses the 2\" from Devastating, gains Blast 2\"."),
        ],
    },
    "equipment": [
        {"id": "magnification_conduits", "name": "Magnification Conduits", "desc": "Once/TP, an Apprentek/Cryptek shooting can Magnify through another non-Plasmacyte on Engage (not in enemy control range) visible to it."},
        {"id": "tesla_weave", "name": "Tesla Weave", "desc": "Once/TP, an enemy ends a Charge with your operatives in its control range: inflict D3+1 dmg on it."},
        {"id": "phase_shifter", "name": "Phase Shifter", "desc": "Once/TP, a Cryptek being shot: attacker's Piercing worsened by 1."},
        {"id": "tesseract_cube", "name": "Tesseract Cube", "desc": "Ready step, if the Cryptek is alive, not in enemy control range and not reanimated this TP: D6, 1 = never again, 4+ = +1CP (max 2CP per battle)."},
    ],
    "operatives": [
        cryptek("chrono_aeonstave", "Chronomancer (aeonstave)", [("Aeonstave (ranged)", 5, "3+", "3/3", 'Blast 2", Lethal 5+, Stun, Magnify')], [("Aeonstave (melee)", 4, "4+", "3/4", "Lethal 5+, Shock")], CHRONO_ACTIONS),
        cryptek("chrono_entropic", "Chronomancer (entropic lance)", [("Entropic lance (ranged)", 4, "3+", "5/3", "Devastating 3, Piercing 1, Magnify")], [("Entropic lance (melee)", 4, "4+", "3/6", "-")], CHRONO_ACTIONS),
        cryptek("psychomancer", "Psychomancer", [("Abyssal lance (ranged)", 5, "3+", "2/2", 'Blast 2", 2" Devastating 1, Piercing 2, Magnify')], [("Abyssal lance (melee)", 4, "4+", "4/4", "Devastating 1")],
                [INTERSTITIAL,
                 "Nightmare Shroud (1AP): Until its next activation, enemies within 4\" attacking can't re-roll attack dice or retain results below 6 as crits. Not within enemy control range.",
                 "Vision of Madness (1AP): A visible enemy gains a Madness token until this one's next activation; when the opponent would activate it, roll D6: if ≥ its APL, they can't activate it now. Not within enemy control range.",
                 "Harbinger of Despair (1AP): Place your Despair marker visible (or on visible Vantage). Enemies within 2\": +1AP for Pick Up Marker/mission actions; markers they contest count their total APL 1 lower. Removed at this one's next activation. Not within enemy control range."]),
        cryptek("technomancer", "Technomancer", [("Staff of light (ranged)", 6, "3+", "3/4", "Rending, Magnify")], [("Staff of light (melee)", 4, "4+", "3/5", "Rending")],
                [INTERSTITIAL,
                 "Canoptek Repair (1AP): SUPPORT. Friendly visible within 6\" regains up to 2D3 wounds. Once/TP (team); not within enemy control range.",
                 "Augment Weapon (1AP): SUPPORT. Friendly visible within 6\": one datacard weapon (one profile) gains two of Lethal 5+, Rending, Saturate, Severe until this one's next activation. Not within enemy control range.",
                 "Reinforce Metal (1AP): SUPPORT. Friendly visible within 6\": until this one's next activation, 3+ dmg on it is reduced by 1. Not within enemy control range."],
                pts=50),
        {"id": "accelerator", "name": "Plasmacyte Accelerator", "apl": 2, "move": '7"', "save": "5+", "wounds": 5, "pts": 25,
         "ranged": [("Spark", 4, "4+", "2/3", 'Range 4", Piercing 1')], "melee": [CLAWS],
         "abilities": [SCUTTLER.format("Accelerate"),
                       "Accelerate (1AP): A Deathmark or Immortal visible within 6\": +1 APL until end of its next activation. Not within enemy control range."],
         "kw": "PLASMACYTE, ACCELERATOR"},
        {"id": "reanimator", "name": "Plasmacyte Reanimator", "apl": 2, "move": '7"', "save": "5+", "wounds": 5, "pts": 25,
         "ranged": [("Atomiser beam", 4, "4+", "3/4", 'Range 6", Lethal 5+')], "melee": [CLAWS],
         "abilities": [SCUTTLER.format("Reanimate"),
                       "Reanimate (1/2AP): A Reanimation marker visible within 6\": D6 3+ (or automatically for 2AP) that operative is REANIMATED (set up expended if it had already been expended this TP). Not within enemy control range."],
         "kw": "MEDIC, PLASMACYTE, REANIMATOR"},
        {"id": "apprentek", "name": "Apprentek", "apl": 3, "move": '6"', "save": "3+", "wounds": 11, "pts": 32,
         "ranged": [("Arcane conduit (ranged)", 4, "3+", "4/5", "Piercing 1, Magnify")], "melee": [("Arcane conduit (melee)", 3, "4+", "3/5", "-")],
         "abilities": [MAGNIFY, "Apprentek Assistance: Has your Cryptek's unique actions, but can use only one Cryptek unique action per TP."],
         "kw": "APPRENTEK"},
        {"id": "deathmark", "name": "Deathmark", "apl": 2, "move": '5"', "save": "3+", "wounds": 10, "pts": 32,
         "ranged": [("Synaptic disintegrator", 4, "2+", "4/3", "Devastating 2, Heavy (Dash only), Piercing 1, Severe")], "melee": [("Fists", 3, "3+", "3/4", "-")],
         "abilities": ["Deathmarked: After it Shoots, a surviving (primary) target gains a Deathmarked token. Deathmarks shooting a Deathmarked enemy gain Seek.",
                       "Multi-Dimensional Vision (1AP): Until its next activation, enemies can't be obscured when it shoots. Not within enemy control range."],
         "kw": "DEATHMARK"},
        immortal("despotek_gauss", "Immortal Despotek (gauss)", GAUSS, 11,
                 [STEADFAST, "Interstitial Command (1AP): SUPPORT. Another operative (not Apprentek/Cryptek) visible within 6\" makes a free 1AP action (not Accelerate): max 2\" move, not one it already did this TP, and not again this TP. Not within enemy control range or while counteracting."], "DESPOTEK"),
        immortal("despotek_tesla", "Immortal Despotek (tesla)", TESLA, 11,
                 [STEADFAST, "Interstitial Command (1AP): SUPPORT. Another operative (not Apprentek/Cryptek) visible within 6\" makes a free 1AP action (not Accelerate): max 2\" move, not one it already did this TP, and not again this TP. Not within enemy control range or while counteracting."], "DESPOTEK"),
        immortal("guardian_gauss", "Immortal Guardian (gauss)", GAUSS, 10, [STEADFAST], "GUARDIAN"),
        immortal("guardian_tesla", "Immortal Guardian (tesla)", TESLA, 10, [STEADFAST], "GUARDIAN"),
    ],
}
