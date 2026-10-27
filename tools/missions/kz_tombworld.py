from _lib import R, A

PACK = dict(
    id="kz_tombworld",
    name="Killzone: Tomb World",
    kind="Killzone rules",
    modes=["Any"],
    killzone="Tomb World",
    kz="tomb_world",
    summary="The terrain rules for the Tomb World board: walls, hatchways, breach points, teleport pads, rooms and close quarters fighting. Tomb World, Shadowhunt and The Archivist all use it.",
    source="Killzone: Tomb World (with its Aug '26 update log)",
    keyMaps=["kz_tombworld-p09", "kz_tombworld-p10"],
    rules=[
        R("The board", "A 606mm x 703mm board on a 6 x 7 grid, with a sarcophagus, 4 debris, 2 of each other piece on the map key, and 16 half pillars. Some maps use fewer.",
          "It plays like Killzone: Gallowdark, so Gallowdark errata and rulings apply here too. Portals are still called hatchways and use Operate Hatch."),
        R("Walls", "Tomb World walls are Heavy and Wall terrain.", [
            "Nothing can move over or through Wall terrain, whatever other rules say.",
            "You can't see over or through it.",
            "Measure distances around it by the shortest route (except to areas like drop zones or the center).",
            "For cover and obscured, only the corners and ends of walls count as intervening, unless the active operative has already passed that point. Small bumps don't count as corners.",
        ]),
        R("Hatchways", "Start closed. Closed: the access point and hatch are Heavy and Wall terrain. Open: remove the hatch; the access point is Accessible, Insignificant and Exposed (use the walls beside it for cover)."),
        A("Operate Hatch", 1, "Open or close a hatchway whose access point is in your control range. You can do it partway through a Dash or Reposition and keep moving after.",
          "Not within an enemy's control range, and you can't close it while its access point is in an enemy's control range."),
        R("Breach points", "Start closed and can't be closed again once open. Closed: Heavy and Wall terrain. Open: remove the breach wall; the access point is Accessible, Insignificant and Exposed."),
        A("Breach", 2, "Open a closed breach point whose access point is in your control range. Roll a D6 for each operative on the other side with that access point in its control range: on 4+ it gets -1 APL until the end of its next activation and takes damage equal to half the roll (round up).", [
            "Costs 1AP less (min 1AP) for operatives with 'breach marker', 'grenadier' or 'mine' on their datacard, or a Piercing 2 / Piercing Crits 2 weapon without Blast or Torrent.",
            "It can't cost less than 2AP in an activation where the operative Charges or Shoots.",
            "Not within an enemy's control range, or if the breach point is already open.",
        ]),
        R("Teleport pads", "Exposed, Insignificant and Vantage terrain. Only one operative fits on a pad, and it isn't on the floor while there.", [
            "From the second turning point, an operative on a pad that Charges, Falls Back or Repositions can teleport: set it up on the other pad instead of moving. It must still meet the action's other requirements.",
            "If someone is on the other pad, swap them (its owner places it). Once per activation.",
            "No equipment within 2\" of a pad. An operative touching a pad and one standing on it are in each other's control range.",
            "Teleporting doesn't count as moving for distance rules, and doesn't let you ignore 'can't end closer' limits.",
        ]),
        R("Sarcophagus and debris", "Light terrain."),
        R("Rooms", "A room is any area completely enclosed by walls (and killzone edges where needed)."),
        R("Condensed Environment", "Weapons with Blast, Torrent or x\" Devastating also get Lethal 5+."),
        A("Guard", 1, "The operative goes on guard. Counts as a Shoot action.", [
            "On guard ends when it does any action, moves or is set up, when an enemy ends an action in its control range and you don't interrupt, when its order changes, or at the start of the next turning point.",
            "Not with a Conceal order, or while within an enemy's control range.",
        ]),
        R("On guard", "Once during each enemy activation, after that enemy does an action, you can interrupt and have one of your on-guard operatives Shoot or Fight for free. If you do, it can't counteract this turning point.", [
            "It can even Shoot while within the enemy's control range (a point-blank shot): target that enemy, with -1 to Hit (worse), and it can't retaliate for the rest of that enemy's activation.",
            "Counteracting can't be used to Guard.",
        ]),
        A("Hatchway Fight", 1, "Fight an enemy within 2\" of, and on the other side of, the access point of an open hatchway or breach point your operative is touching. You count as in each other's control range. Counts as a Fight action.",
          "Not within an enemy's control range, or if your base isn't touching an open access point."),
    ],
    npos=[],
    missions=[],
)
