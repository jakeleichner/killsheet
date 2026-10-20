BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
PLASMA_PISTOL = [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
CHAINSWORD = ("Chainsword", 5, "3+", "4/5", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
POWER_FIST = ("Power fist", 4, "3+", "5/7", "Brutal, Shock")
POWER_WEAPON = ("Power weapon", 5, "3+", "4/6", "Lethal 5+")
BOOST_ONLY = "Can't be done normally: only during a Fall Back or Reposition, after setting up from a BOOST."
CHAMPION_ABILITIES = [
    "Path to Glory: Incapacitates an enemy with your Challenge token: gain 1CP.",
    "Chaos Champion: STRATEGIC GAMBIT. Move your Challenge token to an enemy. Fighting/retaliating against it: melee weapons gain one of Balanced, Brutal, Punishing, Severe, Shock for that sequence.",
]
THRILL = ["Thrill of Flight: When it BOOSTs in its activation: remove APL changes and ignore injured stat changes (including weapons) until end of activation."]

def mw(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 3, "move": '6"', "save": "3+", "wounds": 14, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

LORD_ABILITIES = [
    "Path to Damnation: Starts with 1 Damnation point. Once per action, try a Boon: roll D6 against its points. Higher: resolve it, +1 point. Equal: nothing. Lower: it takes damage equal to its points. At 6 points, resolve without rolling.",
    "Boons of Damnation: 3+ damage on it: ignore damage equal to its points. Or striking while fighting/retaliating: +damage equal to its points.",
]
LORD_MELEE = [("Lightning claw", 5, "3+", "4/5", "Lethal 5+, Rending"), POWER_FIST, POWER_WEAPON]

def lord(oid, name, ranged, melee, loadout):
    return {"id": oid, "name": name, "apl": 3, "move": '6"', "save": "3+", "wounds": 15, "pts": 40,
            "ranged": ranged, "melee": melee, "abilities": [loadout] + LORD_ABILITIES, "kw": "LEADER, LORD"}

MARKED = ["chaos_lord_plasma", "champion_plasma", "raptor_plasma", "skysear_melta", "skysear_plasma"]

TEAM = {
    "id": "murderwing", "source": "murderwing", "name": "Murderwing", "badge": "CHAOS SPACE MARINES", "color": "#9E2F2F",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Leader", "desc": "1 Chaos Lord", "min": 1, "max": 1, "ids": ["chaos_lord_bolt", "chaos_lord_plasma", "chaos_lord_relic"]},
            {"name": "Operatives", "desc": "5 Murderwing operatives from the list below", "min": 5, "max": 5,
             "ids": ["champion_bolt", "champion_plasma", "curseclaw", "depredator", "huntmaster", "raptor_bolt", "raptor_plasma", "shrieker",
                     "skysear_flamer", "skysear_melta", "skysear_plasma", "warp_talon"]},
        ],
        "repeatable": ["raptor_bolt", "raptor_plasma"],
        "caps": [
            {"ids": ["champion_bolt", "champion_plasma"], "max": 1, "label": "Only 1 Champion"},
            {"ids": ["skysear_flamer", "skysear_melta", "skysear_plasma"], "max": 1, "label": "Only 1 Skysear"},
            {"ids": MARKED, "max": 2, "label": "Max 2 operatives with a plasma pistol, meltagun or plasma gun"},
        ],
        "rules": [
            "Select 1 Chaos Lord: (bolt pistol or plasma pistol) + (lightning claw, power fist or power weapon), or relic lightning claws.",
            "Select 5 other operatives. Other than Raptors, each only once.",
            "Max 2 operatives with a plasma pistol, meltagun or plasma gun (the Chaos Lord counts).",
            "Champion: plasma or bolt pistol + power fist or power weapon.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, an operative can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt pistol. These operatives can counteract whatever their order."),
        ("Jump Pack", "Charge, Fall Back or Reposition in its activation: at the start of any straight-line increment (not under Vantage) it can BOOST: set up wholly within x\" horizontally (x counts toward the move; Charge max 6\"). Not under Vantage; not in enemy control range unless Charging. In close quarters, not through walls or open hatchways."),
        ("Boost Actions", "BOOST actions happen during another action when it BOOSTs (max one per activation). Most hit enemies in its BOOST ZONE: the horizontal area between where it BOOSTed from and to (enemies partly under Vantage excluded)."),
    ],
    "ploys": {
        "strategy": [
            ("Cull the Weak", "Shooting/fighting an enemy that's 2\"+ lower, has reduced APL, or was wounded at the start of the activation: weapons gain Punishing."),
            ("Nightmare on High", "Shot while 2\"+ above the killzone floor, or after BOOSTing this turning point: re-roll one defence die."),
            ("Predators Above", "2\"+ above the floor: weapons gain Balanced; after a BOOST, Balanced until end of activation."),
            ("Instil Fear", "Fighting: Normal Dmg of 3+ inflicts 1 less on it."),
        ],
        "firefight": [
            ("Murderous Descent", "Enemy ends a move within 3\" horizontally and >2\" lower (close quarters: within 2\", different room): interrupt with a free Charge that must end in its control range."),
            ("Long Forgotten Honour", "Fighting/retaliating, resolving a crit: instead end the sequence and make a free Fall Back up to 3\" (ignoring restrictions); the Fight ends."),
            ("Malicious Narcissism", "Your turn to activate with only one Murderwing ready: for the turning point, while you have fewer ready operatives, you can skip activations (no counteracting until it's expended)."),
            ("Wings of Darkness", "Fall Back/Reposition BOOST: set up 3\" further; no Shoot, Fight or Carving Blow until next turning point. Not in the first turning point."),
        ],
    },
    "equipment": [
        {"id": "clawed_armour", "name": "Clawed Armour", "desc": "Clawed Charge (0AP, BOOST action during a Charge): 1 damage to an enemy in control range, then the Charge ends."},
        {"id": "warp_fuel", "name": "Warp Fuel", "desc": "Once per turning point, an enemy Falls Back in its activation from a Murderwing's control range: that Murderwing makes a free Reposition or Charge (max 3\")."},
        {"id": "bladefins", "name": "Bladefins", "desc": "Slice from Above (1AP, BOOST action during Fall Back/Reposition): D3+1 damage to an enemy in its BOOST ZONE."},
        {"id": "vox_casters", "name": "Vox-casters", "desc": "Once per turning point, Vox-cry (1AP, not on Conceal): enemies within 2\" take a stun test (D6 3+: -1 APL until end of their next activation)."},
    ],
    "operatives": [
        lord("chaos_lord_bolt", "Chaos Lord (bolt pistol)", [BOLT_PISTOL], LORD_MELEE, "Loadout: bolt pistol + lightning claw, power fist or power weapon."),
        lord("chaos_lord_plasma", "Chaos Lord (plasma pistol)", PLASMA_PISTOL, LORD_MELEE, "Loadout: plasma pistol + lightning claw, power fist or power weapon."),
        lord("chaos_lord_relic", "Chaos Lord (relic claws)", [], [("Relic lightning claws", 5, "3+", "4/6", "Ceaseless, Lethal 5+, Rending")], "Loadout: relic lightning claws."),
        mw("champion_bolt", "Champion (bolt pistol)", [BOLT_PISTOL], [POWER_FIST, POWER_WEAPON], CHAMPION_ABILITIES, "CHAMPION"),
        mw("champion_plasma", "Champion (plasma pistol)", PLASMA_PISTOL, [POWER_FIST, POWER_WEAPON], CHAMPION_ABILITIES, "CHAMPION"),
        mw("curseclaw", "Curseclaw", [BOLT_PISTOL], [("Mutated claws", 5, "3+", "4/5", "Rending")],
           ["Frenzied Attack: Incapacitated during the Fight action: strike with one unresolved success before removal.",
            "Snatch (1AP): BOOST action. Enemy in its BOOST ZONE: both roll D6 + Wounds stat; if yours is higher, set that enemy up in its BOOST ZONE or control range (no further away); if in control range, its move ends there. " + BOOST_ONLY],
           "CURSECLAW"),
        mw("depredator", "Depredator", [BOLT_PISTOL], [("Great chainaxe", 5, "4+", "5/7", "Brutal")],
           ["Horrifying Dismemberment: Incapacitates an enemy while fighting/retaliating: another enemy visible within 3\" of either gets -1 APL until end of its next activation.",
            "Carving Blow (1AP): 2D3 damage to each other operative visible within 2\" (roll each). Not on Conceal, or in an activation with Slice from Above, Clawed Charge or two Fights."],
           "DEPREDATOR"),
        mw("huntmaster", "Huntmaster", [BOLT_PISTOL], [POWER_WEAPON],
           ["Pinned Prey: The only enemy in its control range tries to Fall Back: roll 2D6 (1D6 if it has more Wounds); any 4+ and it can't (no AP spent).",
            "Strike from Above (1AP): BOOST action. 2D3+1 damage to an enemy in its BOOST ZONE. " + BOOST_ONLY],
           "HUNTMASTER"),
        mw("raptor_bolt", "Raptor (bolt pistol)", [BOLT_PISTOL], [CHAINSWORD], THRILL, "RAPTOR"),
        mw("raptor_plasma", "Raptor (plasma pistol)", PLASMA_PISTOL, [CHAINSWORD], THRILL, "RAPTOR"),
        mw("shrieker", "Shrieker", [BOLT_PISTOL], [CHAINSWORD],
           ["Modified Vox-casters: Enemies within 3\" pay +1AP for Pick Up Marker and mission actions; markers they contest count their total APL 1 lower.",
            "Shriek (1AP): An enemy visible within 6\" (or in its BOOST ZONE, as a BOOST action): D3 damage and -1 APL until end of its next activation. Must pick an enemy in control range if any. Not on Conceal."],
           "SHRIEKER"),
        mw("skysear_flamer", "Skysear (flamer)", [BOLT_PISTOL, ("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [FISTS], [], "SKYSEAR"),
        mw("skysear_melta", "Skysear (meltagun)", [BOLT_PISTOL, ("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "SKYSEAR"),
        mw("skysear_plasma", "Skysear (plasma gun)", [BOLT_PISTOL, ("Plasma gun (std)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (super)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "SKYSEAR"),
        mw("warp_talon", "Warp Talon", [], [("Lightning claws", 5, "3+", "4/5", "Ceaseless, Lethal 5+, Rending")],
           ["Slice the Veil: Can deploy in the warp. turning point 1 activation: place a Warp marker wholly in your territory, then expend it. turning point 2 activation: set up wholly in your drop zone or in your territory contesting the marker; max two actions and 4\" of movement that activation; obscured to operatives >3\" away until next Ready step. Can't be the Malicious Narcissism operative while in the warp."],
           "WARP TALON"),
    ],
}
