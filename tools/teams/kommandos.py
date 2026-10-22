SLUGGA = ("Slugga", 4, "4+", "3/4", 'Range 8"')
FISTS = ("Fists", 3, "3+", "3/4", "-")
EXPENDABLE = "Expendable: It doesn't count for kill or elimination ops, or for escape and survive scoring."

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
            "Select 1 Boss Nob, armed with a slugga and either a big choppa or a power klaw.",
            "Select 9 other operatives. You can take several Boys, but every other operative only once.",
            "Bomb Squig and Grot each count as half a selection, so taking both uses 1 slot.",
        ],
    },
    "factionRules": [("Throat Slittas", "Kommandos (except the Bomb Squig) can Charge while they have a Conceal order.")],
    "ploys": {
        "strategy": [
            ("Dakka! Dakka! Dakka!", "Ranged weapons gain Punishing."),
            ("Sssshhhh!", "Each Kommando that isn't a valid target for the enemy, or has a Conceal order and is more than 6\" from enemies, can make a free Dash. You can't use this in the first turning point."),
            ("WAAAGH!", "Melee weapons gain Balanced."),
            ("Skulk About", "When an enemy shoots a Kommando with a Conceal order, retain one defence die as a normal success without rolling it. This is on top of any cover save."),
        ],
        "firefight": [
            ("Just a Scratch", "When an attack die inflicts Normal Dmg on a Kommando (not the Bomb Squig or Grot), ignore that damage."),
            ("Shake It Off", "Use when a Kommando is activated or its APL changes. Ignore any changes to its APL until the next turning point starts."),
            ("Krump 'Em!", "At the end of the Firefight phase, one Kommando can make a free Fight action."),
            ("Kunnin' But Brutal", "Use when a Kommando with a Conceal order fights after Charging, and the first die you resolve is a normal success used to strike. Treat it as a critical success."),
        ],
    },
    "equipment": [
        {"id": "choppas", "name": "Choppas", "desc": "Every Kommando (not the Bomb Squig or Grot) gets a choppa. If it already has one, use whichever profile is better.",
         "gw": ("melee", "Choppa (equip)", 3, "3+", "4/5", "-"), "ex": ["bomb_squig", "grot"]},
        {"id": "dynamite", "name": "Dynamite", "desc": "Once per battle, one Kommando (not the Bomb Squig or Grot) can throw dynamite, using the profile below.",
         "gw": ("ranged", "Dynamite", 5, "4+", "4/5", 'Range 4", Blast 1", Heavy (Reposition only), Saturate', "1/battle"), "ex": ["bomb_squig", "grot"]},
        {"id": "harpoon", "name": "Harpoon", "desc": "Once per turning point, one Kommando (not the Bomb Squig or Grot) can fire the harpoon, using the profile below.",
         "gw": ("ranged", "Harpoon", 4, "4+", "4/5", 'Range 8", Lethal 5+, Stun', "1/TP"), "ex": ["bomb_squig", "grot"]},
        {"id": "coll_stocks", "name": "Collapsible Stocks", "desc": "Sluggas and shokka pistols lose their Range limit.", "mod": "remove_range"},
    ],
    "operatives": [
        ork("nob", "Boss Nob", [SLUGGA], [("Big choppa", 5, "3+", "5/6", "-"), ("Power klaw", 4, "3+", "5/7", "Brutal, Shock")],
            ["Loadout: a slugga, plus a big choppa or a power klaw.",
             "Krumpin' Time: It can make two Fight actions in each activation.",
             "Get It Dun! (1AP): SUPPORT. Pick another Kommando (not the Bomb Squig) visible within 6\". It gets +1 APL until the end of its next activation. It can't do this within enemy control range or while counteracting."],
            "LEADER, BOSS NOB", wounds=14, apl=3),
        ork("boy", "Kommando Boy", [SLUGGA], [("Choppa", 4, "3+", "4/5", "-")],
            ["Taktical Wot-notz: Once per turning point, one Boy can take the Smoke Grenade action and one Boy the Stun Grenade action. Neither uses up equipment."],
            "BOY"),
        ork("bomb_squig", "Bomb Squig", [("Explosives", 6, "4+", "4/5", 'Blast 1", Limited 1, Explosive')], [("Bite", 3, "4+", "4/5", "-")],
            ["Stoopid: It can't take a Conceal order in the Firefight phase. It can only Charge, Dash, Fight, Reposition and Shoot, and only with its own weapons.",
             EXPENDABLE,
             "Boom!: If it's incapacitated before using its explosives, roll one or two D6. On any 4+, it shoots its explosives before it's removed."],
            "BOMB SQUIG", wounds=5, pts=25, ex=NO_KIT),
        ork("breacha", "Breacha Boy", [SLUGGA], [("Breacha ram", 4, "4+", "5/5", "Brutal, Severe, Shock")],
            ["Breach (1AP): Place a Breach marker as close as possible to a terrain feature within its control range. Operatives within 1\" of the marker treat parts of that terrain feature up to 1\" thick as Accessible. It can do this during a Charge or Reposition for 1 less AP, but not within enemy control range."],
            "BREACHA BOY"),
        ork("burna", "Burna Boy", [("Burna (standard)", 4, "2+", "3/3", 'Range 8", Saturate, Torrent 2"'), ("Burna (deluge)", 4, "2+", "3/3", 'Range 4", Saturate, Seek, Torrent 0"')], [FISTS],
            [], "BURNA BOY"),
        ork("comms", "Comms Boy", [("Shokka pistol", 6, "4+", "1/0", 'Range 8", Devastating 2, Severe, Stun')], [FISTS],
            ["I Got a Plan, Ladz: Once per activation, Pick Up Marker, Place Marker or a mission action costs it 1 less AP.",
             "Listen In (1AP): SUPPORT. Pick another Kommando (not the Bomb Squig) visible within 6\". It gets +1 APL until the end of its next activation. It can't do this within enemy control range."],
            "COMMS BOY"),
        ork("dakka", "Dakka Boy", [("Dakka shoota (short range)", 5, "4+", "3/4", 'Range 9", Ceaseless'), ("Dakka shoota (long range)", 5, "4+", "3/4", "-")], [FISTS],
            ["Dakka Dash (1AP): Make a free Dash and a free Shoot with the dakka shoota, in either order. It can't do this with a Conceal order or within enemy control range."],
            "DAKKA BOY"),
        ork("grot", "Grot", [], [("Grot choppa", 3, "5+", "1/4", "-")],
            ["Sneaky Zogger: It can't have an Engage order. While it's in cover, enemies more than 2\" away can't target it, whatever other rules say (Seek, Vantage terrain and so on).",
             "Grappling Hook (1AP): Counts as a Reposition. Set it up within 1\" of a point on terrain that it can see and that isn't in enemy control range. It can't do this within enemy control range, or in an activation where it Charged or Fell Back, and it can't Charge or Fall Back afterwards in that activation."],
            "GROT", wounds=5, pts=25, ex=NO_KIT),
        ork("rokkit", "Rokkit Boy", [("Rokkit launcha (aimed)", 6, "4+", "4/5", 'Blast 1", Ceaseless, Heavy (Dash only)'), ("Rokkit launcha (mobile)", 6, "4+", "4/5", 'Blast 1"')], [FISTS],
            [], "ROKKIT BOY"),
        ork("slasha", "Slasha Boy", [("Throwing knives", 4, "3+", "2/5", 'Range 6", Silent')], [("Twin choppas", 4, "3+", "4/5", "Ceaseless, Lethal 5+")],
            ["Dat All You Got?: After it fights or retaliates and survives, inflict D3 damage on that enemy."],
            "SLASHA BOY"),
        ork("snipa", "Snipa Boy", [("Scoped big shoota (concealed)", 5, "3+", "3/3", "Devastating 2, Heavy, Silent, Concealed Position"),
                                   ("Scoped big shoota (stationary)", 5, "3+", "3/3", "Devastating 2, Heavy"),
                                   ("Scoped big shoota (sweeping)", 5, "3+", "3/4", 'Heavy (Dash only), Torrent 1"')], [FISTS],
            [], "SNIPA BOY"),
    ],
}
