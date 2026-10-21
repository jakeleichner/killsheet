import copy
import importlib.util
from pathlib import Path

_spec = importlib.util.spec_from_file_location("breachers", Path(__file__).parent / "breachers.py")
_br = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_br)

FISTS = ("Fists", 3, "4+", "2/3", "-")
GUN_BUTT = ("Gun butt", 3, "4+", "2/3", "-")
AUTOPISTOL = ("Autopistol", 4, "4+", "2/3", 'Range 8"')
LASGUN = ("Hot-shot lasgun", 4, "3+", "3/4", "-")
EXPENDABLE = "Expendable: It doesn't count for kill or elimination ops, or for escape and survive scoring."
PSYCHIC_NULL = "Psychic Null: PSYCHIC ranged weapons can't damage it, and PSYCHIC actions can't pick or count it. Operatives within 6\" can't use PSYCHIC actions, rules or ranged weapons, and their PSYCHIC melee weapons lose their rules (Dmg 3/4 at most)."
LOBOTOMISED = "Lobotomised: When it's activated, if it's visible within 3\" of another Agent (not a Gun Servitor), it gets +1 APL for that activation."

def servitor(oid, name, ranged):
    return {"id": oid, "name": name, "apl": 1, "move": '5"', "save": "4+", "wounds": 11, "pts": 32,
            "ranged": ranged, "melee": [("Servo claw", 3, "4+", "4/5", "-")], "abilities": [LOBOTOMISED], "kw": "GUN SERVITOR"}

def scion(oid, name, ranged, abilities, kw):
    return {"id": oid, "name": "Scion " + name, "apl": 2, "move": '6"', "save": "4+", "wounds": 8, "pts": 25,
            "ranged": ranged, "melee": [GUN_BUTT], "abilities": abilities, "kw": "REQUISITIONED, TEMPESTUS SCION, " + kw}

def sister(oid, name, ranged, melee, kw):
    return {"id": oid, "name": "Sister " + name, "apl": 2, "move": '6"', "save": "3+", "wounds": 8, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": [PSYCHIC_NULL], "kw": "REQUISITIONED, SISTER OF SILENCE, " + kw}

CORE = [
    {"id": "autosavant", "name": "Autosavant", "apl": 2, "move": '6"', "save": "4+", "wounds": 7, "pts": 25,
     "ranged": [], "melee": [("Mechanical appendages", 3, "5+", "1/2", "-")],
     "abilities": ["Scrivener: While it's in the killzone, each time your opponent uses one of their ploys again (not Command Re-roll), gain 1CP (2CP per turning point at most).",
                   "Irrefutable Report: It always controls objective and mission markers it contests. This overrides every other rule.",
                   "Lightly Armed: It can only use its datacard weapons and has no unique actions."],
     "kw": "AUTOSAVANT", "ex": ["combat_daggers"]},
    {"id": "questkeeper", "name": "Questkeeper", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [AUTOPISTOL], "melee": [("Eviscerator", 4, "4+", "5/6", "Brutal")],
     "abilities": ["Irrepressible Purpose: If it's incapacitated during a Fight action, it strikes with one unresolved success before it's removed.",
                   "Zealot: Whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 5+, subtract 1 from that damage."],
     "kw": "QUESTKEEPER"},
    {"id": "dw_veteran", "name": "Death World Veteran", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [AUTOPISTOL], "melee": [("Knife", 1, "2+", "5/7", "Lethal 5+"), ("Polearm", 4, "3+", "4/5", "-")],
     "abilities": ["Hunter: It can Charge while it has a Conceal order.",
                   "Weathered: Once per turning point when it fights or retaliates, ignore the damage from one normal success."],
     "kw": "DEATH WORLD VETERAN"},
    {"id": "enlightener", "name": "Enlightener", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [AUTOPISTOL], "melee": [("Paired blades", 4, "3+", "3/5", "Balanced, Rending")],
     "abilities": ["No Escape: When an enemy tries to Fall Back from its control range, roll a D6 (subtract 1 if the enemy has more Wounds, add 1 if it's wounded). On a 4+, it can't, and its AP isn't refunded.",
                   "Extract Information: When an enemy is incapacitated within its control range, gain 1CP."],
     "kw": "ENLIGHTENER"},
    {"id": "hexorcist", "name": "Hexorcist", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [("Shotgun", 4, "3+", "3/3", 'Range 6"')], "melee": [FISTS],
     "abilities": ["Hexorcise: Enemies visible within 6\" of it can't re-roll attack or defence dice.",
                   "Chasten (1AP): Pick an enemy within 6\" that's a valid target, and one of its datacard rules or unique actions (not weapon rules, and not \"ignored for kill ops\"). It loses that rule until the end of its next activation. It can't do this within enemy control range."],
     "kw": "HEXORCIST"},
    {"id": "mystic", "name": "Mystic", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [("Autopistol", 4, "2+", "2/3", 'Range 8", Seek')], "melee": [("Fists", 3, "5+", "2/3", "-")],
     "abilities": ["Icon Bearer: Its APL counts as 1 higher for marker control.",
                   "Lightly Armed: It can only use its datacard weapons.",
                   "Scry (1AP): PSYCHIC. Pick a friendly Agent within 6\". Until this operative's next activation, give it Guidance (when attacking, retain one fail as a normal success or one normal success as a critical success) or Protection (the same for defence dice when shot). It can't do this within enemy control range."],
     "kw": "PSYKER, MYSTIC", "ex": ["combat_daggers"]},
    {"id": "penal", "name": "Penal Legionnaire", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [("Hand flamer", 4, "2+", "3/3", 'Range 6", Saturate, Torrent 1"')], "melee": [("Chainsword", 4, "4+", "4/5", "-")],
     "abilities": ["Chem-mask: It ignores APL changes and stat changes from being injured, and isn't affected by enemy Shock or Stun.",
                   "Cruel: Against a wounded enemy, its weapons gain Relentless."],
     "kw": "PENAL LEGIONNAIRE"},
    {"id": "pistolier", "name": "Pistolier", "apl": 2, "move": '6"', "save": "5+", "wounds": 7, "pts": 25,
     "ranged": [("Scoped plasma pistol (std)", 4, "3+", "3/5", 'Range 12", Piercing 1'), ("Scoped plasma pistol (super)", 4, "3+", "4/5", 'Range 12", Hot, Lethal 5+, Piercing 1'),
                ("Suppressed autopistol", 4, "3+", "2/3", 'Range 8", Silent')],
     "melee": [FISTS],
     "abilities": ["Pistolier: It ignores changes to its ranged weapons' Hit.",
                   "Pistol Barrage (1AP): Make two free Shoots, one with each pistol. It can't do this with a Conceal order or in an activation where it already Shot."],
     "kw": "PISTOLIER"},
    servitor("gs_heavy_bolter", "Gun Servitor (heavy bolter)", [("Heavy bolter (focused)", 5, "4+", "4/5", "Heavy (Dash only), Piercing Crits 1"), ("Heavy bolter (sweeping)", 4, "4+", "4/5", 'Heavy (Dash only), Piercing Crits 1, Torrent 1"')]),
    servitor("gs_multi_melta", "Gun Servitor (multi-melta)", [("Multi-melta", 4, "4+", "6/3", "Devastating 4, Heavy (Dash only), Piercing 2")]),
    servitor("gs_plasma_cannon", "Gun Servitor (plasma cannon)", [("Plasma cannon (std)", 4, "4+", "4/6", 'Blast 2", Heavy (Dash only), Piercing 1'), ("Plasma cannon (super)", 4, "4+", "5/6", 'Blast 2", Heavy (Dash only), Hot, Lethal 5+, Piercing 1')]),
]
CORE_IDS = [o["id"] for o in CORE]
SERVITORS = ["gs_heavy_bolter", "gs_multi_melta", "gs_plasma_cannon"]

SCIONS = [
    scion("sc_trooper", "Trooper", [LASGUN], ["Adaptive Equipment: Once per turning point, one Scion Trooper can take the Smoke Grenade action and one Scion Trooper the Stun Grenade action. Neither uses up equipment."], "TROOPER"),
    scion("sc_medic", "Medic", [LASGUN], ["Medic!: The first time each turning point another friendly Agent visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during that operative's activation, the activation ends.",
                                         "Medikit (1AP): A friendly Agent in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."], "MEDIC"),
    scion("sc_vox", "Vox-operator", [LASGUN], ["Signal (1AP): SUPPORT. Another friendly Agent gets +1 APL until the end of its next activation. It can do this twice per activation, but not within enemy control range."], "VOX-OPERATOR"),
    scion("sc_gunner_flamer", "Gunner (flamer)", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [], "GUNNER"),
    scion("sc_gunner_gl", "Gunner (grenade launcher)", [("Grenade launcher (frag)", 4, "3+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "3+", "4/5", "Piercing 1")], [], "GUNNER"),
    scion("sc_gunner_volley", "Gunner (hot-shot volley gun)", [("Hot-shot volley gun (focused)", 5, "3+", "3/4", "Piercing Crits 1"), ("Hot-shot volley gun (sweeping)", 4, "3+", "3/4", 'Piercing Crits 1, Torrent 1"')], [], "GUNNER"),
    scion("sc_gunner_melta", "Gunner (meltagun)", [("Meltagun", 4, "3+", "6/3", 'Range 6", Devastating 4, Piercing 2')], [], "GUNNER"),
    scion("sc_gunner_plasma", "Gunner (plasma gun)", [("Plasma gun (std)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (super)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [], "GUNNER"),
]
SCION_IDS = [o["id"] for o in SCIONS]
SCION_GUNNERS = [i for i in SCION_IDS if "gunner" in i]

SISTERS = [
    sister("sos_prosecutor", "Prosecutor", [("Boltgun", 4, "3+", "3/4", "-")], [("Gun butt", 4, "4+", "2/3", "-")], "PROSECUTOR"),
    sister("sos_witchseeker", "Witchseeker", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')], [("Gun butt", 4, "4+", "2/3", "-")], "WITCHSEEKER"),
    sister("sos_vigilator", "Vigilator", [], [("Executioner greatblade", 4, "3+", "4/6", "Lethal 5+")], "VIGILATOR"),
]
SISTER_IDS = [o["id"] for o in SISTERS]

# Breacher requisition: same datacards as the Breachers team (no Sergeant-at-Arms), ids prefixed
BREACHERS = []
for o in _br.OPERATIVES:
    if o["id"] == "sgt_at_arms":
        continue
    b = copy.deepcopy(o)
    b["id"] = "br_" + o["id"]
    b["kw"] = "REQUISITIONED, IMPERIAL NAVY BREACHER, " + o["kw"]
    b["source"] = "imperial_navy_breachers"
    b["abilities"] = [a.replace("another ready Armsman", "another ready requisitioned Armsman") for a in b["abilities"]]
    BREACHERS.append(b)
BREACHER_IDS = [o["id"] for o in BREACHERS]

def _load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).parent / f"{name}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

def requisition(mod, prefix, faction_kw, source, keep):
    out = []
    for o in mod.OPERATIVES:
        if o["id"] not in keep:
            continue
        b = copy.deepcopy(o)
        b["id"] = prefix + o["id"]
        b["kw"] = "REQUISITIONED, " + faction_kw + ", " + o["kw"]
        b["source"] = source
        out.append(b)
    return out

_dk, _ex, _ks = _load("death_korps"), _load("exaction_squad"), _load("kasrkin")
DK = requisition(_dk, "dk_", "DEATH KORPS", "death_korps",
                 ["bruiser", "confidant", "gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "medic", "sapper", "sniper", "trooper", "veteran", "vox", "zealot"])
EX = requisition(_ex, "ex_", "EXACTION SQUAD", "exaction_squad",
                 ["castigator", "chirurgant", "gunner_gl", "gunner_stubber", "gunner_webber", "leashmaster", "malocator", "marksman", "revelatum", "cyber_mastiff", "subductor", "vigilant", "vox_signifier"])
KS = requisition(_ks, "ks_", "KASRKIN", "kasrkin",
                 ["combat_medic", "demo_trooper", "gunner_flamer", "gunner_gl", "gunner_volley", "gunner_melta", "gunner_plasma", "recon_trooper", "sharpshooter", "trooper", "vox_trooper"])
DK_IDS, EX_IDS, KS_IDS = [o["id"] for o in DK], [o["id"] for o in EX], [o["id"] for o in KS]
BR_GUNNERS = ["br_gunner_volley", "br_gunner_melta", "br_gunner_plasma"]
REQ_IDS = SCION_IDS + SISTER_IDS + BREACHER_IDS + DK_IDS + EX_IDS + KS_IDS

TEAM = {
    "id": "inquisitorial", "source": "inquisitorial_agents", "name": "Inquisitorial Agents", "badge": "INQUISITION", "color": "#7E57A8",
    "archetypes": "Any",
    "composition": {
        "total": 12,
        "groups": [
            {"name": "Leader", "desc": "1 Interrogator", "min": 1, "max": 1, "ids": ["interrogator"]},
            {"name": "Tome-skull", "desc": "1 Tome-skull", "min": 1, "max": 1, "ids": ["tome_skull"]},
            {"name": "Agents", "desc": "10 agents: at least 5 from this list, the rest from here or one requisition group", "min": 5, "max": 10, "ids": CORE_IDS},
            {"name": "Requisition: Tempestus Scions", "desc": "", "min": 0, "max": 5, "ids": SCION_IDS},
            {"name": "Requisition: Sisters of Silence", "desc": "", "min": 0, "max": 5, "ids": SISTER_IDS},
            {"name": "Requisition: Imperial Navy Breachers", "desc": "", "min": 0, "max": 5, "ids": BREACHER_IDS},
            {"name": "Requisition: Death Korps", "desc": "", "min": 0, "max": 6, "ids": DK_IDS},
            {"name": "Requisition: Exaction Squad", "desc": "", "min": 0, "max": 5, "ids": EX_IDS},
            {"name": "Requisition: Kasrkin", "desc": "", "min": 0, "max": 5, "ids": KS_IDS},
        ],
        "repeatable": ["sc_trooper", "br_armsman", "dk_trooper", "ex_vigilant", "ex_subductor", "ks_trooper"] + SISTER_IDS,
        "maxCount": {"ex_subductor": 2},
        "cost": {"br_cat_unit": 0.5, "br_gheistskull": 0.5},
        "pools": [{"groups": ["Agents", "Requisition: Tempestus Scions", "Requisition: Sisters of Silence", "Requisition: Imperial Navy Breachers",
                              "Requisition: Death Korps", "Requisition: Exaction Squad", "Requisition: Kasrkin"],
                   "min": 10, "max": 10, "label": "Agents (including requisitioned)", "whenAny": {"ids": DK_IDS, "min": 11, "max": 11}}],
        "caps": [
            {"ids": SERVITORS, "max": 2, "label": "Up to 2 Gun Servitors (each with a different weapon)"},
            {"ids": SERVITORS, "max": 1, "whenAny": REQ_IDS, "label": "Only 1 Gun Servitor when requisitioning"},
            {"ids": SCION_GUNNERS, "max": 2, "label": "Max 2 Scion Gunners"},
            {"ids": BR_GUNNERS, "max": 1, "label": "Only 1 requisitioned Breacher Gunner"},
            {"ids": ["dk_gunner_flamer", "dk_gunner_gl", "dk_gunner_melta", "dk_gunner_plasma", "dk_sniper"], "max": 3, "label": "Up to 3 requisitioned Death Korps Gunners and Snipers combined"},
            {"ids": ["ex_gunner_gl", "ex_gunner_stubber", "ex_gunner_webber"], "max": 1, "label": "Only 1 requisitioned Exaction Squad Gunner"},
            {"ids": ["ks_gunner_flamer", "ks_gunner_gl", "ks_gunner_volley", "ks_gunner_melta", "ks_gunner_plasma", "ks_sharpshooter"], "max": 2, "label": "Up to 2 requisitioned Kasrkin Gunners and Sharpshooters combined"},
            {"ids": ["gs_multi_melta", "sc_gunner_melta", "br_gunner_melta", "dk_gunner_melta", "ks_gunner_melta"], "max": 1, "label": "Max 1 weapon with Piercing 2"},
            {"ids": ["pistolier", "gs_multi_melta", "gs_plasma_cannon", "sc_gunner_gl", "sc_gunner_melta", "sc_gunner_plasma", "br_gunner_melta", "br_gunner_plasma", "br_grenadier",
                     "dk_gunner_gl", "dk_gunner_melta", "dk_gunner_plasma", "dk_sapper", "ex_gunner_gl", "ks_gunner_gl", "ks_gunner_melta", "ks_gunner_plasma"],
             "max": 3, "label": "Up to 3 weapons with Piercing X (not counting Piercing Crits)"},
        ],
        "requires": [
            {"id": "br_gheistskull", "needs": "br_void_jammer", "label": "Gheistskull needs a Void-jammer in the team."},
            {"id": "br_cat_unit", "needs": "br_surveyor", "label": "C.A.T. Unit needs a Surveyor in the team."},
        ],
        "exclusive": [{"sets": [SCION_IDS, SISTER_IDS, BREACHER_IDS, DK_IDS, EX_IDS, KS_IDS], "label": "Requisitioned operatives must all come from one group."}],
        "rules": [
            "1 Interrogator and 1 Tome-skull.",
            "10 agents: at least 5 from the Agents list, and the other 5 from that list or from one requisition group.",
            "Each operative only once, except Scion Troopers, Breacher Armsmen and Sisters of Silence.",
            "Up to 2 Gun Servitors (with different weapons) if you take no requisitioned operatives, otherwise 1.",
            "Whole team: only 1 weapon with Piercing 2, and up to 3 with any Piercing X (Piercing Crits doesn't count).",
            "Requisition limits. Scions: up to 2 Gunners. Breachers: 1 Gunner, the Gheistskull needs a Void-jammer, the C.A.T. needs a Surveyor (each counts as half a selection). Death Korps: send 6 operatives (11 agents in total), up to 3 Gunners and Snipers combined. Exaction Squad: 1 Gunner and up to 2 Subductors. Kasrkin: up to 2 Gunners and Sharpshooters combined.",
            "Faction rules they keep: Breachers keep Void Armour, and the Exaction Squad keeps Ruthless Efficiency and Repress.",
        ],
    },
    "factionRules": [
        ("Inquisitorial Requisition", "Requisitioned operatives (all from one group: Death Korps, Exaction Squad, Imperial Navy Breachers, Kasrkin, Sisters of Silence or Tempestus Scions) become INQUISITORIAL AGENT. They can't use their old faction's ploys, equipment or faction rules unless the requisition card allows it (Breachers keep Void Armour)."),
    ],
    "ploys": {
        "strategy": [
            ("Denounce", "Pick an enemy and roll a D3. In the Firefight phase, it can't activate or act until your opponent has activated that many operatives, or it's their last one. Costs 1 extra CP for each earlier use."),
            ("Intense Scrutiny", "When an Agent picks targets, enemies within 4\" (instead of 2\") can't be in cover. They only lose their cover save within 2\"."),
            ("Quarry", "Pick an enemy as your quarry. Agents attacking it gain Ceaseless. When it's incapacitated, pick a new quarry."),
            ("Irrefutable Jurisdiction", "When an Agent within 3\" of an objective is shot, re-roll one defence die. If it's contesting the objective, re-roll any dice showing one result of your choice instead."),
        ],
        "firefight": [
            ("Absolute Authority", "When your opponent uses a ploy that costs CP (not Command Re-roll), it has no effect, they get the CP back, and they can't use it again this turning point. Once per battle for each ploy."),
            ("Relentless in Pursuit", "When an enemy within 2\" of a ready Agent moves, that Agent makes a free Reposition (ending within 2\" of the enemy) or a free Charge (ending in its control range)."),
            ("The Emperor's Will", "When one is activated, ignore changes to that Agent's stats (including weapon stats) for the activation."),
            ("Intimidating Presence", "When an enemy visible within 3\" of an Agent (6\" of a Mystic) does Pick Up Marker or a mission action (not Operate Hatch), it costs 1 extra AP."),
        ],
    },
    "equipment": [
        {"id": "rosette", "name": "Inquisitorial Rosette", "desc": "Once per battle, when an Agent activates, if you used Quarry this turning point, pick a new quarry."},
        {"id": "combat_daggers", "name": "Combat Daggers", "desc": "Agents get a combat dagger (Sisters of Silence get +1 Atk instead).", "gw": ("melee", "Combat dagger", 3, "4+", "3/4", "-")},
        {"id": "bodysuits", "name": "Armoured Bodysuits", "desc": "When an Agent with a 5+ Save (not the Tome-skull) is shot, retain one defence roll of 4 as a normal success."},
        {"id": "servo_skull", "name": "Servo-skull", "desc": "Once per battle, a mission action costs one Agent 1 less AP."},
    ],
    "operatives": [
        {"id": "interrogator", "name": "Interrogator", "apl": 2, "move": '6"', "save": "5+", "wounds": 8, "pts": 25,
         "ranged": [("Extended stock relic autopistol", 4, "3+", "2/4", 'Range 12", Lethal 5+')], "melee": [FISTS],
         "abilities": ["Inquisitorial Tomes: STRATEGIC GAMBIT (and/or when it's activated), while it's in the killzone. Pick Denunciation or Sanctification for this operative, and the other for the Tome-skull.",
                       "Denunciation: Agents attacking an enemy within 2\" of an operative with this rule get +1 Atk.",
                       "Sanctification: Enemies attacking an Agent within 2\" of an operative with this rule get -1 Atk."],
         "kw": "LEADER, INTERROGATOR"},
        {"id": "tome_skull", "name": "Tome-skull", "apl": 2, "move": '6"', "save": "5+", "wounds": 5, "pts": 25,
         "ranged": [], "melee": [],
         "abilities": ["Consecrated Tome: It can have an Inquisitorial Tome rule, and keeps it even if the Interrogator is removed.",
                       "Machine: It can only Charge, Dash, Fall Back and Reposition. It can't retaliate or assist. Its APL counts as 1 lower for marker control. While it has a Conceal order and is in cover, enemies more than 2\" away can't target it.",
                       EXPENDABLE,
                       "Group Activation: When it's expended, activate the Interrogator next (and the other way round)."],
         "kw": "TOME-SKULL", "ex": ["combat_daggers"]},
    ] + CORE + SCIONS + SISTERS + BREACHERS + DK + EX + KS,
}
