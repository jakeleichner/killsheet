LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
BAYONET = ("Bayonet", 3, "4+", "2/3", "-")
MEDIC = "Medic!: First time each TP another friendly visible within 3\" would be incapacitated (neither in enemy control range): it stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it."

def dk(oid, name, ranged, melee, abilities, kw, wounds=7):
    return {"id": oid, "name": "Death Korps " + name, "apl": 2, "move": '6"', "save": "5+", "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return dk(oid, "Gunner (" + label + ")", ranged, [BAYONET], [], "GUNNER")

# Operatives other Inquisitorial requisition can reuse (everything except the Watchmaster)
OPERATIVES = [
    dk("bruiser", "Bruiser", [LASGUN], [("Trench club", 4, "3+", "3/3", "Shock")],
       ["Bruiser: Once/TP fighting/retaliating, ignore the damage from one normal success. If incapacitated during the Fight action, strike with one unresolved success before removal."],
       "BRUISER"),
    dk("confidant", "Confidant", [("Bolt pistol", 4, "4+", "3/4", 'Range 8"'), ("Boltgun", 4, "4+", "3/4", "-"), LASGUN, ("Relic laspistol", 4, "4+", "2/4", 'Range 8", Lethal 5+')],
       [BAYONET, ("Chainsword", 4, "4+", "4/5", "-")],
       ["Loadout: (boltgun or lasgun) + bayonet, or (bolt pistol or relic laspistol) + chainsword.",
        "Second in Command: If the Watchmaster is incapacitated and removed, this can issue Guardsman Orders as a STRATEGIC GAMBIT for the rest of the battle.",
        "Directive: On activation (if Second in Command hasn't been used), pick another ready Death Korps visible within 6\": activate it next (a Trooper ignores Group Activation)."],
       "CONFIDANT"),
    gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
    gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
    gunner("gunner_melta", "meltagun", [("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
    gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
    dk("medic", "Medic", [LASGUN], [BAYONET],
       [MEDIC, "Medikit (1AP): Friendly in control range regains up to 2D3 wounds (not one saved by Medic! this TP). Not within enemy control range."],
       "MEDIC"),
    dk("sapper", "Sapper", [LASGUN, ("Remote detonator", 4, "2+", "5/6", "Heavy (Dash only), Limited 1, Piercing 1, Silent, Detonate")], [BAYONET],
       ["Mine Layer: Carries your Mine marker; can Pick Up it, and after Placing it gets a free Dash.",
        "Detonate (weapon rule): No target selection; shoot every operative within 2\" of your Mine marker (unless Heavy terrain wholly intervenes), none in cover/obscured. Needs the marker in the killzone; removed afterwards. Close quarters: also Lethal 5+."],
       "SAPPER"),
    dk("sniper", "Sniper", [("Long-las (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Long-las (mobile)", 4, "3+", "3/4", "-"),
                            ("Long-las (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [BAYONET],
       ["Concealed Position (weapon rule): Only the first time it Shoots in the battle."], "SNIPER"),
    dk("spotter", "Spotter", [LASGUN, ("Mortar barrage", 4, "4+", "3/5", 'Blast 2", Heavy (Dash only), Silent')], [BAYONET],
       ["Spot (1AP): SUPPORT. A visible enemy: until end of TP, Death Korps within 3\" of this shooting it gain Seek Light and it can't be obscured. Not within enemy control range."],
       "SPOTTER"),
    dk("trooper", "Trooper", [LASGUN], [BAYONET],
       ["Group Activation: When expended, activate another ready Trooper next (max two in a row)."], "TROOPER"),
    dk("veteran", "Veteran", [LASGUN], [("Bionic arm", 3, "4+", "4/5", "-")],
       ["Veteran Guardsman: Whenever activated, it can receive one Guardsman Order.",
        "Bionics: Normal Dmg of 3+ inflicts 1 less on it."], "VETERAN"),
    dk("vox", "Vox-operator", [LASGUN], [BAYONET],
       ["Relay Orders: Once/TP when it receives a Guardsman Order (not in enemy control range): all Death Korps in the killzone receive it; this gets -1 APL until end of its next activation.",
        "Signal (1AP): SUPPORT. Another Death Korps visible within 6\": +1 APL until end of its next activation. Not within enemy control range."],
       "VOX-OPERATOR"),
    dk("zealot", "Zealot", [LASGUN], [BAYONET],
       ["The Emperor Protects: When shot, re-roll any defence dice.",
        "Uplifting Primer: SUPPORT. Death Korps within 3\" of it: weapons gain Severe."], "ZEALOT"),
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
            "Select 1 Watchmaster: boltgun + bayonet, or (bolt pistol, plasma pistol or relic laspistol) + (chainsword or power weapon).",
            "Select 4 Troopers. Up to four times, you can skip one of these Troopers and instead make one Death Korps ploy cost 0CP for the battle.",
            "Select 9 more operatives from the list. Other than Troopers, each only once.",
        ],
    },
    "factionRules": [
        ("Guardsmen Orders", "STRATEGIC GAMBIT and SUPPORT. The Watchmaster issues one order to all Death Korps within 6\" until end of TP (only the most recent counts). Take Aim!: ranged weapons gain Ceaseless (not mortar barrage or remote detonator). Fix Bayonets!: melee weapons gain Ceaseless. Dig In!: when shot with a cover save, re-roll defence dice of one result. Move! Move! Move!: +1\" Move when Repositioning."),
    ],
    "ploys": {
        "strategy": [
            ("Siege Warfare", "Ranged weapons gain Saturate and Accurate 1."),
            ("Take Cover", "Shot while retaining cover saves: Save improves by 1."),
            ("Clear the Line", "Melee weapons gain Accurate 1; also Severe when fighting wholly in your territory or retaliating."),
            ("Regroup", "SUPPORT. Pick a Death Korps more than 3\" from enemies: others within 5\" of it (not in enemy control range) make a free Dash ending closer to it. Not in the same TP as Chronometer."),
        ],
        "firefight": [
            ("Inspirational Leadership", "SUPPORT. During the Watchmaster's or Confidant's activation: it issues a Guardsman Order."),
            ("Combined Arms", "After rolling attack dice vs an enemy another Death Korps shot this TP: re-roll any."),
            ("In Life, Shame", "When a Death Korps is activated on Engage: it receives every Guardsman Order."),
            ("In Death, Atonement", "A ready Death Korps (not in enemy control range) is incapacitated: before removal it makes one free action (order can change), counting as injured."),
        ],
    },
    "equipment": [
        {"id": "chronometer", "name": "Chronometer", "desc": "Once/battle STRATEGIC GAMBIT in TP1 or TP2: Death Korps wholly in your territory make a free Dash toward the enemy drop zone or edge. Not with Regroup."},
        {"id": "comm_beads", "name": "Comm-beads", "desc": "When the Watchmaster or Confidant issues an order, you can give it to any one Death Korps instead of those within 6\"."},
        {"id": "hand_axes", "name": "Hand Axes", "desc": "Death Korps gain a hand axe.", "gw": ("melee", "Hand axe", 3, "4+", "3/4", "-")},
        {"id": "gas_bombardment", "name": "Gas Bombardment", "desc": "Once/battle STRATEGIC GAMBIT: place a Gas marker (not under Vantage). Operatives within 3\" of it get -1 APL. Removed next Strategy phase."},
    ],
    "operatives": [
        dk("watchmaster", "Watchmaster",
           [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Boltgun", 4, "3+", "3/4", "-"), ("Plasma pistol (standard)", 4, "4+", "3/5", 'Range 8", Piercing 1'),
            ("Plasma pistol (supercharge)", 4, "4+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1'), ("Relic laspistol", 4, "3+", "2/4", 'Range 8", Lethal 5+')],
           [("Bayonet", 4, "3+", "2/3", "-"), ("Chainsword", 4, "3+", "4/5", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
           ["Loadout: boltgun + bayonet, or (bolt pistol, plasma pistol or relic laspistol) + (chainsword or power weapon).",
            "Adaptive Orders: If it doesn't issue an order as a STRATEGIC GAMBIT, Inspirational Leadership costs 0CP during its activation.",
            "Bring It Down!: STRATEGIC GAMBIT (in killzone). Pick an enemy: Death Korps attacking it gain Punishing."],
           "LEADER, WATCHMASTER", wounds=8),
    ] + OPERATIVES,
}
