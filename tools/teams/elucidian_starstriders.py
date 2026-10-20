LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")

def es(oid, name, ranged, melee, abilities, kw, apl=2, move='6"', save="5+", wounds=8):
    return {"id": oid, "name": name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

CREWMEN = "Crewmen: Once per turning point when you'd counteract (and haven't used a Privateer Support Asset this turning point): a Concealed Voidsman can counteract, but may only Shoot, using a Privateer Support Asset."

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
        ("Warrant of Trade", "Up to four times per battle, each rule once: Consideration (an extra equipment option), Coordinate (+1CP at end of Select Operatives), Coerce (opponent sets up all operatives first, and you pick who sets up equipment first), Explore (turning point 1 gambit: D3 operatives in your drop zone Reposition, ending wholly within 4\" of it), Bribe (skip an activation), Seize (re-roll the initiative roll-off), Adaptable Terms (Approved Ops: end of turning point 2, swap a tac op or primary op)."),
        ("Privateer Support Assets", "Once per Firefight phase, a NAVIS operative or Elucia Shooting can use one ship weapon (each once per battle); the target only has cover if part of its base is under Vantage terrain. Archeotech beam 4 3+ 6/7 (Heavy Reposition only, Piercing 2, Silent). Plasma battery 5 4+ 5/6 (Heavy, Lethal 5+, Piercing 1, Silent). Macrocannon 5 4+ 4/5 (Heavy, Piercing Crits 1, Saturate, Silent, Torrent 2\"). Guided shell 5 4+ 3/4 (Blast 2\", Heavy, Silent). Cluster bomb 5 4+ 2/3 (Blast 3\", Heavy, Silent)."),
    ],
    "ploys": {
        "strategy": [
            ("Lethal Proximity", "Shooting an operative within 6\": ranged weapons gain Balanced (not support assets)."),
            ("Stake Claim", "Place your Claim marker: attacking an enemy within 3\" of it, retain a fail as normal or a normal as crit. Removed at end of turning point."),
            ("Undaunted Explorers", "First time each operative takes damage from an attack dice this turning point: halve it (round up, min 2)."),
            ("Quick March", "Reposition: +1\" Move but must end closer to the enemy drop zone; no support asset that activation."),
        ],
        "firefight": [
            ("Combined Arms", "After rolling attack dice against an enemy another Starstrider shot this turning point: re-roll any (not with support assets)."),
            ("Survivalist", "On activation: regain up to D3+2 wounds and ignore APL changes this activation."),
            ("Great Endurance", "During a NAVIS operative's activation: +1 APL."),
            ("Well-Drilled", "A NAVIS operative activates: pick another ready NAVIS visible within 3\": activate it next."),
        ],
    },
    "equipment": [
        {"id": "armoured_undersuit", "name": "Armoured Undersuit", "desc": "Operatives with a 5+ Save (not the Canid) being shot: retain one defence roll of 4 as a normal success."},
        {"id": "hot_shot_packs", "name": "Hot Shot Capacitor Packs", "desc": "Up to 2x/turning point on a laspistol, lasgun or relic laspistol: +1 both Normal and Critical Dmg, Hot and Piercing Crits 1 until end of turning point."},
        {"id": "coordinates_uplink", "name": "Improved Coordinates Uplink", "desc": "Support asset target within 6\" of a NAVIS operative: can't be obscured; weapon gains Saturate."},
        {"id": "rapid_gunnery", "name": "Rapid Gunnery", "desc": "Once per battle, reuse a support asset already used."},
    ],
    "operatives": [
        es("elucia", "Elucia Vhane", [("Heirloom relic pistol", 4, "3+", "4/5", 'Range 8", Piercing Crits 1, Seek Light')], [("Monomolecular cane-rapier", 4, "3+", "3/6", "Lethal 5+")],
           ["Digital Lasers: On a Fight, at the start of Roll Attack Dice: 1 damage to the enemy.",
            "Merciless: Attacking an enemy already wounded when the action started: Balanced (Ceaseless if already Balanced).",
            "Disruption Field: Ignore Piercing when shot.",
            "Reputation to Maintain: First kill of the battle: +1CP, or one extra Warrant of Trade use (max four, still each once)."],
           "LEADER, ELUCIA VHANE", apl=3, save="4+"),
        es("canid", "Canid", [], [("Vicious bite", 4, "3+", "3/4", "Rending")],
           ["Beast: Only Charge, Dash, Fall Back, Fight, Gather, Guard, Reposition, Pick Up and Place Marker; own weapons only.",
            "Loyal Companion: An enemy Fighting can be forced to fight this instead (if valid). An enemy ends a Charge on another Starstrider within 3\" of this (not in enemy control range): this makes a free Charge into that enemy.",
            "Gather (1AP): Free Dash or Reposition, picking up or placing a marker during the move."],
           "CANID", move='8"', wounds=7),
        es("executioner", "Death Cult Executioner", [("Dartmask", 4, "3+", "1/1", 'Range 6", Lethal 5+, Silent, Stun')], [("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
           ["Rapid Reflexes: Ignore Piercing when shot.",
            "Bladed Stance: Fighting/retaliating, resolve one success early, as a block.",
            "Zealot: Incapacitated during the Fight action: strike with one unresolved success before removal.",
            "Trained Assassin (1AP): Change its order. Not within enemy control range."],
           "DEATH CULT EXECUTIONER", apl=3),
        es("lectro_maester", "Lectro-maester", [("Voltaic pistol", 4, "3+", "4/4", 'Range 8", 1" Devastating 1, Rending')], [GUN_BUTT],
           ["Missionary of the Martian Creed: Once per activation: Pick Up Marker, Place Marker or a mission action costs 1 less AP.",
            "Voltaghiest Array: Starstriders within 4\" of it being shot: re-roll one defence die.",
            "Calibrate Voltagheist (0AP): Until its next activation: Charge (voltaic pistol gains Lethal 4+) or Field (enemies ending a move visible within 4\" take D6 damage). Not within enemy control range."],
           "LECTRO-MAESTER", save="4+"),
        es("rejuvenat", "Rejuvenat Adept", [("Laspistol", 4, "4+", "2/3", 'Range 8"')], [("Scalpel claw", 3, "4+", "3/4", "Rending")],
           ["Medic!: First time each turning point another Starstrider visible within 3\" would be incapacitated (neither in enemy control range): it stays on 3 wounds, can't be incapacitated that action, then free Dash ending in this one's control range; ends its activation if during it.",
            "Normaliser Helm: Starstriders within 6\" ignore injured stat changes.",
            "Healing Serum (1AP): A Starstrider in control range regains up to D3+3 wounds (not one saved by Medic! this turning point). Not within enemy control range."],
           "MEDIC, REJUVENAT ADEPT", save="4+"),
        es("voidmaster", "Voidmaster", [("Artificer shotgun (close range)", 4, "3+", "4/4", 'Range 6"'), ("Artificer shotgun (long range)", 4, "5+", "2/2", "-"), ("Relic laspistol", 4, "3+", "2/4", 'Range 8", Lethal 5+')], [GUN_BUTT],
           ["Disciplinarian: SUPPORT. Other NAVIS within 3\": ranged weapons (not support assets) gain Balanced (Ceaseless if already Balanced).",
            "Hardy: Once per battle, ignore the Normal Dmg from one attack dice.",
            "Uncompromising Fire (1AP): Two free Shoots, one with the relic laspistol and one with the shotgun (close range). Not on Conceal or in an activation with a Shoot."],
           "NAVIS, VOIDMASTER"),
        es("voidsman", "Voidsman", [LASGUN], [GUN_BUTT], [CREWMEN], "NAVIS, VOIDSMAN", wounds=7),
        es("voidsman_rotor", "Voidsman (rotor cannon)", [LASGUN, ("Rotor cannon (focused)", 5, "4+", "4/5", "Heavy (Dash only), Rending"), ("Rotor cannon (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Rending, Torrent 1"')], [GUN_BUTT],
           [CREWMEN], "NAVIS, VOIDSMAN", wounds=7),
    ],
}
