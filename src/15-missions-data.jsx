/* MISSION_PACKS:BEGIN */
const MISSION_PACKS = [
 {
  "id": "devlan",
  "name": "Terror on Devlan",
  "kind": "Joint Ops",
  "modes": [
   "Co-op / solo"
  ],
  "killzone": "Volkus",
  "kz": "volkus",
  "summary": "Hunt the Red Terror, a Tyranid monster that burrows, heals and keeps coming back, through nine linked missions backed by swarms of Termagants.",
  "source": "Joint Ops: Terror on Devlan Mission Pack",
  "keyMaps": [
   "devlan-p03",
   "devlan-p04",
   "devlan-p05"
  ],
  "rules": [
   {
    "name": "Your kill team",
    "summary": "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    "detail": [
     "Co-op players count as one player: you share CP and equipment.",
     "If you mix two teams, one team's rules may not affect the other's operatives.",
     "One player can act as game master and run the NPOs instead of playing."
    ]
   },
   {
    "name": "Game sequence",
    "summary": "Set up the killzone from the mission map, pick operatives, then set up.",
    "steps": [
     "Pick the mission and set up the killzone (Volkus terrain, or similar terrain of your own).",
     "Pick your operatives. Take up to four equipment options between you and start with 2CP between you.",
     "Set up your equipment, then any NPOs the mission sets up before the battle, then your operatives wholly within your drop zone with Conceal orders.",
     "You have initiative in the first turning point. After that, roll one die for the NPOs and one for you. If the NPOs win, they always take initiative."
    ]
   },
   {
    "name": "NPOs and CP",
    "summary": "NPOs never gain CP. They only use the strategy gambits the mission gives them, then pass."
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   },
   {
    "name": "NPO activation cards",
    "summary": "When it's the NPOs' turn, draw a card numbered 1 to 13 and check the mission's activation table.",
    "detail": [
     "Discard each card after use. You can look through the discard pile at any time.",
     "Shuffle all cards back together in each Ready step, or when the deck runs out.",
     "If nothing on the card can happen, skip the NPO turn. If only part of it can, do as much as you can.",
     "NPOs don't counteract, but still draw a card on their turn even if they're all expended.",
     "No cards? Use one suit of playing cards: Ace is 1, Jack 11, Queen 12, King 13."
    ]
   },
   {
    "name": "Threat principle",
    "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    "detail": [
     "Which NPO activates: the one that can Shoot or Fight and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
     "Where to set it up: where it's most likely to stop you winning, then where it isn't a valid target, then where it can best Charge, Shoot or Fight.",
     "Who it fights: the operative it's most likely to incapacitate, then a ready one.",
     "Who it shoots: the operative it's most likely to incapacitate, then one not obscured, not in cover, closest, then ready."
    ]
   },
   {
    "name": "Difficulty",
    "summary": "Set up one more (or one fewer) NPO each time NPOs arrive, or raise or lower the Red Terror's Wounds in steps of 5."
   },
   {
    "name": "Campaign",
    "summary": "Play missions 1 to 4 in order, win or lose. After that, winning or losing decides the next mission (shown on each mission).",
    "detail": [
     "Mission 4: win go to 5, lose go to 6.",
     "Mission 5: win go to 7, lose go to 8. Mission 6: win go to 8, lose go to 9.",
     "Mission 7: win for a Glorious Campaign Victory, lose go to 8.",
     "Mission 8: win for an Honourable Campaign Victory, lose go to 9.",
     "Mission 9: win for an Honourable Campaign Defeat, lose for a Spirited Campaign Defeat."
    ]
   },
   {
    "name": "Red Terror in head-to-head games",
    "summary": "The pack's appendix lets one player run the Red Terror and 9 Termagants in a casual player-vs-player game, with their own activation deck and ploys.",
    "detail": [
     "Use a simple mission (Preliminary Ops or Approved Ops), not one where that player must escape or survive.",
     "Activation cards: 1-5 activate a Termagant or Ripper Swarm, 6-8 activate two Termagants, 9-13 activate the Red Terror.",
     "The Red Terror player picks actions and orders freely from the datacards. Their kill grade goes up when 5 Termagants fall, when all Termagants fall, and when the Red Terror gains a Regeneration token (max 5).",
     "Strategy ploys: Termagant Reinforcement, Ripper Swarm Ambush, Voracious Ammunition, Submerged. Firefight ploys: Hive Mind, Xenos Frenzy, Tail Lash, Savage Aggression."
    ]
   }
  ],
  "npos": [
   {
    "name": "Termagant",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Fleshborer",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Claws & teeth",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot this activation, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [
     {
      "name": "Limit",
      "desc": "No more than 10 Termagants on the table at once. Skip any that would go over."
     }
    ],
    "base": "28mm"
   },
   {
    "name": "Ripper Swarm",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Claws & teeth",
      "type": "melee",
      "atk": 5,
      "hit": "4+",
      "dmg": "1/2",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Hidden Horrors",
      "desc": "While it has a Conceal order and is in cover, it can't be a valid target unless the shooter is within 2\", whatever other rules say."
     },
     {
      "name": "Limit",
      "desc": "Only set up when a mission says so."
     }
    ],
    "base": "40mm"
   },
   {
    "name": "Red Terror (Hunt)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 30,
    "weapons": [
     {
      "name": "Pincer tail",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "Range 3\", Seek"
     },
     {
      "name": "Scything talons & maw",
      "type": "melee",
      "atk": 6,
      "hit": "3+",
      "dmg": "4/6",
      "wr": "Swallow Whole"
     }
    ],
    "behaviour": "Comes up from underground and goes after your operatives. Engage if it will Fight, Charge or Shoot, otherwise Conceal.",
    "priorities": [
     "Emerge (1AP): remove its Burrow marker and set it up there, or wholly in a random NPO drop zone if there's no marker. -2\" Move this activation. Only while underground (it starts the battle underground).",
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Shoot.",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Fearsome Foe",
      "desc": "Can only be in cover or obscured behind terrain at least 3\" tall. Its control range is 1\" across and 6\" up, in both directions. If a card activates it while it's expended, ready it first, so it can activate several times per turning point."
     },
     {
      "name": "Burrow",
      "desc": "Whenever it moves, take it off the table and set it back up on the killzone floor within its move distance, wherever its behavior wants. Temporarily remove terrain under 3\" tall and push other operatives aside to make room."
     },
     {
      "name": "Survival Instincts",
      "desc": "It can't be incapacitated or injured, and its APL can't change. When it would be incapacitated, it heals fully and switches to Lurk. If it's already in Lurk, it heals fully and gains a Regeneration token. Either way, all remaining attack dice in that fight or shot are discarded."
     },
     {
      "name": "Behavior changes",
      "desc": "It starts in Hunt. It switches to Lurk when it would be incapacitated (or when a mission says so), and back to Hunt when it activates underground with no Regeneration tokens."
     },
     {
      "name": "Swallow Whole",
      "desc": "After each crit it strikes with in a fight, roll a D6. If it beats the enemy's remaining wounds, that operative is incapacitated and the Red Terror regains wounds equal to the roll."
     }
    ],
    "base": "100mm"
   },
   {
    "name": "Red Terror (Lurk)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 30,
    "weapons": [
     {
      "name": "Scything talons",
      "type": "melee",
      "atk": 6,
      "hit": "4+",
      "dmg": "4/6",
      "wr": "-"
     }
    ],
    "behaviour": "Runs from your operatives to go underground and heal. Always Conceal, unless it's switching to Hunt this activation.",
    "priorities": [
     "Disappear Underground (1AP): remove it, put a Burrow marker where it stood, give it a Regeneration token, heal it fully and clear its other tokens. Not within 5\" of player operatives (unless in an NPO drop zone), and only from the killzone floor.",
     "Fall Back towards somewhere it can Disappear Underground.",
     "Reposition towards somewhere it can Disappear Underground (a Dash can finish this).",
     "Dash towards somewhere it can Disappear Underground."
    ],
    "rules": [
     {
      "name": "Fearsome Foe",
      "desc": "Can only be in cover or obscured behind terrain at least 3\" tall. Its control range is 1\" across and 6\" up, in both directions. If a card activates it while it's expended, ready it first, so it can activate several times per turning point."
     },
     {
      "name": "Burrow",
      "desc": "Whenever it moves, take it off the table and set it back up on the killzone floor within its move distance, wherever its behavior wants. Temporarily remove terrain under 3\" tall and push other operatives aside to make room."
     },
     {
      "name": "Survival Instincts",
      "desc": "It can't be incapacitated or injured, and its APL can't change. When it would be incapacitated, it heals fully and switches to Lurk. If it's already in Lurk, it heals fully and gains a Regeneration token. Either way, all remaining attack dice in that fight or shot are discarded."
     },
     {
      "name": "Behavior changes",
      "desc": "It starts in Hunt. It switches to Lurk when it would be incapacitated (or when a mission says so), and back to Hunt when it activates underground with no Regeneration tokens."
     },
     {
      "name": "Regeneration",
      "desc": "When it activates underground: if it has a Regeneration token, discard one and end its activation. If it has none, switch to Hunt and keep going."
     }
    ],
    "base": "100mm"
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "The Hunt Begins",
    "mode": "Co-op",
    "summary": "Patrols stir up a Termagant nest. Fight your way back to the spaceport before you're overrun.",
    "maps": [
     "devlan-p12"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "No NPOs at the start. Treat every card as 'skip' until the 1 comes up, and don't reshuffle until it does.",
      "detail": "When the 1 is drawn, set up 10 Termagants: ready, Conceal, wholly within 2\" of a random NPO drop zone each, more than 2\" from other operatives if possible. Then activate one NPO from the table."
     },
     {
      "name": "Reinforcements",
      "summary": "After the 1 has been drawn, set up D3+1 more Termagants the same way as an NPO gambit in each Strategy phase."
     },
     {
      "name": "Escape",
      "summary": "Your operatives can move off the NPO killzone edge. Any operative whose base crosses it has escaped."
     }
    ],
    "actions": [],
    "victory": [
     "When all your operatives have left the killzone, the battle ends.",
     "You win if at least a third of your operatives (round up) escaped."
    ],
    "cards": [
     {
      "roll": "1-7",
      "effect": "Activate one ready Termagant. Its fleshborer has Balanced this activation."
     },
     {
      "roll": "8-10",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "11-13",
      "effect": "Set up one Termagant, ready with Conceal, wholly within a random NPO drop zone."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": 2,
    "nextLose": 2
   },
   {
    "num": 2,
    "name": "On the Trail",
    "mode": "Co-op",
    "summary": "Seal the tunnel entrances below the spaceport while the Red Terror lurks nearby.",
    "maps": [
     "devlan-p14"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Before the battle, set up D3 Termagants wholly within each NPO drop zone (roll for each)."
     },
     {
      "name": "The Beast Below",
      "summary": "Start without cards 11-13 in the deck. Shuffle them back in during the second Ready step, then don't reshuffle again until one of them is drawn."
     },
     {
      "name": "Biding Its Time",
      "summary": "When the Red Terror incapacitates one of your operatives, it switches to Lurk. Once it goes underground, it's gone for the rest of the battle."
     }
    ],
    "actions": [
     {
      "name": "Destroy Tunnel",
      "summary": "Destroy an objective marker you control. Set up a Ripper Swarm (or a Termagant if the Swarm is already out), ready with Conceal, within 3\" of it, then deal it D3+2 damage.",
      "detail": "Not in the first turning point, not within an enemy's control range, and not on a marker that's already destroyed.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "You win when every objective marker is destroyed.",
     "You lose if all your operatives are incapacitated."
    ],
    "cards": [
     {
      "roll": "1-5",
      "effect": "Activate one ready Termagant or Ripper Swarm."
     },
     {
      "roll": "6-7",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "8-10",
      "effect": "Set up one Termagant, ready with Conceal, within 3\" of a random intact objective marker."
     },
     {
      "roll": "11-13",
      "effect": "Activate the Red Terror. If it's gone for the battle, discard and draw again."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": 3,
    "nextLose": 3
   },
   {
    "num": 3,
    "name": "Know Your Foe",
    "mode": "Co-op",
    "summary": "Use yourselves as bait to scan the Red Terror, then get the data out.",
    "maps": [
     "devlan-p16"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "No NPOs at the start. They arrive through the activation cards."
     },
     {
      "name": "Escape",
      "summary": "Your operatives can move off the NPO killzone edge. Any operative whose base crosses it has escaped."
     },
     {
      "name": "Capricious Predator",
      "summary": "When the Red Terror incapacitates one of your operatives, it switches to Lurk."
     }
    ],
    "actions": [
     {
      "name": "Scan",
      "summary": "Roll a D6 and add the distance to the Red Terror. On 9 or less, this operative now carries a Scan marker. NPOs focus on operatives carrying one.",
      "detail": "Only if the Red Terror is a valid target for it. Not within an enemy's control range, or while already carrying a marker.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "When all your operatives have left the killzone, the battle ends.",
     "You win if at least a third of your operatives (round up) escaped and at least one of them carried a Scan marker."
    ],
    "cards": [
     {
      "roll": "1-4",
      "effect": "Activate one ready Termagant. If there are none on the table, use 5-6 instead."
     },
     {
      "roll": "5-6",
      "effect": "Set up one Termagant, ready with Conceal, wholly within a random NPO drop zone."
     },
     {
      "roll": "7-11",
      "effect": "Activate the Red Terror."
     },
     {
      "roll": "12-13",
      "effect": "Activate the Red Terror. If it's already on the table, switch it to Lurk."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": 4,
    "nextLose": 4
   },
   {
    "num": 4,
    "name": "Lair of the Beast",
    "mode": "Co-op",
    "summary": "Search the tunnels to find the Red Terror's lairs and hold them.",
    "maps": [
     "devlan-p18"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Before the battle, set up 10 Termagants wholly within the NPO drop zone."
     },
     {
      "name": "Search deck",
      "summary": "Take cards 8-13 out to make a Search deck. Searched cards go into the activation discard pile, so they join the normal deck when it's reshuffled.",
      "detail": [
       "8 No Biodata: once this battle, ignore an activation card and draw another.",
       "9 Trace Xenosigns: this marker is a lair. Look at the next Search card and put it on the top or bottom.",
       "10 On the Trail: gain D3 CP.",
       "11 Rippers!: this marker is a lair. Set up a Ripper Swarm, expended with Engage, in the searcher's control range. It fights right away for free.",
       "12 Bioacid Rupture: deal D3+1 damage to the searcher.",
       "13 Grisly Remains: this marker is a lair. The searcher gets -1 APL until the end of its next activation."
      ]
     }
    ],
    "actions": [
     {
      "name": "Search",
      "summary": "Search an objective marker you control: draw from the Search deck to see if it's a lair.",
      "detail": "Not within an enemy's control range, or on a marker that's already been searched.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "After any turning point from the fourth on, you can end the battle.",
     "You win if there are three lair markers and you control at least two of them.",
     "You lose if all your operatives are incapacitated."
    ],
    "cards": [
     {
      "roll": "1-3",
      "effect": "Activate one ready Termagant or Ripper Swarm."
     },
     {
      "roll": "4-5",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "6-7",
      "effect": "Set up one Termagant, ready with Conceal, wholly within the NPO drop zone (not if 10 are already out)."
     },
     {
      "roll": "8-13",
      "effect": "Activate the Red Terror."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": 5,
    "nextLose": 6
   },
   {
    "num": 5,
    "name": "Flushed Out",
    "mode": "Co-op",
    "summary": "The Red Terror is in the open. Keep up the pressure so it can't dig in and heal.",
    "maps": [
     "devlan-p20"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Before the battle, set up D3 Termagants on Vantage terrain wholly within each NPO drop zone. They stay in their drop zone until it's checked."
     },
     {
      "name": "Lying in Wait",
      "summary": "Take cards 10-13 out to make an Ambush deck. The first time one of your operatives finishes a move or is set up within 2\" of an NPO drop zone, that zone is checked: draw an Ambush card.",
      "detail": [
       "10-12: if this is the last zone checked, use 13 instead. Otherwise set up D3 Termagants, ready with Conceal, on the floor in that zone.",
       "13: set up the Red Terror on the floor in that zone. Set up D3 Termagants, expended with Conceal, in each unchecked zone, then put the remaining Ambush cards in the discard pile."
      ]
     },
     {
      "name": "Cornered",
      "summary": "When the Red Terror Emerges, roll 2D6. If it's set up within that many inches of your operatives, it gets -1 APL that activation."
     }
    ],
    "actions": [],
    "victory": [
     "You win once the Red Terror has gained its third Regeneration token and is next underground.",
     "You lose if all your operatives are incapacitated."
    ],
    "cards": [
     {
      "roll": "1-4",
      "effect": "Activate one ready Termagant."
     },
     {
      "roll": "5-6",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "7-13",
      "effect": "Activate the Red Terror (no effect until it's been set up)."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": 7,
    "nextLose": 8
   },
   {
    "num": 6,
    "name": "The Hunters Hunted",
    "mode": "Co-op",
    "summary": "Your attack failed and your team is scattered. Regroup in one drop zone and hold it.",
    "maps": [
     "devlan-p22"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Set up operatives one at a time, alternating, starting with an NPO. Before the battle set up D3+6 Termagants, then D3+1 more as an NPO gambit in each later Strategy phase. Each one: ready, Conceal, wholly in a random NPO drop zone."
     },
     {
      "name": "Split Up",
      "summary": "Roll a D6 for each of your operatives to pick its drop zone (re-roll 5-6). It must be set up on the table, more than 2\" from other player drop zones."
     },
     {
      "name": "Don't Let It Sense Us",
      "summary": "Take cards 8-13 out to make a Sense deck. Whenever any operative Shoots, Fights or otherwise deals damage, add a Sense card to the activation discard pile."
     }
    ],
    "actions": [],
    "victory": [
     "After any turning point from the fourth on, you win if all your surviving operatives are wholly within the same drop zone and it's secure.",
     "Secure: your operatives' total APL in it is at least 4 more than the NPOs' (ignore anyone in an enemy's control range), and the Red Terror isn't wholly in it.",
     "You lose if all your operatives are incapacitated."
    ],
    "cards": [
     {
      "roll": "1-4",
      "effect": "Activate one ready Termagant."
     },
     {
      "roll": "5-7",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "8-13",
      "effect": "Activate the Red Terror. The first time it Emerges, set it up wholly in a random NPO drop zone."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": 8,
    "nextLose": 9
   },
   {
    "num": 7,
    "name": "Execution",
    "mode": "Co-op",
    "summary": "The Red Terror is badly hurt. Find it and finish it.",
    "maps": [
     "devlan-p24"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "As an NPO gambit in each Strategy phase, set up D3+1 Termagants, each wholly in a random NPO drop zone from 1-3."
     },
     {
      "name": "Quarry Sighted",
      "summary": "The first time one of your operatives finishes a move or is set up within 2\" of NPO drop zone 4, set up the Red Terror there, ready with Conceal. Until then, cards 7-13 do nothing."
     },
     {
      "name": "Wounded Beast",
      "summary": "Whenever the Red Terror gains a Regeneration token, first lower its Wounds stat by D6+4. Then you can remove one discarded activation card from the game (not 1 or 13)."
     }
    ],
    "actions": [],
    "victory": [
     "You win if the Red Terror's Wounds stat drops to 0 or less.",
     "You lose if all your operatives are incapacitated."
    ],
    "cards": [
     {
      "roll": "1-2",
      "effect": "Activate one ready Termagant."
     },
     {
      "roll": "3-4",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "5-6",
      "effect": "Set up one Termagant, ready with Conceal, wholly within a random NPO drop zone from 1-3."
     },
     {
      "roll": "7-12",
      "effect": "Activate the Red Terror."
     },
     {
      "roll": "13",
      "effect": "Activate the Red Terror with +1 APL. It can Fight twice this activation."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": "Glorious Campaign Victory",
    "nextLose": 8
   },
   {
    "num": 8,
    "name": "Fire from the Skies",
    "mode": "Co-op",
    "summary": "Your weapons can't kill it. Plant beacons and call in air strikes on top of it.",
    "maps": [
     "devlan-p26"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. As an NPO gambit in each Strategy phase, set up D3 Termagants, ready with Conceal, wholly within each NPO drop zone."
     },
     {
      "name": "Wounded Beast",
      "summary": "Each time a Plant Beacon strike deals 8+ damage to the Red Terror, you can remove one discarded activation card from the game (not 1 or 13)."
     }
    ],
    "actions": [
     {
      "name": "Plant Beacon",
      "summary": "Place your Beacon marker visible and within 3\", then roll a D6. After that many activations or counteractions, deal 2D6 damage to every operative within D6\" of it (except ones fully under Vantage terrain), then remove it.",
      "detail": "Not within an enemy's control range, or while your Beacon marker is already out.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "Keep a running total of beacon damage dealt to the Red Terror (healing doesn't lower it). You win at 35.",
     "You lose if all your operatives are incapacitated."
    ],
    "cards": [
     {
      "roll": "1-4",
      "effect": "Activate one ready Termagant."
     },
     {
      "roll": "5-6",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "7-13",
      "effect": "Activate the Red Terror."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": "Honourable Campaign Victory",
    "nextLose": 9
   },
   {
    "num": 9,
    "name": "Last Stand",
    "mode": "Co-op",
    "summary": "Nowhere left to run. Hold out as long as you can so others can escape.",
    "maps": [
     "devlan-p28"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. As an NPO gambit in each Strategy phase, set up D3+2 Termagants, ready with Conceal, each in a random NPO drop zone. The first time the Red Terror Emerges, set it up in a random corner."
     },
     {
      "name": "Well Prepared",
      "summary": "Take up to two extra equipment options."
     },
     {
      "name": "Heroic Defiance",
      "summary": "When one of your operatives drops the Red Terror to 0 wounds, roll a D6. Pick one result at or below the roll, then that operative heals wounds equal to the roll.",
      "detail": [
       "1-2: look at the next activation card, then discard it or put it on the top or bottom.",
       "3-4: that operative makes a free Charge, Fall Back or Reposition of up to 3\".",
       "5-6: that operative gets +1 APL for the rest of the battle (once per operative)."
      ]
     }
    ],
    "actions": [],
    "victory": [
     "You win if any of your operatives are still alive at the start of the fifth turning point. Keep playing to see how long they last."
    ],
    "cards": [
     {
      "roll": "1-4",
      "effect": "Activate one ready Termagant."
     },
     {
      "roll": "5-6",
      "effect": "Activate two ready Termagants, one after the other."
     },
     {
      "roll": "7-13",
      "effect": "Activate the Red Terror."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "nextWin": "Honourable Campaign Defeat",
    "nextLose": "Spirited Campaign Defeat",
    "tps": 5,
    "equip": 6
   }
  ]
 },
 {
  "id": "typhon",
  "name": "Typhon",
  "kind": "Joint Ops + Adversary Ops",
  "modes": [
   "Co-op / solo",
   "Head-to-head"
  ],
  "killzone": "Volkus + Tyranid Infestation",
  "kz": "volkus",
  "summary": "Push into a Tyranid infestation through six branching missions, with random event cards stirring up the swarm. Also has head-to-head rules where Tyranids attack both sides.",
  "source": "Joint Ops: Typhon Mission Pack",
  "keyMaps": [
   "typhon-p09",
   "typhon-p10",
   "typhon-p03"
  ],
  "rules": [
   {
    "name": "Your kill team",
    "summary": "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    "detail": [
     "Co-op players count as one player: you share CP and equipment.",
     "If you mix two teams, one team's rules may not affect the other's operatives.",
     "One player can act as game master and run the NPOs instead of playing."
    ]
   },
   {
    "name": "Killzone",
    "summary": "Volkus terrain plus the Tyranid Infestation upgrade (gestation sacs, brood nests, underbrood mounds and more). The infestation pieces are Light or Heavy terrain with no rules of their own; missions and event cards give them rules."
   },
   {
    "name": "Game sequence",
    "summary": "Pick the mission, set up the killzone from the map, pick operatives, then set up.",
    "steps": [
     "Pick the mission and set up Volkus with the Tyranid Infestation pieces as the map shows.",
     "Pick your operatives. Take up to four equipment options between you and start with 2CP between you. NPOs get no equipment.",
     "Set up your equipment, then the NPOs as the mission says, then your operatives wholly within your drop zone with Conceal orders.",
     "You have initiative in the first turning point. After that, roll one die for the NPOs and one for you. If the NPOs win, they always take initiative."
    ]
   },
   {
    "name": "Which NPOs",
    "summary": "Whenever a mission says to set up an NPO, use a Hormagaunt. Ripper Swarms only come from an event card.",
    "detail": "Optional, if everyone agrees: roll 2D6 for each new NPO instead. 2-3 Barbgaunt, 4-6 Termagant, 7-9 Hormagaunt, 10-11 Von Ryan's Leaper, 12 Ravener."
   },
   {
    "name": "NPO limit",
    "summary": "No more than 10 NPOs on the table at once. Skip any that would go over, using the threat principle to pick which ones."
   },
   {
    "name": "Event cards",
    "summary": "NPOs gain no CP. As an NPO gambit in each Strategy phase, draw a random Typhon event card. After the first turning point, draw two if the NPOs don't have initiative.",
    "detail": "Shuffle used event cards back into the deck in each Ready step."
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   },
   {
    "name": "Threat principle",
    "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    "detail": [
     "Which NPO activates: the one that can Fight or Shoot and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
     "Where to set it up: where it's most likely to stop you winning, then within control range of your operatives (if it fights), then where it isn't a valid target, then where it can best Charge or Shoot.",
     "Who it fights: the operative it's most likely to incapacitate, then the one most likely to help you win, then a ready one.",
     "Who it shoots: not obscured, then not in cover, then closest, then wounded, then ready."
    ]
   },
   {
    "name": "Difficulty",
    "summary": "Change how many NPOs arrive, mix in tougher NPO types, or change how many event cards are drawn (or take some out of the deck)."
   },
   {
    "name": "Campaign",
    "summary": "Start with mission 1. Winning or losing decides the next mission.",
    "detail": [
     "Mission 1: win go to 2, lose go to 3.",
     "Mission 2: win go to 4, lose go to 5.",
     "Mission 3: win go to 5, lose go to 6.",
     "Missions 4, 5 and 6 end the campaign."
    ]
   }
  ],
  "decks": [
   {
    "name": "Typhon event cards",
    "note": "Draw as an NPO gambit. Shuffle used cards back in each Ready step.",
    "cards": [
     {
      "name": "Birthing Sac",
      "effect": "Set up one ready NPO with Conceal as close as possible to a random gestation sac (S). If you can't, draw a different card."
     },
     {
      "name": "Birthing Sac",
      "effect": "Set up one ready NPO with Conceal as close as possible to a random gestation sac (S). If you can't, draw a different card."
     },
     {
      "name": "Voracious",
      "effect": "NPO weapons have Lethal 5+."
     },
     {
      "name": "Sentient Barbs",
      "effect": "When a player operative moves within 1\" of a Tyranid Infestation piece, roll a D6: on 3+ it takes 1 damage. Once per piece per activation."
     },
     {
      "name": "Spore Miasma",
      "effect": "When shooting at an operative more than 8\" away, the defender rolls one extra defense die."
     },
     {
      "name": "Overrun",
      "effect": "Each NPO makes a free Charge of up to 3\" (changing order if needed). Any that can't, make a free Dash instead."
     },
     {
      "name": "Lurk",
      "effect": "When you shoot an NPO, re-roll one of its defense dice if that helps it. When you would strike an NPO, roll a D6: on 5+ you must block instead (if you can't, the strike does nothing)."
     },
     {
      "name": "Feed",
      "effect": "D3 NPOs immediately make a free Fight action. If none can, draw a different card."
     },
     {
      "name": "Ripper Swarm",
      "effect": "If no Ripper Swarm is out, set one up ready with Conceal in NPO territory (co-op) or near a random objective marker (head-to-head), within control range of a player operative if possible. If a wounded one is out, it heals fully. If neither, draw a different card."
     },
     {
      "name": "Synaptic Backlash",
      "effect": "Pick a player operative and roll a D6. If it beats that operative's APL, it gets -1 APL. If not, pick another and repeat. Doesn't affect operatives that block psychic rules."
     }
    ]
   }
  ],
  "npos": [
   {
    "name": "Hormagaunt",
    "apl": 2,
    "move": "7\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Scything talons",
      "type": "melee",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [],
    "base": "28mm",
    "note": "The default NPO for every mission."
   },
   {
    "name": "Ripper Swarm",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Claws & teeth",
      "type": "melee",
      "atk": 5,
      "hit": "4+",
      "dmg": "1/2",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Hidden Horrors",
      "desc": "While it has a Conceal order and is in cover, it can't be a valid target unless the shooter is within 2\", whatever other rules say."
     }
    ],
    "base": "40mm",
    "note": "Only arrives from the Ripper Swarm event card."
   },
   {
    "name": "Barbgaunt",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 12,
    "weapons": [
     {
      "name": "Barblauncher (mobile)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "3/5",
      "wr": "Blast 2\""
     },
     {
      "name": "Barblauncher (stationary)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "3/5",
      "wr": "Blast 2\", Ceaseless, Heavy"
     },
     {
      "name": "Claws & teeth",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [],
    "base": "40mm",
    "note": "Optional random NPO."
   },
   {
    "name": "Termagant",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Fleshborer",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Claws & teeth",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [],
    "base": "28mm",
    "note": "Optional random NPO."
   },
   {
    "name": "Von Ryan's Leaper",
    "apl": 3,
    "move": "7\"",
    "save": "5+",
    "wounds": 12,
    "weapons": [
     {
      "name": "Scything talons",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Predatory Xenoform",
      "desc": "Can Fight twice in one activation."
     }
    ],
    "base": "40mm",
    "note": "Optional random NPO."
   },
   {
    "name": "Ravener",
    "apl": 3,
    "move": "7\"",
    "save": "5+",
    "wounds": 20,
    "weapons": [
     {
      "name": "Scything talons",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Predatory Xenoform",
      "desc": "Can Fight twice in one activation."
     }
    ],
    "base": "40mm",
    "note": "Optional random NPO."
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Delve the Xenosprawl",
    "mode": "Co-op",
    "summary": "Send search drones down every brood nest and underbrood mound before the sleeping swarm wakes up.",
    "maps": [
     "typhon-p12"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Before the battle, set up one NPO wholly within each NPO drop zone, as close as possible to a brood nest (Q) or underbrood mound (R)."
     },
     {
      "name": "Dormant Tyranids",
      "summary": "All NPOs start dormant: expended, and they can't be readied.",
      "detail": [
       "An NPO wakes up if it takes damage, is shot at, or a player operative comes within 6\" of it. It's readied straight away.",
       "If every NPO is dormant in the Initiative step, you get initiative without rolling."
      ]
     },
     {
      "name": "Alarm",
      "summary": "The alarm score starts at 0. After any action where something below happens, roll 2D6 and add the score. 9 or less: add 1 to the score. 10 or more: the alarm is raised.",
      "detail": [
       "Someone Fights or Shoots.",
       "An NPO takes damage.",
       "One of your operatives does Deploy Search Drone.",
       "One of your operatives moves or is set up within control range of a Tyranid Infestation piece."
      ]
     },
     {
      "name": "Alarm raised",
      "summary": "All NPOs wake up and D3+3 more arrive.",
      "detail": [
       "Set up D3+3 NPOs, ready with Conceal. The first four go next to a different brood nest or underbrood mound each, the rest next to random ones.",
       "In each Ready step after that, roll a D6 for each brood nest and underbrood mound: on 4+ set up one NPO next to it."
      ]
     },
     {
      "name": "Brood nests and mounds",
      "summary": "Brood nests (Q) and underbrood mounds (R) count as objective markers."
     }
    ],
    "actions": [
     {
      "name": "Deploy Search Drone",
      "summary": "Send a search drone down a brood nest (Q) or underbrood mound (R) you control.",
      "detail": "Not in the first turning point, not within an enemy's control range, and not where a drone has already gone.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "You win when every brood nest and underbrood mound has a search drone.",
     "You lose after three full turning points have passed since the alarm went up (the one it went up in doesn't count), or if all your operatives are incapacitated."
    ],
    "nextWin": 2,
    "nextLose": 3
   },
   {
    "num": 2,
    "name": "Purge Gestation Sites",
    "mode": "Co-op",
    "summary": "Destroy both gestation sacs before they hatch an army.",
    "maps": [
     "typhon-p14"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. As an NPO gambit in each Strategy phase, set up D3+1 ready NPOs with Conceal as close as possible to each gestation sac (S) (roll for each)."
     },
     {
      "name": "Destroy Gestation Sac",
      "summary": "Each gestation sac (S) has 20 wounds, Save 5+, and is removed at 0. Barbgaunt Blast can't damage them.",
      "detail": [
       "Shooting: you can target a sac if it's visible, including as a Blast or Torrent secondary target. It can be obscured (treat the whole thing as its base) but never in cover. Your weapons hit it on 2+ (before other changes like injured). It rolls one extra defense die.",
       "Fighting: you can fight a sac within control range. It doesn't strike back. Your weapons hit it on 2+."
      ]
     },
     {
      "name": "Aggression Instincts",
      "summary": "Once a sac has lost wounds or been destroyed, the NPOs draw an extra event card in each Strategy phase where they have initiative. Once one sac is destroyed, roll two D3 and use the higher for NPOs arriving at the other."
     }
    ],
    "actions": [],
    "victory": [
     "You win when both gestation sacs are destroyed.",
     "You lose if all your operatives are incapacitated."
    ],
    "nextWin": 4,
    "nextLose": 5
   },
   {
    "num": 3,
    "name": "Swarm Response",
    "mode": "Co-op",
    "summary": "The swarm is awake. Get at least half your team out alive.",
    "maps": [
     "typhon-p16"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. As an NPO gambit in each Strategy phase, roll four D6 in order and set them aside. These are the reinforcement dice."
     },
     {
      "name": "NPO reinforcements",
      "summary": "When it's the NPOs' turn and none are ready, use up the next reinforcement die: set up one NPO within its Move of the numbered point on the killzone edge matching the roll.",
      "detail": [
       "Activate it as if it has already Repositioned. It can still Fight or Shoot if able, with Engage if it can, otherwise Conceal.",
       "The Firefight phase can't end while reinforcement dice are left, unless the NPO limit is reached (then discard them)."
      ]
     },
     {
      "name": "Escape",
      "summary": "Your operatives can move off the NPO killzone edge. Any operative whose base crosses it has escaped."
     }
    ],
    "actions": [],
    "victory": [
     "When all your operatives have left the killzone, the battle ends.",
     "You win if half or more of them escaped."
    ],
    "nextWin": 5,
    "nextLose": 6
   },
   {
    "num": 4,
    "name": "Pierce the Node Core",
    "mode": "Co-op",
    "summary": "Plant targeters on the brood nests and mounds so orbital fire can collapse the tunnels.",
    "maps": [
     "typhon-p18"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Before the battle, set up D3 NPOs behind (on the NPO side of) each stronghold (A, B) and brood nest (Q). In each Strategy phase after the first, as an NPO gambit, set up one NPO next to each brood nest (Q) and underbrood mound (R)."
     },
     {
      "name": "Targets",
      "summary": "Brood nests (Q) and underbrood mounds (R) count as objective markers. Each has 10 wounds and is removed at 0. Only guided ordnance can damage them."
     },
     {
      "name": "Guided Ordnance",
      "summary": "In each Ready step, deal 2D6 damage to each brood nest or mound with a targeter, and 2D6 damage to every operative within 2\" of it (roll for each)."
     },
     {
      "name": "Disturbed Node Core",
      "summary": "For each brood nest or mound destroyed, one extra NPO arrives at each remaining one when the NPO gambit is used."
     }
    ],
    "actions": [
     {
      "name": "Plant Targeter",
      "summary": "Plant a targeter on a brood nest (Q) or underbrood mound (R) you control.",
      "detail": "Not in the first turning point, not within an enemy's control range, and not where a targeter is already planted.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "You win when every brood nest and underbrood mound is destroyed.",
     "You lose if all your operatives are incapacitated."
    ],
    "nextWin": "End of campaign",
    "nextLose": "End of campaign"
   },
   {
    "num": 5,
    "name": "Desperate Sacrifice",
    "mode": "Co-op",
    "summary": "Carry a bomb down into the node core. Whoever goes down doesn't come back.",
    "maps": [
     "typhon-p20"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. As an NPO gambit in each Strategy phase, set up D3+1 ready NPOs with Conceal as close as possible to the brood nest (Q)."
     },
     {
      "name": "Bomb",
      "summary": "Before the battle, pick one operative to carry your Bomb marker. Your operatives can pick it up with Pick Up Marker.",
      "detail": "The carrier's weapons get -1 to Hit (worse), it can't Charge or Dash, and it can't be removed and set up more than 6\" away."
     },
     {
      "name": "Brood nest",
      "summary": "The brood nest (Q) counts as an objective marker."
     }
    ],
    "actions": [
     {
      "name": "Prime Bomb and Descend",
      "summary": "If this operative carries the Bomb, controls the brood nest and no NPO contests it, remove the operative: it goes down to detonate the bomb.",
      "detail": "Not in the first turning point, or within an enemy's control range.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "You win as soon as your operative descends with the bomb.",
     "You lose if all your operatives are incapacitated."
    ],
    "nextWin": "End of campaign",
    "nextLose": "End of campaign"
   },
   {
    "num": 6,
    "name": "Encircling Predators",
    "mode": "Co-op",
    "summary": "Trapped and surrounded. Survive four turning points of reinforcements, then wipe out what's left.",
    "maps": [
     "typhon-p22"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. As an NPO gambit in the first four Strategy phases, roll six D6 in order and set them aside as reinforcement dice."
     },
     {
      "name": "NPO reinforcements",
      "summary": "When it's the NPOs' turn and none are ready, use up the next reinforcement die: set up one NPO with Conceal within its Move of the numbered point on the killzone edge matching the roll.",
      "detail": [
       "It's ready if one of your operatives is in the NPO territory nearest to it (top or bottom), otherwise expended.",
       "The Firefight phase can't end while reinforcement dice are left, unless the NPO limit is reached (then discard them)."
      ]
     },
     {
      "name": "The Swarm Awoken",
      "summary": "After the first turning point, the NPOs draw an extra event card whenever they have initiative."
     }
    ],
    "actions": [],
    "victory": [
     "From the fifth turning point on, you win when every NPO is incapacitated (no more arrive after the fourth Strategy phase).",
     "You lose if all your operatives are incapacitated."
    ],
    "nextWin": "End of campaign",
    "nextLose": "End of campaign",
    "tps": 6
   },
   {
    "num": "AO",
    "name": "Adversary Ops",
    "mode": "Head-to-head",
    "summary": "Play a normal head-to-head mission with three objective markers (Preliminary Ops or Approved Ops) while Tyranid NPOs guard the objectives and attack both sides.",
    "maps": [
     "typhon-p25",
     "typhon-p26",
     "typhon-p27",
     "typhon-p28",
     "typhon-p29",
     "typhon-p30"
    ],
    "rules": [
     {
      "name": "Use with",
      "summary": "Play alongside a mission pack with three objective markers. Use as much as you like: you can skip tac ops or the primary op if it's too much."
     },
     {
      "name": "Setting up NPOs",
      "summary": "After placing objective markers, players take turns setting up three NPOs with Conceal, starting with the player who lost the initiative roll-off.",
      "detail": "Each player's first NPO goes within control range of the objective in their opponent's territory. The last one goes on the centreline objective."
     },
     {
      "name": "Strategy phase",
      "summary": "NPOs get no CP but go first in the gambit order.",
      "detail": [
       "After the first turning point, the player who lost the initiative roll-off sets up one ready, awake NPO with Conceal at a random objective (or where it started, if it's being carried).",
       "Then draw a random Typhon event card. NPOs then pass."
      ]
     },
     {
      "name": "Dormant NPOs",
      "summary": "NPOs start dormant: expended, and they can't be readied.",
      "detail": "An NPO wakes up if it takes damage, is shot at, or a player's operative is visible to it and within 5\" of the objective it started at. It's readied straight away."
     },
     {
      "name": "NPO activation",
      "summary": "After both players have activated, before the first player goes again, one ready awake NPO activates. If several are ready, roll off and the winner picks.",
      "detail": "NPOs don't counteract. The turning point ends when every operative and NPO is expended."
     },
     {
      "name": "Who controls an NPO",
      "summary": "The NPO targets the closest visible player operative it could fight, shoot or move towards (roll off if tied). The other player runs the NPO for that activation and must use it against that target.",
      "detail": "For event card choices, roll off and the winner decides. With several choices, take turns starting with the winner."
     },
     {
      "name": "VP",
      "summary": "NPOs don't count for VP. You score nothing for killing them, and your opponent scores nothing when an NPO kills your operative (this includes kill grade)."
     }
    ],
    "actions": [],
    "victory": []
   }
  ]
 },
 {
  "id": "tombworld",
  "name": "Tomb World",
  "kind": "Joint Ops + Adversary Ops",
  "modes": [
   "Co-op / solo",
   "Head-to-head"
  ],
  "killzone": "Tomb World",
  "kz": "tomb_world",
  "summary": "Sneak through a Necron tomb. Every shot and fight raises the threat level, which brings more guardians and nastier event cards. Also has head-to-head rules where Necrons guard the rooms.",
  "source": "Tomb World Mission Pack",
  "keyMaps": [],
  "maps": [
   "tombworld-p17",
   "tombworld-p18",
   "tombworld-p19"
  ],
  "mapsNote": "Six maps, usable with any Joint Ops mission (roll a D6 or pick one). Maps 4-6 are Joint Ops only. Adversary Ops uses maps 1-3. You are Player A, the NPOs are Player B.",
  "rules": [
   {
    "name": "Your kill team",
    "summary": "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    "detail": [
     "Co-op players count as one player: you share CP and equipment.",
     "If you mix two teams, one team's rules may not affect the other's operatives.",
     "One player can act as game master and run the NPOs instead of playing."
    ]
   },
   {
    "name": "Killzone",
    "summary": "Uses Killzone: Tomb World (see the Killzone Tomb World pack in this tab). Don't set up objective markers unless you're playing mission 3."
   },
   {
    "name": "Game sequence",
    "summary": "Pick a mission and a map, set up the killzone, pick operatives, then set up.",
    "steps": [
     "Pick a mission and one of the six maps (roll a D6 for each, or choose). You are Player A, the NPOs are Player B.",
     "Pick your operatives. Take up to four equipment options between you and start with 2CP between you. NPOs get no equipment.",
     "Set up your equipment, then the NPOs as the mission says (not in mission 5), rolling 2D6 on the NPO table for each. Then set up your operatives wholly within Player A's drop zone with Conceal orders.",
     "You have initiative in the first turning point. After that, roll one die for the NPOs and one for you. If the NPOs win, they always take initiative."
    ]
   },
   {
    "name": "Threat level",
    "summary": "Starts at 0, max 15. The higher it goes, the more the tomb reacts.",
    "detail": [
     "+1 when one of your operatives Shoots (unless the weapon is Silent).",
     "+1 when one of your operatives Fights (unless it kills the NPO and no other enemy can see it).",
     "+1 when one of your operatives damages an NPO any other way.",
     "+1 when an NPO Shoots or Fights.",
     "Operate Hatch: roll a D6, +1 on 4+. Breach: +1, then roll a D6 for another +1 on 4+.",
     "Grade: 0 is grade 0, 1-5 is grade 1, 6-10 is grade 2, 11-15 is grade 3."
    ]
   },
   {
    "name": "Dormant NPOs",
    "summary": "While the threat level is 0, you get initiative automatically and all NPOs are dormant (expended, can't be readied). Once it rises, they're all readied."
   },
   {
    "name": "Event cards",
    "summary": "From the second turning point on, as an NPO gambit, draw a random Tomb World event card if the threat level is grade 3. Draw two if the NPOs don't have initiative or the threat level is 15.",
    "detail": "Shuffle used cards back into the deck in each Ready step."
   },
   {
    "name": "NPO reinforcements",
    "summary": "From the second turning point on, after event cards, set up a number of NPOs equal to the threat grade.",
    "detail": [
     "Roll 2D6 on the NPO table for each one's type.",
     "Roll a D6 to pick one of the six hatchways (open or closed). Set it up with Conceal, with that hatchway's access point in its control range (or as close as possible).",
     "Prefer spots outside your operatives' control range, so it can shoot.",
     "No more than 10 NPOs on the table at once."
    ]
   },
   {
    "name": "NPO table (2D6)",
    "summary": "Roll for each NPO you set up. If you don't have the model, use the next row.",
    "detail": [
     "2-3: Canoptek Scarab Swarm",
     "4-6: Canoptek Macrocyte (one ranged weapon)",
     "7-10: Necron Warrior (one ranged weapon)",
     "11: Canoptek Tomb Crawler with twin gauss reapers",
     "12: Canoptek Tomb Crawler with transdimensional isolator"
    ]
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   },
   {
    "name": "Threat principle",
    "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    "detail": [
     "Which NPO activates: the one that can Shoot or Fight and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
     "Where to set it up: where it's most likely to stop you winning, then where it can best Charge, Shoot or Fight, then where it isn't a valid target.",
     "Who it fights: the operative it's most likely to incapacitate, then the one most likely to help you win, then a ready one.",
     "Who it shoots: the operative it's most likely to incapacitate, then one not obscured, not in cover, closest, then ready."
    ]
   },
   {
    "name": "Difficulty",
    "summary": "Set up one more (or one fewer) NPO at the start and with each reinforcement. Roll an extra die on the NPO table and keep the two worse (or better). Change how many event cards are drawn."
   }
  ],
  "decks": [
   {
    "name": "Tomb World event cards",
    "note": "Draw as an NPO gambit at threat grade 3. Shuffle used cards back in each Ready step.",
    "cards": [
     {
      "name": "Awakened Warrior",
      "effect": "Set up a ready Necron Warrior with Conceal next to a terrain piece with a Necron Warrior sculpted on it. If you can't, draw a different card."
     },
     {
      "name": "Awakened Warrior",
      "effect": "Set up a ready Necron Warrior with Conceal next to a terrain piece with a Necron Warrior sculpted on it. If you can't, draw a different card."
     },
     {
      "name": "Dark of the Tomb",
      "effect": "When a player operative shoots at something more than 8\" away, its attack dice can't be re-rolled."
     },
     {
      "name": "The Maze Reforms",
      "effect": "One random open breach point and D3 random open hatchways close. If none can, draw a different card."
     },
     {
      "name": "My Will Be Done",
      "effect": "NPOs in the same room as the sarcophagus (C1) have Accurate 1."
     },
     {
      "name": "Reanimation Protocols",
      "effect": "This turning point, the first time each NPO would be incapacitated, roll a D6: on 4+ it stays with 1 wound, can't be incapacitated for the rest of that action, all remaining attack dice are discarded, it's expended if it was ready, and it gets -1 APL until the end of its next activation."
     },
     {
      "name": "A Chittering Drone",
      "effect": "If no Scarab Swarm is out, set one up ready with Conceal at a random hatchway in NPO territory (co-op) or at a random objective (head-to-head), near a player operative if possible. If a wounded one is out, it heals fully. If neither, draw a different card."
     },
     {
      "name": "Living Metal Flux",
      "effect": "Every NPO heals up to D3+2 wounds (roll for each). If none can, draw a different card."
     },
     {
      "name": "Stirrings of Horror",
      "effect": "Threat level +1. If it's already 15, or in head-to-head, set up one extra NPO reinforcement instead."
     },
     {
      "name": "Countertemporal Shifting",
      "effect": "When an attack die deals 3+ damage to an NPO, roll a D6: on 5+ it deals 1 less."
     },
     {
      "name": "Subjugation Glyphs",
      "effect": "Pick a random player operative and roll a D6. If it beats that operative's APL, it gets -1 APL. If not, pick another and repeat (head-to-head: players take turns)."
     },
     {
      "name": "Transdimensional Relocation",
      "effect": "Pick two random player operatives (one pair per team in head-to-head) and swap their positions. Do it twice more if possible. If a team has only one operative left, draw a different card."
     }
    ]
   }
  ],
  "npos": [
   {
    "name": "Canoptek Scarab Swarm",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Feeder mandibles",
      "type": "melee",
      "atk": 5,
      "hit": "4+",
      "dmg": "1/2",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal. Opens hatches when it needs to.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [],
    "base": "40mm"
   },
   {
    "name": "Necron Warrior",
    "apl": 2,
    "move": "5\"",
    "save": "4+",
    "wounds": 9,
    "weapons": [
     {
      "name": "Gauss flayer",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Piercing 1"
     },
     {
      "name": "Gauss reaper",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "Range 8\", Piercing 1"
     },
     {
      "name": "Combat attachment",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot, and fights if it can't do anything else. Engage if it will Shoot or Fight, otherwise Conceal. Opens hatches when it needs to.",
    "priorities": [
     "Fall Back, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured.",
     "Fight."
    ],
    "rules": [],
    "base": "32mm",
    "note": "Has one ranged weapon: flayer or reaper."
   },
   {
    "name": "Canoptek Tomb Crawler",
    "apl": 2,
    "move": "5\"",
    "save": "3+",
    "wounds": 21,
    "weapons": [
     {
      "name": "Twin gauss reapers (focused)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1, Punishing"
     },
     {
      "name": "Twin gauss reapers (sweeping)",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1, Punishing, Torrent 1\""
     },
     {
      "name": "Transdimensional isolator",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "5/6",
      "wr": "Dimensional Banishment"
     },
     {
      "name": "Claws",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/4",
      "wr": "Brutal"
     }
    ],
    "behaviour": "Fights if it has to, otherwise moves to shoot. Engage if it will Fight or Shoot, otherwise Conceal. Opens hatches when it needs to. Uses the sweeping profile when it can hit more than one player operative.",
    "priorities": [
     "Fight.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [
     {
      "name": "Weapon Sentinel",
      "desc": "When it picks targets, Concealed operatives can't use Light terrain for cover (they keep their cover save)."
     },
     {
      "name": "Steadfast",
      "desc": "Counts as APL 3 for marker control, whatever else changes its APL."
     },
     {
      "name": "Dimensional Banishment",
      "desc": "After using this weapon, if it dealt damage or kept a crit and the target survived, roll 2D6. If that beats the target's remaining wounds, the target is incapacitated."
     }
    ],
    "base": "50mm",
    "note": "Has either twin gauss reapers or a transdimensional isolator."
   },
   {
    "name": "Canoptek Macrocyte",
    "apl": 2,
    "move": "7\"",
    "save": "4+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Gauss scalpel",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Piercing 1"
     },
     {
      "name": "Tesla caster (focused)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     },
     {
      "name": "Tesla caster (living lightning)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "Blast 2\""
     },
     {
      "name": "Claws & tail",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Fights if it has to, otherwise moves to shoot. Engage if it will Fight or Shoot, otherwise Conceal. Opens hatches when it needs to. Uses living lightning when it can hit more than one player operative and no NPOs.",
    "priorities": [
     "Fight.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [
     {
      "name": "Aggressive Defense Construct",
      "desc": "If a player operative within 2\" incapacitates it, roll a D3: on 2+ that operative takes damage equal to the roll."
     }
    ],
    "base": "28mm",
    "note": "Has one ranged weapon: scalpel or tesla caster."
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Shifting Labyrinth",
    "mode": "Co-op",
    "summary": "Find the way out of a maze that keeps moving its exit.",
    "maps": [],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Set up 2D3+3 NPOs with Conceal wholly within Player B's territory, spread out evenly, each with terrain between it and Player A's drop zone."
     },
     {
      "name": "Escape",
      "summary": "Place an Escape marker at the center of Player B's killzone edge. Your operatives can leave over that edge while within 1\" of the marker."
     },
     {
      "name": "Auspex Calibration",
      "summary": "From the second turning point on, as a gambit, if nobody has escaped yet, roll a D3: 1 moves the marker D3+3\" left along the edge, 2 leaves it, 3 moves it D3+3\" right.",
      "detail": "It can go round a corner. If terrain is in the way, keep moving it the same way until it fits."
     }
    ],
    "actions": [],
    "victory": [
     "When all your operatives have left the killzone, the battle ends.",
     "You win if half or more of them escaped."
    ]
   },
   {
    "num": 2,
    "name": "Demolition Protocol",
    "mode": "Co-op",
    "summary": "Blast your way through the tomb's doors.",
    "maps": [],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Set up 2D3+3 NPOs with Conceal wholly within Player B's territory, spread out evenly, each with terrain between it and Player A's drop zone."
     },
     {
      "name": "Sabotage",
      "summary": "Your operatives can Breach a hatchway whose access point is in their control range (even if it's open). It opens and can't be closed again."
     }
    ],
    "actions": [],
    "victory": [
     "You win when at least seven breach points or hatchways are open and you've Breached at least seven of them.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": 3,
    "name": "Recover Transponder",
    "mode": "Co-op",
    "summary": "Find the real transponder among three signals and carry it out.",
    "maps": [],
    "rules": [
     {
      "name": "Objective markers",
      "summary": "Set up three objective markers as the map shows (this is the only mission that uses them)."
     },
     {
      "name": "NPOs",
      "summary": "Set up 2D3+3 NPOs with Conceal wholly within Player B's territory, spread out across the rooms with objective markers, each with terrain between it and Player A's drop zone."
     },
     {
      "name": "Locate Item",
      "summary": "Your operatives can Pick Up any objective marker. If the item hasn't been found yet, roll a D3.",
      "detail": [
       "Higher than the number of other markers left: found. Remove the other markers; this operative carries this one.",
       "Otherwise: not here. Remove this marker (the action still counts)."
      ]
     },
     {
      "name": "Escape",
      "summary": "Your operatives can leave over Player A's killzone edge."
     }
    ],
    "actions": [],
    "victory": [
     "You win when an operative carrying the item escapes.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": 4,
    "name": "Destroy Sarcophagus",
    "mode": "Co-op",
    "summary": "Wreck a damaged stasis-crypt before the scarabs repair it.",
    "maps": [],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Set up D3+6 NPOs with Conceal wholly within Player B's territory: half (round down) in the sarcophagus (C1) room, the rest spread across the other rooms, each with terrain between it and Player A's drop zone."
     },
     {
      "name": "Sarcophagus",
      "summary": "The sarcophagus (C1) counts as an objective marker. Your operatives can Breach it while it's in their control range: instead of the normal effect, it gains 2D6 Destruction points."
     },
     {
      "name": "Nanoscarab Repair",
      "summary": "In each Ready step, roll a D6 and subtract 1 for each of your operatives with the sarcophagus in control range. Remove that many Destruction points."
     }
    ],
    "actions": [],
    "victory": [
     "You win when the sarcophagus has 20+ Destruction points.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": 5,
    "name": "Scout Sub-crypt",
    "mode": "Co-op",
    "summary": "Explore rooms one by one. Each one you open may wake its guardians.",
    "maps": [],
    "rules": [
     {
      "name": "NPOs",
      "summary": "None at the start. The first time each room (outside Player A's drop zone) is opened or entered, set up D3 + threat grade NPOs there (max 5), with Conceal, spread out, more than 2\" from other operatives if possible."
     },
     {
      "name": "Dormant",
      "summary": "Operate Hatch doesn't raise the threat level in this mission."
     }
    ],
    "actions": [
     {
      "name": "Scout Room",
      "summary": "Scout the room this operative is in. Drop the threat level to the top of the grade below.",
      "detail": "Not within an enemy's control range, not at threat level 0, not in a room with NPOs, not in a room already scouted, and not in Player A's drop zone.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "You win when three rooms are scouted.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": 6,
    "name": "Regroup",
    "mode": "Co-op",
    "summary": "Your team is scattered by phasing portals. Fight through and regroup.",
    "maps": [],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Set up 2D3+3 NPOs with Conceal wholly within Player B's territory, spread out evenly, each with terrain between it and Player A's drop zone."
     },
     {
      "name": "Access Denied",
      "summary": "Your operatives must start in Player A's drop zone (no deep strike). Rules that remove and set up again can only put them back in the same room."
     },
     {
      "name": "Phasing Points",
      "summary": "Operatives can't Operate Hatch during a Dash or Reposition.",
      "detail": "When one of your operatives moves through a hatchway's access point, take it off and set it up within its remaining move of a random open hatchway's access point. It can end within enemy control range if there's no other way, and doesn't have to finish a Charge in control range. If there's no room, roll another hatchway."
     }
    ],
    "actions": [],
    "victory": [
     "At the end of any turning point, you win if every operative still on the table is wholly within Player B's drop zone, not within an NPO's control range, and within 3\" of another of your operatives.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": "AO",
    "name": "Adversary Ops",
    "mode": "Head-to-head",
    "summary": "Play a normal head-to-head mission with three objective markers on Tomb World or Gallowdark, while Necrons wake in each room you open.",
    "maps": [],
    "rules": [
     {
      "name": "Use with",
      "summary": "Play alongside a mission pack with three objective markers (Preliminary Ops or Approved Ops). Use maps 1-3 here, or any Tomb World or Gallowdark map. Skip parts you find too much."
     },
     {
      "name": "NPOs in rooms",
      "summary": "The first time each room (outside drop zones) is opened or entered, roll a D3 for how many NPOs and 2D6 on the NPO table for each type.",
      "detail": "Players take turns setting them up in that room, starting with whoever opened it. Each one is ready with Conceal, more than 2\" from other operatives if possible."
     },
     {
      "name": "Strategy phase",
      "summary": "NPOs get no CP. From the second turning point on, they go first in the gambit order with two gambits:",
      "detail": [
       "Shuffle used event cards back, then draw a new one.",
       "The player who lost the initiative roll-off sets up one NPO (2D6 for type), ready with Conceal, at a random hatchway's access point."
      ]
     },
     {
      "name": "NPO activation",
      "summary": "After both players have activated, before the first player goes again, one ready NPO activates. If several are ready, roll off and the winner picks.",
      "detail": "NPOs don't counteract. The turning point ends when every operative and NPO is expended."
     },
     {
      "name": "Who controls an NPO",
      "summary": "The NPO targets the closest player operative it could fight, shoot or move towards (roll off if tied). The other player runs the NPO for that activation and must use it against that target.",
      "detail": "For event card choices, roll off and the winner decides. With several choices, take turns starting with the winner."
     },
     {
      "name": "VP",
      "summary": "NPOs don't count for VP. You score nothing for killing them, and your opponent scores nothing when an NPO kills your operative (this includes kill grade)."
     }
    ],
    "actions": [],
    "victory": []
   }
  ]
 },
 {
  "id": "shadowhunt",
  "name": "Shadowhunt",
  "kind": "Joint Ops + Adversary Ops",
  "modes": [
   "Co-op / solo",
   "Head-to-head"
  ],
  "killzone": "Descent (Volkus above, Tomb World below)",
  "kz": "open",
  "summary": "Fight across two boards stacked as one: a Volkus surface and a Necron tomb below, linked by entryways. Three co-op missions and three head-to-head ones, ending with a C'tan Shard waking up.",
  "source": "Joint Ops: Shadowhunt Mission Pack",
  "keyMaps": [
   "shadowhunt-p04",
   "shadowhunt-p05"
  ],
  "rules": [
   {
    "name": "Descent killzone",
    "summary": "Two half-size boards: the upper one is Volkus, the lower one is Tomb World. Entryway markers link them.",
    "detail": "Use a 607mm x 414mm board for the close quarters one and 559mm x 381mm for the other. Any Tomb World or Gallowdark board works if you use a 6 x 4 square area. You can fold a 30\" x 22\" board in half for the upper one."
   },
   {
    "name": "Climbing entryways",
    "summary": "An operative with an Entryway marker in its control range can climb it for 3\" of movement: set it up next to the same-numbered marker on the other board.",
    "detail": "It can't end within enemy control range unless the action allows it (like Charge). It can keep moving if it has distance left. For distance rules, climbing counts as 3\"."
   },
   {
    "name": "Shooting through entryways",
    "summary": "Instead of a normal target, an operative with an Entryway marker in its control range can shoot an enemy that has the matching marker on the other board in its control range.",
    "detail": "Ignore Range. That target can't be in cover or obscured. You still can't target an enemy with your own operatives in its control range. If the target is in a close quarters killzone, Condensed Environment applies."
   },
   {
    "name": "Teleporting and deep strike",
    "summary": "Rules that remove and set up an operative again (FLY, Shadow Passage, etc.) can't move it to the other board. Drop and Tunnel markers must go on one board.",
    "detail": "Canoptek Circle obelisk nodes only link with nodes on the same board. An operative on guard that teleports to the other board is no longer on guard."
   },
   {
    "name": "NPO groups",
    "summary": "Gather NPO models and sort them into three groups by strength. To set up an NPO, roll 2D6 to pick the group (if it's empty, use the next one).",
    "detail": [
     "2-5: Scarab Swarm, or any Trooper.",
     "6-8: Macrocyte or Necron Warrior, or any Tough or Warrior.",
     "9-12: Tomb Crawler, or any Heavy.",
     "No more than 10 NPOs on the table at once."
    ]
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   },
   {
    "name": "NPOs on two boards",
    "summary": "NPOs open hatches when they need to, can use entryways and teleport pads, and move to cover when they can (often not possible below if they want to Charge or Shoot)."
   },
   {
    "name": "Your kill team",
    "summary": "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    "detail": [
     "Co-op players count as one player: you share CP and equipment.",
     "If you mix two teams, one team's rules may not affect the other's operatives.",
     "One player can act as game master and run the NPOs instead of playing."
    ]
   },
   {
    "name": "Co-op game sequence",
    "summary": "Pick the mission, set up both boards, sort your NPO groups, pick operatives, then set up.",
    "steps": [
     "Pick the mission (roll a D3, choose, or play 1-3 in order; mission 3 is hard). 'The killzone' means both boards.",
     "Sort your NPO models into three groups. Pick your operatives. Take up to four equipment options between you and start with 2CP between you.",
     "Set up your equipment, then the NPOs as the mission says, then your operatives wholly within your drop zone with Conceal orders.",
     "You have initiative in the first turning point. After that, roll one die for the NPOs and one for you. If the NPOs win, they always take initiative. NPOs get no CP."
    ]
   },
   {
    "name": "Co-op threat principle",
    "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    "detail": [
     "Which NPO activates: the one that can Shoot or Fight and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
     "Where to set it up: where it's most likely to stop you winning, then where it can best Charge, Shoot or Fight, then where it isn't a valid target.",
     "Who it fights: the operative it's most likely to incapacitate, then a ready one.",
     "Who it shoots: the operative it's most likely to incapacitate, then one not obscured, not in cover, closest, then ready."
    ]
   },
   {
    "name": "Head-to-head game sequence",
    "summary": "Normal setup, with NPO groups and the mission's deployment rules.",
    "steps": [
     "Each player picks a kill team. Pick the mission and set up both boards. Roll off for initiative, set up objectives, then pick drop zones starting with the player with initiative.",
     "Sort NPO models into three groups. Pick operatives and up to four equipment options in secret, then reveal. Each player gains 2CP.",
     "Take turns setting up equipment item by item (in the lower board, only wholly within a room with your drop zone). Then take turns setting up a third of your team at a time, with Conceal.",
     "Roll off for initiative in the first turning point (on a tie, the player who didn't have it at setup decides).",
     "Most VP wins, except in mission 3. If one player has no operatives left, the other plays out the remaining turning points."
    ]
   },
   {
    "name": "Head-to-head NPOs",
    "summary": "When a mission sets up NPOs, roll off and take turns, starting with the winner, rolling 2D6 for each one's group.",
    "detail": [
     "After both players have activated, one NPO activates. If several ready NPOs could go, roll off and the winner picks.",
     "The NPO targets the closest visible player operative it could fight, shoot or move towards (closest of all if none are visible; climbing an entryway counts as 3\"). Roll off if tied.",
     "The other player runs the NPO for that activation and must use it against that target. It can use entryways to get there.",
     "NPOs don't counteract."
    ]
   },
   {
    "name": "Difficulty",
    "summary": "Set up one more (or one fewer) NPO each time, or change how many strong NPOs are in each group."
   }
  ],
  "npos": [
   {
    "name": "Canoptek Scarab Swarm",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Feeder mandibles",
      "type": "melee",
      "atk": 5,
      "hit": "4+",
      "dmg": "1/2",
      "wr": "-"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal. Opens hatches when it needs to.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [],
    "base": "40mm"
   },
   {
    "name": "Necron Warrior",
    "apl": 2,
    "move": "5\"",
    "save": "4+",
    "wounds": 9,
    "weapons": [
     {
      "name": "Gauss flayer",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Piercing 1"
     },
     {
      "name": "Gauss reaper",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "Range 8\", Piercing 1"
     },
     {
      "name": "Combat attachment",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot, and fights if it can't do anything else. Engage if it will Shoot or Fight, otherwise Conceal. Opens hatches when it needs to.",
    "priorities": [
     "Fall Back, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured.",
     "Fight."
    ],
    "rules": [],
    "base": "32mm",
    "note": "Has one ranged weapon: flayer or reaper."
   },
   {
    "name": "Canoptek Tomb Crawler",
    "apl": 2,
    "move": "5\"",
    "save": "3+",
    "wounds": 21,
    "weapons": [
     {
      "name": "Twin gauss reapers (focused)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1, Punishing"
     },
     {
      "name": "Twin gauss reapers (sweeping)",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1, Punishing, Torrent 1\""
     },
     {
      "name": "Transdimensional isolator",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "5/6",
      "wr": "Dimensional Banishment"
     },
     {
      "name": "Claws",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/4",
      "wr": "Brutal"
     }
    ],
    "behaviour": "Fights if it has to, otherwise moves to shoot. Engage if it will Fight or Shoot, otherwise Conceal. Opens hatches when it needs to. Uses the sweeping profile when it can hit more than one player operative.",
    "priorities": [
     "Fight.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [
     {
      "name": "Weapon Sentinel",
      "desc": "When it picks targets, Concealed operatives can't use Light terrain for cover (they keep their cover save)."
     },
     {
      "name": "Steadfast",
      "desc": "Counts as APL 3 for marker control, whatever else changes its APL."
     },
     {
      "name": "Dimensional Banishment",
      "desc": "After using this weapon, if it dealt damage or kept a crit and the target survived, roll 2D6. If that beats the target's remaining wounds, the target is incapacitated."
     }
    ],
    "base": "50mm",
    "note": "Has either twin gauss reapers or a transdimensional isolator."
   },
   {
    "name": "Canoptek Macrocyte",
    "apl": 2,
    "move": "7\"",
    "save": "4+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Gauss scalpel",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Piercing 1"
     },
     {
      "name": "Tesla caster (focused)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     },
     {
      "name": "Tesla caster (living lightning)",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "Blast 2\""
     },
     {
      "name": "Claws & tail",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Fights if it has to, otherwise moves to shoot. Engage if it will Fight or Shoot, otherwise Conceal. Opens hatches when it needs to. Uses living lightning when it can hit more than one player operative and no NPOs.",
    "priorities": [
     "Fight.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [
     {
      "name": "Aggressive Defense Construct",
      "desc": "If a player operative within 2\" incapacitates it, roll a D3: on 2+ that operative takes damage equal to the roll."
     }
    ],
    "base": "28mm",
    "note": "Has one ranged weapon: scalpel or tesla caster."
   },
   {
    "name": "Trooper (Brawler)",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [],
    "note": "Generic NPO for any models (group 2-5)."
   },
   {
    "name": "Trooper (Marksman)",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     },
     {
      "name": "Special weapon",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot, and fights if it can't do anything else. Engage if it will Shoot or Fight, otherwise Conceal.",
    "priorities": [
     "Fall Back, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured.",
     "Fight."
    ],
    "rules": [],
    "note": "Generic NPO (group 2-5). Only 1 in 3 can have the special weapon."
   },
   {
    "name": "Tough (Brawler)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [],
    "note": "Generic NPO (group 6-8)."
   },
   {
    "name": "Warrior (Marksman)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 8,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot, and fights if it can't do anything else. Engage if it will Shoot or Fight, otherwise Conceal.",
    "priorities": [
     "Fall Back, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured.",
     "Fight."
    ],
    "rules": [],
    "note": "Generic NPO (group 6-8)."
   },
   {
    "name": "Heavy (Marksman)",
    "apl": 3,
    "move": "6\"",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot, and fights if it can't do anything else. Engage if it will Shoot or Fight, otherwise Conceal.",
    "priorities": [
     "Fall Back, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash, ideally where it has a valid target that isn't obscured.",
     "Fight."
    ],
    "rules": [
     {
      "name": "Double tap",
      "desc": "Can Shoot twice in one activation."
     }
    ],
    "note": "Generic NPO (group 9-12)."
   },
   {
    "name": "Heavy (Brawler)",
    "apl": 3,
    "move": "6\"",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Brawler",
      "desc": "Can Fight twice in one activation."
     }
    ],
    "note": "Generic NPO (group 9-12)."
   },
   {
    "name": "C'tan Shard of the Nightbringer",
    "apl": 2,
    "move": "5\"",
    "save": "4+",
    "wounds": 25,
    "weapons": [
     {
      "name": "Gaze of death",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "5/0",
      "wr": "Range 6\", Devastating 5, Severe"
     },
     {
      "name": "Scythe of the Nightbringer",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "5/6",
      "wr": "Lethal 5+, Rending"
     }
    ],
    "behaviour": "Goes after your operatives to fight, and shoots if it can't.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Shoot.",
     "Reposition towards the closest player operative."
    ],
    "rules": [
     {
      "name": "Mighty Foe",
      "desc": "Never has a Conceal order, is never in cover or obscured, and is never readied or expended. When it's the NPOs' turn, roll a D6: on 4+ it activates (skip if it's not on the table), on 1-3 another ready NPO does. It can Fight twice per activation but can't move more than 12\" per turning point."
     },
     {
      "name": "Necrodermis",
      "desc": "It can't be injured and its stats can't change. Piercing against it is 1 lower (so Piercing 1 does nothing)."
     },
     {
      "name": "Indomitable Reanimation",
      "desc": "When incapacitated, mark its spot with a Reanimation marker and remove it (clearing tokens). In the next Ready step, roll D3+1. After that many activations it returns there with Engage and full wounds, pushing other operatives aside."
     },
     {
      "name": "Domineering Presence",
      "desc": "It moves through terrain (even walls) and operatives, but must end where it can be placed. Light terrain it moves through is removed unless attached to Heavy terrain. Operatives under it are moved next to it. An operative on Vantage within 2\" horizontally is in its control range."
     }
    ],
    "note": "Only in co-op mission 3 and head-to-head mission 3."
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Find the Source",
    "mode": "Co-op",
    "summary": "Trace an energy signal down into the tomb and scan the sarcophagus that holds it.",
    "maps": [
     "shadowhunt-p15"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "NPOs with a combined Wounds of up to 110, set up with Conceal wholly within the NPO territories, in cover, split evenly between the two killzones."
     },
     {
      "name": "Locate Signature",
      "summary": "Until the sarcophagus (C1) appears, the first time one of your operatives enters each lower room with an objective marker, roll a D3 (+1 for each room already searched). On 4+, set up the sarcophagus on that marker, facing as the map shows. The last such room always finds it."
     },
     {
      "name": "NPO reinforcements",
      "summary": "From the second turning point on, as an NPO gambit, set up D3+1 NPOs, ready with Conceal, in the lower killzone, each at a random hatchway's access point (three hatchways: roll a D3)."
     }
    ],
    "actions": [],
    "victory": [
     "When one of your operatives ends an activation with the sarcophagus in its control range, it's scanned. You win after three scans.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": 2,
    "name": "The Sarcophagus",
    "mode": "Co-op",
    "summary": "Bring extraction gear down from the surface and crack the sarcophagus open.",
    "maps": [
     "shadowhunt-p17"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "NPOs with a combined Wounds of up to 110, set up with Conceal wholly within the NPO territories, in cover, split evenly between the two killzones."
     },
     {
      "name": "Split Mission",
      "summary": "Set up half your operatives in your drop zone on the lower board, and the rest on the Vantage terrain of Stronghold B on the upper board."
     },
     {
      "name": "Extraction",
      "summary": "Pick one operative on the upper board to carry your Extraction marker. Your operatives can pick it up.",
      "detail": "The carrier can't Charge or Dash, and can't be removed and set up more than 6\" away."
     },
     {
      "name": "NPO reinforcements",
      "summary": "From the second turning point on, as an NPO gambit, set up D3+1 NPOs, ready with Conceal, in the lower killzone, each at a random hatchway's access point (four hatchways: roll a D6, re-roll 5-6)."
     },
     {
      "name": "Core Extraction",
      "summary": "The sarcophagus (C1) counts as an objective marker and starts with 2 Integrity points."
     }
    ],
    "actions": [
     {
      "name": "Extract Core",
      "summary": "If this operative carries the Extraction marker, controls the sarcophagus and no NPO contests it, remove one Integrity point.",
      "detail": "Not in the first turning point, not within an enemy's control range, and only once per turning point for your whole team.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "You win when the sarcophagus has no Integrity points left.",
     "You lose if all your operatives are incapacitated."
    ]
   },
   {
    "num": 3,
    "name": "Rising Doom",
    "mode": "Co-op",
    "summary": "You freed a C'tan Shard. Now run for the surface before it kills you all.",
    "maps": [
     "shadowhunt-p19"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "NPOs with a combined Wounds of up to 90, set up with Conceal wholly within the NPO territories, in cover, split evenly between the two killzones. At the end of the first turning point, remove the sarcophagus and place the C'tan Shard of the Nightbringer in the center of that room."
     },
     {
      "name": "Escape",
      "summary": "When one of your operatives ends its activation on the Vantage terrain of Stronghold B and not within an enemy's control range, you can remove it: it has escaped."
     }
    ],
    "actions": [],
    "victory": [
     "When all your operatives have left the killzone, the battle ends.",
     "You win if at least a third of them (round up) escaped."
    ]
   },
   {
    "num": 4,
    "name": "Into the Depths",
    "mode": "Head-to-head",
    "summary": "Two teams fight over a dig site and break into a Necron tomb below.",
    "maps": [
     "shadowhunt-p23"
    ],
    "rules": [
     {
      "name": "Restricted Deployment",
      "summary": "Nothing can be set up on the lower board before the battle: no operatives, equipment or markers."
     },
     {
      "name": "NPOs",
      "summary": "The first time a player's operative opens or enters each lower room, their opponent sets up one NPO wholly within it, more than 2\" from other operatives if possible."
     }
    ],
    "actions": [
     {
      "name": "Secure",
      "summary": "Secure an objective marker you control. It stays yours until your opponent secures it.",
      "detail": "Not in the first turning point, or within an enemy's control range.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "Score 1VP for each objective your team has secured.",
     "Score 1VP for each objective your operatives control.",
     "At the end of any turning point from the fourth on, a player who has scored VP can end the battle. It also ends if every player operative is incapacitated."
    ],
    "scoring": [
     {
      "key": "secured",
      "text": "Each objective marker your team has secured",
      "vp": 1,
      "when": "tp",
      "side": "both"
     },
     {
      "key": "control",
      "text": "Each objective marker your operatives control",
      "vp": 1,
      "when": "tp",
      "side": "both"
     }
    ],
    "scoringNote": "The pack doesn't say when these score. Agree it with your opponent before you start."
   },
   {
    "num": 5,
    "name": "Unlock the Vault",
    "mode": "Head-to-head",
    "summary": "Break into the vault at the heart of the tomb while holding the routes down to it.",
    "maps": [
     "shadowhunt-p25"
    ],
    "rules": [
     {
      "name": "Restricted Deployment",
      "summary": "A third of each team must start on the lower board, the rest on the upper board."
     },
     {
      "name": "NPOs",
      "summary": "After equipment, before operatives, players take turns setting up two NPOs each on the lower board (starting with initiative), more than 8\" from drop zones and 4\" from each other if possible.",
      "detail": "In each Ready step, if there are no NPOs on the lower board, the player without initiative sets one up, ready with Conceal, within 3\" of the right-hand top or bottom corner of the lower board."
     },
     {
      "name": "Locked Vault",
      "summary": "The objective marker starts locked. At the end of any turning point from the fourth on, if it's unlocked and a player's operatives control it, that player can end the battle."
     }
    ],
    "actions": [
     {
      "name": "Unlock Vault",
      "summary": "Roll a D3 and add the turning point number. 6+: a locked objective you control is unlocked. 5 or less, with fewer than 4 NPOs below: your opponent sets up one ready NPO with Conceal within 3\" of the right-hand top or bottom corner of the lower board.",
      "detail": "Not in the first turning point, or within an enemy's control range.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "Score 1VP if your operative unlocks the objective.",
     "At the end, score 1VP if your operatives control the unlocked objective.",
     "At the end, score 1VP for each Entryway pair you control (your total APL contesting both matching markers is higher)."
    ],
    "scoring": [
     {
      "key": "unlock",
      "text": "Your operative unlocks the objective marker",
      "vp": 1,
      "when": "any",
      "side": "both",
      "most": 1
     },
     {
      "key": "vault",
      "text": "Your operatives control the unlocked objective marker",
      "vp": 1,
      "when": "end",
      "side": "both",
      "most": 1
     },
     {
      "key": "entry",
      "text": "Each Entryway pair your operatives control",
      "vp": 1,
      "when": "end",
      "side": "both"
     }
    ]
   },
   {
    "num": 6,
    "name": "Awakening",
    "mode": "Head-to-head",
    "summary": "Grab the relic from the open vault and escape before the C'tan Shard catches you.",
    "maps": [
     "shadowhunt-p27"
    ],
    "rules": [
     {
      "name": "Restricted Deployment",
      "summary": "At least a third of each team must start on each board. No equipment or markers in the lower board's central room."
     },
     {
      "name": "NPOs",
      "summary": "No NPOs, apart from the C'tan Shard when it wakes."
     },
     {
      "name": "Breach the Vault",
      "summary": "Entryway markers start unclimbable. Your operatives can Breach an Entryway marker in their control range to make it climbable on both boards."
     },
     {
      "name": "Find the Relic",
      "summary": "Operatives can pick up the objective marker. The carrier's weapons get -1 to Hit (worse), it can't be removed and set up more than 6\" away, and it can escape over either player's killzone edge on the upper board."
     },
     {
      "name": "Awoken Nightmare",
      "summary": "The first time someone picks up the objective, roll 2D3. After that many more activations, set up the C'tan Shard, ready with Engage, on a random teleport pad (T). Any player operatives on that pad are incapacitated and removed."
     }
    ],
    "actions": [],
    "victory": [
     "If your operative escapes carrying the relic, you win.",
     "If every player operative is incapacitated, it's a draw."
    ]
   },
   {
    "num": "MAPS",
    "name": "Descent maps for other missions",
    "mode": "Head-to-head",
    "summary": "Six Descent killzone maps with three objective markers each, for playing Preliminary Ops or Approved Ops on two boards. Follow that mission pack's game sequence and set up the killzone from one of these maps.",
    "maps": [
     "shadowhunt-p29",
     "shadowhunt-p30",
     "shadowhunt-p31",
     "shadowhunt-p32",
     "shadowhunt-p33",
     "shadowhunt-p34"
    ],
    "rules": [],
    "actions": [],
    "victory": []
   }
  ]
 },
 {
  "id": "sniper",
  "name": "Deadly Sniper",
  "kind": "Joint Ops",
  "modes": [
   "Co-op / solo"
  ],
  "killzone": "Volkus",
  "kz": "volkus",
  "summary": "Three linked missions against a garrison with an expert sniper on the top floor. Rescue an officer, flank the position, then storm it.",
  "source": "Joint Ops: Deadly Sniper Mission Pack",
  "keyMaps": [],
  "rules": [
   {
    "name": "Your kill team",
    "summary": "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    "detail": [
     "Co-op players count as one player: you share CP and equipment.",
     "If you mix two teams, one team's rules may not affect the other's operatives.",
     "One player can act as game master and run the NPOs instead of playing."
    ]
   },
   {
    "name": "Missions in order",
    "summary": "Play missions 1-3 in order, win or lose. They're the same area seen from different angles. The sniper is usually out of reach in missions 1 and 2, so you may have to win without fighting it."
   },
   {
    "name": "NPOs",
    "summary": "You don't pick a kill team for the NPOs. Each mission sets a total Wounds budget: fill it with any mix of the generic NPO datacards (or make your own).",
    "detail": [
     "Raise or lower the budget to change the difficulty.",
     "NPOs get no equipment."
    ]
   },
   {
    "name": "Initiative",
    "summary": "Roll one die for the NPOs and one for you. If the NPOs win, they always take initiative."
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   },
   {
    "name": "Threat principle",
    "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    "detail": [
     "Which NPO activates: the one that can Fight or Shoot and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
     "Who it shoots: not obscured, then not in cover, then closest, then wounded, then ready.",
     "Who it fights: the operative it's most likely to incapacitate, then a ready one."
    ]
   }
  ],
  "npos": [
   {
    "name": "Sniper",
    "apl": "-",
    "move": "-",
    "save": "3+",
    "wounds": 12,
    "weapons": [
     {
      "name": "Sniper rifle",
      "type": "ranged",
      "atk": 4,
      "hit": "2+",
      "dmg": "3/3",
      "wr": "Devastating 3, Heavy, Silent"
     },
     {
      "name": "Gun butt",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Never moves, never has an Engage order, and is never readied or activated. When an NPO would activate, if the Sniper has reloaded and has a valid target, it Shoots instead.",
    "priorities": [],
    "rules": [
     {
      "name": "Reload",
      "desc": "It's reloaded in each Ready step. After it Shoots, roll a D6: it reloads after that many of your operatives have activated this turning point."
     },
     {
      "name": "Sniper's Nest",
      "desc": "Its targets can't be obscured. When checking what it can see (not what can see it), you can draw the line from any part of its Vantage terrain or the rampart on it."
     }
    ]
   },
   {
    "name": "Trooper (Brawler)",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": []
   },
   {
    "name": "Trooper (Marksman)",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     },
     {
      "name": "Special weapon",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [],
    "note": "Only 1 in 3 can have the special weapon."
   },
   {
    "name": "Tough (Brawler)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": []
   },
   {
    "name": "Warrior (Marksman)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 8,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured."
    ],
    "rules": []
   },
   {
    "name": "Heavy (Marksman)",
    "apl": 3,
    "move": "6\"",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured."
    ],
    "rules": [
     {
      "name": "Double tap",
      "desc": "Can Shoot twice in one activation."
     }
    ]
   },
   {
    "name": "Heavy (Brawler)",
    "apl": 3,
    "move": "6\"",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Brawler",
      "desc": "Can Fight twice in one activation."
     }
    ]
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Sniper's Alley",
    "mode": "Co-op",
    "summary": "An officer is pinned down by sniper fire. Get to them and carry them out.",
    "maps": [
     "sniper-p05"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "The Sniper goes on the highest Vantage terrain of Stronghold B. Any NPOs with a combined Wounds of up to 90, set up with Conceal wholly within Stronghold B, out of sight of your drop zone or in cover."
     },
     {
      "name": "Rescue",
      "summary": "Your operatives can pick up the objective marker (the officer). The carrier's weapons get -1 to Hit (worse), and it can't be removed and set up again (no FLY)."
     },
     {
      "name": "Escape",
      "summary": "Your operatives can move wholly off your killzone edge. They've escaped."
     },
     {
      "name": "Reinforcements",
      "summary": "In each Strategy phase, if half the NPOs (not counting the Sniper) are incapacitated, they call reinforcements as a gambit: two random incapacitated NPOs (not Heavy), or one incapacitated Heavy. Set them up with Conceal on the floor inside Stronghold B, wholly within 6\" of the NPO killzone edge."
     }
    ],
    "actions": [],
    "victory": [
     "In each Ready step, if any NPOs are within 2\" of the officer: at the end of that turning point, if NPOs are still within 2\" of it and none of your operatives are within 6\", you lose.",
     "When you have no operatives left on the table, you win if one of them escaped carrying the officer. Otherwise you lose."
    ]
   },
   {
    "num": 2,
    "name": "Flank the Sniper",
    "mode": "Co-op",
    "summary": "Sneak or fight your way past the garrison to get round the sniper's side.",
    "maps": [
     "sniper-p06"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "The Sniper goes on the highest Vantage terrain of Stronghold B. Any NPOs with a combined Wounds of up to 90, set up with Conceal wholly within the NPO drop zone, spread evenly across areas 1-4, out of sight of your drop zone or in cover."
     },
     {
      "name": "Reserve",
      "summary": "You can set operatives up in reserve instead. Operatives incapacitated in mission 1 must start in reserve.",
      "detail": "In the first Firefight phase, each reserve operative arrives when activated: set it up within its Move of the left half of your killzone edge. It counts as having Repositioned (spend the AP), then carries on."
     },
     {
      "name": "Escape",
      "summary": "Your operatives can move wholly off the left half of either the NPO or player killzone edge. Which edge they used decides where they start in mission 3."
     },
     {
      "name": "Reinforcements",
      "summary": "In each Strategy phase, if half the NPOs (not counting the Sniper) are incapacitated, they call reinforcements as a gambit: two random incapacitated NPOs (not Heavy), or one incapacitated Heavy. Set them up with Conceal on the floor inside Stronghold B, wholly within 6\" of the NPO killzone edge."
     }
    ],
    "actions": [],
    "victory": [
     "When you have no operatives left on the table, you win if more than half of them escaped over the NPO killzone edge."
    ]
   },
   {
    "num": 3,
    "name": "Sniper Surrounded",
    "mode": "Co-op",
    "summary": "The sniper is cornered in the stronghold. Take it.",
    "maps": [
     "sniper-p07"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "The Sniper goes on the highest Vantage terrain of Stronghold B. Any NPOs with a combined Wounds of up to 90, set up with Conceal wholly within Stronghold B, out of sight of your drop zone or in cover."
     },
     {
      "name": "Flanking Forces",
      "summary": "Operatives that escaped over the NPO edge in mission 2 start in the right-hand player drop zone. Everyone else starts in the left-hand one."
     },
     {
      "name": "Defend the Stronghold",
      "summary": "Add a barricade to the center of Stronghold B. NPOs do whatever best defends the stronghold, and only leave it if that really threatens your operatives."
     },
     {
      "name": "No Escape",
      "summary": "When one of your operatives wholly inside Stronghold B shoots an NPO also wholly inside it, your ranged weapons have Seek Light. That lets you target the Sniper."
     },
     {
      "name": "Reinforcements",
      "summary": "In each Strategy phase after the second, if half the NPOs (not counting the Sniper) are incapacitated, they call reinforcements as a gambit: two random incapacitated NPOs (not Heavy), or one incapacitated Heavy. Set each one up wholly within 4\" of the center of a random NPO killzone edge."
     }
    ],
    "actions": [],
    "victory": [
     "At the end of any turning point from the fourth on, you can end the battle. It also ends if all your operatives are incapacitated.",
     "You win if you control the stronghold: your operatives wholly inside it and on the floor have more total APL than the NPOs there."
    ]
   }
  ]
 },
 {
  "id": "ambull",
  "name": "Ambull",
  "kind": "Nemesis Operatives",
  "modes": [
   "Co-op / solo",
   "Head-to-head"
  ],
  "killzone": "Volkus",
  "kz": "volkus",
  "summary": "A burrowing Ambull and its Borewyrm young break into the fight and attack whoever is closest. One co-op mission and one head-to-head mission.",
  "source": "Ambull: Nemesis Operatives Mission Pack",
  "keyMaps": [
   "ambull-p08",
   "ambull-p09"
  ],
  "rules": [
   {
    "name": "Two missions",
    "summary": "Mission 1 (Joint Ops) is co-op or solo against sentries and the Ambull. Mission 2 (Adversary Ops) is head-to-head, with the Ambull attacking both sides. The Ambull can also be dropped into other missions."
   },
   {
    "name": "Burrowing Emergence",
    "summary": "The Ambull and both Borewyrm Infestations start in reserve, off the table. The Intruder deck decides when they come up."
   },
   {
    "name": "NPO activation deck (cards 1-8)",
    "summary": "When it's the Ambull side's turn and any of them are on the table, draw a card.",
    "detail": [
     "1-4 Borewyrm Activation: activate a ready Borewyrm (or an expended one if none are ready).",
     "5 Rad-Maggot Outbreak: roll a D6 for each other operative on the killzone floor. If it's under that operative's Save, it takes damage equal to half the roll (round up).",
     "6 Energy Pulse: deal D6 damage to each other operative within 6\" of the Ambull (roll for each).",
     "7 Ambull Activation: the Ambull activates with APL 2.",
     "8 Enraged Ambull Activation: the Ambull activates with APL 3 and can Fight twice.",
     "The Ambull activates at most twice per turning point and moves at most 12\" per turning point. Borewyrms can activate many times.",
     "If nothing on the card can happen, skip it. Reshuffle the whole deck in each Ready step, or when it runs out. You can look through the discard pile."
    ]
   },
   {
    "name": "Intruder deck (cards 9-13)",
    "summary": "Draw one at the end of each turning point after the first, and whenever an operative finishes a mission action (not Operate Hatch). Remove it from the game after use.",
    "detail": [
     "9-10: nothing happens.",
     "11-12: set up a Borewyrm, ready with Conceal: next to the operative that did the mission action, or (at the end of a turning point) at a random objective marker, near enemy operatives if possible.",
     "13: set up the Ambull the same way."
    ]
   },
   {
    "name": "Game sequence",
    "summary": "Pick the mission, set up Volkus from the map, pick operatives, then set up.",
    "steps": [
     "Mission 1: one kill team for the player(s). Mission 2: each player brings a team and rolls off for initiative.",
     "Set up the killzone and objective markers from the map (Volkus, or similar terrain). Assign drop zones.",
     "Pick operatives (mission 2: in secret, then reveal). Up to four equipment options (between you in mission 1, each in mission 2). 2CP (shared in mission 1, each in mission 2).",
     "Set up equipment (mission 2: take turns item by item). Set up NPOs: the Ambull and Borewyrms go in reserve; in mission 1 set up the sentries now with Conceal.",
     "Set up operatives wholly within your drop zone with Conceal (mission 2: a third of your team at a time, taking turns)."
    ]
   },
   {
    "name": "Nemesis rules",
    "summary": "Extra Defense: when shot, it rolls one extra defense die unless it's injured. Bulky: it can't be placed on Vantage terrain more than 2\" off the floor (see its card for the rest)."
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   }
  ],
  "npos": [
   {
    "name": "Ambull",
    "apl": "2-3 (from card)",
    "move": "6\"",
    "save": "4+",
    "wounds": 35,
    "weapons": [
     {
      "name": "Enormous claws",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "Brutal, Ceaseless, Rending"
     }
    ],
    "behaviour": "Brawler: moves in to fight, using cover on the way. Always Engage (it's a Nemesis).",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Nemesis",
      "desc": "Extra Defense and Bulky. Counts as APL 4 for marker control."
     },
     {
      "name": "Rad-Maggot Symbiosis",
      "desc": "Each time it activates, it heals wounds equal to its APL + 1. Its APL comes from the activation card."
     }
    ],
    "base": "Small (50mm)"
   },
   {
    "name": "Borewyrm Infestation",
    "apl": 1,
    "move": "4\"",
    "save": "5+",
    "wounds": 5,
    "weapons": [
     {
      "name": "Vicious jaws",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Rending"
     }
    ],
    "behaviour": "Brawler: moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Small",
      "desc": "While it has a Conceal order and is in cover, it can't be a valid target unless the shooter is within 2\", whatever other rules say."
     }
    ],
    "base": "25mm"
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "The Hidden Enemy",
    "mode": "Co-op",
    "summary": "Destroy the enemy's supply caches and escape. An Ambull is hunting below, and it isn't picky about who it eats.",
    "maps": [
     "ambull-p05"
    ],
    "rules": [
     {
      "name": "Three sides",
      "summary": "You face two NPO sides: the Ambull with 2 Borewyrms (in reserve), and the Sentries.",
      "detail": "Sentries: D6+10 points of NPOs, set up with Conceal in alternating NPO drop zones, starting with a random one. Sentry datacards and points come from Kill Team: Nemesis Operatives (not in this PDF)."
     },
     {
      "name": "Player order",
      "summary": "Instead of rolling for initiative, each side rolls a D6 (re-roll ties). Sides activate in that order in the Firefight phase."
     },
     {
      "name": "NPO activation",
      "summary": "The Ambull side uses its activation deck (only if one of them is on the table). Sentries activate using the threat principle. NPOs don't counteract."
     },
     {
      "name": "NPO reinforcements",
      "summary": "From the second turning point on, as a Sentry gambit, add D3 points to the reinforcement pool, then set up reinforcements from it, ready with Conceal, touching the NPO killzone edge."
     },
     {
      "name": "Escape",
      "summary": "Your operatives can move off your own killzone edge. Any operative whose base crosses it has escaped."
     },
     {
      "name": "Threat principle",
      "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
      "detail": [
       "Which NPO activates: the one that can Shoot or Fight and is most dangerous doing so, then one not in cover, then the closest to your operatives.",
       "Where to set it up: where it's most likely to stop you winning, then where it isn't a valid target, then where it can best Charge, Shoot or Fight.",
       "Who it fights: the operative it's most likely to incapacitate, then a ready one.",
       "Who it shoots: the operative it's most likely to incapacitate, then one not obscured, not in cover, closest, then ready."
      ]
     }
    ],
    "actions": [
     {
      "name": "Eliminate Assets",
      "summary": "Remove an objective marker you control. Then draw from the Intruder deck (if any cards are left).",
      "detail": "Not in the first turning point, or within an enemy's control range.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "The battle ends when all your operatives have escaped or been incapacitated.",
     "You score 1VP for each objective removed. The NPOs score 1VP for each one left, and 1VP for each third of your starting operatives incapacitated.",
     "Most VP wins. A tie is a draw."
    ],
    "scoring": [
     {
      "key": "removed",
      "text": "Each objective marker removed from the killzone",
      "vp": 1,
      "when": "end",
      "side": "you"
     },
     {
      "key": "left",
      "text": "Each objective marker still in the killzone",
      "vp": 1,
      "when": "end",
      "side": "opp"
     },
     {
      "key": "thirds",
      "text": "Each third of your starting operatives incapacitated",
      "vp": 1,
      "when": "end",
      "side": "opp",
      "most": 3
     }
    ]
   },
   {
    "num": 2,
    "name": "Decaying Generatorium",
    "mode": "Head-to-head",
    "summary": "Two teams race to drain power cells in a failing generator room while the Ambull that broke it comes back for more.",
    "maps": [
     "ambull-p07"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "The Ambull and 2 Borewyrms are a third side, starting in reserve. After both players have activated, if any are on the table, draw from the Ambull activation deck."
     },
     {
      "name": "Who controls the Ambull",
      "summary": "Its target is the closest visible player operative it could fight or move towards (closest of all if none are visible). Roll off if tied. The other player runs it for that action and must charge or fight that target if it can, otherwise move as Drawn to Energy says."
     },
     {
      "name": "Drawn to Energy",
      "summary": "When the Ambull or a Borewyrm Repositions or Dashes, it moves towards the closest objective marker instead (if it can). It still Fights and Charges first if it can."
     },
     {
      "name": "Sickening Emissions",
      "summary": "Operatives with an objective marker in their control range can't re-roll attack or defense dice."
     }
    ],
    "actions": [
     {
      "name": "Siphon Power",
      "summary": "Siphon an objective marker you control. Then draw from the Intruder deck (if any cards are left).",
      "detail": "Not in the first turning point, not within an enemy's control range, and each marker only once per turning point.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "The battle ends after four turning points. Most VP wins; a tie is a draw.",
     "1VP each time your operative Siphons Power (max 2VP per turning point).",
     "2VP if your operative incapacitates the Ambull.",
     "When a Borewyrm dies, leave a Borewyrm marker. Operatives can pick these up. At the end, score 1VP for each one your operatives carry."
    ],
    "scoring": [
     {
      "key": "siphon",
      "text": "Each Siphon Power action by your operatives",
      "vp": 1,
      "when": "tp",
      "side": "both",
      "most": 2,
      "start": 2
     },
     {
      "key": "ambull",
      "text": "Your operative incapacitates the Ambull",
      "vp": 2,
      "when": "any",
      "side": "both"
     },
     {
      "key": "borewyrm",
      "text": "Each Borewyrm marker your operatives carry",
      "vp": 1,
      "when": "end",
      "side": "both",
      "most": 2
     }
    ]
   }
  ]
 },
 {
  "id": "archivist",
  "name": "The Archivist",
  "kind": "Nemesis Operatives",
  "modes": [
   "Co-op / solo",
   "Head-to-head"
  ],
  "killzone": "Tomb World (mission 1), Volkus (mission 2)",
  "kz": "open",
  "summary": "The Archivist, an alien data trader, helps whoever pays best and betrays everyone else. One co-op mission and one head-to-head bidding war.",
  "source": "The Archivist: Nemesis Operatives Mission Pack",
  "keyMaps": [
   "archivist-p07",
   "archivist-p08"
  ],
  "rules": [
   {
    "name": "Two missions",
    "summary": "Mission 1 (Joint Ops) is co-op or solo: the Archivist starts on your side and turns on you. Mission 2 (Adversary Ops) is head-to-head: both players bid for its help. It can also be used in other missions."
   },
   {
    "name": "As your operative",
    "summary": "The Archivist can be one of your operatives in both missions. It has no faction keyword, so your team's faction rules don't affect it."
   },
   {
    "name": "NPO activation deck",
    "summary": "When it's the Archivist NPO's turn, draw a card and check the mission's table.",
    "detail": [
     "It activates at most twice per turning point.",
     "If nothing on the card can happen, skip it. NPOs don't counteract, but still draw on their turn (cards can do other things).",
     "Reshuffle the whole deck in each Ready step, or when it runs out. You can look through the discard pile."
    ]
   },
   {
    "name": "Game sequence",
    "summary": "Pick the mission, set up the killzone from the map, pick operatives, then set up.",
    "steps": [
     "Mission 1: one kill team for the player(s), on Tomb World. Mission 2: each player brings a team and rolls off for initiative, on Volkus.",
     "Set up the killzone, objective and mission markers from the map. Assign drop zones (mission 2: the player with initiative picks).",
     "Pick operatives (mission 2: in secret, then reveal). Mission 1: pick datacards for the other NPOs. Up to four equipment options and 2CP (shared in mission 1, each in mission 2).",
     "Set up equipment (mission 2: take turns item by item). Mission 1: set up NPOs now with Conceal. Mission 2: the Archivist arrives later.",
     "Set up operatives wholly within your drop zone with Conceal (mission 2: a third of your team at a time, taking turns). Mission 1: you have initiative in the first turning point."
    ]
   },
   {
    "name": "Nemesis rules",
    "summary": "Extra Defense: when shot, it rolls one extra defense die unless it's injured. Bulky: it can't be placed on Vantage terrain more than 2\" off the floor."
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO datacard lists actions in priority order. Whenever the NPO would act, it performs the first one it can. If it can't do any, it's expended.",
    "detail": "The behavior also says which order (Engage or Conceal) to give it when it activates."
   }
  ],
  "npos": [
   {
    "name": "The Archivist",
    "apl": "2-3 (from card)",
    "move": "6\"",
    "save": "4+",
    "wounds": 35,
    "weapons": [
     {
      "name": "Atomic disassembler",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "4/2",
      "wr": "Range 8\", Devastating 3, Piercing 2"
     },
     {
      "name": "Eradicator glove",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "5/7",
      "wr": "Brutal, Shock, Stun"
     }
    ],
    "behaviour": "Shoots the closest player operative first, fights when it must, and also shoots other NPOs. Engage if it will Fight or Shoot, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Shoot the closest player operative.",
     "Charge the closest operative with fewer than 10 wounds left.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Shoot the closest NPO.",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Nemesis",
      "desc": "Extra Defense and Bulky. Counts as APL 4 for marker control."
     },
     {
      "name": "Xenotech Shielding",
      "desc": "When shot: ignore Piercing, and Dmg of 4 or more deals 1 less. It keeps Extra Defense even while injured."
     }
    ],
    "base": "Small (50mm)"
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Betrayal",
    "mode": "Co-op",
    "summary": "Raid a vault with the Archivist's help. Grab the artefacts before it decides it wants them more than it wants you.",
    "maps": [
     "archivist-p04"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "Set up 15 points of NPOs wholly within NPO territory, outside the Vault. From the second turning point on, as an NPO gambit, set up D3+2 more points the same way. (Pick their datacards from another pack.)"
     },
     {
      "name": "Archivist's Path",
      "summary": "The Archivist starts as your operative at point A in your drop zone. Each time it activates it must move along the path towards the Vault; you make every other choice. Once it turns NPO, it ignores the path."
     },
     {
      "name": "Xenotech Vault",
      "summary": "Nothing can be set up inside the Vault while its hatchway is closed. Your operatives can pick up the objective marker in the Vault. The carrier can't Dash, and can't be removed and set up again."
     },
     {
      "name": "Betrayal",
      "summary": "In each Ready step after the first, roll a D6 and add:",
      "detail": [
       "+1 if two or more of your operatives are closer to your killzone edge than the Archivist.",
       "+1 in the third or fourth turning point.",
       "+2 if one of your operatives carries the objective marker.",
       "On 7+, or in the fifth turning point, the Archivist becomes an NPO for the rest of the battle. It's an enemy to everyone: other NPOs attack it and it attacks them too."
      ]
     },
     {
      "name": "Threat principle",
      "summary": "Use the normal threat principle. When the Archivist NPO moves, getting closer to the objective marker comes first."
     }
    ],
    "actions": [],
    "victory": [
     "The battle ends after the fifth turning point.",
     "Win: one of your operatives carries the objective marker and is in your territory.",
     "Draw: otherwise, if the Archivist isn't contesting the objective marker.",
     "Lose: the Archivist contests the objective marker, or the marker isn't in your territory."
    ],
    "cards": [
     {
      "roll": "1-9",
      "effect": "Activate one NPO other than the Archivist."
     },
     {
      "roll": "10-11",
      "effect": "Activate the Archivist NPO with APL 2 (max twice and 9\" of movement per turning point)."
     },
     {
      "roll": "12-13",
      "effect": "Activate the Archivist NPO with APL 3 (max twice and 9\" of movement per turning point)."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "kz": "tomb_world",
    "tps": 5
   },
   {
    "num": 2,
    "name": "Negotiation",
    "mode": "Head-to-head",
    "summary": "Both teams grab infocores from a wreck. The Archivist works for whoever offers the most, and earning its favor means letting the enemy hold cores.",
    "maps": [
     "archivist-p06"
    ],
    "rules": [
     {
      "name": "NPOs",
      "summary": "In the second Ready step, set up the Archivist NPO, ready with Conceal, touching the center of a random neutral killzone edge. After both players have activated, if it's on the table, draw from its activation deck."
     },
     {
      "name": "Infocore Extraction",
      "summary": "Your operatives (not the Archivist) can pick up Infocore mission markers. Operatives with a base APL of 3+ can carry two.",
      "detail": "At the end of each turning point, each player gains Negotiation points equal to the number of Infocores the enemy controls."
     },
     {
      "name": "Negotiation",
      "summary": "Each time the Archivist would activate, both players secretly bid Negotiation points (hold that many dice in your hand), then reveal.",
      "detail": "The higher bidder spends their bid and controls the Archivist as their own operative for that activation. On a tie, it stays an NPO and follows its behavior."
     },
     {
      "name": "Who controls the Archivist NPO",
      "summary": "Its target is the closest player operative in its control range. If none, the closest visible player operative holding an Infocore it could fight, shoot or move towards (or the closest if none are visible). Roll off if tied.",
      "detail": "The other player runs it for that action and must go after that target. If no operative holds an Infocore and nobody bought it, skip the activation."
     }
    ],
    "actions": [],
    "victory": [
     "The battle ends after four turning points. Most VP wins; a tie is a draw.",
     "1VP if your operative incapacitates the Archivist.",
     "At the end, 1VP for each Infocore your operatives control."
    ],
    "cards": [
     {
      "roll": "1-8",
      "effect": "Skip this activation."
     },
     {
      "roll": "9-11",
      "effect": "Activate the Archivist NPO with APL 2 (max twice and 12\" of movement per turning point)."
     },
     {
      "roll": "12-13",
      "effect": "Activate the Archivist NPO with APL 3 (max twice and 12\" of movement per turning point)."
     }
    ],
    "cardsTitle": "NPO activation cards",
    "scoring": [
     {
      "key": "archivist",
      "text": "Your operative incapacitates the Archivist",
      "vp": 1,
      "when": "any",
      "side": "both"
     },
     {
      "key": "infocore",
      "text": "Each Infocore your operatives control",
      "vp": 1,
      "when": "end",
      "side": "both"
     }
    ],
    "kz": "volkus"
   }
  ]
 },
 {
  "id": "volkus",
  "name": "Volkus Compound",
  "kind": "Siege (head-to-head or co-op)",
  "modes": [
   "Head-to-head",
   "Co-op / solo"
  ],
  "killzone": "Volkus + Compound Siege",
  "kz": "volkus",
  "summary": "One team attacks a walled compound, the other defends it. Hold the center at the end, or wipe out the other side. Includes optional ruses and co-op rules.",
  "source": "Volkus Compound Mission Pack",
  "keyMaps": [
   "volkus-p07",
   "volkus-p08"
  ],
  "rules": [
   {
    "name": "Offense and Defense",
    "summary": "Offense attacks the compound; Defense holds it. Pick teams that suit the role (a shooting team defends well, an aggressive one attacks well), then try swapping.",
    "detail": "Defense has no killzone edge. Win by holding the compound's center at the end, or by wiping out the other side."
   },
   {
    "name": "Compound Siege terrain",
    "summary": "Adds stockades, bunkers and fire steps to Volkus.",
    "detail": [
     "Stockade: Heavy terrain with a breach point. Closed until opened, then it can't close again. Open: remove the removable part; the breach point becomes Accessible, Insignificant and Exposed.",
     "Bunker: Heavy terrain. An operative inside with the bunker in its control range can Guard (Gallowdark rules), but only to interrupt, shoot or fight enemies outside. Gaps between bunkers, stockades and strongholds count as Blocking.",
     "Fire step: Vantage, Insignificant and Exposed."
    ]
   },
   {
    "name": "Fortified position",
    "summary": "Bunkers and stockades protect the people behind them.",
    "detail": [
     "You can't see over their Heavy parts unless you, or what you're looking at, is at least 2\" above their base. You can only see through a window if one end of the line is within 1\" of it. Neither applies through an open breach point.",
     "Shooting someone on the far side who's in cover from it (e.g. at a window): ignore Piercing. Blast, Torrent and x\" Devastating only hit operatives on the same side as the target.",
     "Fighting through a window: the defender resolves first.",
     "Climbing their Heavy parts counts as 4\" vertical."
    ]
   },
   {
    "name": "Breaking a stockade",
    "summary": "Stockades have 8 wounds. At 0 they open.",
    "detail": [
     "Shooting: target it if its removable part is visible. It can be obscured but not in cover. Your weapons hit on 2+. It rolls four defense dice (no re-rolls), Save 4+, and ignores any single hit of 3 damage or less.",
     "Fighting: fight it if its removable part is in control range. It doesn't strike back. Hit on 2+. It ignores any single hit of 5 damage or less."
    ]
   },
   {
    "name": "Open Stockade Door",
    "summary": "Open a stockade that has a door, with the inside of its breach point in your control range.",
    "detail": "Not from outside, and not if it's already open or has no door.",
    "tag": "1AP"
   },
   {
    "name": "Game sequence",
    "summary": "Pick Offense and Defense, set up the compound, pick operatives, then set up.",
    "steps": [
     "Decide head-to-head or co-op. Pick kill teams. Assign Offense and Defense (or roll off; the winner picks).",
     "Defense picks a map. Set up Volkus with the Compound Siege pieces and objective marker as shown. Defense can add up to six fire steps.",
     "Pick operatives and up to four equipment options in secret, then reveal. Each player gains 2CP.",
     "Take turns setting up equipment item by item, then a third of your team at a time, starting with Defense. Operatives go wholly in your drop zone with Conceal.",
     "In the first turning point, Offense decides who has initiative."
    ]
   },
   {
    "name": "Winning",
    "summary": "The battle ends after four turning points, or when one team is wiped out.",
    "detail": [
     "If one team is wiped out, the other wins.",
     "Otherwise, whoever controls the objective marker wins.",
     "Otherwise, compare kill grades (from the table below). Higher wins; a tie is a draw."
    ]
   },
   {
    "name": "Kill grade table",
    "summary": "Find the row for how many operatives the enemy started with. It lists how many of them you must incapacitate for kill grade 1, 2, 3, 4 and 5.",
    "detail": [
     "5 enemy operatives: 1, 2, 3, 4, 5",
     "6: 1, 2, 4, 5, 6",
     "7: 1, 3, 4, 6, 7",
     "8: 2, 3, 5, 6, 8",
     "9: 2, 4, 5, 7, 9",
     "10: 2, 4, 6, 8, 10",
     "11: 2, 4, 7, 9, 11",
     "12: 2, 5, 7, 10, 12",
     "13: 3, 5, 8, 10, 13",
     "14: 3, 6, 8, 11, 14"
    ]
   },
   {
    "name": "Ruses (optional)",
    "summary": "Pick and reveal ruses along with equipment. Both players can take one, one player can take some as a handicap, or use them to tune a co-op game.",
    "detail": [
     "Offense, Surprise Attack: roll two dice for initiative and pick one, until the first time you don't have initiative.",
     "Offense, Night Assault: targets are obscured unless within 6\", wholly in Defense's drop zone, a stockade, or a Blast secondary target whose primary wasn't obscured.",
     "Offense, Breaching Charges: your operatives get a melee weapon only usable against stockades: Atk 3, Hit 2+, Dmg 5/8.",
     "Offense, Preliminary Bombardment: in the first turning point, Defense operatives can't move (or be set up) more than 3\", and your operatives can't move or be set up in Defense's drop zone unless under Vantage terrain.",
     "Defense, Razor Wire Perimeter: operatives that climb a stockade or bunker, or move in or out of a stronghold from outside the compound, take D3 damage.",
     "Defense, Booby Traps: the first time anyone moves through each door and breach point, roll a D6. On 4+ they take that much damage.",
     "Defense, Stockpile: one extra equipment option.",
     "Defense, Command Station: +1CP at the end of Select Operatives."
    ]
   },
   {
    "name": "Your kill team",
    "summary": "Solo: pick your kill team as normal. Co-op: split one kill team between you, or each take half of a kill team (round up).",
    "detail": [
     "Co-op players count as one player: you share CP and equipment.",
     "If you mix two teams, one team's rules may not affect the other's operatives.",
     "One player can act as game master and run the NPOs instead of playing."
    ]
   },
   {
    "name": "Co-op NPOs",
    "summary": "Pick any generic NPOs with a combined Wounds of up to 90 (raise or lower it to change difficulty). Give them barricades and other equipment where it makes sense.",
    "detail": [
     "Spread them out in cover. As Defense, spread them across the bunkers, stockades, stronghold and center.",
     "Initiative: roll one die for them and one for you. If they win, they always take initiative. They always pass in the Gambit step.",
     "As Defense they stay in the compound unless it really makes sense to leave, and Guard from bunkers (one per bunker) when they can't otherwise Shoot or Fight.",
     "As Offense they push into the compound carefully, climbing and opening stockades, and hurry near the end of the fourth turning point."
    ]
   },
   {
    "name": "Co-op threat principle",
    "summary": "When you make a choice for an NPO, pick the option that's worst for you. If you still can't decide, pick at random.",
    "detail": [
     "Which NPO activates: the one that can Fight or Shoot (Guard counts as Shoot) and is most dangerous doing so, then one not in cover, then the closest.",
     "Who it shoots: not obscured, then not in cover, then holding an objective, then closest, then wounded, then ready.",
     "Who it fights: wounded, then holding an objective, then ready."
    ]
   }
  ],
  "npos": [
   {
    "name": "Trooper (Brawler)",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": []
   },
   {
    "name": "Trooper (Marksman)",
    "apl": 2,
    "move": "6\"",
    "save": "5+",
    "wounds": 7,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     },
     {
      "name": "Special weapon",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Piercing 1"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker."
    ],
    "rules": [],
    "note": "Only 1 in 3 can have the special weapon."
   },
   {
    "name": "Tough (Brawler)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 10,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": []
   },
   {
    "name": "Warrior (Marksman)",
    "apl": 2,
    "move": "6\"",
    "save": "4+",
    "wounds": 8,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker."
    ],
    "rules": []
   },
   {
    "name": "Heavy (Marksman)",
    "apl": 3,
    "move": "6\"",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Firearm",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Knife",
      "type": "melee",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "-"
     }
    ],
    "behaviour": "Moves to a good spot to shoot. Engage if it will Shoot, otherwise Conceal.",
    "priorities": [
     "Fall Back to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker.",
     "Shoot.",
     "Reposition to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker (a Dash can finish this).",
     "Dash to cover, ideally where it has a valid target that isn't obscured, otherwise where it can see an objective marker."
    ],
    "rules": [
     {
      "name": "Double tap",
      "desc": "Can Shoot twice in one activation."
     }
    ]
   },
   {
    "name": "Heavy (Brawler)",
    "apl": 3,
    "move": "6\"",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Blades",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "Ceaseless"
     }
    ],
    "behaviour": "Moves in to fight, using cover on the way. Engage if it will Fight or Charge, otherwise Conceal.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Brawler",
      "desc": "Can Fight twice in one activation."
     }
    ]
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Compound Siege",
    "mode": "Head-to-head",
    "summary": "Offense storms the compound; Defense holds it. Two map layouts to choose from. Can also be played co-op against NPOs on either side.",
    "maps": [
     "volkus-p09",
     "volkus-p10"
    ],
    "rules": [
     {
      "name": "Rules",
      "summary": "Everything for this mission is in the pack rules above: setup, the compound terrain, ruses and how to win."
     }
    ],
    "actions": [],
    "victory": []
   }
  ]
 },
 {
  "id": "titus",
  "name": "Lieutenant Titus",
  "kind": "Standalone mini-game",
  "modes": [
   "Co-op / solo (1-3 players)"
  ],
  "killzone": "Volkus",
  "kz": "volkus",
  "summary": "A simplified spin-off for 1-3 players: Titus and two Ultramarines fight three waves of Tyranids, in the style of Space Marine 2. It uses its own cut-down rules, not your kill team.",
  "source": "Lieutenant Titus Mission Pack",
  "keyMaps": [
   "titus-p11",
   "titus-p12"
  ],
  "rules": [
   {
    "name": "Not a normal game",
    "summary": "You don't use a kill team or the normal turn structure. You play the three Space Marines below against Tyranid NPOs, with simplified rules."
   },
   {
    "name": "Set up",
    "summary": "Volkus terrain (or any terrain), a tape measure, 10 D6, tokens and markers.",
    "steps": [
     "Set up the first wave: 1 Tyranid Warrior and 6 Hormagaunts or Termagants (any mix) within 3\" of objective marker 1, with terrain between them and your drop zone.",
     "Split the three Space Marines between 1-3 players. Roll a D6 for each; highest goes first, then the next, and so on (re-roll ties). Note this order.",
     "In that order, set each Space Marine up wholly within the player drop zone."
    ]
   },
   {
    "name": "Turns",
    "summary": "Turns alternate: player turn, then NPO turn, starting with a player.",
    "detail": [
     "Player turn: the next Space Marine in your order activates, then the turn ends.",
     "NPO turn: activate every NPO of one type, one at a time. The types go in order: Hormagaunts, Termagants, Tyranid Warrior, Lictor. Skip a type with none on the table.",
     "When you reach the end of an order, start it again. Keep going until someone wins."
    ]
   },
   {
    "name": "Actions",
    "summary": "Each activation, an operative (yours or an NPO) can do up to two actions, and not the same one twice unless a rule says so. Space Marines can Shoot twice or Fight twice."
   },
   {
    "name": "Control range, visibility and cover",
    "summary": "Same as normal Kill Team: control range is visible and within 1\". Cover is intervening terrain within the target's control range, but not within 2\" of the shooter.",
    "detail": "Markers: you control one if more of your operatives contest it than enemies (count operatives, not APL)."
   },
   {
    "name": "Damage",
    "summary": "At 0 wounds an operative is incapacitated and removed.",
    "detail": "When a Space Marine without a Mortal Wound token goes down, place a Downed Ally marker within its control range first."
   },
   {
    "name": "Shooting and fighting",
    "summary": "Same sequences as Kill Team: three defense dice, cover gives a free normal save, 6s are crits, strike or block in fights. Targets just need to be visible (no orders)."
   },
   {
    "name": "NPO behavior",
    "summary": "Each NPO does the first action on its list it can, until it has done two actions or can't do any more. Use the threat principle (pick what's worst for you) for any other choice."
   }
  ],
  "actions": [
   {
    "name": "Reposition",
    "summary": "Move up to 6\". Can't move into enemy control range.",
    "detail": "Not while within enemy control range."
   },
   {
    "name": "Dash",
    "summary": "Move up to 3\".",
    "detail": "Not while within enemy control range."
   },
   {
    "name": "Fall Back",
    "summary": "Move up to 6\". Can pass through enemy control range but can't finish there.",
    "detail": "Only while an enemy is within control range, and it must be the only action that activation."
   },
   {
    "name": "Charge",
    "summary": "Move up to 8\" and finish within an enemy's control range. Once you reach an enemy with no other friendly operatives on it, you can't leave its control range.",
    "detail": "Not if already within enemy control range, or with any other move action that activation."
   },
   {
    "name": "Revive",
    "summary": "Pick a Downed Ally marker you control. Set that Space Marine back up touching it, with 6 wounds and a Mortal Wound token, then remove the marker.",
    "detail": "Space Marines only. Not while within an NPO's control range."
   },
   {
    "name": "Shoot",
    "summary": "Shoot with a ranged weapon.",
    "detail": "Not while within enemy control range. Space Marines can Shoot twice per activation."
   },
   {
    "name": "Fight",
    "summary": "Fight an enemy within control range.",
    "detail": "Only while an enemy is within control range. Space Marines can Fight twice per activation."
   }
  ],
  "npos": [
   {
    "name": "Lieutenant Titus",
    "apl": "2 actions",
    "move": "-",
    "save": "3+",
    "wounds": 15,
    "weapons": [
     {
      "name": "Heavy bolt pistol",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "Range 8\", Piercing Crits 1"
     },
     {
      "name": "Chainsword",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "Balanced"
     }
    ],
    "behaviour": "Player operative.",
    "priorities": [],
    "rules": [
     {
      "name": "Lethal Parry",
      "desc": "When retaliating, if you have a crit, you can resolve one before the NPO resolves any."
     },
     {
      "name": "Righteous Fury (once per battle)",
      "desc": "Action: Space Marines within 6\" heal up to D3+3 wounds (roll for each) and lose their Mortal Wound tokens."
     }
    ],
    "base": "40mm"
   },
   {
    "name": "Brother Chairon",
    "apl": "2 actions",
    "move": "-",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Bolt rifle",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "Piercing Crits 1"
     },
     {
      "name": "Chainsword",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "-"
     }
    ],
    "behaviour": "Player operative.",
    "priorities": [],
    "rules": [
     {
      "name": "Lethal Parry",
      "desc": "When retaliating, if you have a crit, you can resolve one before the NPO resolves any."
     },
     {
      "name": "Auspex Scan (once per battle)",
      "desc": "Action: until the end of Chairon's next activation, all Space Marines get +1 Critical Dmg and crit on 5+ when shooting, fighting or retaliating."
     }
    ],
    "base": "32mm"
   },
   {
    "name": "Brother-Sergeant Gadriel",
    "apl": "2 actions",
    "move": "-",
    "save": "3+",
    "wounds": 14,
    "weapons": [
     {
      "name": "Bolt rifle",
      "type": "ranged",
      "atk": 4,
      "hit": "3+",
      "dmg": "3/4",
      "wr": "Piercing Crits 1"
     },
     {
      "name": "Chainsword",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/5",
      "wr": "-"
     }
    ],
    "behaviour": "Player operative.",
    "priorities": [],
    "rules": [
     {
      "name": "Lethal Parry",
      "desc": "When retaliating, if you have a crit, you can resolve one before the NPO resolves any."
     },
     {
      "name": "Battle Cry (once per battle)",
      "desc": "Action: deal D3+3 damage to each enemy within 3\" (roll for each)."
     }
    ],
    "base": "32mm"
   },
   {
    "name": "Hormagaunt",
    "apl": "2 actions",
    "move": "-",
    "save": "5+",
    "wounds": 6,
    "weapons": [
     {
      "name": "Scything talons",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "2/4",
      "wr": "-"
     }
    ],
    "behaviour": "Threat level: Minoris.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative by the shortest route.",
     "Dash towards the closest player operative by the shortest route."
    ],
    "rules": [],
    "base": "28mm"
   },
   {
    "name": "Termagant",
    "apl": "2 actions",
    "move": "-",
    "save": "5+",
    "wounds": 6,
    "weapons": [
     {
      "name": "Ranged bio-weapon",
      "type": "ranged",
      "atk": 4,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     },
     {
      "name": "Claws & teeth",
      "type": "melee",
      "atk": 3,
      "hit": "4+",
      "dmg": "2/3",
      "wr": "-"
     }
    ],
    "behaviour": "Threat level: Minoris.",
    "priorities": [
     "Fall Back, ideally where it has a valid target.",
     "Reposition towards the closest player operative, to cover if possible, ideally where it has a valid target.",
     "Shoot.",
     "Dash towards the closest player operative, to cover if possible.",
     "Fight."
    ],
    "rules": [],
    "base": "28mm"
   },
   {
    "name": "Tyranid Warrior",
    "apl": "2 actions",
    "move": "-",
    "save": "4+",
    "wounds": 16,
    "weapons": [
     {
      "name": "Ranged bio-weapon",
      "type": "ranged",
      "atk": 5,
      "hit": "4+",
      "dmg": "3/4",
      "wr": "-"
     },
     {
      "name": "Boneswords",
      "type": "melee",
      "atk": 4,
      "hit": "4+",
      "dmg": "4/5",
      "wr": "-"
     }
    ],
    "behaviour": "Threat level: Majoris.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Shoot the closest player operative.",
     "Reposition towards the closest player operative.",
     "Dash towards the closest player operative."
    ],
    "rules": [
     {
      "name": "Synapse",
      "desc": "Hormagaunts and Termagants within 3\" of it keep one attack die as a normal success without rolling."
     },
     {
      "name": "Synaptic Backlash",
      "desc": "When it's incapacitated, deal D3 damage to each Hormagaunt and Termagant within 3\" (roll for each)."
     }
    ],
    "base": "40mm"
   },
   {
    "name": "Lictor",
    "apl": "2 actions",
    "move": "-",
    "save": "4+",
    "wounds": 20,
    "weapons": [
     {
      "name": "Claws & talons",
      "type": "melee",
      "atk": 5,
      "hit": "3+",
      "dmg": "4/6",
      "wr": "-"
     }
    ],
    "behaviour": "Threat level: Extremis.",
    "priorities": [
     "Fight.",
     "Charge the closest player operative by the shortest route.",
     "Reposition towards the closest player operative, to cover if possible (a Dash can finish this).",
     "Dash towards the closest player operative, to cover if possible."
    ],
    "rules": [
     {
      "name": "Hidden Predator",
      "desc": "After it Fights, it makes a free Fall Back, to cover if possible. While it's in cover from a player operative, that operative can't see it."
     }
    ],
    "base": "40mm"
   }
  ],
  "missions": [
   {
    "num": 1,
    "name": "Tyranid Hunt",
    "mode": "Co-op",
    "summary": "Titus's squad fights through three waves of Tyranids to reach a Tech-Priest.",
    "maps": [
     "titus-p06"
    ],
    "rules": [
     {
      "name": "Hive Purge",
      "summary": "Objective marker 1 starts active. Purging one makes the next one active."
     },
     {
      "name": "Tyrannocyte Remnants",
      "summary": "The first time each wave is wiped out, finish the current player order. If the active marker still isn't purged, the next NPO turn sets up D3+1 Hormagaunts or Termagants within 3\" of it instead of activating, then the NPO order restarts."
     },
     {
      "name": "Wave reinforcements",
      "summary": "When marker 2 or 3 becomes active, the next NPO turn sets up a new wave within 3\" of it instead of activating, then the NPO order restarts.",
      "detail": [
       "Marker 2: 1 Tyranid Warrior and 6 Hormagaunts or Termagants.",
       "Marker 3: 1 Lictor, 1 Tyranid Warrior and 4 Hormagaunts or Termagants."
      ]
     }
    ],
    "actions": [
     {
      "name": "Purge Tyrannocyte",
      "summary": "Purge the active objective marker in this operative's control range; the next one becomes active. Revive every downed Space Marine (with 3 wounds instead of 6). Then every Space Marine heals D3 wounds."
     }
    ],
    "victory": [
     "You win when all three objective markers are purged.",
     "You lose if all your operatives are incapacitated."
    ]
   }
  ]
 },
 {
  "id": "hivestorm",
  "name": "The Great Gun Fires",
  "kind": "Launch event mission",
  "modes": [
   "Head-to-head"
  ],
  "killzone": "Volkus",
  "kz": "volkus",
  "summary": "A Hivestorm launch event mission: grab intelligence and get out while a colossal gun fires overhead, with a different rule each turning point.",
  "source": "Hivestorm Launch Event Mission: The Great Gun Fires",
  "keyMaps": [],
  "rules": [
   {
    "name": "You also need",
    "summary": "This mission uses the game sequence and the Transmission crit op from the Kill Team Core Book, which aren't free. Without them, use any mission with three objective markers and add these rules."
   }
  ],
  "npos": [],
  "missions": [
   {
    "num": 1,
    "name": "The Great Gun Fires",
    "mode": "Head-to-head",
    "summary": "Seize scattered intelligence and get it out before the Great Gun's recoil flattens the area.",
    "maps": [],
    "rules": [
     {
      "name": "Facing the Firing",
      "summary": "When setting up the battle, pick a random neutral killzone edge. That's the Massif Ballistus edge, where the gun is."
     },
     {
      "name": "Turning point 1: Hymnals of Firing",
      "summary": "+1\" Move for all operatives. +3\" to the distances of SUPPORT rules (doesn't stack with the Comms Device)."
     },
     {
      "name": "Turning point 2: Calm Before",
      "summary": "No extra rules."
     },
     {
      "name": "Turning point 3: Devastating Report",
      "summary": "In the Ready step, the gun fires.",
      "detail": [
       "Each operative without intervening Heavy terrain within its control range between it and the Massif Ballistus edge takes D3+1 damage (roll for each).",
       "Then each operative without intervening Light or Heavy terrain there gains a Shockwave token. Operatives with a token can't activate or act until all their side's operatives without one are expended. Remove the token when it's expended."
      ]
     },
     {
      "name": "Turning point 4: Aftershock",
      "summary": "-2\" Move for all operatives. Whenever an operative Dashes, roll a D6: on a 1 it only moves 1\"."
     }
    ],
    "actions": [
     {
      "name": "Initiate Transmission",
      "summary": "An objective marker you control is transmitting until the start of the next turning point.",
      "detail": "Not in the first turning point, or within an enemy's control range.",
      "tag": "1AP"
     }
    ],
    "victory": [
     "The battle ends after four turning points.",
     "At the end of each turning point after the first: 1VP if your operatives control any transmitting objective markers, and 1VP more if they control more of them than the enemy does."
    ],
    "scoring": [
     {
      "key": "any",
      "text": "Your operatives control a transmitting objective marker",
      "vp": 1,
      "when": "tp",
      "side": "both",
      "most": 1,
      "start": 2
     },
     {
      "key": "more",
      "text": "You control more transmitting objective markers than the enemy",
      "vp": 1,
      "when": "tp",
      "side": "both",
      "most": 1,
      "start": 2
     }
    ]
   }
  ]
 },
 {
  "id": "bloodzeal",
  "name": "Blood and Zeal",
  "kind": "Add-on cards",
  "modes": [
   "Head-to-head"
  ],
  "killzone": "Any, plus a shrine statue",
  "kz": "open",
  "summary": "An add-on for any two-player mission: a deck of Blood (attack) and Zeal (defense) cards you draw and play during the battle, plus a shrine statue in the middle of the board.",
  "source": "Blood and Zeal Mission Pack",
  "keyMaps": [],
  "rules": [
   {
    "name": "How to use it",
    "summary": "Play any normal mission (Preliminary Ops or Approved Ops) and add these cards on top. Not for 3+ player games.",
    "detail": "It adds a lot. With Approved Ops you might drop the tac op and keep just the kill op and crit op."
   },
   {
    "name": "Shrine statue",
    "summary": "After picking drop zones, the player with initiative sets up the shrine statue on the centreline, equally in both territories, more than 1\" from other terrain.",
    "detail": [
     "It's Heavy terrain. Its plinth counts as a marker for contesting and controlling it.",
     "On Volkus, take out a small ruin or rubble piece (E-K) near where it goes.",
     "You can use a similar piece from your own collection instead.",
     "While you control it, when you draw you can peek at one card first, then take it or draw a different one blind."
    ]
   },
   {
    "name": "The decks",
    "summary": "Shuffle Blood and Zeal into two face-down decks. Lay three of each face down beside them: that's the draw area.",
    "detail": [
     "To draw, take any face-down card from the draw area (you know if it's Blood or Zeal, not what it says), then refill that spot from the same deck.",
     "Keep your hand secret. If both players draw at once, take turns one card at a time, starting with initiative.",
     "Blood cards are mostly attack. Zeal cards are mostly defense."
    ]
   },
   {
    "name": "When you draw",
    "summary": "Draw one card in each Ready step, plus one card for each VP your opponent scores."
   },
   {
    "name": "Playing cards",
    "summary": "Each card says when you can use it. Once used, put it face up in your Blood or Zeal discard pile. Discard piles are public.",
    "detail": "You can't just throw cards away: a card only reaches your discard pile by being used."
   },
   {
    "name": "End of battle VP",
    "summary": "Count each player's discarded Blood and Zeal cards (not cards in hand).",
    "detail": [
     "More discarded Blood cards than your opponent: +1VP.",
     "More discarded Zeal cards than your opponent: +1VP."
    ]
   },
   {
    "name": "Praise / Blaspheme",
    "summary": "Shuffle one card from your hand, or two of your discarded cards, back into their decks. Then draw a card. (Discarded cards can be worth VP, so think first.)",
    "detail": "Not within an enemy's control range, or more than 3\" from the shrine statue's plinth.",
    "tag": "1AP"
   },
   {
    "name": "Hallow / Defile",
    "summary": "Hallow or defile the shrine statue you control. Draw a card.",
    "detail": "Not within an enemy's control range, only if you control the shrine, and only once per turning point for the shrine.",
    "tag": "1AP"
   }
  ],
  "decks": [
   {
    "name": "Blood cards",
    "note": "Attack cards. Draw from the face-down draw area.",
    "cards": [
     {
      "name": "+1\" Move",
      "effect": "When your operative Charges or Repositions: +1\" Move for that action (doesn't stack with other Move boosts)."
     },
     {
      "name": "Critical Attack",
      "effect": "Shooting or fighting, in Roll Attack Dice: turn one normal success into a crit."
     },
     {
      "name": "+D3 Damage Shot",
      "effect": "Shooting, when one of your attack dice deals damage: deal D3 more."
     },
     {
      "name": "+D3 Damage Strike",
      "effect": "Fighting, when one of your attack dice deals damage: deal D3 more."
     },
     {
      "name": "Double Fight/Shoot",
      "effect": "After your operative Fights or Shoots: it does the same action again, ignoring action limits. Free for operatives with the Astartes rule."
     },
     {
      "name": "Take Initiative",
      "effect": "Start of the Initiative step: you have initiative, no roll."
     },
     {
      "name": "Re-roll Attack Dice",
      "effect": "Shooting or fighting, after rolling attack dice: re-roll any of them."
     },
     {
      "name": "Action on Incapacitation",
      "effect": "When a ready operative of yours is incapacitated: it makes one free action (not Fight) first, and can change order to do it."
     },
     {
      "name": "Cancel Block (Fight)",
      "effect": "Fighting, when your opponent blocks: discard that success instead (it still counts as resolved)."
     },
     {
      "name": "Shock and Stun",
      "effect": "Shooting or fighting, end of Roll Attack Dice, if you kept a crit: your weapons gain Shock and Stun for that sequence."
     },
     {
      "name": "Max Success Attack",
      "effect": "Shooting or fighting, in Roll Attack Dice: keep all your attack dice as normal successes without rolling."
     },
     {
      "name": "Free Starting Action",
      "effect": "Start of the Firefight phase: one of your operatives makes a free action, moving no more than 2\". It can change order."
     },
     {
      "name": "Prevent Mission Action",
      "effect": "When an enemy does a mission action at an objective you contest: it costs 1 more AP. Until next turning point, mission actions there cost them 1 more AP while you contest it."
     },
     {
      "name": "Return Discarded Card",
      "effect": "During your operative's activation: shuffle one of your opponent's discarded cards back into its deck."
     },
     {
      "name": "Use or Reuse Ploy",
      "effect": "Firefight phase: use a firefight ploy for 1CP less, or use one a second time this turning point (paying its cost)."
     },
     {
      "name": "Steal Card",
      "effect": "During your operative's activation: take a card from your opponent's hand."
     }
    ]
   },
   {
    "name": "Zeal cards",
    "note": "Defense cards. Draw from the face-down draw area.",
    "cards": [
     {
      "name": "-D3 Damage Strike",
      "effect": "When an enemy fighting your operative deals damage with a die: ignore D3 of it."
     },
     {
      "name": "Max Success Defense",
      "effect": "When your operative is shot, in Roll Defense Dice: keep all your defense dice as normal successes without rolling."
     },
     {
      "name": "+1 APL for Control",
      "effect": "During your activation or at the end of the turning point: pick an objective you contest. Until next turning point, your total APL there counts as 1 higher."
     },
     {
      "name": "-D3 Damage Shot",
      "effect": "When an enemy shooting your operative deals damage with a die: ignore D3 of it."
     },
     {
      "name": "Ignore Weapon Rule",
      "effect": "When your operative is targeted and the enemy picks a weapon: that weapon loses one weapon rule (not Range) for that sequence."
     },
     {
      "name": "Critical Defense",
      "effect": "When your operative is shot, in Roll Defense Dice: turn one normal success into a crit."
     },
     {
      "name": "Revive onto 1 Wound",
      "effect": "When your operative would be incapacitated: it stays at 1 wound, can't be incapacitated for the rest of that action, all remaining attack dice are discarded, then it can make a free Dash or a 3\" Fall Back."
     },
     {
      "name": "Free Action",
      "effect": "During your operative's activation: it makes a free 1AP action."
     },
     {
      "name": "Double Block (Fight)",
      "effect": "Fighting or retaliating, when you block: that success blocks one or two unresolved enemy successes."
     },
     {
      "name": "Obscured",
      "effect": "When an enemy shoots your operative from more than 6\" away: your operative is obscured for that action, whatever other rules say."
     },
     {
      "name": "Heal 3D3",
      "effect": "During your operative's activation: it heals 3D3 wounds."
     },
     {
      "name": "Gain 1CP",
      "effect": "Any time: gain 1CP."
     },
     {
      "name": "Reveal Opponent's Cards",
      "effect": "During any activation: your opponent reveals their hand."
     },
     {
      "name": "Re-roll Defense Dice",
      "effect": "When your operative is shot, after rolling defense dice: re-roll any of them."
     },
     {
      "name": "Free Ending Action",
      "effect": "End of the Firefight phase: one of your operatives makes a free action, moving no more than 2\". It can change order."
     },
     {
      "name": "Use or Change Ploy",
      "effect": "Firefight phase: use a strategy ploy now (paying its cost), or swap a strategy ploy you used this turning point for a different one (paying any extra CP)."
     }
    ]
   }
  ],
  "npos": [],
  "missions": []
 },
 {
  "id": "kz_tombworld",
  "name": "Killzone: Tomb World",
  "kind": "Killzone rules",
  "modes": [
   "Any"
  ],
  "killzone": "Tomb World",
  "kz": "tomb_world",
  "summary": "The terrain rules for the Tomb World board: walls, hatchways, breach points, teleport pads, rooms and close quarters fighting. Tomb World, Shadowhunt and The Archivist all use it.",
  "source": "Killzone: Tomb World (with its Aug '26 update log)",
  "keyMaps": [
   "kz_tombworld-p09",
   "kz_tombworld-p10"
  ],
  "rules": [
   {
    "name": "The board",
    "summary": "A 606mm x 703mm board on a 6 x 7 grid, with a sarcophagus, 4 debris, 2 of each other piece on the map key, and 16 half pillars. Some maps use fewer.",
    "detail": "It plays like Killzone: Gallowdark, so Gallowdark errata and rulings apply here too. Portals are still called hatchways and use Operate Hatch."
   },
   {
    "name": "Walls",
    "summary": "Tomb World walls are Heavy and Wall terrain.",
    "detail": [
     "Nothing can move over or through Wall terrain, whatever other rules say.",
     "You can't see over or through it.",
     "Measure distances around it by the shortest route (except to areas like drop zones or the center).",
     "For cover and obscured, only the corners and ends of walls count as intervening, unless the active operative has already passed that point. Small bumps don't count as corners."
    ]
   },
   {
    "name": "Hatchways",
    "summary": "Start closed. Closed: the access point and hatch are Heavy and Wall terrain. Open: remove the hatch; the access point is Accessible, Insignificant and Exposed (use the walls beside it for cover)."
   },
   {
    "name": "Operate Hatch",
    "summary": "Open or close a hatchway whose access point is in your control range. You can do it partway through a Dash or Reposition and keep moving after.",
    "detail": "Not within an enemy's control range, and you can't close it while its access point is in an enemy's control range.",
    "tag": "1AP"
   },
   {
    "name": "Breach points",
    "summary": "Start closed and can't be closed again once open. Closed: Heavy and Wall terrain. Open: remove the breach wall; the access point is Accessible, Insignificant and Exposed."
   },
   {
    "name": "Breach",
    "summary": "Open a closed breach point whose access point is in your control range. Roll a D6 for each operative on the other side with that access point in its control range: on 4+ it gets -1 APL until the end of its next activation and takes damage equal to half the roll (round up).",
    "detail": [
     "Costs 1AP less (min 1AP) for operatives with 'breach marker', 'grenadier' or 'mine' on their datacard, or a Piercing 2 / Piercing Crits 2 weapon without Blast or Torrent.",
     "It can't cost less than 2AP in an activation where the operative Charges or Shoots.",
     "Not within an enemy's control range, or if the breach point is already open."
    ],
    "tag": "2AP"
   },
   {
    "name": "Teleport pads",
    "summary": "Exposed, Insignificant and Vantage terrain. Only one operative fits on a pad, and it isn't on the floor while there.",
    "detail": [
     "From the second turning point, an operative on a pad that Charges, Falls Back or Repositions can teleport: set it up on the other pad instead of moving. It must still meet the action's other requirements.",
     "If someone is on the other pad, swap them (its owner places it). Once per activation.",
     "No equipment within 2\" of a pad. An operative touching a pad and one standing on it are in each other's control range.",
     "Teleporting doesn't count as moving for distance rules, and doesn't let you ignore 'can't end closer' limits."
    ]
   },
   {
    "name": "Sarcophagus and debris",
    "summary": "Light terrain."
   },
   {
    "name": "Rooms",
    "summary": "A room is any area completely enclosed by walls (and killzone edges where needed)."
   },
   {
    "name": "Condensed Environment",
    "summary": "Weapons with Blast, Torrent or x\" Devastating also get Lethal 5+."
   },
   {
    "name": "Guard",
    "summary": "The operative goes on guard. Counts as a Shoot action.",
    "detail": [
     "On guard ends when it does any action, moves or is set up, when an enemy ends an action in its control range and you don't interrupt, when its order changes, or at the start of the next turning point.",
     "Not with a Conceal order, or while within an enemy's control range."
    ],
    "tag": "1AP"
   },
   {
    "name": "On guard",
    "summary": "Once during each enemy activation, after that enemy does an action, you can interrupt and have one of your on-guard operatives Shoot or Fight for free. If you do, it can't counteract this turning point.",
    "detail": [
     "It can even Shoot while within the enemy's control range (a point-blank shot): target that enemy, with -1 to Hit (worse), and it can't retaliate for the rest of that enemy's activation.",
     "Counteracting can't be used to Guard."
    ]
   },
   {
    "name": "Hatchway Fight",
    "summary": "Fight an enemy within 2\" of, and on the other side of, the access point of an open hatchway or breach point your operative is touching. You count as in each other's control range. Counts as a Fight action.",
    "detail": "Not within an enemy's control range, or if your base isn't touching an open access point.",
    "tag": "1AP"
   }
  ],
  "npos": [],
  "missions": []
 }
];
/* MISSION_PACKS:END */

