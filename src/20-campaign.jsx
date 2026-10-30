/* ═══ CAMPAIGN: CTESIPHUS EXPEDITION ═══ */
// Maps from the campaign PDF. Each column lists hex number @ row, with rows counted in half-hex steps
// (flat-topped hexes: neighbors are the same column ±2 rows, or the next column ±1 row).
const CTE_MAPS = [
  { id: "m26", name: "Map 1 (26 hexes)", cols: ["1@1 3@3 7@5 12@7", "2@0 4@2 8@4 13@6 17@8 21@10", "5@1 9@3 14@5 18@7 22@9 25@11", "6@0 10@2 15@4 19@6 23@8 26@10", "11@1 16@3 20@5 24@7"],
    blocked: [1, 11, 21, 24], tomb: [4, 8, 9, 10, 13, 14, 15, 18, 19, 22] },
  { id: "m33", name: "Map 2 (33 hexes)", cols: ["1@3 5@5 10@7 16@9", "2@2 6@4 11@6 17@8 22@10 27@12", "3@1 7@3 12@5 18@7 23@9 28@11 31@13", "4@0 8@2 13@4 19@6 24@8 29@10 32@12", "9@1 14@3 20@5 25@7 30@9 33@11", "15@2 21@4 26@6"],
    blocked: [3, 15, 17, 30], tomb: [6, 7, 8, 11, 12, 13, 14, 18, 19, 20, 23, 24, 28, 29] },
  { id: "m36", name: "Map 3 (36 hexes)", cols: ["1@3 5@5 10@7 15@9 20@11 25@13", "2@2 6@4 11@6 16@8 21@10 26@12 30@14", "3@1 7@3 12@5 17@7 22@9 27@11 31@13 34@15", "4@0 8@2 13@4 18@6 23@8 28@10 32@12 35@14", "9@1 14@3 19@5 24@7 29@9 33@11 36@13"],
    blocked: [2, 10, 24, 25, 36], tomb: [6, 7, 8, 12, 13, 16, 18, 21, 22, 26, 27, 28, 31, 32] },
  { id: "m37", name: "Map 4 (37 hexes)", cols: ["1@1 3@3 7@5 12@7 17@9 22@11 27@13", "2@0 4@2 8@4 13@6 18@8 23@10 28@12 32@14", "5@1 9@3 14@5 19@7 24@9 29@11 33@13", "6@0 10@2 15@4 20@6 25@8 30@10 34@12 36@14", "11@1 16@3 21@5 26@7 31@9 35@11 37@13"],
    blocked: [6, 19, 22, 35], tomb: [4, 8, 9, 10, 13, 14, 15, 18, 20, 23, 24, 25, 28, 29, 30, 34] },
  { id: "m52", name: "Map 5 (52 hexes)", cols: ["1@2 4@4 9@6 15@8 21@10 27@12 33@14 39@16", "2@1 5@3 10@5 16@7 22@9 28@11 34@13 40@15 45@17", "3@0 6@2 11@4 17@6 23@8 29@10 35@12 41@14 46@16", "7@1 12@3 18@5 24@7 30@9 36@11 42@13 47@15 50@17", "8@0 13@2 19@4 25@6 31@8 37@10 43@12 48@14 51@16", "14@1 20@3 26@5 32@7 38@9 44@11 49@13 52@15"],
    blocked: [5, 7, 15, 25, 35, 40, 44], tomb: [6, 10, 11, 12, 13, 16, 17, 18, 19, 22, 23, 24, 28, 29, 30, 31, 34, 36, 37, 41, 42, 43, 47, 48] },
].map(m => {
  const pos = {}, at = {};
  m.cols.forEach((col, ci) => col.split(" ").forEach(t => { const [n, r] = t.split("@").map(Number); pos[n] = [ci, r]; at[ci + "," + r] = n; }));
  return { ...m, pos, at, hexes: Object.keys(pos).map(Number).sort((a, b) => a - b) };
});

// Locations and conditions (D36: first a D3, then a D6; 11-16 is always Ruin / Clear and can repeat).
// res: what an explored hex starts with, e.g. "supply:D6" (rolled when explored).
const CTE_RULES = {
  SL11: { name: "Ruin", text: "No extra rules. This can come up more than once." },
  SL21: { name: "Tectonic Fissure", text: "This hex becomes blocked." },
  SL22: { name: "Abandoned Camp", text: "When explored, roll a D6: that's how much Supply it holds. Search: gain D3 of its Supply until it runs out.", res: "Supply:D6" },
  SL23: { name: "Cryovolcanic Edifices", text: "Search: spend 1 or 2 SP and roll that many D3. 1: nothing. 2: gain D3 SP. 3: gain 1 Campaign point. You get each of the 2 and 3 results once per campaign." },
  SL24: { name: "Asteroid Impact", text: "You can't Resupply here. Moving from here costs 1 extra SP into a surface hex, and nothing into a tomb hex." },
  SL25: { name: "Landing Site", text: "Encamp costs 1 SP here. Resupply here gains D3 extra SP." },
  SL26: { name: "Observation Tower", text: "Search: a free Scout, either of any unexplored surface hex, or of one within 3 hexes rolling its location twice and picking one. Camp: when you explore a surface hex, roll its location twice and pick one, and Scout never costs you more than 1 SP for a surface hex." },
  SL31: { name: "Crashed Ship", text: "When explored, roll a D6: that's how much intel it holds. Search: gain D3 of its intel until it runs out. Each intel is a free Scout of any unexplored surface hex.", res: "Intel:D6" },
  SL32: { name: "Resource Stockpile", text: "When explored, roll 2D6: that's how much Supply it holds. Search: gain D6 of its Supply until it runs out.", res: "Supply:2D6" },
  SL33: { name: "Starsteles", text: "Search: roll a D3. 1: nothing. 2: move your kill team to a different surface hex. 3: move it to a tomb hex. Not into a hex that already holds two kill teams. Camp: +1 Campaign point.", campCp: true },
  SL34: { name: "Blackstone Obelisk", text: "Search: gain 1 Campaign point (once per campaign). Camp: +1 Campaign point.", campCp: true },
  SL35: { name: "Forsaken Fortress", text: "The first player to Encamp here can move their base here instead (the old base becomes an Abandoned Camp) and gains 1 Campaign point. Camp: +1 Campaign point (not if it's your base). Search: gain D3 SP, unless an opponent has a base or camp here.", campCp: true },
  SL36: { name: "Beast Lair", text: "Threat phase: anyone within 2 surface hexes may be attacked. Roll off, adding 1 for each hex away (up to 2); the loser loses D6 SP. If you're the only one nearby, roll a D6 (with the same bonus): on a 5+ you escape. No one can Encamp here until it's been Demolished, and it can't be Demolished in the round it's explored. The first Demolish kills the beast." },
  TL11: { name: "Ruin", text: "No extra rules. This can come up more than once." },
  TL21: { name: "Transdimensional Portal", text: "Search: pick a tomb hex and a surface hex (replacing earlier picks). A kill team that starts a Manoeuvre here can move to one of them as if it were 1 hex away, then up to 2 more. Once per round." },
  TL22: { name: "Transeptum Maze", text: "Moving out of this hex costs 1 extra SP. Camp: no one can Demolish here (except through a Doomsday Vault), and you ignore the extra cost." },
  TL23: { name: "Crucible of Whispers", text: "When explored, roll a D3: that's how many Campaign points it holds. Search: spend 1, 3 or 5 SP and roll 1, 2 or 3 D6; any 5+ gains 1 of its Campaign points. Camp: at the start of each Threat phase, roll a D6: on a 5+, gain 1 of its Campaign points.", res: "CP:D3" },
  TL24: { name: "Power Cell Sanctum", text: "The first Demolish here makes every other player with a kill team in a tomb hex lose D6 SP, and no one can Encamp here again. You don't need an opponent's camp here to Demolish it. Camp: +1 Campaign point. Solo: Demolishing here raises the threat level by D3.", campCp: true },
  TL25: { name: "Transtechnic Fulcrum", text: "Search: pick another tomb hex to become blocked (the previous pick, if any, is unblocked). A camp there stays but doesn't count for Regroup." },
  TL26: { name: "Energy Hot Spot", text: "Camp: +1 Campaign point, and gain 1 SP at the start of each Threat phase.", campCp: true },
  TL31: { name: "Vivitrophic Terminal", text: "Search: roll 2D6. You can spend that many SP to gain 1 Campaign point (once per campaign). Camp: at the end of the campaign, if you have 5 or more SP, gain 1 Campaign point." },
  TL32: { name: "Hyperfractal Gaol", text: "The first Encamp here releases the prisoner; the first Demolish here removes it. Camp: at the start of each Threat phase, move the prisoner up to D3 hexes. Unless it ends in the Transeptum Maze, each other player with a kill team there loses D6 SP and you remove an opponent's camp there. If that happened, roll a D6 at the end of each Threat phase: on a 4+, the prisoner is removed." },
  TL33: { name: "Revivification Crypt", text: "At the start of each Action phase, anyone here gets a free Resupply (and can still take another action, but not Resupply). Camp: at the start of each Threat phase, roll a D3: on a 2+, gain that many SP." },
  TL34: { name: "Astral Augury", text: "Search: the first player to search gains D3 Campaign points; later players gain 1. Once per player per campaign." },
  TL35: { name: "Doomsday Vault", text: "When explored, roll a D3: searching costs that many extra SP. Search: pick a tomb hex and Demolish it for free (your own camp there is removed). It becomes blocked and you gain 1 Campaign point. Solo: searching here raises the threat level by D3.", res: "Extra cost:D3" },
  TL36: { name: "Dimension Matrix", text: "Search: take the dimensional key (if no one has it). In a Movement phase you can use it to move your kill team to any hex (not one holding two kill teams) for 1 SP. The key then returns here." },
  SC11: { name: "Clear Conditions", text: "No extra rules. This can come up more than once." },
  SC21: { name: "Dust Storms", text: "Ranged weapons get a worse Hit by 1 (not stacking with being injured), unless Heavy terrain is in the operative's control range, it's wholly within a stronghold, or part of its base is under Vantage terrain." },
  SC22: { name: "Radiation Field", text: "When an operative activates with no Heavy terrain in its control range, roll a D6. If it's below the operative's Save, it takes damage equal to the roll." },
  SC23: { name: "Blighted Land", text: "In each Ready step, every operative on the killzone floor takes 1 damage, except those wholly within a stronghold." },
  SC24: { name: "Missile Strike", text: "In the first Ready step, one player rolls a D3 and adds 1. In the Ready step of that turning point, every operative within 6\" of the killzone center takes D6+3 damage (roll for each)." },
  SC25: { name: "Minefield", text: "Set up a Mines marker on the center of each objective. Each player must take the mines equipment, but can take 5 equipment options instead of 4." },
  SC26: { name: "Skull Mounds", text: "The winner gains 1 extra Campaign point (once per player per campaign)." },
  SC31: { name: "Subterranean Tremors", text: "A Charge gets -1\" Move, and a Dash moves 1\" less." },
  SC32: { name: "Exotic Particle Field", text: "When shooting with the centreline intervening, re-roll one of your critical successes (or a normal success if you have none)." },
  SC33: { name: "Metallic Infused Vegetation", text: "Each player must take the heavy barricade, but can take 5 equipment options instead of 4. Set it up on the floor wholly in your territory, more than 2\" from other equipment terrain. Crossing a heavy barricade within 1\" of it inflicts D3 damage." },
  SC34: { name: "Gyromantic Shards", text: "When shooting, if any attack dice show a 1 before re-rolls, re-roll all of them." },
  SC35: { name: "Cryoflux Blizzard", text: "Before a Charge move, roll a D6. If it beats the operative's APL, pick an enemy it can reach; your opponent moves your operative, but it must end in that enemy's control range." },
  SC36: { name: "Gravitic Anomaly", text: "Once per turning point, each player can have an operative fly when it moves: set it up wholly within its Move (3\" for a Dash) horizontally, not through Wall terrain or across access points in close quarters, with no extra Charge distance, and not in enemy control range unless it's Charging." },
  TC11: { name: "Clear Conditions", text: "No extra rules. This can come up more than once." },
  TC21: { name: "Darkness", text: "When shooting a target more than 8\" away, the target is obscured." },
  TC22: { name: "Scarab Swarm", text: "Place a Scarab Swarm marker near the killzone center. In each Ready step, move it 2D3\" toward the nearest operative (roll off if tied). Once per activation, an operative with the marker in its control range takes D3 damage." },
  TC23: { name: "Tesla Rupture", text: "In the second and fourth Ready steps, operatives with Wall terrain in their control range, or in the control range of an operative that has, take 1 damage." },
  TC24: { name: "Automated System Error", text: "In each Ready step, one player picks a random hatchway and switches it open or closed." },
  TC25: { name: "Weakened Structure", text: "Breach and Operate Hatch cost 1 less AP (this stacks with Grenadier-style breach discounts, but not other AP reductions)." },
  TC26: { name: "Crypt Fatigue", text: "In each Ready step, each player picks as many operatives as the turning point number (none whose APL is already lowered). They get -1 APL until the end of their next activation." },
  TC31: { name: "Temporal Diffusement", text: "When an operative activates, roll a D6. 1-2: -1\" Move until the end of its activation. 5+: +1\" Move until then." },
  TC32: { name: "Hyperspatial Breach", text: "At the end of Set Up Operatives, each player removes a random operative. In the second Ready step they set it back up within 6\" of their edge or within 3\" of a friendly operative, outside enemy control range." },
  TC33: { name: "Xenoviral Demise", text: "When an operative is incapacitated, roll a D6 for each other operative within 2\": on a 4+, it takes 2 damage." },
  TC34: { name: "Collapsing Tomb", text: "In the second Ready step, operatives with a breach point in their control range take D3 damage, then every breach point opens." },
  TC35: { name: "Nanoweave Web Traps", text: "When an operative ends a Dash, roll a D6: on a 1, it gains a Web token and can't move until the end of its next activation." },
  TC36: { name: "Neurotechnic Haunting", text: "When an operative activates while contesting an objective, roll a D6: on a 1-2, its APL counts as 1 lower for marker control until its next activation." },
};

const cteRoll = (n) => 1 + Math.floor(Math.random() * n);
const cteD36 = () => { const t = cteRoll(3), u = cteRoll(6); return t === 1 ? 11 : t * 10 + u; };
const cteDice = (spec) => { const m = /^(\d*)D(\d)$/.exec(spec); if (!m) return 0; let s = 0; for (let i = 0; i < (Number(m[1]) || 1); i++) s += cteRoll(Number(m[2])); return s; };
const cteMap = (c) => CTE_MAPS.find(m => m.id === c.map) || CTE_MAPS[0];
const cteKind = (c, n) => { const m = cteMap(c); const h = c.hexes[n] || {}; if (h.blocked || m.blocked.includes(n)) return "blocked"; return m.tomb.includes(n) ? "tomb" : "surface"; };
const cteNeighbours = (m, n) => { if (!m.pos[n]) return []; const [col, row] = m.pos[n]; return [[col, row - 2], [col, row + 2], [col - 1, row - 1], [col - 1, row + 1], [col + 1, row - 1], [col + 1, row + 1]].map(([a, b]) => m.at[a + "," + b]).filter(Boolean); };
// Steps from one hex to every other, not passing through blocked hexes (unless avoidBlocked is false).
const cteSteps = (c, from, avoidBlocked = true) => {
  const m = cteMap(c); const dist = { [from]: 0 }; const q = [from];
  while (q.length) { const n = q.shift(); cteNeighbours(m, n).forEach(x => { if (dist[x] == null && (!avoidBlocked || cteKind(c, x) !== "blocked")) { dist[x] = dist[n] + 1; q.push(x); } }); }
  return dist;
};
const cteLoc = (c, n) => (c.hexes[n] || {}).loc;
// Manoeuvre: up to 3 hexes, 1 SP each, with the Transeptum Maze and Asteroid Impact adjustments.
const cteReach = (c) => {
  const m = cteMap(c); const best = {};
  let frontier = [[c.at, 0]];
  for (let step = 1; step <= 3; step++) {
    const next = [];
    frontier.forEach(([n, cost]) => cteNeighbours(m, n).forEach(x => {
      if (cteKind(c, x) === "blocked") return;
      let add = 1;
      if (cteLoc(c, n) === "TL22" && !c.camps.includes(n)) add += 1;
      if (cteLoc(c, n) === "SL24") add += cteKind(c, x) === "tomb" ? -1 : 1;
      const total = cost + add;
      if (total <= c.sp && (best[x] == null || total < best[x])) { best[x] = total; next.push([x, total]); }
    }));
    frontier = next;
  }
  delete best[c.at];
  return best;
};
const cteHomes = (c) => [c.base, ...c.camps].filter(n => n != null && !(c.hexes[n] || {}).fulcrum);
const cteNearestHome = (c, skipCurrent) => {
  const d = cteSteps(c, c.at);
  return cteHomes(c).filter(n => !(skipCurrent && n === c.at) && d[n] != null).sort((a, b) => d[a] - d[b])[0];
};
const cteCampCp = (c) => c.camps.filter(n => (CTE_RULES[cteLoc(c, n)] || {}).campCp && n !== c.base).length;
const cteCp = (c) => c.cp + cteCampCp(c);
const cteLog = (c, t) => ({ ...c, log: [{ r: c.round, t }, ...(c.log || [])].slice(0, 80) });
// Solo threat: raise by 1 on a roll of `need`+ (returns the updated campaign and what happened).
const cteThreatRoll = (c, need, why) => {
  if (c.mode !== "solo") return c;
  const r = cteRoll(6);
  return r >= need ? cteLog({ ...c, threat: Math.min(10, c.threat + 1) }, why + ": rolled " + r + ", threat up to " + Math.min(10, c.threat + 1) + ".") : cteLog(c, why + ": rolled " + r + ", threat stays at " + c.threat + ".");
};
// Explore a hex: roll location and condition (re-rolling repeats other than Ruin / Clear).
const cteExplore = (c, n, viaScout) => {
  const kind = cteKind(c, n);
  const p = kind === "tomb" ? "T" : "S";
  const used = Object.values(c.hexes);
  const pick = (pre, free) => { for (let i = 0; i < 60; i++) { const code = pre + cteD36(); if (code === free || !used.some(h => h.loc === code || h.cond === code)) return code; } return free; };
  const loc = pick(p + "L", p + "L11"), cond = pick(p + "C", p + "C11");
  const rule = CTE_RULES[loc];
  const h = { ...(c.hexes[n] || {}), loc, cond };
  if (rule.res) h.res = cteDice(rule.res.split(":")[1]);
  if (loc === "SL21") h.blocked = true;
  let next = cteLog({ ...c, hexes: { ...c.hexes, [n]: h }, stats: { ...c.stats, explored: c.stats.explored + 1 } }, "Explored hex " + n + ": " + rule.name + ", " + CTE_RULES[cond].name + (rule.res ? " (" + rule.res.split(":")[0] + " " + h.res + ")" : "") + ".");
  if (kind === "tomb" && !viaScout) next = cteThreatRoll(next, 4, "Explored a tomb hex");
  return next;
};
// A battle result, from End game or the campaign card. win: 1 CP; draw/loss: 1 SP; bye: 2 SP.
const cteBattle = (c, result, incap) => {
  if (!c || c.phase !== "battle") return c;
  let next = { ...c, battle: result, stats: { ...c.stats, played: c.stats.played + (result === "bye" ? 0 : 1), won: c.stats.won + (result === "win" ? 1 : 0), incap: c.stats.incap + (incap || 0) } };
  if (result === "win") next.cp += 1; else next.sp = Math.min(10, next.sp + (result === "bye" ? 2 : 1));
  const cond = cteLoc(c, c.at) && (c.hexes[c.at] || {}).cond;
  if (result === "win" && cond === "SC26" && !c.skull) next = { ...next, cp: next.cp + 1, skull: true };
  next = cteLog(next, result === "win" ? "Won the battle: +1 Campaign point" + (next.skull && !c.skull ? " (+1 for the Skull Mounds)" : "") + "." : result === "bye" ? "Bye: +2 SP." : (result === "draw" ? "Drew" : "Lost") + " the battle: +1 SP.");
  if (result !== "bye") next = cteThreatRoll(next, result === "win" ? 3 : 5, "Battle finished");
  return { ...next, phase: "action" };
};
const cteNew = (mode, map, maxThreat, team, fid) => ({ v: 1, mode, map, maxThreat: mode === "solo" ? 10 : maxThreat, threat: 0, round: 1, phase: "setup", team, fid, cp: 0, sp: 10, base: null, at: null, camps: [], hexes: {}, stats: { played: 0, won: 0, explored: 0, spent: 0, incap: 0 }, lowers: 0, log: [] });

// The tappable campaign map: flat-topped hexes, colored by type, with your markers.
function CampaignMap({ c, selected, onTap, labels }) {
  const m = cteMap(c);
  const R = 30, H = Math.sqrt(3) / 2 * R;
  const maxCol = Math.max(...m.hexes.map(n => m.pos[n][0])), maxRow = Math.max(...m.hexes.map(n => m.pos[n][1]));
  const W = R * (1.5 * maxCol + 2) + 4, HT = H * (maxRow + 2) + 4;
  const corners = (x, y) => [0, 1, 2, 3, 4, 5].map(i => (x + R * Math.cos(Math.PI / 3 * i)).toFixed(1) + "," + (y + R * Math.sin(Math.PI / 3 * i)).toFixed(1)).join(" ");
  return (
    <svg viewBox={"0 0 " + W.toFixed(0) + " " + HT.toFixed(0)} style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }} role="group" aria-label="Campaign map">
      {m.hexes.map(n => {
        const [col, row] = m.pos[n];
        const x = 2 + R + col * 1.5 * R, y = 2 + H + row * H;
        const kind = cteKind(c, n), h = c.hexes[n] || {}, explored = !!h.loc || n === c.base;
        const fill = kind === "blocked" ? "#08090B" : kind === "tomb" ? (explored ? "#33495A" : "#202B35") : (explored ? "#4E5869" : "#2E3440");
        const label = labels && labels[n];
        const opp = h.opp || {};
        return (
          <g key={n} role="button" tabIndex={0} aria-label={"Hex " + n + ", " + kind + (explored && h.loc ? ", " + CTE_RULES[h.loc].name : "")} onClick={() => onTap(n)} style={{ cursor: "pointer" }}>
            <polygon points={corners(x, y)} fill={fill} stroke={selected === n ? "#C9772E" : label ? "#FFB627" : "#5A6273"} strokeWidth={selected === n ? 3 : label ? 2 : 1} strokeDasharray={label && selected !== n ? "4 3" : undefined} />
            {kind === "tomb" && <polygon points={corners(x, y).split(" ").map(p => { const [px, py] = p.split(",").map(Number); return (x + (px - x) * 0.8).toFixed(1) + "," + (y + (py - y) * 0.8).toFixed(1); }).join(" ")} fill="none" stroke="#5E7A8C" strokeWidth="1" strokeDasharray="2 2" />}
            <text x={x} y={y - 9} textAnchor="middle" fontSize="12" fontWeight="700" fill={kind === "blocked" ? "#5A6273" : "#F1F2F5"} fontFamily="Rajdhani, sans-serif">{String(n).padStart(2, "0")}</text>
            {label && <text x={x} y={y + 7} textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFB627" fontFamily="Rajdhani, sans-serif">{label}</text>}
            {n === c.base && <path d={`M${x - 23} ${y + 5}v-12l9 3-9 3`} fill="#FFB627" stroke="#FFB627" strokeWidth="1.5" strokeLinejoin="round" />}
            {c.camps.includes(n) && <path d={`M${x - 23} ${y + 5}v-12l9 3-9 3`} fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" />}
            {(opp.base || opp.camp) && <path d={`M${x + 14} ${y + 5}v-12l9 3-9 3`} fill="#E0664A" stroke="#E0664A" strokeWidth="1.5" strokeLinejoin="round" />}
            {opp.team && <circle cx={x + 19} cy={y + 9} r="4.5" fill="#E0664A" />}
            {n === c.at && <circle cx={x} cy={y + 11} r="6.5" fill="#5A9C3A" stroke="var(--bg)" strokeWidth="1.5" />}
          </g>
        );
      })}
    </svg>
  );
}

// Keeps a campaign problem inside its card instead of blanking the whole app.
class CampaignBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { if (window.console) console.error("Campaign card:", err); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{ ...cd, padding: 14, borderLeft: "3px solid #E0664A" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>The campaign card hit a problem</div>
        <div style={{ ...mu, fontSize: 13, marginTop: 4 }}>Your campaign is still saved. Try again, and if it keeps happening, back up from the ⋯ menu and let us know.</div>
        <button onClick={() => this.setState({ failed: false })} style={{ ...bs("var(--muted)"), marginTop: 8, padding: "8px 14px", fontSize: 13 }}>Try again</button>
      </div>
    );
  }
}

function CampaignCard({ c, setC, mobile, f, showToast, playing }) {
  const [open, setOpen] = useState(!playing);
  // Fold away during a game so the datacards stay near the top; open again afterwards.
  React.useEffect(() => { setOpen(!playing); }, [playing]);
  const [sel, setSel] = useState(null);
  const [mode, setMode] = useState(null); // "scout:N" or "key" while picking a hex
  const [incap, setIncap] = useState(0);
  const [pendingSearch, setPendingSearch] = useState(null); // a search in progress
  const [threatAsk, setThreatAsk] = useState(false); // solo: a search rolled 5+
  const [showMore, setShowMore] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const m = cteMap(c);
  const put = (next) => setC(next);
  const spend = (cc, n) => ({ ...cc, sp: cc.sp - n, stats: { ...cc.stats, spent: cc.stats.spent + n } });
  const toAction = (cc) => ({ ...cc, phase: "threat" });
  const hex = sel != null ? (c.hexes[sel] || {}) : null;
  const kind = sel != null ? cteKind(c, sel) : null;
  const here = c.hexes[c.at] || {};
  const hereRule = here.loc ? CTE_RULES[here.loc] : null;
  const phases = [["move", "Move"], ["battle", "Battle"], ["action", "Action"], ["threat", "Threat"]];
  const chip = { fontSize: 13, padding: "4px 10px", borderRadius: 6, background: "var(--raised)", color: "var(--text2)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 };
  const btn = (color, on = true) => ({ ...bs(color), padding: "8px 12px", fontSize: 13, opacity: on ? 1 : 0.4, cursor: on ? "pointer" : "not-allowed" });
  const ruleBox = (code) => code && CTE_RULES[code] ? (
    <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 6, background: "var(--bg)", borderLeft: "3px solid " + (code[1] === "C" ? "var(--blue)" : "var(--accent)") }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{CTE_RULES[code].name}</div>
      <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{CTE_RULES[code].text}</div>
    </div>
  ) : null;

  // Map highlights for the current choice.
  let labels = null;
  if (c.phase === "move" && !mode) { const r = cteReach(c); labels = {}; Object.keys(r).forEach(n => { labels[n] = r[n] + " SP"; }); }
  if (mode && mode.startsWith("scout")) { const range = Number(mode.split(":")[1]); const d = cteSteps(c, c.at, false); labels = {}; m.hexes.forEach(n => { if (d[n] != null && d[n] <= range && !(c.hexes[n] || {}).loc && n !== c.base && cteKind(c, n) !== "blocked") labels[n] = "Scout"; }); }
  if (mode === "key") { labels = {}; m.hexes.forEach(n => { if (n !== c.at && cteKind(c, n) !== "blocked") labels[n] = "1 SP"; }); }

  const moveTo = (n, cost, how) => {
    let next = cteLog(spend({ ...c, at: n }, cost), how + " to hex " + n + (cost ? " for " + cost + " SP." : "."));
    if (!(next.hexes[n] || {}).loc && n !== c.base && !cteHomes(c).includes(n)) next = cteExplore(next, n, false);
    put({ ...next, phase: "battle" }); setSel(n); setMode(null);
  };
  const regroupTo = cteNearestHome(c, true);
  const encampCost = (() => { if (here.loc === "SL25") return 1; const d = cteSteps(c, c.at); const homes = cteHomes(c).filter(n => n !== c.at && d[n] != null).map(n => d[n]); return homes.length ? Math.min(...homes) : 0; })();
  const canEncamp = c.at !== c.base && !c.camps.includes(c.at) && cteKind(c, c.at) !== "blocked" && !(here.opp && (here.opp.base || here.opp.camp)) && !(here.loc === "SL36" && !here.dead) && !(here.loc === "TL24" && here.dead) && c.sp >= encampCost;
  const demolishable = (here.opp && here.opp.camp) || (here.loc === "SL36" && !here.dead) || (here.loc === "TL24" && !here.dead) || (here.loc === "TL32" && !here.dead);
  const searchCost = here.loc === "TL35" ? 1 + (here.res || 0) : 1;
  const canSearch = hereRule && /Search:/.test(hereRule.text) && c.sp >= searchCost && !here.searchedRound;

  const doEncamp = (dropCamp) => {
    let camps = c.camps.filter(n => n !== dropCamp);
    let next = spend({ ...c, camps: [...camps, c.at] }, encampCost);
    next = cteLog(next, "Set up a camp in hex " + c.at + " for " + encampCost + " SP" + (dropCamp ? " (removed the camp in hex " + dropCamp + ")" : "") + ".");
    if (here.loc === "TL32" && !here.released) next = cteLog({ ...next, hexes: { ...next.hexes, [c.at]: { ...here, released: true } } }, "The prisoner is released. Track where it goes.");
    put(toAction(next));
  };
  const doDemolish = () => {
    const h = { ...here };
    let next = spend(c, 3);
    if (h.opp && h.opp.camp) h.opp = { ...h.opp, camp: false };
    else if (h.loc === "SL36") h.dead = true;
    else if (h.loc === "TL24") { h.dead = true; next = { ...next, camps: next.camps.filter(n => n !== c.at) }; if (c.mode === "solo") { const r = cteRoll(3); next = { ...next, threat: Math.min(10, next.threat + r) }; next = cteLog(next, "Power Cell Sanctum demolished: threat up by " + r + "."); } }
    else if (h.loc === "TL32") h.dead = true;
    next = cteLog({ ...next, hexes: { ...next.hexes, [c.at]: h } }, "Demolished in hex " + c.at + " for 3 SP.");
    put(toAction(next));
  };
  const doResupply = (lower) => {
    let gain = c.at === c.base ? 10 : c.camps.includes(c.at) ? cteRoll(3) + 3 : 1;
    if (here.loc === "SL25") gain += cteRoll(3);
    let next = cteLog({ ...c, sp: Math.min(10, c.sp + gain) }, "Resupplied: +" + Math.min(gain, 10 - c.sp) + " SP.");
    if (lower) { const by = cteHomes(c).includes(c.at) ? cteRoll(3) : 1; next = cteLog({ ...next, threat: Math.max(0, next.threat - by), lowers: c.lowers + 1 }, "Lowered the threat level by " + by + "."); }
    put(toAction(next));
  };
  const startSearch = () => {
    let next = spend({ ...c, hexes: { ...c.hexes, [c.at]: { ...here, searchedRound: c.round } } }, searchCost);
    next = cteLog(next, "Searched " + hereRule.name + " for " + searchCost + " SP.");
    const auto = { SL22: "Supply", SL32: "Supply" }[here.loc];
    if (auto) { const want = here.loc === "SL22" ? cteRoll(3) : cteRoll(6); const got = Math.min(want, here.res || 0); next = cteLog({ ...next, sp: Math.min(10, next.sp + got), hexes: { ...next.hexes, [c.at]: { ...next.hexes[c.at], res: (here.res || 0) - got } } }, "Found " + got + " Supply."); }
    if (here.loc === "SL34" && !c.obelisk) next = cteLog({ ...next, cp: next.cp + 1, obelisk: true }, "Gained 1 Campaign point.");
    if (here.loc === "SL35") { const g = cteRoll(3); next = cteLog({ ...next, sp: Math.min(10, next.sp + g) }, "Gained " + g + " SP."); }
    if (here.loc === "TL34" && !c.augury) { const g = c.mode === "solo" ? cteRoll(3) : 1; next = cteLog({ ...next, cp: next.cp + g, augury: true }, "Gained " + g + " Campaign point" + (g === 1 ? "." : "s.")); }
    if (here.loc === "TL36" && !c.key) next = cteLog({ ...next, key: true }, "You have the dimensional key.");
    if (c.mode === "solo") {
      if (here.loc === "TL35") { const r = cteRoll(3); next = cteLog({ ...next, threat: Math.min(10, next.threat + r) }, "Doomsday Vault: threat up by " + r + "."); }
      else { const r = cteRoll(6); if (r >= 5) setThreatAsk(true); next = cteLog(next, "Threat roll for searching: " + r + (r >= 5 ? " (5+)." : ", no change.")); }
    }
    put(next); setPendingSearch(true);
  };

  const threatEffects = (() => {
    const list = [];
    c.camps.forEach(n => {
      const loc = cteLoc(c, n);
      if (loc === "TL23") list.push(["crucible" + n, "Crucible of Whispers camp: roll a D6, 5+ gains 1 of its Campaign points", () => { const r = cteRoll(6); const h = c.hexes[n] || {}; const ok = r >= 5 && (h.res || 0) > 0; return cteLog({ ...c, cp: c.cp + (ok ? 1 : 0), hexes: { ...c.hexes, [n]: { ...h, res: (h.res || 0) - (ok ? 1 : 0) } } }, "Crucible roll: " + r + (ok ? ", +1 Campaign point." : ", nothing.")); }]);
      if (loc === "TL26") list.push(["hotspot" + n, "Energy Hot Spot camp: gain 1 SP", () => cteLog({ ...c, sp: Math.min(10, c.sp + 1) }, "Energy Hot Spot: +1 SP.")]);
      if (loc === "TL33") list.push(["crypt" + n, "Revivification Crypt camp: roll a D3, on a 2+ gain that many SP", () => { const r = cteRoll(3); return cteLog({ ...c, sp: Math.min(10, c.sp + (r >= 2 ? r : 0)) }, "Revivification Crypt roll: " + r + (r >= 2 ? ", +" + r + " SP." : ", nothing.")); }]);
    });
    const d = cteSteps(c, c.at, false);
    m.hexes.forEach(n => { const h = c.hexes[n] || {}; if (h.loc === "SL36" && !h.dead && d[n] != null && d[n] <= 2) list.push(["beast" + n, "Beast Lair in hex " + n + " is " + d[n] + " hex" + (d[n] === 1 ? "" : "es") + " away: roll a D6 +" + Math.min(2, d[n]) + ", on 5+ you escape", () => { const r = cteRoll(6) + Math.min(2, d[n]); if (r >= 5) return cteLog(c, "Beast roll " + r + ": escaped."); const lost = cteRoll(6); return cteLog({ ...c, sp: Math.max(0, c.sp - lost) }, "Beast roll " + r + ": attacked, lost " + lost + " SP."); }]); });
    return list;
  })();
  const endRound = () => {
    let next = { ...c, done: {} };
    if (c.mode === "group") next = cteLog({ ...next, threat: Math.min(next.maxThreat, next.threat + 1) }, "Threat level up to " + Math.min(next.maxThreat, next.threat + 1) + ".");
    if (next.threat >= next.maxThreat) {
      const bonus = next.camps.some(n => cteLoc(next, n) === "TL31") && next.sp >= 5 ? 1 : 0;
      next = cteLog({ ...next, cp: next.cp + bonus, phase: "over" }, "The campaign is over" + (bonus ? " (+1 Campaign point from the Vivitrophic Terminal camp)." : "."));
    } else next = { ...next, round: next.round + 1, phase: "move", battle: null, hexes: Object.fromEntries(Object.entries(next.hexes).map(([k, h]) => [k, { ...h, searchedRound: undefined }])) };
    put(next); setIncap(0); setPendingSearch(null); setThreatAsk(false);
  };

  // ---- Setup ----
  if (c.phase === "setup") {
    return (
      <div className="ks-appear" style={{ ...cd, padding: 14, borderLeft: "3px solid var(--blue)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>New Ctesiphus Expedition</div>
          <button onClick={() => setC(null)} style={btn("var(--muted)")}>Cancel</button>
        </div>
        <div style={{ ...h3, margin: "12px 0 6px" }}>How you're playing</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["solo", "Solo or co-op"], ["group", "Group campaign"]].map(([id, label]) => <button key={id} onClick={() => put({ ...c, mode: id, maxThreat: id === "solo" ? 10 : 7 })} style={{ ...btn(c.mode === id ? "var(--accent)" : "var(--muted)"), background: c.mode === id ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent" }}>{label}</button>)}
        </div>
        <div style={{ ...mu, marginTop: 6 }}>{c.mode === "solo" ? "Threat rises and falls with dice rolls. Reach 10 Campaign points before the threat level reaches 10." : "Threat goes up by 1 each round. Everyone keeps their own log; the most Campaign points at the end wins."}</div>
        {c.mode === "group" && <div style={{ marginTop: 10 }}><Stepper label="Rounds (max threat)" value={c.maxThreat} color="var(--gold)" onMinus={() => put({ ...c, maxThreat: Math.max(3, c.maxThreat - 1) })} onPlus={() => put({ ...c, maxThreat: Math.min(10, c.maxThreat + 1) })} /></div>}
        <div style={{ ...h3, margin: "12px 0 6px" }}>Map</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CTE_MAPS.map(mm => <button key={mm.id} onClick={() => { put({ ...c, map: mm.id, base: null, at: null }); setSel(null); }} style={{ ...btn(c.map === mm.id ? "var(--accent)" : "var(--muted)"), background: c.map === mm.id ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent" }}>{mm.name.replace("Map ", "").replace(" hexes", "")}</button>)}
        </div>
        <div style={{ ...mu, marginTop: 6 }}>Smaller maps suit 2 or 3 players. Use the same map as everyone else in your group.</div>
        <div style={{ ...h3, margin: "12px 0 6px" }}>Your base</div>
        <div style={{ ...mu, marginBottom: 6 }}>Tap a light surface hex.{c.mode === "group" ? " It must be more than 2 hexes from every other player's base." : ""}</div>
        <CampaignMap c={c} selected={c.base} onTap={(n) => { if (cteKind(c, n) === "surface") put({ ...c, base: n, at: n }); }} />
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button disabled={c.base == null} onClick={() => put(cteLog({ ...c, phase: "move", team: f ? f.name : c.team, fid: f ? f.id : c.fid }, "Campaign started with " + (f ? f.name : "your kill team") + ", based in hex " + c.base + "."))} style={{ ...btn("#5A9C3A", c.base != null), background: "#5A9C3A20", padding: "10px 18px", fontSize: 14 }}>Start campaign</button>
          {c.base != null && <span style={{ fontSize: 13, color: "var(--text2)" }}>Base: hex {c.base}</span>}
        </div>
      </div>
    );
  }

  const cpTotal = cteCp(c);
  return (
    <div className="ks-appear" style={{ ...cd, padding: 0, overflow: "hidden", borderLeft: "3px solid var(--blue)" }}>
      <div role="button" tabIndex={0} aria-expanded={open} onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Ctesiphus Expedition {c.phase === "over" ? "· finished" : "· round " + c.round + " · " + (phases.find(p => p[0] === c.phase) || ["", ""])[1]}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            <span style={chip}>{cpTotal} CP</span>
            <span style={chip}>{c.sp}/10 SP</span>
            <span style={{ ...chip, color: c.threat >= c.maxThreat - 2 ? "#E0664A" : "var(--text2)" }}>Threat {c.threat}/{c.maxThreat}</span>
          </div>
          {!open && c.phase === "battle" && here.cond && <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>Battle condition: <span style={{ color: "var(--text)", fontWeight: 600 }}>{CTE_RULES[here.cond].name}</span>. {CTE_RULES[here.cond].text}</div>}
        </div>
        <Arrow open={open} />
      </div>
      {open && (
        <div style={{ padding: "0 12px 12px" }}>
          {c.phase !== "over" && (
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {phases.map(([id, label]) => <div key={id} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", background: c.phase === id ? "color-mix(in srgb, var(--blue) 15%, transparent)" : "var(--card)", color: c.phase === id ? "var(--text)" : "var(--muted2)", border: "1px solid " + (c.phase === id ? "var(--blue)" : "var(--raised)") }}>{label}</div>)}
            </div>
          )}

          {c.phase === "move" && (
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{mode === "key" ? "Tap any hex to move there with the dimensional key." : "Tap a highlighted hex to Manoeuvre there (up to 3 hexes, 1 SP each), or:"}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {regroupTo != null && <button onClick={() => moveTo(regroupTo, 0, "Regrouped")} style={btn("var(--blue)")}>Regroup to hex {regroupTo}</button>}
                <button onClick={() => { put(cteLog({ ...c, phase: "battle" }, "Held position in hex " + c.at + ".")); }} style={btn("var(--muted)")}>Hold</button>
                {c.key && <button onClick={() => setMode(mode === "key" ? null : "key")} style={btn("var(--gold)", c.sp >= 1)}>{mode === "key" ? "Cancel key" : "Use dimensional key"}</button>}
              </div>
            </div>
          )}

          {c.phase === "battle" && (
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>Play your game in hex {c.at}{here.cond ? " with this condition:" : ". It has no condition."}</div>
              {ruleBox(here.cond)}
              {c.mode === "group" && <div style={{ ...mu, fontSize: 12, marginTop: 4 }}>If you and your opponent are in different hexes, use the hex of whoever doesn't have initiative during set up.</div>}
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 10 }}>Record the result with End game (in the ⋯ menu) to save it to your history too, or here:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", margin: "8px 0" }}>
                <Stepper label="Enemies taken out" value={incap} color="#E0664A" onMinus={() => setIncap(Math.max(0, incap - 1))} onPlus={() => setIncap(incap + 1)} />
                <span style={{ ...mu, fontSize: 12, flex: "1 1 160px" }}>For Headhunter: operatives with 5 or fewer wounds count as 0, 6-10 wounds as 1, 11 or more as 2.</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => { put(cteBattle(c, "win", incap)); setIncap(0); }} style={btn("#5A9C3A")}>Won</button>
                <button onClick={() => { put(cteBattle(c, "draw", incap)); setIncap(0); }} style={btn("var(--gold)")}>Drew</button>
                <button onClick={() => { put(cteBattle(c, "loss", incap)); setIncap(0); }} style={btn("#E0664A")}>Lost</button>
                {c.mode === "group" && <button onClick={() => put(cteBattle(c, "bye", 0))} style={btn("var(--muted)")}>Bye (no game)</button>}
              </div>
            </div>
          )}

          {c.phase === "action" && !pendingSearch && (
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{mode && mode.startsWith("scout") ? "Tap a highlighted hex to scout it." : "Take one campaign action, or skip."}</div>
              {here.loc === "TL33" && <div style={{ ...mu, fontSize: 12, marginTop: 4 }}>Revivification Crypt: you also get a free Resupply this phase.</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {[1, 2, 3].map(n => <button key={n} onClick={() => setMode(mode === "scout:" + n ? null : "scout:" + n)} style={{ ...btn("var(--blue)", c.sp >= n), background: mode === "scout:" + n ? "color-mix(in srgb, var(--blue) 13%, transparent)" : "transparent" }} disabled={c.sp < n}>Scout {n} SP</button>)}
                {here.loc !== "SL24" && <button onClick={() => doResupply(false)} style={btn("#5A9C3A")}>Resupply</button>}
                {here.loc !== "SL24" && c.mode === "solo" && c.lowers < 3 && <button onClick={() => doResupply(true)} style={btn("#5A9C3A")}>Resupply and lower threat ({3 - c.lowers} left)</button>}
                {hereRule && /Search:/.test(hereRule.text) && <button onClick={startSearch} disabled={!canSearch} style={btn("var(--accent)", canSearch)}>Search {searchCost} SP</button>}
                {c.camps.length < 2 && <button onClick={() => doEncamp(null)} disabled={!canEncamp} style={btn("var(--accent)", canEncamp)}>Encamp {encampCost} SP</button>}
                {c.camps.length >= 2 && canEncamp && c.camps.map(n => <button key={n} onClick={() => doEncamp(n)} style={btn("var(--accent)")}>Encamp {encampCost} SP, drop hex {n}</button>)}
                {demolishable && <button onClick={doDemolish} disabled={c.sp < 3} style={btn("#E0664A", c.sp >= 3)}>Demolish 3 SP</button>}
                <button onClick={() => put(toAction(cteLog(c, "Took no campaign action.")))} style={btn("var(--muted)")}>Skip</button>
              </div>
            </div>
          )}

          {c.phase === "action" && pendingSearch && (
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>Searching hex {c.at}. Anything the app didn't do for you, apply with the numbers below.</div>
              {ruleBox(here.loc)}
              {threatAsk && (
                <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, background: "#E0664A15", border: "1px solid #E0664A50" }}>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>The threat roll was 5+. Spend 1 SP to stop the threat level rising?</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={() => { put(cteLog(spend(c, 1), "Spent 1 SP to keep the threat level down.")); setThreatAsk(false); }} disabled={c.sp < 1} style={btn("#5A9C3A", c.sp >= 1)}>Spend 1 SP</button>
                    <button onClick={() => { put(cteLog({ ...c, threat: Math.min(10, c.threat + 1) }, "Threat level up to " + Math.min(10, c.threat + 1) + ".")); setThreatAsk(false); }} style={btn("#E0664A")}>Let it rise</button>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                <button onClick={() => showToast("D3: " + cteRoll(3), 4000)} style={btn("var(--muted)")}>Roll D3</button>
                <button onClick={() => showToast("D6: " + cteRoll(6), 4000)} style={btn("var(--muted)")}>Roll D6</button>
                <button onClick={() => showToast("2D6: " + (cteRoll(6) + cteRoll(6)), 4000)} style={btn("var(--muted)")}>Roll 2D6</button>
                <button onClick={() => setShowAdjust(true)} style={btn("var(--muted)")}>Adjust numbers</button>
                <button onClick={() => { setPendingSearch(null); setThreatAsk(false); put(toAction(c)); }} disabled={threatAsk} style={{ ...btn("#5A9C3A", !threatAsk), background: "#5A9C3A20" }}>Done searching</button>
              </div>
            </div>
          )}

          {c.phase === "threat" && (
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{threatEffects.length ? "Resolve these, then end the round." : "Nothing to resolve this Threat phase."}{c.mode === "group" ? " Ending the round raises the threat level by 1." : ""}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {threatEffects.map(([key, label, run]) => {
                  const done = (c.done || {})[key];
                  return <button key={key} disabled={done} onClick={() => put({ ...run(), done: { ...(c.done || {}), [key]: true } })} style={{ ...btn(done ? "#5A9C3A" : "var(--gold)", !done), textAlign: "left" }}>{done ? "Done: " : ""}{label}</button>;
                })}
                {c.camps.some(n => cteLoc(c, n) === "TL32") && <div style={{ ...mu, fontSize: 12 }}>Hyperfractal Gaol camp: move the prisoner up to D3 hexes yourself, and adjust anyone it catches.</div>}
              </div>
              <button onClick={endRound} style={{ ...btn("#5A9C3A"), background: "#5A9C3A20", marginTop: 10, padding: "10px 18px", fontSize: 14 }}>End round {c.round}</button>
            </div>
          )}

          {c.phase === "over" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.mode === "solo" ? (cpTotal >= 10 ? "#5A9C3A" : "#E0664A") : "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>
                {c.mode === "solo" ? (cpTotal >= 10 ? "Expedition succeeded with " + cpTotal + " Campaign points." : "The expedition withdrew with " + cpTotal + " Campaign points (10 needed).") : "Campaign over: " + cpTotal + " Campaign points. Compare with your group for Warlord and the other titles."}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 6, marginTop: 8 }}>
                {[["Pioneer", "SP spent", c.stats.spent], ["Explorer", "Hexes explored", c.stats.explored], ["Trooper", "Games played", c.stats.played], ["Warrior", "Games won", c.stats.won], ["Headhunter", "Enemies taken out", c.stats.incap]].map(([t, l, v]) => (
                  <div key={t} style={{ background: "var(--bg)", borderRadius: 6, padding: "8px 10px" }}><div style={{ fontSize: 12, color: "var(--muted)" }}>{t}: {l}</div><div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{v}</div></div>
                ))}
              </div>
              <button onClick={() => setC(null)} style={{ ...btn("var(--muted)"), marginTop: 10 }}>Close the campaign</button>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <CampaignMap c={c} selected={sel} labels={labels} onTap={(n) => setSel(sel === n ? null : n)} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#2E3440", border: "1px solid #5A6273", verticalAlign: "-1px" }} /> Surface</span>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#202B35", border: "1px dashed #5E7A8C", verticalAlign: "-1px" }} /> Tomb</span>
              <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#08090B", border: "1px solid #5A6273", verticalAlign: "-1px" }} /> Blocked</span>
              <span><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ verticalAlign: "-1px" }}><circle cx="5" cy="5" r="4.5" fill="#5A9C3A" /></svg> You</span>
              <span><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ verticalAlign: "-1px" }}><path d="M1 10V0l8 3-8 3" fill="var(--gold)" /></svg> Base</span>
              <span><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ verticalAlign: "-1px" }}><path d="M1 10V0l8 3-8 3" fill="var(--accent)" /></svg> Camp</span>
              {c.mode === "group" && <span><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ verticalAlign: "-1px" }}><circle cx="5" cy="5" r="4.5" fill="#E0664A" /></svg> Others</span>}
            </div>
          </div>

          {sel != null && (
            <div className="ks-appear" style={{ marginTop: 10, padding: 10, borderRadius: 6, background: "var(--bg)", border: "1px solid var(--raised)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Hex {sel} {"·"} {kind === "blocked" ? "Blocked" : kind === "tomb" ? "Tomb" : "Surface"}{sel === c.base ? " · your base" : c.camps.includes(sel) ? " · your camp" : ""}</div>
                <button onClick={() => setSel(null)} aria-label="Close hex" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={18} /></button>
              </div>
              {hex.loc ? <div>{ruleBox(hex.loc)}{ruleBox(hex.cond)}</div> : sel !== c.base && kind !== "blocked" && <div style={{ ...mu, fontSize: 13 }}>Not explored yet.</div>}
              {hex.res != null && CTE_RULES[hex.loc] && CTE_RULES[hex.loc].res && (
                <div style={{ marginTop: 8 }}><Stepper label={CTE_RULES[hex.loc].res.split(":")[0] + " left"} value={hex.res} color="var(--gold)" onMinus={() => put({ ...c, hexes: { ...c.hexes, [sel]: { ...hex, res: Math.max(0, hex.res - 1) } } })} onPlus={() => put({ ...c, hexes: { ...c.hexes, [sel]: { ...hex, res: hex.res + 1 } } })} /></div>
              )}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {c.phase === "move" && !mode && labels && labels[sel] && <button onClick={() => moveTo(sel, cteReach(c)[sel], "Manoeuvred")} style={{ ...btn("#5A9C3A"), background: "#5A9C3A20" }}>Move here ({cteReach(c)[sel]} SP)</button>}
                {mode === "key" && labels && labels[sel] && <button onClick={() => { put({ ...c, key: false }); moveTo(sel, 1, "Used the dimensional key"); }} style={{ ...btn("var(--gold)"), background: "color-mix(in srgb, var(--gold) 13%, transparent)" }}>Move here with the key (1 SP)</button>}
                {mode && mode.startsWith("scout") && labels && labels[sel] && <button onClick={() => { const cost = Number(mode.split(":")[1]); put(toAction(cteExplore(cteLog(spend(c, cost), "Scouted hex " + sel + " for " + cost + " SP."), sel, true))); setMode(null); }} style={{ ...btn("var(--blue)"), background: "color-mix(in srgb, var(--blue) 13%, transparent)" }}>Scout this hex ({mode.split(":")[1]} SP)</button>}
                <button onClick={() => setShowMore(!showMore)} style={btn("var(--muted)")}>{showMore ? "Fewer options" : "More options"}</button>
              </div>
              {showMore && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {!hex.loc && kind !== "blocked" && sel !== c.base && <button onClick={() => put(cteExplore(c, sel, true))} style={btn("var(--blue)")}>Explore now (roll)</button>}
                  <select value={hex.loc || ""} onChange={e => put({ ...c, hexes: { ...c.hexes, [sel]: { ...hex, loc: e.target.value || undefined, blocked: e.target.value === "SL21" ? true : hex.blocked } } })} aria-label="Set location" style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "8px", fontSize: 13 }}>
                    <option value="">Location: not explored</option>
                    {Object.keys(CTE_RULES).filter(k => k[1] === "L" && k[0] === (kind === "tomb" ? "T" : "S")).map(k => <option key={k} value={k}>{CTE_RULES[k].name}</option>)}
                  </select>
                  <select value={hex.cond || ""} onChange={e => put({ ...c, hexes: { ...c.hexes, [sel]: { ...hex, cond: e.target.value || undefined } } })} aria-label="Set condition" style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "8px", fontSize: 13 }}>
                    <option value="">Condition: none</option>
                    {Object.keys(CTE_RULES).filter(k => k[1] === "C" && k[0] === (kind === "tomb" ? "T" : "S")).map(k => <option key={k} value={k}>{CTE_RULES[k].name}</option>)}
                  </select>
                  {sel !== c.at && <button onClick={() => put(cteLog({ ...c, at: sel }, "Moved the kill team to hex " + sel + " by hand."))} style={btn("var(--muted)")}>Put my kill team here</button>}
                  {c.camps.includes(sel) && <button onClick={() => put(cteLog({ ...c, camps: c.camps.filter(n => n !== sel) }, "Removed the camp in hex " + sel + "."))} style={btn("#E0664A")}>Remove my camp</button>}
                  {!m.blocked.includes(sel) && <button onClick={() => put({ ...c, hexes: { ...c.hexes, [sel]: { ...hex, blocked: !hex.blocked } } })} style={btn("var(--muted)")}>{hex.blocked ? "Unblock" : "Block"}</button>}
                  {c.mode === "group" && ["base", "camp", "team"].map(k => { const on = !!(hex.opp || {})[k]; return <button key={k} onClick={() => put({ ...c, hexes: { ...c.hexes, [sel]: { ...hex, opp: { ...(hex.opp || {}), [k]: !on } } } })} style={{ ...btn(on ? "#E0664A" : "var(--muted)"), background: on ? "#E0664A20" : "transparent" }}>{on ? "Remove " : "Mark "}opponent {k === "team" ? "kill team" : k}</button>; })}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            <button onClick={() => setShowAdjust(!showAdjust)} style={btn("var(--muted)")}>{showAdjust ? "Hide adjustments" : "Adjust numbers"}</button>
          </div>
          {showAdjust && (
            <div style={{ marginTop: 8, padding: 10, borderRadius: 6, background: "var(--bg)", border: "1px solid var(--raised)" }}>
              <div style={{ ...mu, fontSize: 12, marginBottom: 8 }}>Some rules need you to apply them yourself. Changes here aren't logged as spending.</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Stepper label="Campaign points" value={c.cp} color="#5A9C3A" onMinus={() => put({ ...c, cp: Math.max(0, c.cp - 1) })} onPlus={() => put({ ...c, cp: c.cp + 1 })} />
                <Stepper label="Supply" value={c.sp} color="var(--gold)" onMinus={() => put({ ...c, sp: Math.max(0, c.sp - 1) })} onPlus={() => put({ ...c, sp: Math.min(10, c.sp + 1) })} />
                <Stepper label="Threat" value={c.threat} color="#E0664A" onMinus={() => put({ ...c, threat: Math.max(0, c.threat - 1) })} onPlus={() => put({ ...c, threat: Math.min(c.maxThreat, c.threat + 1) })} />
                <Stepper label="Enemies taken out" value={c.stats.incap} color="var(--muted)" onMinus={() => put({ ...c, stats: { ...c.stats, incap: Math.max(0, c.stats.incap - 1) } })} onPlus={() => put({ ...c, stats: { ...c.stats, incap: c.stats.incap + 1 } })} />
              </div>
              {cteCampCp(c) > 0 && <div style={{ ...mu, fontSize: 12, marginTop: 6 }}>Your camps add {cteCampCp(c)} Campaign point{cteCampCp(c) === 1 ? "" : "s"} on top of these while you hold them.</div>}
              <div style={{ ...h3, margin: "10px 0 4px" }}>Go to phase</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {phases.map(([id, label]) => <button key={id} onClick={() => { put({ ...c, phase: id }); setPendingSearch(null); setMode(null); }} style={btn(c.phase === id ? "var(--blue)" : "var(--muted)")}>{label}</button>)}
                <button onClick={() => put(cteLog({ ...c, phase: "over" }, "Ended the campaign by hand."))} style={btn("#E0664A")}>End campaign</button>
              </div>
            </div>
          )}
          {(c.log || []).length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: "pointer", fontSize: 13, color: "var(--text2)" }}>Campaign log ({c.log.length})</summary>
              <div style={{ marginTop: 6 }}>
                {c.log.slice(0, 30).map((l, i) => <div key={i} style={{ fontSize: 12, color: "var(--muted)", padding: "3px 0", borderTop: "1px solid var(--card)" }}>Round {l.r}: {l.t}</div>)}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

