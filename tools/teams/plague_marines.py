BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
FISTS = ("Fists", 4, "3+", "3/4", "-")
TOXIC = "Toxic (weapon rule): Against an enemy that had your Poison token at the start of the action: +1 to both Normal and Critical Dmg."

def pm(oid, name, ranged, melee, abilities, kw, wounds=14):
    return {"id": oid, "name": name, "apl": 3, "move": '5"', "save": "3+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "plaguemarines", "source": "plague_marines", "name": "Plague Marines", "badge": "DEATH GUARD", "color": "#848A66",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Leader", "desc": "1 Plague Marine Champion", "min": 1, "max": 1, "ids": ["champion"]},
            {"name": "Operatives", "desc": "5 Plague Marine operatives from the list below", "min": 5, "max": 5,
             "ids": ["bombardier", "fighter", "pm_heavy", "icon_bearer", "plaguecaster", "pm_warrior"]},
        ],
        "rules": [
            "Select 1 Champion.",
            "Select 5 other operatives, each only once.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, a Plague Marine can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt pistol, boltgun or Psychic weapon, and it can't use the same Psychic ranged weapon for both. Plague Marines can counteract whatever their order."),
        ("Poison", "Some Plague Marine weapons have the Poison weapon rule. When you resolve attack dice with one of them and inflict damage with any successes, the target gains one of your Poison tokens (if it doesn't already have one). Friendly Plague Marines never gain it. Whenever an operative with one of your Poison tokens is activated, inflict 1 damage on it. Weapons with Toxic hit poisoned targets harder."),
        ("Disgustingly Resilient", "Whenever an attack die inflicts 3 or more damage on a Plague Marine, roll one D6: on a 4+, subtract 1 from that damage."),
    ],
    "ploys": {
        "strategy": [
            ("Cloud of Flies", "Place a marker. Plague Marines wholly within 1\" of it are obscured to shooters more than 3\" away. Removed next Strategy phase."),
            ("Nurglings", "An enemy within 3\" of a Plague Marine (or poisoned and within 7\"): -1 APL until end of its next activation."),
            ("Contagion", "Enemies that are poisoned and visible within 3\" of Plague Marines, or visible within 3\" of the Icon Bearer: -2\" Move and Hit worsened by 1 (not cumulative with injury)."),
            ("Lumbering Death", "Shooting/fighting after moving no more than 3\" this activation, or retaliating: weapons gain Ceaseless."),
        ],
        "firefight": [
            ("Sickening Resilience", "An attack dice damages a Plague Marine: until end of activation, Disgustingly Resilient always subtracts 1 (min 2) without rolling."),
            ("Curse of Rot", "Attacking an enemy within 3\" (7\" if poisoned), after it rolls: each 3 it rolled deals 1 damage to it and can't be retained or re-rolled."),
            ("Virulent Poison", "During a Plague Marine's activation: an enemy within 3\", or visible within 7\", gains your Poison token."),
            ("Poisonous Demise", "Plague Marine incapacitated: enemies visible within 3\" gain your Poison token; ones already poisoned take 1 damage instead."),
        ],
    },
    "equipment": [
        {"id": "plague_rounds", "name": "Plague Rounds", "desc": "Boltguns and bolt pistols gain Poison and Severe.", "mod": "poison_bolts"},
        {"id": "poison_vents", "name": "Poison Vents", "desc": "Enemy activated within 3\" of a Plague Marine: unpoisoned, D3 on 3 it gains Poison; poisoned, it takes D3 damage (instead of 1)."},
        {"id": "plague_bells", "name": "Plague Bells", "desc": "Ignore injured stat changes (including weapons).", "mod": "ignore_injured"},
        {"id": "blight_gren", "name": "Blight Grenades", "desc": "All Plague Marines gain a blight grenade. Max 2 uses per battle.",
         "gw": ("ranged", "Blight grenade", 4, "4+", "2/4", 'Range 6", Blast 2", Saturate, Severe, Poison', "twice per battle shared")},
    ],
    "operatives": [
        pm("champion", "Plague Marine Champion", [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [("Plague sword", 5, "3+", "4/5", "Severe, Poison, Toxic")],
           ["Grandfather's Blessing: A poisoned enemy within 7\" loses wounds: this regains up to that many (max 3 per turning point).", TOXIC],
           "LEADER, CHAMPION", wounds=15),
        pm("bombardier", "Plague Marine Bombardier", [("Boltgun", 4, "3+", "3/4", "-")], [FISTS],
           ["Grenadier: Can use blight and krak grenades without using up equipment limits; Hit +1 with them, and blight grenades gain Toxic.", TOXIC],
           "BOMBARDIER"),
        pm("fighter", "Plague Marine Fighter", [BOLT_PISTOL], [("Flail of Corruption", 5, "3+", "4/5", "Brutal, Severe, Shock, Poison")],
           ["Flail (1AP): D3+2 damage to each other operative visible within 2\" (roll each); enemies rolling a 3 on the D3 gain Poison. Counts as a Fight action. Not on Conceal."],
           "FIGHTER"),
        pm("pm_heavy", "Plague Marine Heavy Gunner", [BOLT_PISTOL, ("Plague spewer", 5, "2+", "3/3", 'Range 7", Saturate, Severe, Torrent 2", Poison')], [FISTS],
           [], "HEAVY GUNNER"),
        pm("icon_bearer", "Plague Marine Icon Bearer", [BOLT_PISTOL], [("Plague knife", 5, "3+", "3/4", "Severe, Poison")],
           ["Icon Bearer: Marker control APL +1.", "Icon of Contagion: In the opponent's territory, Contagion costs 0CP."],
           "ICON BEARER"),
        pm("plaguecaster", "Malignant Plaguecaster", [("Entropy", 4, "3+", "3/7", 'PSYCHIC, Range 7", Saturate, Severe, Poison'), ("Plague wind", 6, "3+", "2/3", 'PSYCHIC, Saturate, Severe, Torrent 1", Poison')],
           [("Corrupted staff", 4, "3+", "3/4", "PSYCHIC, Severe, Shock, Stun, Poison")],
           ["Poisonous Miasma (1AP): PSYCHIC. An enemy visible within 7\" (or a valid target) gains Poison; if already poisoned, it takes 3 damage. Not within enemy control range.",
            "Putrescent Vitality (1AP): PSYCHIC. Friendly visible within 3\": roll 2D6; a 7 heals 7, else heal the highest die. Once per turning point; not within enemy control range."],
           "PSYKER, MALIGNANT PLAGUECASTER"),
        pm("pm_warrior", "Plague Marine Warrior", [("Boltgun", 4, "3+", "3/4", "Toxic")], [("Plague knife", 4, "3+", "3/4", "Severe, Poison")],
           ["Repulsive Fortitude: When shot, defence results of 5+ are crits.", TOXIC],
           "WARRIOR"),
    ],
}
