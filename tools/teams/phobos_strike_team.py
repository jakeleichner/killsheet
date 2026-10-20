MARKSMAN = ("Marksman bolt carbine", 4, "3+", "3/4", "Lethal 5+")
OCCULUS = ("Occulus bolt carbine", 4, "3+", "3/4", "Saturate")
CARBINE = ("Bolt carbine", 4, "3+", "3/4", "Accurate 1")
SI_PISTOL = ("Special issue bolt pistol", 4, "3+", "3/4", 'Range 8", Piercing 1')
KNIFE = ("Combat knife", 5, "3+", "4/5", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
TACTICAL = "Tactical Advantage: Once/battle each: re-roll your initiative roll-off (if this is in the killzone); use a firefight ploy for 0CP on this operative (including Command Re-roll), or Patient Ambush for 0CP if this is ready and out of enemy control range."
VANGUARD = "Vanguard: Once/TP, one operative with this rule can Pick Up Marker or do a mission action for 1 less AP."
GRAV = "Grav-chute and Grapnel Launcher: Climbing up counts as 2\" vertical; ignore vertical distance when dropping."

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
            "Select 1 Sergeant: Infiltrator, Incursor, or Reiver (special issue bolt pistol + combat knife, or bolt carbine + fists).",
            "Select 5 other operatives. Other than Warriors, each only once.",
        ],
    },
    "factionRules": [
        ("Astartes", "Each activation, an operative can Shoot twice or Fight twice. If Shooting twice, one must use a bolt weapon (any ranged weapon with 'bolt' in its name). Operatives can counteract regardless of order."),
        ("Omni-scrambler", "STRATEGIC GAMBIT if a friendly Infiltrator is in the killzone: an enemy visible to a friendly Infiltrator, or within 6\" of the Voxbreaker, can't activate or act this Firefight phase until your opponent has activated as many operatives as you had Infiltrators in the killzone, or it's their last to activate."),
        ("Terror", "Enemies within 3\" of friendly Reivers pay +1AP for Pick Up Marker and mission actions, and count total APL 1 lower when contesting markers."),
        ("Multi-spectrum Array", "When a friendly Incursor shoots, enemies can't be obscured."),
    ],
    "ploys": {
        "strategy": [
            ("Guerrilla Warfare", "Operatives gain the Guerrilla Warfare action (1AP): change its order. Not within enemy control range."),
            ("Lethal Assaults", "Fighting: melee weapons gain Balanced; if it Charged this activation, Lethal 5+ too."),
            ("And They Shall Know No Fear", "Ignore stat changes from being injured (including weapons)."),
            ("Deadly Shots", "Shooting before any Charge, Fall Back or Reposition this activation, or vs an enemy not in cover more than 6\" away: ranged weapons gain Balanced."),
        ],
        "firefight": [
            ("Patient Ambush", "On your turn to activate: skip that activation."),
            ("Stealth Assault", "A Concealed operative activates, switches to Engage, Charges then Fights (no other actions first): after resolving your first attack dice, resolve another immediately."),
            ("Critical Shot", "Resolving a crit while shooting with a bolt weapon: D3 extra damage."),
            ("Transhuman Physiology", "Being shot, Roll Defence Dice step: retain one normal success as a crit."),
        ],
    },
    "equipment": [
        {"id": "purity_seals", "name": "Purity Seals", "desc": "Once/TP when shooting/fighting/retaliating with 2+ fails: discard one to retain another as a normal."},
        {"id": "special_issue_ammo", "name": "Special Issue Ammunition", "desc": "Once/TP shooting with a bolt carbine, marksman bolt carbine or occulus bolt carbine: Piercing 1 until end of TP."},
        {"id": "extra_grenades", "name": "Additional Utility Grenades", "desc": "Select four utility grenades (you can't also take the universal utility grenades)."},
        {"id": "combat_blades", "name": "Combat Blades", "desc": "Operatives gain a combat blade.", "gw": ("melee", "Combat blade", 5, "3+", "3/4", "-")},
    ],
    "operatives": [
        ph("infiltrator_sergeant", "Infiltrator Sergeant", [MARKSMAN], [FISTS], [TACTICAL], "LEADER, INFILTRATOR, SERGEANT", wounds=13),
        ph("incursor_sergeant", "Incursor Sergeant", [OCCULUS], [FISTS], [TACTICAL], "LEADER, INCURSOR, SERGEANT", wounds=13),
        ph("reiver_sergeant", "Reiver Sergeant", [CARBINE, SI_PISTOL], [KNIFE, FISTS],
           ["Loadout: special issue bolt pistol + combat knife, or bolt carbine + fists.", GRAV, TACTICAL], "LEADER, REIVER, SERGEANT", wounds=13),
        ph("commsman", "Infiltrator Commsman", [MARKSMAN], [FISTS],
           ["Strategic Oversight: Ready step, when you gain CP, if this is in the killzone and out of enemy control range: D6, on 4+ gain 1 extra CP.",
            "Comms Array: Once/TP during a friendly activation or counteraction, if this is in the killzone: swap one strategy ploy you used this TP for another (no CP)."],
           "INFILTRATOR, COMMSMAN"),
        ph("helix_adept", "Infiltrator Helix Adept", [MARKSMAN], [FISTS],
           ["Medic!: First time each TP another operative visible within 3\" would be incapacitated (neither in enemy control range, not if this is a target of that Shoot): it stays on D3 wounds, can't be incapacitated that action, then a free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
            "Helix Gauntlet (1AP): An operative in control range regains up to D3+3 wounds (not one saved by Medic! this TP). Not within enemy control range."],
           "MEDIC, INFILTRATOR, HELIX ADEPT"),
        ph("saboteur", "Infiltrator Saboteur", [MARKSMAN, ("Remote detonator", 4, "2+", "5/6", "Heavy (Dash only), Limited 1, Piercing 1, Silent, Detonate")], [FISTS],
           ["Plant Explosives: It carries your Explosives marker and can pick it up; after placing it, a free Dash.",
            "Detonate (weapon rule): No target; shoot every operative within 2\" of your Explosives marker (unless Heavy terrain is wholly in between); they can't be in cover or obscured. Needs the marker in the killzone; remove it afterwards. Lethal 5+ in close quarters killzones."],
           "INFILTRATOR, SABOTEUR"),
        ph("veteran", "Infiltrator Veteran", [("Custom bolt carbine", 4, "3+", "3/4", "Custom")], [FISTS],
           ["Custom (weapon rule): End of Select Operatives, give it up to two of: Balanced, Lethal 5+, Piercing Crits 1, Rending, Saturate."],
           "INFILTRATOR, VETERAN"),
        ph("voxbreaker", "Infiltrator Voxbreaker", [MARKSMAN], [FISTS],
           ["Voxbreaker: Your opponent can't re-roll attack or defence dice for enemies within 6\" of this.",
            "Auspex Scan (1AP): Until its next activation, operatives shooting enemies within 8\" of this: target can't be obscured; Incursors also gain Seek Light. Not within enemy control range."],
           "INFILTRATOR, VOXBREAKER"),
        ph("infiltrator_warrior", "Infiltrator Warrior", [MARKSMAN], [FISTS], [VANGUARD], "INFILTRATOR, WARRIOR"),
        ph("marksman", "Incursor Marksman", [("Stalker marksman bolt carbine", 4, "2+", "3/4", "Lethal 5+, Piercing 1")], [FISTS],
           ["Track Target: Can Guard in any killzone, even while Concealed (switch to Engage when it makes the free Shoot or Fight)."],
           "INCURSOR, MARKSMAN"),
        ph("minelayer", "Incursor Minelayer", [OCCULUS], [FISTS],
           ["Haywire Mine: It carries your Haywire Mine marker and can pick it up; it can't place it in enemy control range.",
            "Proximity Mine: First time the mine is in another operative's control range: remove it; that operative gets -1 APL until end of its next activation and takes 2D3+3 dmg; if it survives, its action ends. This operative never sets it off."],
           "INCURSOR, MINELAYER"),
        ph("incursor_warrior", "Incursor Warrior", [OCCULUS], [FISTS], [VANGUARD], "INCURSOR, WARRIOR"),
        ph("reiver_pistol", "Reiver Warrior (pistol & knife)", [SI_PISTOL], [KNIFE], [GRAV, VANGUARD], "REIVER, WARRIOR"),
        ph("reiver_carbine", "Reiver Warrior (bolt carbine)", [CARBINE], [FISTS], [GRAV, VANGUARD], "REIVER, WARRIOR"),
    ],
}
