from _lib import R, A, W, NPO, M

PACK = dict(
    id="titus",
    name="Lieutenant Titus",
    kind="Standalone mini-game",
    modes=["Co-op / solo (1-3 players)"],
    killzone="Volkus",
    kz="volkus",
    summary="A simplified spin-off for 1-3 players: Titus and two Ultramarines fight three waves of Tyranids, in the style of Space Marine 2. It uses its own cut-down rules, not your kill team.",
    source="Lieutenant Titus Mission Pack",
    keyMaps=["titus-p11", "titus-p12"],
    rules=[
        R("Not a normal game", "You don't use a kill team or the normal turn structure. You play the three Space Marines below against Tyranid NPOs, with simplified rules."),
        R("Set up", "Volkus terrain (or any terrain), a tape measure, 10 D6, tokens and markers.", steps=[
            "Set up the first wave: 1 Tyranid Warrior and 6 Hormagaunts or Termagants (any mix) within 3\" of objective marker 1, with terrain between them and your drop zone.",
            "Split the three Space Marines between 1-3 players. Roll a D6 for each; highest goes first, then the next, and so on (re-roll ties). Note this order.",
            "In that order, set each Space Marine up wholly within the player drop zone.",
        ]),
        R("Turns", "Turns alternate: player turn, then NPO turn, starting with a player.", [
            "Player turn: the next Space Marine in your order activates, then the turn ends.",
            "NPO turn: activate every NPO of one type, one at a time. The types go in order: Hormagaunts, Termagants, Tyranid Warrior, Lictor. Skip a type with none on the table.",
            "When you reach the end of an order, start it again. Keep going until someone wins.",
        ]),
        R("Actions", "Each activation, an operative (yours or an NPO) can do up to two actions, and not the same one twice unless a rule says so. Space Marines can Shoot twice or Fight twice."),
        R("Control range, visibility and cover", "Same as normal Kill Team: control range is visible and within 1\". Cover is intervening terrain within the target's control range, but not within 2\" of the shooter.",
          "Markers: you control one if more of your operatives contest it than enemies (count operatives, not APL)."),
        R("Damage", "At 0 wounds an operative is incapacitated and removed.", "When a Space Marine without a Mortal Wound token goes down, place a Downed Ally marker within its control range first."),
        R("Shooting and fighting", "Same sequences as Kill Team: three defence dice, cover gives a free normal save, 6s are crits, strike or block in fights. Targets just need to be visible (no orders)."),
        R("NPO behaviour", "Each NPO does the first action on its list it can, until it has done two actions or can't do any more. Use the threat principle (pick what's worst for you) for any other choice."),
    ],
    actions=[
        A("Reposition", "-", "Move up to 6\". Can't move into enemy control range.", "Not while within enemy control range."),
        A("Dash", "-", "Move up to 3\".", "Not while within enemy control range."),
        A("Fall Back", "-", "Move up to 6\". Can pass through enemy control range but can't finish there.", "Only while an enemy is within control range, and it must be the only action that activation."),
        A("Charge", "-", "Move up to 8\" and finish within an enemy's control range. Once you reach an enemy with no other friendly operatives on it, you can't leave its control range.", "Not if already within enemy control range, or with any other move action that activation."),
        A("Revive", "-", "Pick a Downed Ally marker you control. Set that Space Marine back up touching it, with 6 wounds and a Mortal Wound token, then remove the marker.", "Space Marines only. Not while within an NPO's control range."),
        A("Shoot", "-", "Shoot with a ranged weapon.", "Not while within enemy control range. Space Marines can Shoot twice per activation."),
        A("Fight", "-", "Fight an enemy within control range.", "Only while an enemy is within control range. Space Marines can Fight twice per activation."),
    ],
    npos=[
        NPO("Lieutenant Titus", "2 actions", "-", "3+", 15, [
            W("Heavy bolt pistol", "ranged", 4, "3+", "3/4", "Range 8\", Piercing Crits 1"),
            W("Chainsword", "melee", 5, "3+", "4/5", "Balanced"),
        ], "Player operative.", [], rules=[
            ("Lethal Parry", "When retaliating, if you have a crit, you can resolve one before the NPO resolves any."),
            ("Righteous Fury (once per battle)", "Action: Space Marines within 6\" heal up to D3+3 wounds (roll for each) and lose their Mortal Wound tokens."),
        ], base="40mm"),
        NPO("Brother Chairon", "2 actions", "-", "3+", 14, [
            W("Bolt rifle", "ranged", 4, "3+", "3/4", "Piercing Crits 1"),
            W("Chainsword", "melee", 5, "3+", "4/5"),
        ], "Player operative.", [], rules=[
            ("Lethal Parry", "When retaliating, if you have a crit, you can resolve one before the NPO resolves any."),
            ("Auspex Scan (once per battle)", "Action: until the end of Chairon's next activation, all Space Marines get +1 Critical Dmg and crit on 5+ when shooting, fighting or retaliating."),
        ], base="32mm"),
        NPO("Brother-Sergeant Gadriel", "2 actions", "-", "3+", 14, [
            W("Bolt rifle", "ranged", 4, "3+", "3/4", "Piercing Crits 1"),
            W("Chainsword", "melee", 5, "3+", "4/5"),
        ], "Player operative.", [], rules=[
            ("Lethal Parry", "When retaliating, if you have a crit, you can resolve one before the NPO resolves any."),
            ("Battle Cry (once per battle)", "Action: deal D3+3 damage to each enemy within 3\" (roll for each)."),
        ], base="32mm"),
        NPO("Hormagaunt", "2 actions", "-", "5+", 6, [W("Scything talons", "melee", 4, "4+", "2/4")], "Threat level: Minoris.", [
            "Fight.",
            "Charge the closest player operative by the shortest route.",
            "Reposition towards the closest player operative by the shortest route.",
            "Dash towards the closest player operative by the shortest route.",
        ], base="28mm"),
        NPO("Termagant", "2 actions", "-", "5+", 6, [
            W("Ranged bio-weapon", "ranged", 4, "4+", "2/3"),
            W("Claws & teeth", "melee", 3, "4+", "2/3"),
        ], "Threat level: Minoris.", [
            "Fall Back, ideally where it has a valid target.",
            "Reposition towards the closest player operative, to cover if possible, ideally where it has a valid target.",
            "Shoot.",
            "Dash towards the closest player operative, to cover if possible.",
            "Fight.",
        ], base="28mm"),
        NPO("Tyranid Warrior", "2 actions", "-", "4+", 16, [
            W("Ranged bio-weapon", "ranged", 5, "4+", "3/4"),
            W("Boneswords", "melee", 4, "4+", "4/5"),
        ], "Threat level: Majoris.", [
            "Fight.",
            "Charge the closest player operative by the shortest route.",
            "Shoot the closest player operative.",
            "Reposition towards the closest player operative.",
            "Dash towards the closest player operative.",
        ], rules=[
            ("Synapse", "Hormagaunts and Termagants within 3\" of it keep one attack die as a normal success without rolling."),
            ("Synaptic Backlash", "When it's incapacitated, deal D3 damage to each Hormagaunt and Termagant within 3\" (roll for each)."),
        ], base="40mm"),
        NPO("Lictor", "2 actions", "-", "4+", 20, [W("Claws & talons", "melee", 5, "3+", "4/6")], "Threat level: Extremis.", [
            "Fight.",
            "Charge the closest player operative by the shortest route.",
            "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
            "Dash towards the closest player operative, to cover if possible.",
        ], rules=[("Hidden Predator", "After it Fights, it makes a free Fall Back, to cover if possible. While it's in cover from a player operative, that operative can't see it.")], base="40mm"),
    ],
    missions=[
        M(1, "Tyranid Hunt", "Co-op", "Titus's squad fights through three waves of Tyranids to reach a Tech-Priest.",
          maps=["titus-p06"],
          rules=[
              R("Hive Purge", "Objective marker 1 starts active. Purging one makes the next one active."),
              R("Tyrannocyte Remnants", "The first time each wave is wiped out, finish the current player order. If the active marker still isn't purged, the next NPO turn sets up D3+1 Hormagaunts or Termagants within 3\" of it instead of activating, then the NPO order restarts."),
              R("Wave reinforcements", "When marker 2 or 3 becomes active, the next NPO turn sets up a new wave within 3\" of it instead of activating, then the NPO order restarts.", [
                  "Marker 2: 1 Tyranid Warrior and 6 Hormagaunts or Termagants.",
                  "Marker 3: 1 Lictor, 1 Tyranid Warrior and 4 Hormagaunts or Termagants.",
              ]),
          ],
          actions=[A("Purge Tyrannocyte", "-", "Purge the active objective marker in this operative's control range; the next one becomes active. Revive every downed Space Marine (with 3 wounds instead of 6). Then every Space Marine heals D3 wounds.")],
          victory=["You win when all three objective markers are purged.", "You lose if all your operatives are incapacitated."]),
    ],
)
