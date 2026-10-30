/* ═══ ROSTER & COMPOSITION HELPERS ═══
   composition: {
     total: selections in a full team (for the "x/total" counters),
     groups: [{ name, desc, min, max, ids, equip?, extra? }]  each operative id belongs to one group;
             `equip` = faction equipment id that unlocks the group (then it must be filled to `max`),
             `extra` = these operatives don't count toward `total` selections,
     repeatable: ids that can be taken more than once (others: once),
     maxCount: { id: n }  per-id cap for repeatables,
     caps: [{ ids, max, label, whenAny? }]  at most `max` operatives from `ids` combined
             (only while the roster has any of `whenAny`, if given),
     exclusive: [{ sets: [[ids], [ids]], label }]  operatives from different sets can't be mixed,
     pools: [{ groups: [group names], min, max, label, whenAny? }]  shared total across several groups
             (whenAny: { ids, min, max } replaces min/max while the roster has any of those ids),
     requires: [{ id, needs, label }]  `id` can only be taken alongside `needs`,
     cost: { id: 0.5 | 2 }  selection weight (default 1),
     rules: [text shown in the Team Composition panel],
   } */
const baseOf = (o) => o.baseId || o.id;

// Repeat copies get their own id ("boy~2") and name ("Kommando Boy 2") so wounds,
// activation and multiplayer sync track each copy separately.
// The opponent's equipment for one of their operatives: weapons it adds and effects to list on the card.
// Worked out from saved data, so it survives a reload and works for online opponents too.
const oppEquipFor = (faction, oppEq, oppUEq, op) => {
  const weapons = [];
  const effects = [];
  let ignoreInjured = false;
  faction.equipment.forEach(q => {
    if (!oppEq[q.id]) return;
    if (op.ex && op.ex.includes(q.id)) return;
    if (q.ex && q.ex.includes(baseOf(op))) return;
    if (q.gw) weapons.push({ ...q.gw });
    if (q.mod === "ignore_injured") { ignoreInjured = true; effects.push(q.name + ": Ignore injured stat changes."); }
    else if (q.mod === "poison_bolts") {
      if (op.ranged.some(r => r.name.toLowerCase().includes("boltgun") || r.name.toLowerCase().includes("bolt pistol")))
        effects.push("Plague Rounds: boltguns and bolt pistols gain Poison and Severe.");
    } else if (q.mod === "remove_range") {
      if (op.ranged.some(r => r.name.toLowerCase().includes("slugga") || r.name.toLowerCase().includes("shokka")))
        effects.push("Collapsible Stocks: the slugga and shokka pistol lose their Range limit.");
    } else if (!q.gw && !q.mod) effects.push(q.name + ": " + q.desc);
  });
  UNIV_EQUIP.forEach(q => {
    if (!oppUEq[q.id]) return;
    if (q.gw) weapons.push({ ...q.gw });
    if (!q.gw && !q.mod) effects.push(q.name + ": " + q.desc);
  });
  return { weapons, effects, ignoreInjured };
};
function makeInstance(op, n) {
  return n === 1 ? { ...op } : { ...op, id: op.id + "~" + n, baseId: op.id, name: op.name + " " + n };
}
// A roster keeps a copy of each operative's datacard. This refreshes the copies from the current team data,
// so rules fixes reach teams built before them. Ids stay the same (wounds and orders are keyed by them),
// except that repeats saved by old versions with the same id get numbered.
function freshOps(faction, ops) {
  if (!faction || !Array.isArray(ops)) return ops;
  const used = new Set();
  return ops.map(o => {
    const bid = baseOf(o);
    const base = faction.operatives.find(x => x.id === bid);
    if (!base) return o;
    let id = o.id;
    if (used.has(id)) { let n = 2; while (used.has(bid + "~" + n) || ops.some(p => p.id === bid + "~" + n)) n++; id = bid + "~" + n; }
    used.add(id);
    const n = id.includes("~") ? parseInt(id.split("~")[1]) || 1 : 1;
    const fresh = { ...o, ...base, id };
    if (n === 1 && id === bid) { delete fresh.baseId; return fresh; }
    return { ...fresh, baseId: bid, name: base.name + " " + n };
  });
}
function makeInstances(faction, baseIds) {
  const seen = {};
  return baseIds.map(bid => {
    const op = faction.operatives.find(x => x.id === bid);
    if (!op) return null;
    seen[bid] = (seen[bid] || 0) + 1;
    return makeInstance(op, seen[bid]);
  }).filter(Boolean);
}

const compCost = (c, bid) => (c.cost && c.cost[bid]) || 1;
const compMaxCount = (c, bid) => (c.maxCount && c.maxCount[bid]) || ((c.repeatable || []).includes(bid) ? 99 : 1);
const compCount = (roster, bid) => roster.filter(o => baseOf(o) === bid).length;
const compSelections = (c, roster) => {
  const extra = c.groups.filter(g => g.extra).flatMap(g => g.ids);
  return roster.filter(o => !extra.includes(baseOf(o))).reduce((s, o) => s + compCost(c, baseOf(o)), 0);
};
const capActive = (cap, roster) => !cap.whenAny || roster.some(o => cap.whenAny.includes(baseOf(o)));
const exclusiveClash = (ex, roster, bid) => {
  const setOf = (id) => ex.sets.findIndex(set => set.includes(id));
  const used = new Set(roster.map(o => setOf(baseOf(o))).filter(i => i >= 0));
  if (bid !== undefined && setOf(bid) >= 0) used.add(setOf(bid));
  return used.size > 1;
};
const compGroupUsed = (c, roster, g) => roster.filter(o => g.ids.includes(baseOf(o))).reduce((s, o) => s + compCost(c, baseOf(o)), 0);
const poolLimits = (pool, roster) => (pool.whenAny && roster.some(o => pool.whenAny.ids.includes(baseOf(o)))) ? pool.whenAny : pool;
const poolUsed = (c, roster, pool) => c.groups.filter(g => pool.groups.includes(g.name)).reduce((s, g) => s + compGroupUsed(c, roster, g), 0);
const opName = (f, bid) => { const o = f.operatives.find(x => x.id === bid); return o ? o.name : bid; };

function compCanAdd(f, roster, bid, eq) {
  const c = f.composition;
  const g = c.groups.find(gr => gr.ids.includes(bid));
  if (!g) return false;
  if (g.equip && !(eq && eq[g.equip])) return false;
  if (compGroupUsed(c, roster, g) + compCost(c, bid) > g.max) return false;
  if (compCount(roster, bid) >= compMaxCount(c, bid)) return false;
  for (const pool of c.pools || []) {
    if (pool.groups.includes(g.name) && poolUsed(c, roster, pool) + compCost(c, bid) > poolLimits(pool, [...roster, { id: bid }]).max) return false;
  }
  const next = [...roster, { id: bid }];
  for (const cap of c.caps || []) {
    const touches = cap.ids.includes(bid) || (cap.whenAny || []).includes(bid);
    if (touches && capActive(cap, next) && next.filter(o => cap.ids.includes(baseOf(o))).length > cap.max) return false;
  }
  for (const ex of c.exclusive || []) {
    if (exclusiveClash(ex, roster, bid)) return false;
  }
  for (const rq of c.requires || []) {
    if (rq.id === bid && compCount(roster, rq.needs) === 0) return false;
  }
  return true;
}

function compCheck(f, roster, eq) {
  const c = f.composition;
  const errors = [];
  const warnings = [];
  c.groups.forEach(g => {
    const used = compGroupUsed(c, roster, g);
    if (g.equip && used > 0 && !(eq && eq[g.equip])) errors.push(g.name + " need the " + (f.equipment.find(q => q.id === g.equip) || {}).name + " equipment.");
    const min = g.equip ? (eq && eq[g.equip] ? g.max : 0) : g.min;
    if (used > g.max) errors.push(g.name + ": " + used + " selected, max " + g.max + ".");
    else if (used < min) warnings.push(g.name + ": need " + (min - used) + " more (" + used + "/" + min + ").");
  });
  (c.pools || []).forEach(pool => {
    const used = poolUsed(c, roster, pool);
    const lim = poolLimits(pool, roster);
    if (used > lim.max) errors.push(pool.label + ": " + used + " selected, max " + lim.max + ".");
    else if (used < lim.min) warnings.push(pool.label + ": need " + (lim.min - used) + " more (" + used + "/" + lim.min + ").");
  });
  const counted = {};
  roster.forEach(o => { counted[baseOf(o)] = (counted[baseOf(o)] || 0) + 1; });
  Object.keys(counted).forEach(bid => {
    const max = compMaxCount(c, bid);
    if (counted[bid] > max) errors.push(opName(f, bid) + (max === 1 ? " can only be included once." : " is limited to " + max + "."));
  });
  (c.caps || []).forEach(cap => {
    const n = roster.filter(o => cap.ids.includes(baseOf(o))).length;
    if (capActive(cap, roster) && n > cap.max) errors.push(cap.label + " (" + n + " selected).");
  });
  (c.exclusive || []).forEach(ex => {
    if (exclusiveClash(ex, roster)) errors.push(ex.label);
  });
  (c.requires || []).forEach(rq => {
    if (counted[rq.id] && !counted[rq.needs]) errors.push(rq.label);
  });
  const complete = roster.length > 0 && errors.length === 0 && warnings.length === 0;
  return { errors, warnings, complete, selections: compSelections(c, roster) };
}

/* ═══ UNIVERSAL EQUIPMENT (Builder) ═══ */
const UNIV_EQUIP = [
  { id: "frag_gren", name: "Frag Grenades", category: "Explosive Grenades", desc: "Select 2 explosive grenades total (2 frag, 2 krak, or 1 each). Uses shared across kill team.",
    gw: { type: "ranged", name: "Frag grenade", atk: 4, hit: "4+", dmg: "2/4", wr: "Range 6\", Blast 2\", Saturate", note: "Explosive grenade (shared uses)" }, mod: null },
  { id: "krak_gren", name: "Krak Grenades", category: "Explosive Grenades", desc: "Select 2 explosive grenades total (2 frag, 2 krak, or 1 each). Uses shared across kill team.",
    gw: { type: "ranged", name: "Krak grenade", atk: 4, hit: "4+", dmg: "4/5", wr: "Range 6\", Piercing 1, Saturate", note: "Explosive grenade (shared uses)" }, mod: null },
  { id: "smoke_gren", name: "Smoke Grenades", category: "Utility Grenades", desc: "1AP action. Place Smoke marker within 6\". Creates 1\" smoke area (obscures operatives wholly within, >2\" away). Select 2 utility grenades total.",
    gw: null, mod: null },
  { id: "stun_gren", name: "Stun Grenades", category: "Utility Grenades", desc: "1AP action. Select visible enemy within 6\". It + operatives within 1\" take stun test (D6: 3+ = -1 APL). Select 2 utility grenades total.",
    gw: null, mod: null },
  { id: "ammo_cache", name: "Ammo Cache", category: "Equipment", desc: "Set up marker in territory. Operative controlling it: Ammo Resupply (0AP) = re-roll one attack die when shooting with datacard weapons. Once per turning point.",
    gw: null, mod: null },
  { id: "razor_wire", name: "Razor Wire", category: "Terrain", desc: "Exposed & Obstructing terrain. Set up in your territory. Crossing within 1\" costs +1\" extra movement.",
    gw: null, mod: null },
  { id: "mines", name: "Mines", category: "Equipment", desc: "Set up marker in territory (>2\" from markers/access points). First operative within control range: remove marker, inflict D3+3 damage.",
    gw: null, mod: null },
  { id: "light_barricade", name: "Light Barricades (x2)", category: "Terrain", desc: "Light terrain (feet are Insignificant/Exposed). Set up in territory on killzone floor, >2\" from other equipment terrain.",
    gw: null, mod: null },
  { id: "heavy_barricade", name: "Heavy Barricade", category: "Terrain", desc: "Heavy terrain. Set up within 4\" of drop zone on killzone floor, >2\" from other equipment terrain.",
    gw: null, mod: null },
  { id: "ladders", name: "Ladders (x2)", category: "Terrain", desc: "Insignificant/Exposed. Set up upright against terrain 2\"+ tall. Once/action: climbing that terrain = treat vertical as 1\" if ladder in control range.",
    gw: null, mod: null },
  { id: "portable_barricade", name: "Portable Barricade", category: "Terrain", desc: "Light, Protective, Portable terrain. Improve Save by 1 (max 2+) when in cover from it. Connected operative can Move With Barricade (1AP).",
    gw: null, mod: null },
  { id: "comms_device", name: "Comms Device", category: "Equipment", desc: "Set up marker in territory. While friendly controls it: add 3\" to SUPPORT rules distance requirements.",
    gw: null, mod: null },
  { id: "breaching_charge", name: "Breaching Charge", category: "Equipment", desc: "Once per battle: Breach action for -1AP (min 1AP) as if operative had 'breach marker' on datacard.",
    gw: null, mod: null },
];

/* ═══ SEQUENCE ═══ */
const SEQ_PHASES = [
  { id: "strategy", name: "Strategy Phase", color: "var(--accent)", icon: "\u2694",
    checks: [
      { text: "Roll for initiative (both D6, highest decides; tie = non-initiative player decides)", detail: "Winner decides who has initiative. Initiative player activates first and resolves simultaneous effects." },
      { text: "Gain Command Points", detail: "turning point 1: both players gain 1CP. turning point 2+: initiative player gains 1CP, other player gains 2CP. CP carry over between turning points." },
      { text: "Ready all operatives (flip order tokens to Ready)", detail: "All operatives become Ready regardless of previous status." },
      { text: "Alternate Strategic Gambits or pass (until both pass in succession)", detail: "Starting with initiative player, alternate using a Strategic Gambit (costs 1CP) or passing. All strategy ploys are Strategic Gambits. Each gambit max once per turning point." },
    ],
    reminders: ["Initiative decides activation order AND simultaneous effect resolution.", "CP from previous turning points carry over, so count any you didn't spend.", "You must pass when you have no more gambits to use or want to save CP.", "Strategy ploy effects last until end of turning point (unless stated otherwise)."],
  },
  { id: "firefight", name: "Firefight Phase", color: "#E0664A", icon: "\uD83D\uDD25",
    checks: [
      { text: "Initiative player activates a Ready operative first", detail: "Select one Ready friendly operative to activate." },
      { text: "Determine order: Engage or Conceal", detail: "Engage: can Shoot, Charge, counteract, but targetable. Conceal: not a valid target in cover, but can't Shoot, Charge, or counteract." },
      { text: "Perform actions (spend AP up to APL)", detail: "Each action costs AP. Can't exceed APL. Can't repeat same action (usually). Resolve each action before deciding the next." },
      { text: "Expend the operative (flip token to Expended)", detail: "Operative is done for this turning point. Cannot activate again." },
      { text: "Opponent activates one of their Ready operatives", detail: "Alternate until all operatives on both sides are expended." },
      { text: "Counteract if all yours are expended (optional)", detail: "One Engaged expended operative: free 1AP action (excluding Guard), max 2\" move, once per turning point per operative." },
    ],
    reminders: ["Concealed operatives CANNOT Shoot, Charge, or counteract.", "Kommandos with Throat Slittas CAN Charge while Concealed.", "If one player runs out of operatives, the other activates the rest. Consider counteracting.", "Firefight ploys can be used during this phase (1CP each, max once per turning point except Command Re-roll).", "Action restrictions: can't do same action twice per activation (unless a rule says otherwise)."],
    actions: [
      { name: "Reposition", ap: 1, summary: "Move up to Move stat. Not into enemy control range." },
      { name: "Dash", ap: 1, summary: "Move up to 3\". No climbing." },
      { name: "Charge", ap: 1, summary: "Move+2\" into enemy control range. Must finish there. Engage only." },
      { name: "Shoot", ap: 1, summary: "Ranged weapon at valid target. Engage only. Not in enemy control range." },
      { name: "Fight", ap: 1, summary: "Melee against enemy in control range. Enemy retaliates." },
      { name: "Fall Back", ap: 2, summary: "Move out of enemy control range. Can't finish in enemy control range." },
      { name: "Pick Up Marker", ap: 1, summary: "Take a marker you control. Not in enemy control range." },
      { name: "Place Marker", ap: 1, summary: "Place carried marker within control range." },
    ],
  },
  { id: "shooting", name: "Shooting (reference)", color: "#E0664A", icon: "\uD83C\uDFAF", isRef: true,
    steps: [
      "SELECT WEAPON: Choose one ranged weapon, collect ATK dice.",
      "SELECT TARGET: Valid target, no friendlies in its control range. Engage = visible. Conceal = visible + not in cover.",
      "ROLL ATTACK: D6s >= Hit stat = success. 6 = crit. 1 = fail. Obscured: discard 1 success, crits become normals.",
      "ROLL DEFENSE: 3D6 >= Save stat. In cover: +1 auto normal (cover save). 6 = crit.",
      "RESOLVE DEFENSE: Normal blocks normal. Crit blocks normal/crit. Two normals block crit.",
      "RESOLVE ATTACK: Unblocked normal = Normal Dmg. Unblocked crit = Critical Dmg.",
    ],
  },
  { id: "fighting", name: "Fighting (reference)", color: "#E0664A", icon: "\u2620", isRef: true,
    steps: [
      "SELECT ENEMY: Choose enemy in control range. They retaliate.",
      "SELECT WEAPONS: Both players pick melee weapon, collect ATK dice.",
      "ROLL ATTACK: Both roll simultaneously. >= Hit = success. 6 = crit. Assists: +1 Hit per friendly in control range of enemy.",
      "RESOLVE (alternate): Starting with attacker. STRIKE = deal damage immediately. BLOCK = cancel one opponent success.",
    ],
  },
  { id: "end", name: "End of Turning Point", color: "#9B59B6", icon: "\uD83D\uDCDC",
    checks: [
      { text: "Score Victory Points from mission objectives", detail: "Check which objectives/Tac Ops have been achieved. Score VP as specified by mission." },
      { text: "Check marker control", detail: "Operatives contest markers within control range. Control = higher total APL contesting. Control can't change during an action." },
      { text: "Remove incapacitated operatives", detail: "Any operatives reduced to 0 wounds are removed from the killzone." },
      { text: "Begin next Turning Point (or end game after turning point 4)", detail: "Return to Strategy Phase. After 4 turning points, the player with the most VP wins." },
    ],
    reminders: ["APL determines marker control. Icon Bearers count their APL as 1 higher.", "Some Tac Ops only score in specific turning points, so check timing.", "Games last exactly 4 turning points unless mission says otherwise."],
  },
];

const CP_TABLE = [
  { tp: 1, init: 1, other: 1, note: "Both players gain 1CP" },
  { tp: 2, init: 1, other: 2, note: "Non-initiative player catches up" },
  { tp: 3, init: 1, other: 2, note: "Same as turning point 2" },
  { tp: 4, init: 1, other: 2, note: "Final turning point" },
];

