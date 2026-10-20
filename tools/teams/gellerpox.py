GROUP_ACT = "Group Activation: When expended, activate another ready {} next (max two in a row)."
FRAG = ("Frag grenade", 4, "4+", "2/4", 'Range 6", Blast 2", Limited 1, Saturate')
MUTANT_ABILITIES = [GROUP_ACT.format("Mutant"), "Gellercaust Masks: An attack dice would inflict Critical Dmg on it: you can make it inflict Normal Dmg instead."]
VERMIN_GA = GROUP_ACT.format("Mutoid Vermin")

def hulk(oid, name, wounds, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 2, "move": '5"', "save": "5+", "wounds": wounds, "pts": 40,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": "NIGHTMARE HULK, " + kw}

def vermin(oid, name, move, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 2, "move": move, "save": "6+", "wounds": 2, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": [VERMIN_GA] + abilities, "kw": "MUTOID VERMIN, " + kw,
            "ex": []}

TEAM = {
    "id": "gellerpox", "source": "gellerpox_infected", "name": "Gellerpox Infected", "badge": "CHAOS", "color": "#A8B03A",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Vulgrar Thrice-Cursed", "min": 1, "max": 1, "ids": ["vulgrar"]},
            {"name": "Nightmare Hulks", "desc": "1 Bloatspawn, 1 Fleshscreamer, 1 Lumberghast", "min": 3, "max": 3, "ids": ["bloatspawn", "fleshscreamer", "lumberghast"]},
            {"name": "Glitchlings", "desc": "4 Glitchlings", "min": 4, "max": 4, "ids": ["glitchling"]},
            {"name": "Mutants", "desc": "1 Mutant with heavy axe, 2 Mutants with improvised weapons", "min": 3, "max": 3, "ids": ["mutant_axe", "mutant_improvised"]},
            {"name": "Mutoid Vermin", "desc": "With the Mutoid Vermin equipment: 4 Mutoid Vermin (extra)", "min": 0, "max": 4, "equip": "mutoid_vermin", "extra": True,
             "ids": ["cursemite", "eyestinger", "sludge_grub"]},
        ],
        "repeatable": ["glitchling", "mutant_improvised", "cursemite", "eyestinger", "sludge_grub"],
        "maxCount": {"glitchling": 4, "mutant_improvised": 2},
        "rules": [
            "The team is fixed: Vulgrar Thrice-Cursed, Bloatspawn, Fleshscreamer, Lumberghast, 4 Glitchlings, 1 Mutant with heavy axe and 2 Mutants with improvised weapons.",
            "If you take the Mutoid Vermin equipment, add 4 Mutoid Vermin (any mix of Cursemites, Eyestinger Swarms and Sludge-grubs). They don't count toward the 11.",
        ],
    },
    "factionRules": [
        ("Techno-curse", "End of Select Operatives: pick one for the battle. Enemies in its infection range suffer the symptom. Barrelwarp (within 2\" of a non-Vermin, 3\" of a Glitchling): -1 ranged Atk. Screaming Rustspikes (in control range of a non-Vermin): each attack die they discard as a fail fighting/retaliating vs you = 1 dmg. Viral Vox-static (within 3\" of a non-Vermin, 4\" of a Glitchling): their APL can't be increased."),
        ("Nightmare Hulks", "Hulks can't use Light terrain for cover when targeted (keep cover save). No unique actions; Pick Up Marker/mission actions cost +1AP (not Vulgrar, not Operate Hatch)."),
        ("Revoltingly Resilient", "3+ dmg on a Hulk or Mutant: D6, on 4+ subtract 1."),
        ("Mutoid Vermin", "Only Charge, Dash, Fall Back (1 less AP), Fight, Reposition, Shoot; own weapons only. Can't contest markers/areas; ignored for kill/elimination ops and escape/survive scoring. Others can move through and near them; they don't block Charge/Dash/Reposition."),
    ],
    "ploys": {
        "strategy": [
            ("Drawn to the Hum", "Pick an objective: Reposition/Charge gets +1\" Move but must end within 2\" of it."),
            ("Rust Emanations", "Non-Vermin fighting/retaliating: opponent can't retain 3s as successes."),
            ("Plagueridden Determination", "Non-Vermin on Engage being shot: re-roll one defence die."),
            ("Blessings of Infection", "Fighting/retaliating: with 3+ fails, discard one to retain another as normal; or with 3+ successes, discard a fail to turn a normal into a crit."),
        ],
        "firefight": [
            ("Putrescent Demise", "Non-Vermin incapacitated: 1 dmg (Hulk: D3) to each enemy visible within 2\"."),
            ("Frightening Onslaught", "After a Hulk Fights (still alive): free Fight (any enemy), ignoring action restrictions."),
            ("Revolting Technology", "Enemy shooting you: its ranged weapons gain Hot; if already Hot, you can add/subtract 1 from their Hot roll."),
            ("Barge", "Hulk's activation/counteraction: can move through/near enemies and Charge/Reposition out of their control range."),
        ],
    },
    "equipment": [
        {"id": "mutated_symptoms", "name": "Mutated Symptoms", "desc": "Once/battle when activating: that operative gains a second Techno-curse until end of TP."},
        {"id": "plague_bellows", "name": "Plague Bellows", "desc": "Hulk shot from more than 6\": retain one defence roll of 3 as a normal success."},
        {"id": "mutoid_vermin", "name": "Mutoid Vermin", "desc": "Add 4 Mutoid Vermin operatives to the team (pick them in the Builder)."},
        {"id": "polluted_stockpile", "name": "Polluted Stockpile", "desc": "Roll 2D6: 7+ remove one of the opponent's equipment; else they remove one of their own (can't be reselected)."},
    ],
    "operatives": [
        hulk("vulgrar", "Vulgrar Thrice-Cursed", 21,
             [("Pyregut (standard)", 5, "2+", "3/3", 'Range 6", Saturate, Torrent 2"'), ("Pyregut (deluge)", 5, "2+", "3/3", 'Range 4", Saturate, Seek Light')],
             [("Fleshmelded weapons", 5, "3+", "4/5", "Engineered")],
             ["Engineered (weapon rule): End of Select Operatives, give it up to two of: +1 Normal Dmg, +1 Crit Dmg, Balanced, Brutal, Lethal 5+, Rending.",
              "Spread the Glorious Gifts: Once/battle STRATEGIC GAMBIT (not in enemy control range): an objective it controls (no enemies near it) gains a Techno-curse token. Enemies in its control range suffer your Techno-curse, plus: Rustspikes deal 2 dmg; Vox-static -1 APL on activation."],
             "LEADER, VULGRAR THRICE-CURSED"),
        hulk("bloatspawn", "Bloatspawn", 20,
             [("Mutant tentacles", 5, "4+", "3/4", 'Range 3", Torrent 1"')],
             [("Mutant claw & tentacles (slashing)", 6, "4+", "3/4", "-"), ("Mutant claw & tentacles (swiping)", 4, "4+", "3/4", "Swipe")],
             ["Tentacled Grasp: Enemy tries to Fall Back from its control range: D6 (+1 if enemy Wounds stat 8 or less), on 4+ it can't (AP not refunded).",
              "Swipe (weapon rule): After a Fight with it, free Fight actions with this profile vs each enemy in control range once (until it dies or has fought them all)."],
             "BLOATSPAWN"),
        hulk("fleshscreamer", "Fleshscreamer", 20, [],
             [("Mutant fist and cleaver (lopping blow)", 1, "3+", "8/9", "Lethal 5+"), ("Mutant fist and cleaver (slashing)", 5, "4+", "5/6", "-")],
             ["Horrifying Shrieking: Enemies within 3\" pay +1AP for Pick Up Marker and mission actions. Markers contested by an enemy within 3\" of it: their total APL counts 1 lower."],
             "FLESHSCREAMER"),
        hulk("lumberghast", "Lumberghast", 20, [], [("Mutant claw", 4, "4+", "6/7", "Brutal")],
             ["Spiked Charger: After moving in a Charge, inflict D3 dmg on each enemy in its control range (roll each)."],
             "LUMBERGHAST"),
        {"id": "glitchling", "name": "Glitchling", "apl": 2, "move": '6"', "save": "6+", "wounds": 3, "pts": 25,
         "ranged": [("Diseased effluence", 4, "4+", "2/2", 'Range 6"')], "melee": [("Diseased nippers", 3, "4+", "1/2", "-")],
         "abilities": ["Daemonic: Ignore Piercing when shot.",
                       "Small: Own weapons only, no unique actions. On Conceal and in cover: can't be targeted (overrides everything except within 2\").",
                       GROUP_ACT.format("Glitchling")],
         "kw": "GLITCHLING"},
        {"id": "mutant_axe", "name": "Mutant (heavy axe)", "apl": 2, "move": '5"', "save": "5+", "wounds": 7, "pts": 25,
         "ranged": [FRAG], "melee": [("Heavy axe", 3, "4+", "4/5", "Brutal")], "abilities": MUTANT_ABILITIES, "kw": "MUTANT"},
        {"id": "mutant_improvised", "name": "Mutant (improvised weapon)", "apl": 2, "move": '5"', "save": "5+", "wounds": 7, "pts": 25,
         "ranged": [FRAG], "melee": [("Improvised weapon", 4, "4+", "3/4", "Ceaseless")], "abilities": MUTANT_ABILITIES, "kw": "MUTANT"},
        vermin("cursemite", "Cursemite", '6"', [], [("Bloodsucking proboscis", 2, "4+", "2/3", "Rending, Feast")],
               ["Feast (weapon rule): Vs a wounded operative: +1 Atk and Lethal 5+."], "CURSEMITE"),
        vermin("eyestinger", "Eyestinger Swarm", '6"', [("Swarm", 5, "6+", "0/0", 'Range 6", Stun')], [("Sting", 5, "5+", "1/2", "Shock")], [], "EYESTINGER SWARM"),
        vermin("sludge_grub", "Sludge-grub", '4"', [("Acid spit", 4, "4+", "2/2", 'Range 6", 1" Devastating 1, Piercing 1')], [("Fanged maw", 2, "4+", "1/3", "-")],
               ["Caustic Demise: When incapacitated, D6 for each enemy visible within 2\": on 4+, 1 dmg."], "SLUDGE-GRUB"),
    ],
}
