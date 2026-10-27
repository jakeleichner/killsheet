FUSION = ("Fusion pistol", 4, "3+", "5/3", 'Range 3", Devastating 3, Piercing 2')
NEURO = ("Neuro disruptor", 4, "3+", "4/5", 'Range 8", Piercing 1, Stun')
SHURIKEN = ("Shuriken pistol", 4, "3+", "3/4", 'Range 8", Rending')
MELEE = [("Blade", 5, "3+", "4/6", "-"), ("Caress", 5, "3+", "4/5", "Rending"), ("Embrace", 5, "3+", "4/5", "Brutal"), ("Kiss", 5, "3+", "3/7", "-")]
POWER = ("Power weapon", 5, "3+", "4/6", "Lethal 5+")
LUCK = "Luck of the Laughing God: Once per turning point (shared by all your Players), use a firefight ploy for 0CP on it (Command Re-roll for its dice included). Each ploy only once per battle this way."
LEAD = "Lead the Performance: STRATEGIC GAMBIT, once per battle, if it's in the killzone. Change your Allegory, and with it the Accolade."
HG = ("Hallucinogen grenade", 4, "3+", "1/1", 'Range 6", Blast 2", Lethal 5+, Seek Light, Silent, Stun')
SEER = ["Mirror of Minds (1AP): PSYCHIC. Pick an enemy within 8\" that's a valid target. Both players roll five D6. Inflict D3 damage for each matching pair (up to 8 in total). It can't do this within enemy control range.",
        "Fog of Dreams (1AP): PSYCHIC. Pick a visible ready enemy and roll a D6. It can't activate or act this turning point until it's the last enemy to activate, or your opponent has activated that many operatives. It can't do this within enemy control range."]

def vd(oid, name, ranged, melee, abilities, kw, wounds=8):
    return {"id": oid, "name": name, "apl": 3, "move": '7"', "save": "4+", "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

def lead(oid, gun):
    return vd(oid, "Lead Player (" + gun[0].lower() + ")", [gun], MELEE + [POWER],
              ["Loadout: " + gun[0].lower() + ", plus a blade, caress, embrace, kiss or power weapon.", LEAD], "LEADER, LEAD PLAYER", wounds=9)

def player(oid, gun):
    return vd(oid, "Player (" + gun[0].lower() + ")", [gun], MELEE,
              ["Loadout: " + gun[0].lower() + ", plus a blade, caress, embrace or kiss.", LUCK], "PLAYER")

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
            "Select 1 Lead Player, armed with a fusion pistol, neuro disruptor or shuriken pistol, plus a blade, caress, embrace, kiss or power weapon.",
            "Select 7 other operatives. You can take several Players, but every other operative only once.",
            "Players carry a fusion pistol, neuro disruptor or shuriken pistol, plus a blade, caress, embrace or kiss. The Shadowseer carries a hallucinogen grenade, a neuro disruptor or shuriken pistol, and a miststave.",
            "Only 1 fusion pistol and 1 neuro disruptor in the team.",
        ],
    },
    "factionRules": [
        ("Saedath", "STRATEGIC GAMBIT in the first turning point: pick an Allegory for the battle, and one operative to have the Pivotal Role (it gains the Accolade). As a STRATEGIC GAMBIT in later turning points, another operative gains the Accolade. Once per turning point, when the Pivotal Role operative completes the Performance, another operative gains the Accolade."),
        ("Epic", "Performance: it kills an enemy while fighting. Accolade: when it fights, melee weapons gain Balanced."),
        ("Melodrama", "Performance: it kills an enemy while shooting. Accolade: ranged weapons gain Balanced."),
        ("Harlequin's Panoply", "When one is shot and the attacker retained no critical successes, the attacker's Piercing gets worse by 1. Climbing counts as 2\" vertically. They can move within enemy control range, but must start and end moves following the normal rules."),
    ],
    "ploys": {
        "strategy": [
            ("Rising Crescendo", "It can Dash in the same activation after a Charge (but not before)."),
            ("Prismatic Blur", "When one is shot after moving this turning point, re-roll one defense die."),
            ("Darting Salvo", "During a Reposition in its activation, it can stop to Shoot and then finish the move."),
            ("Cegorach's Jest", "Once per sequence, when one fights or retaliates and your opponent strikes with a normal success, roll a D6. If it's below their weapon's Hit, that strike blocks one of your dice instead (ignore Brutal)."),
        ],
        "firefight": [
            ("The Curtain Falls", "When one fights and makes a critical strike that doesn't kill, end the sequence and make a free Fall Back of up to 3\"."),
            ("Elusive Target", "Until its next activation, while it has a Conceal order and is in cover, enemies more than 2\" away can't target it."),
            ("Murderous Entrance", "When one fights after Charging this activation, after you strike, resolve another normal success (or a critical success if you have no normal ones) as a strike straight away."),
            ("Domino Field", "When one is shot, in the Resolve Defense Dice step, one successful defense die blocks all attack dice that show the same result."),
        ],
    },
    "equipment": [
        {"id": "shrieker_toxin", "name": "Shrieker Toxin Rounds", "desc": "Once per turning point, a shuriken pistol or shrieker cannon (focused) gains Devastating 1 for that Shoot."},
        {"id": "death_mask", "name": "Death Mask", "desc": "Keep a Tragedy tally, adding 1 when an operative with an Accolade is incapacitated. When it reaches 3, gain 1CP (once)."},
        {"id": "wraithbone_talisman", "name": "Wraithbone Talisman", "desc": "Once per turning point when shooting, fighting or retaliating, if you fail two or more dice, discard one failure to retain another as a normal success."},
        {"id": "understudys_mask", "name": "Understudy's Mask", "desc": "Once per battle, if your Pivotal Role operative is incapacitated, the next operative you activate takes the Pivotal Role."},
    ],
    "operatives": [
        lead("lead_fusion", FUSION),
        lead("lead_neuro", NEURO),
        lead("lead_shuriken", SHURIKEN),
        vd("death_jester", "Death Jester", [("Shrieker cannon (focused)", 5, "3+", "4/5", "Rending, Heavy (Reposition only), Humbling Cruelty"), ("Shrieker cannon (sweeping)", 4, "3+", "4/5", 'Rending, Heavy (Dash only), Torrent 2", Humbling Cruelty')],
           [("Shrieker blade", 4, "3+", "3/4", "Rending")],
           ["Humbling Cruelty (weapon rule): If the target survives but takes damage, it gains your Humbling Cruelty token. It gets -2\" Move and a worse Hit by 1 (not stacking with being injured) until the end of its next activation."],
           "DEATH JESTER", wounds=9),
        player("player_fusion", FUSION),
        player("player_neuro", NEURO),
        player("player_shuriken", SHURIKEN),
        vd("shadowseer_neuro", "Shadowseer (neuro disruptor)", [HG, NEURO], [("Miststave", 4, "3+", "4/4", "Shock")], SEER, "PSYKER, SHADOWSEER", wounds=9),
        vd("shadowseer_shuriken", "Shadowseer (shuriken pistol)", [HG, SHURIKEN], [("Miststave", 4, "3+", "4/4", "Shock")], SEER, "PSYKER, SHADOWSEER", wounds=9),
    ],
}
