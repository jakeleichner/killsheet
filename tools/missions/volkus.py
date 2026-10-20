import copy
from _lib import R, A, M, COOP_TEAM
from shadowhunt import PACK as SHADOW

MARKS_PRI = [
    "Fall Back to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
    "Shoot.",
    "Reposition to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker (a Dash can finish this).",
    "Dash to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
]

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

PACK = dict(
    id="volkus",
    name="Volkus Compound",
    kind="Siege (head-to-head or co-op)",
    modes=["Head-to-head", "Co-op / solo"],
    killzone="Volkus + Compound Siege",
    summary="One team attacks a walled compound, the other defends it. Hold the centre at the end, or wipe out the other side. Includes optional ruses and co-op rules.",
    source="Volkus Compound Mission Pack",
    keyMaps=["volkus-p07", "volkus-p08"],
    rules=[
        R("Offence and Defence", "Offence attacks the compound; Defence holds it. Pick teams that suit the role (a shooting team defends well, an aggressive one attacks well), then try swapping.",
          "Defence has no killzone edge. Win by holding the compound's centre at the end, or by wiping out the other side."),
        R("Compound Siege terrain", "Adds stockades, bunkers and fire steps to Volkus.", [
            "Stockade: Heavy terrain with a breach point. Closed until opened, then it can't close again. Open: remove the removable part; the breach point becomes Accessible, Insignificant and Exposed.",
            "Bunker: Heavy terrain. An operative inside with the bunker in its control range can Guard (Gallowdark rules), but only to interrupt, shoot or fight enemies outside. Gaps between bunkers, stockades and strongholds count as Blocking.",
            "Fire step: Vantage, Insignificant and Exposed.",
        ]),
        R("Fortified position", "Bunkers and stockades protect the people behind them.", [
            "You can't see over their Heavy parts unless you, or what you're looking at, is at least 2\" above their base. You can only see through a window if one end of the line is within 1\" of it. Neither applies through an open breach point.",
            "Shooting someone on the far side who's in cover from it (e.g. at a window): ignore Piercing. Blast, Torrent and x\" Devastating only hit operatives on the same side as the target.",
            "Fighting through a window: the defender resolves first.",
            "Climbing their Heavy parts counts as 4\" vertical.",
        ]),
        R("Breaking a stockade", "Stockades have 8 wounds. At 0 they open.", [
            "Shooting: target it if its removable part is visible. It can be obscured but not in cover. Your weapons hit on 2+. It rolls four defence dice (no re-rolls), Save 4+, and ignores any single hit of 3 damage or less.",
            "Fighting: fight it if its removable part is in control range. It doesn't strike back. Hit on 2+. It ignores any single hit of 5 damage or less.",
        ]),
        A("Open Stockade Door", 1, "Open a stockade that has a door, with the inside of its breach point in your control range.", "Not from outside, and not if it's already open or has no door."),
        R("Game sequence", "Pick Offence and Defence, set up the compound, pick operatives, then set up.", steps=[
            "Decide head-to-head or co-op. Pick kill teams. Assign Offence and Defence (or roll off; the winner picks).",
            "Defence picks a map. Set up Volkus with the Compound Siege pieces and objective marker as shown. Defence can add up to six fire steps.",
            "Pick operatives and up to four equipment options in secret, then reveal. Each player gains 2CP.",
            "Take turns setting up equipment item by item, then a third of your team at a time, starting with Defence. Operatives go wholly in your drop zone with Conceal.",
            "In the first turning point, Offence decides who has initiative.",
        ]),
        R("Winning", "The battle ends after four turning points, or when one team is wiped out.", [
            "If one team is wiped out, the other wins.",
            "Otherwise, whoever controls the objective marker wins.",
            "Otherwise, compare kill grades (from the table below). Higher wins; a tie is a draw.",
        ]),
        R("Kill grade table", "Find the row for how many operatives the enemy started with. It lists how many of them you must incapacitate for kill grade 1, 2, 3, 4 and 5.", [
            "5 enemy operatives: 1, 2, 3, 4, 5",
            "6: 1, 2, 4, 5, 6",
            "7: 1, 3, 4, 6, 7",
            "8: 2, 3, 5, 6, 8",
            "9: 2, 4, 5, 7, 9",
            "10: 2, 4, 6, 8, 10",
            "11: 2, 4, 7, 9, 11",
            "12: 2, 5, 7, 10, 12",
            "13: 3, 5, 8, 10, 13",
            "14: 3, 6, 8, 11, 14",
        ]),
        R("Ruses (optional)", "Pick and reveal ruses along with equipment. Both players can take one, one player can take some as a handicap, or use them to tune a co-op game.", [
            "Offence, Surprise Attack: roll two dice for initiative and pick one, until the first time you don't have initiative.",
            "Offence, Night Assault: targets are obscured unless within 6\", wholly in Defence's drop zone, a stockade, or a Blast secondary target whose primary wasn't obscured.",
            "Offence, Breaching Charges: your operatives get a melee weapon only usable against stockades: Atk 3, Hit 2+, Dmg 5/8.",
            "Offence, Preliminary Bombardment: in the first turning point, Defence operatives can't move (or be set up) more than 3\", and your operatives can't move or be set up in Defence's drop zone unless under Vantage terrain.",
            "Defence, Razor Wire Perimeter: operatives that climb a stockade or bunker, or move in or out of a stronghold from outside the compound, take D3 damage.",
            "Defence, Booby Traps: the first time anyone moves through each door and breach point, roll a D6. On 4+ they take that much damage.",
            "Defence, Stockpile: one extra equipment option.",
            "Defence, Command Station: +1CP at the end of Select Operatives.",
        ]),
        COOP_TEAM,
        R("Co-op NPOs", "Pick any generic NPOs with a combined Wounds of up to 90 (raise or lower it to change difficulty). Give them barricades and other equipment where it makes sense.", [
            "Spread them out in cover. As Defence, spread them across the bunkers, stockades, stronghold and centre.",
            "Initiative: roll one die for them and one for you. If they win, they always take initiative. They always pass in the Gambit step.",
            "As Defence they stay in the compound unless it really makes sense to leave, and Guard from bunkers (one per bunker) when they can't otherwise Shoot or Fight.",
            "As Offence they push into the compound carefully, climbing and opening stockades, and hurry near the end of the fourth turning point.",
        ]),
        R("Co-op threat principle", "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.", [
            "Which NPO activates: the one that can Fight or Shoot (Guard counts as Shoot) and is most dangerous doing so, then one not in cover, then the closest.",
            "Who it shoots: not obscured, then not in cover, then holding an objective, then closest, then wounded, then ready.",
            "Who it fights: wounded, then holding an objective, then ready.",
        ]),
    ],
    npos=generic,
    missions=[
        M(1, "Compound Siege", "Head-to-head", "Offence storms the compound; Defence holds it. Two map layouts to choose from. Can also be played co-op against NPOs on either side.",
          maps=["volkus-p09", "volkus-p10"],
          rules=[R("Rules", "Everything for this mission is in the pack rules above: setup, the compound terrain, ruses and how to win.")]),
    ],
)
