BOLT_PISTOL = ("Inferno bolt pistol", 4, "3+", "3/4", 'Range 8", Piercing 1')
WARPFLAME = ("Warpflame pistol", 4, "2+", "3/3", 'Range 6", Piercing 1, Torrent 1"')
STAVE = ("Force stave", 4, "3+", "4/6", "PSYCHIC, Shock")
KHOPESH = ("Prosperine khopesh", 5, "3+", "4/6", "Lethal 5+")
BOLTGUN = ("Inferno boltgun", 4, "3+", "3/4", "Piercing 1")
FISTS = ("Fists", 3, "3+", "3/4", "-")
DAGGER = ("Dagger", 4, "4+", "3/5", "-")
AUTOMATA = "Sorcerous Automata: -1 APL for its activation unless a friendly Sorcerer is within 9\"."
ICON = "Icon Bearer: Counts as APL 1 higher for marker control."
RELIC = "Relic Hunters: Once/battle, a Tzaangor Warrior in enemy territory can Pick Up, Place Marker or do a mission action for 1 less AP."
OPTIONS = [("bolt", "inferno bolt pistol", BOLT_PISTOL, None), ("khopesh", "Prosperine khopesh", None, KHOPESH), ("warpflame", "warpflame pistol", WARPFLAME, None)]

SORCERERS = {
    "destiny": ("Destiny", [("Doombolt", 4, "3+", "4/2", "PSYCHIC, Devastating 2, Lethal 5+")],
                ["Protected by Fate (1AP): PSYCHIC. A visible Warpcoven operative: until this one's next activation, its death or a re-use, re-roll any defence dice when it's shot. Not within enemy control range.",
                 "Ravage Destiny (1AP): PSYCHIC. An enemy visible within 9\": until this one's next activation, its death or a re-use, the opponent must re-roll its attack results of 6, and it counts as APL 1 lower for marker control. Not within enemy control range."]),
    "tempyrion": ("Tempyrion", [("Fluxblast", 4, "3+", "3/4", 'PSYCHIC, Blast 2", Rending')],
                  ["Reconstitution Ritual (1AP): PSYCHIC. A Warpcoven operative visible within 6\" regains up to 2D3 wounds. Once per TP across your team; not within enemy control range.",
                   "Temporal Flux (1AP): PSYCHIC. Place your Temporal Flux marker in the control range of a Warpcoven operative visible within 6\". At the end of its next activation, if it's still wholly within 6\" of the marker, set it back up with the marker in its control range, then remove the marker. Not within enemy control range or while the marker is out."]),
    "warpfire": ("Warpfire", [("Firestorm", 5, "4+", "2/3", 'PSYCHIC, Saturate, Seek Light, Torrent 2"'), ("Mindburn", 5, "4+", "1/1", "PSYCHIC, Lethal 5+, Saturate, Seek Light, Mindburn")],
                 ["Mindburn (weapon rule): If crits inflict damage, the target gains your Mindburn token (Hit worsened by 1) until the end of its next activation, its death or your next use of this weapon.",
                  "Alight (1AP): PSYCHIC. A visible enemy gains your Alight token until this one's next activation, its death or a re-use: Warpcoven attacking it gain Ceaseless. Not within enemy control range."]),
}

def wc(oid, name, ranged, melee, abilities, kw, apl=3, move='6"', save="3+", wounds=15):
    return {"id": oid, "name": name, "apl": apl, "move": move, "save": save, "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def sorcerer(key, opt):
    label, psy, abil = SORCERERS[key]
    suffix, text, gun, blade = opt
    return wc(key + "_" + suffix, "Sorcerer of " + label + " (" + text + ")", ([gun] if gun else []) + psy, [STAVE] + ([blade] if blade else []),
              ["Boon of Tzeentch: pick one for it (each boon once per team)."] + abil, "PSYKER, SORCERER, " + label.upper())

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
            "Select 5 operatives, including at least one Sorcerer. Other than Warriors, each only once.",
            "Sorcerers have a force stave, their PSYCHIC weapons, and an inferno bolt pistol, Prosperine khopesh or warpflame pistol.",
            "Max 1 warpflame pistol and 1 soulreaper cannon.",
            "Tzaangors count as half a selection each.",
        ],
    },
    "factionRules": [
        ("Astartes", "Each activation, a Heretic Astartes operative can Shoot twice or Fight twice (+1AP for the second if both use a soulreaper cannon or warpflamer). The same PSYCHIC ranged weapon only once per activation. They can counteract regardless of order."),
        ("Boons of Tzeentch", "Each Sorcerer takes one boon for the battle; each boon once per team."),
        ("Incorporeal Sight", "Ranged weapons gain Saturate; enemies can't be obscured when it shoots."),
        ("Time-Walk", "+1\" Move."),
        ("Echoes from the Warp", "Once/battle when it counteracts: change its order and make one extra free 1AP action (a different one)."),
        ("Warp Swell", "+1 Normal Dmg on melee weapons."),
        ("Mutant Appendage", "Enemy control range doesn't stop Pick Up or mission actions. Once per activation, Pick Up, Place Marker or a mission action costs 1 less AP."),
        ("Immaterial Flight", "Once/TP, when it Charges or Repositions in its activation, it can FLY (set up wholly within its Move horizontally; not in enemy control range unless Charging)."),
        ("Twist of Fate", "PSYCHIC ranged weapons gain Piercing Crits 1."),
        ("Astral Bombardment", "One PSYCHIC ranged weapon gains Devastating 1 (doombolt: 2\" Devastating 2; firestorm or mindburn: pick Seek Light or Devastating 1 each Shoot)."),
        ("Master of the Immaterium", "+3\" to the distance requirements of its PSYCHIC actions (Temporal Flux: first effect only)."),
    ],
    "ploys": {
        "strategy": [
            ("Aetherial Warding", "Being shot: Piercing 1 becomes Piercing Crits 1."),
            ("Savage Herd", "Tzaangor melee weapons gain Accurate 1; also Severe if assisted, or fighting visible within 6\" of a Sorcerer."),
            ("Fate Itself Is My Weapon", "Roll two D6 and set them aside. This TP, after any attack roll (before re-rolls), swap one in for a rolled die (no re-roll; one per sequence). If both totalled under 9, discard the other after the first use."),
            ("Brotherhood of Sorcerers", "Sorcerers' PSYCHIC weapons gain Balanced, or Ceaseless if another Sorcerer is within 9\"."),
        ],
        "firefight": [
            ("All Is Dust", "An attack dice inflicts Normal Dmg on a Rubric Marine: it inflicts 1 instead."),
            ("Mutant Herd", "A Tzaangor activates: another ready Tzaangor visible within 2\" activates at the same time (alternate actions)."),
            ("Capricious Plan", "End of a Sorcerer's activation: a free Dash (even if normally not allowed), or change its order."),
            ("Psychic Cabal", "A Sorcerer activates: it borrows one PSYCHIC action or unused PSYCHIC ranged weapon from another Sorcerer visible within 9\" for the activation (the lender can't use that weapon this TP)."),
        ],
    },
    "equipment": [
        {"id": "ensorcelled_rounds", "name": "Ensorcelled Rounds", "desc": "Inferno boltguns, inferno bolt pistols and autopistols gain Devastating 1."},
        {"id": "sorcerous_scrolls", "name": "Sorcerous Scrolls", "desc": "Once/battle when a Sorcerer activates or counteracts: swap its boon for one no other operative has."},
        {"id": "daemonmaw_weapons", "name": "Daemonmaw Weapons", "desc": "Rubric Marines get +1 melee Atk, and Accurate 1 when retaliating."},
        {"id": "arcane_robes", "name": "Arcane Robes", "desc": "Once/TP, Critical Dmg on a Sorcerer becomes Normal Dmg."},
    ],
    "operatives": [sorcerer(k, o) for k in SORCERERS for o in OPTIONS] + [
        rubric("gunner_warpflamer", "Gunner (warpflamer)", [("Warpflamer", 4, "2+", "4/4", 'Range 8", Saturate, Piercing 1, Torrent 2"')], [], "GUNNER"),
        rubric("gunner_soulreaper", "Gunner (soulreaper cannon)", [("Soulreaper cannon (focused)", 5, "3+", "4/5", "Piercing 1"), ("Soulreaper cannon (sweeping)", 4, "3+", "4/5", 'Piercing 1, Torrent 1"')], [], "GUNNER"),
        rubric("rubric_icon_bearer", "Icon Bearer", [BOLTGUN], [ICON], "ICON BEARER"),
        rubric("rubric_warrior", "Warrior", [BOLTGUN],
               ["Slow and Purposeful: Shooting without having Charged or Repositioned this activation, or as a counteraction: Ceaseless. It can still move afterwards."], "WARRIOR"),
        tz("champion_axe", "Champion (greataxe)", [], [("Greataxe", 4, "3+", "4/5", "Brutal, Lethal 5+")],
           ["Savage Brutality: After its first Fight each activation, if alive: a free Fight (any enemy)."], "CHAMPION", wounds=10),
        tz("champion_blade", "Champion (greatblade)", [], [("Greatblade", 4, "3+", "4/5", "Lethal 5+, Rending")],
           ["Savage Brutality: After its first Fight each activation, if alive: a free Fight (any enemy)."], "CHAMPION", wounds=10),
        tz("horn_bearer", "Horn Bearer", [], [DAGGER],
           ["Brayhorn (0AP): Tzaangors get +1\" Move until the next Ready step. Not within enemy control range."], "HORN BEARER"),
        tz("tz_icon_bearer", "Icon Bearer", [], [DAGGER],
           ["Herd Banner: Normal Dmg of 3+ on a Tzaangor visible within 3\" of this inflicts 1 less.", ICON], "ICON BEARER"),
        tz("tz_warrior_blades", "Warrior (blades)", [], [("Tzaangor blades", 4, "4+", "4/5", "Balanced")], [RELIC], "WARRIOR"),
        tz("tz_warrior_shield", "Warrior (blade & shield)", [], [("Tzaangor blade & shield", 4, "4+", "3/4", "Shield")],
           ["Shield (weapon rule): Save 4+; fighting/retaliating with it, each block can block two successes.", RELIC], "WARRIOR", save="4+"),
        tz("tz_warrior_chainsword", "Warrior (autopistol & chainsword)", [("Autopistol", 4, "4+", "2/3", 'Range 8"')], [("Chainsword", 4, "4+", "4/5", "-")], [RELIC], "WARRIOR"),
    ],
}
