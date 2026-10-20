CLAWS = ("Claws", 3, "4+", "3/4", "-")
NEUTRON_FRAGMENT = "Neutron Fragment (weapon rule): If the target survives but you resolved any attack dice, it gains a Neutron Fragment token. On activation, D3 dmg per token."

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
            "Select 9 other operatives. Other than Warriors, each only once.",
        ],
    },
    "factionRules": [
        ("Communion", "Ready step: gain D3 Communion points (+1 with the Oversight Drone in the killzone). Vespids (not the Drone) must spend 1 to: shoot anything but the closest enemy within 8\" (excluding enemies in other Vespids' control range); end a Charge anywhere but the closest enemy's control range; do Pick Up Marker or a mission action (not Operate Hatch). Shooting: spend 1 to re-roll one attack die."),
        ("Neutron Charge", "Weapons with 'neutron' in the name gain Piercing 1 until end of TP once the Vespid moves or uses FLY."),
        ("FLY", "When an action moves it, it can instead be set up wholly within its Move (Dash: 3\") horizontally, in a legal spot; not in enemy control range unless Charging (no extra Charge distance). In close quarters killzones, not through walls or open hatchways."),
    ],
    "ploys": {
        "strategy": [
            ("Hardened Exoskeleton", "Fighting/retaliating (not the Drone): Normal Dmg of 4+ inflicts 1 less."),
            ("Aerial Agility", "Shot by an operative that's counteracting, interrupting, or moved/was set up this activation: Normal Dmg dice, D6 5+ to ignore (max one per Shoot)."),
            ("Airborne Predators", "Moving or using FLY in its activation: weapons gain Balanced for that activation."),
            ("Sting", "Claws: Hit +1, gain Lethal 5+ and Shock."),
        ],
        "firefight": [
            ("Ocelli", "Shooting in an activation it used FLY: gets the first two Vantage benefits, counting as 3\" higher (not for Communion distance)."),
            ("Darting Flight", "Reposition: +D3\" (or set up D3\" further with FLY); no Shoot or Fight for the rest of the TP."),
            ("Neutron Overload", "Resolving a crit with a neutron weapon after moving/FLY, target within 4\": +D3 dmg."),
            ("Vicious Venom", "Fighting (not the Drone) and striking with a crit: +D3 dmg."),
        ],
    },
    "equipment": [
        {"id": "neurostimulant", "name": "Neurostimulant", "desc": "When gaining Communion points, roll two D3 and pick one."},
        {"id": "convergence", "name": "Convergence Stimulant", "desc": "Once/TP, a Vespid does Pick Up Marker or a mission action without spending a Communion point."},
        {"id": "accelerant", "name": "Accelerant Stimulant", "desc": "Charge or Dash (not the Drone): +1\" (or set up 1\" further with FLY).", "ex": ["oversight_drone"]},
        {"id": "aggression", "name": "Aggression Stimulant", "desc": "Fighting (not the Drone): melee weapons gain Ceaseless.", "ex": ["oversight_drone"]},
    ],
    "operatives": [
        vespid("strain_leader", "Strain Leader", [("Neutron blaster", 4, "3+", "3/3", "Devastating 2")],
               ["Communion Helm: Once per activation: spend 1 Communion point for free, or spend 1 to let a Vespid within 3\" make a free 1AP mission action (still paying its Communion point; Convergence Stimulant can't waive it).",
                "Commune: When selecting operatives, pick a Vespid strategy ploy: it costs 0CP while this is in the killzone and not in enemy control range."],
               "STRAIN, LEADER", wounds=10),
        {"id": "oversight_drone", "name": "Oversight Drone", "apl": 2, "move": '8"', "save": "2+", "wounds": 5, "pts": 25,
         "ranged": [], "melee": [("Ram", 3, "5+", "1/2", "-")],
         "abilities": ["Evasive Drone: Only Aerial Guidance, Charge, Dash, Fall Back, Fight, Reposition. Objective control APL -1. Head = round disc on top. On Conceal and in cover: can't be targeted (except within 2\"). Ignores Piercing when shot.",
                       "Aerial Guidance (1AP): SUPPORT. Until its next activation, other Vespids within 6\" shooting an enemy visible to it gain Lethal 5+ and Saturate (not while it's in enemy control range). Not within enemy control range."],
         "kw": "OVERSIGHT, DRONE"},
        vespid("longsting", "Longsting", [("Neutron rail rifle (standard)", 4, "4+", "4/4", "Devastating 2, Neutron Fragment"), ("Neutron rail rifle (aimed)", 4, "3+", "4/4", "Devastating 2, Heavy (Dash only), Lethal 5+, Neutron Fragment")],
               [NEUTRON_FRAGMENT], "LONGSTING"),
        vespid("shadestrain", "Shadestrain", [("Neutron sting", 4, "4+", "3/3", 'Range 8", Devastating 2'), ("Neutron grenade", 4, "4+", "3/3", 'Range 6", Blast 2", Devastating 2, Limited 1, Saturate')],
               ["Ghost Rig: On Conceal, can only be selected as a valid target from within 6\" (no effect as a secondary target).",
                "Camouflaged: When shot (as the selected target), ignore Piercing and all cover saves are retained as crits."],
               "SHADESTRAIN", save="3+"),
        vespid("skyblast", "Skyblast", [("Neutron grenade launcher", 4, "4+", "3/3", 'Blast 2", Devastating 2, Neutron Bombardment')],
               ["Neutron Bombardment (weapon rule): Place a Neutron Fallout marker in the primary target's control range.",
                "Neutron Fallout: Once per enemy activation, when it's within 2\" of a Fallout marker: D3 dmg (not cumulative)."],
               "SKYBLAST"),
        vespid("swarmguard", "Swarmguard", [("Flamer (standard)", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"'), ("Flamer (skytorch)", 4, "2+", "3/3", 'Saturate, Torrent 0", Skytorch')],
               ["Skytorch (weapon rule): Only during Skytorch Assault. No target selection: shoot every operative in the torch zone (area between its old and new position, not wholly under Vantage), none in cover/obscured, furthest first.",
                "Skytorch Assault (2AP): Free Reposition using FLY with +2\", then a free Shoot with the skytorch profile. Not on Conceal or within enemy control range."],
               "SWARMGUARD"),
        vespid("warrior", "Warrior", [("Neutron blaster", 4, "4+", "3/3", "Devastating 2")],
               ["Warrior Instincts: Shooting without spending Communion points in that sequence: neutron blaster gains Accurate 1."],
               "WARRIOR"),
    ],
}
