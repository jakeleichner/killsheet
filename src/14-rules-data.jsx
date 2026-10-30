/* ═══ TERRAIN TYPES ═══ */
const TERRAIN_TYPES = [
  { name: "Heavy", color: "#E0664A", desc: "Larger terrain features. Can obscure operatives: if Heavy terrain is intervening between shooter and target (and more than 1\" from both), the target is obscured.", rules: ["Attacker must discard one success when target is obscured.", "All attacker crits become normal successes when target is obscured.", "Cannot obscure if within 1\" of either operative."] },
  { name: "Light", color: "var(--accent)", desc: "Smaller terrain features. No additional rules on its own, but other rules interact with it differently. Vantage terrain is also Light terrain.", rules: ["Provides cover but does not obscure.", "Operatives on Vantage can ignore Light terrain for targeting Concealed enemies below them."] },
  { name: "Blocking", color: "var(--muted)", desc: "Usually gaps between or underneath terrain. Visibility cannot be drawn through Blocking terrain. For cover and obscured purposes, gaps count as intervening like the terrain around them.", rules: ["Visibility cannot pass through.", "Treated as intervening for cover/obscured.", "Rare. Used to block specific gaps."] },
  { name: "Vantage", color: "var(--blue)", desc: "Upper levels operatives can stand on. Also counts as Light terrain. Provides shooting bonuses and targeting advantages against lower operatives.", rules: ["Shooting target 2\"+ lower with Engage: weapon gains Accurate 1. 4\"+ lower: Accurate 2.", "Targeting Concealed operatives 2\"+ lower: they can't use Light terrain for cover (but keep cover save as crit or get +1 save).", "For obscured, ignore Heavy terrain connected to Vantage the shooter or target is on.", "Operatives can jump from Vantage terrain higher than 2\"."] },
  { name: "Accessible", color: "#5A9C3A", desc: "Operatives can move through this terrain (e.g. doors, open hatches), but it costs an additional 1\" to do so. Only the center of the base needs to pass through.", rules: ["Move through costs +1\" extra.", "Base center determines passage, not full base.", "Takes precedence over normal terrain blocking."] },
  { name: "Insignificant", color: "#D5D6D7", desc: "Very small terrain. Ignored for climbing and dropping purposes. Operatives can move over it without going up and down.", rules: ["Ignore for climbing/dropping.", "Move over freely."] },
  { name: "Exposed", color: "#E0664A", desc: "Terrain with large gaps or too small to hide behind. Never counts as intervening for cover or obscured purposes.", rules: ["Never provides cover.", "Never obscures.", "Common on fire steps, barricade feet, open hatchways."] },
  { name: "Ceiling", color: "#9B59B6", desc: "Operatives with 50mm round bases or 60x35mm oval bases can move underneath regardless of model height. Must finish in a placeable location.", rules: ["Allows movement underneath for smaller-based operatives.", "Must still end action in valid position."] },
];

/* ═══ MOVEMENT RULES ═══ */
const MOVEMENT_RULES = [
  { name: "Straight lines", summary: "Move in straight-line increments, not curves. Round each increment up to the nearest inch.", detail: "A ½\" increment counts as 1\"." },
  { name: "Climbing", summary: "Climb terrain within 1\" horizontally and 3\" vertically. Each climb counts as at least 2\".", detail: [
    "A 1\" climb costs 2\" of movement.",
    "The operative must finish where it can be placed, so it can't stop partway up.",
    "Add up all the vertical distance in one action before rounding. You can keep climbing onto the next terrain if it's within 1\" horizontally and 3\" vertically.",
  ] },
  { name: "Dropping", summary: "Moving down off terrain. Ignore the first 2\" of dropping in each action.", detail: [
    "The 2\" is for the whole action, not each drop.",
    "A drop of 2\" or less is free.",
  ] },
  { name: "Jumping", summary: "From Vantage terrain more than 2\" high, move up to 4\" out from the edge in one straight line, then drop or climb.", detail: [
    "This lets you cross gaps up to 4\" wide.",
    "If there's a rampart at the edge you jump from, climb it first and jump from its top.",
    "When jumping onto terrain, ignore a height difference of 1\" or less, including its rampart.",
  ] },
  { name: "Friendly operatives", summary: "Operatives can move through friendly operatives, but not enemies." },
  { name: "Terrain blocks movement", summary: "Bases can't move through terrain. Go around it, climb over it, or drop or jump off it. Bases can't hang over the killzone edge." },
];

/* ═══ VISIBILITY & OBSCURED ═══ */
const VISIBILITY_RULES = [
  { name: "Visible", visual: "visible", summary: "Look from behind the operative. If you can draw a clear straight line from its head to any part of the target (not the base), the target is visible.", detail: [
    "The line is 1mm wide.",
    "An operative is always visible to itself.",
  ] },
  { name: "Intervening", visual: "intervening", summary: "Terrain between two operatives is intervening.", detail: "When it's unclear, use targeting lines: imaginary 1mm lines from any point of the operative's base to every facing part of the target's base. Terrain that any line crosses is intervening. Terrain that every line crosses is wholly intervening." },
  { name: "Cover", visual: "cover", summary: "An operative is in cover if there's intervening terrain within its control range. It can't be in cover while within 2\" of the other operative.", detail: [
    "Conceal order: an operative in cover isn't a valid target.",
    "Cover save: when shot while in cover, the defender keeps one defense die as a normal success without rolling it.",
    "An operative can't be in cover from and obscured by the same terrain feature. The defender picks one.",
  ] },
  { name: "Obscured", visual: "obscured", summary: "An operative is obscured if there's intervening Heavy terrain more than 1\" from both operatives.", detail: [
    "Shooting an obscured target: discard one of your successes, and all your critical successes become normal successes.",
    "This takes precedence over all other rules.",
  ] },
  { name: "Cover vs obscured", visual: "covervsobscured", summary: "Cover comes from terrain near the target. Obscured comes from Heavy terrain in between.", detail: "Cover keeps Concealed operatives from being targeted and gives a free defense die. Obscured weakens the attack by removing a success and turning crits into normal successes." },
];

/* ═══ SHOOTING & FIGHTING ═══ */
const SHOOTING_RULES = [
  { name: "Shooting sequence", summary: "The player shooting is the attacker. The target's player is the defender.", steps: [
    "Select weapon: pick one of the operative's ranged weapons.",
    "Select target: pick an enemy that's a valid target and has no friendly operatives within its control range.",
    "Roll attack dice: roll D6 equal to the weapon's Atk. Each die that equals or beats Hit is a success, and 6s are critical. If the target is obscured, discard one success and your crits become normal successes.",
    "Roll defense dice: the defender rolls three D6. Each die that equals or beats Save is a success, and 6s are critical. If the target is in cover, the defender can keep one die as a normal success without rolling it.",
    "Block: the defender uses their successes to block. One normal blocks one normal. Two normals block one crit. One crit blocks a normal or a crit.",
    "Damage: each unblocked normal success deals the weapon's normal Dmg (first number). Each unblocked crit deals its critical Dmg (second number).",
  ] },
  { name: "Shooting limits", summary: "You can't Shoot with a Conceal order or while an enemy is within control range.", detail: [
    "Operatives incapacitated during a Blast or Torrent attack stay on the killzone until the whole action is done.",
    "If your attack hits your own operative (for example with Blast), you roll both the attack and defense dice.",
  ] },
];

const FIGHTING_RULES = [
  { name: "Fighting sequence", summary: "The operative fighting is the attacker. The enemy it picks fights back.", steps: [
    "Select enemy: pick an enemy within control range. It will retaliate.",
    "Select weapons: both players pick one of their operative's melee weapons.",
    "Roll attack dice: both players roll D6 equal to their weapon's Atk. Each die that equals or beats Hit is a success, 6s are critical, and 1s fail.",
    "Resolve: starting with the attacker, take turns resolving one success at a time. Once one player has none left, the other resolves all of theirs.",
  ] },
  { name: "Strike or block", summary: "Each success you resolve either strikes or blocks.", detail: [
    "Strike: deal the weapon's normal Dmg (normal success) or critical Dmg (critical success) right away.",
    "Block: cancel one of your opponent's unresolved successes. A normal blocks a normal. A crit blocks a normal or a crit.",
    "Strike to finish an enemy before it hits back. Block to survive.",
  ] },
];

/* ═══ UNIVERSAL EQUIPMENT ═══ */
const UNIV_EQUIPMENT = [
  { name: "Frag Grenade", type: "weapon", desc: "Fragmentation grenade for clearing groups. Select 2 explosive grenades total (2 frag, 2 krak, or 1 each).", stats: { atk: 4, hit: "4+", dmg: "2/4", wr: "Range 6\", Blast 2\", Saturate" }, note: "The whole kill team shares these uses." },
  { name: "Krak Grenade", type: "weapon", desc: "Anti-armor grenade for hard targets. Select 2 explosive grenades total (2 frag, 2 krak, or 1 each).", stats: { atk: 4, hit: "4+", dmg: "4/5", wr: "Range 6\", Piercing 1, Saturate" }, note: "The whole kill team shares these uses." },
  { name: "Smoke Grenade", type: "action", desc: "Place Smoke marker within 6\" (visible or on visible Vantage terrain). Creates 1\" radius smoke area (unlimited height, not below). Operatives wholly in smoke are obscured to those >2\" away. Reduces Piercing 2/Piercing Crits 2 to Piercing 1/Piercing Crits 1 (unless within 2\"). Removed after D3 activations next TP or end of TP.", note: "1AP. Select 2 utility grenades total. Not in enemy control range." },
  { name: "Stun Grenade", type: "action", desc: "Select visible enemy within 6\". That operative and each other operative within 1\" takes a stun test: roll D6, on 3+ subtract 1 from APL until end of its next activation.", note: "1AP. Select 2 utility grenades total. Not in enemy control range." },
  { name: "Ammo Cache", type: "terrain", desc: "Set up marker in your territory before battle. Operative controlling it can perform Ammo Resupply (0AP): re-roll one attack die when shooting with datacard weapons until next TP. Once per TP per marker. Not in enemy control range." },
  { name: "Razor Wire", type: "terrain", desc: "Exposed and Obstructing terrain. Set up wholly within your territory, on killzone floor, >2\" from other equipment terrain, access points, and Accessible terrain. Whenever an operative crosses within 1\" of it, treat the distance as an additional 1\"." },
  { name: "Mines", type: "terrain", desc: "Set up marker wholly within your territory, >2\" from other markers, access points, and Accessible terrain. The first time the marker is within an operative's control range, remove it and inflict D3+3 damage on that operative." },
  { name: "Comms Device", type: "terrain", desc: "Set up marker wholly within your territory. While a friendly operative controls this marker, add 3\" to distance requirements of its SUPPORT rules that refer to friendly operatives. You cannot benefit from your opponent's Comms Device markers." },
  { name: "Light Barricades (x2)", type: "terrain", desc: "Light terrain (feet are Insignificant and Exposed). Set up wholly within your territory, on killzone floor, >2\" from other equipment terrain, access points, and Accessible terrain." },
  { name: "Heavy Barricade", type: "terrain", desc: "Heavy terrain. Set up wholly within 4\" of your drop zone, on killzone floor, >2\" from other equipment terrain, access points, and Accessible terrain." },
  { name: "Ladders (x2)", type: "terrain", desc: "Insignificant and Exposed terrain. Set up wholly within your territory, upright against terrain at least 2\" tall, >2\" from other equipment terrain, >1\" from doors and access points. Once per action, when an operative is climbing the terrain a ladder is placed against, treat the vertical distance as 1\" if the ladder is within that operative's control range during the entire climb." },
  { name: "Portable Barricade", type: "terrain", desc: "Light, Protective, Portable terrain (feet Insignificant/Exposed). Protective: while an operative is in cover from this terrain, improve its Save by 1 (max 2+). Portable: only provides cover while an operative is connected to it and the shield is intervening. A connected operative can perform Move With Barricade (1AP): like Reposition, but max Move stat -2\", no climb/drop/jump." },
  { name: "Breaching Charge", type: "upgrade", desc: "Once per battle, when a friendly operative performs the Breach action, it can do so for 1 less AP (min 1AP) as though it had 'breach marker' on its datacard." },
];

/* ═══ GLOSSARY ═══ */
const GLOSSARY = [
  { term: "APL", def: "Action Point Limit. Total AP an operative can spend per activation. Also used for marker control. Max change: +/-1 from normal." },
  { term: "AP", def: "Action Points. Spent to perform actions during activation." },
  { term: "ATK", def: "Attacks. Number of dice rolled when using a weapon." },
  { term: "CP", def: "Command Points. Spent on ploys. Start with 2. Gain 1-2 per TP." },
  { term: "CR", def: "Control Range. Visible to and within 1\". Mutual between operatives." },
  { term: "Crit", def: "Critical success. A dice result of 6. Deals Critical Dmg (second number)." },
  { term: "Dmg", def: "Damage. Format: Normal/Critical. E.g. 3/5 means 3 normal, 5 critical." },
  { term: "Hit", def: "Hit stat. Minimum dice result needed for a success with that weapon." },
  { term: "Save", def: "Save stat. Minimum defense dice result to block. Lower is better." },
  { term: "TP", def: "Turning Point. One round of play (Strategy + Firefight phases). Games last 4 TPs." },
  { term: "VP", def: "Victory Points. Scored from objectives. Most VP wins." },
  { term: "W", def: "Wounds. Operative's health. 0 = incapacitated and removed." },
  { term: "WR", def: "Weapon Rules. Special rules on a weapon (e.g. Blast, Lethal, Brutal)." },
  { term: "Injured", def: "Below half starting wounds. -2\" Move, -1 Hit stat." },
  { term: "Incapacitated", def: "0 wounds remaining. Removed from killzone." },
  { term: "Wounded", def: "Below starting wounds but not yet injured." },
  { term: "Expended", def: "An operative that has been activated this TP. Cannot activate again." },
  { term: "Ready", def: "An operative that hasn't been activated yet this TP." },
  { term: "Engage", def: "Order for attacking. It can Shoot, Charge and counteract. Enemies can target it whenever it's visible." },
  { term: "Conceal", def: "Order for hiding. It can't Shoot, Charge or counteract. Enemies can't target it while it's in cover." },
  { term: "Counteract", def: "When all yours are expended, one expended Engage operative performs a free 1AP action (max 2\" move). Each operative once per TP." },
  { term: "Ploy", def: "Spend CP for bonus rules. Strategy ploys in Strategy phase, Firefight ploys in Firefight phase. 1CP each." },
  { term: "Strategic Gambit", def: "Used in Gambit step of Strategy phase. All strategy ploys are Strategic Gambits. Each used once/TP max." },
  { term: "Contest", def: "An operative contests every marker within its control range. The side with more total APL contesting a marker controls it." },
  { term: "Cover Save", def: "When in cover, defender retains one defense die as auto normal success without rolling." },
  { term: "Obscured", def: "Intervening Heavy terrain (>1\" from both). Attacker loses one success and crits become normals." },
];

