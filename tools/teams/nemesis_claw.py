BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
BOLTGUN = ("Boltgun", 4, "3+", "3/4", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
CHAINSWORD = ("Chainsword", 5, "3+", "4/5", "-")
CRUEL = ["Cruel Tormenter: Attacking an injured enemy, or one with Wounds 7 or less: weapons gain Lethal 5+."]

def nl(oid, name, ranged, melee, abilities, kw, wounds=14):
    return {"id": oid, "name": "Night Lord " + name, "apl": 3, "move": '6"', "save": "3+", "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

GUNNERS = ["gunner_flamer", "gunner_melta", "gunner_plasma"]
HEAVIES = ["heavy_bolter", "heavy_missile"]

TEAM = {
    "id": "nemesisclaw", "source": "nemesis_claw", "name": "Nemesis Claw", "badge": "CHAOS SPACE MARINES", "color": "#2D4A8C",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Leader", "desc": "1 Visionary", "min": 1, "max": 1, "ids": ["visionary"]},
            {"name": "Operatives", "desc": "5 Night Lords from the list below", "min": 5, "max": 5,
             "ids": ["fearmonger"] + GUNNERS + HEAVIES + ["screecher", "skinthief", "ventrilokar", "warrior_chainsword", "warrior_boltgun"]},
        ],
        "repeatable": ["warrior_chainsword", "warrior_boltgun"],
        "caps": [
            {"ids": GUNNERS, "max": 1, "label": "Only 1 Gunner"},
            {"ids": HEAVIES, "max": 1, "label": "Only 1 Heavy Gunner"},
        ],
        "rules": [
            "Select 1 Visionary: bolt pistol + power fist, power maul or power weapon; or plasma pistol + Nostraman chainblade.",
            "Select 5 other operatives. Other than Warriors, each only once.",
        ],
    },
    "factionRules": [
        ("Astartes", "Each activation, a Night Lord can Shoot twice or Fight twice. If Shooting twice, one must use a bolt pistol, boltgun or scoped bolt pistol. Night Lords can counteract regardless of order."),
        ("In Midnight Clad", "A Night Lord being shot is obscured if it's more than 8\" from enemies it's visible to, and it's within 1\" of Heavy terrain that isn't lower than it or partly under Vantage terrain."),
    ],
    "ploys": {
        "strategy": [
            ("The Black Hunt", "Attacking a wounded enemy: re-roll one attack die."),
            ("Preysight", "When a Night Lord Shoots, you can give its ranged weapons Range 6\" and Seek Light for the action."),
            ("We Have Come For You", "If its first action on activation is a Charge: when it ends the move, D3 dmg to an enemy in its control range."),
            ("Return to Darkness", "One Night Lord makes a free Fall Back or Reposition of up to 4\", ending with Heavy terrain in control range or under Vantage, and not closer to enemies."),
        ],
        "firefight": [
            ("Death to the False Emperor", "After rolling attack dice vs an IMPERIUM enemy: Ceaseless for the sequence (Relentless vs ADEPTUS ASTARTES)."),
            ("Proclivity for Murder", "After killing an enemy in its control range: a free Charge (max 3\") or Dash, even if normally not allowed."),
            ("Vox Scream", "Your opponent would activate an enemy visible to a Night Lord: D6; if higher than its APL, they can't activate it this time. Otherwise the CP is refunded and you can't use this again this TP."),
            ("Dirty Fighter", "Retaliating, start of Resolve Attack Dice: resolve one success out of order; then you can't resolve any others."),
        ],
    },
    "equipment": [
        {"id": "chain_snare", "name": "Chain Snare", "desc": "The only enemy in a Night Lord's control range tries to Fall Back: roll 2D6 (1D6 if it has more Wounds); any 4+ and it can't. Once/TP."},
        {"id": "grisly_trophy", "name": "Grisly Trophy", "desc": "Once/battle, a Night Lord kills an enemy within 2\": it gains a Grisly Trophy token. Enemies visible within 2\" of it get -1 Atk."},
        {"id": "flayed_skin", "name": "Flayed Skin", "desc": "Enemies attacking a Night Lord within 2\" can't re-roll attack dice results of 1."},
        {"id": "comms_jammers", "name": "Comms Jammers", "desc": "Enemies within 3\" of a Night Lord can't have their APL added to."},
    ],
    "operatives": [
        nl("visionary", "Visionary", [BOLT_PISTOL, ("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [("Nostraman chainblade", 5, "3+", "4/5", "Rending"), ("Power fist", 5, "4+", "5/7", "Brutal"), ("Power maul", 5, "3+", "4/6", "Shock"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
           ["Loadout: bolt pistol + power fist, power maul or power weapon; or plasma pistol + Nostraman chainblade.",
            "Prescience: PSYCHIC. Ready step: gain D3 Prescience points (discarded at end of TP; none while this is incapacitated). Each once per TP: Foreboding (spend 1 to skip an activation) or Portent (spend 1 to ignore Normal Dmg from one attack dice on this).",
            "Premonition (1AP): PSYCHIC. Once/TP, spend 1 Prescience point to gain 1CP. Not within enemy control range."],
           "PSYKER, LEADER, VISIONARY", wounds=15),
        nl("fearmonger", "Fearmonger",
           [("Scoped bolt pistol (short range)", 4, "3+", "3/4", 'Range 8", Lethal 5+'), ("Scoped bolt pistol (long range)", 4, "3+", "3/4", "-"),
            ("Terrorchem vial", 5, "3+", "2/0", 'Range 6", Blast 2", Devastating 3, Limited 1, Saturate, Terrorchem')],
           [("Tainted blade", 5, "3+", "3/5", "Terrorchem")],
           ["Terrorchem (weapon rule): If any crits inflict damage (including Devastating), the target gains your Terrorchem token.",
            "Terrorchem Poison: An operative with your Terrorchem token takes D3 dmg when it activates.",
            "Poison Objective (1AP): An objective it controls (no enemy in control range, no token yet) gains your Terrorchem token. The first enemy without one to contest it takes the token and 2D3 dmg. Not within enemy control range."],
           "FEARMONGER"),
        nl("gunner_flamer", "Gunner (flamer)", [BOLT_PISTOL, ("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [FISTS], [], "GUNNER"),
        nl("gunner_melta", "Gunner (meltagun)", [BOLT_PISTOL, ("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "GUNNER"),
        nl("gunner_plasma", "Gunner (plasma gun)", [BOLT_PISTOL, ("Plasma gun (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "GUNNER"),
        nl("heavy_bolter", "Heavy Gunner (heavy bolter)", [BOLT_PISTOL, ("Heavy bolter (focused)", 5, "3+", "4/5", "Heavy (Reposition only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Heavy (Reposition only), Piercing Crits 1, Torrent 1"')], [FISTS], [], "HEAVY GUNNER"),
        nl("heavy_missile", "Heavy Gunner (missile launcher)", [BOLT_PISTOL, ("Missile launcher (frag)", 4, "3+", "3/5", 'Blast 2", Heavy (Reposition only)'), ("Missile launcher (krak)", 4, "3+", "5/7", "Heavy (Reposition only), Piercing 1")], [FISTS], [], "HEAVY GUNNER"),
        nl("screecher", "Screecher", [], [("Lightning claws", 5, "3+", "4/5", "Ceaseless, Lethal 5+")],
           ["Screecher: Enemies within 3\" can't re-roll attack dice.",
            "Appetite for Cruelty: Fighting a wounded enemy: lightning claws gain Lethal 4+."],
           "SCREECHER"),
        nl("skinthief", "Skinthief", [BOLT_PISTOL], [("Nostraman chainglaive", 5, "3+", "4/6", "Rending")],
           ["Flay Them Alive: Once/TP, it kills an enemy in its control range: another enemy visible within 6\" of either can't control markers, Pick Up or do mission actions until next TP.",
            "Tyrant of the Skinning Pits: Fighting/retaliating: Normal and Crit Dmg of 3+ inflicts 1 less on it."],
           "SKINTHIEF"),
        nl("ventrilokar", "Ventrilokar", [BOLT_PISTOL], [CHAINSWORD],
           ["Icon Bearer: Counts as APL 1 higher for marker control.",
            "Disconcerting Mimicry (1AP): PSYCHIC. An enemy within 6\": -1 APL until end of its next activation, change its order, or you move it with a free Dash (each option once per battle). Not within enemy control range."],
           "PSYKER, VENTRILOKAR"),
        nl("warrior_chainsword", "Warrior (chainsword)", [BOLT_PISTOL], [CHAINSWORD], CRUEL, "WARRIOR"),
        nl("warrior_boltgun", "Warrior (boltgun)", [BOLTGUN], [FISTS], CRUEL, "WARRIOR"),
    ],
}
