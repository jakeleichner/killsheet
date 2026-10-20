FUSION = ("Fusion pistol", 4, "3+", "5/3", 'Range 3", Devastating 3, Piercing 2')
NEURO = ("Neuro disruptor", 4, "3+", "4/5", 'Range 8", Piercing 1, Stun')
SHURIKEN = ("Shuriken pistol", 4, "3+", "3/4", 'Range 8", Rending')
MELEE = [("Blade", 5, "3+", "4/6", "-"), ("Caress", 5, "3+", "4/5", "Rending"), ("Embrace", 5, "3+", "4/5", "Brutal"), ("Kiss", 5, "3+", "3/7", "-")]
POWER = ("Power weapon", 5, "3+", "4/6", "Lethal 5+")
LUCK = "Luck of the Laughing God: Once/TP, a firefight ploy for 0CP on this operative (including Command Re-roll on its dice); each ploy once per battle this way."
LEAD = "Lead the Performance: Once/battle STRATEGIC GAMBIT, if this is in the killzone: change your ALLEGORY (and so the ACCOLADE)."
HG = ("Hallucinogen grenade", 4, "3+", "1/1", 'Range 6", Blast 2", Lethal 5+, Seek Light, Silent, Stun')
SEER = ["Mirror of Minds (1AP): PSYCHIC. An enemy valid target within 8\": both players roll five D6; D3 dmg per matching pair (max 8). Not within enemy control range.",
        "Fog of Dreams (1AP): PSYCHIC. A visible ready enemy: roll D6; it can't activate or act this TP until it's the last enemy to activate or your opponent has activated that many operatives. Not within enemy control range."]

def vd(oid, name, ranged, melee, abilities, kw, wounds=8):
    return {"id": oid, "name": name, "apl": 3, "move": '7"', "save": "4+", "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def lead(oid, gun):
    return vd(oid, "Lead Player (" + gun[0].lower() + ")", [gun], MELEE + [POWER],
              ["Loadout: " + gun[0].lower() + " + blade, caress, embrace, kiss or power weapon.", LEAD], "LEADER, LEAD PLAYER", wounds=9)

def player(oid, gun):
    return vd(oid, "Player (" + gun[0].lower() + ")", [gun], MELEE,
              ["Loadout: " + gun[0].lower() + " + blade, caress, embrace or kiss.", LUCK], "PLAYER")

TEAM = {
    "id": "voiddancers", "source": "void_dancer_troupe", "name": "Void-dancer Troupe", "badge": "AELDARI", "color": "#B8336A",
    "archetypes": "Infiltration, Recon",
    "composition": {
        "total": 8,
        "groups": [
            {"name": "Leader", "desc": "1 Lead Player", "min": 1, "max": 1, "ids": ["lead_fusion", "lead_neuro", "lead_shuriken"]},
            {"name": "Operatives", "desc": "7 Harlequins from the list below", "min": 7, "max": 7,
             "ids": ["death_jester", "player_fusion", "player_neuro", "player_shuriken", "shadowseer_neuro", "shadowseer_shuriken"]},
        ],
        "repeatable": ["player_shuriken"],
        "caps": [
            {"ids": ["shadowseer_neuro", "shadowseer_shuriken"], "max": 1, "label": "Only 1 Shadowseer"},
            {"ids": ["lead_fusion", "player_fusion"], "max": 1, "label": "Max 1 fusion pistol"},
            {"ids": ["lead_neuro", "player_neuro", "shadowseer_neuro"], "max": 1, "label": "Max 1 neuro disruptor"},
        ],
        "rules": [
            "Select 1 Lead Player: fusion pistol, neuro disruptor or shuriken pistol, + blade, caress, embrace, kiss or power weapon.",
            "Select 7 other operatives. Other than Players, each only once.",
            "Players: fusion pistol, neuro disruptor or shuriken pistol, + blade, caress, embrace or kiss. Shadowseer: hallucinogen grenade + neuro disruptor or shuriken pistol + miststave.",
            "Max 1 fusion pistol and 1 neuro disruptor in the team.",
        ],
    },
    "factionRules": [
        ("Saedath", "STRATEGIC GAMBIT in TP1: pick an ALLEGORY for the battle and one operative to have the PIVOTAL ROLE (it gains the ACCOLADE). STRATEGIC GAMBIT in later TPs: another operative gains the ACCOLADE. Once/TP, when the Pivotal Role operative completes the Performance, another operative gains the ACCOLADE."),
        ("Epic", "Performance: it kills an enemy while fighting. Accolade: fighting, melee weapons gain Balanced."),
        ("Melodrama", "Performance: it kills an enemy while shooting. Accolade: ranged weapons gain Balanced."),
        ("Harlequin's Panoply", "Shot with no attack dice retained as crits: attacker's Piercing worsened by 1. Climbing up counts as 2\" vertical. They can move within enemy control range (start and end following normal rules)."),
    ],
    "ploys": {
        "strategy": [
            ("Rising Crescendo", "Can Dash in the same activation after a Charge (not before)."),
            ("Prismatic Blur", "Being shot after moving this TP: re-roll one defence die."),
            ("Darting Salvo", "During a Reposition in its activation, it can stop to Shoot and then finish the move."),
            ("Cegorach's Jest", "Fighting/retaliating, opponent strikes with a normal: roll D6; below their weapon's Hit, that strike instead blocks one of your dice (ignore Brutal). Once per sequence."),
        ],
        "firefight": [
            ("The Curtain Falls", "Fighting, after a crit strike that doesn't kill: end the sequence and make a free Fall Back of up to 3\"."),
            ("Elusive Target", "Until its next activation, while Concealed and in cover it can't be targeted (except within 2\")."),
            ("Murderous Entrance", "Fighting after Charging this activation, after you strike: resolve another normal (or crit if none) as a strike immediately."),
            ("Domino Field", "Being shot, Resolve Defence Dice: one successful defence die blocks all attack dice with the same result."),
        ],
    },
    "equipment": [
        {"id": "shrieker_toxin", "name": "Shrieker Toxin Rounds", "desc": "Once/TP shooting a shuriken pistol or shrieker cannon (focused): Devastating 1 for that action."},
        {"id": "death_mask", "name": "Death Mask", "desc": "Keep a Tragedy tally: +1 when an operative with an ACCOLADE is incapacitated. At 3, gain 1CP (once)."},
        {"id": "wraithbone_talisman", "name": "Wraithbone Talisman", "desc": "Once/TP shooting/fighting/retaliating with 2+ fails: discard one to retain another as a normal."},
        {"id": "understudys_mask", "name": "Understudy's Mask", "desc": "Once/battle, if your Pivotal Role operative is incapacitated: the operative you activate takes the Pivotal Role."},
    ],
    "operatives": [
        lead("lead_fusion", FUSION),
        lead("lead_neuro", NEURO),
        lead("lead_shuriken", SHURIKEN),
        vd("death_jester", "Death Jester", [("Shrieker cannon (focused)", 5, "3+", "4/5", "Rending, Heavy (Reposition only), Humbling Cruelty"), ("Shrieker cannon (sweeping)", 4, "3+", "4/5", 'Rending, Heavy (Dash only), Torrent 2", Humbling Cruelty')],
           [("Shrieker blade", 4, "3+", "3/4", "Rending")],
           ["Humbling Cruelty (weapon rule): If the target survives but takes damage, it gains your Humbling Cruelty token: -2\" Move and Hit worsened by 1 (not cumulative with injured) until the end of its next activation."],
           "DEATH JESTER", wounds=9),
        player("player_fusion", FUSION),
        player("player_neuro", NEURO),
        player("player_shuriken", SHURIKEN),
        vd("shadowseer_neuro", "Shadowseer (neuro disruptor)", [HG, NEURO], [("Miststave", 4, "3+", "4/4", "Shock")], SEER, "PSYKER, SHADOWSEER", wounds=9),
        vd("shadowseer_shuriken", "Shadowseer (shuriken pistol)", [HG, SHURIKEN], [("Miststave", 4, "3+", "4/4", "Shock")], SEER, "PSYKER, SHADOWSEER", wounds=9),
    ],
}
