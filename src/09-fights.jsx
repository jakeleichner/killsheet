/* ═══ FIGHTS ═══ */
// A fight between two operatives (core rules, Fighting): both roll attack dice with a melee weapon, then, attacker first,
// they take turns resolving one success: strike (deal its damage) or block (cancel one of the opponent's). A normal blocks
// a normal, a crit blocks either. In an online game both devices run reduceFight on the same actions, so they stay in step.
const otherRole = (r) => r === "atk" ? "def" : "atk";
const fightDmg = (w, s) => { const [n, c] = String(w.dmg).split("/").map(x => parseInt(x, 10) || 0); return s === "crit" ? c : n; };
const fightRules = (w, injured) => { const r = diceRules(w); if (injured) r.hit = Math.min(6, r.hit + 1); return r; };
const fightDiceCount = (w) => Math.max(0, (parseInt(w.atk, 10) || 0) - diceRules(w).accurate);
// Each die as a slot { v, kind: "crit" | "norm" | "fail", auto?, rule? }, with Accurate's kept dice added (no value)
// and Severe, Rending and Punishing applied to particular dice, matching attackResult's counts. This is what lets
// the screen show which die struck, blocked or was lost.
function fightSlots(side) {
  const r = fightRules(side.weapon, side.op.injured);
  const slots = (side.dice || []).map(v => { const k = attackDie(v, r); return { v, kind: k === "hit" ? "norm" : k }; });
  for (let i = 0; i < r.accurate; i++) slots.push({ v: null, kind: "norm", auto: true, rule: "Accurate" });
  const first = (kind) => slots.findIndex(x => x.kind === kind);
  let severe = false;
  if (r.severe && first("crit") < 0 && first("norm") >= 0) { slots[first("norm")] = { ...slots[first("norm")], kind: "crit", rule: "Severe" }; severe = true; }
  if (r.rending && !severe && first("crit") >= 0 && first("norm") >= 0) slots[first("norm")] = { ...slots[first("norm")], kind: "crit", rule: "Rending" };
  if (r.punishing && !severe && first("crit") >= 0 && first("fail") >= 0) slots[first("fail")] = { ...slots[first("fail")], kind: "norm", rule: "Punishing" };
  return slots;
}
const fightSuccesses = (side) => fightSlots(side).filter(x => x.kind !== "fail").sort((a, b) => (a.kind === "crit" ? 0 : 1) - (b.kind === "crit" ? 0 : 1)).map(x => x.kind);
// Brutal: the opponent can only block this weapon's successes with crits.
const canFightBlock = (use, hit, theirWeapon) => (use === "crit" || hit === "norm") && (use === "crit" || !/\bBrutal\b/.test(theirWeapon.wr || ""));
const fightHp = (f, role) => f[role].op.start - f.dmg[role];
function reduceFight(f, a) {
  if (!f) return f;
  switch (a.type) {
    case "target": return { ...f, def: a.def, stage: "weapon" };
    case "weapon": return { ...f, def: { ...f.def, weapon: a.weapon }, stage: "roll" };
    case "roll": return { ...f, [a.role]: { ...f[a.role], dice: a.dice, rr: a.dice.map(() => false), ready: false } };
    case "reroll": {
      const s = f[a.role];
      if (!s.dice || s.rr[a.i] || s.ready) return f;
      return { ...f, [a.role]: { ...s, dice: s.dice.map((v, i) => i === a.i ? a.v : v), rr: s.rr.map((r, i) => r || i === a.i) } };
    }
    case "ready": {
      const n = { ...f, [a.role]: { ...f[a.role], ready: true } };
      if (!n.atk.ready || !n.def.ready) return n;
      const slots = { atk: fightSlots(n.atk), def: fightSlots(n.def) };
      const order = (sl) => sl.map((x, i) => i).filter(i => sl[i].kind !== "fail").sort((x, y) => (sl[x].kind === "crit" ? 0 : 1) - (sl[y].kind === "crit" ? 0 : 1) || x - y);
      const left = { atk: order(slots.atk), def: order(slots.def) };
      const stage = left.atk.length || left.def.length ? "resolve" : "done";
      return { ...n, slots, left, used: { atk: {}, def: {} }, stage, turn: left.atk.length ? "atk" : "def" };
    }
    case "act": {
      const me = a.role, them = otherRole(me);
      if (f.stage !== "resolve" || f.turn !== me) return f;
      const sl = f.slots, kindOf = (r, i) => sl[r][i].kind;
      // a.i / a.j are slot indices; older messages name a kind (use / hit) and take the first one of it.
      const i = Number.isInteger(a.i) ? a.i : f.left[me].find(x => kindOf(me, x) === a.use);
      if (!f.left[me].includes(i)) return f;
      const left = { atk: [...f.left.atk], def: [...f.left.def] }, used = { atk: { ...f.used.atk }, def: { ...f.used.def } };
      const dmg = { ...f.dmg }, shockUsed = { ...f.shockUsed }, entry = { role: me, kind: a.kind, use: kindOf(me, i), i };
      const take = (r, x) => { left[r] = left[r].filter(y => y !== x); };
      if (a.kind === "strike") {
        take(me, i); used[me][i] = "Strike";
        entry.dmg = fightDmg(f[me].weapon, entry.use);
        dmg[them] += entry.dmg;
        // Shock: the first crit you strike with also discards one of their normal successes (a crit if they have no normals).
        if (entry.use === "crit" && /\bShock\b/.test(f[me].weapon.wr || "") && !shockUsed[me]) {
          shockUsed[me] = true;
          const j = left[them].find(x => kindOf(them, x) === "norm") ?? left[them].find(x => kindOf(them, x) === "crit");
          if (j !== undefined) { take(them, j); used[them][j] = "Lost"; entry.shock = kindOf(them, j); }
        }
      } else {
        const j = Number.isInteger(a.j) ? a.j : left[them].find(x => kindOf(them, x) === a.hit);
        if (!left[them].includes(j) || !canFightBlock(entry.use, kindOf(them, j), f[them].weapon)) return f;
        take(me, i); used[me][i] = "Block";
        take(them, j); used[them][j] = "Lost";
        entry.hit = kindOf(them, j); entry.j = j;
      }
      const n = { ...f, left, used, dmg, shockUsed, log: [...f.log, entry] };
      const over = fightHp(n, "atk") <= 0 || fightHp(n, "def") <= 0 || (!left.atk.length && !left.def.length);
      return { ...n, stage: over ? "done" : "resolve", turn: left[them].length ? them : me };
    }
    case "cancel": return { ...f, stage: "canceled" };
    case "takeover": return { ...f, stage: "takenOver" };
    default: return f;
  }
}
// side: "mine" | "opp" (whose operative, from this device's point of view). op: { id, name, max, start, injured }.
const newFight = (id, online, roles, atk) => ({
  id, online, roles, stage: "target", turn: "atk", log: [], changedAt: Date.now(),
  atk: { ...atk, dice: null, rr: [], ready: false }, def: null,
  left: { atk: [], def: [] }, dmg: { atk: 0, def: 0 }, shockUsed: { atk: false, def: false },
});
const newFightSide = (side, op, weapon) => ({ side, op, weapon: weapon || null, dice: null, rr: [], ready: false });
const fightWords = (s) => s === "crit" ? "crit" : "normal success";

// Add enemy roster without a code: pick the team, then how many of each operative they're fielding (no points or roster
// checks: it's their team). Equipment stays on the table.
function AddTheirTeam({ onAdd, onClose }) {
  const [fidPick, setFidPick] = useState(null);
  const [q, setQ] = useState("");
  const [counts, setCounts] = useState({});
  const [limits, setLimits] = useState(true); // the team's selection rules, as in the builder; off for anything unusual
  const fc = fidPick ? FACTIONS[fidPick] : null;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const teams = Object.values(FACTIONS).filter(x => !q.trim() || (x.name + " " + x.badge).toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
  const ruled = limits && fc && fc.composition;
  const asRoster = (c) => fc.operatives.flatMap(op => Array(c[op.id] || 0).fill(0).map(() => ({ id: op.id })));
  // Their equipment isn't tracked: an operative that needs equipment can be picked, and the group then counts as having it.
  const allEq = fc ? Object.fromEntries(fc.equipment.map(x => [x.id, true])) : {};
  const usedEq = ruled ? Object.fromEntries(fc.composition.groups.filter(g => g.equip && asRoster(counts).some(o => g.ids.includes(o.id))).map(g => [g.equip, true])) : {};
  const check = ruled ? compCheck(fc, asRoster(counts), usedEq) : null;
  const canAdd = (id) => !ruled || compCanAdd(fc, asRoster(counts), id, allEq);
  const bump = (id, d) => setCounts(c => {
    if (d > 0 && ruled && !compCanAdd(fc, asRoster(c), id, allEq)) return c;
    return { ...c, [id]: Math.max(0, Math.min(10, (c[id] || 0) + d)) };
  });
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 12px", overflowY: "auto" }}>
      <div role="dialog" aria-modal="true" aria-label="Add enemy roster" style={{ ...cd, width: "100%", maxWidth: 560, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{fc ? "Enemy roster: " + fc.name : "Add enemy roster"}</div>
          <button autoFocus onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "6px 10px", display: "inline-flex" }}><Icon name="x" size={16} /></button>
        </div>
        {!fc ? (
          <div>
            <div style={{ ...mu, fontSize: 13, marginBottom: 8 }}>Which team is your opponent playing?</div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search teams" aria-label="Search teams" style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "8px 10px", fontSize: 14, marginBottom: 8 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 6, maxHeight: "55vh", overflowY: "auto" }}>
              {teams.map(x => (
                <button key={x.id} onClick={() => { setFidPick(x.id); setCounts({}); }} style={{ ...cd, marginBottom: 0, padding: "8px 10px", textAlign: "left", cursor: "pointer", borderLeft: "3px solid " + x.color }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: x.color, fontFamily: "'Rajdhani', sans-serif" }}>{x.badge}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{x.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ ...mu, fontSize: 13, flex: 1 }}>How many of each are they fielding?</div>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Team limits</span>
              <Switch on={limits} onChange={setLimits} label="Team limits" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: check && check.errors.length ? DS.threat : "var(--muted)", flex: 1 }}>
                {!ruled ? "Any number of any operative." : check.errors.length ? check.errors[0] : check.warnings.length ? check.warnings.join(" ") : total ? "A full " + fc.name + " team." : fc.composition.rules ? fc.composition.rules.join(" ") : ""}
              </div>
              <button className="link-btn" onClick={() => setFidPick(null)} style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Other team</button>
            </div>
            <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
              {fc.operatives.map(op => {
                const n = counts[op.id] || 0;
                return (
                  <div key={op.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--raised)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: n ? "var(--text)" : "var(--text2)", fontFamily: "'Rajdhani', sans-serif" }}>{op.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{op.wounds}W {"·"} {op.save} {"·"} APL {op.apl}</div>
                    </div>
                    <button aria-label={"One fewer " + op.name} disabled={!n} onClick={() => bump(op.id, -1)} className="compact-btn" style={{ ...bs("var(--muted)"), width: 34, height: 34, padding: 0, fontSize: 18, opacity: n ? 1 : 0.4 }}>−</button>
                    <span style={{ minWidth: 18, textAlign: "center", fontSize: 16, fontWeight: 700, color: n ? "var(--accent)" : "var(--dim)", fontFamily: "'Rajdhani', sans-serif" }}>{n}</span>
                    <button aria-label={"Add " + op.name} disabled={!canAdd(op.id)} onClick={() => bump(op.id, 1)} className="compact-btn" style={{ ...bs("var(--accent)"), width: 34, height: 34, padding: 0, fontSize: 18, opacity: canAdd(op.id) ? 1 : 0.35 }}>+</button>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <button disabled={!total || !!(check && check.errors.length)} onClick={() => onAdd(fc.id, fc.operatives.flatMap(op => Array(counts[op.id] || 0).fill(op.id)))} style={{ ...bs("var(--accent)"), padding: "10px 16px", fontSize: 14, opacity: total && !(check && check.errors.length) ? 1 : 0.5 }}>Add {total || ""} operative{total === 1 ? "" : "s"}</button>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Their equipment isn't added: keep track of it on the table.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// The ⓘ on the Fight and Shoot screens: how it works, in a few lines, inside the screen (not another pop-up).
const ATTACK_HELP = {
  fight: [
    "Both players roll attack dice with a melee weapon: a 6 is a crit, at or above Hit is a normal success, a 1 always fails.",
    "Then, starting with the attacker, take turns using one success. Strike deals its damage now. Block cancels one of the opponent's successes: a normal blocks a normal, a crit blocks either.",
    "When one side runs out, the other uses the rest. The fight ends when both are out or someone is incapacitated.",
    "Brutal: only crits can block it. Shock: the first crit you strike with also knocks out one of their normal successes.",
    "Dice: bright ones are still to use, faded ones are used, lost or failed. Before you're done rolling, tap a die to re-roll it (each die once). A Command Re-roll costs 1CP: take it off yourself.",
  ],
  shoot: [
    "Pick the target first. It has to be visible, and an operative on Conceal in cover can't be picked.",
    "Attack dice: at or above Hit is a hit, a 6 is a crit, a 1 always misses. Obscured: crits count as hits and one hit is lost.",
    "The target's player rolls 3 defense dice (fewer with Piercing): at or above Save is a save, a 6 is a crit save. In cover, one save is kept without rolling (not against Saturate).",
    "Saves block hits: a normal save blocks a normal hit, two normal saves block a crit, a crit save blocks either. Whatever gets through deals damage.",
    "Blast and Torrent: each extra target gets its own attack and defense roll.",
    "Tap a die to re-roll it once (the attacker can until the defender rolls). Rolled real dice at the table? Use Enter real dice. A Command Re-roll costs 1CP: take it off yourself.",
  ],
};
function AttackHelp({ kind, open }) {
  if (!open) return null;
  return (
    <div className="ks-appear" style={{ background: "var(--bg)", border: "1px solid var(--raised)", borderRadius: 6, padding: "8px 12px", marginBottom: 10 }}>
      {ATTACK_HELP[kind].map((t, i) => <div key={i} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, marginBottom: 4 }}>{t}</div>)}
    </div>
  );
}
const helpButton = (open, onClick) => (
  <button onClick={onClick} aria-label="How this works" aria-expanded={open} className="compact-btn"
    style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: open ? "var(--accent)" : "var(--muted)", display: "inline-flex" }}><Icon name="info" size={16} /></button>
);

// ── Versus layout for the Shoot and Fight screens: each side washed in its team color from its outer edge, and a
// marker between them (an arrow for shooting, crossed blades for a fight). ──
const vsCard = (col, right, out) => ({ ...cd, marginBottom: 0, padding: 10, position: "relative", opacity: out ? 0.55 : 1,
  [right ? "borderRight" : "borderLeft"]: "3px solid " + col,
  background: "linear-gradient(" + (right ? "200deg" : "160deg") + ", " + al(col, "2E") + " 0%, transparent 62%), var(--card)" });
const vsName = { fontSize: 18, fontWeight: 700, lineHeight: 1.1, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", overflowWrap: "break-word", hyphens: "auto" };
function VsPair({ kind, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12, position: "relative" }}>
      {children}
      <span aria-hidden="true" data-vs={kind} style={{ position: "absolute", left: "50%", top: 22, transform: "translate(-50%, -50%)", width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", border: "1px solid var(--line)", color: kind === "fight" ? "#E0664A" : "var(--accent)", boxShadow: "0 2px 6px rgba(0,0,0,0.5)", zIndex: 2 }}>
        <Icon name={kind === "fight" ? "swords" : "arrowRight"} size={14} />
      </span>
    </div>
  );
}

// ── Dice: flat faces drawn like the logo's die (an outline and solid pips), colored by result: gold crit, green
// success, red failed. The body is the theme's panel color, and success and fail use the theme's --hit and --miss. ──
const DIE_PIPS = { 1: [[15, 15]], 2: [[9, 9], [21, 21]], 3: [[9, 9], [15, 15], [21, 21]], 4: [[9, 9], [21, 9], [9, 21], [21, 21]], 5: [[9, 9], [21, 9], [15, 15], [9, 21], [21, 21]], 6: [[9, 8], [9, 15], [9, 22], [21, 8], [21, 15], [21, 22]] };
const DIE_LOOK = {
  crit: { col: "var(--gold)", tint: 24 },
  hit: { col: "var(--hit)", tint: 16 },
  fail: { col: "var(--miss)", tint: 8, pipOpacity: 0.8 },
  set: { col: "var(--text)", tint: 0 }, // typing in real dice
};
// The button style for a die. kind: crit, hit (or norm), fail, set, or null (not rolled yet: an empty dashed outline).
function dieStyle(kind, size, opts = {}) {
  const look = DIE_LOOK[kind === "norm" ? "hit" : kind];
  const base = { width: size, height: size, padding: 0, borderRadius: Math.round(size / 5), display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: opts.onClick ? "pointer" : "default", opacity: opts.faded ? 0.35 : 1, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: Math.round(size / 2), boxShadow: opts.pressed ? "0 0 0 2px var(--text)" : "none" };
  if (!look) return { ...base, border: "2px dashed var(--line)", background: "transparent", color: "var(--muted)" };
  return { ...base, color: look.col, border: "2px " + (opts.rerolled ? "dashed " : "solid ") + look.col,
    background: look.tint ? "color-mix(in srgb, " + look.col + " " + look.tint + "%, var(--raised))" : "var(--raised)" };
}
// What's on the face: pips for 1 to 6, or a letter ("A" for an Accurate die, "?" for one not set yet).
function dieFace(v, kind, size) {
  const pips = DIE_PIPS[v];
  if (!pips) return v == null ? "" : v;
  const look = DIE_LOOK[kind === "norm" ? "hit" : kind] || DIE_LOOK.set, s = size - 4;
  return <svg width={s} height={s} viewBox="0 0 30 30" aria-hidden="true" style={{ display: "block" }}>{pips.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={v === 1 ? 3.6 : 2.9} style={{ fill: look.col }} opacity={look.pipOpacity || 1} />)}</svg>;
}
// New dice tumble in: each die's last value is kept by its data-die key, and one that changes (rolled or re-rolled)
// spins and drops into place. Dice already showing when the screen opens stay still.
function useDiceTumble(scope) {
  const last = React.useRef(null);
  React.useEffect(() => {
    const first = last.current === null, still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (first) last.current = {};
    let n = 0;
    document.querySelectorAll("[data-die^='" + scope + ":']").forEach(el => {
      const k = el.getAttribute("data-die"), v = el.getAttribute("data-v"), was = last.current[k];
      last.current[k] = v;
      if (first || !v || was === v || still || !el.animate) return;
      const spin = (Math.random() < 0.5 ? -1 : 1) * (280 + Math.random() * 260), dx = Math.round(Math.random() * 16 - 8);
      el.animate([
        { transform: "translate(" + dx + "px, -16px) rotate(" + spin + "deg) scale(0.55)", opacity: 0, filter: "blur(1.5px)" },
        { offset: 0.55, transform: "translate(0, 2px) rotate(-8deg) scale(1.08)", opacity: 1, filter: "blur(0)" },
        { offset: 0.78, transform: "translate(0, -2px) rotate(3deg) scale(0.98)" },
        { transform: "none" },
      ], { duration: 560, delay: n++ * 55, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" });
    });
  });
}

function FightScreen({ fight, dropped, enemies, defWeapons, sideColor, onAct, onClose, onTakeOver, importHint }) {
  const { feat } = React.useContext(FeatureCtx);
  const f = fight;
  const mine = (role) => f.roles.includes(role);
  const [sel, setSel] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [pop, setPop] = useState(null);
  const [help, setHelp] = useState(false);
  useDiceTumble("f");
  // The versus intro when the two fighters first face off (not when a screen with dice already rolled reopens).
  const faced = React.useRef(null);
  React.useEffect(() => {
    const key = f.def && f.def.op ? f.atk.op.id + ">" + f.def.op.id : null;
    if (!key || faced.current === key) return;
    const fresh = faced.current !== null || !f.atk.dice;
    faced.current = key;
    if (!fresh || !feat.fx || !document.body.animate) return;
    const screen = document.querySelector("[role=dialog][aria-label='Fight']");
    playVersusFx(screen, ["atk", "def"].map(r => document.querySelector("[data-fight-card] [data-vs-name='" + r + "']")), document.querySelector("[data-vs='fight']"));
  }, [f.def && f.def.op && f.def.op.id]);
  React.useEffect(() => { const t = setInterval(() => setNow(Date.now()), 5000); return () => clearInterval(t); }, []);
  React.useEffect(() => { setSel(null); }, [f.turn, f.log.length]);
  const myTurnLeft = f.stage === "resolve" ? f.left[f.turn] : [];
  const pick = myTurnLeft.includes(sel) ? sel : myTurnLeft[0]; // left is in order: crits first
  // Each strike: the slash from the striker's card to the target's, and the damage number pops on the target.
  const seen = React.useRef(f.log.length);
  React.useEffect(() => {
    if (f.log.length <= seen.current) { seen.current = f.log.length; return; }
    seen.current = f.log.length;
    const e = f.log[f.log.length - 1];
    if (e.kind === "block") {
      const other = otherRole(e.role);
      const blocker = document.querySelector("[data-fight-card='" + e.role + "']"), them = document.querySelector("[data-fight-card='" + other + "']");
      const said = () => setPop({ role: other, text: "Blocked", key: f.log.length });
      if (!blocker || !them || !feat.fx || !blocker.animate) { said(); return; }
      blocker.scrollIntoView({ block: "nearest" });
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { blocker.animate([{ boxShadow: "0 0 0 3px #9FDCFF" }, { boxShadow: "0 0 0 0 transparent" }], { duration: 1200, easing: "ease-out" }); said(); return; }
      setTimeout(said, playBlockFx(f[e.role].weapon, blocker, them));
      return;
    }
    if (e.kind !== "strike") return;
    const target = otherRole(e.role);
    const pop = () => setPop({ role: target, amount: e.dmg, key: f.log.length });
    const striker = document.querySelector("[data-fight-card='" + e.role + "']"), struck = document.querySelector("[data-fight-card='" + target + "']");
    const weapon = { ...f[e.role].weapon, type: "melee" };
    if (!striker || !struck || !feat.fx || !striker.animate) { pop(); return; }
    striker.scrollIntoView({ block: "nearest" }); // on a phone the buttons below may have scrolled the cards out of view
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { calmHit(struck, weapon); pop(); return; }
    const hit = playAttackFx(weapon, striker, struck, { shock: !!e.shock });
    setTimeout(pop, hit);
  }, [f.log.length]);

  const name = (role) => f[role] && f[role].op ? f[role].op.name : "";
  const who = (role) => mine(role) && f.online ? "You" : name(role);
  const waitingOn = (role) => f.online && !mine(role);
  const slow = dropped || (f.online && now - f.changedAt > 60000);
  const dieKind = (role, v) => attackDie(v, fightRules(f[role].weapon, f[role].op.injured));
  // Plain functions, not components, so the cards keep the same elements between renders and the animations land on them.
  const dice = (role) => {
    const s = f[role];
    if (!s || !s.weapon) return null;
    const box = (key, v, kind, opts) => (
      <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <button data-die={"f:" + role + ":" + key} data-v={v == null ? "" : v + (opts.dashed ? "r" : "")} disabled={!opts.onClick} onClick={opts.onClick} aria-label={opts.aria} aria-pressed={opts.pressed}
          className="compact-btn" style={dieStyle(kind, 30, { onClick: opts.onClick, faded: opts.faded, pressed: opts.pressed, rerolled: opts.dashed })}>{dieFace(v, kind, 30)}</button>
        {opts.note && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", color: "var(--muted)", textTransform: "uppercase", fontFamily: "'Rajdhani', sans-serif" }}>{opts.note}</span>}
      </div>
    );
    if (f.slots && f.stage !== "roll") {
      // Bright: still to use. Faded: used, lost or failed. On your turn, tap one of your bright dice to pick it.
      const pickable = f.stage === "resolve" && f.turn === role && mine(role);
      return (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6, alignItems: "flex-start" }}>
          {f.slots[role].map((x, i) => {
            const left = f.left[role].includes(i), used = f.used[role][i];
            const name = (x.auto ? "Kept die (Accurate)" : "Die " + (i + 1) + ": " + x.v) + ", " + (x.kind === "fail" ? "failed" : x.kind === "crit" ? "crit" : "normal success");
            return box(i, x.auto ? "A" : x.v, x.kind, {
              faded: !left, note: used || (x.rule && left ? x.rule : ""), pressed: pickable && pick === i,
              onClick: pickable && left ? () => setSel(i) : null,
              aria: name + (used ? ", " + used.toLowerCase() : left ? ", still to use" : ""),
            });
          })}
        </div>
      );
    }
    const count = fightDiceCount(s.weapon);
    const canRe = mine(role) && s.dice && !s.ready && f.stage === "roll";
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
        {(s.dice || Array(count).fill(null)).map((v, i) => box(i, v, v == null ? null : dieKind(role, v), {
          dashed: s.rr[i], onClick: canRe && !s.rr[i] ? () => onAct({ type: "reroll", role, i, v: Math.floor(Math.random() * 6) + 1 }) : null,
          aria: v == null ? "Not rolled" : "Die " + (i + 1) + ": " + v + (canRe && !s.rr[i] ? ", tap to re-roll" : ""),
        }))}
      </div>
    );
  };
  const card = (role) => {
    const s = f[role];
    if (!s) return (
      <div style={{ ...cd, marginBottom: 0, padding: 10, borderRight: "3px solid var(--line)" }}>
        <div style={{ ...h3, marginBottom: 2 }}>Fights back</div>
        <div style={{ ...mu, fontSize: 13 }}>Pick who they're fighting.</div>
      </div>
    );
    const hp = Math.max(0, fightHp(f, role));
    const col = sideColor(s.side);
    return (
      <div key={role + ":" + (s.op && s.op.id)} data-fight-card={role} style={vsCard(col, role === "def", hp <= 0)}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
          <div style={{ ...h3, marginBottom: 0, color: col, flex: 1, minWidth: 0 }}>{role === "atk" ? "Attacking" : "Fights back"}{f.online && mine(role) ? " (you)" : ""}</div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: hp <= 0 ? "#B8341C" : hp < s.op.max / 2 ? "var(--gold)" : "var(--text)" }}>{hp}/{s.op.max}W</span>
        </div>
        <div data-vs-name={role} style={{ ...vsName, textDecoration: hp <= 0 ? "line-through" : "none" }}>{s.op.name}</div>
        {s.weapon
          ? <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.weapon.name} {"·"} {s.weapon.atk} {"·"} {s.weapon.hit} {"·"} {s.weapon.dmg}{s.weapon.wr && s.weapon.wr !== "-" ? " · " + s.weapon.wr : ""}{s.op.injured ? " · injured: hits on 1 worse" : ""}</div>
          : <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Picking a weapon</div>}
        {dice(role)}
        {pop && pop.role === role && <span key={pop.key} className="ks-pop" style={{ position: "absolute", right: 10, top: 8, fontSize: 20, fontWeight: 700, color: "#E0664A", fontFamily: "'Rajdhani', sans-serif", pointerEvents: "none", ...(pop.text ? { color: "#9FDCFF", letterSpacing: "0.06em" } : {}) }}>{pop.text ? pop.text.toUpperCase() : "-" + pop.amount}</span>}
      </div>
    );
  };
  const big = { padding: "10px 14px", fontSize: 13 };
  const wait = (text, key) => (
    <div key={key} style={{ ...mu, fontSize: 14, padding: "8px 0" }}>{text}
      {slow && <div style={{ marginTop: 8 }}><button onClick={onTakeOver} style={{ ...bs("var(--muted)"), ...big }}>Do it for them</button><div style={{ fontSize: 12, marginTop: 4 }}>{dropped ? "Or wait: when you're connected again, it carries on." : "No answer for a minute. You can finish this fight on your device."}</div></div>}
    </div>
  );

  let body;
  if (f.stage === "target") {
    body = enemies.length ? (
      <div>
        <div style={{ ...mu, fontSize: 14, marginBottom: 8 }}>Who is {name("atk")} fighting? It has to be within 1" (control range).</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 6 }}>
          {enemies.map(e => (
            <button key={e.op.id} onClick={() => onAct({ type: "target", def: newFightSide(e.side, e.info) })} style={{ ...cd, marginBottom: 0, padding: "8px 10px", textAlign: "left", cursor: "pointer", borderLeft: "3px solid " + sideColor(e.side), display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{e.op.name}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{e.info.start}/{e.info.max}</span>
            </button>
          ))}
        </div>
      </div>
    ) : <div style={{ ...mu, fontSize: 14 }}>{importHint}</div>;
  } else if (f.stage === "weapon") {
    body = mine("def") ? (
      <div>
        <div style={{ ...mu, fontSize: 14, marginBottom: 8 }}>{f.online ? name("atk") + " is fighting your " + name("def") + ". " : ""}Pick the melee weapon {name("def")} fights back with.</div>
        {defWeapons.length ? defWeapons.map((w, i) => (
          <button key={i} onClick={() => onAct({ type: "weapon", weapon: { name: w.name, atk: w.atk, hit: w.hit, dmg: w.dmg, wr: w.wr || "-" } })} style={{ ...cd, marginBottom: 6, padding: "8px 10px", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{w.name}</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{w.atk} {"·"} {w.hit} {"·"} {w.dmg}{w.wr && w.wr !== "-" ? " · " + w.wr : ""}</span>
          </button>
        )) : <div style={{ ...mu, fontSize: 14 }}>{name("def")} has no melee weapon on its datacard. Ask your opponent which one it uses.</div>}
      </div>
    ) : wait("Waiting for your opponent to pick " + name("def") + "'s weapon.");
  } else if (f.stage === "roll") {
    const rollRow = (role) => {
      const s = f[role];
      if (!mine(role)) return wait(s.ready ? name(role) + " has rolled." : "Waiting for your opponent to roll for " + name(role) + ".", role);
      if (s.ready) return <div key={role} style={{ ...mu, fontSize: 14, padding: "4px 0" }}>{name(role)} is ready.</div>;
      return (
        <div key={role} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
          {!s.dice && <button onClick={() => onAct({ type: "roll", role, dice: Array.from({ length: fightDiceCount(s.weapon) }, () => Math.floor(Math.random() * 6) + 1) })} style={{ ...bs(role === "atk" ? "#D0573A" : "var(--accent)"), ...big }}><Icon name="dice" size={14} /> Roll {fightDiceCount(s.weapon)} dice for {name(role)}</button>}
          {s.dice && <button onClick={() => onAct({ type: "ready", role })} style={{ ...bs("var(--accent)"), ...big }}>Done rolling for {name(role)}</button>}
          {s.dice && <span style={{ fontSize: 12, color: "var(--muted)" }}>Tap a die to re-roll it (Balanced, Command Re-roll). Each die only once.</span>}
        </div>
      );
    };
    body = <div>{rollRow("atk")}{rollRow("def")}</div>;
  } else if (f.stage === "resolve") {
    const me = f.turn, them = otherRole(me), theirLeft = f.left[them];
    const use = f.slots[me][pick].kind;
    const blocks = ["crit", "norm"].map(h => ({ h, j: theirLeft.find(x => f.slots[them][x].kind === h) })).filter(b => b.j !== undefined && canFightBlock(use, b.h, f[them].weapon));
    const brutal = /\bBrutal\b/.test(f[them].weapon.wr || "") && use === "norm" && theirLeft.length;
    body = mine(me) ? (
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", marginBottom: 2 }}>{f.online ? "Your turn" : name(me) + "'s turn"}: use one success</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Using the {use === "crit" ? "crit" : "normal success"} with the white outline. Tap another of your bright dice to use that instead.</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => onAct({ type: "act", role: me, kind: "strike", i: pick })} style={{ ...bs("#E0664A"), ...big, background: "#B8341C30" }}><Icon name="melee" size={14} /> Strike: {fightDmg(f[me].weapon, use)} damage</button>
          {blocks.map(b => <button key={b.h} onClick={() => onAct({ type: "act", role: me, kind: "block", i: pick, j: b.j })} style={{ ...bs("var(--blue)"), ...big }}>Block their {fightWords(b.h)}</button>)}
        </div>
        {brutal ? <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Their weapon is Brutal: only crits can block it.</div> : null}
      </div>
    ) : wait("Waiting for your opponent: " + name(me) + "'s turn.");
  } else {
    const out = ["atk", "def"].filter(r => fightHp(f, r) <= 0);
    body = (
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Fight over</div>
        <div style={{ ...mu, fontSize: 14, margin: "4px 0 10px" }}>
          {name("atk")} took {f.dmg.atk} damage and {name("def")} took {f.dmg.def}.{out.length ? " " + out.map(name).join(" and ") + (out.length > 1 ? " are" : " is") + " incapacitated." : ""}
        </div>
        <button onClick={onClose} style={{ ...bs("var(--accent)"), ...big }}>Close</button>
      </div>
    );
  }
  const live = f.stage === "target" || f.stage === "weapon" || f.stage === "roll";
  // Tapping outside closes it only when nothing would be lost: before anyone has rolled (on the device that started it),
  // or once it's over. Mid-fight, or in a fight the other player started, use Cancel or Stop.
  const outside = (e) => {
    if (e.target !== e.currentTarget) return;
    if (f.stage === "done" || f.stage === "target") onClose();
    else if (f.stage === "weapon" && mine("atk") && !(f.atk.dice || (f.def && f.def.dice))) onAct({ type: "cancel" });
  };
  return (
    <div onClick={outside} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 12px", overflowY: "auto" }}>
      <div role="dialog" aria-modal="true" aria-label="Fight" style={{ ...cd, width: "100%", maxWidth: 620, padding: 14, borderTop: "3px solid #D0573A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#E0664A", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="melee" size={14} /> FIGHT{f.online ? " (ONLINE)" : ""}{helpButton(help, () => setHelp(!help))}</div>
          {f.stage !== "done" && <button autoFocus onClick={() => onAct({ type: "cancel" })} style={{ ...bs("var(--muted)"), fontSize: 11, padding: "3px 8px" }}><Icon name="x" size={12} /> {live ? "Cancel" : "Stop fight"}</button>}
        </div>
        <AttackHelp kind="fight" open={help} />
        {dropped && <div role="status" style={{ ...mu, fontSize: 13, color: "var(--gold)", marginBottom: 8 }}>Connection lost. Your dice and moves are saved here and go to your opponent when you're back online.</div>}
        {f.note && <div style={{ ...mu, fontSize: 13, color: "var(--gold)", marginBottom: 8 }}>{f.note}</div>}
        <VsPair kind="fight">{card("atk")}{card("def")}</VsPair>
        {body}
        {f.log.length > 0 && (
          <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--bg)", borderRadius: 6, border: "1px solid var(--raised)" }}>
            {f.log.map((e, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
                {i + 1}. {who(e.role)} {e.kind === "strike" ? <>struck with a {fightWords(e.use)}: <b style={{ color: "#E0664A" }}>{e.dmg} damage</b>.{e.shock ? " Shock: " + name(otherRole(e.role)) + " loses a " + fightWords(e.shock) + "." : ""}</> : <>blocked {name(otherRole(e.role))}'s {fightWords(e.hit)} with a {fightWords(e.use)}.</>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

