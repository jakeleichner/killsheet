GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")
AUTOGUN = ("Autogun", 4, "4+", "2/3", "-")
SHOTGUN = ("Shotgun", 4, "3+", "3/3", 'Range 6"')
BIPOD = "Heavy Weapon Bipod: When it shoots with its own weapons without having moved this activation, or while counteracting, they gain Ceaseless (Relentless if they already have Ceaseless). It can still move afterwards."
ICON = ["Icon Bearer: Its APL counts as 1 higher for marker control.",
        "Overthrow the Oppressors: Once per turning point, when a ready Neophyte visible within 6\" is incapacitated, it makes a free Shoot before it's removed (and can change order), or you can use A Plan Generations in the Making on it for 0CP."]
GROUP = ["Group Activation: When it's expended, you must activate another ready Warrior (if you can) before your opponent activates (no more than two in a row)."]

def wb(oid, name, ranged, melee, abilities, kw, apl=2, save="5+", wounds=7, pts=25):
    return {"id": oid, "name": name, "apl": apl, "move": '6"', "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def agent(oid, name, ranged, melee, abilities, kw):
    return wb(oid, name, ranged, melee, abilities, "CULT AGENT, " + kw, apl=3, save="4+", wounds=9, pts=32)

GUNNERS = ["gunner_flamer", "gunner_launcher", "gunner_webber"]
HEAVIES = ["heavy_stubber", "heavy_laser", "heavy_seismic"]
AGENTS = ["kelermorph", "locus", "sanctus_sniper", "sanctus_talon"]

TEAM = {
    "id": "wyrmblade", "source": "wyrmblade", "name": "Wyrmblade", "badge": "GENE\u00adSTEALER CULTS", "color": "#7A4A8C",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 14,
        "groups": [
            {"name": "Leader", "desc": "1 Neophyte Leader", "min": 1, "max": 1, "ids": ["leader"]},
            {"name": "Operatives", "desc": "13 selections from the list below (Cult Agents count as two)", "min": 13, "max": 13,
             "ids": AGENTS + GUNNERS + HEAVIES + ["icon_autogun", "icon_shotgun", "warrior_autogun", "warrior_shotgun"]},
        ],
        "cost": {i: 2 for i in AGENTS},
        "repeatable": ["warrior_autogun", "warrior_shotgun"],
        "caps": [
            {"ids": GUNNERS, "max": 2, "label": "Max 2 Gunners"},
            {"ids": HEAVIES, "max": 2, "label": "Max 2 Heavy Gunners"},
            {"ids": AGENTS, "max": 2, "label": "Max 2 Cult Agents"},
            {"ids": ["icon_autogun", "icon_shotgun"], "max": 1, "label": "Only 1 Icon Bearer"},
        ],
        "rules": [
            "Select 1 Neophyte Leader, armed with an autogun and gun butt, a shotgun and gun butt, or a bolt pistol, master-crafted autopistol or web pistol with a chainsword, power maul or power pick.",
            "Make 13 selections. You can take several Warriors, but every other operative only once. The Kelermorph, Locus, Sanctus Sniper and Sanctus Talon count as two selections each.",
            "Up to 2 Gunners, 2 Heavy Gunners and 2 Cult Agents.",
        ],
    },
    "factionRules": [
        ("Familiar Territory", "A third of your team (not Cult Agents) can start in hiding. When one activates, expend it or have it emerge: set it up wholly within 6\" of your drop zone, more than 6\" from enemies, with any order. This counts as a Reposition (Warriors ignore Group Activation). Any still hiding at the end of the second turning point are incapacitated."),
        ("Cult Agent", "Enemies shooting a Cult Agent ignore Piercing and Saturate. If it retains cover saves, it can retain one extra, or one as a critical success. Not with Vantage terrain."),
        ("Cult Ambush", "When one shoots or fights in an activation that started with a switch from Conceal to Engage, or while hidden from all enemies at its start, its weapons gain Ceaseless."),
    ],
    "ploys": {
        "strategy": [
            ("The Day Is at Hand", "When one switches from Conceal to Engage as it activates, its ranged weapons gain Rending and its melee weapons get +1 Atk (to a maximum of 5) that activation."),
            ("Crossfire", "When shooting an enemy that another Wyrmblade operative shot this turning point, weapons gain Accurate 1."),
            ("One with the Shadows", "An operative with a Conceal order is obscured when shot with Light terrain intervening (unless it or the shooter is within 1\" of that terrain)."),
            ("Divert and Disappear", "Up to three operatives make a free Dash or Charge of up to 3\". A Cult Agent counts as two, and can Fall Back up to 3\" instead, then gets -1 APL until the end of its next activation."),
        ],
        "firefight": [
            ("Slink into Darkness", "At the end of an activation, an operative with an Engage order switches to Conceal. Each operative once per battle."),
            ("Coiled Serpent", "In the first Shoot or Fight of an activation that started with a switch from Conceal to Engage, after rolling, retain one normal success as a critical success (once per activation)."),
            ("Unquestioning Loyalty", "When a Cult Agent or the Leader is picked as the target of a Shoot or Fight, another Neophyte (not the Leader) visible within 3\" takes its place. No effect against Blast or Torrent."),
            ("A Plan Generations in the Making", "When a Neophyte is incapacitated, it makes a free mission action before it's removed."),
        ],
    },
    "equipment": [
        {"id": "blasting_charges", "name": "Blasting Charges", "desc": "Once per turning point, a Neophyte can use a blasting charge.", "gw": ("ranged", "Blasting charge", 4, "4+", "3/5", 'Range 4", Blast 1", Saturate'), "ex": AGENTS},
        {"id": "cult_knives", "name": "Cult Knives", "desc": "Neophytes get a cult knife.", "gw": ("melee", "Cult knife", 3, "4+", "3/4", "-"), "ex": AGENTS},
        {"id": "explosive_traps", "name": "Explosive Traps", "desc": "Select two mines (you can't also take the universal mines). Wyrmblade operatives don't set them off or take damage from them."},
        {"id": "spotlights", "name": "Spotlights", "desc": "When shooting, the target can't be obscured if it's visible within 6\" of a Neophyte that isn't in enemy control range."},
    ],
    "operatives": [
        wb("leader", "Neophyte Leader",
           [AUTOGUN[:2] + ("3+",) + AUTOGUN[3:], ("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Master-crafted autopistol", 4, "3+", "2/4", 'Range 8", Lethal 5+'), ("Shotgun", 4, "2+", "3/3", 'Range 6"'), ("Web pistol", 4, "3+", "3/4", 'Range 6", Severe, Stun')],
           [("Chainsword", 4, "3+", "4/5", "-"), GUN_BUTT, ("Power maul", 4, "3+", "4/6", "Shock"), ("Power pick", 4, "3+", "4/5", "Rending")],
           ["Loadout: an autogun and gun butt, a shotgun and gun butt, or a bolt pistol, master-crafted autopistol or web pistol with a chainsword, power maul or power pick.",
            "Shadow Vector: Once per turning point, Slink into Darkness or Coiled Serpent costs 0CP on a Neophyte visible to it."],
           "NEOPHYTE, LEADER", wounds=8),
        agent("kelermorph", "Kelermorph",
              [("Liberator autostubs (hypersense)", 5, "3+", "3/4", 'Range 6", Saturate, Seek Light, Hypersense'), ("Liberator autostubs (long range)", 4, "4+", "3/4", "Piercing Crits 1, Rending"), ("Liberator autostubs (short range)", 5, "3+", "3/4", 'Range 8", Piercing 1, Rending')],
              [("Kelermorph knife", 3, "4+", "3/4", "Rending")],
              ["Hypersense (weapon rule): Enemies can't be obscured.",
               "Expert Gunslinger: It can Shoot twice in each activation.",
               "Heroic Inspiration: If it has killed an enemy this turning point, Neophytes visible within 3\" of it gain Severe when attacking."],
              "KELERMORPH"),
        agent("locus", "Locus", [("Barbed tail", 4, "3+", "3/4", 'Range 3", Silent')], [("Locus blades", 5, "3+", "4/6", "Lethal 5+")],
              ["Expert Swordsman: It can Fight twice in each activation. After a Fight, if it's outside enemy control range, it makes a free Charge of up to 3\", even if it already Charged. It can still Dash.",
               "Quicksilver Strike: Once per turning point, after an enemy moves or is set up, it makes a free Charge of up to 3\" ending in that enemy's control range. It can switch to Engage to do so.",
               "Bladed Stance: When it fights or retaliates, resolve one success early, as a block."],
              "LOCUS"),
        agent("sanctus_sniper", "Sanctus Sniper", [("Sanctus sniper rifle (mobile)", 4, "3+", "3/4", "-"), ("Sanctus sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy (Dash only), Silent")], [("Fists", 4, "3+", "2/4", "-")],
              ["Target Vulnerability (1AP): Its stationary profile gains Lethal 5+ this activation. It can't do this within enemy control range.",
               "Familiar's Soulsight (1AP): A visible enemy gains your Soulsight token until the battle ends or it uses this again. When it shoots that enemy, its rifle gains Saturate, and the enemy can't be obscured. It can't do this within enemy control range."],
              "SANCTUS, SNIPER"),
        agent("sanctus_talon", "Sanctus Talon", [], [("Sanctus bio-dagger", 4, "3+", "3/6", "Lethal 4+, Shock")],
              ["Creeping Shadow: It can Charge with a Conceal order. After a Fight, it makes a free Dash or Fall Back of up to 3\", even if it normally couldn't.",
               "Assassinate (2AP): Pick an enemy that can't see it. Make a free Charge (without the extra 2\") into its control range, then a free Fight. After your first strike, resolve another success as a strike straight away. It can't do this with an Engage order or within enemy control range.",
               "Familiar's Soulsight (1AP): A visible enemy gains your Soulsight token until the battle ends or it uses this again. When it fights that enemy, its bio-dagger gains Brutal and Balanced. It can't do this within enemy control range."],
              "SANCTUS, TALON"),
        wb("gunner_flamer", "Neophyte Gunner (flamer)", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [GUN_BUTT], [], "NEOPHYTE, GUNNER"),
        wb("gunner_launcher", "Neophyte Gunner (grenade launcher)", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")], [GUN_BUTT], [], "NEOPHYTE, GUNNER"),
        wb("gunner_webber", "Neophyte Gunner (webber)", [("Webber", 4, "3+", "3/4", 'Range 12", Severe, Stun')], [GUN_BUTT], [], "NEOPHYTE, GUNNER"),
        wb("heavy_stubber", "Neophyte Heavy Gunner (heavy stubber)", [("Heavy stubber (focused)", 5, "4+", "4/5", "Heavy (Dash only)"), ("Heavy stubber (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Torrent 1"')], [GUN_BUTT], [BIPOD], "NEOPHYTE, HEAVY GUNNER", pts=32),
        wb("heavy_laser", "Neophyte Heavy Gunner (mining laser)", [("Mining laser", 5, "4+", "5/6", "Heavy (Dash only), Piercing 1")], [GUN_BUTT], [BIPOD], "NEOPHYTE, HEAVY GUNNER", pts=32),
        wb("heavy_seismic", "Neophyte Heavy Gunner (seismic cannon)", [("Seismic cannon (long-wave)", 6, "4+", "2/2", 'Blast 1", Heavy (Dash only), Stun'), ("Seismic cannon (short-wave)", 4, "3+", "4/4", 'Range 6", Heavy (Dash only), Piercing Crits 1, Stun')], [GUN_BUTT], [BIPOD], "NEOPHYTE, HEAVY GUNNER", pts=32),
        wb("icon_autogun", "Neophyte Icon Bearer (autogun)", [AUTOGUN], [GUN_BUTT], ICON, "NEOPHYTE, ICON BEARER"),
        wb("icon_shotgun", "Neophyte Icon Bearer (shotgun)", [SHOTGUN], [GUN_BUTT], ICON, "NEOPHYTE, ICON BEARER"),
        wb("warrior_autogun", "Neophyte Warrior (autogun)", [AUTOGUN], [GUN_BUTT], GROUP, "NEOPHYTE, WARRIOR"),
        wb("warrior_shotgun", "Neophyte Warrior (shotgun)", [SHOTGUN], [GUN_BUTT], GROUP, "NEOPHYTE, WARRIOR"),
    ],
}
