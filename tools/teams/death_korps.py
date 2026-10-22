LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
BAYONET = ("Bayonet", 3, "4+", "2/3", "-")
MEDIC = "Medic!: The first time each turning point another friendly operative visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target."

def dk(oid, name, ranged, melee, abilities, kw, wounds=7):
    return {"id": oid, "name": "Death Korps " + name, "apl": 2, "move": '6"', "save": "5+", "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return dk(oid, "Gunner (" + label + ")", ranged, [BAYONET], [], "GUNNER")

# Operatives other Inquisitorial requisition can reuse (everything except the Watchmaster)
OPERATIVES = [
    dk("bruiser", "Bruiser", [LASGUN], [("Trench club", 4, "3+", "3/3", "Shock")],
       ["Bruiser: Once per turning point when it fights or retaliates, ignore the damage from one normal success. If it's incapacitated during a Fight action, it strikes with one unresolved success before it's removed."],
       "BRUISER"),
    dk("confidant", "Confidant", [("Bolt pistol", 4, "4+", "3/4", 'Range 8"'), ("Boltgun", 4, "4+", "3/4", "-"), LASGUN, ("Relic laspistol", 4, "4+", "2/4", 'Range 8", Lethal 5+')],
       [BAYONET, ("Chainsword", 4, "4+", "4/5", "-")],
       ["Loadout: a boltgun or lasgun with a bayonet, or a bolt pistol or relic laspistol with a chainsword.",
        "Second in Command: If the Watchmaster is incapacitated and removed, this operative can issue Guardsman Orders as a STRATEGIC GAMBIT for the rest of the battle.",
        "Directive: When it's activated (if Second in Command hasn't been used), pick another ready Death Korps visible within 6\" and activate it next. A Trooper ignores Group Activation for this."],
       "CONFIDANT"),
    gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
    gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
    gunner("gunner_melta", "meltagun", [("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
    gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
    dk("medic", "Medic", [LASGUN], [BAYONET],
       [MEDIC, "Medikit (1AP): A friendly operative in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
       "MEDIC"),
    dk("sapper", "Sapper", [LASGUN, ("Remote detonator", 4, "2+", "5/6", "Heavy (Dash only), Limited 1, Piercing 1, Silent, Detonate")], [BAYONET],
       ["Mine Layer: It carries your Mine marker and can pick it up. After placing it, it gets a free Dash.",
        "Detonate (weapon rule): Don't pick a target. Shoot every operative within 2\" of your Mine marker, unless Heavy terrain wholly intervenes. None of them are in cover or obscured. The marker must be in the killzone and is removed afterwards. In close quarters, it also gains Lethal 5+."],
       "SAPPER"),
    dk("sniper", "Sniper", [("Long-las (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Long-las (mobile)", 4, "3+", "3/4", "-"),
                            ("Long-las (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [BAYONET],
       ["Concealed Position (weapon rule): Only the first time it Shoots in the battle."], "SNIPER"),
    dk("spotter", "Spotter", [LASGUN, ("Mortar barrage", 4, "4+", "3/5", 'Blast 2", Heavy (Dash only), Silent')], [BAYONET],
       ["Spot (1AP): SUPPORT. Pick a visible enemy. Until the end of the turning point, Death Korps within 3\" of this operative gain Seek Light when shooting it, and it can't be obscured. It can't do this within enemy control range."],
       "SPOTTER"),
    dk("trooper", "Trooper", [LASGUN], [BAYONET],
       ["Group Activation: When it's expended, activate another ready Trooper next (no more than two in a row)."], "TROOPER"),
    dk("veteran", "Veteran", [LASGUN], [("Bionic arm", 3, "4+", "4/5", "-")],
       ["Veteran Guardsman: Whenever it's activated, it can receive one Guardsman Order.",
        "Bionics: Normal Dmg of 3 or more inflicts 1 less damage on it."], "VETERAN"),
    dk("vox", "Vox-operator", [LASGUN], [BAYONET],
       ["Relay Orders: Once per turning point, when it receives a Guardsman Order outside enemy control range, every Death Korps in the killzone receives it too. This operative gets -1 APL until the end of its next activation.",
        "Signal (1AP): SUPPORT. Another Death Korps visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
       "VOX-OPERATOR"),
    dk("zealot", "Zealot", [LASGUN], [BAYONET],
       ["The Emperor Protects: When it's shot, you can re-roll any of its defence dice.",
        "Uplifting Primer: SUPPORT. Death Korps within 3\" of it gain Severe on their weapons."], "ZEALOT"),
]
LIST_IDS = [o["id"] for o in OPERATIVES]
GUNNERS = ["gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma"]

TEAM = {
    "id": "deathkorps", "source": "death_korps", "name": "Death Korps", "badge": "ASTRA MILITARUM", "color": "#6F7A5A",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 14,
        "groups": [
            {"name": "Leader", "desc": "1 Watchmaster", "min": 1, "max": 1, "ids": ["watchmaster"]},
            {"name": "Operatives", "desc": "4 Troopers plus 9 operatives from the list below", "min": 9, "max": 13, "ids": LIST_IDS},
        ],
        "repeatable": ["trooper"],
        "caps": [{"ids": [i for i in LIST_IDS if i != "trooper"], "max": 9, "label": "Max 9 operatives besides Troopers"}],
        "rules": [
            "Select 1 Watchmaster, armed with a boltgun and bayonet, or a bolt pistol, plasma pistol or relic laspistol with a chainsword or power weapon.",
            "Select 4 Troopers. Up to four times, you can skip one of these Troopers and instead make one Death Korps ploy cost 0CP for the battle.",
            "Select 9 more operatives from the list. You can take several Troopers, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Guardsmen Orders", "STRATEGIC GAMBIT and SUPPORT. The Watchmaster gives one order to all Death Korps within 6\" until the end of the turning point (only the latest order counts). Take Aim!: ranged weapons gain Ceaseless (not the mortar barrage or remote detonator). Fix Bayonets!: melee weapons gain Ceaseless. Dig In!: when shot with a cover save, re-roll any defence dice showing one result of your choice. Move! Move! Move!: +1\" Move when Repositioning."),
    ],
    "ploys": {
        "strategy": [
            ("Siege Warfare", "Ranged weapons gain Saturate and Accurate 1."),
            ("Take Cover", "When one is shot and retains cover saves, its Save improves by 1."),
            ("Clear the Line", "Melee weapons gain Accurate 1, and also Severe when fighting wholly in your territory or retaliating."),
            ("Regroup", "SUPPORT. Pick a Death Korps more than 3\" from enemies. Others within 5\" of it (and outside enemy control range) make a free Dash, ending closer to it. Not in the same turning point as Chronometer."),
        ],
        "firefight": [
            ("Inspirational Leadership", "SUPPORT. During the Watchmaster's or Confidant's activation, it gives a Guardsman Order."),
            ("Combined Arms", "After rolling attack dice against an enemy that another Death Korps shot this turning point, re-roll any of them."),
            ("In Life, Shame", "When a Death Korps with an Engage order is activated, it receives every Guardsman Order."),
            ("In Death, Atonement", "When a ready Death Korps outside enemy control range is incapacitated, it makes one free action before it's removed (and can change order). It counts as injured."),
        ],
    },
    "equipment": [
        {"id": "chronometer", "name": "Chronometer", "desc": "STRATEGIC GAMBIT, once per battle, in the first or second turning point. Death Korps wholly in your territory make a free Dash toward the enemy drop zone or edge. Not in the same turning point as Regroup."},
        {"id": "comm_beads", "name": "Comm-beads", "desc": "When the Watchmaster or Confidant gives an order, you can give it to any one Death Korps instead of those within 6\"."},
        {"id": "hand_axes", "name": "Hand Axes", "desc": "Death Korps get a hand axe.", "gw": ("melee", "Hand axe", 3, "4+", "3/4", "-")},
        {"id": "gas_bombardment", "name": "Gas Bombardment", "desc": "STRATEGIC GAMBIT, once per battle. Place a Gas marker (not under Vantage terrain). Operatives within 3\" of it get -1 APL. Remove it in the next Strategy phase."},
    ],
    "operatives": [
        dk("watchmaster", "Watchmaster",
           [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Boltgun", 4, "3+", "3/4", "-"), ("Plasma pistol (standard)", 4, "4+", "3/5", 'Range 8", Piercing 1'),
            ("Plasma pistol (supercharge)", 4, "4+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1'), ("Relic laspistol", 4, "3+", "2/4", 'Range 8", Lethal 5+')],
           [("Bayonet", 4, "3+", "2/3", "-"), ("Chainsword", 4, "3+", "4/5", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: a boltgun and bayonet, or a bolt pistol, plasma pistol or relic laspistol with a chainsword or power weapon.",
            "Adaptive Orders: If it doesn't give an order as a STRATEGIC GAMBIT, Inspirational Leadership costs 0CP during its activation.",
            "Bring It Down!: STRATEGIC GAMBIT, while it's in the killzone. Pick an enemy. Death Korps attacking it gain Punishing."],
           "LEADER, WATCHMASTER", wounds=8),
    ] + OPERATIVES,
}
