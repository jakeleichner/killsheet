GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")
GALVANIC = ("Galvanic rifle", 4, "3+", "3/4", "Heavy (Reposition only), Piercing Crits 1")
CARBINE = ("Radium carbine", 4, "3+", "2/4", "Rending")
ARC_PISTOL = ("Arc pistol", 4, "3+", "4/5", 'Range 8", Piercing 1, Stun')
MC_RADIUM = ("Master-crafted radium pistol", 4, "3+", "2/4", 'Range 8", Balanced, Rending')
PHOSPHOR = ("Phosphor blast pistol", 4, "3+", "3/4", 'Range 8", Blast 1", Severe')
ALPHA_MELEE = [("Arc maul", 4, "4+", "4/5", "Shock"), GUN_BUTT, ("Power weapon", 4, "4+", "4/6", "Lethal 5+"), ("Taser goad", 4, "4+", "3/4", "Lethal 5+, Shock")]
INF_RANGED = [("Flechette blaster", 5, "3+", "2/2", 'Range 8", Saturate, Silent'), ("Stubcarbine", 4, "3+", "3/4", "Ceaseless")]
INF_MELEE = [("Power weapon", 4, "3+", "4/6", "Lethal 5+"), ("Taser goad", 4, "3+", "3/4", "Lethal 5+, Shock")]
ARC_RIFLE = ("Arc rifle", 4, "3+", "4/5", "Piercing 1, Stun")
CALIVER = [("Plasma caliver (standard)", 4, "3+", "4/6", "Piercing 1"), ("Plasma caliver (supercharge)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")]
ARQUEBUS = [("Transuranic arquebus (mobile)", 4, "3+", "4/3", "Devastating 2, Heavy (Dash only), Piercing 1"),
            ("Transuranic arquebus (stationary)", 4, "2+", "4/3", "Devastating 3, Heavy, Piercing 1, Severe")]

CONTROL = "Control Protocol: You can use Command Override for 0CP if the chosen operative is visible to this one."
TARGETING = "Targeting Protocol: Shooting without having moved this activation, or as a counteraction: its ranged weapons gain Lethal 5+ (it can still move afterwards)."
RAD = "Rad-Saturation: Enemies within 2\" of friendly Vanguard worsen their weapons' Hit by 1 (not cumulative with injured)."
STALKER = "Wasteland Stalker: When shot, if retaining cover saves: retain one extra, or retain one as a crit (not with Vantage)."
SIGNAL = "Signal (1AP): SUPPORT. Another Hunter Clade operative visible within 6\": +1 APL until end of its next activation. Not within enemy control range."
SPOT = "Spot (1AP): SUPPORT. A visible enemy: until end of turning point, Hunter Clade within 3\" of this shooting it gain Seek Light and it can't be obscured. Not within enemy control range."

def op(oid, name, wounds, pts, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 2, "move": '6"', "save": "4+", "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def ranger(oid, name, ranged, abilities=None, pts=25):
    return op(oid, "Skitarii Ranger " + name, 7, pts, ranged, [GUN_BUTT], [TARGETING] + (abilities or []), "SKITARII, RANGER, " + name.split(" (")[0].upper())

def vanguard(oid, name, ranged, abilities=None, pts=25):
    return op(oid, "Skitarii Vanguard " + name, 7, pts, ranged, [GUN_BUTT], [RAD] + (abilities or []), "SKITARII, VANGUARD, " + name.split(" (")[0].upper())

SICARIANS = ["infiltrator_princeps", "ruststalker_princeps", "infiltrator_warrior", "ruststalker_razor", "ruststalker_blades"]

TEAM = {
    "id": "hunterclade", "source": "hunter_clade", "name": "Hunter Clade", "badge": "ADEPTUS MECHANICUS", "color": "#B5372B",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Princeps or Alpha", "min": 1, "max": 1, "ids": ["infiltrator_princeps", "ruststalker_princeps", "ranger_alpha", "vanguard_alpha"]},
            {"name": "Operatives", "desc": "9 Hunter Clade operatives from the list below", "min": 9, "max": 9,
             "ids": ["infiltrator_warrior", "ruststalker_razor", "ruststalker_blades", "ranger_diktat", "ranger_gunner_arc", "ranger_gunner_caliver", "ranger_gunner_arquebus",
                     "ranger_surveyor", "ranger_warrior", "vanguard_diktat", "vanguard_gunner_arc", "vanguard_gunner_caliver", "vanguard_gunner_arquebus", "vanguard_surveyor", "vanguard_warrior"]},
        ],
        "repeatable": ["infiltrator_warrior", "ruststalker_razor", "ruststalker_blades", "ranger_warrior", "vanguard_warrior"],
        "caps": [
            {"ids": ["ranger_diktat", "vanguard_diktat"], "max": 1, "label": "Only 1 Diktat"},
            {"ids": ["ranger_surveyor", "vanguard_surveyor"], "max": 1, "label": "Only 1 Surveyor"},
            {"ids": SICARIANS, "max": 5, "label": "Max 5 Sicarians"},
            {"ids": ["ranger_gunner_arc", "vanguard_gunner_arc"], "max": 1, "label": "Only 1 arc rifle"},
            {"ids": ["ranger_gunner_caliver", "vanguard_gunner_caliver"], "max": 1, "label": "Only 1 plasma caliver"},
            {"ids": ["ranger_gunner_arquebus", "vanguard_gunner_arquebus"], "max": 1, "label": "Only 1 transuranic arquebus"},
            {"ids": ["infiltrator_warrior", "ruststalker_razor", "ruststalker_blades", "ranger_gunner_arc", "ranger_gunner_caliver", "ranger_gunner_arquebus",
                     "vanguard_gunner_arc", "vanguard_gunner_caliver", "vanguard_gunner_arquebus"], "max": 7,
             "label": "Max 7 Sicarian Warriors and Gunners combined"},
        ],
        "rules": [
            "Select 1 leader: Sicarian Infiltrator Princeps, Sicarian Ruststalker Princeps, Skitarii Ranger Alpha or Skitarii Vanguard Alpha.",
            "Select 9 other operatives. Other than Gunners and Warriors, each only once.",
            "Max 1 Diktat, 1 Surveyor and 5 Sicarians. Max 1 arc rifle, 1 plasma caliver and 1 transuranic arquebus.",
            "Max 7 Sicarian Infiltrator Warriors, Sicarian Ruststalker Warriors and Gunners combined.",
        ],
    },
    "factionRules": [
        ("Doctrina Imperatives", "End of Select Operatives: pick one imperative as your Primary Mode. STRATEGIC GAMBIT: pick an imperative for your operatives until the next Strategy phase's Ready step; both its Optimisation and Deprecation apply. Once per battle, when you pick your Primary Mode, ignore its Deprecation."),
        ("Protector Imperative", "Ranged weapons gain Ceaseless. Deprecation: melee Hit worsened by 1."),
        ("Conqueror Imperative", "Melee weapons gain Ceaseless. Deprecation: ranged Hit worsened by 1."),
        ("Bulwark Imperative", "Normal Dmg of 3+ inflicts 1 less. Deprecation: -1\" Move."),
        ("Aggressor Imperative", "+1\" Move. Deprecation: Save worsened by 1."),
        ("Neutral Imperative", "No effects."),
    ],
    "ploys": {
        "strategy": [
            ("Debilitating Irradiation", "An enemy under Rad-Saturation attacking a Vanguard: -1 Normal Dmg (min 3)."),
            ("Neurostatic Interference", "Enemies within 6\" of a friendly Infiltrator can't re-roll attack dice."),
            ("Scouting Protocol", "Each Concealed Ranger more than 6\" from enemies makes a free Dash. Not in the first turning point."),
            ("Accelerant Agents", "Each Ruststalker can Fight twice per activation, one of them free."),
        ],
        "firefight": [
            ("Control Edict", "On your turn to activate: a Leader and another ready operative visible within 3\" of it (max one Sicarian) activate one after the other before your opponent."),
            ("Scrapcode Overload", "When an Infiltrator activates, or it or an enemy within 3\" would Pick Up or do a mission action (not Operate Hatch): until its next activation, enemies contesting a marker count total APL 1 lower if one is within 3\" of it."),
            ("Command Override", "When an operative activates: give it a different imperative until the next Ready step."),
            ("Omnissiah's Imperative", "During its activation, or when shot (end of Roll Attack Dice): until the next Ready step, by imperative. Protector: ranged Severe. Conqueror: fighting, after your first attack dice resolve another immediately. Bulwark: Save +1 and one extra defence die when shot. Aggressor: ignore the first 2\" of one climb. Neutral: none."),
        ],
    },
    "equipment": [
        {"id": "rad_bombardment", "name": "Rad Bombardment", "desc": "Once per battle STRATEGIC GAMBIT after turning point 1: pick an objective or your opponent's drop zone. D6 per enemy there (-1 under Vantage): 4+ -1 APL until end of its next activation; 6 also D3 damage."},
        {"id": "extremis_mind_link", "name": "Extremis Mind-link", "desc": "Once per battle, Control Edict for 0CP, and both operatives activate at the same time (alternate their actions in any order)."},
        {"id": "redundancy_systems", "name": "Redundancy Systems", "desc": "Once per turning point, an operative activates out of enemy control range: regain up to D3+2 wounds."},
        {"id": "refractor_field", "name": "Refractor Field", "desc": "Once per turning point, an operative is shot (start of Roll Defence Dice): attacker's Piercing worsened by 1."},
    ],
    "operatives": [
        op("infiltrator_princeps", "Sicarian Infiltrator Princeps", 11, 40, INF_RANGED, INF_MELEE,
           ["Loadout: flechette blaster or stubcarbine, + power weapon or taser goad.",
            "Canticle of Shroudpsalm: Friendly Infiltrators within 3\" of this, Concealed and in cover, can't be selected as valid targets (except within 2\").", CONTROL],
           "LEADER, SICARIAN, INFILTRATOR, PRINCEPS"),
        op("ruststalker_princeps", "Sicarian Ruststalker Princeps", 11, 40, [], [("Chordclaw & transonic blades", 5, "3+", "4/6", "Balanced, Rending")],
           ["Canticle of Destruction: A friendly Ruststalker within 3\" fighting: its first crit strike each sequence deals +1 damage.", STALKER, CONTROL],
           "LEADER, SICARIAN, RUSTSTALKER, PRINCEPS"),
        op("ranger_alpha", "Skitarii Ranger Alpha", 8, 25, [ARC_PISTOL, GALVANIC, MC_RADIUM, PHOSPHOR], ALPHA_MELEE,
           ["Loadout: galvanic rifle + gun butt; master-crafted radium pistol + power weapon; or arc pistol or phosphor blast pistol, + arc maul or taser goad.",
            "Canticle of Elimination: Friendly Rangers within 3\" of this: ranged weapons gain Punishing.", TARGETING, CONTROL],
           "LEADER, SKITARII, RANGER, ALPHA"),
        op("vanguard_alpha", "Skitarii Vanguard Alpha", 8, 25, [ARC_PISTOL, MC_RADIUM, PHOSPHOR, CARBINE], ALPHA_MELEE,
           ["Loadout: radium carbine + gun butt; master-crafted radium pistol + power weapon; or arc pistol or phosphor blast pistol, + arc maul or taser goad.",
            "Canticle of the Glow: Enemies within 3\" of this under Rad-Saturation also get -1 Atk.", RAD, CONTROL],
           "LEADER, SKITARII, VANGUARD, ALPHA"),
        op("infiltrator_warrior", "Sicarian Infiltrator Warrior", 10, 40, INF_RANGED, INF_MELEE,
           ["Loadout: flechette blaster or stubcarbine, + power weapon or taser goad."], "SICARIAN, INFILTRATOR, WARRIOR"),
        op("ruststalker_razor", "Sicarian Ruststalker Warrior (chordclaw & razor)", 10, 40, [], [("Chordclaw & transonic razor", 5, "3+", "4/5", "Balanced")], [STALKER], "SICARIAN, RUSTSTALKER, WARRIOR"),
        op("ruststalker_blades", "Sicarian Ruststalker Warrior (transonic blades)", 10, 40, [], [("Transonic blades", 5, "3+", "4/6", "Rending")], [STALKER], "SICARIAN, RUSTSTALKER, WARRIOR"),
        ranger("ranger_diktat", "Diktat", [GALVANIC], [SIGNAL]),
        ranger("ranger_gunner_arc", "Gunner (arc rifle)", [ARC_RIFLE]),
        ranger("ranger_gunner_caliver", "Gunner (plasma caliver)", CALIVER),
        ranger("ranger_gunner_arquebus", "Gunner (transuranic arquebus)", ARQUEBUS, pts="60x35"),
        ranger("ranger_surveyor", "Surveyor", [GALVANIC], [SPOT]),
        ranger("ranger_warrior", "Warrior", [GALVANIC]),
        vanguard("vanguard_diktat", "Diktat", [CARBINE], [SIGNAL]),
        vanguard("vanguard_gunner_arc", "Gunner (arc rifle)", [ARC_RIFLE]),
        vanguard("vanguard_gunner_caliver", "Gunner (plasma caliver)", CALIVER),
        vanguard("vanguard_gunner_arquebus", "Gunner (transuranic arquebus)", ARQUEBUS, pts="60x35"),
        vanguard("vanguard_surveyor", "Surveyor", [CARBINE], [SPOT]),
        vanguard("vanguard_warrior", "Warrior", [CARBINE]),
    ],
}
