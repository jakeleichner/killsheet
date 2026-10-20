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
            "Max 1 GRAVIS operative: Bombard, Breacher or Horde-slayer.",
        ],
    },
    "factionRules": [
        ("Veteran Astartes", "Two Shoot or two Fight per activation. Two Shoots with an aux grenade launcher, frag cannon, heavy plasma incinerator, infernus heavy bolter, plasma pistol or stalker bolt rifle for both (or a melta bomb for either): +1AP for the second. Counteract regardless of order, with a free extra 1AP action (different actions; not Fight and Shoot together)."),
        ("Special Issue Ammunition", "Once/TP on a Shoot (not explosive grenades or melta bombs): ranged weapons gain one of Blast 1\" (not with Torrent), Devastating 1, Lethal 5+, Piercing Crits 1, Saturate, Severe."),
    ],
    "ploys": {
        "strategy": [
            ("The Shield That Slays", "Wholly within the opponent's territory: Normal Dmg of 4+ inflicts 1 less."),
            ("And They Shall Know No Fear", "Ignore injured stat changes (incl. weapons)."),
            ("Mission Tactics", "Pick Conceal or Engage: attacking an enemy with that order, weapons gain Balanced."),
            ("The Long Vigil", "Shot while wholly within your territory: re-roll one defence die."),
        ],
        "firefight": [
            ("Advanced Auspex Scan", "On Shoot: ranged weapons gain Saturate and enemies can't be obscured until end of activation."),
            ("Transhuman Physiology", "Being shot: retain one normal defence success as a crit."),
            ("Suffer Not the Alien", "After rolling attack dice vs an operative without CHAOS or IMPERIUM: re-roll any."),
            ("Auspicator Tracking", "Counteracting, before any actions: change its order."),
        ],
    },
    "equipment": [
        {"id": "bioscryer_cuffs", "name": "Sanctus-V Bioscryer Cuffs", "desc": "Once per activation (not in enemy control range): regain up to D3 wounds, remove APL changes, or remove a Neutron Fragment, Poison or Terrorchem token."},
        {"id": "ammo_reserve", "name": "Ammunition Reserve", "desc": "Once/battle: Special Issue Ammunition for up to two Shoots in one TP (different rules each)."},
        {"id": "digital_weapons", "name": "Digital Weapons", "desc": "Once/TP on a Fight, at the start of Roll Attack Dice: inflict 1 dmg on the enemy."},
        {"id": "servo_thrall", "name": "Scrutavore Servo-thrall", "desc": "Once/TP: a mission action costs 1 less AP and can be done in enemy control range (then roll-off; if the opponent wins, this equipment is lost)."},
    ],
    "operatives": [
        vet("watch_sergeant", "Watch Sergeant", [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
            [("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
            ["Adaptable Armoury: You can select one additional equipment option.",
             "Strategic Command: Once per battle each while in killzone: a Deathwatch strategy ploy for 0CP, and a firefight ploy for 0CP."],
            "LEADER, WATCH SERGEANT"),
        vet("aegis", "Aegis Veteran", [BOLT_PISTOL], [("Power maul & storm shield", 5, "3+", "4/6", "Shock, Shield")],
            ["Shield (weapon rule): Fighting/retaliating with it, each block can block two unresolved successes.",
             "Storm Shield: When shot, the attacker's Piercing is worsened by 1."],
            "AEGIS", save="2+"),
        vet("blademaster", "Blademaster Veteran", [SI_PISTOL],
            [("Xenophase blade (duel)", 5, "3+", "4/6", "Brutal, Lethal 5+"), ("Xenophase blade (phase sweep)", 4, "3+", "4/6", "Brutal, Lethal 5+, Phase Sweep")],
            ["Adaptive Swordsmanship: Ignore changes to its blade's Hit. Fighting/retaliating, it can resolve one success early, but must block with it.",
             "Phase Sweep (weapon rule): After a Fight with this profile, free Fights with it vs each enemy in control range once (until it dies or has fought them all)."],
            "BLADEMASTER"),
        vet("bombard", "Bombard Veteran", [BOLT_PISTOL, ("Frag cannon (shell)", 4, "3+", "5/7", "Piercing 1"), ("Frag cannon (shrapnel)", 5, "3+", "4/5", 'Torrent 2"')], [FISTS],
            [], "GRAVIS, BOMBARD", move='5"', wounds=18, pts=40),
        vet("breacher", "Breacher Veteran", [("Auxiliary grenade launcher (frag)", 4, "3+", "2/4", 'Blast 2"'), ("Auxiliary grenade launcher (krak)", 4, "3+", "4/5", "Piercing 1"),
                                             ("Hellstorm bolt rifle", 4, "3+", "4/5", 'Torrent 1"'), ("Melta bomb", 4, "3+", "5/3", 'Range 3", Devastating 3, Heavy (Reposition only), Limited 1, Piercing 2')],
            [FISTS], [], "GRAVIS, BREACHER", move='5"', wounds=18, pts=40),
        vet("demolisher", "Demolisher Veteran", [BOLT_PISTOL], [("Heavy thunder hammer", 5, "4+", "6/7", "Shock, Stun")],
            ["Brutal Assault: Fighting: hammer gains Brutal. After a Charge: gains Ceaseless until end of activation.",
             "Aggressive Force: Fighting/retaliating: Normal and Crit Dmg of 3+ inflicts 1 less (not with The Shield That Slays)."],
            "DEMOLISHER"),
        vet("disruptor", "Disruptor Veteran", [("Marksman bolt carbine", 4, "3+", "3/4", "Lethal 5+")], [FISTS],
            ["Advanced Omni-Scrambler: STRATEGIC GAMBIT. Pick an enemy visible or within 6\", roll D6: it can't activate/act this Firefight phase until the opponent has activated that many operatives or it's their last.",
             "Auspex Triangulation: Advanced Auspex Scan costs 0CP if this isn't in enemy control range and the (primary) target is visible to it (later Shoots that activation must meet this too)."],
            "DISRUPTOR", move='7"', wounds=13),
        vet("gunner", "Gunner Veteran", [BOLT_PISTOL, ("Heavy plasma incinerator (standard)", 5, "3+", "4/6", "Piercing 1"), ("Heavy plasma incinerator (supercharge)", 5, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")],
            [FISTS], [], "GUNNER"),
        vet("headtaker", "Headtaker Veteran", [SI_PISTOL], [("Combat knives", 5, "3+", "4/5", "-")],
            ["Grav-chute and Grapnel Launcher: Climbing counts as 2\" vertical; ignore vertical distance when dropping.",
             "Clandestine Headtaker: Can Charge while Concealed. Fighting an enemy it wasn't visible to at the start of the activation: after your first strike, resolve another success as a strike immediately."],
            "HEADTAKER", move='7"', wounds=13),
        vet("horde_slayer", "Horde-slayer Veteran", [BOLT_PISTOL, ("Infernus heavy bolter (flame)", 5, "2+", "3/3", 'Range 8", Saturate, Torrent 2"'),
                                                     ("Infernus heavy bolter (focused bolt)", 5, "3+", "4/5", "Piercing Crits 1"), ("Infernus heavy bolter (sweeping bolt)", 4, "3+", "4/5", 'Piercing Crits 1, Torrent 1"')],
            [FISTS], [], "GRAVIS, HORDE-SLAYER", move='5"', wounds=18, pts=40),
        vet("marksman", "Marksman Veteran", [("Stalker bolt rifle (mobile)", 4, "3+", "3/4", "-"), ("Stalker bolt rifle (heavy)", 4, "2+", "3/5", "Heavy (Dash only), Lethal 5+, Piercing Crits 1")],
            [FISTS],
            ["Vigilant Marksman: Can Guard in any killzone. Close quarters: once/TP after a free Shoot on guard, it can Guard again (but then can't counteract that TP)."],
            "MARKSMAN"),
    ],
}
