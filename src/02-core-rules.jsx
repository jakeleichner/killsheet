/* ═══ WEAPON RULES ═══ */
const WR = {
  "Accurate 1": "Before rolling, you may set aside 1 attack die and count it as an automatic normal success. Then roll the rest as normal.",
  "Accurate 2": "Before rolling, you may set aside up to 2 attack dice and count them as automatic normal successes. Then roll the rest.",
  "Balanced": "After rolling your attack dice, you may pick one die and re-roll it. You must keep the new result even if it's worse.",
  "Blast 1\"": "After resolving the attack against your primary target, you must also shoot every other operative (friend or foe) that is visible to and within 1\" of that target. Each secondary attack is rolled separately. Secondary targets use the primary's cover/obscured status.",
  "Blast 2\"": "After resolving the attack against your primary target, you must also shoot every other operative (friend or foe) that is visible to and within 2\" of that target. Each secondary attack is rolled separately. Secondary targets use the primary's cover/obscured status.",
  "Brutal": "When your opponent blocks in melee, they can only block with critical successes. Their normal successes can't block at all.",
  "Ceaseless": "After rolling your attack dice, pick one result (e.g. all your 2s) and re-roll every die showing it.",
  "Devastating 2": "Each time you retain a critical success, deal 2 damage to the target right away, before anything else resolves. The crit still counts in the normal damage step, so each crit adds this damage on top.",
  "Devastating 3": "Each time you retain a critical success, deal 3 damage to the target right away, before anything else resolves. The crit still counts in the normal damage step, so each crit adds this damage on top.",
  "Heavy": "You can't move and use this weapon in the same activation. If the operative moved, it can't shoot with this weapon; if it shot with it, it can't move. Guard is still allowed.",
  "Heavy (Dash only)": "The only move allowed in the same activation as this weapon is a Dash (no Reposition, Charge or Fall Back). If you need to move more than 3\", you can't use this weapon that activation.",
  "Heavy (Reposition only)": "The only move allowed in the same activation as this weapon is a Reposition (no Dash, Charge or Fall Back).",
  "Hot": "After using this weapon, roll 1D6. If the result is lower than the weapon's Hit stat, the operative takes damage equal to double the roll. Example: Hit 3+, you roll a 2, it takes 4 damage.",
  "Lethal 5+": "Attack rolls of 5 or 6 count as critical successes (normally only 6s do). That raises your crit chance per die from about 17% to about 33%.",
  "Limited 1": "This weapon can only be used once per battle. Hitting several targets with it (Blast or Torrent) still counts as one use.",
  "Piercing 1": "The defender rolls 1 fewer defense die (usually 2 instead of 3), whether or not you score crits.",
  "Piercing Crits 1": "If you retain at least one critical success, the defender rolls 1 fewer defense die. No crits, no effect. Lethal 5+ makes it trigger more often.",
  "Punishing": "If you retain at least one critical success, you can keep one failed die as a normal success instead of discarding it.",
  "Range 4\"": "This weapon can only target operatives within 4\" of the shooter. Targets further away aren't valid.",
  "Range 6\"": "This weapon can only target operatives within 6\" of the shooter. Targets further away are not valid.",
  "Range 7\"": "This weapon can only target operatives within 7\" of the shooter. Targets further away are not valid.",
  "Range 8\"": "This weapon can only target operatives within 8\" of the shooter. Targets further away aren't valid. Most pistols have this.",
  "Range 9\"": "This weapon can only target operatives within 9\" of the shooter. Targets further away are not valid.",
  "Relentless": "After rolling your attack dice, re-roll any or all of them. Balanced re-rolls one die and Ceaseless re-rolls one result; this lets you pick every die.",
  "Rending": "If you retain at least one critical success, you can upgrade one normal success to a critical success, so one crit on the roll gives you two.",
  "Saturate": "The defender can't use their cover save (the free normal success for being in cover). The target still counts as in cover for everything else, e.g. whether a Concealed operative can be targeted.",
  "Seek": "When picking a valid target, enemies on Conceal can't use any terrain for cover, so you can target Concealed operatives as long as they're visible. They keep their cover save if they're in cover.",
  "Seek Light": "When picking a valid target, enemies on Conceal can't use Light terrain for cover, so you can target Concealed operatives hiding behind it. They keep their cover save if other terrain still covers them.",
  "Severe": "If you rolled no critical successes, you can upgrade one normal success to a crit, so any roll with a hit gets at least one crit. It doesn't apply if you already have a crit (from a 6 or Lethal). Devastating and Piercing Crits work with the upgraded crit.",
  "Shock": "The first time you strike with a crit in a fight, your opponent also discards one of their unresolved normal successes (or a crit if they have no normals). That leaves them fewer dice to strike back with.",
  "Silent": "This operative can Shoot with this weapon while on a Conceal order (Concealed operatives normally can't Shoot), so snipers can fire and stay hidden.",
  "Stun": "If you retain at least one critical success, the target's APL drops by 1 until the end of its next activation, so it gets one fewer action. An APL 2 operative gets only one.",
  "Torrent 0\"": "This weapon counts as having Torrent for other rules, but you can't select secondary targets the normal way.",
  "Torrent 1\"": "Select your primary target as normal. Then, you may also select any number of additional valid targets within 1\" of the primary target as secondary targets. Each secondary is shot separately with its own attack/defense sequence. Secondary targets cannot be within control range of friendly operatives.",
  "Torrent 2\"": "Select your primary target as normal. Then, you may also select any number of additional valid targets within 2\" of the primary target as secondary targets. Each secondary is shot separately with its own attack/defense sequence. Secondary targets cannot be within control range of friendly operatives.",
  "Poison": "If this weapon deals any damage, the target gains a Poison token (if it doesn't have one). Friendly operatives of the same faction are immune. At the start of each of its activations, a poisoned operative takes 1 damage, so the damage adds up over the turning points.",
  "Toxic": "Against a target that already has one of your Poison tokens, add 1 to both the Normal and Critical Dmg stats. Example: a 3/4 weapon becomes 4/5.",
  "PSYCHIC": "This is a psychic weapon. Some factions limit how you use them; for example, Plague Marines can't pick the same PSYCHIC ranged weapon for both Shoot actions in one activation. Check your faction's Astartes rule.",
  "Explosive": "This operative can Shoot with this weapon even while within an enemy's control range. It's always the primary target itself, and it can't be in cover or obscured. Used by Bomb Squigs.",
  "Concealed Position": "This profile can only be used the first time the operative Shoots in the battle. After that, use another profile.",
};

/* ═══ CORE RULES ═══ */
// Sourced from the Kill Team Lite Rules (Jul '25) and the core rules update log (Jun '26).
// Markers, Pick Up Marker and Place Marker aren't in the Lite rules; they follow the Core Book (Jun '26) as listed on Wahapedia.
// Rules tab item shape: { name, tag?, summary, detail?: string | string[], steps?: string[] }.
// Items with detail get an arrow and expand on tap; steps always show.
const GAME_SEQUENCE = [
  { name: "What you need", summary: "Two kill teams and their datacards, a 30\" x 22\" killzone with terrain (unless the mission says otherwise), a tape measure in inches, 10 six-sided dice, and tokens and markers." },
  { name: "Setting up", summary: "Set up the killzone, decide initiative, pick drop zones, then deploy.", steps: [
    "Set up the killzone and its terrain.",
    "Randomly pick a player to have initiative.",
    "The player with initiative picks a drop zone from the mission map. Without a mission, they pick a killzone edge and their opponent gets the opposite one. Each drop zone is the area within 3\" of that player's edge.",
    "Starting with the player with initiative, take turns setting up one third of your kill team (round up). Each operative must be wholly within your drop zone and starts with a Conceal order.",
  ] },
  { name: "Turning points", summary: "A battle lasts four turning points unless the mission says otherwise. Each turning point has a Strategy phase, then a Firefight phase." },
  { name: "Strategy phase", summary: "Decide initiative, gain CP, ready your operatives, then use strategy ploys.", steps: [
    "Initiative: each player rolls one D6. The highest roller decides who has initiative. On a tie, the player who doesn't have initiative decides.",
    "Gain CP: each player starts the battle with 2CP. In the first Strategy phase, both players gain 1CP. After that, the player with initiative gains 1CP and the other player gains 2CP.",
    "Ready: turn all your operatives' order tokens to the ready side.",
    "Gambits: starting with the player with initiative, take turns using a strategy ploy or passing. The step ends when both players pass one after the other. Each strategy ploy can be used once per turning point.",
  ] },
  { name: "Firefight phase", summary: "Players take turns activating one ready operative at a time, starting with the player with initiative. The turning point ends when every operative is expended.", steps: [
    "Pick one of your ready operatives and choose its order: Engage or Conceal.",
    "Perform actions. Each action costs AP, and the operative can't spend more AP than its APL. It can't perform the same action twice in one activation unless a rule says it can.",
    "When it's done, the operative is expended: flip its order token to the expended side.",
    "You can use firefight ploys during this phase. Each ploy can be used once per turning point, except Command Re-roll.",
  ] },
  { name: "Counteract", summary: "If all your operatives are expended but your opponent still has ready ones, you can counteract when it would be your turn to activate.", detail: [
    "Pick one expended operative with an Engage order. It performs one 1AP action for free (not Guard).",
    "It can't move more than 2\", or be removed and set up more than 2\" away.",
    "Each operative can counteract once per turning point.",
  ] },
  { name: "Winning", summary: "Missions set the objectives that score victory points (VP). The player with the most VP at the end of the battle wins." },
];

const CORE_CONCEPTS = [
  { name: "Datacard stats", summary: "Each operative has four stats: APL, Move, Save and Wounds.", detail: [
    "APL (Action Point Limit): the most AP it can spend in one activation.",
    "Move: how far it moves with a Reposition, in inches.",
    "Save: the score each defense die needs to succeed. Lower is better.",
    "Wounds: how much damage it can take.",
  ] },
  { name: "Weapon stats", summary: "Each weapon has Atk, Hit and Dmg, plus any weapon rules.", detail: [
    "Atk: how many attack dice you roll.",
    "Hit: the score each attack die needs to succeed. Lower is better.",
    "Dmg: two numbers, normal/critical. 3/4 means 3 damage for each normal success and 4 for each critical success.",
    "Weapon rules change how the attack works. See Combat, Weapon rules.",
  ] },
  { name: "Orders", visual: "orders", summary: "Every operative has an Engage or Conceal order. You choose it each time the operative activates.", detail: [
    "Engage: can Shoot, Charge and counteract. Enemies can target it whenever it's visible.",
    "Conceal: can't Shoot, Charge or counteract. Enemies can't target it while it's in cover. It can still move, Dash, fight in melee and pick up markers.",
    "The order token has a ready side and an expended side, so it also shows whether the operative has activated this turning point.",
  ] },
  { name: "Dice", summary: "Kill Team uses six-sided dice (D6). A 6 is always a critical success. A 1 always fails.", detail: [
    "Any other result that equals or beats the stat is a normal success.",
    "A die can only be re-rolled once, whatever rules you have.",
    "Dice you keep without rolling them (cover saves, Accurate) can't be re-rolled.",
  ] },
  { name: "Command Points and ploys", summary: "Spend CP on ploys. Each ploy costs 1CP.", detail: [
    "Strategy ploys are used in the Gambits step of the Strategy phase. Firefight ploys are used in the Firefight phase.",
    "Each ploy can be used once per turning point, except Command Re-roll.",
  ] },
  { name: "Command Re-roll", tag: "1CP", summary: "Firefight ploy. After rolling your attack or defense dice, re-roll one of them." },
  { name: "Control range", visual: "control", summary: "Something within 1\" of an operative and visible to it is within its control range.", detail: "Control range is mutual. If it's true for either operative, they're both within each other's control range." },
  { name: "Valid target", summary: "An Engage operative is a valid target if it's visible. A Conceal operative is a valid target only if it's visible and not in cover." },
  { name: "Markers and objectives", summary: "Operatives contest markers within their control range. You control a marker if the total APL of your operatives contesting it is higher than your opponent's.", detail: [
    "On a tie, nobody controls it. Control can't change in the middle of an action.",
    "Objective markers are 40mm across. Other markers are 20mm.",
    "An operative carrying a marker is the only one that contests and controls it, and the marker counts as being wherever that operative is.",
    "Your mission says which markers score VP and which ones can be picked up.",
  ] },
  { name: "Damage", summary: "Damage reduces an operative's wounds.", detail: [
    "Wounded: fewer wounds than it started with.",
    "Injured: fewer than half its starting wounds. Subtract 2\" from its Move and worsen its weapons' Hit by 1.",
    "Incapacitated: 0 wounds or fewer. Remove it from the killzone.",
  ] },
];

const CORE_ACTIONS = [
  { name: "Reposition", tag: "1AP", summary: "Move up to the operative's Move stat. It can't move within control range of an enemy.", detail: "Not allowed while within an enemy's control range, or in the same activation as Charge or Fall Back." },
  { name: "Dash", tag: "1AP", summary: "Move up to 3\". No climbing.", detail: "Not allowed while within an enemy's control range, or in the same activation as Charge." },
  { name: "Fall Back", tag: "2AP", summary: "Move away from an enemy. You can pass through enemy control range but can't finish there.", detail: "Only allowed while an enemy is within control range. Not in the same activation as Reposition or Charge." },
  { name: "Charge", visual: "charge", tag: "1AP", summary: "Move up to your Move stat plus 2\" and finish within an enemy's control range.", detail: [
    "Once you reach an enemy that no other friendly operative is within control range of, you can't leave its control range during the move.",
    "Not allowed with a Conceal order, while already within an enemy's control range, or in the same activation as Reposition, Dash or Fall Back.",
  ] },
  { name: "Shoot", tag: "1AP", summary: "Shoot a ranged weapon at a valid target. See Combat, Shooting.", detail: "Not allowed with a Conceal order, or while within an enemy's control range." },
  { name: "Fight", tag: "1AP", summary: "Fight an enemy within control range with a melee weapon. See Combat, Fighting.", detail: "Only allowed while an enemy is within control range." },
  { name: "Pick Up Marker", tag: "1AP", summary: "Pick up a marker the operative controls, if the mission says that marker can be picked up. The operative now carries it.", detail: [
    "While carrying it, the operative is the only one that contests and controls that marker.",
    "Not allowed while within an enemy's control range, or while already carrying a marker.",
  ] },
  { name: "Place Marker", tag: "1AP", summary: "Put down a marker the operative is carrying, within its control range.", detail: [
    "Not allowed in the same activation as Pick Up Marker.",
    "If an operative carrying a marker is incapacitated, it places the marker for 0AP before it's removed, even if other rules would stop it.",
  ] },
];

