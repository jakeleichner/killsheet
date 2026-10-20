PISTOL = ("Pistol", 4, "4+", "2/3", 'Range 8"')
REGEN = "Unnatural Regeneration: Whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 5+, subtract 1 from that damage."

def cc(oid, name, ranged, melee, abilities, kw, wounds=8, pts=32):
    return {"id": oid, "name": name, "apl": 2, "move": '6"', "save": "5+", "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "chaoscult", "source": "chaos_cult", "name": "Chaos Cult", "badge": "CHAOS", "color": "#B04A7A",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 14,
        "groups": [
            {"name": "Leader", "desc": "1 Cult Demagogue", "min": 1, "max": 1, "ids": ["demagogue"]},
            {"name": "Dark Commune", "desc": "2 Blessed Blades, 1 Iconarch, 1 Mindwitch", "min": 4, "max": 4, "ids": ["blessed_blade", "iconarch", "mindwitch"]},
            {"name": "Devotees", "desc": "9 Chaos Devotees", "min": 9, "max": 9, "ids": ["devotee"]},
            {"name": "Mutated (added during the battle)", "desc": "Mutants and Torments appear when Devotees mutate (max 5 Mutants, 3 Torments)", "min": 0, "max": 8, "extra": True,
             "ids": ["mutant", "torment"]},
        ],
        "repeatable": ["blessed_blade", "devotee", "mutant", "torment"],
        "maxCount": {"blessed_blade": 2, "devotee": 9, "mutant": 5, "torment": 3},
        "rules": [
            "The team is fixed: 1 Cult Demagogue, 2 Blessed Blades, 9 Chaos Devotees, 1 Iconarch, 1 Mindwitch.",
            "Mutants and Torments aren't selected: Devotees turn into them during the battle. Add them here when that happens (max 5 Mutants and 3 Torments at once); they don't count toward the 14.",
        ],
    },
    "factionRules": [
        ("Mutation", "MUTATE as a STRATEGIC GAMBIT (turning point 1: 2, turning point 2: 2, turning point 3: 3, turning point 4+: 4 operatives) or when a Devotee kills an enemy in its control range; each once per turning point. Choose: Devotee becomes a Mutant, Mutant becomes a Torment (max twice per turning point), or regain up to D3+1 wounds. Swap the model in place; it keeps its lost wounds."),
        ("Accursed Gifts", "Pick a primary gift the first time a Devotee becomes a Mutant (all Mutants and Torments get it) and a secondary the first time a Mutant becomes a Torment (Torments get it). 1 Deformed Wings: climbing counts as 2\", ignore drops. 2 Fleet: +1\" Move. 3 Chitinous: Save +1. 4 Horned: after a Charge, 1 damage (Torment D3) to an enemy in control range. 5 Sinewed: ignore injured melee Hit changes; melee Brutal. 6 Barbed: enemies can't assist against it; first strike also deals 1 damage (Torment D3) to other enemies in control range."),
    ],
    "ploys": {
        "strategy": [
            ("Exaltation in Pain", "Ignore injured Hit changes; wounded Cultists being shot re-roll one defence die."),
            ("Fervent Onslaught", "Melee weapons gain Accurate 1 (Accurate 2 for Mutants and Torments)."),
            ("Creatures of Nightmare", "Markers contested by an enemy within 2\" of a Mutant or Torment: enemy total APL counts 1 lower."),
            ("Sickening Aura", "Enemies within 2\" of a Mutant or Torment: Hit worsened by 1 (not with injury)."),
        ],
        "firefight": [
            ("Faithful Follower", "A Dark Commune operative is targeted by a Shoot or Fight: another non-Commune Cultist visible within 3\" becomes the target instead (cover/obscured only if the original was). Not against Blast/Torrent."),
            ("Abhorrent Mutation", "When a non-Commune operative activates: it gains an extra Accursed Gift (kept if it mutates). Once per operative per battle."),
            ("Frenzied Demise", "A Mutant or Torment is incapacitated: D3 damage (Torment D6) to an enemy visible within 2\"."),
            ("Unleash the Daemon", "During a Mutant's or Torment's activation: it can Fight twice, and one of them is free."),
        ],
    },
    "equipment": [
        {"id": "baleful_script", "name": "Baleful Script", "desc": "Once per battle STRATEGIC GAMBIT: change one of your Accursed Gifts."},
        {"id": "covert_guises", "name": "Covert Guises", "desc": "Roll D3: in turning point 1 Strategy phase, that many Devotees wholly in your drop zone get a free Reposition (end wholly within 3\" of it)."},
        {"id": "unholy_talisman", "name": "Unholy Talisman", "desc": "Once per turning point, a Cultist being shot: retain one normal defence success as a crit."},
        {"id": "vile_blessing", "name": "Vile Blessing", "desc": "Once per battle, ignore the Normal Dmg from one attack dice on a non-Devotee (not on the same die as Unnatural Regeneration)."},
    ],
    "operatives": [
        cc("demagogue", "Cult Demagogue", [("Diabolical stave (ranged)", 4, "4+", "3/6", 'Range 2", Stun'), PISTOL], [("Diabolical stave (melee)", 4, "4+", "3/6", "Shock, Stun")],
           ["Incite Slaughter (1AP): SUPPORT. Another Cultist visible within 9\" makes a free Fight. Not within enemy control range.",
            "Incite Urgency (1AP): SUPPORT. Another Cultist visible within 9\" makes a free Charge (max 3\") or Dash. Not within enemy control range."],
           "LEADER, DARK COMMUNE, CULT DEMAGOGUE"),
        cc("blessed_blade", "Blessed Blade", [], [("Commune blade", 4, "4+", "4/6", "Lethal 5+")],
           ["Cut Them Down: An enemy Falls Back from its control range: inflict D3+1 damage before it moves (2D3+2 if two Blessed Blades are on it).",
            "Attuned In Purpose: When activated, you can activate another ready Blessed Blade within 6\" at the same time."],
           "DARK COMMUNE, BLESSED BLADE", pts=28),
        cc("iconarch", "Iconarch", [("Burning censer", 4, "2+", "4/4", 'Range 5", Saturate, Torrent 2"'), PISTOL], [("Crude melee weapon", 3, "4+", "2/3", "-")],
           ["Icon Bearer: Marker control APL +1.",
            "Ruinous Icon (1AP): PSYCHIC. Until its next activation: Invigoration (Cultists within 4\" take 1 less from Normal or Critical Dmg of 4+) or Deterioration (enemies within 4\" take 1 more from Normal or Critical Dmg). Not within enemy control range."],
           "DARK COMMUNE, PSYKER, ICONARCH"),
        cc("mindwitch", "Mindwitch", [("Infernal gaze", 5, "3+", "0/0", 'PSYCHIC, Range 6", Devastating 2, Lethal 3+')], [("Fists", 3, "5+", "1/2", "-")],
           ["Heinous Deluge (1AP): PSYCHIC. An enemy valid target: -1 APL until end of its next activation. Not within enemy control range.",
            "Malefic Vortex (1AP): PSYCHIC. (Re)place your Malefic Vortex marker visible to it (or on visible Vantage): 1 damage to each enemy within 2\" now and in each Ready step. Not within enemy control range."],
           "DARK COMMUNE, PSYKER, MINDWITCH"),
        cc("devotee", "Chaos Devotee", [PISTOL], [("Crude melee weapon", 4, "4+", "2/3", "-")],
           ["Group Activation: When expended, activate another ready Devotee next (max two in a row)."], "DEVOTEE", wounds=7, pts=25),
        cc("mutant", "Chaos Mutant", [], [("Blasphemous appendages", 4, "4+", "3/4", "Ceaseless, Rending")],
           ["Accursed Mutant: No unique actions; Pick Up Marker and mission actions cost +1AP (not Operate Hatch).", REGEN], "MUTANT", wounds=7, pts=25),
        cc("torment", "Chaos Torment", [], [("Hideous mutations", 5, "4+", "4/5", "Ceaseless, Rending")],
           ["Accursed Torment: Own weapons only; no Pick Up Marker, unique or mission actions (Operate Hatch allowed).",
            "Brute: On Conceal, can't use Light terrain for cover when targeted (keeps cover save).", REGEN],
           "TORMENT", wounds=13, pts=40),
    ],
}
