SLUGGA = ("Slugga", 4, "4+", "3/4", 'Range 8"')
FISTS = ("Fists", 3, "3+", "3/4", "-")
EXPENDABLE = "Expendable: Ignored for kill/elimination ops and escape/survive scoring."

def ork(oid, name, ranged, melee, abilities, kw, wounds=10, apl=2, pts=32, ex=None):
    return {"id": oid, "name": name, "apl": apl, "move": '6"', "save": "5+", "wounds": wounds, "pts": pts,
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": kw, "ex": ex or []}

NO_KIT = ["choppas", "dynamite", "harpoon"]

TEAM = {
    "id": "kommandos", "source": "kommandos", "name": "Ork Kommandos", "badge": "ORKS", "color": "#5A9C3A",
    "archetypes": "Infiltration, Seek & Destroy",
    "composition": {
        "total": 10,
        "groups": [
            {"name": "Leader", "desc": "1 Boss Nob (big choppa or power klaw)", "min": 1, "max": 1, "ids": ["nob"]},
            {"name": "Operatives", "desc": "9 Kommando operatives from the list below", "min": 9, "max": 9,
             "ids": ["bomb_squig", "boy", "breacha", "burna", "comms", "dakka", "grot", "rokkit", "slasha", "snipa"]},
        ],
        "repeatable": ["boy"],
        "cost": {"bomb_squig": 0.5, "grot": 0.5},
        "rules": [
            "Select 1 Boss Nob (slugga + big choppa, or slugga + power klaw).",
            "Select 9 other operatives. Other than Boys, each only once.",
            "Bomb Squig and Grot each count as half a selection, so taking both uses 1 slot.",
        ],
    },
    "factionRules": [("Throat Slittas", "Kommandos (not the Bomb Squig) can Charge while Concealed.")],
    "ploys": {
        "strategy": [
            ("Dakka! Dakka! Dakka!", "Ranged weapons gain Punishing."),
            ("Sssshhhh!", "Each Kommando that isn't a valid target for enemies, or is Concealed and more than 6\" from enemies, makes a free Dash. Not in the first turning point."),
            ("WAAAGH!", "Melee weapons gain Balanced."),
            ("Skulk About", "Shot while Concealed: retain one defence die as a normal success without rolling (plus any cover save)."),
        ],
        "firefight": [
            ("Just a Scratch", "Normal Dmg on a Kommando (not Squig or Grot): ignore it."),
            ("Shake It Off", "On activation or when its APL changes: ignore APL changes until next turning point."),
            ("Krump 'Em!", "End of the Firefight phase: one Kommando makes a free Fight."),
            ("Kunnin' But Brutal", "Concealed Kommando fighting after a Charge, resolving the first die as a normal strike: it counts as a crit."),
        ],
    },
    "equipment": [
        {"id": "choppas", "name": "Choppas", "desc": "Kommandos (not Squig or Grot) gain a choppa. Use the better one if they already have it.",
         "gw": ("melee", "Choppa (equip)", 3, "3+", "4/5", "-"), "ex": ["bomb_squig", "grot"]},
        {"id": "dynamite", "name": "Dynamite", "desc": "Once per battle, one Kommando (not Squig or Grot).",
         "gw": ("ranged", "Dynamite", 5, "4+", "4/5", 'Range 4", Blast 1", Heavy (Reposition only), Saturate', "1/battle"), "ex": ["bomb_squig", "grot"]},
        {"id": "harpoon", "name": "Harpoon", "desc": "Once per turning point, one Kommando (not Squig or Grot).",
         "gw": ("ranged", "Harpoon", 4, "4+", "4/5", 'Range 8", Lethal 5+, Stun', "1/TP"), "ex": ["bomb_squig", "grot"]},
        {"id": "coll_stocks", "name": "Collapsible Stocks", "desc": "Remove Range from sluggas and shokka pistols.", "mod": "remove_range"},
    ],
    "operatives": [
        ork("nob", "Boss Nob", [SLUGGA], [("Big choppa", 5, "3+", "5/6", "-"), ("Power klaw", 4, "3+", "5/7", "Brutal, Shock")],
            ["Loadout: slugga + big choppa, or slugga + power klaw.",
             "Krumpin' Time: Can do two Fight actions per activation.",
             "Get It Dun! (1AP): SUPPORT. Another Kommando (not Squig) visible within 6\": +1 APL until end of its next activation. Not within enemy control range or while counteracting."],
            "LEADER, BOSS NOB", wounds=14, apl=3),
        ork("boy", "Kommando Boy", [SLUGGA], [("Choppa", 4, "3+", "4/5", "-")],
            ["Taktical Wot-notz: Once per turning point each, one Boy can do the Smoke Grenade action and one the Stun Grenade action (doesn't use equipment limits)."],
            "BOY"),
        ork("bomb_squig", "Bomb Squig", [("Explosives", 6, "4+", "4/5", 'Blast 1", Limited 1, Explosive')], [("Bite", 3, "4+", "4/5", "-")],
            ["Stoopid: Can't take a Conceal order in the Firefight phase. Only Charge, Dash, Fight, Reposition, Shoot; own weapons only.",
             EXPENDABLE,
             "Boom!: Incapacitated without having used its explosives: roll one or two D6; any 4+ and it shoots its explosives before removal."],
            "BOMB SQUIG", wounds=5, pts=25, ex=NO_KIT),
        ork("breacha", "Breacha Boy", [SLUGGA], [("Breacha ram", 4, "4+", "5/5", "Brutal, Severe, Shock")],
            ["Breach (1AP): Place a Breach marker by a terrain feature in control range; within 1\" of it, parts up to 1\" thick are Accessible. Can be done during a Charge/Reposition for 1 less AP. Not within enemy control range."],
            "BREACHA BOY"),
        ork("burna", "Burna Boy", [("Burna (standard)", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"'), ("Burna (deluge)", 4, "2+", "3/3", 'Range 4", Saturate, Seek, Torrent 0"')], [FISTS],
            [], "BURNA BOY"),
        ork("comms", "Comms Boy", [("Shokka pistol", 6, "4+", "1/0", 'Range 8", Devastating 2, Severe, Stun')], [FISTS],
            ["I Got a Plan, Ladz: Once per activation: Pick Up Marker, Place Marker or a mission action costs 1 less AP.",
             "Listen In (1AP): SUPPORT. Another Kommando (not Squig) visible within 6\": +1 APL until end of its next activation. Not within enemy control range."],
            "COMMS BOY"),
        ork("dakka", "Dakka Boy", [("Dakka shoota (short range)", 5, "4+", "3/4", 'Range 9", Ceaseless'), ("Dakka shoota (long range)", 5, "4+", "3/4", "-")], [FISTS],
            ["Dakka Dash (1AP): A free Dash and a free Shoot (dakka shoota only), in either order. Not on Conceal or within enemy control range."],
            "DAKKA BOY"),
        ork("grot", "Grot", [], [("Grot choppa", 3, "5+", "1/4", "-")],
            ["Sneaky Zogger: Can't have an Engage order. In cover: can't be targeted (except within 2\").",
             "Grappling Hook (1AP): Counts as a Reposition. Set up within 1\" of a visible point on terrain (that point visible to it, not in enemy control range). Not within enemy control range or in an activation it Charged/Fell Back."],
            "GROT", wounds=5, pts=25, ex=NO_KIT),
        ork("rokkit", "Rokkit Boy", [("Rokkit launcha (aimed)", 6, "4+", "4/5", 'Blast 1", Ceaseless, Heavy (Dash only)'), ("Rokkit launcha (mobile)", 6, "4+", "4/5", 'Blast 1"')], [FISTS],
            [], "ROKKIT BOY"),
        ork("slasha", "Slasha Boy", [("Throwing knives", 4, "3+", "2/5", 'Range 6", Silent')], [("Twin choppas", 4, "3+", "4/5", "Ceaseless, Lethal 5+")],
            ["Dat All You Got?: After it fights or retaliates (and survives), inflict D3 damage on that enemy."],
            "SLASHA BOY"),
        ork("snipa", "Snipa Boy", [("Scoped big shoota (concealed)", 5, "3+", "3/3", "Devastating 2, Heavy, Silent, Concealed Position"),
                                   ("Scoped big shoota (stationary)", 5, "3+", "3/3", "Devastating 2, Heavy"),
                                   ("Scoped big shoota (sweeping)", 5, "3+", "3/4", 'Heavy (Dash only), Torrent 1"')], [FISTS],
            [], "SNIPA BOY"),
    ],
}
