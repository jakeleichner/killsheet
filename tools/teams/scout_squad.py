BOLT_PISTOL = ("Bolt pistol", 4, "3+", "3/4", 'Range 8"')
BOLTGUN = ("Boltgun", 4, "3+", "3/4", "-")
SHOTGUN = ("Astartes shotgun", 4, "2+", "4/4", 'Range 6"')
FISTS = ("Fists", 3, "3+", "3/4", "-")
BLADE = ("Combat blade", 4, "3+", "4/5", "-")
BIPOD = "Heavy Weapon Bipod: When it shoots with its own weapons without having moved this activation, or while counteracting, they gain Ceaseless (Relentless if they already have Ceaseless). It can still move afterwards."
ADAPTIVE = "Adaptive Equipment: Once per turning point, one Warrior can take the Smoke Grenade action and one Warrior the Stun Grenade action. Neither uses up equipment."

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
            "Select 1 Sergeant, armed with an Astartes shotgun and fists, a boltgun and fists, or a bolt pistol and chainsword.",
            "Select 8 other operatives. You can take several Warriors, but every other operative only once (the two Heavy Gunner options count as separate operatives).",
        ],
    },
    "factionRules": [
        ("Forward Scouting", "At the end of Set Up Operatives, resolve up to six of these options (the most uses for each is in brackets). If both players have this rule, take turns, starting with the player who has initiative."),
        ("Redeploy (1)", "Change where a third of your operatives are set up (rounding up)."),
        ("Reposition (2)", "An operative wholly in your drop zone makes a free Reposition, ending wholly within 3\" of it."),
        ("Trip Alarm (2)", "Place a Trip Alarm marker more than 6\" from the enemy drop zone. In the first and second turning points, Scouts shooting enemies within 2\" of it gain Seek. Remove it in the third Ready step."),
        ("Booby Trap (1)", "Place a Booby Trap marker more than 6\" from the enemy drop zone and more than 2\" from other markers, access points and Accessible terrain. When the first enemy is in its control range, remove it and inflict 2D3 damage. If the enemy survives, its action ends."),
        ("Tactical Manoeuvre (1)", "STRATEGIC GAMBIT, twice per battle: an operative gets +1 APL until the end of its next activation."),
        ("Diversion (1)", "STRATEGIC GAMBIT, once per battle: an enemy within 6\" of a killzone edge gets -1 APL until the end of its next activation."),
        ("Devise Plan (1)", "Gain 1CP."),
        ("Designate Target (1)", "An enemy gains your Target token. Scouts attacking it can re-roll one attack die."),
        ("Spy (1)", "Approved Ops only: your opponent reveals their tac op."),
    ],
    "ploys": {
        "strategy": [
            ("Guerrilla Engagement", "When a Scout in cover, and more than 6\" from enemies it's visible to, is shot, re-roll one defense die."),
            ("Ambush", "When one shoots or fights in an activation that started with a switch from Conceal to Engage, or that started with it hidden from all enemies, its weapons gain Balanced (or Ceaseless instead against an expended target)."),
            ("Adaptable Training", "Change the order of up to D3 Scouts more than 4\" from enemies."),
            ("Stealth Relocation", "Up to D3 Scouts with a Conceal order more than 4\" from enemies make a free Dash. You can't use this in the first turning point."),
        ],
        "firefight": [
            ("Astartes Training", "This activation, it can Fight twice; or Shoot twice with one of them using a shotgun, bolt pistol or boltgun; or Shoot twice with a heavy bolter, missile launcher or sniper rifle, paying 1 extra AP for the second."),
            ("Raw Physiology", "Until its next activation, it gets +1\" Move and ignores stat changes from being injured."),
            ("Emboldened Aspirant", "When it Shoots or Fights, after re-rolls, if it's your first operative to attack this turning point or the target has more Wounds, retain one normal success as a critical success."),
            ("Covert Position", "Until its next activation, while it has a Conceal order and is in cover, enemies more than 2\" away can't target it."),
        ],
    },
    "equipment": [
        {"id": "camo_cloak", "name": "Camo Cloak", "desc": "When a Scout (not the Sniper) is shot and retains cover saves, it can retain one extra. Not with Vantage terrain."},
        {"id": "targeting_oculars", "name": "Targeting Oculars", "desc": "Up to twice per turning point, as one picks a Shoot target, its ranged weapon gains Lethal 5+ and Saturate for that action."},
        {"id": "combat_blades", "name": "Combat Blades", "desc": "Scouts get a combat blade (3 Atk, 3+, 4/5). Some already carry a better one; they keep theirs. Hunters and Warriors with a combat blade get a combat knife (4 Atk, 3+, 4/5) instead, which matches the blade they already have.", "gw": ("melee", "Combat blade", 3, "3+", "4/5", "-")},
        {"id": "tactical_vox_link", "name": "Tactical Vox-link", "desc": "Once per turning point, Astartes Training or Emboldened Aspirant costs 0CP if your Sergeant is in the killzone."},
    ],
    "operatives": [
        sc("sergeant", "Sergeant", [SHOTGUN, BOLT_PISTOL, BOLTGUN], [("Chainsword", 5, "3+", "4/5", "-"), ("Fists", 4, "3+", "3/4", "-")],
           ["Loadout: an Astartes shotgun and fists, a boltgun and fists, or a bolt pistol and chainsword.",
            "Guidance and Experience: Once per activation, another Scout in the killzone gets +1 APL until the end of its next activation.",
            "Astartes: During each activation, it can take two Shoot actions (one with a shotgun, bolt pistol or boltgun) or two Fight actions. It can counteract whatever its order."],
           "LEADER, SERGEANT", apl=3, wounds=11),
        sc("heavy_bolter", "Heavy Gunner (heavy bolter)", [BOLT_PISTOL, ("Heavy bolter (focused)", 5, "3+", "4/5", "Heavy (Dash only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "3+", "4/5", 'Heavy (Dash only), Piercing Crits 1, Torrent 1"')], [FISTS], [BIPOD], "HEAVY GUNNER"),
        sc("heavy_missile", "Heavy Gunner (missile launcher)", [BOLT_PISTOL, ("Missile launcher (frag)", 4, "3+", "3/5", 'Blast 2", Heavy (Dash only)'), ("Missile launcher (krak)", 4, "3+", "5/7", "Heavy (Dash only), Piercing 1")], [FISTS], [BIPOD], "HEAVY GUNNER"),
        sc("hunter", "Hunter", [BOLT_PISTOL], [BLADE],
           ["Grapnel Launcher: Climbing counts as 2\" vertically.",
            "Grapnel Assault: If it climbs, drops, jumps or moves under Vantage terrain during a Charge, its melee weapons gain Lethal 3+ for that activation."],
           "HUNTER"),
        sc("sniper", "Sniper", [BOLT_PISTOL, ("Sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy (Dash only), Silent")], [FISTS],
           ["Camo Cloak: When it's shot, ignore Saturate. If it retains cover saves, it can retain one extra, or one as a critical success. Not with Vantage terrain.",
            "Optics (1AP): Until its next activation, enemies can't be obscured when it shoots. It can't do this within enemy control range."],
           "SNIPER"),
        sc("tracker", "Tracker", [BOLTGUN], [FISTS],
           ["Auspex Scan (1AP): Until its next activation or until it dies, when Scouts shoot enemies within 8\" of it, the target can't be obscured, and a Sniper using Optics also gains Seek Light. It can't do this within enemy control range.",
            "Track Enemy (1AP): Pick an enemy within 8\". Until the end of the turning point, Scouts shooting it gain Seek Light. It can't do this within enemy control range."],
           "TRACKER"),
        sc("warrior_shotgun", "Warrior (shotgun)", [SHOTGUN], [FISTS], [ADAPTIVE], "WARRIOR"),
        sc("warrior_boltgun", "Warrior (boltgun)", [BOLTGUN], [FISTS], [ADAPTIVE], "WARRIOR"),
        sc("warrior_blade", "Warrior (pistol & blade)", [BOLT_PISTOL], [BLADE], [ADAPTIVE], "WARRIOR"),
    ],
}
