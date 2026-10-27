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
            {"name": "Mutated (added during the battle)", "desc": "Mutants and Torments appear when Devotees mutate (up to 5 Mutants and 3 Torments)", "min": 0, "max": 8, "extra": True,
             "ids": ["mutant", "torment"]},
        ],
        "repeatable": ["blessed_blade", "devotee", "mutant", "torment"],
        "maxCount": {"blessed_blade": 2, "devotee": 9, "mutant": 5, "torment": 3},
        "rules": [
            "The team is fixed: 1 Cult Demagogue, 2 Blessed Blades, 9 Chaos Devotees, 1 Iconarch, 1 Mindwitch.",
            "Mutants and Torments aren't selected. Devotees turn into them during the battle, so add them here when that happens (up to 5 Mutants and 3 Torments at once). They don't count toward the 14.",
        ],
    },
    "factionRules": [
        ("Mutation", "Mutate as a STRATEGIC GAMBIT (2 operatives in the first and second turning points, 3 in the third, 4 from the fourth on), or when a Devotee kills an enemy in its control range. Each operative once per turning point. Choose one: a Devotee becomes a Mutant, a Mutant becomes a Torment (twice per turning point at most), or it regains up to D3+1 wounds. Swap the model in place. It keeps its lost wounds."),
        ("Accursed Gifts", "Pick a primary gift the first time a Devotee becomes a Mutant (all Mutants and Torments get it), and a different secondary gift the first time a Mutant becomes a Torment (Torments get both). 1 Deformed Wings: climbing counts as 2\", and it ignores drops. 2 Fleet: +1\" Move. 3 Chitinous: improve Save by 1. 4 Horned: after a Charge, inflict 1 damage (D3 for a Torment) on an enemy in its control range. 5 Sinewed: ignore injury changes to melee Hit, and melee weapons gain Brutal. 6 Barbed: enemies can't assist against it, and its first strike also inflicts 1 damage (D3 for a Torment) on other enemies in its control range."),
    ],
    "ploys": {
        "strategy": [
            ("Exaltation in Pain", "Ignore Hit changes from being injured. When a wounded Cultist is shot, re-roll one defense die."),
            ("Fervent Onslaught", "Melee weapons gain Accurate 1, or Accurate 2 for Mutants and Torments."),
            ("Creatures of Nightmare", "For markers contested by an enemy within 2\" of a Mutant or Torment, the enemy's total APL counts as 1 lower."),
            ("Sickening Aura", "Enemies within 2\" of a Mutant or Torment get a worse Hit by 1. This isn't affected by being injured."),
        ],
        "firefight": [
            ("Faithful Follower", "When a Dark Commune operative is picked as the target of a Shoot or Fight, another Cultist (not Dark Commune) visible within 3\" becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."),
            ("Abhorrent Mutation", "When an operative that isn't Dark Commune activates, it gains an extra Accursed Gift, and keeps it if it mutates. Once per operative per battle."),
            ("Frenzied Demise", "When a Mutant or Torment is incapacitated, inflict D3 damage (D6 for a Torment) on an enemy visible within 2\"."),
            ("Unleash the Daemon", "During a Mutant's or Torment's activation, it can Fight twice, and one of those is free."),
        ],
    },
    "equipment": [
        {"id": "baleful_script", "name": "Baleful Script", "desc": "STRATEGIC GAMBIT, once per battle: change one of your Accursed Gifts."},
        {"id": "covert_guises", "name": "Covert Guises", "desc": "Roll a D3. In the first turning point's Strategy phase, that many Devotees wholly in your drop zone get a free Reposition, ending wholly within 3\" of it."},
        {"id": "unholy_talisman", "name": "Unholy Talisman", "desc": "Once per turning point, when a Cultist is shot, retain one normal defense success as a critical success."},
        {"id": "vile_blessing", "name": "Vile Blessing", "desc": "Once per battle, ignore the Normal Dmg from one attack die on an operative that isn't a Devotee. Not on the same die as Unnatural Regeneration."},
    ],
    "operatives": [
        cc("demagogue", "Cult Demagogue", [("Diabolical stave (ranged)", 4, "4+", "3/6", 'Range 2", Stun'), PISTOL], [("Diabolical stave (melee)", 4, "4+", "3/6", "Shock, Stun")],
           ["Incite Slaughter (1AP): SUPPORT. Another Cultist visible within 9\" makes a free Fight. It can't do this within enemy control range.",
            "Incite Urgency (1AP): SUPPORT. Another Cultist visible within 9\" makes a free Charge (up to 3\") or Dash. It can't do this within enemy control range."],
           "LEADER, DARK COMMUNE, CULT DEMAGOGUE"),
        cc("blessed_blade", "Blessed Blade", [], [("Commune blade", 4, "4+", "4/6", "Lethal 5+")],
           ["Cut Them Down: When an enemy Falls Back from its control range, inflict D3+1 damage on it before it moves (2D3+2 if both Blessed Blades are in range).",
            "Attuned In Purpose: When it's activated, you can activate another ready Blessed Blade within 6\" at the same time."],
           "DARK COMMUNE, BLESSED BLADE", pts=28),
        cc("iconarch", "Iconarch", [("Burning censer", 4, "2+", "4/4", 'Range 5", Saturate, Torrent 2"'), PISTOL], [("Crude melee weapon", 3, "4+", "2/3", "-")],
           ["Icon Bearer: Its APL counts as 1 higher for marker control.",
            "Ruinous Icon (1AP): PSYCHIC. Until its next activation, pick one. Invigoration: Cultists within 4\" take 1 less damage from Normal or Critical Dmg of 4 or more. Deterioration: enemies within 4\" take 1 more damage from Normal and Critical Dmg. It can't do this within enemy control range."],
           "DARK COMMUNE, PSYKER, ICONARCH"),
        cc("mindwitch", "Mindwitch", [("Infernal gaze", 5, "3+", "0/0", 'PSYCHIC, Range 6", Devastating 2, Lethal 3+')], [("Fists", 3, "5+", "1/2", "-")],
           ["Heinous Deluge (1AP): PSYCHIC. An enemy that's a valid target gets -1 APL until the end of its next activation. It can't do this within enemy control range.",
            "Malefic Vortex (1AP): PSYCHIC. Place or move your Malefic Vortex marker somewhere visible to it (or on visible Vantage terrain). Inflict 1 damage on each enemy within 2\" of it now and in each Ready step. It can't do this within enemy control range."],
           "DARK COMMUNE, PSYKER, MINDWITCH"),
        cc("devotee", "Chaos Devotee", [PISTOL], [("Crude melee weapon", 4, "4+", "2/3", "-")],
           ["Group Activation: When it's expended, activate another ready Devotee next (no more than two in a row)."], "DEVOTEE", wounds=7, pts=25),
        cc("mutant", "Chaos Mutant", [], [("Blasphemous appendages", 4, "4+", "3/4", "Ceaseless, Rending")],
           ["Accursed Mutant: It has no unique actions. Pick Up Marker and mission actions cost it 1 extra AP (but not Operate Hatch).", REGEN], "MUTANT", wounds=7, pts=25),
        cc("torment", "Chaos Torment", [], [("Hideous mutations", 5, "4+", "4/5", "Ceaseless, Rending")],
           ["Accursed Torment: It can only use its own weapons. It can't Pick Up Marker or take unique or mission actions, but it can Operate Hatch.",
            "Brute: While it has a Conceal order, it can't use Light terrain for cover when it's targeted. It still keeps its cover save.", REGEN],
           "TORMENT", wounds=13, pts=40),
    ],
}
