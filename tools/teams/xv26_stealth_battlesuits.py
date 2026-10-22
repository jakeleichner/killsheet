BURST = [("Burst cannon (focused)", 5, "4+", "3/4", "Ceaseless"), ("Burst cannon (sweeping)", 4, "4+", "3/4", 'Ceaseless, Torrent 1"')]
FUSION = [("Fusion blaster (short range)", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2'), ("Fusion blaster (long range)", 4, "4+", "4/5", 'Range 12", Piercing 1')]
FISTS = ("Fists", 3, "4+", "3/4", "-")
RAM = ("Ram", 3, "5+", "2/3", "-")
MARKERLIGHT = "Markerlight: Enemies that are valid targets for it, or that it can see within 2\" of your Ambush marker, are marked. XV26 operatives shooting a marked operative gain Severe."
DRONE = "Drone: It can only Charge, Dash, Fall Back, Fight, Reposition{x} and Shoot, and only with its own weapons. Its APL counts as 1 lower for objective control. Its head is the round disc on top. It doesn't count for kill or elimination ops, or for escape, survive and incapacitate scoring."
GUNS = [("burst", "burst cannon", BURST), ("fusion", "fusion blaster", FUSION)]

ROLES = {
    "designator": ("Designator", [MARKERLIGHT, "Focused Markerlight (1AP): Pick a visible enemy. Once this turning point, an XV26 shooting it improves the Hit of its own ranged weapons by 1 for that action. It can't do this within enemy control range."], []),
    "infiltrator": ("Infiltrator", ["Covert Protocols: It can counteract whatever its order. With a Conceal order, it can only Pick Up Marker, Place Marker or take mission actions."], []),
    "liberator": ("Liberator", ["Grenadier: It can use frag, krak, smoke and stun grenades without using up equipment, and gets +1 to Hit with frag and krak grenades."],
                  [("EMP bomb", 5, "3+", "2/2", 'Range 4", Blast 2", Devastating 1, Heavy (Reposition only), Lethal 4+, Limited 1, Saturate')]),
    "lodestar": ("Lodestar", ["Electrochaff Launcher: Once per turning point, when an enemy picks a Shoot target (not a Drone) and this operative isn't in enemy control range, XV26 visible within 3\" of it and more than 2\" from the shooter ignore Piercing and are obscured for that action.",
                              "Homing Beacon: It carries your Homing Beacon marker. Non-Drones can pick it up, and if an enemy picks it up, it's discarded. In the Ready step, if it's placed in the killzone, roll a D6, adding 1 for each objective within 6\" of it. On a 5+, gain 1CP."], []),
    "neutraliser": ("Neutraliser", ["Multispectrum Sensor Package: SUPPORT. Once per turning point, when an enemy within 8\" activates, each XV26 within 3\" of this operative can make a free Dash (not ending within 3\" of enemies) or change its order.",
                                    "System Jam (1AP, or 2AP with a Conceal order): A visible enemy gets -1 APL until the end of its next activation. It can't do this within enemy control range."], []),
}

def suit(oid, name, ranged, melee, abilities, kw, wounds=12):
    return {"id": oid, "name": "XV26 " + name, "apl": 3, "move": '6"', "save": "3+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def role(key, gun):
    label, abil, extra = ROLES[key]
    suffix, text, weap = gun
    return suit(key + "_" + suffix, label + " (" + text + ")", weap + extra, [FISTS], abil, label.upper())

def drone(oid, name, ranged, abilities, kw, extra=""):
    return {"id": oid, "name": name, "apl": 2, "move": '6"', "save": "4+", "wounds": 7, "pts": 28,
            "ranged": ranged, "melee": [RAM], "abilities": [DRONE.replace("{x}", extra)] + abilities, "kw": kw + ", DRONE"}

ROLE_IDS = [k + "_" + g[0] for k in ROLES for g in GUNS]

TEAM = {
    "id": "xv26", "source": "xv26_stealth_battlesuits", "name": "XV26 Stealth Battlesuits", "badge": "T'AU EMPIRE", "color": "#3A6B8C",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 7,
        "groups": [
            {"name": "Leader", "desc": "1 Shas'vre", "min": 1, "max": 1, "ids": ["shasvre_burst", "shasvre_fusion"]},
            {"name": "Drones", "desc": "1 MV75 Marker Drone and 1 MV15 Gun Drone", "min": 2, "max": 2, "ids": ["marker_drone", "gun_drone"]},
            {"name": "Operatives", "desc": "4 Stealth Battlesuits from the list below", "min": 4, "max": 4, "ids": ROLE_IDS},
        ],
        "repeatable": ["infiltrator_burst", "infiltrator_fusion"],
        "caps": [{"ids": [k + "_" + g[0] for g in GUNS], "max": 1, "label": "Only 1 " + ROLES[k][0]} for k in ROLES if k != "infiltrator"] + [
            {"ids": ["shasvre_fusion"] + [i for i in ROLE_IDS if i.endswith("fusion")], "max": 2, "label": "Max 2 fusion blasters"},
        ],
        "rules": [
            "Select 1 Shas'vre, armed with a pulse pistol plus a burst cannon or fusion blaster.",
            "Select 1 MV75 Marker Drone and 1 MV15 Gun Drone.",
            "Select 4 other operatives, each with a burst cannon or fusion blaster, plus fists. You can take several Infiltrators, but every other operative only once.",
            "Up to 2 fusion blasters.",
        ],
    },
    "factionRules": [
        ("Stealth Fields", "While an XV26 has a Conceal order, enemies more than 3\" away can't see it, and Fall Back costs it 1 less AP."),
        ("Kauyon", "When shooting an enemy within 3\" of your territory, weapons gain Accurate 1. Within your territory, Accurate 2. Within 3\" of your drop zone, Accurate 3."),
    ],
    "ploys": {
        "strategy": [
            ("Prepare Ambush", "Place an Ambush marker wholly in your territory, more than 2\" from enemies. When an XV26 shoots an enemy within 2\" of it, the weapon can gain Seek for that action. Then remove the marker (or remove it at the next Ready step)."),
            ("Holowave Countermeasures", "When one is shot from more than 6\" away, the attacker discards one normal success (or a critical success if they have none). This doesn't stack with obscured."),
            ("Patient Hunters", "When shooting or fighting an expended enemy (not retaliating), weapons gain Balanced, and ranged weapons also gain Saturate."),
            ("Bonds of Unity", "When a non-Drone activates visible within 6\" of another non-Drone, ignore its APL changes, and pick one for this activation: ignore Move changes or weapon Hit changes from being injured."),
        ],
        "firefight": [
            ("Engage Jet Pack", "When a non-Drone activates or counteracts, ignore the vertical distance of one climb and one drop."),
            ("Saviour Protocols", "When a non-Drone is picked as the target of a Shoot, a Drone visible within 3\" of it becomes the target instead. No effect against Blast or Torrent."),
            ("Vectored Retro-thrusters", "When an enemy ends a Charge in a non-Drone's control range, the non-Drone makes a free Fall Back of up to 3\", which can't be prevented. The enemy can then Reposition with its remaining move."),
            ("Ghostshroud", "At the end of an activation, an XV26 with an Engage order switches to Conceal. Each operative once per battle."),
        ],
    },
    "equipment": [
        {"id": "blacksun_filters", "name": "Advanced Blacksun Filters", "desc": "When shooting an obscured operative, you don't discard a success for it being obscured."},
        {"id": "target_locks", "name": "Hardwired Target Locks", "desc": "When you'd counteract, an XV26 with a Conceal order more than 3\" from enemies can do so, switching to Engage, but it can only Shoot."},
        {"id": "multitrackers", "name": "XV26 Multitrackers", "desc": "Once per turning point, a burst cannon (sweeping) gains Torrent 2\", or Torrent 3\" with only one secondary target, for that Shoot."},
        {"id": "counter_jammers", "name": "Counter-network Jammers", "desc": "STRATEGIC GAMBIT: pick an objective or mission marker. This turning point, enemies contesting it count their total APL as 1 lower if one of them is within 3\" of your XV26."},
    ],
    "operatives": [
        suit("shasvre_" + g[0], "Shas'vre (" + g[1] + ")", g[2] + [("Pulse pistol (ranged)", 4, "4+", "4/5", 'Range 8"')], [("Pulse pistol (point-blank)", 3, "4+", "4/5", "Accurate 1")],
             ["For the Greater Good: While it's in the killzone, if two or more non-Drone XV26 are incapacitated, Kauyon's Accurate goes up by 1 (to a maximum of 3, and only where you already have at least Accurate 1).",
              "XV26 Drone Controller: STRATEGIC GAMBIT, while it's in the killzone. One Drone ignores the first two points of its Drone rule until the end of its next activation."],
             "LEADER, SHAS'VRE", wounds=13) for g in GUNS
    ] + [
        drone("marker_drone", "MV75 Marker Drone", [], [MARKERLIGHT], "MV75 MARKER"),
        drone("gun_drone", "MV15 Gun Drone", [("Twin pulse carbine", 4, "4+", "4/5", "Ceaseless")],
              ["Photon Grenade Launcher (1AP): Pick a visible enemy. On a D6 roll of 3+, it gets -2\" Move until the end of its next activation. It can't do this within enemy control range."], "MV15 GUN", extra=", Photon Grenade Launcher"),
    ] + [role(k, g) for k in ROLES for g in GUNS],
}
