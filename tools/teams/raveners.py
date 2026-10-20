TAIL = ("Pincer tail", 4, "3+", "3/4", 'Range 3", Silent')
TALONS = ("Scything talons", 5, "3+", "4/5", "-")
TALONS_CLAWS = ("Scything talons & rending claws", 5, "3+", "4/5", "Rending")
POISON = "Poison (weapon rule): If any crits inflict damage, the target gains your Poison token (D3 dmg each time it activates)."

def rv(oid, name, ranged, melee, abilities, kw, save="5+", wounds=18):
    return {"id": oid, "name": "Ravener " + name, "apl": 3, "move": '7"', "save": save, "wounds": wounds, "pts": 40,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "raveners", "source": "raveners", "name": "Raveners", "badge": "TYRANIDS", "color": "#6B3A7A",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 5,
        "groups": [
            {"name": "Leader", "desc": "1 Prime", "min": 1, "max": 1, "ids": ["prime"]},
            {"name": "Operatives", "desc": "4 Raveners from the list below", "min": 4, "max": 4,
             "ids": ["felltalon", "tremorscythe", "venomspitter", "warrior", "wrecker"]},
        ],
        "repeatable": ["warrior"],
        "rules": [
            "Select 1 Prime.",
            "Select 4 other operatives. Other than Warriors, each only once.",
        ],
    },
    "factionRules": [
        ("Tunnel", "End of Set Up Operatives: place Tunnel marker 0 on the floor wholly in your drop zone, touching your edge. STRATEGIC GAMBIT in TPs 1 to 4: place the next numbered marker wholly within 5\" of the previous one. Your markers and the areas between consecutive numbers form your TUNNEL."),
        ("Burrow", "Your first two operatives set up normally; the rest can start underground (set aside). Underground operatives activate and counteract normally but can only Burrow. Any still underground at battle end are incapacitated."),
        ("Burrow action (1AP)", "Underground: set it up on your TUNNEL (can be in enemy control range); -2\" Move this activation. Or, if on your TUNNEL: remove it, it's underground. Not while carrying a marker."),
        ("Predatory Instincts", "Each activation, a Ravener can Fight twice. Raveners counteract regardless of order: you can change its order first or instead of an action, and if it doesn't do a mission action it can make a free Burrow."),
    ],
    "ploys": {
        "strategy": [
            ("Death from Below", "Fighting: Balanced if it Burrowed this activation/counteraction; Ceaseless if on your TUNNEL."),
            ("Tunnel Lurkers", "A Ravener on your TUNNEL is in cover (as Light terrain) unless within 2\" of the active operative."),
            ("Whipcord Emergence", "Being shot: re-roll one defence die if it Burrowed this TP; if on your TUNNEL, re-roll any results of one value."),
            ("Writhe Out of Sight", "One Ravener in the killzone makes a free Burrow; if within 2\" of your TUNNEL, a free Fall Back or Reposition first."),
        ],
        "firefight": [
            ("Slithering Evasion", "This activation/counteraction: Fall Back costs 1 less AP, and it can Charge while in enemy control range."),
            ("Death Frenzy", "A Ravener is incapacitated: D3 dmg to each enemy in its control range (2D3 if a Venomspitter with Distend Dorsal Sac active)."),
            ("Subterranean Horror", "An enemy Fights a Ravener on your TUNNEL: you resolve the first attack dice."),
            ("Burrowing Strike", "A Ravener Burrows: before removal or after setting up, D3+1 dmg to each enemy in its control range. Not in the Strategy phase, or with Toxic Lunge in the same activation."),
        ],
    },
    "equipment": [
        {"id": "chromatospore", "name": "Chromatospore Camouflage", "desc": "A Ravener being shot: if retaining cover saves, retain one extra (not with Vantage)."},
        {"id": "heightened_senses", "name": "Heightened Senses", "desc": "Once/battle after the initiative roll-off, if a Ravener is underground and an enemy is within 5\" of your TUNNEL: re-roll your dice."},
        {"id": "acid_blood", "name": "Acid Blood", "desc": "Fighting/retaliating, each time an attack dice damages a Ravener: D6, on 5+ 1 dmg to the enemy."},
        {"id": "metamorphic_flesh", "name": "Metamorphic Flesh", "desc": "When a Ravener activates: regain up to D3 wounds."},
    ],
    "operatives": [
        rv("prime", "Prime", [("Tail blade", 4, "3+", "3/4", 'Range 3", Rending, Silent')], [TALONS_CLAWS],
           ["Neuropredatory Crest: Enemies within 3\" of this pay +1AP for Pick Up and mission actions, can't re-roll attack or defence dice, and count total APL 1 lower when contesting markers.",
            "Synaptic Link: STRATEGIC GAMBIT: roll D6 vs the TP number. Twice as high or more: gain 1CP. Less: this takes damage equal to the roll."],
           "LEADER, PRIME", wounds=19),
        rv("felltalon", "Felltalon", [TAIL, ("Toxic glands", 4, "3+", "3/4", 'Range 6", Silent, Poison')], [("Toxic scythes", 5, "3+", "4/5", "Lethal 5+, Shock, Poison")],
           [POISON, "Toxic Lunge (1AP): An enemy visible within 2\" (one in its control range if any), or on your TUNNEL if this is underground: D3+2 dmg and your Poison token. Usable underground."],
           "FELLTALON"),
        rv("tremorscythe", "Tremorscythe", [TAIL], [TALONS_CLAWS],
           ["Subterranean Ambush: Once/TP, an enemy moves more than 2\" and ends within 2\" of your TUNNEL: if this is underground and ready (or hasn't counteracted), interrupt to activate/counteract it; it must attack that enemy first (cancelled if it can't).",
            "Hypersensory Hunter: Can Charge while Concealed if it Burrowed this activation/counteraction."],
           "TREMORSCYTHE"),
        rv("venomspitter", "Venomspitter", [TAIL, ("Venom bolt (blast)", 4, "3+", "3/5", 'Range 8", Blast 2", Poison'), ("Venom bolt (focused)", 4, "3+", "4/5", 'Range 8", Piercing 1, Poison')], [TALONS],
           [POISON, "Distend Dorsal Sac (1AP): Until it shoots with its venom bolt, does this again or Burrows: venom bolt gets +1 Atk, Lethal 5+, and loses Range 8\"."],
           "VENOMSPITTER"),
        rv("warrior", "Warrior", [TAIL], [TALONS],
           ["Instinctive Behaviour: Attacking a wounded enemy, or one that Fell Back this TP: weapons gain Lethal 5+."], "WARRIOR"),
        rv("wrecker", "Wrecker", [("Bone mace", 4, "3+", "3/4", 'Range 3", Piercing 1, Silent')], [("Scything talons & crushing claws", 5, "3+", "4/5", "Crush")],
           ["Reinforced Carapace: Normal and Crit Dmg of 4+ inflicts 1 less on it.",
            "Crush (weapon rule): Each strike, roll off (+1 to you if the target has Wounds 9 or less); if you win, extra damage equal to the difference (max 3)."],
           "WRECKER", save="4+"),
    ],
}
