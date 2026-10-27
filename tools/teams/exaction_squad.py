SHOTGUN = [("Combat shotgun (close range)", 4, "3+", "4/4", 'Range 6"'), ("Combat shotgun (long range)", 4, "5+", "2/2", "-")]
BATON = ("Repression baton", 3, "4+", "2/3", "-")
REPRESS = "Repress (weapon rule): Each block can block two unresolved successes. When retaliating, you resolve the first attack die."

def arb(oid, name, ranged, melee, abilities, kw, save="4+", pts=28):
    return {"id": oid, "name": "Arbites " + name, "apl": 2, "move": '6"', "save": save, "wounds": 8, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return arb(oid, "Gunner (" + label + ")", ranged, [BATON], [], "GUNNER")

OPERATIVES = [
    arb("castigator", "Castigator", SHOTGUN, [("Excruciator maul", 4, "3+", "5/5", "Rending, Shock")],
        ["Engendered Focus: It ignores changes to its stats, including weapon stats but not Save.",
         "Zealous Dedication: Whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 5+, subtract 1 from that damage.",
         "Castigator's Arrest: If an enemy is the only one in its control range, that enemy can't Fall Back."],
        "CASTIGATOR"),
    arb("chirurgant", "Chirurgant", SHOTGUN, [BATON],
        ["Medic!: The first time each turning point another friendly operative visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
         "Medikit (1AP): A friendly operative in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
        "MEDIC, CHIRURGANT"),
    gunner("gunner_gl", "grenade launcher", [("Grenade launcher", 5, "4+", "4/5", "Piercing 1")]),
    gunner("gunner_stubber", "heavy stubber", [("Heavy stubber (focused)", 5, "4+", "4/5", "Heavy (Dash only)"), ("Heavy stubber (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Torrent 1"')]),
    gunner("gunner_webber", "webber", [("Webber", 4, "3+", "4/5", 'Range 12", Severe, Stun')]),
    arb("leashmaster", "Leashmaster", SHOTGUN + [("Shotpistol", 4, "4+", "3/3", 'Range 8"')], [BATON],
        ["Handler: When it's activated, you can activate a ready Cyber-mastiff at the same time, resolving their actions in any order.",
         "Attack Pattern: STRATEGIC GAMBIT in the first turning point. Give the Cyber-mastiff two of these: Aggressive (melee weapons gain Relentless), Swift (+2\" Move), Defensive (improve Save by 1).",
         "R-VR Command (0AP): Change one of the Cyber-mastiff's attack patterns."],
        "LEASHMASTER"),
    arb("cyber_mastiff", "R-VR Cyber-mastiff", [], [("Mechanical bite", 4, "4+", "3/5", "Lethal 5+")],
        ["Beast: It can only Apprehend, Charge, Dash, Fall Back, Fight, Guard, Reposition, Pick Up Marker and Place Marker, and only with its own weapons.",
         "Apprehend (0AP): Pick an enemy in its control range. While it stays there, that enemy gets a worse Hit by 1 (not affected by being injured) and can't Fall Back."],
        "R-VR CYBER-MASTIFF", pts=25),
    arb("malocator", "Malocator", SHOTGUN, [BATON],
        ["Acute Focus: Once per activation, Pick Up Marker, Place Marker, Veriscant or a mission action costs it 1 less AP.",
         "Veriscant (1AP): Pick a visible enemy. Until this operative's next activation, Exaction Squad weapons attacking it gain Lethal 5+ and Severe. It can't do this within enemy control range."],
        "MALOCATOR"),
    arb("marksman", "Marksman", [("Executioner shotgun (concealed)", 4, "2+", "4/0", "Devastating 4, Heavy, Silent, Concealed Position"),
                                 ("Executioner shotgun (mobile)", 4, "3+", "4/4", "-"), ("Executioner shotgun (stationary)", 4, "2+", "4/0", "Devastating 4, Heavy")], [BATON],
        ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
         "Optics (1AP): Until its next activation, its concealed and stationary profiles gain Lethal 5+, and enemies can't be obscured when it shoots. It can't do this within enemy control range."],
        "MARKSMAN"),
    arb("revelatum", "Revelatum", [("Scoped shotpistol (short range)", 4, "3+", "3/3", 'Range 8", Lethal 5+'), ("Scoped shotpistol (long range)", 4, "3+", "3/3", "-")], [BATON],
        ["First in the Field: STRATEGIC GAMBIT in the first turning point. If it's wholly in your drop zone, it makes a free Reposition.",
         "Spot (1AP): Pick an enemy visible within 8\". Until the end of the turning point, Exaction Squad weapons shooting it gain Seek Light, and it can't be obscured. It can't do this within enemy control range."],
        "REVELATUM"),
    arb("subductor", "Subductor", [("Shotpistol", 4, "4+", "3/3", 'Range 8"')], [("Shock maul & assault shield", 4, "4+", "4/4", "Shock, Repress")],
        ["Stubborn Subjugator: It ignores changes to its melee weapons' Hit.", REPRESS], "SUBDUCTOR", save="3+"),
    arb("vigilant", "Vigilant", SHOTGUN, [BATON],
        ["Close Quarters Vigilance: It can Shoot (but not Guard) while in enemy control range, if it hasn't Charged this activation or it's counteracting."],
        "VIGILANT"),
    arb("vox_signifier", "Vox-signifier", SHOTGUN, [BATON],
        ["Signal (1AP): SUPPORT. Another visible Exaction Squad operative gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
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
            "Select 1 Proctor-Exactant, armed with a combat shotgun and repression baton, or a shotpistol with a dominator maul and assault shield.",
            "Select 10 other operatives. You can take several Gunners, Subductors and Vigilants, but every other operative only once.",
            "Up to 2 Gunners (each with a different weapon) and up to 4 Subductors.",
        ],
    },
    "factionRules": [
        ("Ruthless Efficiency", "When shooting (not with frag or krak grenades), friendly operatives in an enemy's control range don't stop you targeting it."),
        ("Marked for Justice", "STRATEGIC GAMBIT: pick an enemy as your mark for the turning point. Exaction Squad weapons attacking it gain Punishing. When it's incapacitated, pick a new mark."),
        ("Repress", REPRESS),
    ],
    "ploys": {
        "strategy": [
            ("Guilt Reveals Itself", "When picking targets, enemies within 4\" (instead of 2\") can't be in cover. They only lose their cover save within 2\"."),
            ("Inviolate Jurisdiction", "When one is shot while within 2\" of an objective or an enemy, re-roll one defense die."),
            ("Dispense Justice", "When one fights or retaliates without having moved more than its Move this activation, or while counteracting, melee weapons gain Ceaseless."),
            ("Terminal Decree", "When one shoots an enemy within 6\", or a Gunner shoots anything, ranged weapons gain Balanced."),
        ],
        "firefight": [
            ("Long Arm of the Emperor's Law", "When shooting with a Range x weapon (not frag or krak grenades), add 3\" to x."),
            ("Exact Punishment", "After an enemy shoots or fights an Exaction Squad operative within 6\" and that operative survives, it makes a free Shoot or Fight against that enemy only."),
            ("Brutal Backup", "Use during an activation. Pick an enemy in its control range. Another Exaction Squad operative makes a free Fight against that enemy only."),
            ("Execution Order", "Use when an enemy does a mission action (or controls an objective at the end of the Firefight phase). When it next activates, interrupt and activate one of yours, which must attack it first."),
        ],
    },
    "equipment": [
        {"id": "mirror_visor", "name": "Reinforced Mirror-visor", "desc": "They ignore APL changes and aren't affected by enemy Shock."},
        {"id": "manacles", "name": "Manacles", "desc": "Once per turning point, when the only enemy in an Arbites' control range tries to Fall Back, roll 2D6 (1D6 if the enemy has more Wounds). On any 4+, it can't."},
        {"id": "phosphor_lumen", "name": "Strobing Phosphor-lumen", "desc": "Enemies attacking an Exaction Squad operative within 2\" can't re-roll attack dice results of 1."},
        {"id": "special_shells", "name": "Special Issue Shells", "desc": "Up to twice per turning point, a combat or executioner shotgun or (scoped) shotpistol gains one of: Saturate, Piercing 1 (if the target's Save is 3+ or better), or Torrent 1\" (one secondary target)."},
    ],
    "operatives": [
        arb("proctor", "Proctor-Exactant", [("Combat shotgun (close range)", 4, "2+", "4/4", 'Range 6"'), ("Combat shotgun (long range)", 4, "4+", "2/2", "-"), ("Shotpistol", 4, "3+", "3/3", 'Range 8"')],
            [("Dominator maul & assault shield", 4, "3+", "4/4", "Lethal 5+, Shock, Repress"), ("Repression baton", 3, "3+", "2/3", "-")],
            ["Loadout: a combat shotgun and repression baton, or a shotpistol with a dominator maul and assault shield.",
             "Assault Shield: With the maul and shield, its Save is 3+.",
             "Nuncio-aquila: Enemies within 3\" of your Nuncio-aquila marker (or this operative, if the marker isn't out) pay 1 extra AP for Pick Up Marker and mission actions. For markers they contest, their total APL counts as 1 lower.",
             "Deploy Nuncio-aquila (0AP): Place the marker within 6\" horizontally, or move it up to 6\". Remove it if this operative is removed. It can't do this within enemy control range.",
             REPRESS],
            "LEADER, PROCTOR-EXACTANT"),
    ] + OPERATIVES,
}
TEAM["operatives"][0]["wounds"] = 9
