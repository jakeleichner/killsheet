BURST = [("Burst cannon (focused)", 5, "4+", "3/4", "Ceaseless"), ("Burst cannon (sweeping)", 4, "4+", "3/4", 'Ceaseless, Torrent 1"')]
FUSION = [("Fusion blaster (short range)", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2'), ("Fusion blaster (long range)", 4, "4+", "4/5", 'Range 12", Piercing 1')]
FISTS = ("Fists", 3, "4+", "3/4", "-")
RAM = ("Ram", 3, "5+", "2/3", "-")
MARKERLIGHT = "Markerlight: Enemies that are valid targets for this, or visible to it within 2\" of your Ambush marker, are marked. XV26 operatives shooting a marked operative gain Severe."
DRONE = "Drone: Only Charge, Dash, Fall Back, Fight, Reposition and Shoot{x}; counts as APL 1 lower for objective control; own weapons only. Its head is the round disc on top. Ignored for kill/elimination ops and for escape/survive/incapacitate scoring."
GUNS = [("burst", "burst cannon", BURST), ("fusion", "fusion blaster", FUSION)]

ROLES = {
    "designator": ("Designator", [MARKERLIGHT, "Focused Markerlight (1AP): A visible enemy: once this turning point, an XV26 shooting it gets Hit +1 with its own ranged weapons for that action. Not within enemy control range."], []),
    "infiltrator": ("Infiltrator", ["Covert Protocols: Can counteract regardless of order; if Concealed, only Pick Up Marker, Place Marker or mission actions."], []),
    "liberator": ("Liberator", ["Grenadier: Can use frag, krak, smoke and stun grenades without using up equipment limits; frag/krak Hit +1."],
                  [("EMP bomb", 5, "3+", "2/2", 'Range 4", Blast 2", Devastating 1, Heavy (Reposition only), Lethal 4+, Limited 1, Saturate')]),
    "lodestar": ("Lodestar", ["Electrochaff Launcher: Once per turning point, when an enemy picks a Shoot target (not a Drone) and this isn't in enemy control range: for that action, XV26 visible within 3\" of this and more than 2\" from the shooter ignore Piercing and are obscured.",
                              "Homing Beacon: It carries your Homing Beacon marker (non-Drones can pick it up; if an enemy picks it up, it's discarded). Ready step: if it's placed in the killzone, roll D6 +1 per objective within 6\" of it; on 5+ gain 1CP."], []),
    "neutraliser": ("Neutraliser", ["Multispectrum Sensor Package: SUPPORT. Once per turning point, when an enemy within 8\" activates: each XV26 within 3\" of this can make a free Dash (not ending within 3\" of enemies) or change its order.",
                                    "System Jam (1AP, 2AP if Concealed): A visible enemy gets -1 APL until end of its next activation. Not within enemy control range."], []),
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
            "Select 1 Shas'vre: pulse pistol + burst cannon or fusion blaster.",
            "Select 1 MV75 Marker Drone and 1 MV15 Gun Drone.",
            "Select 4 other operatives, each with burst cannon or fusion blaster, + fists. Other than Infiltrators, each only once.",
            "Max 2 fusion blasters.",
        ],
    },
    "factionRules": [
        ("Stealth Fields", "While Concealed, an XV26 operative can't be visible to enemies more than 3\" away, and Fall Back costs it 1 less AP."),
        ("Kauyon", "Shooting an enemy within 3\" of your territory: Accurate 1. Within your territory: Accurate 2. Within 3\" of your drop zone: Accurate 3."),
    ],
    "ploys": {
        "strategy": [
            ("Prepare Ambush", "Place an Ambush marker wholly in your territory, more than 2\" from enemies. XV26 shooting an enemy within 2\" of it can gain Seek for the action; then the marker goes (or at the next Ready step)."),
            ("Holowave Countermeasures", "Shot from more than 6\" away: the attacker discards one normal success (or a crit if none). Not cumulative with obscured."),
            ("Patient Hunters", "Attacking an expended enemy: Balanced, and ranged Saturate."),
            ("Bonds of Unity", "A non-Drone activating visible within 6\" of another non-Drone: ignore its APL changes, and ignore injured Move or Hit changes this activation."),
        ],
        "firefight": [
            ("Engage Jet Pack", "A non-Drone activates or counteracts: ignore the vertical distance of one climb and one drop."),
            ("Saviour Protocols", "A non-Drone is picked as a Shoot target: a Drone visible within 3\" of it becomes the target instead. No effect against Blast or Torrent."),
            ("Vectored Retro-thrusters", "An enemy ends a Charge in a non-Drone's control range: it makes a free Fall Back of up to 3\" (can't be prevented); the enemy can then Reposition with its remaining move."),
            ("Ghostshroud", "End of an activation: an XV26 on Engage switches to Conceal. Each operative once per battle."),
        ],
    },
    "equipment": [
        {"id": "blacksun_filters", "name": "Advanced Blacksun Filters", "desc": "Shooting an obscured operative: you don't discard a success for it."},
        {"id": "target_locks", "name": "Hardwired Target Locks", "desc": "When you'd counteract: a Concealed XV26 more than 3\" from enemies can, switching to Engage, but it can only Shoot."},
        {"id": "multitrackers", "name": "XV26 Multitrackers", "desc": "Once per turning point shooting a burst cannon (sweeping): Torrent 2\", or Torrent 3\" with only one secondary target."},
        {"id": "counter_jammers", "name": "Counter-network Jammers", "desc": "STRATEGIC GAMBIT: pick an objective or mission marker; this turning point, enemies contesting it count total APL 1 lower if one is within 3\" of your XV26."},
    ],
    "operatives": [
        suit("shasvre_" + g[0], "Shas'vre (" + g[1] + ")", g[2] + [("Pulse pistol (ranged)", 4, "4+", "4/5", 'Range 8"')], [("Pulse pistol (point-blank)", 3, "4+", "4/5", "Accurate 1")],
             ["For the Greater Good: While this is in the killzone, Kauyon's Accurate is +1 (max 3) if 2+ non-Drone XV26 are incapacitated (needs at least Accurate 1).",
              "XV26 Drone Controller: STRATEGIC GAMBIT while in the killzone: one Drone ignores the first two points of its Drone rule until the end of its next activation."],
             "LEADER, SHAS'VRE", wounds=13) for g in GUNS
    ] + [
        drone("marker_drone", "MV75 Marker Drone", [], [MARKERLIGHT], "MV75 MARKER"),
        drone("gun_drone", "MV15 Gun Drone", [("Twin pulse carbine", 4, "4+", "4/5", "Ceaseless")],
              ["Photon Grenade Launcher (1AP): A visible enemy: on a D6 of 3+, -2\" Move until the end of its next activation. Not within enemy control range."], "MV15 GUN", extra=", Photon Grenade Launcher"),
    ] + [role(k, g) for k in ROLES for g in GUNS],
}
