GROUP_ACT = "Group Activation: When it's expended, activate another ready {} next (no more than two in a row)."
FRAG = ("Frag grenade", 4, "4+", "2/4", 'Range 6", Blast 2", Limited 1, Saturate')
MUTANT_ABILITIES = [GROUP_ACT.format("Mutant"), "Gellercaust Masks: When an attack die would inflict Critical Dmg on it, you can make it inflict Normal Dmg instead."]
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
            "If you take the Mutoid Vermin equipment, add 4 Mutoid Vermin, in any mix of Cursemites, Eyestinger Swarms and Sludge-grubs. They don't count toward the 11.",
        ],
    },
    "factionRules": [
        ("Techno-curse", "At the end of Select Operatives, pick one for the battle. Enemies in its infection range suffer the symptom. Barrelwarp (within 2\" of a non-Vermin, or 3\" of a Glitchling): -1 Atk on ranged weapons. Screaming Rustspikes (in the control range of a non-Vermin): each attack die they discard as a fail when fighting or retaliating against you inflicts 1 damage on them. Viral Vox-static (within 3\" of a non-Vermin, or 4\" of a Glitchling): their APL can't be increased."),
        ("Nightmare Hulks", "Hulks can't use Light terrain for cover when they're targeted, but keep their cover save. They have no unique actions, and Pick Up Marker and mission actions cost them 1 extra AP (not Vulgrar, and not Operate Hatch)."),
        ("Revoltingly Resilient", "Whenever an attack die inflicts 3 or more damage on a Hulk or Mutant, roll one D6: on a 4+, subtract 1 from that damage."),
        ("Mutoid Vermin", "They can only Charge, Dash, Fall Back (for 1 less AP), Fight, Reposition and Shoot, and only with their own weapons. They can't contest markers or areas, and don't count for kill or elimination ops, or for escape and survive scoring. Other operatives can move through and near them, and they don't block a Charge, Dash or Reposition."),
    ],
    "ploys": {
        "strategy": [
            ("Drawn to the Hum", "Pick an objective. A Reposition or Charge gets +1\" Move, but must end within 2\" of it."),
            ("Rust Emanations", "When a Nightmare Hulk fights or retaliates, your opponent can't retain 3s as successes."),
            ("Plagueridden Determination", "When a non-Vermin with an Engage order is shot, re-roll one defence die."),
            ("Blessings of Infection", "When one fights or retaliates and you fail three or more dice, discard one failure to retain another as a normal success. Or, with three or more successes, discard a failure to turn a normal success into a critical success."),
        ],
        "firefight": [
            ("Putrescent Demise", "When a non-Vermin is incapacitated, inflict 1 damage (D3 for a Hulk) on each enemy visible within 2\"."),
            ("Frightening Onslaught", "After a Hulk Fights and is still alive, it makes a free Fight against any enemy, ignoring action restrictions."),
            ("Revolting Technology", "When an enemy shoots you, its ranged weapons gain Hot. If they already have Hot, you can add or subtract 1 from their Hot roll."),
            ("Barge", "During a Hulk's activation or counteraction, it can move through and near enemies, and Charge or Reposition out of their control range."),
        ],
    },
    "equipment": [
        {"id": "mutated_symptoms", "name": "Mutated Symptoms", "desc": "Once per battle when activating, that operative gains a second Techno-curse until the end of the turning point."},
        {"id": "plague_bellows", "name": "Plague Bellows", "desc": "When a Hulk is shot from more than 6\" away, retain one defence roll of 3 as a normal success."},
        {"id": "mutoid_vermin", "name": "Mutoid Vermin", "desc": "Add 4 Mutoid Vermin operatives to the team (pick them in the Battle tab)."},
        {"id": "polluted_stockpile", "name": "Polluted Stockpile", "desc": "Roll 2D6. On a 7+, remove one of your opponent's equipment. Otherwise, they remove one of their own. It can't be selected again."},
    ],
    "operatives": [
        hulk("vulgrar", "Vulgrar Thrice-Cursed", 21,
             [("Pyregut (standard)", 5, "2+", "3/3", 'Range 6", Saturate, Torrent 2"'), ("Pyregut (deluge)", 5, "2+", "3/3", 'Range 4", Saturate, Seek Light')],
             [("Fleshmelded weapons", 5, "3+", "4/5", "Engineered")],
             ["Engineered (weapon rule): At the end of Select Operatives, give it up to two of: +1 Normal Dmg, +1 Critical Dmg, Balanced, Brutal, Lethal 5+, Rending.",
              "Spread the Glorious Gifts: STRATEGIC GAMBIT, once per battle, outside enemy control range. An objective it controls (with no enemies near it) gains a Techno-curse token. Enemies in that objective's control range suffer your Techno-curse, and also: Rustspikes inflict 2 damage, and Vox-static gives -1 APL when they activate."],
             "LEADER, VULGRAR THRICE-CURSED"),
        hulk("bloatspawn", "Bloatspawn", 20,
             [("Mutant tentacles", 5, "4+", "3/4", 'Range 3", Torrent 1"')],
             [("Mutant claw & tentacles (slashing)", 6, "4+", "3/4", "-"), ("Mutant claw & tentacles (swiping)", 4, "4+", "3/4", "Swipe")],
             ["Tentacled Grasp: When an enemy tries to Fall Back from its control range, roll a D6, adding 1 if the enemy has 8 or fewer Wounds. On a 4+, it can't, and its AP isn't refunded.",
              "Swipe (weapon rule): After a Fight with it, make free Fights with this profile against each other enemy in its control range, once each, until it dies or has fought them all."],
             "BLOATSPAWN"),
        hulk("fleshscreamer", "Fleshscreamer", 20, [],
             [("Mutant fist and cleaver (lopping blow)", 1, "3+", "8/9", "Lethal 5+"), ("Mutant fist and cleaver (slashing)", 5, "4+", "5/6", "-")],
             ["Horrifying Shrieking: Enemies within 3\" pay 1 extra AP for Pick Up Marker and mission actions. For markers contested by an enemy within 3\" of it, their total APL counts as 1 lower."],
             "FLESHSCREAMER"),
        hulk("lumberghast", "Lumberghast", 20, [], [("Mutant claw", 4, "4+", "6/7", "Brutal")],
             ["Spiked Charger: After it moves in a Charge, inflict D3 damage on each enemy in its control range, rolling for each."],
             "LUMBERGHAST"),
        {"id": "glitchling", "name": "Glitchling", "apl": 2, "move": '6"', "save": "6+", "wounds": 3, "pts": 25,
         "ranged": [("Diseased effluence", 4, "4+", "2/2", 'Range 6"')], "melee": [("Diseased nippers", 3, "4+", "1/2", "-")],
         "abilities": ["Daemonic: It ignores Piercing when shot.",
                       "Small: It can only use its own weapons and has no unique actions. While it has a Conceal order and is in cover, enemies more than 2\" away can't target it. This overrides every other rule.",
                       GROUP_ACT.format("Glitchling")],
         "kw": "GLITCHLING"},
        {"id": "mutant_axe", "name": "Mutant (heavy axe)", "apl": 2, "move": '5"', "save": "5+", "wounds": 7, "pts": 25,
         "ranged": [FRAG], "melee": [("Heavy axe", 3, "4+", "4/5", "Brutal")], "abilities": MUTANT_ABILITIES, "kw": "MUTANT"},
        {"id": "mutant_improvised", "name": "Mutant (improvised weapon)", "apl": 2, "move": '5"', "save": "5+", "wounds": 7, "pts": 25,
         "ranged": [FRAG], "melee": [("Improvised weapon", 4, "4+", "3/4", "Ceaseless")], "abilities": MUTANT_ABILITIES, "kw": "MUTANT"},
        vermin("cursemite", "Cursemite", '6"', [], [("Bloodsucking proboscis", 2, "4+", "2/3", "Rending, Feast")],
               ["Feast (weapon rule): Against a wounded operative, it gets +1 Atk and Lethal 5+."], "CURSEMITE"),
        vermin("eyestinger", "Eyestinger Swarm", '6"', [("Swarm", 5, "6+", "0/0", 'Range 6", Stun')], [("Sting", 5, "5+", "1/2", "Shock")], [], "EYESTINGER SWARM"),
        vermin("sludge_grub", "Sludge-grub", '4"', [("Acid spit", 4, "4+", "2/2", 'Range 6", 1" Devastating 1, Piercing 1')], [("Fanged maw", 2, "4+", "1/3", "-")],
               ["Caustic Demise: When it's incapacitated, roll a D6 for each enemy visible within 2\". On a 4+, that enemy takes 1 damage."], "SLUDGE-GRUB"),
    ],
}
