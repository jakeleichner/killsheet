BLADES = ("Array of blades", 3, "3+", "3/4", "-")
SPLINTER_RIFLE = ("Splinter rifle", 4, "3+", "2/4", "Lethal 5+")
SPLINTER_PISTOL = ("Splinter pistol", 4, "3+", "2/4", 'Range 8", Lethal 5+')
VENOM = ("Venom blade", 4, "3+", "4/5", "Lethal 4+")
ARCH_ABILITIES = [
    "Cunning: In the Gambit step, if it's in the killzone and you pass at your first chance (ignoring mission gambits), gain 1CP.",
    "Torturous Vision: Once per activation, when it Fights or Shoots without a Pain token, it can gain one as it picks its target.",
]

def kab(oid, name, ranged, melee, abilities, kw, wounds=8):
    return {"id": oid, "name": "Kabalite " + name, "apl": 2, "move": '7"', "save": "4+", "wounds": wounds, "pts": 25,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "handofthearchon", "source": "hand_of_the_archon", "name": "Hand of the Archon", "badge": "DRUKHARI", "color": "#6B2D6B",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 9,
        "groups": [
            {"name": "Leader", "desc": "1 Archsybarite", "min": 1, "max": 1, "ids": ["archsybarite", "archsybarite_blast"]},
            {"name": "Operatives", "desc": "8 Kabalites from the list below", "min": 8, "max": 8,
             "ids": ["agent", "crimson_duellist", "disciple", "elixicant", "flayer", "gunner_blaster", "gunner_shredder", "heavy_lance", "heavy_cannon", "skysplinter"]},
        ],
        "repeatable": ["agent"],
        "caps": [
            {"ids": ["gunner_blaster", "gunner_shredder"], "max": 1, "label": "Only 1 Gunner"},
            {"ids": ["heavy_lance", "heavy_cannon"], "max": 1, "label": "Only 1 Heavy Gunner"},
            {"ids": ["archsybarite_blast", "gunner_blaster", "heavy_lance"], "max": 2, "label": "Up to 2 darklight weapons (blast pistol, blaster, dark lance)"},
        ],
        "rules": [
            "Select 1 Archsybarite, armed with a blast pistol and venom blade; a splinter pistol with a venom blade, agoniser or power weapon; or a splinter rifle and array of blades.",
            "Select 8 other operatives. You can take several Agents, but every other operative only once.",
            "Up to 2 darklight weapons in the team: blast pistol, blaster, dark lance.",
        ],
    },
    "factionRules": [
        ("Power from Pain", "After an action in which a Kabalite injured an enemy without killing it, or killed one, it gains a Pain token (two for killing an enemy with 12 or more Wounds). Spend tokens on one invigoration per activation or counteraction (Stimulated Senses can be added on top). Dark Animus: +1 APL until its next activation. Accelerated Rejuvenation: regain D3+1 wounds. Vitalized Surge: after a kill, make a free Dash. Stimulated Senses: after rolling, re-roll any dice showing one result of your choice."),
        ("Rifles", "When one shoots a splinter rifle before any Charge, Fall Back or Reposition this activation, it gains Accurate 1."),
    ],
    "ploys": {
        "strategy": [
            ("Blade Artists", "Melee weapons gain Rending."),
            ("Merciless Sadists", "When shooting or fighting a wounded enemy, weapons gain Balanced."),
            ("From Darkness, Death", "When one is activated, pick an enemy it isn't a valid target for. The first time it attacks that enemy this activation, retain one normal success as a critical success."),
            ("Denizens of Night", "When one is shot while more than 2\" from enemies, with Heavy or Light terrain intervening or while under Vantage terrain, re-roll one defense die."),
        ],
        "firefight": [
            ("Cruel Deception", "This activation, Fall Back costs it 1 less AP."),
            ("Devious Scheme", "After your opponent uses a firefight ploy that costs CP, it costs them 1 extra CP next time. You can't use this again until that happens."),
            ("Heinous Arrogance", "On your turn to activate, skip that activation."),
            ("Prey on the Wounded", "After rolling attack dice against a wounded enemy, re-roll any of them."),
        ],
    },
    "equipment": [
        {"id": "chain_snare", "name": "Chain Snare", "desc": "Once per turning point, when the only enemy in a Kabalite's control range tries to Fall Back, roll 2D6 (1D6 if the enemy has more Wounds). On any 4+, it can't."},
        {"id": "wicked_blades", "name": "Wicked Blades", "desc": "Arrays of blades get +1 Atk."},
        {"id": "toxin_coating", "name": "Toxin Coating", "desc": "Up to twice per turning point when one fights or retaliates, its melee weapon gains Lethal 5+ for that sequence."},
        {"id": "refined_poison", "name": "Refined Poison", "desc": "Up to twice per turning point, a shardcarbine, splinter cannon, splinter pistol, splinter rifle or stinger pistol gets +1 Normal Dmg for that action."},
    ],
    "operatives": [
        kab("archsybarite", "Archsybarite", [SPLINTER_PISTOL, SPLINTER_RIFLE],
            [("Agoniser", 4, "3+", "3/5", "Brutal, Lethal 5+, Shock"), BLADES, ("Power weapon", 4, "3+", "4/6", "Lethal 5+"), VENOM],
            ["Loadout: a splinter pistol with a venom blade, agoniser or power weapon, or a splinter rifle and array of blades."] + ARCH_ABILITIES,
            "LEADER, ARCHSYBARITE", wounds=9),
        kab("archsybarite_blast", "Archsybarite (blast pistol)", [("Blast pistol", 4, "3+", "3/4", 'Range 8", Piercing 2')], [VENOM],
            ["Loadout: a blast pistol and venom blade."] + ARCH_ABILITIES, "LEADER, ARCHSYBARITE", wounds=9),
        kab("agent", "Agent", [SPLINTER_RIFLE], [BLADES],
            ["Sadistic Competition: Once per turning point, when a Kabalite gains a Pain token, one Agent without a token also gains one."], "AGENT"),
        kab("crimson_duellist", "Crimson Duellist", [SPLINTER_PISTOL], [("Razorflail", 4, "2+", "4/5", "Brutal, Tangle")],
            ["Tangle (weapon rule): Each block can block two unresolved successes.",
             "Crimson Duellist: It can Fight twice in each activation.",
             "Brutal Display: Once per turning point, after it kills an enemy in its control range, pick another enemy visible within 6\" of either. Until the next turning point, that enemy can't control markers, Pick Up Marker or take mission actions."],
            "CRIMSON DUELLIST"),
        kab("disciple", "Disciple of Yaelindra", [("Stinger pistol", 4, "3+", "3/5", 'Range 8", Lethal 5+, Stinger')], [BLADES],
            ["Stinger (weapon rule): When it kills an enemy, that enemy inflicts D3 damage on each other operative visible within 2\" of it. This chains on further kills.",
             "Torment Grenade (1AP): An enemy visible within 6\", and each operative within 1\" of it, takes a poison test: roll a D6, adding 1 if its Save is 4+ or worse. On a 3+, it takes D3 damage and gains a Poison token (D3 damage each time it activates). It can't do this within enemy control range."],
            "DISCIPLE OF YAELINDRA"),
        kab("elixicant", "Elixicant", [SPLINTER_RIFLE, ("Stim-needler", 4, "3+", "0/0", 'Range 3", Lethal 3+, Stun')], [BLADES],
            ["Combat Drugs: At the end of Select Operatives (if it's deployed), pick one for all Kabalites. Painbringer: whenever an attack die inflicts 3 or more damage on it, roll one D6: on a 6, subtract 1 from that damage. Adrenalight: in the Ready step, one operative gains a Pain token. Hypex: ignore Move changes from being injured.",
             "Administer Drug (1AP): A Kabalite visible within 3\" regains up to 2D3 wounds, or switches to a different Combat Drug for the battle. It can't do this within enemy control range."],
            "ELIXICANT"),
        kab("flayer", "Flayer", [], [("Pain sculptors", 4, "3+", "4/5", "Ceaseless, Flay")],
            ["Flay (weapon rule): On your first critical strike each sequence, a Kabalite within 6\" gains a Pain token.",
             "Insensible to Pain: Normal and Critical Dmg of 3 or more inflicts 1 less damage on it."],
            "FLAYER"),
        kab("gunner_blaster", "Gunner (blaster)", [("Blaster", 4, "3+", "4/5", "Piercing 2")], [BLADES], [], "GUNNER"),
        kab("gunner_shredder", "Gunner (shredder)", [("Shredder", 4, "3+", "4/5", 'Rending, Torrent 2"')], [BLADES], [], "GUNNER"),
        kab("heavy_lance", "Heavy Gunner (dark lance)", [("Dark lance", 4, "3+", "6/7", "Heavy (Dash only), Piercing 2")], [BLADES], [], "HEAVY GUNNER"),
        kab("heavy_cannon", "Heavy Gunner (splinter cannon)", [("Splinter cannon (focused)", 5, "3+", "3/5", "Heavy (Dash only), Lethal 5+"), ("Splinter cannon (sweeping)", 4, "3+", "3/5", 'Heavy (Dash only), Lethal 5+, Torrent 1"')], [BLADES], [], "HEAVY GUNNER"),
        kab("skysplinter", "Skysplinter Assassin", [("Razorwing", 4, "4+", "1/2", "Saturate, Seek, Silent"), ("Shardcarbine", 4, "2+", "2/2", "Devastating 2, Lethal 5+")], [BLADES],
            ["Merciless Hunter: If it doesn't Mark this activation, it can Shoot twice, using the razorwing for exactly one of them.",
             "Omen: When selecting equipment, pick an enemy (your opponent must re-roll their 6s for it) or another Kabalite (you can re-roll its 1s).",
             "Mark (1AP): Pick a visible enemy. Until the end of the turning point, when this operative shoots it, it gains Seek Light and the enemy can't be obscured. It can't do this within enemy control range."],
            "SKYSPLINTER ASSASSIN"),
    ],
}
