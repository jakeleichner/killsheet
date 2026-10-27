LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")

def es(oid, name, ranged, melee, abilities, kw, apl=2, move='6"', save="5+", wounds=8):
    return {"id": oid, "name": name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

CREWMEN = "Crewmen: Once per turning point, when you'd counteract (and haven't used a Privateer Support Asset this turning point), a Voidsman with a Conceal order can counteract, but it can only Shoot, and only with a Privateer Support Asset."

TEAM = {
    "id": "starstriders", "source": "elucidian_starstriders", "name": "Elucidian Starstriders", "badge": "ROGUE TRADER", "color": "#C79A2E",
    "archetypes": "Recon, Security",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "Elucia Vhane", "min": 1, "max": 1, "ids": ["elucia"]},
            {"name": "Retinue", "desc": "Canid, Death Cult Executioner, Lectro-maester, Rejuvenat Adept, Voidmaster", "min": 5, "max": 5,
             "ids": ["canid", "executioner", "lectro_maester", "rejuvenat", "voidmaster"]},
            {"name": "Voidsmen", "desc": "3 Voidsmen with lasguns, 1 with a rotor cannon", "min": 4, "max": 4, "ids": ["voidsman", "voidsman_rotor"]},
        ],
        "repeatable": ["voidsman"],
        "maxCount": {"voidsman": 3},
        "rules": [
            "The team is fixed: Elucia Vhane, Canid, Death Cult Executioner, Lectro-maester, Rejuvenat Adept, Voidmaster, 3 Voidsmen with lasguns and 1 Voidsman with a rotor cannon.",
        ],
    },
    "factionRules": [
        ("Warrant of Trade", "Up to four times per battle, using each rule once. Consideration: take an extra equipment option. Coordinate: gain 1CP at the end of Select Operatives. Coerce: your opponent sets up all their operatives first, and you choose who sets up equipment first. Explore: a gambit in the first turning point where D3 operatives in your drop zone Reposition, ending wholly within 4\" of it. Bribe: skip an activation. Seize: re-roll the initiative roll-off. Adaptable Terms (Approved Ops): at the end of the second turning point, swap a tac op or primary op."),
        ("Privateer Support Assets", "Once per Firefight phase, a NAVIS operative or Elucia can use one ship weapon when Shooting (each weapon once per battle). The target only has cover if part of its base is under Vantage terrain. Archeotech beam 4 Atk, 3+, 6/7 Dmg, Heavy (Reposition only), Piercing 2, Silent. Plasma battery 5 Atk, 4+, 5/6 Dmg, Heavy (Reposition only), Lethal 5+, Piercing 1, Silent. Macrocannon 5 Atk, 4+, 4/5 Dmg, Heavy (Reposition only), Piercing Crits 1, Saturate, Silent, Torrent 2\". Guided shell 5 Atk, 4+, 3/4 Dmg, Blast 2\", Heavy (Reposition only), Silent. Cluster bomb 5 Atk, 4+, 2/3 Dmg, Blast 3\", Heavy (Reposition only), Silent."),
    ],
    "ploys": {
        "strategy": [
            ("Lethal Proximity", "When shooting an operative within 6\", ranged weapons gain Balanced (not support assets)."),
            ("Stake Claim", "Place your Claim marker. When attacking an enemy within 3\" of it, retain one fail as a normal success or one normal success as a critical success. Remove it at the end of the turning point."),
            ("Undaunted Explorers", "The first time each operative takes damage from an attack die this turning point, halve it (rounding up, to a minimum of 2)."),
            ("Quick March", "Reposition with +1\" Move, but it must end closer to the enemy drop zone. It can't use a support asset that activation."),
        ],
        "firefight": [
            ("Combined Arms", "After rolling attack dice against an enemy that another Starstrider shot this turning point, re-roll any of them (not with support assets)."),
            ("Survivalist", "When activated, it regains up to D3+2 wounds and ignores APL changes for that activation."),
            ("Great Endurance", "During a NAVIS operative's activation, it gets +1 APL."),
            ("Well-Drilled", "When a NAVIS operative activates, pick another ready NAVIS visible within 3\" and activate it next."),
        ],
    },
    "equipment": [
        {"id": "armoured_undersuit", "name": "Armored Undersuit", "desc": "When an operative with a 5+ Save (not the Canid) is shot, retain one defense roll of 4 as a normal success."},
        {"id": "hot_shot_packs", "name": "Hot Shot Capacitor Packs", "desc": "Up to twice per turning point, a laspistol, lasgun or relic laspistol gets +1 Normal and Critical Dmg, Hot and Piercing Crits 1 until the end of the turning point."},
        {"id": "coordinates_uplink", "name": "Improved Coordinates Uplink", "desc": "When a support asset's target is within 6\" of a NAVIS operative, it can't be obscured and the weapon gains Saturate."},
        {"id": "rapid_gunnery", "name": "Rapid Gunnery", "desc": "Once per battle, reuse a support asset you've already used."},
    ],
    "operatives": [
        es("elucia", "Elucia Vhane", [("Heirloom relic pistol", 4, "3+", "4/5", 'Range 8", Piercing Crits 1, Seek Light')], [("Monomolecular cane-rapier", 4, "3+", "3/6", "Lethal 5+")],
           ["Digital Lasers: When it Fights, inflict 1 damage on the enemy at the start of the Roll Attack Dice step.",
            "Merciless: When it attacks an enemy that was already wounded when the action started, its weapon gains Balanced (or Ceaseless if it already has Balanced).",
            "Disruption Field: It ignores Piercing when shot.",
            "Reputation to Maintain: On your first kill of the battle, gain 1CP or one extra Warrant of Trade use (five in total instead of four; still each rule once)."],
           "LEADER, ELUCIA VHANE", apl=3, save="4+"),
        es("canid", "Canid", [], [("Vicious bite", 4, "3+", "3/4", "Rending")],
           ["Beast: It can only Charge, Dash, Fall Back, Fight, Gather, Guard, Reposition, Pick Up Marker and Place Marker, and only with its own weapons.",
            "Loyal Companion: An enemy that Fights can be made to fight this operative instead, if it's a valid choice. When an enemy ends a Charge on another Starstrider within 3\" of this operative (and this one isn't in enemy control range), this one makes a free Charge into that enemy.",
            "Gather (1AP): Make a free Dash or Reposition, picking up or placing a marker during the move."],
           "CANID", move='8"', wounds=7),
        es("executioner", "Death Cult Executioner", [("Dartmask", 4, "3+", "1/1", 'Range 6", Lethal 5+, Silent, Stun')], [("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
           ["Rapid Reflexes: It ignores Piercing when shot.",
            "Bladed Stance: When it fights or retaliates, resolve one success early, as a block.",
            "Zealot: If it's incapacitated during a Fight action, it strikes with one unresolved success before it's removed.",
            "Trained Assassin (1AP): Change its order. It can't do this within enemy control range."],
           "DEATH CULT EXECUTIONER", apl=3),
        es("lectro_maester", "Lectro-maester", [("Voltaic pistol", 4, "3+", "4/4", 'Range 8", 1" Devastating 1, Rending')], [GUN_BUTT],
           ["Missionary of the Martian Creed: Once per activation, Pick Up Marker, Place Marker or a mission action costs it 1 less AP.",
            "Voltaghiest Array: When Starstriders within 4\" of it are shot, re-roll one defense die.",
            "Calibrate Voltagheist (0AP): Until its next activation, pick one. Charge: the voltaic pistol gains Lethal 4+. Field: enemies that end a move visible within 4\" take D6 damage. It can't do this within enemy control range."],
           "LECTRO-MAESTER", save="4+"),
        es("rejuvenat", "Rejuvenat Adept", [("Laspistol", 4, "4+", "2/3", 'Range 8"')], [("Scalpel claw", 3, "4+", "3/4", "Rending")],
           ["Medic!: The first time each turning point another Starstrider visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 3 wounds and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
            "Normaliser Helm: Starstriders within 6\" of it ignore stat changes from being injured.",
            "Healing Serum (1AP): A Starstrider in its control range regains up to D3+3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
           "MEDIC, REJUVENAT ADEPT", save="4+"),
        es("voidmaster", "Voidmaster", [("Artificer shotgun (close range)", 4, "3+", "4/4", 'Range 6"'), ("Artificer shotgun (long range)", 4, "5+", "2/2", "-"), ("Relic laspistol", 4, "3+", "2/4", 'Range 8", Lethal 5+')], [GUN_BUTT],
           ["Disciplinarian: SUPPORT. Other NAVIS operatives within 3\" gain Balanced on ranged weapons (not support assets), or Ceaseless if they already have Balanced.",
            "Hardy: Once per battle, ignore the Normal Dmg from one attack die.",
            "Uncompromising Fire (1AP): Make two free Shoots, one with the relic laspistol and one with the shotgun (close range). It can't do this with a Conceal order or in an activation where it Shoots (before or after)."],
           "NAVIS, VOIDMASTER"),
        es("voidsman", "Voidsman", [LASGUN], [GUN_BUTT], [CREWMEN], "NAVIS, VOIDSMAN", wounds=7),
        es("voidsman_rotor", "Voidsman (rotor cannon)", [LASGUN, ("Rotor cannon (focused)", 5, "4+", "4/5", "Heavy (Dash only), Rending"), ("Rotor cannon (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Rending, Torrent 1"')], [GUN_BUTT],
           [CREWMEN], "NAVIS, VOIDSMAN", wounds=7),
    ],
}
