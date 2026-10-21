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
            "Select 1 Ironhorn, armed with a corrupted pistol and corrupted chainsword, or a plasma pistol and bludgeon.",
            "Select 9 other operatives. You can take several Warriors, but every other operative only once.",
        ],
    },
    "factionRules": [
        ("Frenzy", "When a Ravager without a Frenzy token would be incapacitated, it isn't. Instead it gains a Frenzy token, all remaining attack dice are discarded, and it switches to Engage. With a token, it can't Conceal, it's injured, it can't Pick Up Marker or take unique actions (except Sweeping Blow) or mission actions (Operate Hatch is allowed), and it counts as APL 1 for control. It's incapacitated when its activation or counteraction ends, when it's struck by a critical success or twice by normal successes, when it takes Critical Dmg or Normal Dmg from two or more dice while shot, or at the end of the battle. For your opponent's scoring, it counts as incapacitated as soon as it gains the token."),
    ],
    "ploys": {
        "strategy": [
            ("Pelting Firepower", "When shooting an enemy that another Ravager shot this turning point, weapons gain Ceaseless, or Relentless if two or more others did."),
            ("Reckless Determination", "When an expended Ravager is shot and has no cover saves, retain one defence die as a normal success without rolling it."),
            ("Violent Temperament", "When one fights or retaliates, after rolling you can re-roll all of your attack dice (all or none)."),
            ("Ambush", "A Ravager that switched from Conceal to Engage when activated is ambushing. When it fights, retain one normal success as a critical success (not with a Frenzy token)."),
        ],
        "firefight": [
            ("Animalistic Fury", "When one fights or retaliates and strikes with a critical success, it deals 1 extra damage."),
            ("Bloodsense", "When a Ravager kills an enemy in its control range during its activation, another ready Ravager visible within 3\" of that enemy activates next."),
            ("Ruthless Rampage", "After a Fight, if it's no longer in enemy control range, it makes a free Charge of up to 3\", even if it already Charged."),
            ("Wild Rage", "When one is activated, it gets +1\" Move for that activation."),
        ],
    },
    "equipment": [
        {"id": "chaos_sigil", "name": "Chaos Sigil", "desc": "Once per turning point, when a Ravager is shot, the attacker's Piercing gets worse by 1."},
        {"id": "war_paint", "name": "War Paint", "desc": "Ignore Move changes from being injured."},
        {"id": "brass_adornments", "name": "Brass Adornments", "desc": "Once per battle each, Animalistic Fury and Wild Rage cost 0CP."},
        {"id": "gore_marks", "name": "Gore Marks", "desc": "Once per turning point when one fights or retaliates, take 1 damage to re-roll one attack die. If the re-roll fails, take 1 more."},
    ],
    "operatives": [
        fg("ironhorn", "Ironhorn", [("Corrupted pistol", 4, "4+", "3/5", 'Range 8", Rending'), ("Plasma pistol (standard)", 4, "4+", "3/5", 'Range 8", Piercing 1'), ("Plasma pistol (supercharge)", 4, "4+", "4/5", 'Range 8", Hot, Lethal 5+, Piercing 1')],
           [BLUDGEON, ("Corrupted chainsword", 4, "3+", "4/5", "Rending")],
           ["Loadout: a corrupted pistol and corrupted chainsword, or a plasma pistol and bludgeon.",
            "Call the Attack: STRATEGIC GAMBIT, if it has no Frenzy token. A Ravager visible within 6\", and others visible within 2\" of that one, make a free Dash."],
           "LEADER, IRONHORN", wounds=11),
        fg("deathknell", "Deathknell", [AUTOPISTOL], [BLUDGEON],
           ["Icon Bearer: It ignores Frenzy's control rule, and its APL counts as 1 higher for marker control.",
            "War Gong: While it has no Frenzy token, Critical Dmg on a Ravager within 3\" of it can become Normal Dmg.",
            "Gong Knell (1AP): Until its next activation, its Save improves by 1 when it's shot."],
           "DEATHKNELL", save="4+"),
        fg("fluxbray", "Fluxbray", [], [("Triple cleavers", 4, "3+", "4/5", "Ceaseless")],
           ["Blade Whirl: When it fights or retaliates without a Frenzy token, resolve one success early, as a block.",
            "Cleaver Flurry (2AP): Make a free Reposition with 2\" extra, passing through enemy control range (but not starting or ending there). Inflict D3+1 damage on each enemy it passed. It can't do this with a Conceal order."],
           "FLUXBRAY"),
        fg("gnarlscar", "Gnarlscar", [AUTOPISTOL], [("Bionic fist", 4, "3+", "4/5", "Brutal")],
           ["Sagacious: At the end of its activation, you can change its order.",
            "Uncompromising Attack (1AP): Make a free Fight and a free Shoot with the autopistol, in either order. The Shoot can target an enemy in its own control range."],
           "GNARLSCAR"),
        fg("gorehorn", "Gorehorn", [AUTOPISTOL], [("Skullcleaver", 4, "3+", "4/5", "Lethal 5+, Headtaker")],
           ["Champion: It can Fight twice in each activation.",
            "Headtaker (weapon rule): When it kills, roll a D3. It regains that many wounds (not with a Frenzy token), and the skullcleaver's Critical Dmg goes up by that much for the battle (to a maximum of 8)."],
           "GOREHORN"),
        fg("herd_goad", "Herd-goad", [AUTOPISTOL, ("Crackthorn whip (ranged)", 4, "2+", "2/3", 'Range 3", Lethal 4+, Stun')], [("Crackthorn whip (melee)", 4, "3+", "2/3", "Lethal 4+, Shock")],
           ["Whip Control: If an enemy visible within 3\" is the only enemy near it, that enemy gets -1 Atk on melee weapons (to a minimum of 1) and pays 1 extra AP to Fall Back.",
            "Incite Fury (1AP): Another Ravager (not the Shaman or Ironhorn) visible within 3\" gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
           "HERD-GOAD"),
        fg("mangler", "Mangler", [], [("Vicious claws", 4, "4+", "4/6", "Ceaseless, Tactual Hunter")],
           ["Tactual Hunter (weapon rule): Against an expended enemy, after your first critical strike, resolve another success as a strike straight away.",
            "Berserker: It can't Shoot (it can Guard, but gets no free Shoot). Pick Up Marker and mission actions cost it 1 extra AP (but not Operate Hatch).",
            "Savage: After its first Fight each activation, if it's still alive, it makes a free Fight against any enemy. It can't use Ruthless Rampage between them."],
           "MANGLER"),
        fg("shaman", "Shaman", [AUTOPISTOL, ("Tech-curse", 4, "3+", "1/3", "PSYCHIC, Rending, Saturate, Seek Light")], [("Braystave", 4, "3+", "3/5", "Shock")],
           ["Apoplectic Rejuvenation (1AP): A Ravager without a Frenzy token visible within 6\" regains up to 2D3 wounds (6 if it has killed an enemy in a fight this battle). It can't do this within enemy control range.",
            "Mantle of Darkness (1AP): PSYCHIC. Until its next activation, while Ravagers visible within 3\" of it have a Conceal order and are in cover, enemies more than 2\" away can't target them. It can't do this within enemy control range."],
           "PSYKER, SHAMAN"),
        fg("toxhorn", "Toxhorn", [AUTOPISTOL], [CLEAVER],
           ["Toxic Blessings: It ignores APL changes and enemy Shock. When Normal Dmg of 3 or more is inflicted on it, roll a D6: on a 5+, subtract 1 from that damage.",
            "Pox Bomb: It can use stun grenades without using up equipment. When an enemy's stun test is 3 or more, it also takes half the roll (rounding up) as damage."],
           "TOXHORN"),
        fg("vandal", "Vandal", [], [("Mancrusher", 4, "4+", "5/5", "Brutal, Vicious Blows")],
           ["Vicious Blows (weapon rule): When it fights with this weapon, it gains Ceaseless.",
            "Sweeping Blow (1AP): Inflict D3+1 damage on each other operative visible within 2\". It can't do this with a Conceal order."],
           "VANDAL"),
        fg("warrior_bludgeon", "Warrior (bludgeon)", [AUTOPISTOL], [BLUDGEON], WARRIOR, "WARRIOR"),
        fg("warrior_cleaver", "Warrior (cleaver)", [AUTOPISTOL], [CLEAVER], WARRIOR, "WARRIOR"),
    ],
}
