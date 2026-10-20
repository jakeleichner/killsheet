FANGS = ("Drakesteed fangs & talons", 6, "3+", "3/5", "Brutal")
CARBINE = ("Solar carbine", 4, "3+", "3/3", "Devastating 1")

def rider(oid, name, ranged, melee, abilities, kw):
    return {"id": oid, "name": "Dragon Master " + name, "apl": 4, "move": '12"', "save": "3+", "wounds": 24, "pts": "75x42",
            "ranged": ranged, "melee": melee, "abilities": abilities, "kw": "MOUNTED, " + kw}

TEAM = {
    "id": "dragonmasters", "source": "exodite_dragon_masters", "name": "Exodite Dragon Masters", "badge": "AELDARI", "color": "#5E9E4A",
    "archetypes": "Recon, Seek & Destroy",
    "composition": {
        "total": 5,
        "groups": [
            {"name": "Riders", "desc": "1 Clanblade, 1 Leystalker, 1 Stonesinger", "min": 3, "max": 3, "ids": ["clanblade", "leystalker", "stonesinger"]},
            {"name": "Drakoliths", "desc": "2 Drakoliths", "min": 2, "max": 2, "ids": ["drakolithe"]},
        ],
        "repeatable": ["drakolithe"],
        "maxCount": {"drakolithe": 2},
        "rules": [
            "The team is fixed: 1 Clanblade, 1 Leystalker, 1 Stonesinger and 2 Drakoliths.",
            "Each rider picks up to two different upgrades from its list when selected for the battle.",
        ],
    },
    "factionRules": [
        ("Draconic Cavalry Tactics", "Set up the Drakoliths first; the mounted riders start in reserve and enter in the first Firefight phase, base touching your killzone edge (counts as a Turn action)."),
        ("Drakesteed Agility", "Mounted riders can't Charge, Dash, Fall Back or Reposition. Instead: Sprint (0AP): move straight forwards or backwards (max 9\" forwards / 3\" back per activation, 12\" per TP), with one pivot of up to 45\"; can't climb or end on Vantage above 2\"; moves through operatives; terrain under 2\" counts as Accessible; removes equipment terrain it passes through. Turn (1AP): pivot up to 45\". Riders activate twice per TP (max 3AP per activation, APL in total). They can't be in cover from or obscured by Light, sub-2\" or not-wholly-intervening terrain, and can fight at 1\" horizontal / 4\" vertical."),
        ("Mercurial Speed", "SPEED 3-, 4+ or 7+ (start at 3-). Riders: Sprint 4\"+ gives 4+, 7\"+ gives 7+; backwards, less than 4\" or no Sprint gives 3-. When shot at SPEED 4+, retain one defence die as a normal success without rolling (7+: as a crit). Drakoliths use their own datacard rule."),
    ],
    "ploys": {
        "strategy": [
            ("Draconic Fury", "Fighting at SPEED 4+: melee Balanced; at 7+: Ceaseless."),
            ("Sinuous Flux", "Enemies shooting an operative more than 6\" away at SPEED 4+ or 7+ can't re-roll attack dice."),
            ("Wind-swift Precision", "Shooting at SPEED 4+: ranged weapons gain Balanced."),
            ("Ride Them Down", "Once per rider activation, ending a Sprint: 4\"+ moved, 1 dmg to an enemy in control range; 7\"+ (or the Clanblade), D3 instead."),
        ],
        "firefight": [
            ("Leap", "Instead of a Sprint move: set up within 1\" horizontally (not through terrain over 2\" or onto Vantage over 2\"); counts as 3\" moved and SPEED 3-."),
            ("Feral Hunger", "After rolling attack dice with fangs & talons vs a wounded enemy: re-roll any."),
            ("Survivalist Spirit", "During a rider's activation: ignore injured weapon stat changes until its next activation."),
            ("Riding Mastery", "During a rider's Sprint: Pick Up Marker, Place Marker or a mission action mid-move."),
        ],
    },
    "equipment": [
        {"id": "clan_talismans", "name": "Clan Talismans", "desc": "Once/TP, a rider attacking: with 2+ fails, discard one to retain another as a normal success."},
        {"id": "crystal_matrices", "name": "Lileathan Crystal Matrices", "desc": "Once/TP, a solar carbine or long rifle gains Piercing 1 until end of activation."},
        {"id": "dragonscale_mesh", "name": "Dragonscale Mesh", "desc": "Once/TP, a rider being shot: retain one normal defence success as a crit."},
        {"id": "spirit_stones", "name": "Spirit Stones", "desc": "A rider is incapacitated: gain 1CP."},
    ],
    "operatives": [
        rider("clanblade", "Clanblade", [CARBINE], [FANGS, ("Moonblades", 5, "3+", "4/6", "Lethal 5+")],
              ["Scaleshield: When shot with no attack dice retained as crits, the attacker's Piercing is worsened by 1.",
               "Clanblade Upgrades (pick two): Moonsong Cull (after a forwards Sprint and a kill in a Fight, free forwards Sprint with the remaining move); Speartip of the Clan (fighting at SPEED 4+: first normal strike +1 dmg; at 7+: melee +1 Normal Dmg); Bladed Stance (with moonblades, resolve one success early as a block); Spectral Nimbus (once/TP fighting/retaliating: opponent can't retain results below 6 as crits); Focused Reflection (shot from within 6\": each crit you block with deals 1 dmg back)."],
              "CLANBLADE"),
        rider("leystalker", "Leystalker", [("Long rifle (mobile)", 4, "3+", "3/3", "Devastating 1"), ("Long rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Aimed")],
              [FANGS, ("Hunting blade", 3, "3+", "3/5", "Lethal 5+")],
              ["Aimed (weapon rule): Not in an activation it moved more than 3\", and it can't move more than 3\" after using it (Guard still allowed).",
               "Implacable Darkscale: Ignore injured Hit changes on its fangs & talons.",
               "Leystalker Upgrades (pick two): Fated Shot (once/TP with the long rifle: no obscuring, or friendlies near the target don't block it); Nexus Sentinel (once/TP at SPEED 3-, Guard in any killzone with no point-blank Hit penalty); Nomad Executioner (Shoot partway through a Sprint); Elusive Phantasm (end of each Firefight phase, a free Sprint or Turn up to 3\"); Gloaming Mantle (shot from more than 8\": retain one die as a normal without rolling, or one cover save as a crit)."],
              "LEYSTALKER"),
        rider("stonesinger", "Stonesinger", [CARBINE, ("Venomcrest spit", 4, "3+", "3/4", 'Range 8", Severe, Torrent 2"')],
              [FANGS, ("Stone stave", 4, "3+", "3/5", "PSYCHIC, Lethal 5+, Shock, Stun")],
              ["Song of Renewal (1AP): PSYCHIC. A visible Dragon Master regains up to 2D3 wounds, or every Dragon Master regains up to D3. Once/TP; not within enemy control range.",
               "Stonesinger Upgrades (pick two): Cleansing of the Pale Moon (1AP: remove one enemy effect from a visible friendly); Wails of the World (1AP, once/TP: a visible enemy and others within 2\" get -2\" Move, then take 2D3 minus their new Move as damage; riders unaffected); Earthen Wrath (ranged 4 3+ 4/3, Devastating 2, Saturate, Lethal 5+ vs targets in cover); Sow the Seeds (once/TP: keep controlling an objective it holds, at APL 1, from anywhere); Wind's Grace (1AP, once/TP: a visible friendly's SPEED counts one higher until this one's first activation next TP)."],
              "PSYKER, STONESINGER"),
        {"id": "drakolithe", "name": "Drakolith", "apl": 2, "move": '8"', "save": "5+", "wounds": 7, "pts": 32,
         "ranged": [], "melee": [("Fangs & talons", 4, "3+", "3/4", "Rending")],
         "abilities": ["Preternatural Evasion: Ending a Charge, Fall Back or Reposition more than 2\" from where it started: SPEED 4+ (more than 5\": 7+). Ends an activation without gaining either: SPEED 3-.",
                       "Beast: Only Charge, Dash, Fall Back, Fight, Guard, Pick Up/Place Marker, Reposition and mission actions (marker/mission actions only while a Leystalker is alive); own weapons only."],
         "kw": "DRAKOLITHE"},
    ],
}
