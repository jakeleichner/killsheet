CARBINE = ("Pulse carbine", 4, "4+", "4/5", "-")
GUN_BUTT = ("Gun butt", 3, "5+", "2/3", "-")
RAM = ("Ram", 3, "5+", "2/3", "-")
MARKERLIGHT = "Markerlight (1AP): See the Markerlights faction rule."
DRONE_LOOK = "Marker control APL -1. Its head (for visibility) is the round disc on top."

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
            "Select 11 other operatives. Other than Shas'la and Weapons Experts, each only once.",
            "Max 2 Weapons Experts (ion rifle or rail rifle).",
            "The MB3 Recon Drone counts as two selections.",
            "Pulse weapons: burst cannon, pulse carbine, suppressed pulse carbine, twin pulse carbine.",
        ],
    },
    "factionRules": [
        ("Markerlights", "Markerlight (1AP): a visible enemy gains a Markerlight token (max 4). Not within enemy control range; if it also Shoots that activation (not MB3), both must pick the same target. An enemy loses one token once per activation when it Dashes, Charges, Falls Back or Repositions. Pathfinders shooting it (datacard weapons, not fusion grenade) gain, cumulatively: 1 Saturate + Balanced; 2 Hit +1 (max 3+); 3 can't be obscured; 4 Seek Light; 5 Seek."),
    ],
    "ploys": {
        "strategy": [
            ("Recon Sweep", "Pick a killzone edge (not yours): Pathfinders wholly within 6\" of it make a free Dash, ending wholly within 6\" of a non-home edge. Not in the first turning point."),
            ("Suppressing Fire", "An enemy shooting a target that isn't the closest valid one can't re-roll attack dice (ignore Concealed/obscured Pathfinders)."),
            ("Bonded", "Non-Drone shooting or retaliating with a ranged weapon within 3\" of another non-Drone: Accurate 1."),
            ("Take Cover", "Shot while retaining cover saves: Save improves by 1."),
        ],
        "firefight": [
            ("A Worthy Cause", "Start of Firefight phase: one non-Drone makes a free mission action."),
            ("Supporting Fire", "Selecting a target within 6\": friendlies in its control range don't stop you targeting it."),
            ("Saviour Protocols", "Non-Drone targeted by a Shoot: a Drone visible within 3\" becomes the target instead (cover/obscured only if the original was). Not against Blast/Torrent."),
            ("Point-Blank Fusillade", "Non-Drone retaliating (wasn't in enemy control range at start): use a ranged weapon (not a grenade) in melee; no blocking; Devastating, Piercing and Torrent ignored. Ready + Engage + pulse weapon: resolve the first attack dice."),
        ],
    },
    "equipment": [
        {"id": "target_optic", "name": "Target Analysis Optic", "desc": "Once per turning point, non-Drone shooting a target with 1+ Markerlight tokens: counts one more (primary target only for Blast/Torrent)."},
        {"id": "hi_markerlight", "name": "High-intensity Markerlight", "desc": "Up to 2x/turning point (not the MV7): Markerlight gives two tokens."},
        {"id": "photon_grenade", "name": "Photon Grenade", "desc": "Once per turning point, a non-Drone with Markerlight: Photon Grenade (1AP) on a visible enemy, D6 3+: -2\" Move until end of its next activation. Not within enemy control range."},
        {"id": "orbital_uplink", "name": "Orbital Survey Uplink", "desc": "Once per turning point, Markerlight can target any enemy in the killzone (no visibility needed). Not with High-intensity or Analyse."},
    ],
    "operatives": [
        fw("shasui", "Shas'ui Pathfinder", [("Pulse carbine", 4, "3+", "4/5", "-")], [("Gun butt", 3, "4+", "2/3", "-")],
           ["Art of War: STRATEGIC GAMBIT (in killzone), each once per battle, until end of turning point: Mont'ka (Pathfinders +1\" Move) or Kauyon (Concealed Pathfinders get a free Markerlight in their activation).", MARKERLIGHT],
           "LEADER, SHAS'UI", wounds=8),
        fw("assault_grenadier", "Assault Grenadier", [("Fusion grenade", 4, "3+", "4/3", 'Range 6", Devastating 2, Limited 1, Piercing 2, Saturate'), CARBINE], [GUN_BUTT],
           ["Grenadier Specialist: Can use frag and krak grenades without using up equipment limits; Hit +1 with them.", MARKERLIGHT],
           "ASSAULT GRENADIER"),
        fw("blooded", "Blooded Pathfinder", [("Suppressed pulse carbine", 4, "3+", "4/5", "Silent")], [("Bionic arm", 3, "4+", "3/4", "-")],
           ["Veteran: In a turning point the Shas'ui used Art of War, this operative can use the other option (Mont'ka/Kauyon) during its activation.", MARKERLIGHT],
           "BLOODED", wounds=8),
        fw("comms", "Comms Specialist", [CARBINE], [("Fists", 3, "5+", "2/3", "-")],
           [MARKERLIGHT, "Signal (1AP): SUPPORT. Another Pathfinder visible within 6\": +1 APL until end of its next activation. Not within enemy control range."],
           "COMMS SPECIALIST"),
        fw("drone_controller", "Drone Controller", [CARBINE], [GUN_BUTT],
           ["Drone Controller: While in killzone, Drones +2\" Move and Saviour Protocols costs 0CP.", MARKERLIGHT,
            "Remote Pilot (1AP): A Drone makes a free action (max 2\" move), even one its Drone rule forbids. Repeatable (different action per Drone). Not within enemy control range."],
           "DRONE CONTROLLER"),
        fw("marksman", "Marksman", [("Marksman rail rifle (standard)", 4, "3+", "4/4", "Devastating 2, Lethal 5+, Piercing 1"), ("Marksman rail rifle (dart round)", 4, "3+", "3/4", "Piercing 1, Silent")], [GUN_BUTT],
           ["Inertial Dampener: Ignore changes to its rail rifle's Hit stat."],
           "MARKSMAN"),
        fw("medic", "Medical Technician", [CARBINE], [GUN_BUTT],
           ["Medic!: First time each turning point another non-Drone Pathfinder visible within 3\" would be incapacitated (neither in enemy control range): stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
            MARKERLIGHT, "Medikit (1AP): Non-Drone in control range regains up to 2D3 wounds (not one saved by Medic! this turning point). Not within enemy control range."],
           "MEDIC, MEDICAL TECHNICIAN"),
        fw("shasla", "Shas'la Pathfinder", [CARBINE], [GUN_BUTT],
           ["Group Activation: When expended, activate another ready Shas'la next (max two in a row).",
            "Fearless on the Frontline: Can Markerlight within enemy control range; Fall Back costs 1 less AP.", MARKERLIGHT],
           "SHAS'LA"),
        fw("transpectral", "Transpectral Interference", [CARBINE], [GUN_BUTT],
           [MARKERLIGHT, "System Jam (1AP): Visible enemy -1 APL until end of its next activation. Not on Conceal or within enemy control range.",
            "Multi-Dimensional Vision: When it shoots, enemies can't be obscured."],
           "TRANSPECTRAL INTERFERENCE"),
        fw("we_ion", "Weapons Expert (ion rifle)", [("Ion rifle (standard)", 5, "4+", "4/5", "Piercing Crits 1"), ("Ion rifle (overcharge)", 5, "4+", "4/5", "Hot, Lethal 5+, Piercing 1")], [GUN_BUTT], [], "WEAPONS EXPERT"),
        fw("we_rail", "Weapons Expert (rail rifle)", [("Rail rifle", 4, "4+", "4/4", "Devastating 2, Lethal 5+, Piercing 1")], [GUN_BUTT], [], "WEAPONS EXPERT"),
        drone("mb3_recon", "MB3 Recon Drone", "Charge, Dash, Fall Back, Fight, Markerlight, Reposition, Shoot",
              [("Burst cannon (focused)", 5, "4+", "3/4", "Ceaseless, Heavy (Reposition only), Punishing"), ("Burst cannon (sweeping)", 4, "4+", "3/4", 'Ceaseless, Heavy (Reposition only), Punishing, Torrent 1"')],
              ["Analyse: When it Markerlights, other enemies visible to it within 3\" of the target also gain a token.", MARKERLIGHT],
              "MB3 RECON", apl=3, wounds=12),
        drone("mv31_accelerator", "MV31 Pulse Accelerator Drone", "Charge, Dash, Fall Back, Fight, Pulse Accelerator, Reposition", [],
              ["Pulse Accelerator (1AP): Until its next activation, other Pathfinders shooting a pulse weapon within 3\" of it gain Lethal 5+ and Severe."],
              "MV31 PULSE ACCELERATOR"),
        drone("mv33_grav", "MV33 Grav-inhibitor Drone", "Charge, Dash, Fall Back, Fight, Reposition", [],
              ["Grav-inhibitor: Enemies moving (not Dash) visible within 6\" of it: +2\" to the distance, but ignore Obstructing/Accessible extra distance. Enemies fighting/retaliating visible within 6\": melee Hit worsened by 1."],
              "MV33 GRAV-INHIBITOR"),
        drone("mv1_gun", "MV1 Gun Drone", "Charge, Dash, Fall Back, Fight, Reposition, Shoot", [("Twin pulse carbine", 4, "4+", "4/5", "Ceaseless")], [], "MV1 GUN"),
        drone("mv4_shield", "MV4 Shield Drone", "Charge, Dash, Fall Back, Fight, Reposition", [],
              ["Shield Generator: Ignores Piercing. Once per turning point, ignore Normal Dmg from one attack dice. Saviour Protocols costs 0CP when this is the Drone."],
              "MV4 SHIELD"),
        drone("mv7_marker", "MV7 Marker Drone", "Charge, Dash, Fall Back, Fight, Markerlight, Reposition", [],
              ["High-intensity Markerlight: Its Markerlight gives two tokens.", MARKERLIGHT],
              "MV7 MARKER"),
    ],
}
