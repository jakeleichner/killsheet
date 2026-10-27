CARBINE = ("Pulse carbine", 4, "4+", "4/5", "-")
GUN_BUTT = ("Gun butt", 3, "5+", "2/3", "-")
RAM = ("Ram", 3, "5+", "2/3", "-")
MARKERLIGHT = "Markerlight (1AP): See the Markerlights faction rule."
DRONE_LOOK = "Its APL counts as 1 lower for objective marker control. Its head, for visibility, is the round disc on top."

def drone(oid, name, actions, ranged, abilities, kw, apl=2, wounds=7):
    return {"id": oid, "name": name, "apl": apl, "move": '6"', "save": "4+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": [RAM],
            "abilities": [f"Drone: Only {actions}; own weapons only. {DRONE_LOOK}"] + abilities, "kw": kw + ", DRONE"}

def fw(oid, name, ranged, melee, abilities, kw, wounds=7):
    return {"id": oid, "name": name, "apl": 2, "move": '6"', "save": "5+", "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "pathfinders", "source": "pathfinders", "name": "Pathfinders", "badge": "T'AU EMPIRE", "color": "#C7A26B",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 12,
        "groups": [
            {"name": "Leader", "desc": "1 Shas'ui", "min": 1, "max": 1, "ids": ["shasui"]},
            {"name": "Operatives", "desc": "11 Pathfinder operatives from the list below", "min": 11, "max": 11,
             "ids": ["assault_grenadier", "blooded", "comms", "drone_controller", "marksman", "medic", "shasla", "transpectral", "we_ion", "we_rail",
                     "mb3_recon", "mv31_accelerator", "mv33_grav", "mv1_gun", "mv4_shield", "mv7_marker"]},
        ],
        "repeatable": ["shasla", "we_ion", "we_rail"],
        "cost": {"mb3_recon": 2},
        "caps": [{"ids": ["we_ion", "we_rail"], "max": 2, "label": "Max 2 Weapons Experts"}],
        "rules": [
            "Select 1 Shas'ui.",
            "Select 11 other operatives. You can take several Shas'la and Weapons Experts, but every other operative only once.",
            "Up to 2 Weapons Experts (ion rifle or rail rifle).",
            "The MB3 Recon Drone counts as two selections.",
            "Pulse weapons: burst cannon, pulse carbine, suppressed pulse carbine, twin pulse carbine.",
        ],
    },
    "factionRules": [
        ("Markerlights", "Markerlight (1AP): a visible enemy gains a Markerlight token (up to 4). It can't do this within enemy control range, and if it also Shoots that activation (not the MB3), both must pick the same target. An enemy loses one token once per activation when it Dashes, Charges, Falls Back or Repositions. Pathfinders shooting it with datacard weapons (not fusion grenades) get these bonuses, adding up as tokens go up. 1: Saturate and Balanced. 2: improve Hit by 1 (to a maximum of 3+). 3: it can't be obscured. 4: Seek Light. 5: Seek."),
    ],
    "ploys": {
        "strategy": [
            ("Recon Sweep", "Pick a killzone edge that isn't yours. Pathfinders wholly within 6\" of it make a free Dash, ending wholly within 6\" of an edge that isn't your home edge. You can't use this in the first turning point."),
            ("Suppressing Fire", "An enemy shooting a target that isn't the closest valid one can't re-roll attack dice. Ignore Pathfinders that have a Conceal order or are obscured when working out the closest."),
            ("Bonded", "When a non-Drone shoots or retaliates with a ranged weapon within 3\" of another non-Drone, the weapon gains Accurate 1."),
            ("Take Cover", "When one is shot and retains cover saves, its Save improves by 1."),
        ],
        "firefight": [
            ("A Worthy Cause", "At the start of the Firefight phase, one non-Drone makes a free mission action."),
            ("Supporting Fire", "When picking a target within 6\", friendly operatives in its control range don't stop you targeting it."),
            ("Savior Protocols", "When a non-Drone is picked as the target of a Shoot, a Drone visible within 3\" of it becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."),
            ("Point-Blank Fusillade", "When a non-Drone retaliates (and wasn't in enemy control range at the start of the activation), it can use a ranged weapon (not a grenade) in melee. It can't block, and Devastating, Piercing and Torrent are ignored. If it's ready, has an Engage order and uses a pulse weapon, it resolves the first attack die."),
        ],
    },
    "equipment": [
        {"id": "target_optic", "name": "Target Analysis Optic", "desc": "Once per turning point, when a non-Drone shoots a target with any Markerlight tokens, the target counts as having one more (only the primary target for Blast or Torrent)."},
        {"id": "hi_markerlight", "name": "High-intensity Markerlight", "desc": "Up to twice per turning point (not the MV7), Markerlight gives two tokens."},
        {"id": "photon_grenade", "name": "Photon Grenade", "desc": "Once per turning point, a non-Drone with Markerlight can take Photon Grenade (1AP) on a visible enemy. On a D6 roll of 3+, the enemy gets -2\" Move until the end of its next activation. It can't do this within enemy control range."},
        {"id": "orbital_uplink", "name": "Orbital Survey Uplink", "desc": "Once per turning point, Markerlight can target any enemy in the killzone, with no need to see it. Not with High-intensity Markerlight or Analyze."},
    ],
    "operatives": [
        fw("shasui", "Shas'ui Pathfinder", [("Pulse carbine", 4, "3+", "4/5", "-")], [("Gun butt", 3, "4+", "2/3", "-")],
           ["Art of War: STRATEGIC GAMBIT, while it's in the killzone. Each option once per battle, until the end of the turning point. Mont'ka: Pathfinders get +1\" Move. Kauyon: Pathfinders with a Conceal order get a free Markerlight in their activation.", MARKERLIGHT],
           "LEADER, SHAS'UI", wounds=8),
        fw("assault_grenadier", "Assault Grenadier", [("Fusion grenade", 4, "3+", "4/3", 'Range 6", Devastating 2, Limited 1, Piercing 2, Saturate'), CARBINE], [GUN_BUTT],
           ["Grenadier Specialist: It can use frag and krak grenades without using up equipment, and gets +1 to Hit with them.", MARKERLIGHT],
           "ASSAULT GRENADIER"),
        fw("blooded", "Blooded Pathfinder", [("Suppressed pulse carbine", 4, "3+", "4/5", "Silent")], [("Bionic arm", 3, "4+", "3/4", "-")],
           ["Veteran: In a turning point in which the Shas'ui used Art of War, this operative can use the other option (Mont'ka or Kauyon) during its activation.", MARKERLIGHT],
           "BLOODED", wounds=8),
        fw("comms", "Comms Specialist", [CARBINE], [("Fists", 3, "5+", "2/3", "-")],
           [MARKERLIGHT, "Signal (1AP): SUPPORT. Another Pathfinder visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
           "COMMS SPECIALIST"),
        fw("drone_controller", "Drone Controller", [CARBINE], [GUN_BUTT],
           ["Drone Controller: While it's in the killzone, Drones get +2\" Move and Savior Protocols costs 0CP.", MARKERLIGHT,
            "Remote Pilot (1AP): A Drone makes a free action, moving no more than 2\", even one its Drone rule forbids. It can repeat this with a different action for each Drone, but not within enemy control range."],
           "DRONE CONTROLLER"),
        fw("marksman", "Marksman", [("Marksman rail rifle (standard)", 4, "3+", "4/4", "Devastating 2, Lethal 5+, Piercing 1"), ("Marksman rail rifle (dart round)", 4, "3+", "3/4", "Piercing 1, Silent")], [GUN_BUTT],
           ["Inertial Dampener: It ignores changes to its rail rifle's Hit."],
           "MARKSMAN"),
        fw("medic", "Medical Technician", [CARBINE], [GUN_BUTT],
           ["Medic!: The first time each turning point another non-Drone Pathfinder visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
            MARKERLIGHT, "Medikit (1AP): A non-Drone in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
           "MEDIC, MEDICAL TECHNICIAN"),
        fw("shasla", "Shas'la Pathfinder", [CARBINE], [GUN_BUTT],
           ["Group Activation: When it's expended, activate another ready Shas'la next (no more than two in a row).",
            "Fearless on the Frontline: It can Markerlight within enemy control range, and Fall Back costs it 1 less AP.", MARKERLIGHT],
           "SHAS'LA"),
        fw("transpectral", "Transpectral Interference", [CARBINE], [GUN_BUTT],
           [MARKERLIGHT, "System Jam (1AP): A visible enemy gets -1 APL until the end of its next activation. It can't do this with a Conceal order or within enemy control range.",
            "Multi-Dimensional Vision: When it shoots, enemies can't be obscured."],
           "TRANSPECTRAL INTERFERENCE"),
        fw("we_ion", "Weapons Expert (ion rifle)", [("Ion rifle (standard)", 5, "4+", "4/5", "Piercing Crits 1"), ("Ion rifle (overcharge)", 5, "4+", "4/5", "Hot, Lethal 5+, Piercing 1")], [GUN_BUTT], [], "WEAPONS EXPERT"),
        fw("we_rail", "Weapons Expert (rail rifle)", [("Rail rifle", 4, "4+", "4/4", "Devastating 2, Lethal 5+, Piercing 1")], [GUN_BUTT], [], "WEAPONS EXPERT"),
        drone("mb3_recon", "MB3 Recon Drone", "Charge, Dash, Fall Back, Fight, Markerlight, Reposition, Shoot",
              [("Burst cannon (focused)", 5, "4+", "3/4", "Ceaseless, Heavy (Reposition only), Punishing"), ("Burst cannon (sweeping)", 4, "4+", "3/4", 'Ceaseless, Heavy (Reposition only), Punishing, Torrent 1"')],
              ["Analyze: When it uses Markerlight, other enemies visible to it within 3\" of the target also gain a token.", MARKERLIGHT],
              "MB3 RECON", apl=3, wounds=12),
        drone("mv31_accelerator", "MV31 Pulse Accelerator Drone", "Charge, Dash, Fall Back, Fight, Pulse Accelerator, Reposition", [],
              ["Pulse Accelerator (1AP): Until its next activation, other Pathfinders within 3\" of it gain Lethal 5+ and Severe when shooting a pulse weapon."],
              "MV31 PULSE ACCELERATOR"),
        drone("mv33_grav", "MV33 Grav-inhibitor Drone", "Charge, Dash, Fall Back, Fight, Reposition", [],
              ["Grav-inhibitor: Enemies visible within 6\" of it add 2\" to the distance when they move (not Dash), but ignore extra distance from Obstructing and Accessible terrain. Enemies visible within 6\" get a worse Hit by 1 on melee weapons when they fight or retaliate."],
              "MV33 GRAV-INHIBITOR"),
        drone("mv1_gun", "MV1 Gun Drone", "Charge, Dash, Fall Back, Fight, Reposition, Shoot", [("Twin pulse carbine", 4, "4+", "4/5", "Ceaseless")], [], "MV1 GUN"),
        drone("mv4_shield", "MV4 Shield Drone", "Charge, Dash, Fall Back, Fight, Reposition", [],
              ["Shield Generator: It ignores Piercing. Once per turning point, ignore the Normal Dmg from one attack die. Savior Protocols costs 0CP when this is the Drone."],
              "MV4 SHIELD"),
        drone("mv7_marker", "MV7 Marker Drone", "Charge, Dash, Fall Back, Fight, Markerlight, Reposition", [],
              ["High-intensity Markerlight: Its Markerlight gives two tokens.", MARKERLIGHT],
              "MV7 MARKER"),
    ],
}
