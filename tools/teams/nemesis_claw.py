BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
BOLTGUN = ("Boltgun", 4, "3+", "3/4", "-")
FISTS = ("Fists", 4, "3+", "3/4", "-")
CHAINSWORD = ("Chainsword", 5, "3+", "4/5", "-")
CRUEL = ["Cruel Tormenter: When it attacks an injured enemy, or one with 7 or fewer Wounds, its weapons gain Lethal 5+."]

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
            "Select 1 Visionary, armed with a bolt pistol plus a power fist, power maul or power weapon, or with a plasma pistol and Nostraman chainblade.",
            "Select 5 other operatives. You can take several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Astartes", "During each activation, a Night Lord can take two Shoot actions or two Fight actions. If it shoots twice, at least one of those shots must use a bolt pistol, boltgun or scoped bolt pistol. Night Lords can counteract whatever their order."),
        ("In Midnight Clad", "A Night Lord is obscured when shot if it's more than 8\" from enemies it's visible to, and it's within 1\" of Heavy terrain that isn't lower than it, or partly under Vantage terrain."),
    ],
    "ploys": {
        "strategy": [
            ("The Black Hunt", "When attacking a wounded enemy, re-roll one attack die."),
            ("Preysight", "When a Night Lord Shoots, you can give its ranged weapons Range 6\" and Seek Light for that action."),
            ("We Have Come For You", "If its first action when activated is a Charge, inflict D3 damage on an enemy in its control range when it ends the move."),
            ("Return to Darkness", "One Night Lord makes a free Fall Back or Reposition of up to 4\", ending with Heavy terrain in its control range or under Vantage terrain, and no closer to enemies."),
        ],
        "firefight": [
            ("Death to the False Emperor", "After rolling attack dice against an IMPERIUM enemy, weapons gain Ceaseless for the sequence (Relentless against ADEPTUS ASTARTES)."),
            ("Proclivity for Murder", "After it kills an enemy in its control range, it makes a free Charge (up to 3\") or Dash, even if it normally couldn't."),
            ("Vox Scream", "When your opponent would activate an enemy visible to a Night Lord, roll a D6. If it beats that enemy's APL, they can't activate it this time. Otherwise, you get the CP back and can't use this again this turning point."),
            ("Dirty Fighter", "When one retaliates, at the start of the Resolve Attack Dice step, resolve one success out of order. Then you can't resolve any others."),
        ],
    },
    "equipment": [
        {"id": "chain_snare", "name": "Chain Snare", "desc": "Once per turning point, when the only enemy in a Night Lord's control range tries to Fall Back, roll 2D6 (1D6 if the enemy has more Wounds). On any 4+, it can't."},
        {"id": "grisly_trophy", "name": "Grisly Trophy", "desc": "Once per battle, when a Night Lord kills an enemy within 2\", it gains a Grisly Trophy token. Enemies visible within 2\" of it get -1 Atk."},
        {"id": "flayed_skin", "name": "Flayed Skin", "desc": "Enemies attacking a Night Lord within 2\" can't re-roll attack dice results of 1."},
        {"id": "comms_jammers", "name": "Comms Jammers", "desc": "Enemies within 3\" of a Night Lord can't have their APL increased."},
    ],
    "operatives": [
        nl("visionary", "Visionary", [BOLT_PISTOL, ("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [("Nostraman chainblade", 5, "3+", "4/5", "Rending"), ("Power fist", 5, "4+", "5/7", "Brutal"), ("Power maul", 5, "3+", "4/6", "Shock"), ("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
           ["Loadout: a bolt pistol plus a power fist, power maul or power weapon, or a plasma pistol and Nostraman chainblade.",
            "Prescience: PSYCHIC. In the Ready step, gain D3 Prescience points (discard them at the end of the turning point, and gain none while this operative is incapacitated). Each option once per turning point. Foreboding: spend 1 to skip an activation. Portent: spend 1 to ignore the Normal Dmg from one attack die on this operative.",
            "Premonition (1AP): PSYCHIC. Once per turning point, spend 1 Prescience point to gain 1CP. It can't do this within enemy control range."],
           "PSYKER, LEADER, VISIONARY", wounds=15),
        nl("fearmonger", "Fearmonger",
           [("Scoped bolt pistol (short range)", 4, "3+", "3/4", 'Range 8", Lethal 5+'), ("Scoped bolt pistol (long range)", 4, "3+", "3/4", "-"),
            ("Terrorchem vial", 5, "3+", "2/0", 'Range 6", Blast 2", Devastating 3, Limited 1, Saturate, Terrorchem')],
           [("Tainted blade", 5, "3+", "3/5", "Terrorchem")],
           ["Terrorchem (weapon rule): If any critical successes inflict damage (Devastating included), the target gains your Terrorchem token.",
            "Terrorchem Poison: An operative with your Terrorchem token takes D3 damage when it activates.",
            "Poison Objective (1AP): An objective it controls (with no enemy in its control range and no token yet) gains your Terrorchem token. The first enemy without a token to contest it takes the token and 2D3 damage. It can't do this within enemy control range."],
           "FEARMONGER"),
        nl("gunner_flamer", "Gunner (flamer)", [BOLT_PISTOL, ("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [FISTS], [], "GUNNER"),
        nl("gunner_melta", "Gunner (meltagun)", [BOLT_PISTOL, ("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [FISTS], [], "GUNNER"),
        nl("gunner_plasma", "Gunner (plasma gun)", [BOLT_PISTOL, ("Plasma gun (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [FISTS], [], "GUNNER"),
        nl("heavy_bolter", "Heavy Gunner (heavy bolter)", [BOLT_PISTOL, ("Heavy bolter (focused)", 5, "3+", "4/5", "Heavy (Reposition only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Heavy (Reposition only), Piercing Crits 1, Torrent 1"')], [FISTS], [], "HEAVY GUNNER"),
        nl("heavy_missile", "Heavy Gunner (missile launcher)", [BOLT_PISTOL, ("Missile launcher (frag)", 4, "3+", "3/5", 'Blast 2", Heavy (Reposition only)'), ("Missile launcher (krak)", 4, "3+", "5/7", "Heavy (Reposition only), Piercing 1")], [FISTS], [], "HEAVY GUNNER"),
        nl("screecher", "Screecher", [], [("Lightning claws", 5, "3+", "4/5", "Ceaseless, Lethal 5+")],
           ["Screecher: Enemies within 3\" of it can't re-roll attack dice.",
            "Appetite for Cruelty: When it fights a wounded enemy, its lightning claws gain Lethal 4+."],
           "SCREECHER"),
        nl("skinthief", "Skinthief", [BOLT_PISTOL], [("Nostraman chainglaive", 5, "3+", "4/6", "Rending")],
           ["Flay Them Alive: Once per turning point, when it kills an enemy in its control range, pick another enemy visible within 6\" of either. Until the next turning point, that enemy can't control markers, Pick Up Marker or take mission actions.",
            "Tyrant of the Skinning Pits: When it fights or retaliates, Normal and Critical Dmg of 3 or more inflicts 1 less damage on it."],
           "SKINTHIEF"),
        nl("ventrilokar", "Ventrilokar", [BOLT_PISTOL], [CHAINSWORD],
           ["Icon Bearer: Its APL counts as 1 higher for marker control.",
            "Disconcerting Mimicry (1AP): PSYCHIC. Pick an enemy within 6\". Give it -1 APL until the end of its next activation, change its order, or move it with a free Dash (each option once per battle). It can't do this within enemy control range."],
           "PSYKER, VENTRILOKAR"),
        nl("warrior_chainsword", "Warrior (chainsword)", [BOLT_PISTOL], [CHAINSWORD], CRUEL, "WARRIOR"),
        nl("warrior_boltgun", "Warrior (boltgun)", [BOLTGUN], [FISTS], CRUEL, "WARRIOR"),
    ],
}
