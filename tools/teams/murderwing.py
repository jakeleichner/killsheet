BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
PLASMA_PISTOL = [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
CHAINSWORD = ("Chainsword", 5, "3+", "4/5", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
POWER_FIST = ("Power fist", 4, "3+", "5/7", "Brutal, Shock")
POWER_WEAPON = ("Power weapon", 5, "3+", "4/6", "Lethal 5+")
BOOST_ONLY = "It can't take this action normally. It can only use it during a Fall Back or Reposition, after setting up from a Boost."
CHAMPION_ABILITIES = [
    "Path to Glory: When it incapacitates an enemy with your Challenge token, gain 1CP.",
    "Chaos Champion: STRATEGIC GAMBIT. Move your Challenge token to an enemy. When it fights or retaliates against that enemy, its melee weapons gain one of Balanced, Brutal, Punishing, Severe or Shock for that sequence.",
]
THRILL = ["Thrill of Flight: When it Boosts in its activation, remove its APL changes and ignore stat changes from being injured (including weapon stats) until the end of the activation."]

def mw(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 3, "move": '6"', "save": "3+", "wounds": 14, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

LORD_ABILITIES = [
    "Path to Damnation: It starts with 1 Damnation point. Once per action, try for a Boon by rolling a D6 against its points. Higher: resolve the Boon and add 1 point. Equal: nothing happens. Lower: it takes damage equal to its points. At 6 points, resolve the Boon without rolling.",
    "Boons of Damnation: When 3 or more damage is inflicted on it, ignore damage equal to its points. Or, when it strikes while fighting or retaliating, add damage equal to its points.",
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
            {"ids": MARKED, "max": 2, "label": "Up to 2 operatives with a plasma pistol, meltagun or plasma gun"},
        ],
        "rules": [
            "Select 1 Chaos Lord, armed with a bolt pistol or plasma pistol plus a lightning claw, power fist or power weapon, or with relic lightning claws.",
            "Select 5 other operatives. You can take several Raptors, but every other operative only once.",
            "Up to 2 operatives with a plasma pistol, meltagun or plasma gun (the Chaos Lord counts).",
            "Champion: a plasma or bolt pistol, plus a power fist or power weapon.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, an operative can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt pistol. These operatives can counteract whatever their order."),
        ("Jump Pack", "When it Charges, Falls Back or Repositions in its activation, at the start of any straight-line increment (not under Vantage terrain) it can Boost: set it up wholly within x\" horizontally. The x\" counts toward the move, and a Charge can Boost no more than 6\". It can't end under Vantage terrain, or in enemy control range unless it's Charging. In close quarters, it can't Boost through walls or open hatchways."),
        ("Boost Actions", "Boost actions happen during another action, when the operative Boosts (one per activation at most). Most of them hit enemies in its Boost zone: the horizontal area between where it Boosted from and to (not counting enemies partly under Vantage terrain)."),
    ],
    "ploys": {
        "strategy": [
            ("Cull the Weak", "When shooting or fighting an enemy that's 2\" or more lower, has reduced APL, or was wounded at the start of the activation, weapons gain Punishing."),
            ("Nightmare on High", "When one is shot while 2\" or more above the killzone floor, or after Boosting this turning point, re-roll one defence die."),
            ("Predators Above", "While 2\" or more above the floor, weapons gain Balanced. After a Boost, they keep Balanced until the end of the activation."),
            ("Instil Fear", "When one fights, Normal Dmg of 3 or more inflicts 1 less damage on it."),
        ],
        "firefight": [
            ("Murderous Descent", "When an enemy ends a move within 3\" horizontally and more than 2\" lower (in close quarters: within 2\", in a different room), interrupt with a free Charge that must end in its control range."),
            ("Long Forgotten Honour", "When one fights or retaliates and resolves a critical success, end the sequence instead and make a free Fall Back of up to 3\", ignoring restrictions. The Fight ends."),
            ("Malicious Narcissism", "On your turn to activate, with only one Murderwing ready: for the rest of the turning point, while you have fewer ready operatives, you can skip activations (no counteracting until it's expended)."),
            ("Wings of Darkness", "A Fall Back or Reposition Boost sets up 3\" further. It can't Shoot, Fight or use Carving Blow until the next turning point. You can't use this in the first turning point."),
        ],
    },
    "equipment": [
        {"id": "clawed_armour", "name": "Clawed Armour", "desc": "Clawed Charge (0AP, a Boost action during a Charge): inflict 1 damage on an enemy in its control range, then the Charge ends."},
        {"id": "warp_fuel", "name": "Warp Fuel", "desc": "Once per turning point, when an enemy Falls Back in its activation from a Murderwing's control range, that Murderwing makes a free Reposition or Charge of up to 3\"."},
        {"id": "bladefins", "name": "Bladefins", "desc": "Slice from Above (1AP, a Boost action during a Fall Back or Reposition): inflict D3+1 damage on an enemy in its Boost zone."},
        {"id": "vox_casters", "name": "Vox-casters", "desc": "Once per turning point, Vox-cry (1AP, not with a Conceal order): enemies within 2\" take a stun test (on a D6 roll of 3+, they get -1 APL until the end of their next activation)."},
    ],
    "operatives": [
        lord("chaos_lord_bolt", "Chaos Lord (bolt pistol)", [BOLT_PISTOL], LORD_MELEE, "Loadout: a bolt pistol, plus a lightning claw, power fist or power weapon."),
        lord("chaos_lord_plasma", "Chaos Lord (plasma pistol)", PLASMA_PISTOL, LORD_MELEE, "Loadout: a plasma pistol, plus a lightning claw, power fist or power weapon."),
        lord("chaos_lord_relic", "Chaos Lord (relic claws)", [], [("Relic lightning claws", 5, "3+", "4/6", "Ceaseless, Lethal 5+, Rending")], "Loadout: relic lightning claws."),
        mw("champion_bolt", "Champion (bolt pistol)", [BOLT_PISTOL], [POWER_FIST, POWER_WEAPON], CHAMPION_ABILITIES, "CHAMPION"),
        mw("champion_plasma", "Champion (plasma pistol)", PLASMA_PISTOL, [POWER_FIST, POWER_WEAPON], CHAMPION_ABILITIES, "CHAMPION"),
        mw("curseclaw", "Curseclaw", [BOLT_PISTOL], [("Mutated claws", 5, "3+", "4/5", "Rending")],
           ["Frenzied Attack: If it's incapacitated during a Fight action, it strikes with one unresolved success before it's removed.",
            "Snatch (1AP): Boost action. Pick an enemy in its Boost zone. You each roll a D6 and add your operative's Wounds stat. If yours is higher, set that enemy up in the Boost zone or in its control range (no further away). If it's in its control range, its move ends there." + BOOST_ONLY],
           "CURSECLAW"),
        mw("depredator", "Depredator", [BOLT_PISTOL], [("Great chainaxe", 5, "4+", "5/7", "Brutal")],
           ["Horrifying Dismemberment: When it incapacitates an enemy while fighting or retaliating, another enemy visible within 3\" of either gets -1 APL until the end of its next activation.",
            "Carving Blow (1AP): Inflict 2D3 damage on each other operative visible within 2\", rolling for each. It can't do this with a Conceal order, or in an activation where it used Slice from Above, Clawed Charge or two Fights."],
           "DEPREDATOR"),
        mw("huntmaster", "Huntmaster", [BOLT_PISTOL], [POWER_WEAPON],
           ["Pinned Prey: When the only enemy in its control range tries to Fall Back, roll 2D6 (1D6 if the enemy has more Wounds). On any 4+, it can't, and spends no AP.",
            "Strike from Above (1AP): Boost action. Inflict 2D3+1 damage on an enemy in its Boost zone." + BOOST_ONLY],
           "HUNTMASTER"),
        mw("raptor_bolt", "Raptor (bolt pistol)", [BOLT_PISTOL], [CHAINSWORD], THRILL, "RAPTOR"),
        mw("raptor_plasma", "Raptor (plasma pistol)", PLASMA_PISTOL, [CHAINSWORD], THRILL, "RAPTOR"),
        mw("shrieker", "Shrieker", [BOLT_PISTOL], [CHAINSWORD],
           ["Modified Vox-casters: Enemies within 3\" pay 1 extra AP for Pick Up Marker and mission actions, and for markers they contest, their total APL counts as 1 lower.",
            "Shriek (1AP): An enemy visible within 6\" (or in its Boost zone, as a Boost action) takes D3 damage and gets -1 APL until the end of its next activation. It must pick an enemy in its control range if there is one, and can't do this with a Conceal order."],
           "SHRIEKER"),
        mw("skysear_flamer", "Skysear (flamer)", [BOLT_PISTOL, ("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [FISTS], [], "SKYSEAR"),
        mw("skysear_melta", "Skysear (meltagun)", [BOLT_PISTOL, ("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "SKYSEAR"),
        mw("skysear_plasma", "Skysear (plasma gun)", [BOLT_PISTOL, ("Plasma gun (std)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (super)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "SKYSEAR"),
        mw("warp_talon", "Warp Talon", [], [("Lightning claws", 5, "3+", "4/5", "Ceaseless, Lethal 5+, Rending")],
           ["Slice the Veil: It can deploy in the warp. In its first-turning-point activation, place a Warp marker wholly in your territory, then expend it. In its second-turning-point activation, set it up wholly in your drop zone, or in your territory contesting the marker. That activation it can take two actions at most and move no more than 4\", and it's obscured to operatives more than 3\" away until the next Ready step. While it's in the warp, it can't be the Malicious Narcissism operative."],
           "WARP TALON"),
    ],
}
