AUTOPISTOL = ("Autopistol", 4, "4+", "2/3", 'Range 8"')
BLUDGEON = ("Bludgeon", 4, "3+", "4/4", "Brutal")
CLEAVER = ("Cleaver", 4, "3+", "4/5", "-")
WARRIOR = ["Warrior Frenzy: While it has a Frenzy token it can't be injured."]

def fg(oid, name, ranged, melee, abilities, kw, save="5+", wounds=10):
    return {"id": oid, "name": "Fellgor " + name, "apl": 2, "move": '6"', "save": save, "wounds": wounds, "pts": 32,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw}

TEAM = {
    "id": "fellgor", "source": "fellgor_ravagers", "name": "Fellgor Ravagers", "badge": "CHAOS", "color": "#8C5A3C",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Ironhorn", "min": 1, "max": 1, "ids": ["ironhorn"]},
            {"name": "Operatives", "desc": "9 Fellgor Ravager operatives from the list below", "min": 9, "max": 9,
             "ids": ["deathknell", "fluxbray", "gnarlscar", "gorehorn", "herd_goad", "mangler", "shaman", "toxhorn", "vandal", "warrior_bludgeon", "warrior_cleaver"]},
        ],
        "repeatable": ["warrior_bludgeon", "warrior_cleaver"],
        "rules": [
            "Select 1 Ironhorn: corrupted pistol + corrupted chainsword, or plasma pistol + bludgeon.",
            "Select 9 other operatives. Other than Warriors, each only once.",
        ],
    },
    "factionRules": [
        ("Frenzy", "A Ravager without a Frenzy token that would be incapacitated isn't: it gains a Frenzy token, all remaining attack dice are discarded and it switches to Engage. With a token it can't Conceal, is injured, can't do Pick Up Marker, unique (except Sweeping Blow) or mission actions (Operate Hatch allowed), and counts as APL 1 for control. It's incapacitated when its activation/counteraction ends, when struck by a crit, struck twice by normals, takes Critical Dmg or Normal Dmg from 2+ dice when shot, or at battle end. For enemy scoring it counts as incapacitated when it gains the token."),
    ],
    "ploys": {
        "strategy": [
            ("Pelting Firepower", "Shooting an enemy another Ravager shot this TP: Ceaseless (Relentless if two or more others did)."),
            ("Reckless Determination", "An expended Ravager shot with no cover saves: retain one defence die as a normal success without rolling."),
            ("Violent Temperament", "Fighting/retaliating, after rolling: you may re-roll all of your attack dice (all or none)."),
            ("Ambush", "A Ravager switched from Conceal to Engage on activation is ambushing: when fighting, retain one normal success as a crit (not with a Frenzy token)."),
        ],
        "firefight": [
            ("Animalistic Fury", "Fighting/retaliating, striking with a crit: +1 dmg."),
            ("Bloodsense", "A Ravager kills an enemy in its control range during its activation: another ready Ravager visible within 3\" of that enemy activates next."),
            ("Ruthless Rampage", "After a Fight, if no longer in enemy control range: a free Charge of up to 3\" (even if it already Charged)."),
            ("Wild Rage", "On activation: +1\" Move for the activation."),
        ],
    },
    "equipment": [
        {"id": "chaos_sigil", "name": "Chaos Sigil", "desc": "Once/TP, a Ravager being shot: attacker's Piercing worsened by 1."},
        {"id": "war_paint", "name": "War Paint", "desc": "Ignore Move stat changes from being injured."},
        {"id": "brass_adornments", "name": "Brass Adornments", "desc": "Once/battle each, Animalistic Fury and Wild Rage cost 0CP."},
        {"id": "gore_marks", "name": "Gore Marks", "desc": "Once/TP fighting/retaliating: take 1 dmg to re-roll one attack die; if it fails, take 1 more."},
    ],
    "operatives": [
        fg("ironhorn", "Ironhorn", [("Corrupted pistol", 4, "4+", "3/5", 'Range 8", Rending'), ("Plasma pistol (standard)", 4, "4+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "4+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [BLUDGEON, ("Corrupted chainsword", 4, "3+", "4/5", "Rending")],
           ["Loadout: corrupted pistol + corrupted chainsword, or plasma pistol + bludgeon.",
            "Call the Attack: STRATEGIC GAMBIT (no Frenzy token): a Ravager visible within 6\", and others visible within 2\" of it, make a free Dash."],
           "LEADER, IRONHORN", wounds=11),
        fg("deathknell", "Deathknell", [AUTOPISTOL], [BLUDGEON],
           ["Icon Bearer: Ignores Frenzy's control rule; marker control APL +1.",
            "War Gong: Crit damage on a Ravager within 3\" can become Normal Dmg while this has no Frenzy token.",
            "Gong Knell (1AP): Until its next activation, Save +1 when shot."],
           "DEATHKNELL", save="4+"),
        fg("fluxbray", "Fluxbray", [], [("Triple cleavers", 4, "3+", "4/5", "Ceaseless")],
           ["Blade Whirl: Fighting/retaliating without a Frenzy token, resolve one success early as a block.",
            "Cleaver Flurry (2AP): A free Reposition with +2\", passing through enemy control range (not starting or ending there); D3+1 dmg to each enemy it passed. Not on Conceal."],
           "FLUXBRAY"),
        fg("gnarlscar", "Gnarlscar", [AUTOPISTOL], [("Bionic fist", 4, "3+", "4/5", "Brutal")],
           ["Sagacious: At the end of its activation, you can change its order.",
            "Uncompromising Attack (1AP): A free Fight and a free Shoot (autopistol), in either order; the Shoot can target an enemy in its own control range."],
           "GNARLSCAR"),
        fg("gorehorn", "Gorehorn", [AUTOPISTOL], [("Skullcleaver", 4, "3+", "4/5", "Lethal 5+, Headtaker")],
           ["Champion: Can Fight twice per activation.",
            "Headtaker (weapon rule): On a kill, roll D3: regain that many wounds (not with a Frenzy token) and add it to the skullcleaver's Crit Dmg for the battle (max 8)."],
           "GOREHORN"),
        fg("herd_goad", "Herd-goad", [AUTOPISTOL, ("Crackthorn whip (ranged)", 4, "2+", "2/3", 'Range 3", Lethal 4+, Stun')], [("Crackthorn whip (melee)", 4, "3+", "2/3", "Lethal 4+, Shock")],
           ["Whip Control: An enemy visible within 3\" (if it's the only enemy near this): -1 melee Atk (min 1) and Fall Back costs +1AP.",
            "Incite Fury (1AP): Another Ravager (not Shaman or Ironhorn) visible within 3\": +1 APL until end of its next activation. Not within enemy control range."],
           "HERD-GOAD"),
        fg("mangler", "Mangler", [], [("Vicious claws", 4, "4+", "4/6", "Ceaseless, Tactual Hunter")],
           ["Tactual Hunter (weapon rule): Vs an expended enemy, after the first crit strike, resolve another success as a strike immediately.",
            "Berserker: Can't Shoot (Guard allowed, but no free Shoot). Pick Up Marker and mission actions cost +1AP (not Operate Hatch).",
            "Savage: After its first Fight each activation (if alive), a free Fight (any enemy). No Ruthless Rampage between them."],
           "MANGLER"),
        fg("shaman", "Shaman", [AUTOPISTOL, ("Tech-curse", 4, "3+", "1/3", "PSYCHIC, Rending, Saturate, Seek Light")], [("Braystave", 4, "3+", "3/5", "Shock")],
           ["Apoplectic Rejuvenation (1AP): A Ravager without a Frenzy token visible within 6\" regains up to 2D3 wounds (6 if it has killed in a fight this battle). Not within enemy control range.",
            "Mantle of Darkness (1AP): PSYCHIC. Until its next activation, Ravagers visible within 3\" that are Concealed and in cover can't be targeted (except within 2\"). Not within enemy control range."],
           "PSYKER, SHAMAN"),
        fg("toxhorn", "Toxhorn", [AUTOPISTOL], [CLEAVER],
           ["Toxic Blessings: Ignore APL changes and enemy Shock; Normal Dmg of 3+ on it: D6, on 5+ subtract 1.",
            "Pox Bomb: Can use stun grenades without using up equipment limits; enemy stun tests of 3+ also deal half the roll (round up) as damage."],
           "TOXHORN"),
        fg("vandal", "Vandal", [], [("Mancrusher", 4, "4+", "5/5", "Brutal, Vicious Blows")],
           ["Vicious Blows (weapon rule): Fighting with it: Ceaseless.",
            "Sweeping Blow (1AP): D3+1 dmg to each other operative visible within 2\". Not on Conceal."],
           "VANDAL"),
        fg("warrior_bludgeon", "Warrior (bludgeon)", [AUTOPISTOL], [BLUDGEON], WARRIOR, "WARRIOR"),
        fg("warrior_cleaver", "Warrior (cleaver)", [AUTOPISTOL], [CLEAVER], WARRIOR, "WARRIOR"),
    ],
}
