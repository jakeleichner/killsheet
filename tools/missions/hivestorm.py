from _lib import R, A, M, S

PACK = dict(
    id="hivestorm",
    name="The Great Gun Fires",
    kind="Launch event mission",
    modes=["Head-to-head"],
    killzone="Volkus",
    kz="volkus",
    summary="A Hivestorm launch event mission: grab intelligence and get out while a colossal gun fires overhead, with a different rule each turning point.",
    source="Hivestorm Launch Event Mission: The Great Gun Fires",
    keyMaps=[],
    rules=[
        R("You also need", "This mission uses the game sequence and the Transmission crit op from the Kill Team Core Book, which aren't free. Without them, use any mission with three objective markers and add these rules."),
    ],
    npos=[],
    missions=[
        M(1, "The Great Gun Fires", "Head-to-head", "Seize scattered intelligence and get it out before the Great Gun's recoil flattens the area.",
          rules=[
              R("Facing the Firing", "When setting up the battle, pick a random neutral killzone edge. That's the Massif Ballistus edge, where the gun is."),
              R("Turning point 1: Hymnals of Firing", "+1\" Move for all operatives. +3\" to the distances of SUPPORT rules (doesn't stack with the Comms Device)."),
              R("Turning point 2: Calm Before", "No extra rules."),
              R("Turning point 3: Devastating Report", "In the Ready step, the gun fires.", [
                  "Each operative without intervening Heavy terrain within its control range between it and the Massif Ballistus edge takes D3+1 damage (roll for each).",
                  "Then each operative without intervening Light or Heavy terrain there gains a Shockwave token. Operatives with a token can't activate or act until all their side's operatives without one are expended. Remove the token when it's expended.",
              ]),
              R("Turning point 4: Aftershock", "-2\" Move for all operatives. Whenever an operative Dashes, roll a D6: on a 1 it only moves 1\"."),
          ],
          actions=[A("Initiate Transmission", 1, "An objective marker you control is transmitting until the start of the next turning point.",
                     "Not in the first turning point, or within an enemy's control range.")],
          victory=["The battle ends after four turning points.",
                   "At the end of each turning point after the first: 1VP if your operatives control any transmitting objective markers, and 1VP more if they control more of them than the enemy does."],
          scoring=[S("any", "Your operatives control a transmitting objective marker", most=1, start=2),
                   S("more", "You control more transmitting objective markers than the enemy", most=1, start=2)]),
    ],
)
