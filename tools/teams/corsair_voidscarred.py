PISTOL = ("Shuriken pistol", 4, "3+", "3/4", 'Range 8", Rending')
RIFLE = ("Shuriken rifle", 4, "3+", "3/4", "Rending")
FISTS = ("Fists", 3, "3+", "2/3", "-")
POWER = ("Power weapon", 4, "3+", "4/6", "Lethal 5+")
CANNON = [("Shuriken cannon (focused)", 5, "3+", "4/5", "Heavy (Dash only), Rending"), ("Shuriken cannon (sweeping)", 4, "3+", "4/5", 'Heavy (Dash only), Rending, Torrent 1"')]

def vs(oid, name, ranged, melee, abilities, kw, wounds=8):
    return {"id": oid, "name": "Voidscarred " + name, "apl": 2, "move": '7"', "save": "4+", "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

PROWLING = ["Prowling Raiders: Capricious Flight and Light Fingers cost 0CP for a Warrior."]

TEAM = {
    "id": "voidscarred", "source": "corsair_voidscarred", "name": "Corsair Voidscarred", "badge": "AELDARI", "color": "#3E8FB0",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 9,
        "groups": [
            {"name": "Leader", "desc": "1 Felarch", "min": 1, "max": 1, "ids": ["felarch"]},
            {"name": "Operatives", "desc": "8 Voidscarred operatives from the list below", "min": 8, "max": 8,
             "ids": ["fate_dealer", "gunner_blaster", "gunner_shredder", "heavy_cannon", "heavy_wraith", "kurnathi", "kurnite_hunter", "shade_runner",
                     "soul_weaver", "starstorm", "warrior_blade", "warrior_rifle", "way_seeker"]},
        ],
        "repeatable": ["warrior_blade", "warrior_rifle"],
        "caps": [
            {"ids": ["gunner_blaster", "gunner_shredder"], "max": 1, "label": "Only 1 Gunner"},
            {"ids": ["heavy_cannon", "heavy_wraith"], "max": 1, "label": "Only 1 Heavy Gunner"},
            {"ids": ["gunner_blaster", "heavy_wraith"], "max": 1, "label": "Can't take both a blaster and a wraithcannon"},
        ],
        "rules": [
            "Select 1 Felarch: shuriken rifle + shuriken pistol + power weapon, or neuro disruptor + power weapon.",
            "Select 8 other operatives. Other than Warriors, each only once.",
            "You can't take both a blaster and a wraithcannon.",
        ],
    },
    "factionRules": [
        ("Aeldari Raiders", "Each Voidscarred can make a free Dash during its activation."),
        ("Rifles", "Shooting a shuriken rifle or ranger long rifle in an activation without Charge, Fall Back or Reposition (so far): Accurate 1."),
    ],
    "ploys": {
        "strategy": [
            ("Piratical Profiteers", "Attacking when either side contests an objective or your mission marker: weapons gain Balanced."),
            ("Mobile Engagement", "Shot after moving this turning point: re-roll one defence die."),
            ("Plunderers", "Up to D3 Voidscarred make a free Dash (no Dash in their activations this turning point). Not in the first turning point."),
            ("Outcasts", "More than 5\" from other friendlies: weapons gain Punishing."),
        ],
        "firefight": [
            ("Light Fingers", "This activation, enemies in its control range don't stop Pick Up Marker or mission actions."),
            ("Capricious Flight", "This activation, Fall Back costs 1 less AP."),
            ("Opportunistic Fighters", "An enemy Falls Back: before it moves, 2D3 damage to it for each Voidscarred in its control range."),
            ("Contemptuous Adventurer", "The first Voidscarred activated this turning point, if more than 5\" from friendlies: its first Shoot or Fight gains Relentless."),
        ],
    },
    "equipment": [
        {"id": "mistfield", "name": "Mistfield", "desc": "Once per turning point, shot from more than 3\": attacker's Piercing worsened by 1."},
        {"id": "runes_guidance", "name": "Runes of Guidance", "desc": "Once per turning point, a Way Seeker or Soul Weaver PSYCHIC action (not Warp Fold) gets +3\" range."},
        {"id": "diuturnal_mantles", "name": "Diuturnal Mantles", "desc": "Shot by Blast/Torrent: re-roll one defence die. Unaffected by x\" Devastating unless the target."},
        {"id": "star_charts", "name": "Star Charts", "desc": "STRATEGIC GAMBIT: roll D3; if higher than the turning point number, gain 1CP (then never again)."},
    ],
    "operatives": [
        vs("felarch", "Felarch", [("Neuro disruptor", 4, "3+", "4/5", 'Range 8", Piercing 1, Stun'), PISTOL, RIFLE], [POWER],
           ["Loadout: shuriken rifle + shuriken pistol + power weapon, or neuro disruptor + power weapon.",
            "Veteran Raider: Its free action from Aeldari Raiders can be any 1AP action instead of a Dash.",
            "One Step Ahead: Once per battle, after an enemy acts, if this is ready: roll D6; if higher than that enemy's APL, interrupt with a free Shoot or Fight against it only, then -1 APL until end of its next activation."],
           "LEADER, FELARCH", wounds=9),
        vs("fate_dealer", "Fate Dealer", [("Ranger long rifle (mobile)", 4, "3+", "3/4", "-"), ("Ranger long rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent"), PISTOL], [FISTS],
           ["Camo Cloak: When shot: ignore Saturate; if retaining cover saves, retain one extra or one as a crit (not with Vantage)."], "FATE DEALER"),
        vs("gunner_blaster", "Gunner (blaster)", [("Blaster", 4, "3+", "4/5", "Piercing 2"), PISTOL], [FISTS], [], "GUNNER"),
        vs("gunner_shredder", "Gunner (shredder)", [("Shredder", 4, "3+", "4/5", 'Rending, Torrent 2"'), PISTOL], [FISTS], [], "GUNNER"),
        vs("heavy_cannon", "Heavy Gunner (shuriken cannon)", CANNON + [PISTOL], [FISTS], [], "HEAVY GUNNER"),
        vs("heavy_wraith", "Heavy Gunner (wraithcannon)", [PISTOL, ("Wraithcannon", 4, "3+", "6/3", "Devastating 4, Heavy (Dash only), Piercing 2")], [FISTS], [], "HEAVY GUNNER"),
        vs("kurnathi", "Kurnathi", [PISTOL], [("Dual power weapons", 4, "3+", "4/6", "Ceaseless, Lethal 5+")],
           ["Blademaster: Can Dash after Charging in the same activation, using up to 3\" of leftover Charge distance.",
            "Bladed Stance: Fighting/retaliating, resolve one success early, as a block."], "KURNATHI"),
        vs("kurnite_hunter", "Kurnite Hunter", [("Faolchú", 4, "3+", "1/2", "Rending, Saturate, Seek Light, Silent"), PISTOL], [POWER],
           ["Faolchú's Bond: First time each turning point it retaliates while ready, you resolve the first attack dice.",
            "Erudite Hunter: STRATEGIC GAMBIT. Pick an enemy within 9\": once this turning point, after it moves, interrupt with a free Reposition (not ending further away) or free Charge into its control range."],
           "KURNITE HUNTER"),
        vs("shade_runner", "Shade Runner", [PISTOL, ("Throwing blades", 4, "3+", "2/4", 'Range 6", Silent')], [("Hekatarii blades", 4, "3+", "3/5", "Ceaseless, Lethal 5+")],
           ["Blink Pack: Charge, Fall Back or Reposition can be a warp jump: set up wholly within 7\" horizontally (through walls in close quarters); not in enemy control range unless Charging.",
            "Slicing Attack: After a warp-jump Reposition, trace a 7\" line from its old spot: D3+2 damage to one enemy it crosses (that was visible at the start)."],
           "SHADE RUNNER"),
        vs("soul_weaver", "Soul Weaver", [PISTOL], [POWER],
           ["Soul Channel (1AP): PSYCHIC. Another Voidscarred visible within 6\": +1 APL until end of its next activation. Not within enemy control range.",
            "Soul Heal (1AP): PSYCHIC. A Voidscarred visible within 6\" regains up to 2D3 wounds. Not within enemy control range."],
           "PSYKER, MEDIC, SOUL WEAVER"),
        vs("starstorm", "Starstorm Duellist", [("Fusion pistol", 4, "3+", "5/3", 'Range 3", Devastating 3, Piercing 2'), PISTOL], [FISTS],
           ["Quick on the Trigger: Can Shoot while in enemy control range, but only at an enemy in its own control range (friendlies near it don't block).",
            "Pistol Barrage (1AP): Two free Shoots, one with each pistol. Not on Conceal or in an activation with a Shoot."],
           "STARSTORM DUELLIST"),
        vs("warrior_blade", "Warrior (power weapon)", [PISTOL], [POWER], PROWLING, "WARRIOR"),
        vs("warrior_rifle", "Warrior (shuriken rifle)", [RIFLE], [FISTS], PROWLING, "WARRIOR"),
        vs("way_seeker", "Way Seeker", [("Freezing grasp", 4, "3+", "1/2", "PSYCHIC, Severe, Silent, Stun"), ("Lightning strike", 4, "3+", "4/3", 'PSYCHIC, 2" Devastating 2'), PISTOL],
           [("Witch staff", 4, "3+", "3/5", "PSYCHIC, Shock")],
           ["Warp Fold (1AP): PSYCHIC. Two Voidscarred visible within 5\" swap places (if one already moved this turning point, the other ready one can't Charge, Fall Back or Reposition this turning point). Not within enemy control range.",
            "Warding Shield (1AP): PSYCHIC. A Voidscarred visible within 6\": until this one's next activation, ignore the first Normal Dmg on it. Not within enemy control range."],
           "PSYKER, WAY SEEKER"),
    ],
}
