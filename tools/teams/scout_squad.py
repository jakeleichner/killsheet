BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
BOLTGUN = ("Boltgun", 4, "3+", "3/4", "-")
SHOTGUN = ("Astartes shotgun", 4, "2+", "4/4", 'Range 6"')
FISTS = ("Fists", 3, "3+", "3/4", "-")
BLADE = ("Combat blade", 4, "3+", "4/5", "-")
BIPOD = "Heavy Weapon Bipod: Shooting with its own weapons without having moved this activation, or as a counteraction: Ceaseless (Relentless if it already has Ceaseless). It can still move afterwards."
ADAPTIVE = "Adaptive Equipment: Once/TP each, one Warrior can do the Smoke Grenade action and one can do the Stun Grenade action (doesn't use up equipment limits)."

def sc(oid, name, ranged, melee, abilities, kw, apl=2, wounds=10):
    return {"id": oid, "name": "Scout " + name, "apl": apl, "move": '6"', "save": "4+", "wounds": wounds, "pts": 28,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "scouts", "source": "scout_squad", "name": "Scout Squad", "badge": "SPACE MARINES", "color": "#4A6B3A",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 9,
        "groups": [
            {"name": "Leader", "desc": "1 Sergeant", "min": 1, "max": 1, "ids": ["sergeant"]},
            {"name": "Operatives", "desc": "8 Scouts from the list below", "min": 8, "max": 8,
             "ids": ["heavy_bolter", "heavy_missile", "hunter", "sniper", "tracker", "warrior_shotgun", "warrior_boltgun", "warrior_blade"]},
        ],
        "repeatable": ["warrior_shotgun", "warrior_boltgun", "warrior_blade"],
        "rules": [
            "Select 1 Sergeant: Astartes shotgun + fists, boltgun + fists, or bolt pistol + chainsword.",
            "Select 8 other operatives. Other than Warriors, each only once (the two Heavy Gunner options are separate entries).",
        ],
    },
    "factionRules": [
        ("Forward Scouting", "End of Set Up Operatives: resolve up to six options (max uses in brackets). If both players have this, alternate, starting with initiative."),
        ("Redeploy (1)", "Change the set up of one third of your operatives (round up)."),
        ("Reposition (2)", "A free Reposition for an operative wholly in your drop zone, ending wholly within 3\" of it."),
        ("Trip Alarm (2)", "Place a Trip Alarm marker more than 6\" from the enemy drop zone. In TPs 1 and 2, Scouts shooting enemies within 2\" of it gain Seek. Removed in the third Ready step."),
        ("Booby Trap (1)", "Place a Booby Trap marker more than 6\" from the enemy drop zone and 2\" from other markers, access points and Accessible terrain. First enemy in its control range: remove it, 2D3 dmg, and its action ends if it survives."),
        ("Tactical Manoeuvre (1)", "Twice/battle STRATEGIC GAMBIT: an operative gets +1 APL until end of its next activation."),
        ("Diversion (1)", "Once/battle STRATEGIC GAMBIT: an enemy within 6\" of a killzone edge gets -1 APL until end of its next activation."),
        ("Devise Plan (1)", "Gain 1CP."),
        ("Designate Target (1)", "An enemy gains your Target token: Scouts attacking it can re-roll one attack die."),
        ("Spy (1)", "Approved Ops only: your opponent reveals their tac op."),
    ],
    "ploys": {
        "strategy": [
            ("Guerrilla Engagement", "A Scout in cover and more than 6\" from enemies it's visible to, being shot: re-roll one defence die."),
            ("Ambush", "Shooting or fighting in an activation that started with a switch from Conceal to Engage, or while hidden from all enemies: Balanced (Ceaseless instead vs an expended target)."),
            ("Adaptable Training", "Change the order of up to D3 Scouts more than 4\" from enemies."),
            ("Stealth Relocation", "Up to D3 Concealed Scouts more than 4\" from enemies make a free Dash. Not in TP1."),
        ],
        "firefight": [
            ("Astartes Training", "This activation: Fight twice; or Shoot twice with one being a shotgun, bolt pistol or boltgun; or Shoot twice with a heavy bolter, missile launcher or sniper rifle (+1AP for the second)."),
            ("Raw Physiology", "Until its next activation: +1\" Move and ignore injured stat changes."),
            ("Emboldened Aspirant", "Shoot or Fight, after re-rolls: if it's your first operative to attack this TP, or the target has more Wounds, retain one normal as a crit."),
            ("Covert Position", "Until its next activation, while Concealed and in cover it can't be targeted (except within 2\")."),
        ],
    },
    "equipment": [
        {"id": "camo_cloak", "name": "Camo Cloak", "desc": "A Scout (not the Sniper) being shot: if retaining cover saves, retain one extra (not with Vantage)."},
        {"id": "targeting_oculars", "name": "Targeting Oculars", "desc": "Up to twice per TP, on picking a Shoot target: ranged Lethal 5+ and Saturate for that action."},
        {"id": "combat_blades", "name": "Combat Blades", "desc": "Scouts gain a combat blade (use the better one if they have it already).", "gw": ("melee", "Combat blade", 3, "3+", "4/5", "-")},
        {"id": "tactical_vox_link", "name": "Tactical Vox-link", "desc": "Once/TP, Astartes Training or Emboldened Aspirant costs 0CP if your Sergeant is in the killzone."},
    ],
    "operatives": [
        sc("sergeant", "Sergeant", [SHOTGUN, BOLT_PISTOL, BOLTGUN], [("Chainsword", 5, "3+", "4/5", "-"), ("Fists", 4, "3+", "3/4", "-")],
           ["Loadout: Astartes shotgun + fists, boltgun + fists, or bolt pistol + chainsword.",
            "Guidance and Experience: Once per activation, another Scout in the killzone gets +1 APL until end of its next activation.",
            "Astartes: Each activation it can Shoot twice (one with a shotgun, bolt pistol or boltgun) or Fight twice. It can counteract regardless of order."],
           "LEADER, SERGEANT", apl=3, wounds=11),
        sc("heavy_bolter", "Heavy Gunner (heavy bolter)", [BOLT_PISTOL, ("Heavy bolter (focused)", 5, "3+", "4/5", "Heavy (Dash only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Heavy (Dash only), Piercing Crits 1, Torrent 1"')], [FISTS], [BIPOD], "HEAVY GUNNER"),
        sc("heavy_missile", "Heavy Gunner (missile launcher)", [BOLT_PISTOL, ("Missile launcher (frag)", 4, "3+", "3/5", 'Blast 2", Heavy (Dash only)'), ("Missile launcher (krak)", 4, "3+", "5/7", "Heavy (Dash only), Piercing 1")], [FISTS], [BIPOD], "HEAVY GUNNER"),
        sc("hunter", "Hunter", [BOLT_PISTOL], [BLADE],
           ["Grapnel Launcher: Climbing up counts as 2\" vertical.",
            "Grapnel Assault: If it climbs, drops, jumps or moves under Vantage during a Charge: melee Lethal 3+ for the activation."],
           "HUNTER"),
        sc("sniper", "Sniper", [BOLT_PISTOL, ("Sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy (Dash only), Silent")], [FISTS],
           ["Camo Cloak: When shot, ignore Saturate; if retaining cover saves, retain one extra or one as a crit (not with Vantage).",
            "Optics (1AP): Until its next activation, enemies can't be obscured when it shoots. Not within enemy control range."],
           "SNIPER"),
        sc("tracker", "Tracker", [BOLTGUN], [FISTS],
           ["Auspex Scan (1AP): Until its next activation or death, Scouts shooting enemies within 8\" of this: target can't be obscured; a Sniper using Optics also gains Seek Light. Not within enemy control range.",
            "Track Enemy (1AP): An enemy within 8\": until end of TP, Scouts shooting it gain Seek Light. Not within enemy control range."],
           "TRACKER"),
        sc("warrior_shotgun", "Warrior (shotgun)", [SHOTGUN], [FISTS], [ADAPTIVE], "WARRIOR"),
        sc("warrior_boltgun", "Warrior (boltgun)", [BOLTGUN], [FISTS], [ADAPTIVE], "WARRIOR"),
        sc("warrior_blade", "Warrior (pistol & blade)", [BOLT_PISTOL], [BLADE], [ADAPTIVE], "WARRIOR"),
    ],
}
