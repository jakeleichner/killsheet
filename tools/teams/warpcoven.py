BOLT_PISTOL = ("Inferno bolt pistol", 4, "3+", "3/4", 'Range 8", Piercing 1')
WARPFLAME = ("Warpflame pistol", 4, "2+", "3/3", 'Range 6", Piercing 1, Torrent 1"')
STAVE = ("Force stave", 4, "3+", "4/6", "PSYCHIC, Shock")
KHOPESH = ("Prosperine khopesh", 5, "3+", "4/6", "Lethal 5+")
BOLTGUN = ("Inferno boltgun", 4, "3+", "3/4", "Piercing 1")
FISTS = ("Fists", 3, "3+", "3/4", "-")
DAGGER = ("Dagger", 4, "4+", "3/5", "-")
AUTOMATA = "Sorcerous Automata: It gets -1 APL for its activation unless a friendly Sorcerer is within 9\"."
ICON = "Icon Bearer: Its APL counts as 1 higher for marker control."
RELIC = "Relic Hunters: Once per battle, a Tzaangor Warrior in enemy territory can Pick Up Marker, Place Marker or take a mission action for 1 less AP."
OPTIONS = [("bolt", "inferno bolt pistol", BOLT_PISTOL, None), ("khopesh", "Prosperine khopesh", None, KHOPESH), ("warpflame", "warpflame pistol", WARPFLAME, None)]

SORCERERS = {
    "destiny": ("Destiny", [("Doombolt", 4, "3+", "4/2", "PSYCHIC, Devastating 2, Lethal 5+")],
                ["Protected by Fate (1AP): PSYCHIC. Pick a visible Warpcoven operative. Until this operative's next activation, until it dies or until it uses this again, re-roll any of that operative's defence dice when it's shot. It can't do this within enemy control range.",
                 "Ravage Destiny (1AP): PSYCHIC. Pick an enemy visible within 9\". Until this operative's next activation, until it dies or until it uses this again, your opponent must re-roll that enemy's attack results of 6, and its APL counts as 1 lower for marker control. It can't do this within enemy control range."]),
    "tempyrion": ("Tempyrion", [("Fluxblast", 4, "3+", "3/4", 'PSYCHIC, Blast 2", Rending')],
                  ["Reconstitution Ritual (1AP): PSYCHIC. A Warpcoven operative visible within 6\" regains up to 2D3 wounds. Once per turning point across your team, and not within enemy control range.",
                   "Temporal Flux (1AP): PSYCHIC. Place your Temporal Flux marker in the control range of a Warpcoven operative visible within 6\". At the end of that operative's next activation, if it's still wholly within 6\" of the marker, set it back up with the marker in its control range, then remove the marker. It can't do this within enemy control range or while the marker is out."]),
    "warpfire": ("Warpfire", [("Firestorm", 5, "4+", "2/3", 'PSYCHIC, Saturate, Seek Light, Torrent 2"'), ("Mindburn", 5, "4+", "1/1", "PSYCHIC, Lethal 5+, Saturate, Seek Light, Mindburn")],
                 ["Mindburn (weapon rule): If critical successes inflict damage, the target gains your Mindburn token (a worse Hit by 1) until the end of its next activation, until it dies, or until you next use this weapon.",
                  "Alight (1AP): PSYCHIC. A visible enemy gains your Alight token until this operative's next activation, until it dies, or until it uses this again. Warpcoven weapons attacking it gain Ceaseless. It can't do this within enemy control range."]),
}

def wc(oid, name, ranged, melee, abilities, kw, apl=3, move='6"', save="3+", wounds=15):
    return {"id": oid, "name": name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def sorcerer(key, opt):
    label, psy, abil = SORCERERS[key]
    suffix, text, gun, blade = opt
    return wc(key + "_" + suffix, "Sorcerer of " + label + " (" + text + ")", ([gun] if gun else []) + psy, [STAVE] + ([blade] if blade else []),
              ["Boon of Tzeentch: Pick one for it. Each boon can only be taken once per team."] + abil, "PSYKER, SORCERER, " + label.upper())

def rubric(oid, name, ranged, abilities, kw):
    return wc(oid, "Rubric Marine " + name, ranged, [FISTS], [AUTOMATA] + abilities, "RUBRIC MARINE, " + kw, move='5"', save="2+", wounds=14)

def tz(oid, name, ranged, melee, abilities, kw, wounds=9, save="5+"):
    return wc(oid, "Tzaangor " + name, ranged, melee, abilities, "TZAANGOR, " + kw, apl=2, save=save, wounds=wounds)

SORC_IDS = [k + "_" + o[0] for k in SORCERERS for o in OPTIONS]
TZ_IDS = ["champion_axe", "champion_blade", "horn_bearer", "tz_icon_bearer", "tz_warrior_blades", "tz_warrior_shield", "tz_warrior_chainsword"]

TEAM = {
    "id": "warpcoven", "source": "warpcoven", "name": "Warpcoven", "badge": "CHAOS SPACE MARINES", "color": "#2D7A8C",
    "archetypes": "Recon, Security",
    "composition": {
        "total": 5,
        "groups": [
            {"name": "Sorcerers", "desc": "At least 1 Sorcerer", "min": 1, "max": 3, "ids": SORC_IDS},
            {"name": "Operatives", "desc": "Rubric Marines and Tzaangors", "min": 0, "max": 8,
             "ids": ["gunner_warpflamer", "gunner_soulreaper", "rubric_icon_bearer", "rubric_warrior"] + TZ_IDS},
        ],
        "pools": [{"groups": ["Sorcerers", "Operatives"], "min": 5, "max": 5, "label": "Selections (Tzaangors count as half)"}],
        "cost": {i: 0.5 for i in TZ_IDS},
        "repeatable": ["rubric_warrior", "tz_warrior_blades", "tz_warrior_shield", "tz_warrior_chainsword"],
        "caps": [
            {"ids": [i for i in SORC_IDS if i.startswith("destiny")], "max": 1, "label": "Only 1 Sorcerer of Destiny"},
            {"ids": [i for i in SORC_IDS if i.startswith("tempyrion")], "max": 1, "label": "Only 1 Sorcerer of Tempyrion"},
            {"ids": [i for i in SORC_IDS if i.startswith("warpfire")], "max": 1, "label": "Only 1 Sorcerer of Warpfire"},
            {"ids": [i for i in SORC_IDS if i.endswith("warpflame")], "max": 1, "label": "Max 1 warpflame pistol"},
            {"ids": ["gunner_warpflamer", "gunner_soulreaper"], "max": 1, "label": "Only 1 Rubric Marine Gunner"},
            {"ids": ["champion_axe", "champion_blade"], "max": 1, "label": "Only 1 Tzaangor Champion"},
        ],
        "rules": [
            "Select 5 operatives, including at least one Sorcerer. You can take several Warriors, but every other operative only once.",
            "Sorcerers carry a force stave, their PSYCHIC weapons, and an inferno bolt pistol, Prosperine khopesh or warpflame pistol.",
            "Only 1 warpflame pistol and 1 soulreaper cannon.",
            "Tzaangors count as half a selection each.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, a Heretic Astartes operative can take two Shoot actions or two Fight actions. The second Shoot costs 1 extra AP if both use a soulreaper cannon or warpflamer, and it can use the same PSYCHIC ranged weapon only once per activation. These operatives can counteract whatever their order."),
        ("Boons of Tzeentch", "Each Sorcerer takes one boon for the battle. Each boon only once per team."),
        ("Incorporeal Sight", "Ranged weapons gain Saturate, and enemies can't be obscured when it shoots."),
        ("Time-Walk", "+1\" Move."),
        ("Echoes from the Warp", "Once per battle when it counteracts, change its order and make one extra free 1AP action (a different one)."),
        ("Warp Swell", "Melee weapons get +1 Normal Dmg."),
        ("Mutant Appendage", "Enemy control range doesn't stop it taking Pick Up Marker or mission actions. Once per activation, Pick Up Marker, Place Marker or a mission action costs it 1 less AP."),
        ("Immaterial Flight", "Once per turning point, when it Charges or Repositions in its activation, it can fly instead: set it up wholly within its Move horizontally, and not in enemy control range unless it's Charging."),
        ("Twist of Fate", "PSYCHIC ranged weapons gain Piercing Crits 1."),
        ("Astral Bombardment", "One PSYCHIC ranged weapon gains Devastating 1 (the doombolt gains 2\" Devastating 2; for firestorm or mindburn, pick Seek Light or Devastating 1 for each Shoot)."),
        ("Master of the Immaterium", "Add 3\" to the distance requirements of its PSYCHIC actions (for Temporal Flux, the first effect only)."),
    ],
    "ploys": {
        "strategy": [
            ("Aetherial Warding", "When it's shot, Piercing 1 becomes Piercing Crits 1."),
            ("Savage Herd", "Tzaangor melee weapons gain Accurate 1, and also Severe if they're assisted, or fighting visible within 6\" of a Sorcerer."),
            ("Fate Itself Is My Weapon", "Roll two D6 and set them aside. This turning point, after any attack roll (before re-rolls), swap one of them in for a rolled die. That die can't be re-rolled, and you can do this once per sequence. If the two totalled less than 9, discard the other after the first use."),
            ("Brotherhood of Sorcerers", "Sorcerers' PSYCHIC weapons gain Balanced, or Ceaseless if another Sorcerer is within 9\"."),
        ],
        "firefight": [
            ("All Is Dust", "When an attack die inflicts Normal Dmg on a Rubric Marine, it inflicts 1 damage instead."),
            ("Mutant Herd", "When a Tzaangor activates, another ready Tzaangor visible within 2\" activates at the same time (alternate their actions)."),
            ("Capricious Plan", "At the end of a Sorcerer's activation, it makes a free Dash (even if it normally couldn't) or changes its order."),
            ("Psychic Cabal", "When a Sorcerer activates, it borrows one PSYCHIC action or unused PSYCHIC ranged weapon from another Sorcerer visible within 9\" for that activation. The lender can't use that weapon this turning point."),
        ],
    },
    "equipment": [
        {"id": "ensorcelled_rounds", "name": "Ensorcelled Rounds", "desc": "Inferno boltguns, inferno bolt pistols and autopistols gain Devastating 1."},
        {"id": "sorcerous_scrolls", "name": "Sorcerous Scrolls", "desc": "Once per battle, when a Sorcerer activates or counteracts, swap its boon for one no other operative has."},
        {"id": "daemonmaw_weapons", "name": "Daemonmaw Weapons", "desc": "Rubric Marines get +1 Atk on melee weapons, and Accurate 1 when retaliating."},
        {"id": "arcane_robes", "name": "Arcane Robes", "desc": "Once per turning point, Critical Dmg on a Sorcerer becomes Normal Dmg."},
    ],
    "operatives": [sorcerer(k, o) for k in SORCERERS for o in OPTIONS] + [
        rubric("gunner_warpflamer", "Gunner (warpflamer)", [("Warpflamer", 4, "2+", "4/4", 'Range 8", Saturate, Piercing 1, Torrent 2"')], [], "GUNNER"),
        rubric("gunner_soulreaper", "Gunner (soulreaper cannon)", [("Soulreaper cannon (focused)", 5, "3+", "4/5", "Piercing 1"), ("Soulreaper cannon (sweeping)", 4, "3+", "4/5", 'Piercing 1, Torrent 1"')], [], "GUNNER"),
        rubric("rubric_icon_bearer", "Icon Bearer", [BOLTGUN], [ICON], "ICON BEARER"),
        rubric("rubric_warrior", "Warrior", [BOLTGUN],
               ["Slow and Purposeful: When it shoots without having Charged or Repositioned this activation, or while counteracting, its weapons gain Ceaseless. It can still move afterwards."], "WARRIOR"),
        tz("champion_axe", "Champion (greataxe)", [], [("Greataxe", 4, "3+", "4/5", "Brutal, Lethal 5+")],
           ["Savage Brutality: After its first Fight each activation, if it's still alive, it makes a free Fight against any enemy."], "CHAMPION", wounds=10),
        tz("champion_blade", "Champion (greatblade)", [], [("Greatblade", 4, "3+", "4/5", "Lethal 5+, Rending")],
           ["Savage Brutality: After its first Fight each activation, if it's still alive, it makes a free Fight against any enemy."], "CHAMPION", wounds=10),
        tz("horn_bearer", "Horn Bearer", [], [DAGGER],
           ["Brayhorn (0AP): Tzaangors get +1\" Move until the next Ready step. It can't do this within enemy control range."], "HORN BEARER"),
        tz("tz_icon_bearer", "Icon Bearer", [], [DAGGER],
           ["Herd Banner: Normal Dmg of 3 or more on a Tzaangor visible within 3\" of it inflicts 1 less damage.", ICON], "ICON BEARER"),
        tz("tz_warrior_blades", "Warrior (blades)", [], [("Tzaangor blades", 4, "4+", "4/5", "Balanced")], [RELIC], "WARRIOR"),
        tz("tz_warrior_shield", "Warrior (blade & shield)", [], [("Tzaangor blade & shield", 4, "4+", "3/4", "Shield")],
           ["Shield (weapon rule): Its Save is 4+. When fighting or retaliating with it, each block can block two successes.", RELIC], "WARRIOR", save="4+"),
        tz("tz_warrior_chainsword", "Warrior (autopistol & chainsword)", [("Autopistol", 4, "4+", "2/3", 'Range 8"')], [("Chainsword", 4, "4+", "4/5", "-")], [RELIC], "WARRIOR"),
    ],
}
