BLADE = ("Blade", 3, "3+", "3/5", "-")
RIFLE4 = ("Kroot rifle", 4, "4+", "3/4", "-")
SCATTER = ("Kroot scattergun", 4, "3+", "3/3", 'Range 6"')
READY = ["Ready for Anything: Once per turning point during a Warrior's activation, use Meat, Piercing Shot or Toxin Shot on it without using up that rule's once-per-turning-point limit."]

def kroot(oid, name, ranged, melee, abilities, kw, wounds=8, move='6"', pts=28):
    return {"id": oid, "name": "Kroot " + name, "apl": 2, "move": move, "save": "5+", "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": "KROOT, " + kw}

TEAM = {
    "id": "farstalkers", "source": "farstalker_kinband", "name": "Farstalker Kinband", "badge": "T'AU EMPIRE", "color": "#A8743F",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 12,
        "groups": [
            {"name": "Leader", "desc": "1 Kill-broker", "min": 1, "max": 1, "ids": ["kill_broker"]},
            {"name": "Operatives", "desc": "11 Kroot operatives from the list below", "min": 11, "max": 11,
             "ids": ["bow_hunter", "cold_blood", "cut_skin", "hound", "long_sight", "pistolier", "stalker", "tracker", "heavy_skinner", "heavy_tribalest", "warrior_rifle", "warrior_scattergun"]},
        ],
        "repeatable": ["hound", "warrior_rifle", "warrior_scattergun"],
        "maxCount": {"hound": 2},
        "caps": [{"ids": ["heavy_skinner", "heavy_tribalest"], "max": 1, "label": "Only 1 Heavy Gunner"}],
        "rules": [
            "Select 1 Kill-broker, armed with a Kroot rifle or a pulse weapon, plus a ritual blade.",
            "Select 11 other operatives. You can take up to 2 Hounds and several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Farstalker", "In the Ready step of each Strategy phase, change the order of up to three Kroot outside enemy control range. When it's your turn to counteract, you can instead change one such Kroot's order. This counts as your counteraction, not that operative's."),
    ],
    "ploys": {
        "strategy": [
            ("Prey", "When one shoots before any Charge, Fall Back or Reposition this activation, ranged weapons gain Balanced and Severe (Ceaseless and Severe if they already have Balanced)."),
            ("Bound", "In each activation, ignore the first 2\" of one climb."),
            ("Cut-throats", "Melee weapons get +1 Atk (to a maximum of 5)."),
            ("Rogue", "When one is shot, ignore Saturate. If it retains cover saves, it can retain one extra, or one as a critical success. Not with Vantage terrain."),
        ],
        "firefight": [
            ("Poach", "This activation, Pick Up Marker and mission actions only need it to contest the marker, not control it."),
            ("Vengeance for the Kinband", "When an enemy incapacitates a Kroot, other Kroot attacking that enemy gain Relentless for the battle. You can't use this again until that enemy dies."),
            ("Savage Ambush", "When a ready Kroot with Light or Heavy terrain in its control range is picked to fight against, it resolves the first attack die."),
            ("Slip Away", "This activation, Fall Back costs it 1 less AP."),
        ],
    },
    "equipment": [
        {"id": "meat", "name": "Meat", "desc": "Once per turning point, when a Kroot (not a Hound) activates outside enemy control range, it regains up to D3+1 wounds.", "ex": ["hound"]},
        {"id": "trophy", "name": "Trophy", "desc": "Once per battle, during a Kroot's activation (not a Hound, and not in enemy control range), it gets +1 APL for that activation.", "ex": ["hound"]},
        {"id": "piercing_shot", "name": "Piercing Shot", "desc": "Once per turning point, a Kroot rifle, scattergun or dual Kroot pistols (focused) gain Piercing 1 for that action. Not with Toxin Shot."},
        {"id": "toxin_shot", "name": "Toxin Shot", "desc": "Once per turning point, a Kroot rifle, scattergun or dual Kroot pistols (focused) gain Lethal 5+ and Stun for that action. Not with Piercing Shot."},
    ],
    "operatives": [
        kroot("kill_broker", "Kill-broker", [("Kroot rifle", 4, "3+", "3/4", "-"), ("Pulse weapon", 4, "4+", "4/5", "-")], [("Ritual blade", 4, "3+", "4/5", "-")],
              ["Loadout: a Kroot rifle or pulse weapon, plus a ritual blade.",
               "Call the Kill: STRATEGIC GAMBIT, while it's in the killzone. Pick an enemy as your mark for the turning point. Kroot attacking it gain Balanced. When it dies, pick a new mark.",
               "Victory Shriek: When your mark dies, one Kroot within 6\" of this operative gains Balanced for the battle (each Kroot once)."],
              "LEADER, KILL-BROKER", wounds=9, pts=32),
        kroot("bow_hunter", "Bow-hunter", [("Accelerator bow (fused arrow)", 4, "3+", "4/5", "Piercing 1"), ("Accelerator bow (glide arrow)", 4, "3+", "3/4", "Silent"), ("Accelerator bow (voltaic arrow)", 4, "3+", "3/5", 'Blast 1"')], [BLADE],
              ["Energize (1AP): Its bow gains Lethal 5+ until the end of the turning point, or until it shoots with it. It can't do this within enemy control range."], "BOW-HUNTER"),
        kroot("cold_blood", "Cold-blood", [("Kroot rifle", 4, "3+", "3/4", "-")], [BLADE],
              ["Hardy: When an attack die would inflict Critical Dmg on it, you can make it Normal Dmg instead.",
               "Cold-blooded: When it attacks a wounded enemy, its weapon gains Lethal 5+, and Rending too if the enemy is also injured."], "COLD-BLOOD", wounds=9),
        kroot("cut_skin", "Cut-skin", [], [("Cut-skin's blades", 4, "3+", "3/5", "Ceaseless, Lethal 5+")],
              ["Vicious Duellist: When it fights or retaliates, each attack die your opponent discards as a fail inflicts 1 damage on them.",
               "Savage Assault: After its first Fight each activation, if both survive, it makes a free Fight against the same enemy."], "CUT-SKIN"),
        kroot("hound", "Hound", [], [("Ripping fangs", 4, "3+", "3/4", "Rending")],
              ["Beast: It can only Charge, Dash, Fall Back, Fight, Gather, Guard, Reposition, Pick Up Marker and Place Marker, and only with its own weapons.",
               "Bad-tempered: An enemy that Fights can be made to fight this operative instead, if it's a valid choice. When an enemy ends a Charge on another Kroot within 3\" of this operative (and this one isn't in enemy control range), this one makes a free Charge into that enemy.",
               "Gather (1AP): Make a free Dash or Reposition, picking up or placing a marker during the move."],
              "HOUND", wounds=7, move='8"'),
        kroot("long_sight", "Long-sight", [("Kroot hunting rifle (concealed)", 4, "2+", "3/3", "Heavy, Devastating 3, Silent, Concealed Position"), ("Kroot hunting rifle (mobile)", 4, "3+", "3/4", "-"),
                                           ("Kroot hunting rifle (stationary)", 4, "2+", "3/3", "Heavy, Devastating 3")], [BLADE],
              ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
               "Long-sight (1AP): Until its next activation, its concealed and stationary profiles gain Lethal 5+, and enemies can't be obscured when it shoots. It can't do this within enemy control range."],
              "LONG-SIGHT"),
        kroot("pistolier", "Pistolier", [("Dual Kroot pistols (focused)", 4, "3+", "3/5", 'Range 8", Ceaseless, Lethal 5+'), ("Dual Kroot pistols (salvo)", 4, "3+", "3/5", 'Range 8", Salvo')], [BLADE],
              ["Salvo (weapon rule): Shoot two different valid targets (not in friendly control range), rolling a separate sequence for each.",
               "Quick Draw: Once per turning point, when it's picked as a target (or as a Blast secondary target) while ready, interrupt with a free Shoot (focused profile) at that enemy. It can switch to Engage to do this."],
              "PISTOLIER"),
        kroot("stalker", "Stalker", [SCATTER], [("Stalker's blade", 4, "3+", "3/5", "Balanced, Rending")],
              ["Stalker: It can Charge while it has a Conceal order.",
               "Stealth Attack (2AP): Make a free Charge (without the extra 2\") and then a free Fight. After your first strike, resolve another success as a strike straight away. It can only do this with a Conceal order, outside enemy control range, and within 1\" of Light or Heavy terrain."],
              "STALKER"),
        kroot("tracker", "Tracker", [RIFLE4], [BLADE],
              ["From the Eye Above (1AP): SUPPORT. Another Kroot visible within 6\" gets +1 APL until the end of its next activation. It can't do this within enemy control range.",
               "Marked for the Hunt (1AP): Place your Pech'ra marker somewhere visible to it (or on visible Vantage terrain). Kroot shooting an enemy with the marker in its control range gain Seek Light. Remove it at this operative's next activation. It can't do this within enemy control range."],
              "TRACKER"),
        kroot("heavy_skinner", "Heavy Gunner (Dvorgite skinner)", [("Dvorgite skinner", 5, "2+", "3/3", 'Range 6", Heavy (Reposition only), Piercing 2, Torrent 2"')], [BLADE], [], "HEAVY GUNNER"),
        kroot("heavy_tribalest", "Heavy Gunner (Londaxi tribalest)", [("Londaxi tribalest", 5, "4+", "4/5", "Heavy (Reposition only), Piercing 1, Rending")], [BLADE], [], "HEAVY GUNNER"),
        kroot("warrior_rifle", "Warrior (Kroot rifle)", [RIFLE4], [BLADE], READY, "WARRIOR"),
        kroot("warrior_scattergun", "Warrior (scattergun)", [SCATTER], [BLADE], READY, "WARRIOR"),
    ],
}
