BLADE = ("Blade", 3, "3+", "3/5", "-")
RIFLE4 = ("Kroot rifle", 4, "4+", "3/4", "-")
SCATTER = ("Kroot scattergun", 4, "3+", "3/3", 'Range 6"')
READY = ["Ready for Anything: Once per turning point during a Warrior's activation, use Meat, Piercing Shot or Toxin Shot for it without using up that rule's once-per-turning-point limit."]

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
            "Select 1 Kill-broker: Kroot rifle + ritual blade, or pulse weapon + ritual blade.",
            "Select 11 other operatives. Other than Hounds and Warriors, each only once. Max 2 Hounds.",
        ],
    },
    "factionRules": [
        ("Farstalker", "Ready step of each Strategy phase: change the order of up to three Kroot not in enemy control range. When it's your turn to counteract, you can instead change one such Kroot's order (counts as your counteraction, not that operative's)."),
    ],
    "ploys": {
        "strategy": [
            ("Prey", "Shooting before any Charge, Fall Back or Reposition this activation: ranged weapons gain Balanced and Severe (Ceaseless and Severe if already Balanced)."),
            ("Bound", "Each activation, ignore the first 2\" of one climb."),
            ("Cut-throats", "+1 melee Atk (max 5)."),
            ("Rogue", "When shot: ignore Saturate; if retaining cover saves, retain one extra or one as a crit (not with Vantage)."),
        ],
        "firefight": [
            ("Poach", "This activation, Pick Up Marker and mission actions only need it to contest the marker, not control it."),
            ("Vengeance for the Kinband", "A Kroot is incapacitated by an enemy: other Kroot attacking that enemy gain Relentless for the battle (can't reuse until it dies)."),
            ("Savage Ambush", "A ready Kroot with Light or Heavy terrain in its control range is picked to fight against: it resolves the first attack dice."),
            ("Slip Away", "This activation, Fall Back costs 1 less AP."),
        ],
    },
    "equipment": [
        {"id": "meat", "name": "Meat", "desc": "Once per turning point when a Kroot (not a Hound) activates out of enemy control range: regain up to D3+1 wounds.", "ex": ["hound"]},
        {"id": "trophy", "name": "Trophy", "desc": "Once per battle during a Kroot's activation (not a Hound, not in enemy control range): +1 APL for that activation.", "ex": ["hound"]},
        {"id": "piercing_shot", "name": "Piercing Shot", "desc": "Once per turning point with a Kroot rifle, scattergun or dual Kroot pistols (focused): Piercing 1 for that action (not with Toxin Shot)."},
        {"id": "toxin_shot", "name": "Toxin Shot", "desc": "Once per turning point with a Kroot rifle, scattergun or dual Kroot pistols (focused): Lethal 5+ and Stun for that action (not with Piercing Shot)."},
    ],
    "operatives": [
        kroot("kill_broker", "Kill-broker", [("Kroot rifle", 4, "3+", "3/4", "-"), ("Pulse weapon", 4, "4+", "4/5", "-")], [("Ritual blade", 4, "3+", "4/5", "-")],
              ["Loadout: Kroot rifle or pulse weapon, + ritual blade.",
               "Call the Kill: STRATEGIC GAMBIT (in killzone): pick an enemy as your mark for the turning point; Kroot attacking it gain Balanced. When it dies, pick a new mark.",
               "Victory Shriek: When your mark dies, one Kroot within 6\" of this gains Balanced for the battle (each Kroot once)."],
              "LEADER, KILL-BROKER", wounds=9, pts=32),
        kroot("bow_hunter", "Bow-hunter", [("Accelerator bow (fused arrow)", 4, "3+", "4/5", "Piercing 1"), ("Accelerator bow (glide arrow)", 4, "3+", "3/4", "Silent"), ("Accelerator bow (voltaic arrow)", 4, "3+", "3/5", 'Blast 1"')], [BLADE],
              ["Energise (1AP): Its bow gains Lethal 5+ until end of turning point or until it shoots with it. Not within enemy control range."], "BOW-HUNTER"),
        kroot("cold_blood", "Cold-blood", [("Kroot rifle", 4, "3+", "3/4", "-")], [BLADE],
              ["Hardy: An attack dice would inflict Critical Dmg on it: you can make it Normal Dmg instead.",
               "Cold-blooded: Attacking a wounded enemy: Lethal 5+; if it's also injured, Rending too."], "COLD-BLOOD", wounds=9),
        kroot("cut_skin", "Cut-skin", [], [("Cut-skin's blades", 4, "3+", "3/5", "Ceaseless, Lethal 5+")],
              ["Vicious Duellist: Fighting/retaliating: each attack die the opponent discards as a fail deals 1 damage to them.",
               "Savage Assault: First Fight each activation, if both survive: a free Fight against the same enemy."], "CUT-SKIN"),
        kroot("hound", "Hound", [], [("Ripping fangs", 4, "3+", "3/4", "Rending")],
              ["Beast: Only Charge, Dash, Fall Back, Fight, Gather, Guard, Reposition, Pick Up and Place Marker; own weapons only.",
               "Bad-tempered: An enemy Fighting can be forced to fight this instead (if valid). An enemy ends a Charge on another Kroot within 3\" of this (not in enemy control range): this makes a free Charge into that enemy.",
               "Gather (1AP): Free Dash or Reposition, picking up or placing a marker during the move."],
              "HOUND", wounds=7, move='8"'),
        kroot("long_sight", "Long-sight", [("Kroot hunting rifle (concealed)", 4, "2+", "3/3", "Heavy, Devastating 3, Silent, Concealed Position"), ("Kroot hunting rifle (mobile)", 4, "3+", "3/4", "-"),
                                           ("Kroot hunting rifle (stationary)", 4, "2+", "3/3", "Heavy, Devastating 3")], [BLADE],
              ["Concealed Position (weapon rule): Only the first time it Shoots in the battle.",
               "Long-sight (1AP): Until its next activation, concealed and stationary profiles gain Lethal 5+ and enemies can't be obscured when it shoots. Not within enemy control range."],
              "LONG-SIGHT"),
        kroot("pistolier", "Pistolier", [("Dual Kroot pistols (focused)", 4, "3+", "3/5", 'Range 8", Ceaseless, Lethal 5+'), ("Dual Kroot pistols (salvo)", 4, "3+", "3/5", 'Range 8", Salvo')], [BLADE],
              ["Salvo (weapon rule): Shoot two different valid targets (not in friendly control range), each sequence rolled separately.",
               "Quick Draw: Once per turning point, when it's picked as a target (or Blast secondary) while ready: interrupt with a free Shoot (focused profile) at that enemy (can switch to Engage)."],
              "PISTOLIER"),
        kroot("stalker", "Stalker", [SCATTER], [("Stalker's blade", 4, "3+", "3/5", "Balanced, Rending")],
              ["Stalker: Can Charge while Concealed.",
               "Stealth Attack (2AP): A free Charge (no +2\") then a free Fight; after the first strike, resolve another success as a strike immediately. Only on Conceal, not in enemy control range, within 1\" of Light or Heavy terrain."],
              "STALKER"),
        kroot("tracker", "Tracker", [RIFLE4], [BLADE],
              ["From the Eye Above (1AP): SUPPORT. Another Kroot visible within 6\": +1 APL until end of its next activation. Not within enemy control range.",
               "Marked for the Hunt (1AP): Place your Pech'ra marker visible (or on visible Vantage); Kroot shooting an enemy with it in control range gain Seek Light. Removed at this one's next activation. Not within enemy control range."],
              "TRACKER"),
        kroot("heavy_skinner", "Heavy Gunner (Dvorgite skinner)", [("Dvorgite skinner", 5, "2+", "3/3", 'Range 6", Heavy (Reposition only), Piercing 2, Torrent 2"')], [BLADE], [], "HEAVY GUNNER"),
        kroot("heavy_tribalest", "Heavy Gunner (Londaxi tribalest)", [("Londaxi tribalest", 5, "4+", "4/5", "Heavy (Reposition only), Piercing 1, Rending")], [BLADE], [], "HEAVY GUNNER"),
        kroot("warrior_rifle", "Warrior (Kroot rifle)", [RIFLE4], [BLADE], READY, "WARRIOR"),
        kroot("warrior_scattergun", "Warrior (scattergun)", [SCATTER], [BLADE], READY, "WARRIOR"),
    ],
}
