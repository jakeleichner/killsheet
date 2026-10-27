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
            "Select 8 other operatives. You can take several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Within Shadow", "An operative is Within Shadow if it's within 1\" of Heavy terrain that isn't lower than it, if any part of its base is under Vantage terrain, or if a Shadow Portal marker is in its control range."),
        ("Shadow Passage", "Once per turning point, a Mandrake Within Shadow taking a Reposition can instead be removed and set up Within Shadow somewhere else. It can't be in enemy control range or be a valid target for any enemy, and it can't Shoot or Fight until the next turning point."),
        ("Umbral Entities", "Enemies shooting a Mandrake ignore Piercing. Within Shadow, its Save improves by 1."),
        ("Soulstrike", "Weapon rule. Defense dice equal to or below the target's APL are successes, and higher results are fails. A 1 is always a critical success, and a 6 is always a fail."),
    ],
    "ploys": {
        "strategy": [
            ("Creeping Horror", "After each enemy activation, one Mandrake with a Conceal order can make a free Dash that starts and ends Within Shadow (each Mandrake once per turning point). You can't use this in the first turning point."),
            ("Gloaming Shroud", "When a Mandrake Within Shadow is shot, retain one defense die as a normal success without rolling it. This is on top of any cover save."),
            ("Blade in the Dark", "Mandrakes can Charge with a Conceal order if they start or end Within Shadow."),
            ("Inescapable Nightmare", "When one shoots, fights or retaliates Within Shadow, re-roll one attack die."),
        ],
        "firefight": [
            ("Slither Out of Sight", "At the end of any activation, a Mandrake with an Engage order that's Within Shadow switches to Conceal."),
            ("Soul Feast", "When one attacks an enemy within 6\", at the end of the Resolve Attack Dice step, it regains wounds equal to the enemy's APL times the dice that inflicted damage (not if it's incapacitated)."),
            ("Nowhere to Hide", "When it moves this activation, it can move through terrain (a Charge still can't go past its Move), and must end where it can be placed."),
            ("Shadow's Bite", "When an enemy that Charged this activation fights a Mandrake Within Shadow, you resolve the first attack die."),
        ],
    },
    "equipment": [
        {"id": "chain_snare", "name": "Chain Snare", "desc": "Once per turning point, when the only enemy in a Mandrake's control range tries to Fall Back, roll 2D6 (1D6 if the enemy has more Wounds). On any 4+, it can't."},
        {"id": "shadow_glyph", "name": "Shadow Glyph", "desc": "Once per turning point, when a Mandrake activates Within Shadow, until its next activation, while it has a Conceal order and is in cover, enemies more than 2\" away can't target it."},
        {"id": "soul_gem", "name": "Soul Gem", "desc": "Once per turning point, a baleblast gains Blast 1\" for that Shoot."},
        {"id": "bone_darts", "name": "Bone Darts", "desc": "Once per turning point, a Mandrake can use a bone dart.", "gw": ("ranged", "Bone dart", 4, "3+", "2/4", 'Range 6", Rending, Silent')},
    ],
    "operatives": [
        mk("nightfiend", "Nightfiend", [BALEBLAST], [("Huskblade", 5, "3+", "4/6", "Lethal 5+, Shock")],
           ["Harrowing Whispers: When your opponent would activate an enemy within 6\", roll a D6. If it beats that enemy's APL, they can't activate it this time. Once per turning point, shared with Haunting Focus, and no effect if it's their only option.",
            "Oubliex: It becomes active when this operative is readied or kills an enemy with its huskblade. While it's active and an attack die would damage this operative, roll a D6. On a 5+, ignore that damage and the oubliex stops being active."],
           "LEADER, NIGHTFIEND", wounds=9),
        mk("abyssal", "Abyssal", [("Balesurge (blast)", 5, "3+", "3/4", 'Blast 2", Soulstrike'), ("Balesurge (burn)", 5, "3+", "3/4", "Lethal 5+, Soulstrike")], [GLIMMER],
           ["Balefire: Mandrakes shooting an enemy with your Balefire token get +1 Normal and Critical Dmg on ranged weapons, and Saturate. Enemies shooting a Mandrake with your Balefire token get -1 Normal and Critical Dmg (to a minimum of 1).",
            "Wreathe in Balefire (1AP): A visible operative without a Balefire token gains one until this operative's next activation, until it dies, or until it uses this again. It can't do this within enemy control range."],
           "ABYSSAL"),
        mk("chooser", "Chooser of the Flesh", [BALEBLAST], [("Baleblade", 4, "3+", "5/6", "Brutal, Lethal 5+")],
           ["Part Collector: When an enemy in its control range Falls Back, inflict 2D3 damage on it before it moves.",
            "Soul Harvest: Kills by Part Collector or its baleblade earn 1 Soul Harvest point (2 if the enemy had APL 3 or more). When a Mandrake activates, spend 1 point for +1 APL for the battle, or to regain up to 2D3 wounds. You can spend points even if this operative is dead."],
           "CHOOSER OF THE FLESH"),
        mk("dirgemaw", "Dirgemaw", [BALEBLAST, ("Horrifying scream", 5, "2+", "2/2", 'Range 6", Devastating 2, Seek Light, Stun, Soulstrike')], [GLIMMER],
           ["Haunting Focus: STRATEGIC GAMBIT. An enemy gains your Haunting Focus token until the next Ready step. When your opponent would next activate it, if this operative is ready you can activate it first, and it must attack that enemy before any other (canceled if it can't). Then your opponent activates that enemy or another.",
            "Pareidolic Projection (1AP): Pick an enemy that's a valid target or Within Shadow. It gets a worse Hit by 1 and -2\" Move until this operative's next activation, until it dies, or until it uses this again. It can't do this within control range of any other enemy."],
           "DIRGEMAW"),
        mk("shadeweaver", "Shadeweaver", [BALEBLAST], [GLIMMER],
           ["Shadow Portal: When it uses Shadow Passage, place a Shadow Portal marker where it left and one where it arrives (replacing any already out). Each Mandrake can use Shadow Passage once each turning point between the two markers, on top of the normal use, even if this operative is dead.",
            "Weave Darkness (1AP): Place your Weave Darkness marker somewhere visible (or on visible Vantage terrain). It works like a smoke grenade but stays until this operative uses the action again or dies. It can't do this within enemy control range."],
           "SHADEWEAVER"),
        mk("warrior", "Warrior", [BALEBLAST], [GLIMMER],
           ["Shadow Warrior: While it's Within Shadow, its glimmersteel blade gets +1 Critical Dmg."], "WARRIOR"),
    ],
}
