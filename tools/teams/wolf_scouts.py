PLASMA_PISTOL = [("Plasma pistol (std)", 4, "3+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (super)", 4, "3+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')]
BLADE5 = ("Combat blade", 5, "3+", "4/5", "-")
BLADE4 = ("Combat blade", 4, "3+", "4/5", "-")

def scout(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": name, "apl": 3, "move": '7"', "save": "3+", "wounds": 13, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "wolfscouts", "source": "wolf_scouts", "name": "Wolf Scouts", "badge": "SPACE WOLVES", "color": "#7A9AB5",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 6,
        "groups": [
            {"name": "Fenrisian Wolf", "desc": "1 Fenrisian Wolf", "min": 1, "max": 1, "ids": ["fenrisian_wolf"]},
            {"name": "Wolf Scouts", "desc": "5 Wolf Scouts from the list below", "min": 5, "max": 5,
             "ids": ["pack_leader", "fangbearer", "frosteye", "gunner", "trapmaster", "skjald", "hunter"]},
        ],
        "repeatable": ["hunter"],
        "rules": [
            "Select 1 Fenrisian Wolf.",
            "Select 5 Wolf Scouts. You can take several Hunters, but every other operative only once (the Pack Leader is optional).",
        ],
    },
    "factionRules": [
        ("Hunting Astartes", "During each activation, an operative can take two Shoot actions or two Fight actions. If it shoots twice, the second Shoot costs 1 extra AP if both use a plasma gun or plasma pistol, and it can't use PSYCHIC ranged weapons for both. These operatives can counteract whatever their order. When one counteracts wholly within your Storm, it can change its order first, or instead of taking an action."),
        ("Elemental Storm", "STRATEGIC GAMBIT: place or move your Storm marker. Operatives wholly within 6\" of it horizontally are wholly within your Storm. Wolf Scouts can Charge with a Conceal order if they end wholly within your Storm."),
    ],
    "ploys": {
        "strategy": [
            ("Storm's Bite", "When one fights an enemy wholly within your Storm, that enemy gets -1 Atk on melee weapons (to a minimum of 3)."),
            ("Savage Fighters", "After it retaliates, if it's alive and the enemy is still in its control range, inflict D3+1 damage on that enemy."),
            ("Cloaked by the Storm", "When one is shot while wholly within your Storm, re-roll one defence die."),
            ("Tempestuous Wrath", "When one fights or retaliates while wholly within your Storm (or after starting the activation there), melee weapons gain Balanced."),
        ],
        "firefight": [
            ("Touched by Lokyar", "After rolling attack dice for a Wolf Scout (not the Wolf) fighting more than 5\" from other friendly operatives, re-roll any of them."),
            ("Transhuman Physiology", "When a Wolf Scout (not the Wolf) is shot, retain one normal defence success as a critical success."),
            ("Acute Senses", "Use when one Shoots. Its ranged weapons gain Range 6\" and Seek Light, and enemies can't be obscured."),
            ("Counterattack", "At the end of an enemy's activation, or after it Fights, one Wolf Scout makes a free Fight against that enemy only."),
        ],
    },
    "equipment": [
        {"id": "wolfteeth", "name": "Wolfteeth Necklaces", "desc": "Once per turning point when one attacks (not the Wolf), if you fail two or more dice, discard one failure to retain another as a normal success.", "ex": ["fenrisian_wolf"]},
        {"id": "trophies", "name": "Talismanic Trophies", "desc": "When one (not the Wolf) fights or retaliates wholly within your Storm, subtract 1 damage from one normal success.", "ex": ["fenrisian_wolf"]},
        {"id": "frost_weapons", "name": "Frost Weapons", "desc": "While they're wholly within your Storm, combat blades gain Lethal 5+."},
        {"id": "runic_charms", "name": "Runic Charms", "desc": "Once per turning point, when one (not the Wolf) is shot while wholly within your Storm, the attacker's Piercing gets worse by 1.", "ex": ["fenrisian_wolf"]},
    ],
    "operatives": [
        {"id": "fenrisian_wolf", "name": "Fenrisian Wolf", "apl": 2, "move": '8"', "save": "5+", "wounds": 9, "pts": "60x35",
         "ranged": [], "melee": [("Fangs", 4, "3+", "4/5", "Rending")],
         "abilities": ["Instinctive Predator: It can only Charge, Dash, Fall Back, Fight, Guard and Reposition, and only with its own weapons. It can Charge with a Conceal order.",
                       "Pounce: STRATEGIC GAMBIT, once per battle, if its APL is 2 or more. It makes a free Charge, Fall Back or Reposition. Then it gets -1 APL and can't take any of those actions until the end of its next activation."],
         "kw": "FENRISIAN WOLF"},
        scout("pack_leader", "Pack Leader", PLASMA_PISTOL, [("Power weapon", 5, "3+", "4/6", "Lethal 5+")],
              ["Lupine Guile: Once per battle, after the initiative roll-off, if it's in the killzone, re-roll your dice.",
               "Grizzled Veteran: The first time it would be incapacitated, it stays on 1 wound and can't be incapacitated for the rest of that action. All remaining attack dice are discarded, and no Counterattack or Savage Fighters damage happens afterwards."],
              "PACK, LEADER"),
        scout("fangbearer", "Fangbearer", [("Absolvor bolt pistol", 4, "3+", "4/5", 'Range 8", Piercing Crits 1')], [BLADE5],
              ["Spiritual Chirurgy: If you selected it, Wolf Scouts (not the Wolf) ignore stat changes from being injured, including weapon stats, even after it's incapacitated.",
               "Healing Balms (1AP): A Wolf Scout in its control range regains up to D3+3 wounds. Once per turning point, and not within enemy control range."],
              "FANGBEARER"),
        scout("frosteye", "Frosteye", [("Instigator bolt carbine", 4, "3+", "3/4", "Piercing Crits 1, Silent")], [BLADE4],
              ["Storm-veiled Execution: While it's wholly within your Storm, it can Guard in any killzone, even with a Conceal order.",
               "Hunter's Senses (1AP): Until its next activation, its carbine gains Severe, or Saturate (and enemies can't be obscured). It can't do this within enemy control range."],
              "FROSTEYE"),
        scout("gunner", "Gunner", [("Plasma gun (std)", 4, "3+", "4/6", "Piercing 1"), ("Plasma gun (super)", 4, "3+", "5/6", "Hot, Lethal 5+, Piercing 1")], [BLADE4],
              ["Tempest's Fury: While it's wholly within your Storm, its plasma gun gains Punishing, and the supercharge profile loses Hot."],
              "GUNNER"),
        scout("trapmaster", "Trapmaster", PLASMA_PISTOL, [BLADE5],
              ["Haywire Mine: It carries your Haywire Mine marker and can pick it up, but can't place it in another operative's control range.",
               "Proximity Mine: The first time the mine is in another operative's control range, remove it. That operative gets -1 APL until the end of its next activation and takes 2D3+3 damage (D3+6 within 6\" of your Storm marker). If it survives, its action ends. The Trapmaster never sets it off."],
              "TRAPMASTER"),
        scout("skjald", "Rune Priest Skjald", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Jaws of the World Wolf", 4, "3+", "3/5", 'PSYCHIC, Blast 2", Severe'),
                                               ("Thunderclap", 5, "2+", "2/2", 'PSYCHIC, Range 6", Saturate, Seek Light, Stun, Torrent 2"')],
              [("Runic stave", 5, "3+", "4/6", "PSYCHIC, Shock")],
              ["Cast the Runes: Before the battle, roll 3D6. For each result of 1 to 4, you get one 0CP Command Re-roll in the turning point with that number. For any 5 or 6, gain 1CP.",
               "Call the Storm (1AP): PSYCHIC. Move your Storm marker, or pick a Wolf Scout. Until this operative's next activation, that Wolf Scout is obscured while it's wholly within your Storm and more than 3\" from the active operative. It can't do this within enemy control range."],
              "PSYKER, RUNE PRIEST SKJALD"),
        scout("hunter", "Hunter", PLASMA_PISTOL, [BLADE5],
              ["Fierce Temperament: While it's wholly within your Storm, its weapons gain Severe."],
              "HUNTER"),
    ],
}
