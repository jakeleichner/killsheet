BALEBLAST = ("Baleblast", 4, "3+", "3/4", "Soulstrike")
GLIMMER = ("Glimmersteel blade", 4, "3+", "4/5", "Lethal 5+")

def mk(oid, name, ranged, melee, abilities, kw, wounds=8):
    return {"id": oid, "name": "Mandrake " + name, "apl": 2, "move": '7"', "save": "5+", "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "mandrakes", "source": "mandrakes", "name": "Mandrakes", "badge": "DRUKHARI", "color": "#3E4A6B",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 9,
        "groups": [
            {"name": "Leader", "desc": "1 Nightfiend", "min": 1, "max": 1, "ids": ["nightfiend"]},
            {"name": "Operatives", "desc": "8 Mandrakes from the list below", "min": 8, "max": 8,
             "ids": ["abyssal", "chooser", "dirgemaw", "shadeweaver", "warrior"]},
        ],
        "repeatable": ["warrior"],
        "rules": [
            "Select 1 Nightfiend.",
            "Select 8 other operatives. Other than Warriors, each only once.",
        ],
    },
    "factionRules": [
        ("Within Shadow", "An operative is Within Shadow if it's within 1\" of Heavy terrain that isn't lower than it, any part of its base is under Vantage terrain, or a Shadow Portal marker is in its control range."),
        ("Shadow Passage", "Once per turning point, a Mandrake Within Shadow doing a Reposition can instead be removed and set up Within Shadow elsewhere: not in enemy control range, not a valid target for any enemy, and it can't Shoot or Fight until the next turning point."),
        ("Umbral Entities", "Shooting a Mandrake ignores Piercing. Within Shadow: Save +1."),
        ("Soulstrike", "Weapon rule. Defence dice equal to or below the target's APL are successes; higher are fails. A 1 is always a crit; a 6 is always a fail."),
    ],
    "ploys": {
        "strategy": [
            ("Creeping Horror", "After each enemy activation: one Concealed Mandrake can make a free Dash starting and ending Within Shadow (each once per turning point). Not in turning point 1."),
            ("Gloaming Shroud", "A Mandrake Within Shadow being shot: retain one defence die as a normal without rolling (plus any cover save)."),
            ("Blade in the Dark", "Mandrakes can Charge while Concealed if they start or end Within Shadow."),
            ("Inescapable Nightmare", "Shooting, fighting or retaliating Within Shadow: re-roll one attack die."),
        ],
        "firefight": [
            ("Slither Out of Sight", "End of any activation: a Mandrake on Engage and Within Shadow switches to Conceal."),
            ("Soul Feast", "Attacking an enemy within 6\", end of Resolve Attack Dice: regain wounds equal to the enemy's APL x damaging dice (not if incapacitated)."),
            ("Nowhere to Hide", "When it moves this activation: it can move through terrain (Charge still capped at its Move) and must end where it can be placed."),
            ("Shadow's Bite", "An enemy that Charged this activation fights a Mandrake Within Shadow: you resolve the first attack dice."),
        ],
    },
    "equipment": [
        {"id": "chain_snare", "name": "Chain Snare", "desc": "The only enemy in a Mandrake's control range tries to Fall Back: roll 2D6 (1D6 if it has more Wounds); any 4+ and it can't. Once per turning point."},
        {"id": "shadow_glyph", "name": "Shadow Glyph", "desc": "Once per turning point, a Mandrake activates Within Shadow: until its next activation, while Concealed and in cover it can't be targeted (except within 2\")."},
        {"id": "soul_gem", "name": "Soul Gem", "desc": "Once per turning point, shooting with a baleblast: Blast 1\" for that action."},
        {"id": "bone_darts", "name": "Bone Darts", "desc": "Once per turning point, a Mandrake can use a bone dart.", "gw": ("ranged", "Bone dart", 4, "3+", "2/4", 'Range 6", Rending, Silent')},
    ],
    "operatives": [
        mk("nightfiend", "Nightfiend", [BALEBLAST], [("Huskblade", 5, "3+", "4/6", "Lethal 5+, Shock")],
           ["Harrowing Whispers: Your opponent would activate an enemy within 6\": roll D6; if higher than its APL, they can't activate it this time (once per turning point between this and Haunting Focus; no effect if it's their only option).",
            "Oubliex: Becomes active when this is readied or kills with its huskblade. While active, an attack dice would damage it: D6, on 5+ ignore that damage and the oubliex deactivates."],
           "LEADER, NIGHTFIEND", wounds=9),
        mk("abyssal", "Abyssal", [("Balesurge (blast)", 5, "3+", "3/4", 'Blast 2", Soulstrike'), ("Balesurge (burn)", 5, "3+", "3/4", "Lethal 5+, Soulstrike")], [GLIMMER],
           ["Balefire: Mandrakes shooting an enemy with your Balefire token get +1 to both ranged Dmg stats and Saturate. Enemies shooting a Mandrake with your Balefire token get -1 to both Normal and Critical Dmg stats (min 1).",
            "Wreathe in Balefire (1AP): A visible operative without a Balefire token gains one until this one's next activation, dies or uses this again. Not within enemy control range."],
           "ABYSSAL"),
        mk("chooser", "Chooser of the Flesh", [BALEBLAST], [("Baleblade", 4, "3+", "5/6", "Brutal, Lethal 5+")],
           ["Part Collector: An enemy in its control range Falls Back: 2D3 damage before it moves.",
            "Soul Harvest: Kills by Part Collector or its baleblade earn 1 Soul Harvest point (2 if the enemy had APL 3+). When a Mandrake activates, spend 1 point: +1 APL for the battle, or regain up to 2D3 wounds (usable even if this is dead)."],
           "CHOOSER OF THE FLESH"),
        mk("dirgemaw", "Dirgemaw", [BALEBLAST, ("Horrifying scream", 5, "2+", "2/2", 'Range 6", Devastating 2, Seek Light, Stun, Soulstrike')], [GLIMMER],
           ["Haunting Focus: STRATEGIC GAMBIT: an enemy gains your Haunting Focus token until the next Ready step. When your opponent would next activate it, if this is ready you can activate this first; it must attack that enemy before any other (cancelled if it can't). Then they activate that enemy or another.",
            "Pareidolic Projection (1AP): An enemy that's a valid target or Within Shadow: Hit worsened by 1 and -2\" Move until this one's next activation, dies or uses this again. Not within control range of any other enemy."],
           "DIRGEMAW"),
        mk("shadeweaver", "Shadeweaver", [BALEBLAST], [GLIMMER],
           ["Shadow Portal: When it uses a Shadow Passage, place a Shadow Portal marker where it left and one where it arrives (replacing any). Each Mandrake can use a Shadow Passage each turning point between the two markers, on top of the normal once-per-turning-point use, even if this one is dead.",
            "Weave Darkness (1AP): Place your Weave Darkness marker visible (or on visible Vantage): it works like a smoke grenade but stays until this uses the action again or dies. Not within enemy control range."],
           "SHADEWEAVER"),
        mk("warrior", "Warrior", [BALEBLAST], [GLIMMER],
           ["Shadow Warrior: Within Shadow, its glimmersteel blade gets +1 Critical Dmg."], "WARRIOR"),
    ],
}
