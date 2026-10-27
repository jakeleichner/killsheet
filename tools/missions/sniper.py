import copy
from _lib import R, A, W, NPO, M, BEHAVIOR, COOP_TEAM
from shadowhunt import PACK as SHADOW

MARKS_PRI = [
    "Fall Back to cover, ideally where it has a valid target that isn't obscured.",
    "Shoot.",
    "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
    "Dash to cover, ideally where it has a valid target that isn't obscured.",
]

# Same generic NPOs as Shadowhunt; this pack's Marksman behavior has no Fight step.
generic = []
for n in SHADOW["npos"]:
    if n["name"].startswith(("Trooper", "Tough", "Warrior", "Heavy")):
        n = copy.deepcopy(n)
        n.pop("note", None)
        if "Marksman" in n["name"]:
            n["priorities"] = MARKS_PRI
            n["behaviour"] = "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal."
        if n["name"] == "Trooper (Marksman)":
            n["note"] = "Only 1 in 3 can have the special weapon."
        generic.append(n)

NPOS_90 = "Any NPOs with a combined Wounds of up to 90, set up with Conceal"
REINF = "In each Strategy phase{when}, if half the NPOs (not counting the Sniper) are incapacitated, they call reinforcements as a gambit: two random incapacitated NPOs (not Heavy), or one incapacitated Heavy. {where}"

PACK = dict(
    id="sniper",
    name="Deadly Sniper",
    kind="Joint Ops",
    modes=["Co-op / solo"],
    killzone="Volkus",
    kz="volkus",
    summary="Three linked missions against a garrison with an expert sniper on the top floor. Rescue an officer, flank the position, then storm it.",
    source="Joint Ops: Deadly Sniper Mission Pack",
    keyMaps=[],
    rules=[
        COOP_TEAM,
        R("Missions in order", "Play missions 1-3 in order, win or lose. They're the same area seen from different angles. The sniper is usually out of reach in missions 1 and 2, so you may have to win without fighting it."),
        R("NPOs", "You don't pick a kill team for the NPOs. Each mission sets a total Wounds budget: fill it with any mix of the generic NPO datacards (or make your own).", [
            "Raise or lower the budget to change the difficulty.",
            "NPOs get no equipment.",
        ]),
        R("Initiative", "Roll one die for the NPOs and one for you. If the NPOs win, they always take initiative."),
        BEHAVIOR,
        R("Threat principle", "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.", [
            "Which NPO activates: the one that can Fight or Shoot and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
            "Who it shoots: not obscured, then not in cover, then closest, then wounded, then ready.",
            "Who it fights: the operative it's most likely to incapacitate, then a ready one.",
        ]),
    ],
    npos=[
        NPO("Sniper", "-", "-", "3+", 12, [
            W("Sniper rifle", "ranged", 4, "2+", "3/3", "Devastating 3, Heavy, Silent"),
            W("Gun butt", "melee", 3, "4+", "2/3"),
        ], "Never moves, never has an Engage order, and is never readied or activated. When an NPO would activate, if the Sniper has reloaded and has a valid target, it Shoots instead.", [],
            rules=[
                ("Reload", "It's reloaded in each Ready step. After it Shoots, roll a D6: it reloads after that many of your operatives have activated this turning point."),
                ("Sniper's Nest", "Its targets can't be obscured. When checking what it can see (not what can see it), you can draw the line from any part of its Vantage terrain or the rampart on it."),
            ]),
    ] + generic,
    missions=[
        M(1, "Sniper's Alley", "Co-op", "An officer is pinned down by sniper fire. Get to them and carry them out.",
          maps=["sniper-p05"],
          rules=[
              R("NPOs", f"The Sniper goes on the highest Vantage terrain of Stronghold B. {NPOS_90} wholly within Stronghold B, out of sight of your drop zone or in cover."),
              R("Rescue", "Your operatives can pick up the objective marker (the officer). The carrier's weapons get -1 to Hit (worse), and it can't be removed and set up again (no FLY)."),
              R("Escape", "Your operatives can move wholly off your killzone edge. They've escaped."),
              R("Reinforcements", REINF.format(when="", where="Set them up with Conceal on the floor inside Stronghold B, wholly within 6\" of the NPO killzone edge.")),
          ],
          victory=["In each Ready step, if any NPOs are within 2\" of the officer: at the end of that turning point, if NPOs are still within 2\" of it and none of your operatives are within 6\", you lose.",
                   "When you have no operatives left on the table, you win if one of them escaped carrying the officer. Otherwise you lose."]),
        M(2, "Flank the Sniper", "Co-op", "Sneak or fight your way past the garrison to get round the sniper's side.",
          maps=["sniper-p06"],
          rules=[
              R("NPOs", f"The Sniper goes on the highest Vantage terrain of Stronghold B. {NPOS_90} wholly within the NPO drop zone, spread evenly across areas 1-4, out of sight of your drop zone or in cover."),
              R("Reserve", "You can set operatives up in reserve instead. Operatives incapacitated in mission 1 must start in reserve.",
                "In the first Firefight phase, each reserve operative arrives when activated: set it up within its Move of the left half of your killzone edge. It counts as having Repositioned (spend the AP), then carries on."),
              R("Escape", "Your operatives can move wholly off the left half of either the NPO or player killzone edge. Which edge they used decides where they start in mission 3."),
              R("Reinforcements", REINF.format(when="", where="Set them up with Conceal on the floor inside Stronghold B, wholly within 6\" of the NPO killzone edge.")),
          ],
          victory=["When you have no operatives left on the table, you win if more than half of them escaped over the NPO killzone edge."]),
        M(3, "Sniper Surrounded", "Co-op", "The sniper is cornered in the stronghold. Take it.",
          maps=["sniper-p07"],
          rules=[
              R("NPOs", f"The Sniper goes on the highest Vantage terrain of Stronghold B. {NPOS_90} wholly within Stronghold B, out of sight of your drop zone or in cover."),
              R("Flanking Forces", "Operatives that escaped over the NPO edge in mission 2 start in the right-hand player drop zone. Everyone else starts in the left-hand one."),
              R("Defend the Stronghold", "Add a barricade to the center of Stronghold B. NPOs do whatever best defends the stronghold, and only leave it if that really threatens your operatives."),
              R("No Escape", "When one of your operatives wholly inside Stronghold B shoots an NPO also wholly inside it, your ranged weapons have Seek Light. That lets you target the Sniper."),
              R("Reinforcements", REINF.format(when=" after the second", where="Set each one up wholly within 4\" of the center of a random NPO killzone edge.")),
          ],
          victory=["At the end of any turning point from the fourth on, you can end the battle. It also ends if all your operatives are incapacitated.",
                   "You win if you control the stronghold: your operatives wholly inside it and on the floor have more total APL than the NPOs there."]),
    ],
)
