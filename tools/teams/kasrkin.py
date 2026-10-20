LASGUN = ("Hot-shot lasgun", 4, "3+", "3/4", "-")
LASPISTOL = ("Hot-shot laspistol", 4, "3+", "3/4", 'Range 8"')
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")

def kas(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": "Kasrkin " + name, "apl": 2, "move": '6"', "save": "4+", "wounds": 8, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def gunner(oid, label, ranged):
    return kas(oid, "Gunner (" + label + ")", ranged, [GUN_BUTT], [], "GUNNER")

OPERATIVES = [
    kas("combat_medic", "Combat Medic", [LASGUN], [GUN_BUTT],
        ["Medic!: First time each turning point another friendly visible within 3\" would be incapacitated (neither in enemy control range): it stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
         "Medikit (0AP): Friendly in control range regains up to 2D3 wounds (not one saved by Medic! this turning point). Not within enemy control range."],
        "MEDIC, COMBAT MEDIC"),
    kas("demo_trooper", "Demo-trooper", [LASPISTOL], [GUN_BUTT],
        ["Blast Padding: Shot by Blast/Torrent (not sweeping profiles): re-roll one defence die. Unaffected by x\" Devastating unless the target.",
         "Melta Mine: Carries your Melta Mine marker; can Pick Up it, and after Placing it (not in enemy control range) gets a free Dash.",
         "Proximity Mine: First time the mine is in another operative's control range: remove it and inflict 2D6+3 damage; if it survives, its action ends. This operative is ignored."],
        "DEMO-TROOPER"),
    gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
    gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "3+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "3+", "4/5", "Piercing 1")]),
    gunner("gunner_volley", "hot-shot volley gun", [("Hot-shot volley gun (focused)", 5, "3+", "3/4", "Piercing Crits 1"), ("Hot-shot volley gun (sweeping)", 4, "3+", "3/4", 'Piercing Crits 1, Torrent 1"')]),
    gunner("gunner_melta", "meltagun", [("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
    gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
    kas("recon_trooper", "Recon-trooper", [LASGUN], [GUN_BUTT],
        ["Reconnoitre Killzone: Relocate costs 0CP if this is the selected operative.",
         "Auspex Scan (1AP): Until its next activation, enemies within 8\" of it are being scanned; Kasrkin shooting them ignore obscured. Not within enemy control range."],
        "RECON-TROOPER"),
    kas("sharpshooter", "Sharpshooter", [("Hot-shot marksman rifle (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"),
                                         ("Hot-shot marksman rifle (mobile)", 4, "3+", "3/4", "-"),
                                         ("Hot-shot marksman rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [GUN_BUTT],
        ["Camo Cloak: When shot: ignore Saturate; if retaining cover saves, retain one extra or one as a crit (not with Vantage).",
         "Concealed Position (weapon rule): Only the first time it Shoots in the battle."],
        "SHARPSHOOTER"),
    kas("trooper", "Trooper", [LASGUN], [GUN_BUTT],
        ["Adaptive Equipment: Once per turning point each, one Trooper can do the Smoke Grenade action and one the Stun Grenade action (doesn't use equipment limits)."],
        "TROOPER"),
    kas("vox_trooper", "Vox-trooper", [LASGUN], [GUN_BUTT],
        ["Battle Comms (1AP): Another Kasrkin: +1 APL (max 3) until end of its next activation. Twice per activation; not within enemy control range."],
        "VOX-TROOPER"),
]
LIST_IDS = [o["id"] for o in OPERATIVES]
MARKED = ["gunner_flamer", "gunner_gl", "gunner_volley", "gunner_melta", "gunner_plasma", "sharpshooter"]

TEAM = {
    "id": "kasrkin", "source": "kasrkin", "name": "Kasrkin", "badge": "ASTRA MILITARUM", "color": "#8A6F4E",
    "archetypes": "Security, Seek & Destroy",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Kasrkin Sergeant", "min": 1, "max": 1, "ids": ["sergeant"]},
            {"name": "Operatives", "desc": "9 Kasrkin operatives from the list below", "min": 9, "max": 9, "ids": LIST_IDS},
        ],
        "repeatable": ["trooper"],
        "caps": [{"ids": MARKED, "max": 4, "label": "Max 4 Gunners and Sharpshooter combined"}],
        "rules": [
            "Select 1 Sergeant: bolt pistol + power weapon, hot-shot lasgun + gun butt, hot-shot laspistol + power weapon, or plasma pistol + chainsword.",
            "Select 9 other operatives. Other than Troopers, each only once.",
            "Max 4 Gunners and Sharpshooter combined.",
            "Hot-shot weapons are ranged weapons with 'hot-shot' in the name.",
        ],
    },
    "factionRules": [
        ("Skill at Arms", "STRATEGIC GAMBIT: pick one until the next Ready step. Light 'Em Up: ranged weapons gain Severe. For Cadia!: +1 melee Atk (max 4) and +1 damage on the first strike when fighting. Strike Fast: +1\" Move when Repositioning. Ice In Your Veins: first Normal Dmg of 3+ on it each sequence (fighting, retaliating or shot) inflicts 1 less."),
        ("Rapid Fire", "A Kasrkin that doesn't move in its activation can Shoot twice (not Guard), using a bolt pistol, hot-shot lasgun or hot-shot laspistol for both."),
    ],
    "ploys": {
        "strategy": [
            ("Engage From Cover", "Shot while in cover: re-roll one defence die."),
            ("Clearance Sweep", "Place a marker: Kasrkin within 5\" horizontally of it shooting an operative also within 5\" gain Ceaseless. Removed next Strategy phase."),
            ("Elimination Pattern", "Hot-shot weapons against an operative that can't retain cover saves or is being scanned: Piercing Crits 1 (volley gun: Piercing 1)."),
            ("Relocate", "A Kasrkin more than 3\" from enemies, and others within 3\" of it (also more than 3\" from enemies), make a free Dash. Not in the first turning point."),
        ],
        "firefight": [
            ("Cover Retreat", "A Kasrkin Falls Back visible within 6\" of another (not in enemy control range): after moving, that other makes a free Shoot (can switch to Engage)."),
            ("Neutralise Target", "After rolling attack dice against an operative that can't retain cover saves or is being scanned: re-roll any."),
            ("Seize the Initiative", "Start of the Firefight phase, if you don't have initiative: one Kasrkin makes a free 1AP action without moving."),
            ("Give No Ground", "Pick an objective or mission marker: if your contesting total APL is 2 and the enemy's is equal, you control it (until end of activation, or next turning point if used at end of Firefight)."),
        ],
    },
    "equipment": [
        {"id": "long_range_scope", "name": "Long-range Scope", "desc": "Shooting an operative more than 6\" away: hot-shot weapons gain Saturate."},
        {"id": "relics_of_cadia", "name": "Relics of Cadia", "desc": "Once per turning point attacking: with 2+ fails, discard one to retain another as a normal success."},
        {"id": "foregrip", "name": "Foregrip", "desc": "Shooting an operative within 3\": datacard ranged weapons (not pistols) gain Accurate 1."},
        {"id": "combat_daggers", "name": "Combat Daggers", "desc": "Kasrkin gain a combat dagger.", "gw": ("melee", "Combat dagger", 3, "4+", "3/4", "-")},
    ],
    "operatives": [
        {"id": "sergeant", "name": "Kasrkin Sergeant", "apl": 3, "move": '6"', "save": "4+", "wounds": 9, "pts": 28,
         "ranged": [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), LASGUN, LASPISTOL, ("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'),
                    ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
         "melee": [("Chainsword", 4, "3+", "4/5", "-"), ("Gun butt", 3, "3+", "2/3", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
         "abilities": ["Loadout: bolt pistol + power weapon, hot-shot lasgun + gun butt, hot-shot laspistol + power weapon, or plasma pistol + chainsword.",
                       "Veteran Leadership: While in killzone, Skill at Arms picks one extra (different) option.",
                       "Tactical Command (0AP): Give a Kasrkin an extra (different) Skill at Arms until the next Ready step, or move your Clearance Sweep marker. Not within enemy control range."],
         "kw": "LEADER, SERGEANT"},
    ] + OPERATIVES,
}
