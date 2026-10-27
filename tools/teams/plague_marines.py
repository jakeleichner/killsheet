BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
FISTS = ("Fists", 4, "3+", "3/4", "-")
TOXIC = "Toxic (weapon rule): Against an enemy that had your Poison token at the start of the action, it gets +1 Normal and Critical Dmg."

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
        ("Astartes", "During each activation, a Plague Marine can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt pistol, boltgun or PSYCHIC weapon, and it can't use the same PSYCHIC ranged weapon for both. Plague Marines can counteract whatever their order."),
        ("Poison", "Some Plague Marine weapons have the Poison weapon rule. When you resolve attack dice with one of them and inflict damage with any successes, the target gains one of your Poison tokens (if it doesn't already have one). Friendly Plague Marines never gain it. Whenever an operative with one of your Poison tokens is activated, inflict 1 damage on it. Weapons with Toxic hit poisoned targets harder."),
        ("Disgustingly Resilient", "Whenever an attack die inflicts 3 or more damage on a Plague Marine, roll one D6: on a 4+, subtract 1 from that damage."),
    ],
    "ploys": {
        "strategy": [
            ("Cloud of Flies", "Place a marker. Plague Marines wholly within 1\" of it are obscured to shooters more than 3\" away. Remove it in the next Strategy phase."),
            ("Nurglings", "An enemy within 3\" of a Plague Marine (or within 7\", if it's poisoned) gets -1 APL until the end of its next activation."),
            ("Contagion", "Poisoned enemies visible within 3\" of Plague Marines, and any enemies visible within 3\" of the Icon Bearer, get -2\" Move and a worse Hit by 1. This doesn't stack with being injured."),
            ("Lumbering Death", "When one shoots or fights after moving no more than 3\" this activation, or retaliates, its weapons gain Ceaseless."),
        ],
        "firefight": [
            ("Sickening Resilience", "When an attack die damages a Plague Marine, until the end of the activation Disgustingly Resilient always subtracts 1 (to a minimum of 2) without rolling."),
            ("Curse of Rot", "Use when attacking an enemy within 3\" (7\" if it's poisoned), after it rolls. Each 3 it rolled inflicts 1 damage on it, and that die can't be retained or re-rolled."),
            ("Virulent Poison", "During a Plague Marine's activation or counteraction, an enemy within 3\" of it, or visible within 7\", gains your Poison token."),
            ("Poisonous Demise", "When a Plague Marine is incapacitated, before it's removed, enemies visible within 3\" of it gain your Poison token if they don't have one. Then each of them with your Poison token (including ones that just gained it) takes 1 damage."),
        ],
    },
    "equipment": [
        {"id": "plague_rounds", "name": "Plague Rounds", "desc": "Boltguns and bolt pistols gain Poison and Severe.", "mod": "poison_bolts"},
        {"id": "poison_vents", "name": "Poison Vents", "desc": "When an enemy activates within 3\" of a Plague Marine: if it isn't poisoned, roll a D3, and on a 3 it gains your Poison token. If it's poisoned, it takes D3 damage instead of 1."},
        {"id": "plague_bells", "name": "Plague Bells", "desc": "Ignore stat changes from being injured, including weapon stats.", "mod": "ignore_injured"},
        {"id": "blight_gren", "name": "Blight Grenades", "desc": "All Plague Marines get a blight grenade. Your team can use them twice per battle in total.",
         "gw": ("ranged", "Blight grenade", 4, "4+", "2/4", 'Range 6", Blast 2", Saturate, Severe, Poison', "Twice per battle, shared")},
    ],
    "operatives": [
        pm("champion", "Plague Marine Champion", [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [("Plague sword", 5, "3+", "4/5", "Severe, Poison, Toxic")],
           ["Grandfather's Blessing: When an enemy with your Poison token loses wounds within 7\" of it, this operative regains up to that many lost wounds (3 per turning point at most, and not if it's incapacitated).", TOXIC],
           "LEADER, CHAMPION", wounds=15),
        pm("bombardier", "Plague Marine Bombardier", [("Boltgun", 4, "3+", "3/4", "-")], [FISTS],
           ["Grenadier: It can use blight and krak grenades without using up equipment, and gets +1 to Hit with them. Its blight grenades gain Toxic.", TOXIC],
           "BOMBARDIER"),
        pm("fighter", "Plague Marine Fighter", [BOLT_PISTOL], [("Flail of Corruption", 5, "3+", "4/5", "Brutal, Severe, Shock, Poison")],
           ["Flail (1AP): Inflict D3+2 damage on each other operative visible within 2\", rolling for each. Enemies whose D3 roll is a 3 gain your Poison token. This counts as a Fight action. It can't do this with a Conceal order."],
           "FIGHTER"),
        pm("pm_heavy", "Plague Marine Heavy Gunner", [BOLT_PISTOL, ("Plague spewer", 5, "2+", "3/3", 'Range 7", Saturate, Severe, Torrent 2", Poison')], [FISTS],
           [], "HEAVY GUNNER"),
        pm("icon_bearer", "Plague Marine Icon Bearer", [BOLT_PISTOL], [("Plague knife", 5, "3+", "3/4", "Severe, Poison")],
           ["Icon Bearer: Its APL counts as 1 higher for marker control.", "Icon of Contagion: While it's in your opponent's territory, Contagion costs 0CP."],
           "ICON BEARER"),
        pm("plaguecaster", "Malignant Plaguecaster", [("Entropy", 4, "3+", "3/7", 'PSYCHIC, Range 7", Saturate, Severe, Poison'), ("Plague wind", 6, "3+", "2/3", 'PSYCHIC, Saturate, Severe, Torrent 1", Poison')],
           [("Corrupted staff", 4, "3+", "3/4", "PSYCHIC, Severe, Shock, Stun, Poison")],
           ["Poisonous Miasma (1AP): PSYCHIC. An enemy visible within 7\" (or a valid target) gains your Poison token. If it's already poisoned, it takes 3 damage instead. It can't do this within enemy control range.",
            "Putrescent Vitality (1AP): PSYCHIC. Pick a friendly operative visible within 3\" and roll 2D6. On a total of 7, it regains 7 wounds. Otherwise, it regains wounds equal to the highest die. Once per turning point, and not within enemy control range."],
           "PSYKER, MALIGNANT PLAGUECASTER"),
        pm("pm_warrior", "Plague Marine Warrior", [("Boltgun", 4, "3+", "3/4", "Toxic")], [("Plague knife", 4, "3+", "3/4", "Severe, Poison")],
           ["Repulsive Fortitude: When it's shot, defense results of 5+ are critical successes.", TOXIC],
           "WARRIOR"),
    ],
}
