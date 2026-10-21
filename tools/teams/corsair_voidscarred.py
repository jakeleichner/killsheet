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
            "Select 1 Felarch, armed with a shuriken rifle, shuriken pistol and power weapon, or a neuro disruptor and power weapon.",
            "Select 8 other operatives. You can take several Warriors, but every other operative only once.",
            "You can't take both a blaster and a wraithcannon.",
        ],
    },
    "factionRules": [
        ("Aeldari Raiders", "Each Voidscarred can make a free Dash during its activation."),
        ("Rifles", "When it shoots a shuriken rifle or ranger long rifle in an activation where it hasn't Charged, Fallen Back or Repositioned yet, the weapon gains Accurate 1."),
    ],
    "ploys": {
        "strategy": [
            ("Piratical Profiteers", "When attacking while either side contests an objective or one of your mission markers, weapons gain Balanced."),
            ("Mobile Engagement", "When one is shot after moving this turning point, re-roll one defence die."),
            ("Plunderers", "Up to D3 Voidscarred make a free Dash, and can't Dash in their own activations this turning point. You can't use this in the first turning point."),
            ("Outcasts", "When one is more than 5\" from other friendly operatives, its weapons gain Punishing."),
        ],
        "firefight": [
            ("Light Fingers", "This activation, enemies in its control range don't stop it taking Pick Up Marker or mission actions."),
            ("Capricious Flight", "This activation, Fall Back costs it 1 less AP."),
            ("Opportunistic Fighters", "When an enemy Falls Back, inflict 2D3 damage on it before it moves, for each Voidscarred in its control range."),
            ("Contemptuous Adventurer", "If the first Voidscarred you activate this turning point is more than 5\" from friendly operatives, its first Shoot or Fight gains Relentless."),
        ],
    },
    "equipment": [
        {"id": "mistfield", "name": "Mistfield", "desc": "Once per turning point, when one is shot from more than 3\" away, the attacker's Piercing gets worse by 1."},
        {"id": "runes_guidance", "name": "Runes of Guidance", "desc": "Once per turning point, a Way Seeker or Soul Weaver PSYCHIC action (not Warp Fold) gets 3\" extra range."},
        {"id": "diuturnal_mantles", "name": "Diuturnal Mantles", "desc": "When one is shot by Blast or Torrent, re-roll one defence die. It isn't affected by x\" Devastating unless it's the target."},
        {"id": "star_charts", "name": "Star Charts", "desc": "STRATEGIC GAMBIT: roll a D3. If it beats the turning point number, gain 1CP and stop using this."},
    ],
    "operatives": [
        vs("felarch", "Felarch", [("Neuro disruptor", 4, "3+", "4/5", 'Range 8", Piercing 1, Stun'), PISTOL, RIFLE], [POWER],
           ["Loadout: a shuriken rifle, shuriken pistol and power weapon, or a neuro disruptor and power weapon.",
            "Veteran Raider: Its free action from Aeldari Raiders can be any 1AP action instead of a Dash.",
            "One Step Ahead: Once per battle, after an enemy acts, if this operative is ready, roll a D6. If it beats that enemy's APL, interrupt with a free Shoot or Fight against that enemy only, then it gets -1 APL until the end of its next activation."],
           "LEADER, FELARCH", wounds=9),
        vs("fate_dealer", "Fate Dealer", [("Ranger long rifle (mobile)", 4, "3+", "3/4", "-"), ("Ranger long rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent"), PISTOL], [FISTS],
           ["Camo Cloak: When it's shot, ignore Saturate. If it retains cover saves, it can retain one extra, or one as a critical success. Not with Vantage terrain."], "FATE DEALER"),
        vs("gunner_blaster", "Gunner (blaster)", [("Blaster", 4, "3+", "4/5", "Piercing 2"), PISTOL], [FISTS], [], "GUNNER"),
        vs("gunner_shredder", "Gunner (shredder)", [("Shredder", 4, "3+", "4/5", 'Rending, Torrent 2"'), PISTOL], [FISTS], [], "GUNNER"),
        vs("heavy_cannon", "Heavy Gunner (shuriken cannon)", CANNON + [PISTOL], [FISTS], [], "HEAVY GUNNER"),
        vs("heavy_wraith", "Heavy Gunner (wraithcannon)", [PISTOL, ("Wraithcannon", 4, "3+", "6/3", "Devastating 4, Heavy (Dash only), Piercing 2")], [FISTS], [], "HEAVY GUNNER"),
        vs("kurnathi", "Kurnathi", [PISTOL], [("Dual power weapons", 4, "3+", "4/6", "Ceaseless, Lethal 5+")],
           ["Blademaster: It can Dash after Charging in the same activation, using up to 3\" of leftover Charge distance.",
            "Bladed Stance: When it fights or retaliates, resolve one success early, as a block."], "KURNATHI"),
        vs("kurnite_hunter", "Kurnite Hunter", [("Faolchú", 4, "3+", "1/2", "Rending, Saturate, Seek Light, Silent"), PISTOL], [POWER],
           ["Faolchú's Bond: The first time each turning point it retaliates while ready, you resolve the first attack die.",
            "Erudite Hunter: STRATEGIC GAMBIT. Pick an enemy within 9\". Once this turning point, after that enemy moves, interrupt with a free Reposition (not ending further away) or a free Charge into its control range."],
           "KURNITE HUNTER"),
        vs("shade_runner", "Shade Runner", [PISTOL, ("Throwing blades", 4, "3+", "2/4", 'Range 6", Silent')], [("Hekatarii blades", 4, "3+", "3/5", "Ceaseless, Lethal 5+")],
           ["Blink Pack: A Charge, Fall Back or Reposition can be a warp jump instead: set it up wholly within 7\" horizontally (through walls in close quarters), and not in enemy control range unless it's Charging.",
            "Slicing Attack: After a warp-jump Reposition, trace a 7\" line from where it started. Inflict D3+2 damage on one enemy the line crosses that was visible at the start."],
           "SHADE RUNNER"),
        vs("soul_weaver", "Soul Weaver", [PISTOL], [POWER],
           ["Soul Channel (1AP): PSYCHIC. Another Voidscarred visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range.",
            "Soul Heal (1AP): PSYCHIC. A Voidscarred visible within 6\" regains up to 2D3 wounds. It can't do this within enemy control range."],
           "PSYKER, MEDIC, SOUL WEAVER"),
        vs("starstorm", "Starstorm Duellist", [("Fusion pistol", 4, "3+", "5/3", 'Range 3", Devastating 3, Piercing 2'), PISTOL], [FISTS],
           ["Quick on the Trigger: It can Shoot while in enemy control range, but only at an enemy in its own control range. Friendly operatives near that enemy don't block the shot.",
            "Pistol Barrage (1AP): Make two free Shoots, one with each pistol. It can't do this with a Conceal order or in an activation where it already Shot."],
           "STARSTORM DUELLIST"),
        vs("warrior_blade", "Warrior (power weapon)", [PISTOL], [POWER], PROWLING, "WARRIOR"),
        vs("warrior_rifle", "Warrior (shuriken rifle)", [RIFLE], [FISTS], PROWLING, "WARRIOR"),
        vs("way_seeker", "Way Seeker", [("Freezing grasp", 4, "3+", "1/2", "PSYCHIC, Severe, Silent, Stun"), ("Lightning strike", 4, "3+", "4/3", 'PSYCHIC, 2" Devastating 2'), PISTOL],
           [("Witch staff", 4, "3+", "3/5", "PSYCHIC, Shock")],
           ["Warp Fold (1AP): PSYCHIC. Two Voidscarred visible within 5\" swap places. If one already moved this turning point, the other (if ready) can't Charge, Fall Back or Reposition this turning point. It can't do this within enemy control range.",
            "Warding Shield (1AP): PSYCHIC. Pick a Voidscarred visible within 6\". Until this operative's next activation, ignore the first Normal Dmg inflicted on it. It can't do this within enemy control range."],
           "PSYKER, WAY SEEKER"),
    ],
}
