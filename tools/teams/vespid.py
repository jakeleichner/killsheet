CLAWS = ("Claws", 3, "4+", "3/4", "-")
NEUTRON_FRAGMENT = "Neutron Fragment (weapon rule): If the target survives but you resolved any attack dice, it gains a Neutron Fragment token. When it activates, it takes D3 damage for each token."

def vespid(oid, name, ranged, abilities, kw, save="5+", wounds=9):
    return {"id": oid, "name": "Vespid " + name, "apl": 2, "move": '6"', "save": save, "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": [CLAWS], "abilities": abilities, "kw": kw}

TEAM = {
    "id": "vespid", "source": "vespid_stingwings", "name": "Vespid Stingwings", "badge": "T'AU EMPIRE", "color": "#5FB8C8",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Strain Leader", "min": 1, "max": 1, "ids": ["strain_leader"]},
            {"name": "Oversight Drone", "desc": "1 Oversight Drone", "min": 1, "max": 1, "ids": ["oversight_drone"]},
            {"name": "Operatives", "desc": "9 Vespid operatives from the list below", "min": 9, "max": 9,
             "ids": ["longsting", "shadestrain", "skyblast", "swarmguard", "warrior"]},
        ],
        "repeatable": ["warrior"],
        "rules": [
            "Select 1 Strain Leader and 1 Oversight Drone.",
            "Select 9 other operatives. You can take several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Communion", "In the Ready step, gain D3 Communion points (1 more if the Oversight Drone is in the killzone). Vespids (not the Drone) must spend 1 to: shoot anything other than the closest enemy within 8\" (ignoring enemies in other Vespids' control range; with no enemy within 8\", any target costs a point; for Blast and Torrent only the first target counts); end a Charge anywhere other than the closest enemy's control range; or Pick Up Marker or take a mission action (not Operate Hatch). When shooting, spend 1 to re-roll one attack die."),
        ("Neutron Charge", "Weapons with \"neutron\" in their name gain Piercing 1 until the end of the turning point once the Vespid moves or uses Fly."),
        ("FLY", "When an action moves it, it can fly instead: set it up wholly within its Move (3\" for a Dash) horizontally, somewhere it can be placed, and not in enemy control range unless it's Charging. It gets no extra Charge distance. In close quarters killzones, it can't fly through walls or open hatchways."),
    ],
    "ploys": {
        "strategy": [
            ("Hardened Exoskeleton", "When one (not the Drone) fights or retaliates, Normal Dmg of 4 or more inflicts 1 less damage on it."),
            ("Aerial Agility", "When one is shot by an operative that's counteracting or interrupting, or that moved or was set up this activation, roll a D6 for each Normal Dmg die. On a 5+, ignore it (one per Shoot at most)."),
            ("Airborne Predators", "When one moves or uses Fly in its activation, its weapons gain Balanced for that activation."),
            ("Sting", "Claws improve their Hit by 1 and gain Lethal 5+ and Shock."),
        ],
        "firefight": [
            ("Ocelli", "When one shoots in an activation in which it used Fly, it gets the first two Vantage benefits, counting as 3\" higher (not for Communion distance)."),
            ("Darting Flight", "A Reposition goes D3\" further (or sets up D3\" further with Fly). It can't Shoot or Fight for the rest of the turning point."),
            ("Neutron Overload", "When it resolves a critical success with a neutron weapon after moving or using Fly, and the target is within 4\", it deals D3 extra damage."),
            ("Vicious Venom", "When one (not the Drone) fights and strikes with a critical success, it deals D3 extra damage."),
        ],
    },
    "equipment": [
        {"id": "neurostimulant", "name": "Neurostimulant", "desc": "When you gain Communion points, roll two D3 and pick one."},
        {"id": "convergence", "name": "Convergence Stimulant", "desc": "Once per turning point, a Vespid can Pick Up Marker or take a mission action without spending a Communion point."},
        {"id": "accelerant", "name": "Accelerant Stimulant", "desc": "A Charge or Dash (not by the Drone) goes 1\" further (or sets up 1\" further with Fly).", "ex": ["oversight_drone"]},
        {"id": "aggression", "name": "Aggression Stimulant", "desc": "When one (not the Drone) fights, melee weapons gain Ceaseless.", "ex": ["oversight_drone"]},
    ],
    "operatives": [
        vespid("strain_leader", "Strain Leader", [("Neutron blaster", 4, "3+", "3/3", "Devastating 2")],
               ["Communion Helm: Once per activation, spend 1 Communion point for free, or spend 1 to let a Vespid within 3\" make a free 1AP mission action. That Vespid still pays its own Communion point, and Convergence Stimulant can't waive it.",
                "Commune: When selecting operatives, pick a Vespid strategy ploy. It costs 0CP while this operative is in the killzone and outside enemy control range."],
               "STRAIN, LEADER", wounds=10),
        {"id": "oversight_drone", "name": "Oversight Drone", "apl": 2, "move": '8"', "save": "2+", "wounds": 5, "pts": 25,
         "ranged": [], "melee": [("Ram", 3, "5+", "1/2", "-")],
         "abilities": ["Evasive Drone: It can only take Aerial Guidance, Charge, Dash, Fall Back, Fight and Reposition. Its APL counts as 1 lower for objective control. Its head is the round disc on top. While it has a Conceal order and is in cover, enemies more than 2\" away can't target it. It ignores Piercing when shot.",
                       "Aerial Guidance (1AP): SUPPORT. Until its next activation, other Vespids within 6\" gain Lethal 5+ and Saturate when shooting an enemy visible to it (not while it's in enemy control range). It can't do this within enemy control range."],
         "kw": "OVERSIGHT, DRONE"},
        vespid("longsting", "Longsting", [("Neutron rail rifle (standard)", 4, "4+", "4/4", "Devastating 2, Neutron Fragment"), ("Neutron rail rifle (aimed)", 4, "3+", "4/4", "Devastating 2, Heavy (Dash only), Lethal 5+, Neutron Fragment")],
               [NEUTRON_FRAGMENT], "LONGSTING"),
        vespid("shadestrain", "Shadestrain", [("Neutron sting", 4, "4+", "3/3", 'Range 8", Devastating 2'), ("Neutron grenade", 4, "4+", "3/3", 'Range 6", Blast 2", Devastating 2, Limited 1, Saturate')],
               ["Ghost Rig: While it has a Conceal order, enemies can only pick it as a valid target from within 6\". This has no effect when it's a secondary target.",
                "Camouflaged: When it's shot as the picked target, ignore Piercing, and retain all cover saves as critical successes."],
               "SHADESTRAIN", save="3+"),
        vespid("skyblast", "Skyblast", [("Neutron grenade launcher", 4, "4+", "3/3", 'Blast 2", Devastating 2, Neutron Bombardment')],
               ["Neutron Bombardment (weapon rule): Place a Neutron Fallout marker in the primary target's control range.",
                "Neutron Fallout: Once per enemy activation, when an enemy is within 2\" of a Fallout marker, it takes D3 damage. More markers don't add more damage."],
               "SKYBLAST"),
        vespid("swarmguard", "Swarmguard", [("Flamer (standard)", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"'), ("Flamer (skytorch)", 4, "2+", "3/3", 'Saturate, Torrent 0", Skytorch')],
               ["Skytorch (weapon rule): Only during Skytorch Assault. Don't pick a target. Shoot every operative in the torch zone (the area between its old and new position, not wholly under Vantage terrain), furthest first. None of them can be in cover or obscured.",
                "Skytorch Assault (2AP): Make a free Reposition using Fly with 2\" extra, then a free Shoot with the skytorch profile. It can't do this with a Conceal order or within enemy control range."],
               "SWARMGUARD"),
        vespid("warrior", "Warrior", [("Neutron blaster", 4, "4+", "3/3", "Devastating 2")],
               ["Warrior Instincts: When it shoots without spending Communion points in that sequence, its neutron blaster gains Accurate 1."],
               "WARRIOR"),
    ],
}
