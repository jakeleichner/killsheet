LASGUN = ("Lasgun", 4, "4+", "2/3", "-")
BAYONET = ("Bayonet", 3, "4+", "2/3", "-")
GUARD = "BROODGUARD"

def bb(oid, name, ranged, melee, abilities, kw, apl=2, save="5+", wounds=7, pts=25, ex=None):
    return {"id": oid, "name": name, "apl": apl, "move": '6"', "save": save, "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw, "ex": ex or []}

def gunner(oid, label, ranged):
    return bb(oid, "Brood Brother Gunner (" + label + ")", ranged, [BAYONET], [], GUARD + ", GUNNER")

LIST1 = ["agitator", "gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "iconward", "knife_fighter", "medic", "sapper", "sniper", "veteran", "vox"]
LIST2 = ["familiar", "magus", "patriarch", "primus"]
NO_KNIVES = ["cult_knives"]

TEAM = {
    "id": "broodbrothers", "source": "brood_brothers", "name": "Brood Brothers", "badge": "GENE\u00adSTEALER CULTS", "color": "#7A5C9E",
    "archetypes": "Infiltration, Security",
    "composition": {
        "total": 13,
        "groups": [
            {"name": "Leader", "desc": "1 Commander", "min": 1, "max": 1, "ids": ["commander"]},
            {"name": "Operatives", "desc": "9 operatives from the first list", "min": 9, "max": 12, "ids": LIST1 + ["trooper"]},
            {"name": "Broodcoven & Familiars", "desc": "3 more from: 2 Psychic Familiars (1 selection), Magus (2), Primus (2), Patriarch (3), Troopers", "min": 0, "max": 3, "ids": LIST2},
        ],
        "pools": [{"groups": ["Operatives", "Broodcoven & Familiars"], "min": 9, "max": 12, "label": "Operatives (both lists)"}],
        "repeatable": ["trooper", "familiar"],
        "maxCount": {"familiar": 2},
        "cost": {"familiar": 0.5, "magus": 2, "primus": 2, "patriarch": 3},
        "caps": [
            {"ids": LIST1, "max": 9, "label": "Max 9 operatives from the first list (besides Troopers)"},
            {"ids": ["gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "sniper"], "max": 3, "label": "Max 3 Gunners and Sniper combined"},
            {"ids": ["magus", "patriarch", "primus"], "max": 1, "label": "Only 1 Broodcoven operative (Magus, Primus or Patriarch)"},
        ],
        "rules": [
            "Select 1 Commander: bolt pistol + chainsword and claw, drum-fed autogun + bayonet, or laspistol + power weapon and claw.",
            "Select 9 from the first list, then 3 more selections from the second (Psychic Familiars come as a pair for 1 selection; Magus 2, Primus 2, Patriarch 3; Troopers 1). Troopers can fill either list.",
            "Up to three times you can skip a second-list selection and make a Brood Brother ploy cost 0CP instead.",
            "Other than Troopers, each only once. Max 3 Gunners and Sniper combined. Only 1 Broodcoven operative; if you take one, the Commander loses LEADER.",
        ],
    },
    "factionRules": [
        ("Crossfire", "After you resolve your attack dice against an enemy that survives, it gains one of your Crossfire tokens. Attacking an enemy with tokens: remove any of them to re-roll one attack die each."),
    ],
    "ploys": {
        "strategy": [
            ("Embedded", "Shot while retaining cover saves from Heavy terrain: retain one extra cover save."),
            ("Cult Devotion", "Incapacitated while fighting/retaliating (not Patriarch) with unresolved successes: roll a D6 as an attack die; a success lets you strike with one normal (any success on a crit) before removal."),
            ("Pervasive", "Each activation, ignore the first 2\" of one climb."),
            ("Uprising", "First Shoot or Fight in an activation that started by switching from Conceal to Engage (not in enemy control range): the target gains a Crossfire token as soon as it's picked."),
        ],
        "firefight": [
            ("Unquestioning Loyalty", "A LEADER is targeted by a Shoot or Fight: a non-leader Broodguard visible within 3\" becomes the target instead (cover/obscured only if the original was). Not against Blast/Torrent."),
            ("Idolisation", "A non-leader within 6\" of a LEADER or the Iconward attacking: retain a fail as normal or a normal as crit."),
            ("Ruthless Coordination", "Selecting a target: work out cover and obscured from another Brood Brother that both can see (not in enemy control range); no extra Vantage benefits."),
            ("Insidious", "After an activation (not in the first turning point): one Brood Brother that isn't a valid target for enemies makes a free Dash, ending still not a valid target."),
        ],
    },
    "equipment": [
        {"id": "covert_guises", "name": "Covert Guises", "desc": "Roll D3: in turning point 1 Strategy phase, that many Broodguard wholly in your drop zone get a free Reposition (end wholly within 3\" of it)."},
        {"id": "cult_knives", "name": "Cult Knives", "desc": "Broodguard gain a cult knife.", "gw": ("melee", "Cult knife", 3, "4+", "3/4", "-")},
        {"id": "cult_talisman", "name": "Cult Talisman", "desc": "Once per turning point, a Brood Brother (not Patriarch) being shot: retain one normal defence success as a crit."},
        {"id": "lookout", "name": "Lookout", "desc": "STRATEGIC GAMBIT: an enemy visible to a Brood Brother gains a Crossfire token."},
    ],
    "operatives": [
        bb("commander", "Brood Brother Commander", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Drum-fed autogun", 4, "3+", "2/3", "Ceaseless"), ("Laspistol", 4, "3+", "2/3", 'Range 8"')],
           [("Bayonet", 3, "3+", "2/3", "-"), ("Chainsword and claw", 4, "3+", "4/5", "Balanced, Rending"), ("Power weapon and claw", 4, "3+", "4/6", "Balanced, Lethal 5+")],
           ["Loadout: bolt pistol + chainsword and claw, drum-fed autogun + bayonet, or laspistol + power weapon and claw.",
            "Coordinate: STRATEGIC GAMBIT (in killzone): an enemy gains a Crossfire token."],
           GUARD + ", LEADER, COMMANDER", wounds=8),
        bb("agitator", "Brood Brother Agitator", [], [("Shock maul", 4, "4+", "4/4", "Shock")],
           ["Devoted: Once per turning point fighting/retaliating, ignore the damage from one normal success.",
            "Psiren Caster: Brood Brothers attacking an enemy within 6\" of this: re-roll one attack die."],
           GUARD + ", AGITATOR"),
        gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
        gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
        gunner("gunner_melta", "meltagun", [("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
        gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
        bb("iconward", "Brood Brother Iconward", [], [("Large knife", 4, "4+", "3/5", "-")],
           ["Cult Icon: Markers within 4\" of it that Brood Brothers contest: your total APL counts 1 higher.",
            "Broodmind Devotion: Once per turning point, a ready Broodguard visible within 6\" is incapacitated: before removal it makes a free 1AP action (not Fight or Explosives; order can change). Not with Medic! on the same operative."],
           GUARD + ", ICONWARD"),
        bb("knife_fighter", "Brood Brother Knife Fighter", [], [("Poisoned fighting knives", 4, "3+", "3/4", "Ceaseless, Lethal 5+")],
           ["Assassin: Can Charge while Concealed.",
            "Counterattack: Fighting/retaliating: each normal success the opponent resolves deals 1 damage to them."],
           GUARD + ", KNIFE FIGHTER"),
        bb("medic", "Brood Brother Medic", [LASGUN], [BAYONET, ("Gene-needler", 1, "4+", "5/7", "Lethal 5+, Limited 1")],
           ["Medic!: First time each turning point another Brood Brother (not Patriarch) visible within 3\" would be incapacitated (neither in enemy control range): it stays on 1 wound, can't be incapacitated that action, then free Dash ending in this one's control range. Both -1 APL until their next activations; ends its activation if during it.",
            "Medikit (1AP): A Brood Brother (not Patriarch) in control range regains up to 2D3 wounds (not one saved by Medic! this turning point). Not within enemy control range."],
           GUARD + ", MEDIC"),
        bb("sapper", "Brood Brother Sapper", [("Demolition charge", 4, "3+", "4/6", 'Range 3", Blast 2", Heavy (Reposition only), Limited 1, Piercing 1, Saturate')], [BAYONET],
           ["Grenadier: Can use frag and krak grenades without using up equipment limits; Hit +1 with them.",
            "Explosives (1AP): First use places your Explosives marker in control range; second use deals 2D6 to each operative within 2\" of it (unless Heavy terrain wholly intervenes). Max twice per battle; not within enemy control range or in an activation with Charge, Dash or Fall Back.",
            "Final Defiance: When incapacitated, it can do a free Explosives action before removal."],
           GUARD + ", SAPPER"),
        bb("sniper", "Brood Brother Sniper", [("Sniper rifle (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Sniper rifle (mobile)", 4, "3+", "3/4", "-"),
                                               ("Sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [("Fists", 3, "4+", "2/3", "-")],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle."], GUARD + ", SNIPER"),
        bb("trooper", "Brood Brother Trooper", [LASGUN], [BAYONET],
           ["Group Activation: When expended, activate another ready Trooper next (max two in a row)."], GUARD + ", TROOPER"),
        bb("veteran", "Brood Brother Veteran", [("Combat shotgun (close range)", 4, "3+", "4/4", 'Range 6"'), ("Combat shotgun (long range)", 4, "5+", "2/2", "-")], [("Bayonet & claw", 3, "4+", "2/3", "Balanced")],
           ["Resilient: Normal Dmg of 3+ inflicts 1 less on it.", "Bodyguard: Unquestioning Loyalty costs 0CP if this is the operative that steps in."],
           GUARD + ", VETERAN"),
        bb("vox", "Brood Brother Vox-operator", [LASGUN], [BAYONET],
           ["Signal (1AP): SUPPORT. Another Broodguard visible within 6\": +1 APL until end of its next activation. Not within enemy control range.",
            "Jam (1/2AP): A ready enemy that's a valid target (or just visible for 2AP): roll D6; it can't activate until the opponent has activated that many operatives after this, or it's their last. Not within enemy control range."],
           GUARD + ", VOX-OPERATOR"),
        bb("familiar", "Psychic Familiar", [], [("Claws", 3, "4+", "2/3", "Rending")],
           ["Small: Own weapons only, no unique actions. On Conceal and in cover: can't be targeted (except within 2\"). Fall Back costs 1 less AP.",
            "Group Activation: When expended, activate the other ready Familiar next.",
            "Elusive: Can do mission actions in enemy control range and move through/near enemies (can leave their control range when Charging)."],
           "PSYCHIC FAMILIAR", wounds=3, ex=NO_KNIVES),
        bb("magus", "Magus", [("Autopistol", 4, "4+", "2/3", 'Range 8"')], [("Bio dagger", 2, "4+", "3/6", "Lethal 4+"), ("Force stave", 4, "4+", "4/6", "PSYCHIC, Shock")],
           ["Spiritual Leader: STRATEGIC GAMBIT (in killzone), until end of turning point or it dies, pick one: Brood Brothers ignore Piercing when shot; or ignore injured stat changes; or ignore APL changes.",
            "Telepathic Overload (1AP): PSYCHIC. An enemy valid target: -1 APL until end of its next activation. Not within enemy control range.",
            "Mental Onslaught (1AP): PSYCHIC. An enemy valid target takes 2 damage (4 within 6\"); then keep rolling D6: each roll above its APL deals 2 more (4 within 6\"), up to 8 total. Not within enemy control range."],
           "BROODCOVEN, PSYKER, LEADER, MAGUS", apl=3, save="4+", wounds=9, pts=32, ex=NO_KNIVES),
        bb("primus", "Primus", [("Scoped needle pistol (short range)", 4, "3+", "2/4", 'Range 8", Lethal 5+, Silent'), ("Scoped needle pistol (long range)", 4, "3+", "2/4", "Silent")],
           [("Bonesword and toxin injector claw", 5, "3+", "4/5", "Lethal 5+, Rending")],
           ["Fist of the Patriarch: Can do two Shoot or two Fight actions per activation.",
            "Mastermind: Once per turning point after the initiative roll-off (in killzone), each once per battle: +1 to your roll, or re-roll if you didn't have initiative last turning point.",
            "Conspire (1AP): Gain 1CP. Once per turning point; not within enemy control range."],
           "BROODCOVEN, LEADER, PRIMUS", apl=3, save="4+", wounds=9, pts=32, ex=NO_KNIVES),
        bb("patriarch", "Patriarch", [], [("Claws", 5, "3+", "5/6", "Relentless, Rending")],
           ["Alpha Predator: Ignores Piercing when shot. Can be activated twice per turning point while it has AP (max 9\" of movement and 4AP per turning point).",
            "Monster: Own weapons only; no unique actions except Into Shadow and Mind Control. On Conceal, can't use Light terrain for cover when targeted (keeps cover save).",
            "Into Shadow (1AP): Change its order. Not within enemy control range.",
            "Mind Control (2AP): PSYCHIC. An enemy visible within 2\": both roll D6 + APL; if you win, until end of activation it's yours: change its order and make one free action (only Dash for moving, you pick where). Once per battle."],
           "BROODCOVEN, PSYKER, LEADER, PATRIARCH", apl=4, save="4+", wounds=21, pts=50, ex=NO_KNIVES),
    ],
}
