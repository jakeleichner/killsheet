PISTOL = ("Shuriken pistol", 4, "3+", "3/4", 'Range 8", Rending')
CATAPULT = ("Shuriken catapult", 4, "3+", "3/4", "Rending")
EXARCH = "Exarch: It can make two Shoot or two Fight actions in each activation."
DEFENCE_TACTICS = "Defense Tactics: While it contests an objective or one of your mission markers, or shoots an enemy that does, its weapons gain Balanced."
BANSHEE_MASK = "Banshee Mask: When it fights, the enemy's melee weapons get a worse Hit by 1. This isn't affected by being injured."
MANDIBLASTERS = "Mandiblasters: When it Fights, at the start of the Roll Attack Dice step, inflict 2 damage on that enemy."

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
        ("Aspect Techniques", "Each technique only works for operatives of its Aspect. Use at most one per activation or counteraction, and each one once per turning point (twice if every operative in your team is the same Aspect)."),
        ("Dire Avenger techniques", "Vigilance of the Avenger: shuriken catapults gain Lethal 5+ for one Shoot. Unstinting, Immovable: when shot and you fail two or more defense dice, discard one failure to retain another as a normal success. The Slicing Hurricane: Shoot with a catapult or pistol partway through a Reposition. Death of a Thousand Blades: the catapult gains Torrent 2\" (one secondary target). Raging Heat of the Dying Flame: ignore injury until its next activation."),
        ("Howling Banshee techniques", "The Woe: after it Charges and kills an enemy in the Fight (with no other actions before them that activation), and is clear of enemies, it makes a free Charge with its remaining move. Scream-That-Steals: resolve one of your successes early, as a block. Shriek-That-Kills: Shoot with the shriek weapon (5 Atk, 3+, 1/2 Dmg, Range 6\", Saturate, Seek Light, Stun, Torrent 1\"). Rain of Tears: after a critical strike on an enemy that survives, end the fight and Fall Back up to 3\". Acrobatic: for one move, ignore climb and drop heights and move through enemies (a Charge still can't go past its Move)."),
        ("Striking Scorpion techniques", "Strike and Fade: after it kills an enemy in a fight and is more than 3\" from enemies, change its order to Conceal and make a free Dash. Scorpion's Eye: the shuriken pistol gains Seek Light. Patient Stalk, Sudden Blow: a Reposition with a Conceal order can pass through enemy control range, then inflict D3+2 damage on one enemy it passed. Merciless Strikes: after its first critical strike, its melee weapon gains Shock. One with the Gloom: until its next activation, while it has a Conceal order and is in cover, enemies more than 2\" away can't target it."),
    ],
    "ploys": {
        "strategy": [
            ("Forewarned", "When a ready operative is shot, re-roll any defense dice showing one result of your choice."),
            ("Dance of Death", "Pick two operatives visible within 6\" of each other. They swap places."),
            ("Ruthless Poise", "When fighting a ready enemy, melee weapons gain Ceaseless."),
            ("Khaine's Vengeance", "When shooting an expended enemy, ranged weapons gain Ceaseless."),
        ],
        "firefight": [
            ("Bladewind", "The operative can Fight twice this activation."),
            ("Contempt", "Use when one retaliates or is shot, after your opponent rolls attack dice. They can't re-roll those dice. Any re-roll ploy they declared is canceled and its CP refunded."),
            ("Starfall", "The operative can Shoot twice this activation."),
            ("Fading Light", "Fall Back costs 1 less AP for the operative this activation."),
        ],
    },
    "equipment": [
        {"id": "rune_prophecy", "name": "Rune of Prophecy", "desc": "Once per battle, after the initiative roll-off, add or subtract D3 from your result."},
        {"id": "wraithbone_talisman", "name": "Wraithbone Talisman", "desc": "Once per turning point when attacking, if you fail two or more attack dice, discard one failure to retain another as a normal success."},
        {"id": "rune_shielding", "name": "Rune of Shielding", "desc": "Once per battle, ignore the Normal Dmg from one attack die."},
        {"id": "rune_foresight", "name": "Rune of Foresight", "desc": "When you reveal this, roll a D3. Gain 1 extra CP in the Strategy phase of that turning point."},
    ],
    "operatives": [
        asp("da_exarch", "Dire Avenger Exarch", [CATAPULT, PISTOL, ("Twin shuriken catapult", 4, "3+", "3/4", "Ceaseless, Rending")],
            [("Diresword", 5, "3+", "4/5", "Lethal 5+, Rending"), ("Fists", 4, "3+", "2/4", "-"), ("Gun butts", 3, "4+", "2/3", "-"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
            ["Loadout: a shuriken catapult and fists, twin shuriken catapults and gun butts, or a diresword or power weapon plus a shuriken pistol or shimmershield.",
             DEFENCE_TACTICS, EXARCH,
             "Shimmershield (if taken): Friendly operatives visible within 2\" of it ignore Piercing when shot."],
            "LEADER, DIRE AVENGER, EXARCH", save="3+", wounds=9),
        asp("hb_exarch", "Howling Banshee Exarch", [PISTOL, ("Triskele (throw)", 4, "3+", "2/3", 'Range 8", Rending, Torrent 2"')],
            [("Executioner", 5, "3+", "3/7", "Lethal 5+"), ("Mirrorswords", 5, "3+", "4/6", "Ceaseless, Lethal 5+"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+"), ("Triskele (slice)", 5, "3+", "4/5", "Rending")],
            ["Loadout: mirrorswords; a shuriken pistol plus an executioner, power weapon or triskele; or a triskele and a power weapon.",
             BANSHEE_MASK, EXARCH],
            "LEADER, HOWLING BANSHEE, EXARCH", save="3+", wounds=9),
        asp("ss_exarch", "Striking Scorpion Exarch", [PISTOL, ("Twin shuriken pistols", 4, "4+", "3/4", 'Range 8", Ceaseless, Rending')],
            [("Biting blade", 5, "3+", "5/6", "Rending"), ("Scorpion's claw and chainsword", 5, "3+", "4/6", "Brutal, Lethal 5+"), ("Twin chainswords", 5, "3+", "4/5", "Ceaseless, Rending")],
            ["Loadout: a shuriken pistol and biting blade, a shuriken pistol with a scorpion's claw and chainsword, or twin shuriken pistols and twin chainswords.",
             MANDIBLASTERS, EXARCH],
            "LEADER, STRIKING SCORPION, EXARCH", save="3+", wounds=9),
        asp("da_warrior", "Dire Avenger Warrior", [CATAPULT], [("Fists", 4, "3+", "2/4", "-")], [DEFENCE_TACTICS], "DIRE AVENGER, WARRIOR"),
        asp("hb_warrior", "Howling Banshee Warrior", [PISTOL], [("Power weapon", 4, "3+", "4/6", "Lethal 5+")], [BANSHEE_MASK], "HOWLING BANSHEE, WARRIOR"),
        asp("ss_warrior", "Striking Scorpion Warrior", [PISTOL], [("Chainsword", 4, "3+", "4/5", "Rending")], [MANDIBLASTERS], "STRIKING SCORPION, WARRIOR", save="3+"),
    ],
}
