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
        ["Medic!: The first time each turning point another friendly operative visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends. It can't be used if this operative is incapacitated, or if it's a Shoot action and this operative would be a primary or secondary target.",
         "Medikit (0AP): A friendly operative in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
        "MEDIC, COMBAT MEDIC"),
    kas("demo_trooper", "Demo-trooper", [LASPISTOL], [GUN_BUTT],
        ["Blast Padding: When it's shot by Blast or Torrent (but not a sweeping profile), re-roll one defense die. It isn't affected by x\" Devastating unless it's the target.",
         "Melta Mine: It carries your Melta Mine marker and can pick it up, but can't place it in an enemy's control range. After placing it, it gets a free Dash.",
         "Proximity Mine: The first time the mine is in another operative's control range, remove it and inflict 2D6+3 damage on that operative. If it survives, its action ends. This operative never sets it off."],
        "DEMO-TROOPER"),
    gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
    gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "3+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "3+", "4/5", "Piercing 1")]),
    gunner("gunner_volley", "hot-shot volley gun", [("Hot-shot volley gun (focused)", 5, "3+", "3/4", "Piercing Crits 1"), ("Hot-shot volley gun (sweeping)", 4, "3+", "3/4", 'Piercing Crits 1, Torrent 1"')]),
    gunner("gunner_melta", "meltagun", [("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
    gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
    kas("recon_trooper", "Recon-trooper", [LASGUN], [GUN_BUTT],
        ["Reconnoiter Killzone: Relocate costs 0CP if this is the operative you pick.",
         "Auspex Scan (1AP): Until its next activation, enemies within 8\" of it are being scanned, and Kasrkin shooting them ignore obscured. It can't do this within enemy control range."],
        "RECON-TROOPER"),
    kas("sharpshooter", "Sharpshooter", [("Hot-shot marksman rifle (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"),
                                         ("Hot-shot marksman rifle (mobile)", 4, "3+", "3/4", "-"),
                                         ("Hot-shot marksman rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [GUN_BUTT],
        ["Camo Cloak: When it's shot, ignore Saturate. If it retains cover saves, it can retain one extra, or one as a critical success. Not with Vantage terrain.",
         "Concealed Position (weapon rule): Only the first time it Shoots in the battle."],
        "SHARPSHOOTER"),
    kas("trooper", "Trooper", [LASGUN], [GUN_BUTT],
        ["Adaptive Equipment: Once per turning point, one Trooper can take the Smoke Grenade action and one Trooper the Stun Grenade action. Neither uses up equipment."],
        "TROOPER"),
    kas("vox_trooper", "Vox-trooper", [LASGUN], [GUN_BUTT],
        ["Battle Comms (1AP): Another Kasrkin gets +1 APL (to a maximum of 3) until the end of its next activation. It can do this twice per activation, but not within enemy control range."],
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
        "caps": [{"ids": MARKED, "max": 4, "label": "Up to 4 Gunners and Sharpshooters combined"}],
        "rules": [
            "Select 1 Sergeant, armed with a bolt pistol and power weapon, a hot-shot lasgun and gun butt, a hot-shot laspistol and power weapon, or a plasma pistol and chainsword.",
            "Select 9 other operatives. You can take several Troopers, but every other operative only once.",
            "Up to 4 Gunners and Sharpshooters combined.",
            "Hot-shot weapons are ranged weapons with \"hot-shot\" in their name.",
        ],
    },
    "factionRules": [
        ("Skill at Arms", "STRATEGIC GAMBIT: pick one until the next Ready step. Light 'Em Up: ranged weapons gain Severe. For Cadia!: when fighting, melee weapons get +1 Atk (to a maximum of 4) and the first strike deals 1 extra damage. Strike Fast: +1\" Move when Repositioning. Ice In Your Veins: the first Normal Dmg of 3 or more on it each sequence (fighting, retaliating or shot) inflicts 1 less damage."),
        ("Rapid Fire", "A Kasrkin that doesn't move in its activation can Shoot twice (but not Guard), using a bolt pistol, hot-shot lasgun or hot-shot laspistol for both."),
    ],
    "ploys": {
        "strategy": [
            ("Engage From Cover", "When one is shot while in cover, re-roll one defense die."),
            ("Clearance Sweep", "Place a marker. Kasrkin within 5\" of it horizontally gain Ceaseless when shooting an operative that's also within 5\". Remove it in the next Strategy phase."),
            ("Elimination Pattern", "Hot-shot weapons gain Piercing Crits 1 (Piercing 1 for the volley gun) against an operative that can't retain cover saves or is being scanned."),
            ("Relocate", "A Kasrkin more than 3\" from enemies, and others within 3\" of it that are also more than 3\" from enemies, make a free Dash. You can't use this in the first turning point."),
        ],
        "firefight": [
            ("Cover Retreat", "When a Kasrkin Falls Back while visible within 6\" of another Kasrkin (outside enemy control range), after it moves, the other makes a free Shoot. It can switch to Engage to do so."),
            ("Neutralize Target", "After rolling attack dice against an operative that can't retain cover saves or is being scanned, re-roll any of them."),
            ("Seize the Initiative", "At the start of the Firefight phase, if you don't have initiative, one Kasrkin makes a free 1AP action without moving."),
            ("Give No Ground", "Pick an objective or mission marker. If your contesting operatives' total APL is 2 and the enemy's is the same, you control it until the end of the activation (or until the next turning point, if you used this at the end of the Firefight phase)."),
        ],
    },
    "equipment": [
        {"id": "long_range_scope", "name": "Long-range Scope", "desc": "When shooting an operative more than 6\" away, hot-shot weapons gain Saturate."},
        {"id": "relics_of_cadia", "name": "Relics of Cadia", "desc": "Once per turning point when attacking, if you fail two or more attack dice, discard one failure to retain another as a normal success."},
        {"id": "foregrip", "name": "Foregrip", "desc": "When shooting an operative within 3\", datacard ranged weapons (not pistols) gain Accurate 1."},
        {"id": "combat_daggers", "name": "Combat Daggers", "desc": "Kasrkin get a combat dagger.", "gw": ("melee", "Combat dagger", 3, "4+", "3/4", "-")},
    ],
    "operatives": [
        {"id": "sergeant", "name": "Kasrkin Sergeant", "apl": 3, "move": '6"', "save": "4+", "wounds": 9, "pts": 28,
         "ranged": [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), LASGUN, LASPISTOL, ("Plasma pistol (standard)", 4, "3+", "3/5", 'Range 8", Piercing 1'),
                    ("Plasma pistol (supercharge)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
         "melee": [("Chainsword", 4, "3+", "4/5", "-"), ("Gun butt", 3, "3+", "2/3", "-"), ("Power weapon", 4, "3+", "4/6", "Lethal 5+")],
         "abilities": ["Loadout: a bolt pistol and power weapon, a hot-shot lasgun and gun butt, a hot-shot laspistol and power weapon, or a plasma pistol and chainsword.",
                       "Veteran Leadership: While it's in the killzone, Skill at Arms lets you pick one extra, different option.",
                       "Tactical Command (0AP): Give a Kasrkin an extra, different Skill at Arms until the next Ready step, or move your Clearance Sweep marker. It can't do this within enemy control range."],
         "kw": "LEADER, SERGEANT"},
    ] + OPERATIVES,
}
