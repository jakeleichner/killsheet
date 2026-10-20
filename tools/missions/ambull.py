from _lib import R, A, W, NPO, M, BEHAVIOUR, THREAT_PRINCIPLE

BRAWLER = [
    "Fight.",
    "Charge the closest player operative by the shortest route.",
    "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
    "Dash towards the closest player operative, to cover if possible.",
]

PACK = dict(
    id="ambull",
    name="Ambull",
    kind="Nemesis Operatives",
    modes=["Co-op / solo", "Head-to-head"],
    killzone="Volkus",
    summary="A burrowing Ambull and its Borewyrm young break into the fight and attack whoever is closest. One co-op mission and one head-to-head mission.",
    source="Ambull: Nemesis Operatives Mission Pack",
    keyMaps=["ambull-p08", "ambull-p09"],
    rules=[
        R("Two missions", "Mission 1 (Joint Ops) is co-op or solo against sentries and the Ambull. Mission 2 (Adversary Ops) is head-to-head, with the Ambull attacking both sides. The Ambull can also be dropped into other missions."),
        R("Burrowing Emergence", "The Ambull and both Borewyrm Infestations start in reserve, off the table. The Intruder deck decides when they come up."),
        R("NPO activation deck (cards 1-8)", "When it's the Ambull side's turn and any of them are on the table, draw a card.", [
            "1-4 Borewyrm Activation: activate a ready Borewyrm (or an expended one if none are ready).",
            "5 Rad-Maggot Outbreak: roll a D6 for each other operative on the killzone floor. If it's under that operative's Save, it takes damage equal to half the roll (round up).",
            "6 Energy Pulse: deal D6 damage to each other operative within 6\" of the Ambull (roll for each).",
            "7 Ambull Activation: the Ambull activates with APL 2.",
            "8 Enraged Ambull Activation: the Ambull activates with APL 3 and can Fight twice.",
            "The Ambull activates at most twice per turning point and moves at most 12\" per turning point. Borewyrms can activate many times.",
            "If nothing on the card can happen, skip it. Reshuffle the whole deck in each Ready step, or when it runs out. You can look through the discard pile.",
        ]),
        R("Intruder deck (cards 9-13)", "Draw one at the end of each turning point after the first, and whenever an operative finishes a mission action (not Operate Hatch). Remove it from the game after use.", [
            "9-10: nothing happens.",
            "11-12: set up a Borewyrm, ready with Conceal: next to the operative that did the mission action, or (at the end of a turning point) at a random objective marker, near enemy operatives if possible.",
            "13: set up the Ambull the same way.",
        ]),
        R("Game sequence", "Pick the mission, set up Volkus from the map, pick operatives, then set up.", steps=[
            "Mission 1: one kill team for the player(s). Mission 2: each player brings a team and rolls off for initiative.",
            "Set up the killzone and objective markers from the map (Volkus, or similar terrain). Assign drop zones.",
            "Pick operatives (mission 2: in secret, then reveal). Up to four equipment options (between you in mission 1, each in mission 2). 2CP (shared in mission 1, each in mission 2).",
            "Set up equipment (mission 2: take turns item by item). Set up NPOs: the Ambull and Borewyrms go in reserve; in mission 1 set up the sentries now with Conceal.",
            "Set up operatives wholly within your drop zone with Conceal (mission 2: a third of your team at a time, taking turns).",
        ]),
        R("Nemesis rules", "Extra Defence: when shot, it rolls one extra defence die unless it's injured. Bulky: it can't be placed on Vantage terrain more than 2\" off the floor (see its card for the rest)."),
        BEHAVIOUR,
    ],
    npos=[
        NPO("Ambull", "2-3 (from card)", "6\"", "4+", 35, [
            W("Enormous claws", "melee", 5, "3+", "4/5", "Brutal, Ceaseless, Rending"),
        ], "Brawler: moves in to fight, using cover on the way. Always Engage (it's a Nemesis).", BRAWLER, rules=[
            ("Nemesis", "Extra Defence and Bulky. Counts as APL 4 for marker control."),
            ("Rad-Maggot Symbiosis", "Each time it activates, it heals wounds equal to its APL + 1. Its APL comes from the activation card."),
        ], base="Small (50mm)"),
        NPO("Borewyrm Infestation", 1, "4\"", "5+", 5, [
            W("Vicious jaws", "melee", 3, "4+", "3/4", "Rending"),
        ], "Brawler: moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.", BRAWLER, rules=[
            ("Small", "While it has a Conceal order and is in cover, it can't be a valid target unless the shooter is within 2\", whatever other rules say."),
        ], base="25mm"),
    ],
    missions=[
        M(1, "The Hidden Enemy", "Co-op", "Destroy the enemy's supply caches and escape. An Ambull is hunting below, and it isn't picky about who it eats.",
          maps=["ambull-p05"],
          rules=[
              R("Three sides", "You face two NPO sides: the Ambull with 2 Borewyrms (in reserve), and the Sentries.",
                "Sentries: D6+10 points of NPOs, set up with Conceal in alternating NPO drop zones, starting with a random one. Sentry datacards and points come from Kill Team: Nemesis Operatives (not in this PDF)."),
              R("Player order", "Instead of rolling for initiative, each side rolls a D6 (re-roll ties). Sides activate in that order in the Firefight phase."),
              R("NPO activation", "The Ambull side uses its activation deck (only if one of them is on the table). Sentries activate using the threat principle. NPOs don't counteract."),
              R("NPO reinforcements", "From the second turning point on, as a Sentry gambit, add D3 points to the reinforcement pool, then set up reinforcements from it, ready with Conceal, touching the NPO killzone edge."),
              R("Escape", "Your operatives can move off your own killzone edge. Any operative whose base crosses it has escaped."),
              THREAT_PRINCIPLE,
          ],
          actions=[A("Eliminate Assets", 1, "Remove an objective marker you control. Then draw from the Intruder deck (if any cards are left).",
                     "Not in the first turning point, or within an enemy's control range.")],
          victory=["The battle ends when all your operatives have escaped or been incapacitated.",
                   "You score 1VP for each objective removed. The NPOs score 1VP for each one left, and 1VP for each third of your starting operatives incapacitated.",
                   "Most VP wins. A tie is a draw."]),
        M(2, "Decaying Generatorium", "Head-to-head", "Two teams race to drain power cells in a failing generator room while the Ambull that broke it comes back for more.",
          maps=["ambull-p07"],
          rules=[
              R("NPOs", "The Ambull and 2 Borewyrms are a third side, starting in reserve. After both players have activated, if any are on the table, draw from the Ambull activation deck."),
              R("Who controls the Ambull", "Its target is the closest visible player operative it could fight or move towards (closest of all if none are visible). Roll off if tied. The other player runs it for that action and must charge or fight that target if it can, otherwise move as Drawn to Energy says."),
              R("Drawn to Energy", "When the Ambull or a Borewyrm Repositions or Dashes, it moves towards the closest objective marker instead (if it can). It still Fights and Charges first if it can."),
              R("Sickening Emissions", "Operatives with an objective marker in their control range can't re-roll attack or defence dice."),
          ],
          actions=[A("Siphon Power", 1, "Siphon an objective marker you control. Then draw from the Intruder deck (if any cards are left).",
                     "Not in the first turning point, not within an enemy's control range, and each marker only once per turning point.")],
          victory=["The battle ends after four turning points. Most VP wins; a tie is a draw.",
                   "1VP each time your operative Siphons Power (max 2VP per turning point).",
                   "2VP if your operative incapacitates the Ambull.",
                   "When a Borewyrm dies, leave a Borewyrm marker. Operatives can pick these up. At the end, score 1VP for each one your operatives carry."]),
    ],
)
