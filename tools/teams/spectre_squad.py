LASCARBINE = ("Lascarbine", 4, "3+", "2/3", "Rending")
LASRIFLE = ("Lasrifle", 4, "3+", "2/3", "Heavy (Reposition only), Lethal 5+")
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")
LASPISTOL = ("Laspistol", 4, "3+", "2/3", 'Range 8"')
FISTS = ("Fists", 3, "4+", "2/3", "-")
CHOICE = "Loadout: lasrifle or lascarbine, + gun butt."
COOL = "Cool-Headed: Once per turning point, one operative with this rule can interrupt with Elite Fieldcraft for 0 Fieldcraft points."

def sp(oid, name, ranged, melee, abilities, kw, apl=2, move='6"', wounds=8, pts=28):
    return {"id": oid, "name": "Spectre " + name, "apl": apl, "move": move, "save": "5+", "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "spectres", "source": "spectre_squad", "name": "Spectre Squad", "badge": "ASTRA MILITARUM", "color": "#5A6B4A",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 11,
        "groups": [
            {"name": "Leader", "desc": "1 Veteran Sergeant", "min": 1, "max": 1, "ids": ["veteran_sergeant"]},
            {"name": "Beacon", "desc": "1 Vox-relay Beacon", "min": 1, "max": 1, "ids": ["beacon"]},
            {"name": "Operatives", "desc": "9 Spectres from the list below", "min": 9, "max": 9,
             "ids": ["field_medicae", "grenadier", "guide", "gunner_melta", "gunner_plasma", "heavy_gunner", "loader", "sharpshooter", "stub_gunner", "trooper_rifle", "trooper_carbine", "vox_operator"]},
        ],
        "repeatable": ["trooper_rifle", "trooper_carbine"],
        "caps": [{"ids": ["gunner_melta", "gunner_plasma"], "max": 1, "label": "Only 1 Gunner"}],
        "rules": [
            "Select 1 Veteran Sergeant and 1 Vox-relay Beacon.",
            "Select 9 other operatives. Other than Troopers, each only once.",
            "Field Medicae, Grenadier, Guide, Troopers and Vox-operator carry a lasrifle or lascarbine, + gun butt.",
        ],
    },
    "factionRules": [
        ("Elite Fieldcraft", "Ready step: gain 1 Fieldcraft point (2 if your Vox-operator is in the killzone out of enemy control range); discard them at end of turning point. After an enemy on Engage acts during its activation, spend 1 to interrupt: a ready Spectre not in control range of other enemies makes a free Shoot (not Guard; can change order; that enemy only, point-blank allowed), Dash or Reposition (not twice per turning point). A Dash or Reposition can't end closer to that enemy or the enemy drop zone (unless wholly in your drop zone). Once per enemy activation, and each Spectre once per turning point."),
        ("Camo Cloaks", "A Spectre (not the Beacon) being shot: if retaining cover saves, retain one extra or one as a crit (not with Vantage)."),
    ],
    "ploys": {
        "strategy": [
            ("Ambushing Volley", "A Spectre activates more than 3\" from enemies and not a valid target for them: ranged weapons (not suppressive autostubber) gain Devastating 1, or +1 to existing Devastating."),
            ("Patience", "This turning point, once: skip an activation (after your opponent's first). Or your last operative to activate gains Relentless for a Shoot or Fight."),
            ("Disappear", "One Spectre makes a free Reposition, not ending closer to enemies or their drop zone (unless wholly in your drop zone); it can't Reposition again this turning point."),
            ("Hidden Engagement", "Shooting while in cover from the target's view: Balanced."),
        ],
        "firefight": [
            ("Sharp Reactions", "After a Concealed enemy within 8\" of a Spectre acts: you can use Elite Fieldcraft to interrupt anyway."),
            ("Prepared Defence", "A Concealed or ready Spectre retaliating: resolve one success early as a block, or one block can block two successes. Not in an activation you interrupted."),
            ("Dodge", "This activation, Fall Back costs 1 less AP."),
            ("Silent Killers", "A Concealed Spectre that isn't a valid target for enemies: this activation it can Charge while Concealed, and its first strike can deal +3 damage (then no other successes)."),
        ],
    },
    "equipment": [
        {"id": "starshell_flare", "name": "Starshell Flare", "desc": "STRATEGIC GAMBIT: a Spectre makes a free Stun Grenade action. Once it changes an enemy's APL, you can't use this again."},
        {"id": "advanced_camouflage", "name": "Advanced Camouflage", "desc": "Spectres (not the Beacon) gain Advanced Camouflage (1AP): until its next activation, while Concealed and in cover it can't be targeted (except within 2\"). Not visible within 3\" of an enemy."},
        {"id": "sniper_overwatch", "name": "Sniper Overwatch", "desc": "Once per turning point, a Spectre can use the sniper overwatch weapon.", "gw": ("ranged", "Sniper overwatch", 4, "3+", "3/3", "Devastating 2, Heavy (Dash only), Saturate, Silent")},
        {"id": "tvid_feed", "name": "Tvid-feed Triangulation", "desc": "Once per turning point on picking a Shoot target: it can't be obscured if it's also a valid target for another Spectre, or within 6\" of your Beacon."},
    ],
    "operatives": [
        sp("veteran_sergeant", "Veteran Sergeant", [("Scoped lascarbine", 4, "3+", "2/3", "Lethal 5+, Rending")], [("Bionic arm", 3, "3+", "3/4", "-")],
           ["Issue Mission (0AP): An expended Spectre (not the Beacon) visible to this that hasn't interrupted with Elite Fieldcraft this turning point can do so while expended this turning point; if it does, it can't counteract this turning point or Reposition again. Not within enemy control range."],
           "LEADER, VETERAN SERGEANT", wounds=9),
        sp("beacon", "Vox-relay Beacon", [], [],
           ["Pre-Deploy: Can set up outside your drop zone, wholly in your territory, more than 2\" from markers and equipment terrain.",
            "Expendable: Only Signal; can't counteract, retaliate, assist, contest markers or areas. Ignored for kill/elimination ops and escape/survive conditions. Operatives can move through it; enemies and your shooters can ignore its control range.",
            "Signal (1AP): Another Spectre within 6\": +1 APL until end of its next activation. Not within enemy control range."],
           "VOX-RELAY BEACON", apl=1, move='0"', wounds=3, pts=25),
        sp("field_medicae", "Field Medicae", [LASCARBINE, LASRIFLE], [GUN_BUTT],
           [CHOICE, "Medic!: First time each turning point another Spectre (not the Beacon) visible within 3\" would be incapacitated (neither in enemy control range, not if this is a target of that Shoot): it stays on 1 wound, can't be incapacitated that action, then a free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
            "Medikit (0AP): A Spectre (not the Beacon) in control range regains up to 2D3 wounds (not one saved by Medic! this turning point). Not within enemy control range."],
           "FIELD MEDICAE"),
        sp("grenadier", "Grenadier", [LASCARBINE, LASRIFLE], [GUN_BUTT],
           [CHOICE, "Grenadier: Can use frag, krak and smoke grenades without using up equipment limits; frag/krak Hit +1.",
            "Melta Mine: It carries your Melta Mine marker and can pick it up; after placing it, a free Dash. It can't place it in enemy control range.",
            "Proximity Mine: First time the mine is in another operative's control range: remove it, 2D6+3 damage, and its action ends if it survives. This operative never sets it off."],
           "GRENADIER"),
        sp("guide", "Guide", [LASCARBINE, LASRIFLE], [GUN_BUTT],
           [CHOICE, "Prepared Killzone: One extra equipment option, which must be an Ammo Cache or equipment terrain.",
            "Scout Terrain: Terrain in your territory or within 3\" of this is scouted. Once per activation, a Spectre can ignore the first 2\" of a climb up scouted terrain, or Operate Hatch on a scouted access point for 1 less AP."],
           "GUIDE"),
        sp("gunner_melta", "Gunner (meltagun)", [("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [GUN_BUTT], [], "GUNNER"),
        sp("gunner_plasma", "Gunner (plasma gun)", [("Plasma gun (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [GUN_BUTT], [], "GUNNER"),
        sp("heavy_gunner", "Heavy Gunner", [LASPISTOL, ("Missile launcher (frag)", 4, "3+", "3/5", 'Blast 2", Heavy'), ("Missile launcher (krak)", 4, "3+", "5/7", "Heavy, Piercing 1")], [FISTS],
           ["Weapons Team: If your Loader is in its control range when it activates, its missile launcher has Heavy (Dash only) instead of Heavy for that activation."],
           "HEAVY GUNNER"),
        sp("loader", "Loader", [LASPISTOL], [FISTS],
           ["Weapon Assist: Another Spectre in its control range shooting: re-roll one attack die.",
            "Load Weapon (1AP): A Spectre in its control range, not within 3\" of enemies, makes a free Shoot (not Guard; can change order). Not in enemy control range, while counteracting, or in an activation with Charge, Dash or Shoot."],
           "LOADER"),
        sp("sharpshooter", "Sharpshooter", [("Long-las (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Long-las (mobile)", 4, "3+", "3/4", "-"), ("Long-las (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [GUN_BUTT],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle."],
           "SHARPSHOOTER"),
        sp("stub_gunner", "Stub-gunner", [("Autostubber (focused)", 5, "3+", "3/4", "Heavy (Dash only)"), ("Autostubber (suppressive)", 5, "5+", "0/0", 'Heavy, Lethal 5+, Seek Light, Stun, Torrent 1"'), ("Autostubber (sweeping)", 4, "3+", "3/4", 'Heavy (Dash only), Torrent 1"')], [FISTS],
           ["Suppressive Fire: On Engage, enemies visible within 3\" get -1 Atk (min 1), unless this is in control range of other enemies or Charged this turning point."],
           "STUB-GUNNER"),
        sp("trooper_rifle", "Trooper (lasrifle)", [LASRIFLE], [GUN_BUTT], [COOL], "TROOPER"),
        sp("trooper_carbine", "Trooper (lascarbine)", [LASCARBINE], [GUN_BUTT], [COOL], "TROOPER"),
        sp("vox_operator", "Vox-operator", [LASCARBINE, LASRIFLE], [GUN_BUTT],
           [CHOICE, "Signal (1AP): SUPPORT. Another Spectre (not the Beacon) visible to this: +1 APL until end of its next activation. Not within enemy control range."],
           "VOX-OPERATOR"),
    ],
}
