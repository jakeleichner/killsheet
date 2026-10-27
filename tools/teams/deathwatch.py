BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
SI_PISTOL = ("Special issue bolt pistol", 4, "3+", "3/4", 'Range 8", Piercing 1')
FISTS = ("Fists", 4, "3+", "3/4", "-")
GRAVIS = ["bombard", "breacher", "horde_slayer"]

def vet(oid, name, ranged, melee, abilities, kw, move='6"', save="3+", wounds=15, pts=32):
    return {"id": oid, "name": name, "apl": 3, "move": move, "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "deathwatch", "source": "deathwatch", "name": "Deathwatch", "badge": "ADEPTUS ASTARTES", "color": "#9AA3AD",
    "archetypes": "Seek & Destroy, Security",
    "composition": {
        "total": 5,
        "groups": [
            {"name": "Leader", "desc": "Optional: 1 Watch Sergeant", "min": 0, "max": 1, "ids": ["watch_sergeant"]},
            {"name": "Veterans", "desc": "5 Deathwatch operatives in total (Watch Sergeant included)", "min": 4, "max": 5,
             "ids": ["aegis", "blademaster", "bombard", "breacher", "demolisher", "disruptor", "gunner", "headtaker", "horde_slayer", "marksman"]},
        ],
        "pools": [{"groups": ["Leader", "Veterans"], "min": 5, "max": 5, "label": "Deathwatch operatives"}],
        "caps": [{"ids": GRAVIS, "max": 1, "label": "Max 1 GRAVIS operative (Bombard, Breacher, Horde-slayer)"}],
        "rules": [
            "Select 5 operatives from the list (the Watch Sergeant is optional).",
            "Each operative only once.",
            "Only 1 GRAVIS operative: Bombard, Breacher or Horde-slayer.",
        ],
    },
    "factionRules": [
        ("Veteran Astartes", "During each activation, an operative can take two Shoot actions or two Fight actions. The second Shoot costs 1 extra AP if both use an auxiliary grenade launcher, frag cannon, heavy plasma incinerator, infernus heavy bolter, plasma pistol or stalker bolt rifle, or if either uses a melta bomb. These operatives can counteract whatever their order, and when they do they get a free extra 1AP action. The two actions must be different, and can't be a Fight and a Shoot together."),
        ("Special Issue Ammunition", "Once per turning point when one Shoots (not with explosive grenades or melta bombs), its ranged weapon gains one of: Blast 1\" (not with Torrent), Devastating 1, Lethal 5+, Piercing Crits 1, Saturate or Severe."),
    ],
    "ploys": {
        "strategy": [
            ("The Shield That Slays", "When one is wholly within your opponent's territory, Normal Dmg of 4 or more inflicts 1 less damage on it."),
            ("And They Shall Know No Fear", "Ignore stat changes from being injured, including weapon stats."),
            ("Mission Tactics", "Pick Conceal or Engage. When attacking an enemy with that order, weapons gain Balanced."),
            ("The Long Vigil", "When one is shot while wholly within your territory, re-roll one defense die."),
        ],
        "firefight": [
            ("Advanced Auspex Scan", "Use when one Shoots. Until the end of the activation, its ranged weapons gain Saturate and enemies can't be obscured."),
            ("Transhuman Physiology", "When one is shot, retain one normal defense success as a critical success."),
            ("Suffer Not the Alien", "After rolling attack dice against an operative that isn't CHAOS or IMPERIUM, re-roll any of them."),
            ("Auspicator Tracking", "When one counteracts, it can change its order before taking any actions."),
        ],
    },
    "equipment": [
        {"id": "bioscryer_cuffs", "name": "Sanctus-V Bioscryer Cuffs", "desc": "Once per activation, outside enemy control range, it regains up to D3 wounds, removes APL changes, or removes a Neutron Fragment, Poison or Terrorchem token."},
        {"id": "ammo_reserve", "name": "Ammunition Reserve", "desc": "Once per battle, use Special Issue Ammunition for up to two Shoots in one turning point, picking a different rule for each."},
        {"id": "digital_weapons", "name": "Digital Weapons", "desc": "Once per turning point when one Fights, inflict 1 damage on the enemy at the start of the Roll Attack Dice step."},
        {"id": "servo_thrall", "name": "Scrutavore Servo-thrall", "desc": "Once per turning point, a mission action costs 1 less AP and can be done in enemy control range. If it is, roll off: if your opponent wins, you lose this equipment."},
    ],
    "operatives": [
        vet("watch_sergeant", "Watch Sergeant", [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
            [("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
            ["Adaptable Armoury: You can take one extra equipment option.",
             "Strategic Command: Once per battle each, while it's in the killzone, you can use a Deathwatch strategy ploy for 0CP and a firefight ploy for 0CP."],
            "LEADER, WATCH SERGEANT"),
        vet("aegis", "Aegis Veteran", [BOLT_PISTOL], [("Power maul & storm shield", 5, "3+", "4/6", "Shock, Shield")],
            ["Shield (weapon rule): When fighting or retaliating with it, each block can block two unresolved successes.",
             "Storm Shield: When it's shot, the attacker's Piercing gets worse by 1."],
            "AEGIS", save="2+"),
        vet("blademaster", "Blademaster Veteran", [SI_PISTOL],
            [("Xenophase blade (duel)", 5, "3+", "4/6", "Brutal, Lethal 5+"), ("Xenophase blade (phase sweep)", 4, "3+", "4/6", "Brutal, Lethal 5+, Phase Sweep")],
            ["Adaptive Swordsmanship: Ignore changes to its blade's Hit. When it fights or retaliates, it can resolve one success early, but must use it to block.",
             "Phase Sweep (weapon rule): After a Fight with this profile, make free Fights with it against each other enemy in its control range, once each, until it dies or has fought them all."],
            "BLADEMASTER"),
        vet("bombard", "Bombard Veteran", [BOLT_PISTOL, ("Frag cannon (shell)", 4, "3+", "5/7", "Piercing 1"), ("Frag cannon (shrapnel)", 5, "3+", "4/5", 'Torrent 2"')], [FISTS],
            [], "GRAVIS, BOMBARD", move='5"', wounds=18, pts=40),
        vet("breacher", "Breacher Veteran", [("Auxiliary grenade launcher (frag)", 4, "3+", "2/4", 'Blast 2"'), ("Auxiliary grenade launcher (krak)", 4, "3+", "4/5", "Piercing 1"),
                                             ("Hellstorm bolt rifle", 4, "3+", "4/5", 'Torrent 1"'), ("Melta bomb", 4, "3+", "5/3", 'Range 3", Devastating 3, Heavy (Reposition only), Limited 1, Piercing 2')],
            [FISTS], [], "GRAVIS, BREACHER", move='5"', wounds=18, pts=40),
        vet("demolisher", "Demolisher Veteran", [BOLT_PISTOL], [("Heavy thunder hammer", 5, "4+", "6/7", "Shock, Stun")],
            ["Brutal Assault: When it fights, the hammer gains Brutal. After a Charge, it also gains Ceaseless until the end of the activation.",
             "Aggressive Force: When it fights or retaliates, Normal and Critical Dmg of 3 or more inflicts 1 less damage on it. Not with The Shield That Slays."],
            "DEMOLISHER"),
        vet("disruptor", "Disruptor Veteran", [("Marksman bolt carbine", 4, "3+", "3/4", "Lethal 5+")], [FISTS],
            ["Advanced Omni-Scrambler: STRATEGIC GAMBIT. Pick an enemy visible to it or within 6\" and roll a D6. That enemy can't activate or act this Firefight phase until your opponent has activated that many operatives, or it's their last one.",
             "Auspex Triangulation: Advanced Auspex Scan costs 0CP if this operative is outside enemy control range and can see the primary target. Later Shoots that activation must meet this too."],
            "DISRUPTOR", move='7"', wounds=13),
        vet("gunner", "Gunner Veteran", [BOLT_PISTOL, ("Heavy plasma incinerator (standard)", 5, "3+", "4/6", "Piercing 1"), ("Heavy plasma incinerator (supercharge)", 5, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")],
            [FISTS], [], "GUNNER"),
        vet("headtaker", "Headtaker Veteran", [SI_PISTOL], [("Combat knives", 5, "3+", "4/5", "-")],
            ["Grav-chute and Grapnel Launcher: Climbing counts as 2\" vertically, and it ignores vertical distance when dropping.",
             "Clandestine Headtaker: It can Charge while it has a Conceal order. When it fights an enemy that couldn't see it at the start of the activation, after your first strike, resolve another success as a strike straight away."],
            "HEADTAKER", move='7"', wounds=13),
        vet("horde_slayer", "Horde-slayer Veteran", [BOLT_PISTOL, ("Infernus heavy bolter (flame)", 5, "2+", "3/3", 'Range 8", Saturate, Torrent 2"'),
                                                     ("Infernus heavy bolter (focused bolt)", 5, "3+", "4/5", "Piercing Crits 1"), ("Infernus heavy bolter (sweeping bolt)", 4, "3+", "4/5", 'Piercing Crits 1, Torrent 1"')],
            [FISTS], [], "GRAVIS, HORDE-SLAYER", move='5"', wounds=18, pts=40),
        vet("marksman", "Marksman Veteran", [("Stalker bolt rifle (mobile)", 4, "3+", "3/4", "-"), ("Stalker bolt rifle (heavy)", 4, "2+", "3/5", "Heavy (Dash only), Lethal 5+, Piercing Crits 1")],
            [FISTS],
            ["Vigilant Marksman: It can Guard in any killzone. In close quarters, once per turning point after a free Shoot while on guard, it can Guard again, but then can't counteract that turning point."],
            "MARKSMAN"),
    ],
}
