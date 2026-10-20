PISTOL = ("Shuriken pistol", 4, "3+", "3/4", 'Range 8", Rending')
CATAPULT = ("Shuriken catapult", 4, "3+", "3/4", "Rending")
EXARCH = "Exarch: Can do two Shoot or two Fight actions per activation."
DEFENCE_TACTICS = "Defence Tactics: While contesting an objective or your mission marker, or shooting an enemy that does, weapons gain Balanced."
BANSHEE_MASK = "Banshee Mask: When it fights, the enemy's melee Hit is worsened by 1 (not with injury)."
MANDIBLASTERS = "Mandiblasters: On a Fight, at the start of Roll Attack Dice: inflict 2 damage on that enemy."

def asp(oid, name, ranged, melee, abilities, kw, apl=3, save="4+", wounds=8):
    return {"id": oid, "name": name, "apl": apl, "move": '7"', "save": save, "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "bladesofkhaine", "source": "blades_of_khaine", "name": "Blades of Khaine", "badge": "AELDARI", "color": "#3FA7A0",
    "archetypes": "Seek & Destroy, or the archetype of your most common Aspect (Dire Avenger: Security, Howling Banshee: Recon, Striking Scorpion: Infiltration)",
    "composition": {
        "total": 8,
        "groups": [
            {"name": "Leader", "desc": "1 Exarch (Dire Avenger, Howling Banshee or Striking Scorpion)", "min": 1, "max": 1,
             "ids": ["da_exarch", "hb_exarch", "ss_exarch"]},
            {"name": "Aspect Warriors", "desc": "7 Aspect Warriors in any mix", "min": 7, "max": 7, "ids": ["da_warrior", "hb_warrior", "ss_warrior"]},
        ],
        "repeatable": ["da_warrior", "hb_warrior", "ss_warrior"],
        "rules": [
            "Select 1 Exarch.",
            "Select 7 Aspect Warriors in any mix of Dire Avenger, Howling Banshee and Striking Scorpion.",
        ],
    },
    "factionRules": [
        ("Aspect Techniques", "Each technique works only for operatives of its Aspect. Max one per activation/counteraction and each once per turning point (twice per turning point if every operative shares the same Aspect)."),
        ("Dire Avenger techniques", "Vigilance of the Avenger: shuriken catapults gain Lethal 5+ for a Shoot. Unstinting, Immovable: being shot with 2+ fails, discard one to retain another as normal. The Slicing Hurricane: Shoot partway through a Reposition (catapult or pistol). Death of a Thousand Blades: catapult gains Torrent 2\" (one secondary target). Raging Heat of the Dying Flame: ignore injury until its next activation."),
        ("Howling Banshee techniques", "The Woe: after Charging and killing in a Fight (now clear of enemies), a free Charge with the remaining move. Scream-That-Steals: resolve one success early, as a block. Shriek-That-Kills: use the shriek weapon for a Shoot (5 3+ 1/2, Range 6\", Saturate, Seek Light, Stun, Torrent 1\"). Rain of Tears: after a crit strike against a survivor, end the fight and Fall Back up to 3\". Acrobatic: ignore climb/drop height and move through enemies (Charge capped at its Move)."),
        ("Striking Scorpion techniques", "Strike and Fade: after killing in a fight and being more than 3\" from enemies, go Conceal and Dash. Scorpion's Eye: shuriken pistol gains Seek Light. Patient Stalk, Sudden Blow: Concealed Reposition can pass through enemy control range, then D3+2 damage to one enemy it passed. Merciless Strikes: after the first crit strike, its melee weapon gains Shock. One with the Gloom: until its next activation, Concealed and in cover it can't be targeted (except within 2\")."),
    ],
    "ploys": {
        "strategy": [
            ("Forewarned", "Ready operative being shot: re-roll defence dice of one result."),
            ("Dance of Death", "Two operatives visible within 6\" of each other swap places."),
            ("Ruthless Poise", "Fighting a ready enemy: melee weapons gain Ceaseless."),
            ("Khaine's Vengeance", "Shooting an expended enemy: ranged weapons gain Ceaseless."),
        ],
        "firefight": [
            ("Bladewind", "This activation, the operative can Fight twice."),
            ("Contempt", "Retaliating or being shot, after the opponent rolls attack dice: they can't re-roll (any re-roll ploy is cancelled and refunded)."),
            ("Starfall", "This activation, the operative can Shoot twice."),
            ("Fading Light", "This activation, Fall Back costs 1 less AP."),
        ],
    },
    "equipment": [
        {"id": "rune_prophecy", "name": "Rune of Prophecy", "desc": "Once per battle after the initiative roll-off: add or subtract D3 from your result."},
        {"id": "wraithbone_talisman", "name": "Wraithbone Talisman", "desc": "Once per turning point attacking: with 2+ fails, discard one to retain another as a normal success."},
        {"id": "rune_shielding", "name": "Rune of Shielding", "desc": "Once per battle, ignore the Normal Dmg from one attack dice."},
        {"id": "rune_foresight", "name": "Rune of Foresight", "desc": "Roll D3 when revealed: +1CP in that turning point's Strategy phase."},
    ],
    "operatives": [
        asp("da_exarch", "Dire Avenger Exarch", [CATAPULT, PISTOL, ("Twin shuriken catapult", 4, "3+", "3/4", "Ceaseless, Rending")],
            [("Diresword", 5, "3+", "4/5", "Lethal 5+, Rending"), ("Fists", 4, "3+", "2/4", "-"), ("Gun butts", 3, "4+", "2/3", "-"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
            ["Loadout: shuriken catapult + fists, twin shuriken catapult + gun butts, or (diresword or power weapon) + (shuriken pistol or shimmershield).",
             DEFENCE_TACTICS, EXARCH,
             "Shimmershield (if taken): friendlies visible within 2\" of it ignore Piercing when shot."],
            "LEADER, DIRE AVENGER, EXARCH", save="3+", wounds=9),
        asp("hb_exarch", "Howling Banshee Exarch", [PISTOL, ("Triskele (throw)", 4, "3+", "2/3", 'Range 8", Rending, Torrent 2"')],
            [("Executioner", 5, "3+", "3/7", "Lethal 5+"), ("Mirrorswords", 5, "3+", "4/6", "Ceaseless, Lethal 5+"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+"), ("Triskele (slice)", 5, "3+", "4/5", "Rending")],
            ["Loadout: mirrorswords; or shuriken pistol + executioner, power weapon or triskele; or triskele + power weapon.",
             BANSHEE_MASK, EXARCH],
            "LEADER, HOWLING BANSHEE, EXARCH", save="3+", wounds=9),
        asp("ss_exarch", "Striking Scorpion Exarch", [PISTOL, ("Twin shuriken pistols", 4, "4+", "3/4", 'Range 8", Ceaseless, Rending')],
            [("Biting blade", 5, "3+", "5/6", "Rending"), ("Scorpion's claw and chainsword", 5, "3+", "4/6", "Brutal, Lethal 5+"), ("Twin chainswords", 5, "3+", "4/5", "Ceaseless, Rending")],
            ["Loadout: shuriken pistol + biting blade, shuriken pistol + scorpion's claw and chainsword, or twin shuriken pistols + twin chainswords.",
             MANDIBLASTERS, EXARCH],
            "LEADER, STRIKING SCORPION, EXARCH", save="3+", wounds=9),
        asp("da_warrior", "Dire Avenger Warrior", [CATAPULT], [("Fists", 4, "3+", "2/4", "-")], [DEFENCE_TACTICS], "DIRE AVENGER, WARRIOR"),
        asp("hb_warrior", "Howling Banshee Warrior", [PISTOL], [("Power weapon", 4, "3+", "4/6", "Lethal 5+")], [BANSHEE_MASK], "HOWLING BANSHEE, WARRIOR"),
        asp("ss_warrior", "Striking Scorpion Warrior", [PISTOL], [("Chainsword", 4, "3+", "4/5", "Rending")], [MANDIBLASTERS], "STRIKING SCORPION, WARRIOR", save="3+"),
    ],
}
