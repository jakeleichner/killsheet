MARKSMAN = ("Marksman bolt carbine", 4, "3+", "3/4", "Lethal 5+")
OCCULUS = ("Occulus bolt carbine", 4, "3+", "3/4", "Saturate")
CARBINE = ("Bolt carbine", 4, "3+", "3/4", "Accurate 1")
SI_PISTOL = ("Special issue bolt pistol", 4, "3+", "3/4", 'Range 8", Piercing 1')
KNIFE = ("Combat knife", 5, "3+", "4/5", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
TACTICAL = "Tactical Advantage: Once per battle each: re-roll your initiative roll-off (if it's in the killzone); use a firefight ploy for 0CP on it (Command Re-roll included); or use Patient Ambush for 0CP if it's ready and outside enemy control range."
VANGUARD = "Vanguard: Once per turning point, one operative with this rule can Pick Up Marker or take a mission action for 1 less AP."
GRAV = "Grav-chute and Grapnel Launcher: Climbing counts as 2\" vertically, and it ignores vertical distance when dropping."

def ph(oid, name, ranged, melee, abilities, kw, wounds=12):
    return {"id": oid, "name": name, "apl": 3, "move": '7"', "save": "3+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "phobos", "source": "phobos_strike_team", "name": "Phobos Strike Team", "badge": "SPACE MARINES", "color": "#2E5E8C",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Leader", "desc": "1 Sergeant", "min": 1, "max": 1, "ids": ["infiltrator_sergeant", "incursor_sergeant", "reiver_sergeant"]},
            {"name": "Operatives", "desc": "5 Phobos Strike Team operatives from the list below", "min": 5, "max": 5,
             "ids": ["commsman", "helix_adept", "saboteur", "veteran", "voxbreaker", "infiltrator_warrior", "marksman", "minelayer", "incursor_warrior", "reiver_pistol", "reiver_carbine"]},
        ],
        "repeatable": ["infiltrator_warrior", "incursor_warrior", "reiver_pistol", "reiver_carbine"],
        "rules": [
            "Select 1 Sergeant: an Infiltrator, an Incursor, or a Reiver (with a special issue bolt pistol and combat knife, or a bolt carbine and fists).",
            "Select 5 other operatives. You can take several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, an operative can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt weapon (any ranged weapon with \"bolt\" in its name). These operatives can counteract whatever their order."),
        ("Omni-scrambler", "STRATEGIC GAMBIT, if a friendly Infiltrator is in the killzone. An enemy visible to a friendly Infiltrator, or within 6\" of the Voxbreaker, can't activate or act this Firefight phase until your opponent has activated as many operatives as you had Infiltrators in the killzone, or it's their last to activate."),
        ("Terror", "Enemies within 3\" of friendly Reivers pay 1 extra AP for Pick Up Marker and mission actions, and their total APL counts as 1 lower when contesting markers."),
        ("Multi-spectrum Array", "When a friendly Incursor shoots, enemies can't be obscured."),
    ],
    "ploys": {
        "strategy": [
            ("Guerrilla Warfare", "Operatives get the Guerrilla Warfare action (1AP): change its order. It can't do this within enemy control range."),
            ("Lethal Assaults", "When one fights, melee weapons gain Balanced, and also Lethal 5+ if it Charged this activation."),
            ("And They Shall Know No Fear", "Ignore stat changes from being injured, including weapon stats."),
            ("Deadly Shots", "When one shoots before any Charge, Fall Back or Reposition this activation, or shoots an enemy more than 6\" away that isn't in cover, ranged weapons gain Balanced."),
        ],
        "firefight": [
            ("Patient Ambush", "On your turn to activate, skip that activation."),
            ("Stealth Assault", "When an operative with a Conceal order activates, switches to Engage, Charges and then Fights (with no other actions first), after resolving your first attack die, resolve another straight away."),
            ("Critical Shot", "When it resolves a critical success while shooting with a bolt weapon, it deals D3 extra damage."),
            ("Transhuman Physiology", "When one is shot, in the Roll Defense Dice step, retain one normal success as a critical success."),
        ],
    },
    "equipment": [
        {"id": "purity_seals", "name": "Purity Seals", "desc": "Once per turning point when shooting, fighting or retaliating, if you fail two or more dice, discard one failure to retain another as a normal success."},
        {"id": "special_issue_ammo", "name": "Special Issue Ammunition", "desc": "Once per turning point, a bolt carbine, marksman bolt carbine or occulus bolt carbine gains Piercing 1 until the end of the turning point."},
        {"id": "extra_grenades", "name": "Additional Utility Grenades", "desc": "Select four utility grenades. You can't also take the universal utility grenades."},
        {"id": "combat_blades", "name": "Combat Blades", "desc": "Operatives get a combat blade.", "gw": ("melee", "Combat blade", 5, "3+", "3/4", "-")},
    ],
    "operatives": [
        ph("infiltrator_sergeant", "Infiltrator Sergeant", [MARKSMAN], [FISTS], [TACTICAL], "LEADER, INFILTRATOR, SERGEANT", wounds=13),
        ph("incursor_sergeant", "Incursor Sergeant", [OCCULUS], [FISTS], [TACTICAL], "LEADER, INCURSOR, SERGEANT", wounds=13),
        ph("reiver_sergeant", "Reiver Sergeant", [CARBINE, SI_PISTOL], [KNIFE, FISTS],
           ["Loadout: a special issue bolt pistol and combat knife, or a bolt carbine and fists.", GRAV, TACTICAL], "LEADER, REIVER, SERGEANT", wounds=13),
        ph("commsman", "Infiltrator Commsman", [MARKSMAN], [FISTS],
           ["Strategic Oversight: In the Ready step, when you gain CP, if it's in the killzone and outside enemy control range, roll a D6. On a 4+, gain 1 extra CP.",
            "Comms Array: Once per turning point, during a friendly activation or counteraction, if it's in the killzone, swap one strategy ploy you used this turning point for another, at no CP cost."],
           "INFILTRATOR, COMMSMAN"),
        ph("helix_adept", "Infiltrator Helix Adept", [MARKSMAN], [FISTS],
           ["Medic!: The first time each turning point another operative visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on D3 wounds and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
            "Helix Gauntlet (1AP): An operative in its control range regains up to D3+3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
           "MEDIC, INFILTRATOR, HELIX ADEPT"),
        ph("saboteur", "Infiltrator Saboteur", [MARKSMAN, ("Remote detonator", 4, "2+", "5/6", "Heavy (Dash only), Limited 1, Piercing 1, Silent, Detonate")], [FISTS],
           ["Plant Explosives: It carries your Explosives marker and can pick it up. After placing it, it gets a free Dash.",
            "Detonate (weapon rule): Don't pick a target. Shoot every operative within 2\" of your Explosives marker, unless Heavy terrain is wholly in between. They can't be in cover or obscured. The marker must be in the killzone, and you remove it afterwards. In close quarters killzones, it gains Lethal 5+."],
           "INFILTRATOR, SABOTEUR"),
        ph("veteran", "Infiltrator Veteran", [("Custom bolt carbine", 4, "3+", "3/4", "Custom")], [FISTS],
           ["Custom (weapon rule): At the end of Select Operatives, give it up to two of: Balanced, Lethal 5+, Piercing Crits 1, Rending, Saturate."],
           "INFILTRATOR, VETERAN"),
        ph("voxbreaker", "Infiltrator Voxbreaker", [MARKSMAN], [FISTS],
           ["Voxbreaker: Your opponent can't re-roll attack or defense dice for enemies within 6\" of it.",
            "Auspex Scan (1AP): Until its next activation, when operatives shoot enemies within 8\" of it, the target can't be obscured, and Incursors also gain Seek Light. It can't do this within enemy control range."],
           "INFILTRATOR, VOXBREAKER"),
        ph("infiltrator_warrior", "Infiltrator Warrior", [MARKSMAN], [FISTS], [VANGUARD], "INFILTRATOR, WARRIOR"),
        ph("marksman", "Incursor Marksman", [("Stalker marksman bolt carbine", 4, "2+", "3/4", "Lethal 5+, Piercing 1")], [FISTS],
           ["Track Target: It can Guard in any killzone, even with a Conceal order (it switches to Engage when it makes the free Shoot or Fight)."],
           "INCURSOR, MARKSMAN"),
        ph("minelayer", "Incursor Minelayer", [OCCULUS], [FISTS],
           ["Haywire Mine: It carries your Haywire Mine marker and can pick it up. It can't place it in enemy control range.",
            "Proximity Mine: The first time the mine is in another operative's control range, remove it. That operative gets -1 APL until the end of its next activation and takes 2D3+3 damage. If it survives, its action ends. This operative never sets it off."],
           "INCURSOR, MINELAYER"),
        ph("incursor_warrior", "Incursor Warrior", [OCCULUS], [FISTS], [VANGUARD], "INCURSOR, WARRIOR"),
        ph("reiver_pistol", "Reiver Warrior (pistol & knife)", [SI_PISTOL], [KNIFE], [GRAV, VANGUARD], "REIVER, WARRIOR"),
        ph("reiver_carbine", "Reiver Warrior (bolt carbine)", [CARBINE], [FISTS], [GRAV, VANGUARD], "REIVER, WARRIOR"),
    ],
}
