TAIL = ("Pincer tail", 4, "3+", "3/4", 'Range 3", Silent')
TALONS = ("Scything talons", 5, "3+", "4/5", "-")
TALONS_CLAWS = ("Scything talons & rending claws", 5, "3+", "4/5", "Rending")
POISON = "Poison (weapon rule): If any critical successes inflict damage, the target gains your Poison token (D3 damage each time it activates)."

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
            "Select 4 other operatives. You can take several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Tunnel", "At the end of Set Up Operatives, place Tunnel marker 0 on the floor wholly in your drop zone, touching your edge. As a STRATEGIC GAMBIT in each turning point, place the next numbered marker wholly within 5\" of the previous one. Your markers, and the areas between markers with consecutive numbers, form your tunnel."),
        ("Burrow", "Your first two operatives set up normally. The rest can start underground (set aside). Underground operatives activate and counteract as normal, but can only Burrow. Any still underground at the end of the battle are incapacitated."),
        ("Burrow action (1AP)", "If it's underground, set it up on your tunnel (it can be in enemy control range), with -2\" Move this activation. If it's on your tunnel, remove it, and it's underground. It can't do this while carrying a marker."),
        ("Predatory Instincts", "A Ravener can Fight twice in each activation. Raveners can counteract whatever their order. You can change its order first or instead of an action, and if it doesn't take a mission action it can make a free Burrow."),
    ],
    "ploys": {
        "strategy": [
            ("Death from Below", "When one fights, its weapons gain Balanced if it Burrowed this activation or counteraction, or Ceaseless if it's on your tunnel."),
            ("Tunnel Lurkers", "A Ravener on your tunnel is in cover (as if from Light terrain), unless it's within 2\" of the active operative."),
            ("Whipcord Emergence", "When one is shot, re-roll one defence die if it Burrowed this turning point. If it's on your tunnel, re-roll any dice showing one result of your choice instead."),
            ("Writhe Out of Sight", "One Ravener in the killzone makes a free Burrow. If it's within 2\" of your tunnel, it can make a free Fall Back or Reposition first."),
        ],
        "firefight": [
            ("Slithering Evasion", "This activation or counteraction, Fall Back costs it 1 less AP, and it can Charge while in enemy control range."),
            ("Death Frenzy", "When a Ravener is incapacitated, inflict D3 damage on each enemy in its control range (2D3 if it's a Venomspitter with Distend Dorsal Sac active)."),
            ("Subterranean Horror", "When an enemy Fights a Ravener on your tunnel, you resolve the first attack die."),
            ("Burrowing Strike", "When a Ravener Burrows, inflict D3+1 damage on each enemy in its control range, before it's removed or after it's set up. Not in the Strategy phase, or in the same activation as Toxic Lunge."),
        ],
    },
    "equipment": [
        {"id": "chromatospore", "name": "Chromatospore Camouflage", "desc": "When a Ravener is shot and retains cover saves, it can retain one extra. Not with Vantage terrain."},
        {"id": "heightened_senses", "name": "Heightened Senses", "desc": "Once per battle, after the initiative roll-off, if a Ravener is underground and an enemy is within 5\" of your tunnel, re-roll your dice."},
        {"id": "acid_blood", "name": "Acid Blood", "desc": "When one fights or retaliates, each time an attack die damages a Ravener, roll a D6. On a 5+, inflict 1 damage on the enemy."},
        {"id": "metamorphic_flesh", "name": "Metamorphic Flesh", "desc": "When a Ravener activates, it regains up to D3 wounds."},
    ],
    "operatives": [
        rv("prime", "Prime", [("Tail blade", 4, "3+", "3/4", 'Range 3", Rending, Silent')], [TALONS_CLAWS],
           ["Neuropredatory Crest: Enemies within 3\" of it pay 1 extra AP for Pick Up Marker and mission actions, can't re-roll attack or defence dice, and their total APL counts as 1 lower when contesting markers.",
            "Synaptic Link: STRATEGIC GAMBIT. Roll a D6 and compare it with the turning point number. If it's at least twice as high, gain 1CP. If it's lower, this operative takes damage equal to the roll."],
           "LEADER, PRIME", wounds=19),
        rv("felltalon", "Felltalon", [TAIL, ("Toxic glands", 4, "3+", "3/4", 'Range 6", Silent, Poison')], [("Toxic scythes", 5, "3+", "4/5", "Lethal 5+, Shock, Poison")],
           [POISON, "Toxic Lunge (1AP): Pick an enemy visible within 2\" (one in its control range, if there is one), or one on your tunnel if this operative is underground. Inflict D3+2 damage, and it gains your Poison token. It can do this while underground."],
           "FELLTALON"),
        rv("tremorscythe", "Tremorscythe", [TAIL], [TALONS_CLAWS],
           ["Subterranean Ambush: Once per turning point, when an enemy moves more than 2\" and ends within 2\" of your tunnel, if this operative is underground and ready (or hasn't counteracted), interrupt to activate or counteract with it. It must attack that enemy first (cancelled if it can't).",
            "Hypersensory Hunter: It can Charge with a Conceal order if it Burrowed this activation or counteraction."],
           "TREMORSCYTHE"),
        rv("venomspitter", "Venomspitter", [TAIL, ("Venom bolt (blast)", 4, "3+", "3/5", 'Range 8", Blast 2", Poison'), ("Venom bolt (focused)", 4, "3+", "4/5", 'Range 8", Piercing 1, Poison')], [TALONS],
           [POISON, "Distend Dorsal Sac (1AP): Until it shoots with its venom bolt, does this again or Burrows, the venom bolt gets +1 Atk and Lethal 5+, and loses Range 8\"."],
           "VENOMSPITTER"),
        rv("warrior", "Warrior", [TAIL], [TALONS],
           ["Instinctive Behaviour: When it attacks a wounded enemy, or one that Fell Back this turning point, its weapons gain Lethal 5+."], "WARRIOR"),
        rv("wrecker", "Wrecker", [("Bone mace", 4, "3+", "3/4", 'Range 3", Piercing 1, Silent')], [("Scything talons & crushing claws", 5, "3+", "4/5", "Crush")],
           ["Reinforced Carapace: Normal and Critical Dmg of 4 or more inflicts 1 less damage on it.",
            "Crush (weapon rule): For each strike, roll off (add 1 to your roll if the target has 9 or fewer Wounds). If you win, inflict extra damage equal to the difference (up to 3)."],
           "WRECKER", save="4+"),
    ],
}
