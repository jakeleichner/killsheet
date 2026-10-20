from _lib import R, A


def C(name, effect):
    return {"name": name, "effect": effect}


PACK = dict(
    id="bloodzeal",
    name="Blood and Zeal",
    kind="Add-on cards",
    modes=["Head-to-head"],
    killzone="Any, plus a shrine statue",
    kz="open",
    summary="An add-on for any two-player mission: a deck of Blood (attack) and Zeal (defence) cards you draw and play during the battle, plus a shrine statue in the middle of the board.",
    source="Blood and Zeal Mission Pack",
    keyMaps=[],
    rules=[
        R("How to use it", "Play any normal mission (Preliminary Ops or Approved Ops) and add these cards on top. Not for 3+ player games.",
          "It adds a lot. With Approved Ops you might drop the tac op and keep just the kill op and crit op."),
        R("Shrine statue", "After picking drop zones, the player with initiative sets up the shrine statue on the centreline, equally in both territories, more than 1\" from other terrain.", [
            "It's Heavy terrain. Its plinth counts as a marker for contesting and controlling it.",
            "On Volkus, take out a small ruin or rubble piece (E-K) near where it goes.",
            "You can use a similar piece from your own collection instead.",
            "While you control it, when you draw you can peek at one card first, then take it or draw a different one blind.",
        ]),
        R("The decks", "Shuffle Blood and Zeal into two face-down decks. Lay three of each face down beside them: that's the draw area.", [
            "To draw, take any face-down card from the draw area (you know if it's Blood or Zeal, not what it says), then refill that spot from the same deck.",
            "Keep your hand secret. If both players draw at once, take turns one card at a time, starting with initiative.",
            "Blood cards are mostly attack. Zeal cards are mostly defence.",
        ]),
        R("When you draw", "Draw one card in each Ready step, plus one card for each VP your opponent scores."),
        R("Playing cards", "Each card says when you can use it. Once used, put it face up in your Blood or Zeal discard pile. Discard piles are public.",
          "You can't just throw cards away: a card only reaches your discard pile by being used."),
        R("End of battle VP", "Count each player's discarded Blood and Zeal cards (not cards in hand).", [
            "More discarded Blood cards than your opponent: +1VP.",
            "More discarded Zeal cards than your opponent: +1VP.",
        ]),
        A("Praise / Blaspheme", 1, "Shuffle one card from your hand, or two of your discarded cards, back into their decks. Then draw a card. (Discarded cards can be worth VP, so think first.)",
          "Not within an enemy's control range, or more than 3\" from the shrine statue's plinth."),
        A("Hallow / Defile", 1, "Hallow or defile the shrine statue you control. Draw a card.",
          "Not within an enemy's control range, only if you control the shrine, and only once per turning point for the shrine."),
    ],
    decks=[
        {"name": "Blood cards", "note": "Attack cards. Draw from the face-down draw area.", "cards": [
            C("+1\" Move", "When your operative Charges or Repositions: +1\" Move for that action (doesn't stack with other Move boosts)."),
            C("Critical Attack", "Shooting or fighting, in Roll Attack Dice: turn one normal success into a crit."),
            C("+D3 Damage Shot", "Shooting, when one of your attack dice deals damage: deal D3 more."),
            C("+D3 Damage Strike", "Fighting, when one of your attack dice deals damage: deal D3 more."),
            C("Double Fight/Shoot", "After your operative Fights or Shoots: it does the same action again, ignoring action limits. Free for operatives with the Astartes rule."),
            C("Take Initiative", "Start of the Initiative step: you have initiative, no roll."),
            C("Re-roll Attack Dice", "Shooting or fighting, after rolling attack dice: re-roll any of them."),
            C("Action on Incapacitation", "When a ready operative of yours is incapacitated: it makes one free action (not Fight) first, and can change order to do it."),
            C("Cancel Block (Fight)", "Fighting, when your opponent blocks: discard that success instead (it still counts as resolved)."),
            C("Shock and Stun", "Shooting or fighting, end of Roll Attack Dice, if you kept a crit: your weapons gain Shock and Stun for that sequence."),
            C("Max Success Attack", "Shooting or fighting, in Roll Attack Dice: keep all your attack dice as normal successes without rolling."),
            C("Free Starting Action", "Start of the Firefight phase: one of your operatives makes a free action, moving no more than 2\". It can change order."),
            C("Prevent Mission Action", "When an enemy does a mission action at an objective you contest: it costs 1 more AP. Until next turning point, mission actions there cost them 1 more AP while you contest it."),
            C("Return Discarded Card", "During your operative's activation: shuffle one of your opponent's discarded cards back into its deck."),
            C("Use or Reuse Ploy", "Firefight phase: use a firefight ploy for 1CP less, or use one a second time this turning point (paying its cost)."),
            C("Steal Card", "During your operative's activation: take a card from your opponent's hand."),
        ]},
        {"name": "Zeal cards", "note": "Defence cards. Draw from the face-down draw area.", "cards": [
            C("-D3 Damage Strike", "When an enemy fighting your operative deals damage with a die: ignore D3 of it."),
            C("Max Success Defence", "When your operative is shot, in Roll Defence Dice: keep all your defence dice as normal successes without rolling."),
            C("+1 APL for Control", "During your activation or at the end of the turning point: pick an objective you contest. Until next turning point, your total APL there counts as 1 higher."),
            C("-D3 Damage Shot", "When an enemy shooting your operative deals damage with a die: ignore D3 of it."),
            C("Ignore Weapon Rule", "When your operative is targeted and the enemy picks a weapon: that weapon loses one weapon rule (not Range) for that sequence."),
            C("Critical Defence", "When your operative is shot, in Roll Defence Dice: turn one normal success into a crit."),
            C("Revive onto 1 Wound", "When your operative would be incapacitated: it stays at 1 wound, can't be incapacitated for the rest of that action, all remaining attack dice are discarded, then it can make a free Dash or a 3\" Fall Back."),
            C("Free Action", "During your operative's activation: it makes a free 1AP action."),
            C("Double Block (Fight)", "Fighting or retaliating, when you block: that success blocks one or two unresolved enemy successes."),
            C("Obscured", "When an enemy shoots your operative from more than 6\" away: your operative is obscured for that action, whatever other rules say."),
            C("Heal 3D3", "During your operative's activation: it heals 3D3 wounds."),
            C("Gain 1CP", "Any time: gain 1CP."),
            C("Reveal Opponent's Cards", "During any activation: your opponent reveals their hand."),
            C("Re-roll Defence Dice", "When your operative is shot, after rolling defence dice: re-roll any of them."),
            C("Free Ending Action", "End of the Firefight phase: one of your operatives makes a free action, moving no more than 2\". It can change order."),
            C("Use or Change Ploy", "Firefight phase: use a strategy ploy now (paying its cost), or swap a strategy ploy you used this turning point for a different one (paying any extra CP)."),
        ]},
    ],
    npos=[],
    missions=[],
)
