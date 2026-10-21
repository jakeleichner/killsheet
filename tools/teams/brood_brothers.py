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
            {"ids": LIST1, "max": 9, "label": "Up to 9 operatives from the first list (not counting Troopers)"},
            {"ids": ["gunner_flamer", "gunner_gl", "gunner_melta", "gunner_plasma", "sniper"], "max": 3, "label": "Max 3 Gunners and Sniper combined"},
            {"ids": ["magus", "patriarch", "primus"], "max": 1, "label": "Only 1 Broodcoven operative (Magus, Primus or Patriarch)"},
        ],
        "rules": [
            "Select 1 Commander, armed with a bolt pistol and chainsword and claw, a drum-fed autogun and bayonet, or a laspistol and power weapon and claw.",
            "Select 9 from the first list, then 3 more selections from the second. Psychic Familiars come as a pair for 1 selection, a Magus or Primus costs 2, a Patriarch 3 and a Trooper 1. Troopers can go in either list.",
            "Up to three times, you can skip a second-list selection to make one Brood Brother ploy cost 0CP instead.",
            "You can take several Troopers, but every other operative only once. Up to 3 Gunners and Snipers combined. Only 1 Broodcoven operative, and if you take one, the Commander loses LEADER.",
        ],
    },
    "factionRules": [
        ("Crossfire", "After you resolve your attack dice against an enemy that survives, it gains one of your Crossfire tokens. When you attack an enemy with tokens, remove any number of them to re-roll one attack die for each."),
    ],
    "ploys": {
        "strategy": [
            ("Embedded", "When one is shot and retains cover saves from Heavy terrain, it can retain one extra."),
            ("Cult Devotion", "When one (not the Patriarch) is incapacitated while fighting or retaliating with unresolved successes, roll a D6 as an attack die. If it's a success, strike with one normal success (or any success on a critical) before it's removed."),
            ("Pervasive", "In each activation, ignore the first 2\" of one climb."),
            ("Uprising", "In an activation that started by switching from Conceal to Engage (outside enemy control range), the target of its first Shoot or Fight gains a Crossfire token as soon as it's picked."),
        ],
        "firefight": [
            ("Unquestioning Loyalty", "When a LEADER is picked as the target of a Shoot or Fight, a non-leader Broodguard visible within 3\" becomes the target instead. It only has cover or is obscured if the original target was. Not against Blast or Torrent."),
            ("Idolisation", "When a non-leader within 6\" of a LEADER or the Iconward attacks, retain one fail as a normal success or one normal success as a critical success."),
            ("Ruthless Coordination", "When picking a target, work out cover and obscured from another Brood Brother that both can see (and that isn't in enemy control range). No extra Vantage benefits."),
            ("Insidious", "After an activation (not in the first turning point), one Brood Brother that isn't a valid target for enemies makes a free Dash, and must still not be a valid target after."),
        ],
    },
    "equipment": [
        {"id": "covert_guises", "name": "Covert Guises", "desc": "Roll a D3. In the first turning point's Strategy phase, that many Broodguard wholly in your drop zone get a free Reposition, ending wholly within 3\" of it."},
        {"id": "cult_knives", "name": "Cult Knives", "desc": "Broodguard get a cult knife.", "gw": ("melee", "Cult knife", 3, "4+", "3/4", "-")},
        {"id": "cult_talisman", "name": "Cult Talisman", "desc": "Once per turning point, when a Brood Brother (not the Patriarch) is shot, retain one normal defence success as a critical success."},
        {"id": "lookout", "name": "Lookout", "desc": "STRATEGIC GAMBIT: an enemy visible to a Brood Brother gains a Crossfire token."},
    ],
    "operatives": [
        bb("commander", "Brood Brother Commander", [("Bolt pistol", 4, "3+", "3/4", 'Range 8"'), ("Drum-fed autogun", 4, "3+", "2/3", "Ceaseless"), ("Laspistol", 4, "3+", "2/3", 'Range 8"')],
           [("Bayonet", 3, "3+", "2/3", "-"), ("Chainsword and claw", 4, "3+", "4/5", "Balanced, Rending"), ("Power weapon and claw", 4, "3+", "4/6", "Balanced, Lethal 5+")],
           ["Loadout: a bolt pistol and chainsword and claw, a drum-fed autogun and bayonet, or a laspistol and power weapon and claw.",
            "Coordinate: STRATEGIC GAMBIT, while it's in the killzone. An enemy gains a Crossfire token."],
           GUARD + ", LEADER, COMMANDER", wounds=8),
        bb("agitator", "Brood Brother Agitator", [], [("Shock maul", 4, "4+", "4/4", "Shock")],
           ["Devoted: Once per turning point when it fights or retaliates, ignore the damage from one normal success.",
            "Psiren Caster: When Brood Brothers attack an enemy within 6\" of it, re-roll one attack die."],
           GUARD + ", AGITATOR"),
        gunner("gunner_flamer", "flamer", [("Flamer", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"')]),
        gunner("gunner_gl", "grenade launcher", [("Grenade launcher (frag)", 4, "4+", "2/4", 'Blast 2"'), ("Grenade launcher (krak)", 4, "4+", "4/5", "Piercing 1")]),
        gunner("gunner_melta", "meltagun", [("Meltagun", 4, "4+", "6/3", 'Range 6", Devastating 4, Piercing 2')]),
        gunner("gunner_plasma", "plasma gun", [("Plasma gun (standard)", 4, "4+", "4/6", "Piercing 1"), ("Plasma gun (supercharge)", 4, "4+", "5/6", "Hot, Lethal 5+, Piercing 1")]),
        bb("iconward", "Brood Brother Iconward", [], [("Large knife", 4, "4+", "3/5", "-")],
           ["Cult Icon: For markers within 4\" of it that Brood Brothers contest, your total APL counts as 1 higher.",
            "Broodmind Devotion: Once per turning point, when a ready Broodguard visible within 6\" is incapacitated, it makes a free 1AP action before it's removed (not Fight or Explosives, and it can change order). Not on the same operative as Medic!."],
           GUARD + ", ICONWARD"),
        bb("knife_fighter", "Brood Brother Knife Fighter", [], [("Poisoned fighting knives", 4, "3+", "3/4", "Ceaseless, Lethal 5+")],
           ["Assassin: It can Charge while it has a Conceal order.",
            "Counterattack: When it fights or retaliates, each normal success your opponent resolves inflicts 1 damage on them."],
           GUARD + ", KNIFE FIGHTER"),
        bb("medic", "Brood Brother Medic", [LASGUN], [BAYONET, ("Gene-needler", 1, "4+", "5/7", "Lethal 5+, Limited 1")],
           ["Medic!: The first time each turning point another Brood Brother (not the Patriarch) visible within 3\" would be incapacitated, and neither is in enemy control range, it stays on 1 wound and can't be incapacitated for the rest of that action. Then it makes a free Dash, ending in this operative's control range. Both get -1 APL until their next activations. If this happened during its activation, that activation ends.",
            "Medikit (1AP): A Brood Brother (not the Patriarch) in its control range regains up to 2D3 wounds. Not one saved by Medic! this turning point. It can't do this within enemy control range."],
           GUARD + ", MEDIC"),
        bb("sapper", "Brood Brother Sapper", [("Demolition charge", 4, "3+", "4/6", 'Range 3", Blast 2", Heavy (Reposition only), Limited 1, Piercing 1, Saturate')], [BAYONET],
           ["Grenadier: It can use frag and krak grenades without using up equipment, and gets +1 to Hit with them.",
            "Explosives (1AP): The first use places your Explosives marker in its control range. The second use inflicts 2D6 damage on each operative within 2\" of the marker, unless Heavy terrain wholly intervenes. Twice per battle at most. It can't do this within enemy control range, or in an activation where it Charged, Dashed or Fell Back.",
            "Final Defiance: When it's incapacitated, it can take a free Explosives action before it's removed."],
           GUARD + ", SAPPER"),
        bb("sniper", "Brood Brother Sniper", [("Sniper rifle (concealed)", 4, "2+", "3/3", "Devastating 3, Heavy, Silent, Concealed Position"), ("Sniper rifle (mobile)", 4, "3+", "3/4", "-"),
                                               ("Sniper rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Heavy")], [("Fists", 3, "4+", "2/3", "-")],
           ["Concealed Position (weapon rule): Only the first time it Shoots in the battle."], GUARD + ", SNIPER"),
        bb("trooper", "Brood Brother Trooper", [LASGUN], [BAYONET],
           ["Group Activation: When it's expended, activate another ready Trooper next (no more than two in a row)."], GUARD + ", TROOPER"),
        bb("veteran", "Brood Brother Veteran", [("Combat shotgun (close range)", 4, "3+", "4/4", 'Range 6"'), ("Combat shotgun (long range)", 4, "5+", "2/2", "-")], [("Bayonet & claw", 3, "4+", "2/3", "Balanced")],
           ["Resilient: Normal Dmg of 3 or more inflicts 1 less damage on it.", "Bodyguard: Unquestioning Loyalty costs 0CP if it's the one that steps in."],
           GUARD + ", VETERAN"),
        bb("vox", "Brood Brother Vox-operator", [LASGUN], [BAYONET],
           ["Signal (1AP): SUPPORT. Pick another Broodguard visible within 6\". It gets +1 APL until the end of its next activation. It can't do this within enemy control range.",
            "Jam (1/2AP): Pick a ready enemy that's a valid target (or only visible, for 2AP) and roll a D6. It can't activate until your opponent has activated that many operatives after this, or it's their last one. It can't do this within enemy control range."],
           GUARD + ", VOX-OPERATOR"),
        bb("familiar", "Psychic Familiar", [], [("Claws", 3, "4+", "2/3", "Rending")],
           ["Small: It can only use its own weapons and has no unique actions. While it has a Conceal order and is in cover, enemies more than 2\" away can't target it. Fall Back costs it 1 less AP.",
            "Group Activation: When it's expended, activate the other ready Familiar next.",
            "Elusive: It can do mission actions in enemy control range, and move through and near enemies. When it Charges, it can leave their control range."],
           "PSYCHIC FAMILIAR", wounds=3, ex=NO_KNIVES),
        bb("magus", "Magus", [("Autopistol", 4, "4+", "2/3", 'Range 8"')], [("Bio dagger", 2, "4+", "3/6", "Lethal 4+"), ("Force stave", 4, "4+", "4/6", "PSYCHIC, Shock")],
           ["Spiritual Leader: STRATEGIC GAMBIT, while it's in the killzone. Until the end of the turning point or until it dies, pick one for Brood Brothers: ignore Piercing when shot, ignore stat changes from being injured, or ignore APL changes.",
            "Telepathic Overload (1AP): PSYCHIC. An enemy that's a valid target gets -1 APL until the end of its next activation. It can't do this within enemy control range.",
            "Mental Onslaught (1AP): PSYCHIC. Inflict 2 damage on an enemy that's a valid target (4 if within 6\"). Then keep rolling a D6: each roll above its APL inflicts 2 more (4 within 6\"), up to 8 in total. It can't do this within enemy control range."],
           "BROODCOVEN, PSYKER, LEADER, MAGUS", apl=3, save="4+", wounds=9, pts=32, ex=NO_KNIVES),
        bb("primus", "Primus", [("Scoped needle pistol (short range)", 4, "3+", "2/4", 'Range 8", Lethal 5+, Silent'), ("Scoped needle pistol (long range)", 4, "3+", "2/4", "Silent")],
           [("Bonesword and toxin injector claw", 5, "3+", "4/5", "Lethal 5+, Rending")],
           ["Fist of the Patriarch: It can make two Shoot or two Fight actions in each activation.",
            "Mastermind: Once per turning point after the initiative roll-off, while it's in the killzone, you can add 1 to your roll, or re-roll if you didn't have initiative last turning point. Each option once per battle.",
            "Conspire (1AP): Gain 1CP. Once per turning point, and not within enemy control range."],
           "BROODCOVEN, LEADER, PRIMUS", apl=3, save="4+", wounds=9, pts=32, ex=NO_KNIVES),
        bb("patriarch", "Patriarch", [], [("Claws", 5, "3+", "5/6", "Relentless, Rending")],
           ["Alpha Predator: It ignores Piercing when shot. It can be activated twice per turning point while it has AP left, but no more than 9\" of movement and 4AP in total per turning point.",
            "Monster: It can only use its own weapons, and has no unique actions except Into Shadow and Mind Control. While it has a Conceal order, it can't use Light terrain for cover when it's targeted. It still keeps its cover save.",
            "Into Shadow (1AP): Change its order. It can't do this within enemy control range.",
            "Mind Control (2AP): PSYCHIC. Pick an enemy visible within 2\". You each roll a D6 and add your operative's APL. If you win, you control it until the end of the activation: change its order and make one free action with it (the only move allowed is a Dash, and you pick where). Once per battle."],
           "BROODCOVEN, PSYKER, LEADER, PATRIARCH", apl=4, save="4+", wounds=21, pts=50, ex=NO_KNIVES),
    ],
}
