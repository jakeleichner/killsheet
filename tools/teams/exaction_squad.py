SHOTGUN = [("Combat shotgun (close range)", 4, "3+", "4/4", 'Range 6"'), ("Combat shotgun (long range)", 4, "5+", "2/2", "-")]
BATON = ("Repression baton", 3, "4+", "2/3", "-")
REPRESS = "Repress (weapon rule): Each block can block two unresolved successes; when retaliating, you resolve the first attack dice."

def arb(oid, name, ranged, melee, abilities, kw, save="4+", pts=28):
    return {"id": oid, "name": "Arbites " + name, "apl": 2, "move": '6"', "save": save, "wounds": 8, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return arb(oid, "Gunner (" + label + ")", ranged, [BATON], [], "GUNNER")

OPERATIVES = [
    arb("castigator", "Castigator", SHOTGUN, [("Excruciator maul", 4, "3+", "5/5", "Rending, Shock")],
        ["Engendered Focus: Ignore changes to its stats (including weapons, not Save).",
         "Zealous Dedication: Whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 5+, subtract 1 from that damage.",
         "Castigator's Arrest: If it's the only enemy in this operative's control range, that enemy can't Fall Back."],
        "CASTIGATOR"),
    arb("chirurgant", "Chirurgant", SHOTGUN, [BATON],
        ["Medic!: First time each turning point another friendly visible within 3\" would be incapacitated (neither in enemy control range): it stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
         "Medikit (1AP): Friendly in control range regains up to 2D3 wounds (not one saved by Medic! this turning point). Not within enemy control range."],
        "MEDIC, CHIRURGANT"),
    gunner("gunner_gl", "grenade launcher", [("Grenade launcher", 5, "4+", "4/5", "Piercing 1")]),
    gunner("gunner_stubber", "heavy stubber", [("Heavy stubber (focused)", 5, "4+", "4/5", "Heavy (Dash only)"), ("Heavy stubber (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Torrent 1"')]),
    gunner("gunner_webber", "webber", [("Webber", 4, "3+", "4/5", 'Range 12", Severe, Stun')]),
    arb("leashmaster", "Leashmaster", SHOTGUN + [("Shotpistol", 4, "4+", "3/3", 'Range 8"')], [BATON],
        ["Handler: When activated, you can activate a ready Cyber-mastiff at the same time (resolve actions in any order).",
         "Attack Pattern: STRATEGIC GAMBIT in turning point 1. Give the Cyber-mastiff two of: Aggressive (melee Relentless), Swift (+2\" Move), Defensive (Save +1).",
         "R-VR Command (0AP): Change one of the Cyber-mastiff's attack patterns."],
        "LEASHMASTER"),
    arb("cyber_mastiff", "R-VR Cyber-mastiff", [], [("Mechanical bite", 4, "4+", "3/5", "Lethal 5+")],
        ["Beast: Only Apprehend, Charge, Dash, Fall Back, Fight, Guard, Reposition, Pick Up and Place Marker; own weapons only.",
         "Apprehend (0AP): An enemy in its control range: Hit worsened by 1 (not with injury) and can't Fall Back while it stays in control range."],
        "R-VR CYBER-MASTIFF", pts=25),
    arb("malocator", "Malocator", SHOTGUN, [BATON],
        ["Acute Focus: Once per activation: Pick Up Marker, Place Marker, Veriscant or a mission action costs 1 less AP.",
         "Veriscant (1AP): A visible enemy: until this one's next activation, Exaction Squad attacking it gain Lethal 5+ and Severe. Not within enemy control range."],
        "MALOCATOR"),
    arb("marksman", "Marksman", [("Executioner shotgun (concealed)", 4, "2+", "4/0", "Devastating 4, Heavy, Silent, Concealed Position"),
                                 ("Executioner shotgun (mobile)", 4, "3+", "4/4", "-"), ("Executioner shotgun (stationary)", 4, "2+", "4/0", "Devastating 4, Heavy")], [BATON],
        ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
         "Optics (1AP): Until its next activation, concealed and stationary profiles gain Lethal 5+ and enemies can't be obscured when it shoots. Not within enemy control range."],
        "MARKSMAN"),
    arb("revelatum", "Revelatum", [("Scoped shotpistol (short range)", 4, "3+", "3/3", 'Range 8", Lethal 5+'), ("Scoped shotpistol (long range)", 4, "3+", "3/3", "-")], [BATON],
        ["First in the Field: STRATEGIC GAMBIT in turning point 1: if wholly in your drop zone, a free Reposition.",
         "Spot (1AP): An enemy visible within 8\": until end of turning point, Exaction Squad shooting it gain Seek Light and it can't be obscured. Not within enemy control range."],
        "REVELATUM"),
    arb("subductor", "Subductor", [("Shotpistol", 4, "4+", "3/3", 'Range 8"')], [("Shock maul & assault shield", 4, "4+", "4/4", "Shock, Repress")],
        ["Stubborn Subjugator: Ignore changes to its melee weapons' Hit.", REPRESS], "SUBDUCTOR", save="3+"),
    arb("vigilant", "Vigilant", SHOTGUN, [BATON],
        ["Close Quarters Vigilance: Can Shoot (not Guard) while in enemy control range, if it hasn't Charged this activation or it's a counteraction."],
        "VIGILANT"),
    arb("vox_signifier", "Vox-signifier", SHOTGUN, [BATON],
        ["Signal (1AP): SUPPORT. Another visible Exaction Squad operative: +1 APL until end of its next activation. Not within enemy control range."],
        "VOX-SIGNIFIER"),
]
LIST_IDS = [o["id"] for o in OPERATIVES]
GUNNERS = ["gunner_gl", "gunner_stubber", "gunner_webber"]

TEAM = {
    "id": "exaction", "source": "exaction_squad", "name": "Exaction Squad", "badge": "ADEPTUS ARBITES", "color": "#4E5D78",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Proctor-Exactant", "min": 1, "max": 1, "ids": ["proctor"]},
            {"name": "Operatives", "desc": "10 Exaction Squad operatives from the list below", "min": 10, "max": 10, "ids": LIST_IDS},
        ],
        "repeatable": ["subductor", "vigilant"],
        "maxCount": {"subductor": 4},
        "caps": [{"ids": GUNNERS, "max": 2, "label": "Max 2 Gunners (different weapons)"}],
        "rules": [
            "Select 1 Proctor-Exactant: combat shotgun + repression baton, or shotpistol + dominator maul & assault shield.",
            "Select 10 other operatives. Other than Gunners, Subductors and Vigilants, each only once.",
            "Max 2 Gunners (each with a different weapon) and max 4 Subductors.",
        ],
    },
    "factionRules": [
        ("Ruthless Efficiency", "Shooting (not frag/krak grenades): friendlies in an enemy's control range don't stop you targeting it."),
        ("Marked for Justice", "STRATEGIC GAMBIT: pick an enemy as your mark for the turning point. Exaction Squad attacking it gain Punishing; when it's incapacitated, pick a new mark."),
        ("Repress", REPRESS),
    ],
    "ploys": {
        "strategy": [
            ("Guilt Reveals Itself", "When selecting targets, enemies within 4\" (instead of 2\") can't be in cover (cover save only removed within 2\")."),
            ("Inviolate Jurisdiction", "Shot while within 2\" of an objective or an enemy: re-roll one defence die."),
            ("Dispense Justice", "Fighting/retaliating without having moved more than its Move stat, or counteracting: melee weapons gain Ceaseless."),
            ("Terminal Decree", "Shooting an enemy within 6\", or any Gunner shooting: ranged weapons gain Balanced."),
        ],
        "firefight": [
            ("Long Arm of the Emperor's Law", "Shooting with a Range x weapon (not frag/krak): add 3\" to x."),
            ("Exact Punishment", "After an enemy shoots or fights an Exaction Squad operative within 6\" and it survives: it makes a free Shoot or Fight against that enemy only."),
            ("Brutal Backup", "During an activation, pick an enemy in its control range: another Exaction Squad operative makes a free Fight against that enemy only."),
            ("Execution Order", "An enemy does a mission action (or controls an objective at end of Firefight): when it next activates, interrupt and activate one of yours, which must attack it first."),
        ],
    },
    "equipment": [
        {"id": "mirror_visor", "name": "Reinforced Mirror-visor", "desc": "Ignore APL changes; unaffected by enemy Shock."},
        {"id": "manacles", "name": "Manacles", "desc": "The only enemy in an Arbites' control range tries to Fall Back: roll 2D6 (1D6 if it has more Wounds); any 4+ and it can't. Once per turning point."},
        {"id": "phosphor_lumen", "name": "Strobing Phosphor-lumen", "desc": "Enemies attacking an Exaction Squad operative within 2\" can't re-roll attack dice results of 1."},
        {"id": "special_shells", "name": "Special Issue Shells", "desc": "Up to 2x/turning point with a combat or executioner shotgun or (scoped) shotpistol: gain Saturate, or Piercing 1 (target Save 3+ or better), or Torrent 1\" (one secondary target)."},
    ],
    "operatives": [
        arb("proctor", "Proctor-Exactant", [("Combat shotgun (close range)", 4, "2+", "4/4", 'Range 6"'), ("Combat shotgun (long range)", 4, "4+", "2/2", "-"), ("Shotpistol", 4, "3+", "3/3", 'Range 8"')],
            [("Dominator maul & assault shield", 4, "3+", "4/4", "Lethal 5+, Shock, Repress"), ("Repression baton", 3, "3+", "2/3", "-")],
            ["Loadout: combat shotgun + repression baton, or shotpistol + dominator maul & assault shield.",
             "Assault Shield: With the maul & shield, its Save is 3+.",
             "Nuncio-aquila: Enemies within 3\" of your Nuncio-aquila marker (or this, if the marker isn't out) pay +1AP for Pick Up Marker and mission actions; markers they contest count their total APL 1 lower.",
             "Deploy Nuncio-aquila (0AP): Place the marker within 6\" horizontally, or move it up to 6\". Removed if this is. Not within enemy control range.",
             REPRESS],
            "LEADER, PROCTOR-EXACTANT"),
    ] + OPERATIVES,
}
TEAM["operatives"][0]["wounds"] = 9
