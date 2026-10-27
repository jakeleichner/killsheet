NULL_MACE = ("Null mace", 4, "3+", "4/4", "Shock, Anti-PSYKER")
STAKE = ("Condemnor stakethrower", 4, "3+", "2/2", "Devastating 1, Piercing Crits 1, Silent, Anti-PSYKER")
BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
ANTI_PSYKER = "Anti-PSYKER (weapon rule): Against a PSYKER, it gains Lethal 5+."

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
            "Select 1 Superior, armed with a relic condemnor stakethrower, relic bolt pistol and null mace, or an inferno pistol and null mace.",
            "Select 8 other operatives. You can take up to 2 Cremators and several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Inspiration", "An operative becomes INSPIRING when it incapacitates an enemy with 6 or more Wounds, or just before it moves in a Charge. INSPIRING operatives' datacard weapons gain Severe."),
        ("Martyrdom", "When an INSPIRING operative is incapacitated, another friendly operative it's visible to or within 6\" of gains a Benediction. Ardor: +1 APL for the battle (not the Superior). Wrath: datacard weapons gain Ceaseless for the battle. Restoration: regain up to D3+2 wounds. Exigence: a free Charge of up to 3\" or a Dash, ending closer to the fallen operative."),
        ("Weapons of the Witch Hunters", "PSYCHIC ranged weapons can't damage Insidiants, and PSYCHIC actions can't pick or count them. Operatives within 3\" of an Insidiant can't use PSYCHIC actions, rules or ranged weapons, and their PSYCHIC melee weapons lose their rules (Dmg 3/4 at most)."),
        ("Anti-PSYKER", ANTI_PSYKER),
    ],
    "ploys": {
        "strategy": [
            ("Suffering & Sacrifice", "When a wounded Insidiant attacks, its weapons gain Balanced."),
            ("Holy Resilience", "When an INSPIRING operative fights or retaliates, Normal and Critical Dmg of 4 or more inflicts 1 less damage on it."),
            ("Suspect & Eliminate", "Pick an enemy (it and enemies visible within 2\" of it) or a marker (enemies contesting it). They gain Suspicion until the end of the turning point, and weapons attacking them gain Punishing."),
            ("Wrathful Determination", "When one with an Engage order is shot, re-roll one defense die."),
        ],
        "firefight": [
            ("Unshakeable Pursuit", "Use during an activation. It ignores Move changes, and an INSPIRING operative gets +1\" Move. You can use this before a Charge that makes it INSPIRING."),
            ("Fervent Hate", "After rolling attack dice against a non-IMPERIUM enemy, weapons gain Ceaseless for the sequence (Relentless against CHAOS or PSYKER)."),
            ("Glory to the Martyrs", "When one is incapacitated while fighting or retaliating, it strikes with one unresolved success first. If that kills the enemy, it becomes INSPIRING and Martyrdom triggers."),
            ("Faith & Fury", "When one fights, after a critical strike, inflict D3 damage on each other enemy visible within 2\" of it."),
        ],
    },
    "equipment": [
        {"id": "saintly_relics", "name": "Saintly Relics", "desc": "When an attack die would damage an Insidiant, roll a D6 (2D6 if INSPIRING). On any 6, ignore that damage. Once per action and twice per battle at most."},
        {"id": "auto_flagellator", "name": "Auto-flagellator", "desc": "When it's activated, roll a D6 and take half the result (rounding up) as damage. On a 4+, it becomes INSPIRING (only one per turning point this way)."},
        {"id": "psyk_out", "name": "Psyk-out Grenades", "desc": "Gives two stun grenades (and you can't take other stun grenades). When an Insidiant's stun test is 3 or more, the enemy also takes half the roll as damage (the full roll against a PSYKER)."},
        {"id": "vocifera_mortis", "name": "Vocifera Mortis", "desc": "Once per battle, Martyrdom can pick an Insidiant that isn't visible to or within 6\" of the fallen operative."},
    ],
    "operatives": [
        ci("superior", "Superior", [("Inferno pistol", 4, "3+", "4/2", 'Range 3", Devastating 3, Piercing 2'), ("Relic bolt pistol", 4, "3+", "3/5", 'Range 8", Lethal 5+'),
                                     ("Relic condemnor stakethrower", 4, "3+", "2/2", "Devastating 2, Lethal 5+, Piercing Crits 1, Silent, Anti-PSYKER")], [NULL_MACE],
           ["Loadout: a relic condemnor stakethrower, relic bolt pistol and null mace, or an inferno pistol and null mace.",
            "Holy Example: Once per turning point while it's INSPIRING, use a firefight ploy for 0CP on it. This includes Command Re-roll for its own dice.",
            "Spiritual Mentor (1AP): SUPPORT. An Insidiant visible within 6\" becomes INSPIRING. Once per turning point, and not within enemy control range.",
            ANTI_PSYKER],
           "LEADER, SUPERIOR", wounds=10, apl=3),
        ci("abjuror", "Abjuror", [], [("Blessed sword & praesidium protectiva (defensive)", 4, "3+", "4/6", "Shield"), ("Blessed sword & praesidium protectiva (offensive)", 4, "3+", "4/6", "Lethal 5+")],
           ["Shield (weapon rule): With the defensive profile, each block can block two unresolved successes.",
            "Holy Defender: Once per turning point, when an Insidiant visible within 2\" is picked as the target of a Shoot or Fight, this operative becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."],
           "ABJUROR", save="2+", wounds=11),
        ci("censor", "Censor", [], [("Virge of admonition", 4, "4+", "5/5", "Brutal, Shock, Anti-PSYKER")],
           ["Icon Bearer: Its APL counts as 1 higher for marker control.",
            "Null Field: It starts with a 1\" null range. Enemies within it get -2\" Move and a worse Hit by 1. This isn't affected by being injured.",
            "Nullifying Ritual (1AP): Its null range grows by 1\" (to a maximum of 5\"). Once per turning point, and not within enemy control range.", ANTI_PSYKER],
           "CENSOR"),
        ci("cremator", "Cremator", [("Hand flamer (standard)", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1"'), ("Hand flamer (deluge)", 4, "2+", "3/3", 'Range 4", Saturate, Seek Light, Torrent 0"')], [NULL_MACE],
           ["Inspirational Pyre: Once per turning point, when its hand flamer damages an enemy without killing it, an Insidiant within 6\" becomes INSPIRING.", ANTI_PSYKER],
           "CREMATOR"),
        ci("denuncia", "Denuncia", [("Voice of condemnation", 5, "3+", "1/1", 'Range 6", Seek, Stun')], [("Staff of declamation", 4, "3+", "3/3", "Shock")],
           ["Accusing Exorcist: While it's INSPIRING, Suspect & Eliminate costs 0CP if the chosen enemy or marker is visible to it or within 6\".",
            "Speak of Her Deeds (1AP): SUPPORT. An INSPIRING Insidiant visible within 6\" stops being INSPIRING, and another visible within 6\" gains a Benediction (not Exigence). It can't do this within enemy control range."],
           "DENUNCIA"),
        ci("mortisanctus", "Mortisanctus", [], [("Blessed broadsword", 4, "3+", "4/6", "Lethal 5+, Brutal")],
           ["Bladed Stance: When it fights or retaliates, resolve one success early, as a block.",
            "Zealous Ultimatum: STRATEGIC GAMBIT, once per battle. Challenge an enemy within 8\". If they accept, it gets +1 Atk against that enemy, and another +1 Atk for the battle once it kills it (to a maximum of 5). If they decline, that enemy gets -1 Atk when fighting or retaliating against Insidiants."],
           "MORTISANCTUS"),
        ci("reliquarius", "Reliquarius", [BOLT_PISTOL, STAKE], [("Gun butt", 3, "3+", "2/3", "-")],
           ["Simulacrum Icon Bearer: For markers contested by an enemy within 3\" of it, the enemy's total APL counts as 1 lower.",
            "Devotion: At the end of its activation, if it's INSPIRING and controls an objective or mission marker, an Insidiant it's visible to within 6\" becomes INSPIRING.", ANTI_PSYKER],
           "RELIQUARIUS"),
        ci("warrior", "Warrior", [BOLT_PISTOL, STAKE], [NULL_MACE],
           ["Inspired Strikes: While it's INSPIRING, its datacard weapons get +1 Critical Dmg.", ANTI_PSYKER], "WARRIOR"),
    ],
}
