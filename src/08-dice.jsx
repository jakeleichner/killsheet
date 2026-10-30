/* ═══ DICE ROLLER ═══ */
/* ═══ DICE MATHS ═══ */
// Kept apart from the dice roller so the self-test can check it with fixed dice.
// The weapon rules that change the dice, read from a weapon's rules text.
function diceRules(w) {
  const wr = w.wr || "";
  const n = (re) => { const m = wr.match(re); return m ? parseInt(m[1]) : 0; };
  return {
    hit: parseInt(w.hit) || 6,
    lethal: n(/Lethal (\d)\+/), accurate: n(/Accurate (\d)/), devastating: n(/Devastating (\d)/),
    piercing: n(/Piercing (\d)/), piercingCrits: n(/Piercing Crits (\d)/),
    severe: /Severe/.test(wr), rending: /Rending/.test(wr), punishing: /Punishing/.test(wr),
    brutal: /Brutal/.test(wr), saturate: /Saturate/.test(wr),
  };
}
// One attack die. A 1 always fails and a 6 is always a crit; with Lethal x+, successes of x or more are crits.
function attackDie(v, r) {
  if (v === 1) return "fail";
  if (v === 6) return "crit";
  if (v < r.hit) return "fail";
  return r.lethal && v >= r.lethal ? "crit" : "hit";
}
// What the attacker keeps. `dice` are the rolled dice; Accurate dice are set aside as normal successes instead of rolled.
function attackResult(dice, r, obscured) {
  let crits = 0, hits = 0, fails = 0;
  dice.forEach(d => { const c = attackDie(d, r); if (c === "crit") crits++; else if (c === "hit") hits++; else fails++; });
  hits += r.accurate;
  let severeApplied = false, rendingApplied = false, punishingApplied = false, obscuredLost = 0;
  if (r.severe && crits === 0 && hits > 0) { crits++; hits--; severeApplied = true; }
  // A crit made by Severe doesn't trigger Rending or Punishing.
  if (r.rending && !severeApplied && crits > 0 && hits > 0) { crits++; hits--; rendingApplied = true; }
  if (r.punishing && !severeApplied && crits > 0 && fails > 0) { hits++; fails--; punishingApplied = true; }
  // Obscured: crits count as normal successes and the attacker discards one success.
  if (obscured) { hits += crits; crits = 0; if (hits > 0) { hits--; obscuredLost = 1; } }
  return { crits, hits, fails, severeApplied, rendingApplied, punishingApplied, obscuredLost, accurateBonus: r.accurate, devastating: r.devastating, devastatingDmg: r.devastating * crits };
}
// Shooting: 3 defense dice, fewer with Piercing (or Piercing Crits when the attacker kept a crit).
// In cover, one of them is a save kept without rolling, unless the weapon has Saturate.
function defenceDiceCount(r, atk, cover) {
  const total = Math.max(0, 3 - r.piercing - (atk && atk.crits > 0 ? r.piercingCrits : 0));
  const coverSave = cover && !r.saturate && total > 0 ? 1 : 0;
  return { roll: total - coverSave, coverSave };
}
// Damage that gets through when the defender blocks as well as they can.
// Shooting: a crit save blocks a crit or a normal hit, a normal save blocks a normal hit, and two normal saves block a crit.
// Fighting: the same, except normal successes can't block crits, and against Brutal only crits block.
function damageThrough(atk, def, normalDmg, critDmg, melee, brutal) {
  const saves = melee && brutal ? 0 : def.saves;
  let best = Infinity;
  for (let c = 0; c <= Math.min(def.crits, atk.crits); c++) {
    const critsLeft = atk.crits - c;
    const hitsLeft = atk.hits - Math.min(atk.hits, def.crits - c);
    for (let pairs = 0; pairs <= (melee ? 0 : Math.min(critsLeft, Math.floor(saves / 2))); pairs++) {
      best = Math.min(best, (critsLeft - pairs) * critDmg + Math.max(0, hitsLeft - (saves - 2 * pairs)) * normalDmg);
    }
  }
  return best + atk.devastatingDmg;
}

