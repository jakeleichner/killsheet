NULL_MACE = ("Null mace", 4, "3+", "4/4", "Shock, Anti-PSYKER")
STAKE = ("Condemnor stakethrower", 4, "3+", "2/2", "Devastating 1, Piercing Crits 1, Silent, Anti-PSYKER")
BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
ANTI_PSYKER = "Anti-PSYKER (weapon rule): Against a PSYKER: gains Lethal 5+."

def ci(oid, name, ranged, melee, abilities, kw, save="3+", wounds=9, apl=2):
    return {"id": oid, "name": "Insidiant " + name, "apl": apl, "move": '6"', "save": save, "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "celestians", "source": "celestian_insidiants", "name": "Celestian Insidiants", "badge": "ADEPTA SORORITAS", "color": "#D9A441",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 9,
        "groups": [
            {"name": "Leader", "desc": "1 Superior", "min": 1, "max": 1, "ids": ["superior"]},
            {"name": "Operatives", "desc": "8 Celestian Insidiant operatives from the list below", "min": 8, "max": 8,
             "ids": ["abjuror", "censor", "cremator", "denuncia", "mortisanctus", "reliquarius", "warrior"]},
        ],
        "repeatable": ["cremator", "warrior"],
        "maxCount": {"cremator": 2},
        "rules": [
            "Select 1 Superior: relic condemnor stakethrower + relic bolt pistol + null mace, or inferno pistol + null mace.",
            "Select 8 other operatives. Other than Cremators and Warriors, each only once. Max 2 Cremators.",
        ],
    },
    "factionRules": [
        ("Inspiration", "An operative becomes INSPIRING when it incapacitates an enemy with a Wounds stat of 6+, or before it moves in a Charge. INSPIRING operatives' datacard weapons gain Severe."),
        ("Martyrdom", "When an INSPIRING operative is incapacitated, another friendly it's visible to or within 6\" of gains a Benediction: Ardour (+1 APL for the battle; not the Superior), Wrath (datacard weapons gain Ceaseless for the battle), Restoration (regain up to D3+2 wounds) or Exigence (free Charge up to 3\" or Dash, ending closer to the fallen operative)."),
        ("Weapons of the Witch Hunters", "PSYCHIC ranged weapons can't damage Insidiants, and PSYCHIC actions can't pick or count them. Operatives within 3\" of an Insidiant: no PSYCHIC actions/rules/ranged weapons; PSYCHIC melee weapons lose their rules (Dmg max 3/4)."),
        ("Anti-PSYKER", ANTI_PSYKER),
    ],
    "ploys": {
        "strategy": [
            ("Suffering & Sacrifice", "A wounded Insidiant attacking: weapons gain Balanced."),
            ("Holy Resilience", "INSPIRING operative fighting/retaliating: Normal and Critical Dmg of 4+ inflicts 1 less."),
            ("Suspect & Eliminate", "Pick an enemy (it and enemies visible within 2\" of it) or a marker (enemies contesting it): they gain Suspicion until end of turning point. Attacking them gives Punishing."),
            ("Wrathful Determination", "Shot while on Engage: re-roll one defence die."),
        ],
        "firefight": [
            ("Unshakeable Pursuit", "During an activation: ignore Move changes; INSPIRING operatives get +1\" Move (can be used before a Charge that makes it INSPIRING)."),
            ("Fervent Hate", "After rolling attack dice against a non-IMPERIUM enemy: weapons gain Ceaseless (Relentless against CHAOS or PSYKER) for the sequence."),
            ("Glory to the Martyrs", "Incapacitated while fighting/retaliating: strike with one unresolved success first; if that kills the enemy, it becomes INSPIRING and Martyrdom triggers."),
            ("Faith & Fury", "Fighting, after a crit strike: D3 damage to each other enemy visible within 2\"."),
        ],
    },
    "equipment": [
        {"id": "saintly_relics", "name": "Saintly Relics", "desc": "An attack dice would damage an Insidiant: roll D6 (2D6 if INSPIRING); any 6 ignores it. Max once per action and twice per battle."},
        {"id": "auto_flagellator", "name": "Auto-flagellator", "desc": "On activation: roll D6, take half (round up) as damage; on 4+ it becomes INSPIRING (max one per turning point this way)."},
        {"id": "psyk_out", "name": "Psyk-out Grenades", "desc": "Gives two stun grenades (no other stun grenades). Insidiant stun tests of 3+ also deal half the roll as damage (the full roll against a PSYKER)."},
        {"id": "vocifera_mortis", "name": "Vocifera Mortis", "desc": "Once per battle, Martyrdom can pick an Insidiant that isn't visible to or within 6\" of the fallen one."},
    ],
    "operatives": [
        ci("superior", "Superior", [("Inferno pistol", 4, "3+", "4/2", 'Range 3", Devastating 3, Piercing 2'), ("Relic bolt pistol", 4, "3+", "3/5", 'Range 8", Lethal 5+'),
                                     ("Relic condemnor stakethrower", 4, "3+", "2/2", "Devastating 2, Lethal 5+, Piercing Crits 1, Silent, Anti-PSYKER")], [NULL_MACE],
           ["Loadout: relic condemnor stakethrower + relic bolt pistol + null mace, or inferno pistol + null mace.",
            "Holy Example: Once per turning point while INSPIRING: a firefight ploy for 0CP on this operative (including Command Re-roll for its dice).",
            "Spiritual Mentor (1AP): SUPPORT. An Insidiant visible within 6\" becomes INSPIRING. Once per turning point; not within enemy control range.",
            ANTI_PSYKER],
           "LEADER, SUPERIOR", wounds=10, apl=3),
        ci("abjuror", "Abjuror", [], [("Blessed sword & praesidium protectiva (defensive)", 4, "3+", "4/6", "Shield"), ("Blessed sword & praesidium protectiva (offensive)", 4, "3+", "4/6", "Lethal 5+")],
           ["Shield (weapon rule): With the defensive profile, each block can block two unresolved successes.",
            "Holy Defender: Once per turning point, an Insidiant visible within 2\" is targeted by a Shoot or Fight: this becomes the target instead (cover/obscured only if the original was). Not against Blast/Torrent."],
           "ABJUROR", save="2+", wounds=11),
        ci("censor", "Censor", [], [("Virge of admonition", 4, "4+", "5/5", "Brutal, Shock, Anti-PSYKER")],
           ["Icon Bearer: Marker control APL +1.",
            "Null Field: Starts with a 1\" null range. Enemies within it: -2\" Move and Hit worsened by 1 (not with injury).",
            "Nullifying Ritual (1AP): +1\" null range (max 5\"). Once per turning point; not within enemy control range.", ANTI_PSYKER],
           "CENSOR"),
        ci("cremator", "Cremator", [("Hand flamer (standard)", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1"'), ("Hand flamer (deluge)", 4, "2+", "3/3", 'Range 4", Saturate, Seek Light, Torrent 0"')], [NULL_MACE],
           ["Inspirational Pyre: Once per turning point, its hand flamer damages but doesn't kill an enemy: an Insidiant within 6\" becomes INSPIRING.", ANTI_PSYKER],
           "CREMATOR"),
        ci("denuncia", "Denuncia", [("Voice of condemnation", 5, "3+", "1/1", 'Range 6", Seek, Stun')], [("Staff of declamation", 4, "3+", "3/3", "Shock")],
           ["Accusing Exorcist: While INSPIRING, Suspect & Eliminate costs 0CP if the chosen enemy or marker is visible or within 6\" of it.",
            "Speak of Her Deeds (1AP): SUPPORT. An INSPIRING Insidiant visible within 6\" stops being INSPIRING; another visible within 6\" gains a Benediction (not Exigence). Not within enemy control range."],
           "DENUNCIA"),
        ci("mortisanctus", "Mortisanctus", [], [("Blessed broadsword", 4, "3+", "4/6", "Lethal 5+, Brutal")],
           ["Bladed Stance: Fighting/retaliating, resolve one success early, as a block.",
            "Zealous Ultimatum: Once per battle STRATEGIC GAMBIT: challenge an enemy within 8\". Accepted: +1 Atk against it, and another +1 for the battle once it kills it (max 5). Declined: it gets -1 Atk against Insidiants."],
           "MORTISANCTUS"),
        ci("reliquarius", "Reliquarius", [BOLT_PISTOL, STAKE], [("Gun butt", 3, "3+", "2/3", "-")],
           ["Simulacrum Icon Bearer: Markers contested by an enemy within 3\" of it count the enemy total APL 1 lower.",
            "Devotion: End of its activation, if INSPIRING and controlling an objective or mission marker: an Insidiant it's visible to within 6\" becomes INSPIRING.", ANTI_PSYKER],
           "RELIQUARIUS"),
        ci("warrior", "Warrior", [BOLT_PISTOL, STAKE], [NULL_MACE],
           ["Inspired Strikes: While INSPIRING, its datacard weapons get +1 Critical Dmg.", ANTI_PSYKER], "WARRIOR"),
    ],
}
