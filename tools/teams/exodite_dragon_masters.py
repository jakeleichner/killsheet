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
            "Each rider picks up to two different upgrades from its list when you select it for the battle.",
        ],
    },
    "factionRules": [
        ("Draconic Cavalry Tactics", "Set up the Drakoliths first. The mounted riders start in reserve and enter in the first Firefight phase with their bases touching your killzone edge. This counts as a Turn action."),
        ("Drakesteed Agility", "Mounted riders can't Charge, Dash, Fall Back or Reposition. Instead they have two actions. Sprint (0AP): move straight forwards or backwards (up to 9\" forwards or 3\" back per activation, and 12\" per turning point), with one pivot of up to 45°. It can't climb or end on Vantage terrain higher than 2\". It moves through operatives, terrain under 2\" tall counts as Accessible, and it removes equipment terrain it passes through. Turn (1AP): pivot up to 45°. Riders activate twice per turning point, spending up to 3AP per activation and no more than their APL in total. Light terrain, terrain under 2\" and terrain that doesn't wholly intervene can't give cover from them or obscure them, and they can fight enemies within 1\" horizontally and 4\" vertically."),
        ("Mercurial Speed", "Each rider has a SPEED of 3-, 4+ or 7+, starting at 3-. A Sprint of 4\" or more gives 4+, and 7\" or more gives 7+. Moving backwards, moving less than 4\" or not Sprinting gives 3-. When one at SPEED 4+ is shot, retain one defence die as a normal success without rolling it (at 7+, as a critical success). Drakoliths use the rule on their own datacard."),
    ],
    "ploys": {
        "strategy": [
            ("Draconic Fury", "When one fights at SPEED 4+, melee weapons gain Balanced, or Ceaseless at 7+."),
            ("Sinuous Flux", "Enemies shooting an operative more than 6\" away at SPEED 4+ or 7+ can't re-roll attack dice."),
            ("Wind-swift Precision", "When one shoots at SPEED 4+, ranged weapons gain Balanced."),
            ("Ride Them Down", "Once per rider activation, at the end of a Sprint of 4\" or more, inflict 1 damage on an enemy in its control range. After 7\" or more (or for the Clanblade), inflict D3 instead."),
        ],
        "firefight": [
            ("Leap", "Instead of a Sprint move, set it up within 1\" horizontally (not through terrain taller than 2\" or onto Vantage terrain higher than 2\"). It counts as moving 3\", at SPEED 3-."),
            ("Feral Hunger", "After rolling attack dice with fangs and talons against a wounded enemy, re-roll any of them."),
            ("Survivalist Spirit", "During a rider's activation, ignore changes to its weapon stats from being injured until its next activation."),
            ("Riding Mastery", "During a rider's Sprint, it can Pick Up Marker, Place Marker or take a mission action partway through the move."),
        ],
    },
    "equipment": [
        {"id": "clan_talismans", "name": "Clan Talismans", "desc": "Once per turning point when a rider attacks, if you fail two or more dice, discard one failure to retain another as a normal success."},
        {"id": "crystal_matrices", "name": "Lileathan Crystal Matrices", "desc": "Once per turning point, a solar carbine or long rifle gains Piercing 1 until the end of the activation."},
        {"id": "dragonscale_mesh", "name": "Dragonscale Mesh", "desc": "Once per turning point, when a rider is shot, retain one normal defence success as a critical success."},
        {"id": "spirit_stones", "name": "Spirit Stones", "desc": "When a rider is incapacitated, gain 1CP."},
    ],
    "operatives": [
        rider("clanblade", "Clanblade", [CARBINE], [FANGS, ("Moonblades", 5, "3+", "4/6", "Lethal 5+")],
              ["Scaleshield: When it's shot and the attacker retained no critical successes, the attacker's Piercing gets worse by 1.",
               "Clanblade Upgrades (pick two): Moonsong Cull (after a forwards Sprint and a kill in a Fight, make a free forwards Sprint with the remaining move). Speartip of the Clan (when fighting at SPEED 4+, its first normal strike deals 1 extra damage, and at 7+ melee weapons get +1 Normal Dmg). Bladed Stance (with moonblades, resolve one success early, as a block). Spectral Nimbus (once per turning point when it fights or retaliates, your opponent can't retain results below 6 as critical successes). Focused Reflection (when shot from within 6\", each critical success you block with inflicts 1 damage back on the attacker)."],
              "CLANBLADE"),
        rider("leystalker", "Leystalker", [("Long rifle (mobile)", 4, "3+", "3/3", "Devastating 1"), ("Long rifle (stationary)", 4, "2+", "3/3", "Devastating 3, Aimed")],
              [FANGS, ("Hunting blade", 3, "3+", "3/5", "Lethal 5+")],
              ["Aimed (weapon rule): It can't use this in an activation where it moved more than 3\", and can't move more than 3\" after using it (it can still Guard).",
               "Implacable Darkscale: Ignore Hit changes from being injured on its fangs and talons.",
               "Leystalker Upgrades (pick two): Fated Shot (once per turning point with the long rifle, the target can't be obscured, or friendly operatives near it don't block the shot). Nexus Sentinel (once per turning point at SPEED 3-, it can Guard in any killzone with no point-blank Hit penalty). Nomad Executioner (Shoot partway through a Sprint). Elusive Phantasm (at the end of each Firefight phase, make a free Sprint or Turn of up to 3\"). Gloaming Mantle (when shot from more than 8\" away, retain one die as a normal success without rolling, or one cover save as a critical success)."],
              "LEYSTALKER"),
        rider("stonesinger", "Stonesinger", [CARBINE, ("Venomcrest spit", 4, "3+", "3/4", 'Range 8", Severe, Torrent 2"')],
              [FANGS, ("Stone stave", 4, "3+", "3/5", "PSYCHIC, Lethal 5+, Shock, Stun")],
              ["Song of Renewal (1AP): PSYCHIC. A visible Dragon Master regains up to 2D3 wounds, or every Dragon Master regains up to D3. Once per turning point, and not within enemy control range.",
               "Stonesinger Upgrades (pick two): Cleansing of the Pale Moon (1AP: remove one enemy effect from a visible friendly operative). Wails of the World (1AP, once per turning point: a visible enemy and others within 2\" of it get -2\" Move, then take 2D3 minus their new Move as damage; riders aren't affected). Earthen Wrath (ranged weapon: 4 Atk, 3+, 4/3 Dmg, Devastating 2, Saturate, Lethal 5+ against targets in cover). Sow the Seeds (once per turning point, it keeps controlling an objective it holds, at APL 1, from anywhere). Wind's Grace (1AP, once per turning point: a visible friendly operative's SPEED counts as one higher until this operative's first activation next turning point)."],
              "PSYKER, STONESINGER"),
        {"id": "drakolithe", "name": "Drakolith", "apl": 2, "move": '8"', "save": "5+", "wounds": 7, "pts": 32,
         "ranged": [], "melee": [("Fangs & talons", 4, "3+", "3/4", "Rending")],
         "abilities": ["Preternatural Evasion: If it ends a Charge, Fall Back or Reposition more than 2\" from where it started, its SPEED is 4+ (7+ if more than 5\"). If it ends an activation without gaining either, its SPEED is 3-.",
                       "Beast: It can only Charge, Dash, Fall Back, Fight, Guard, Pick Up Marker, Place Marker, Reposition and take mission actions (marker and mission actions only while a Leystalker is alive), and only with its own weapons."],
         "kw": "DRAKOLITHE"},
    ],
}
