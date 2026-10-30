/* ═══ SHOOTING (shared attack card) ═══ */
// One Shoot action: the attacker picks the target (and, for Blast and Torrent, the extra targets), rolls attack dice,
// then whoever owns each target rolls its defense dice. The defense prompt opens as soon as the attack has hits; the
// attacker can re-roll until the defender rolls, and the defender's roll carries the attack dice they saw, so both agree. Players are "A" (shooting) and "B"; on one device this device
// plays both. Online both devices run reduceShot on the same actions, as with fights.
const isMulti = (w) => /\b(Blast|Torrent)\b/.test(w.wr || "");
const shotRules = (s) => fightRules(s.atk.weapon, s.atk.op.injured);
const shotAttack = (s, t) => attackResult((t.a && t.a.dice) || [], shotRules(s), t.obscured);
const shotDefCount = (s, t) => defenceDiceCount(diceRules(s.atk.weapon), shotAttack(s, t), t.cover);
const saveDie = (v, save) => v === 1 ? "fail" : v === 6 ? "crit" : v >= save ? "hit" : "fail";
const shotDefense = (t) => {
  let crits = 0, saves = 0;
  (t.d.dice || []).forEach(v => { const k = saveDie(v, t.save); if (k === "crit") crits++; else if (k === "hit") saves++; });
  return { crits, saves: saves + (t.d.kept || 0) };
};
const shotDamage = (s, t) => {
  const a = shotAttack(s, t);
  if (!a.crits && !a.hits) return 0;
  const [n, c] = String(s.atk.weapon.dmg).split("/").map(x => parseInt(x, 10) || 0);
  return damageThrough(a, shotDefense(t), n, c, false, false);
};
const shotTotal = (t) => t.dmg == null ? 0 : Math.max(0, t.dmg + (t.adjust || 0));
const newShotTarget = (owner, op) => ({ owner, op, save: parseInt(op.save, 10) || 4, obscured: false, cover: false, a: { dice: null, rr: [], ready: false }, d: { dice: null, rr: [], ready: false, kept: 0 }, dmg: null, adjust: 0 });
const newShot = (id, online, mine, atkOp, weapon) => ({
  id, online, wasOnline: online, mine, roles: online ? [mine] : ["A", "B"], stage: "target", ti: 0, hot: null, changedAt: Date.now(),
  atk: { op: atkOp, weapon }, targets: [],
});
// Who acts for an action: the shooter for the attack side, the target's owner for its defense.
const shotActor = (s, a) => ["obscured", "next", "hot", "target", "more"].includes(a.type) || ((a.type === "roll" || a.type === "reroll" || a.type === "ready") && a.who === "a") ? "A"
  : ["cover", "save", "adjust"].includes(a.type) || a.who === "d" ? (s.targets[s.ti] ? s.targets[s.ti].owner : "A") : null;
function reduceShot(s, a) {
  if (!s) return s;
  const t = s.targets[s.ti];
  const cur = (patch) => ({ ...s, targets: s.targets.map((x, i) => i === s.ti ? { ...x, ...patch } : x) });
  // With hits the defense prompt is open; without (yet), it's still the attacker's go.
  const settle = (n) => { const nt = n.targets[n.ti], r = nt.a.dice ? shotAttack(n, nt) : { crits: 0, hits: 0 }; return { ...n, stage: r.crits || r.hits ? "defense" : "attack" }; };
  switch (a.type) {
    case "target": return s.stage === "target" ? { ...s, targets: [a.target], stage: isMulti(s.atk.weapon) ? "more" : "attack" } : s;
    case "more": return s.stage === "more" ? { ...s, targets: [...s.targets, ...(a.targets || [])], stage: "attack" } : s;
    case "obscured": return t && (s.stage === "attack" || s.stage === "defense") && !t.d.dice ? settle(cur({ obscured: !!a.v })) : s;
    case "cover": return t && s.stage === "defense" && !t.d.dice ? cur({ cover: !!a.v }) : s;
    case "save": return t && s.stage === "defense" && !t.d.ready && a.v >= 2 && a.v <= 6 ? cur({ save: a.v }) : s;
    case "roll": {
      if (!t) return s;
      if (a.who === "a") return (s.stage === "attack" || s.stage === "defense") && !t.d.dice ? settle(cur({ a: { dice: a.dice, rr: a.dice.map(() => false), ready: false } })) : s;
      if (s.stage !== "defense" || t.d.ready || t.d.dice) return s;
      // Their roll locks the attack: use the attack dice the defender saw (a re-roll crossing it online is dropped on both sides).
      const n = Array.isArray(a.atk) ? cur({ a: { ...t.a, dice: a.atk, rr: a.arr || a.atk.map(() => true) }, obscured: a.obs === undefined ? t.obscured : !!a.obs }) : s;
      const nt = n.targets[n.ti];
      return { ...n, targets: n.targets.map((x, i) => i === n.ti ? { ...x, a: { ...x.a, ready: true }, d: { ...x.d, dice: a.dice, rr: a.dice.map(() => false), kept: shotDefCount(n, nt).coverSave } } : x) };
    }
    case "reroll": {
      const side = t && t[a.who];
      if (!side || !side.dice || side.rr[a.i] || side.ready || (a.who === "a" && t.d.dice)) return s;
      const n = cur({ [a.who]: { ...side, dice: side.dice.map((v, i) => i === a.i ? a.v : v), rr: side.rr.map((r, i) => r || i === a.i) } });
      return a.who === "a" ? settle(n) : n;
    }
    case "ready": {
      if (!t) return s;
      if (a.who === "a" && s.stage === "attack" && t.a.dice) { // no hits: the attacker is done with this target
        const res = shotAttack(s, t);
        if (res.crits || res.hits) return s;
        return { ...cur({ a: { ...t.a, ready: true } }), targets: s.targets.map((x, i) => i === s.ti ? { ...x, a: { ...x.a, ready: true }, dmg: 0 } : x), stage: "result" };
      }
      if (a.who === "d" && s.stage === "defense" && !t.d.ready && (t.d.dice || shotDefCount(s, t).roll === 0)) {
        const d = { ...t.d, dice: t.d.dice || [], kept: t.d.dice ? t.d.kept : shotDefCount(s, t).coverSave, ready: true };
        const n = cur({ d });
        return { ...n, targets: n.targets.map((x, i) => i === n.ti ? { ...x, dmg: shotDamage(n, x) } : x), stage: "result" };
      }
      return s;
    }
    case "adjust": return t && (s.stage === "result" || s.stage === "done") && t.dmg != null ? cur({ adjust: Math.max(-t.dmg, (t.adjust || 0) + a.delta) }) : s;
    case "next": return s.stage !== "result" ? s : s.ti + 1 < s.targets.length ? { ...s, ti: s.ti + 1, stage: "attack" } : { ...s, stage: "done" };
    case "hot": return s.stage === "done" && !s.hot && /\bHot\b/.test(s.atk.weapon.wr || "") ? { ...s, hot: { v: a.v, dmg: a.v < (parseInt(s.atk.weapon.hit, 10) || 6) ? a.v * 2 : 0 } } : s;
    case "cancel": return { ...s, stage: "canceled" };
    case "takeover": return { ...s, stage: "takenOver" };
    default: return s;
  }
}

function ShootScreen({ shot, dropped, options, others, sideColor, onAct, onClose, onTakeOver, importHint }) {
  const { feat } = React.useContext(FeatureCtx);
  const s = shot, t = s.targets[s.ti];
  const mine = (player) => s.roles.includes(player);
  const local = !s.online;
  const [now, setNow] = useState(Date.now());
  const [pop, setPop] = useState(null);
  const [extra, setExtra] = useState({}); // Blast/Torrent: extra targets ticked, by key
  const [entry, setEntry] = useState(null); // typing in real dice: { who, vals }
  const [help, setHelp] = useState(false);
  useDiceTumble("s");
  // The versus intro when the shooter and each target first face off (not when a screen with dice already rolled reopens).
  const faced = React.useRef(null);
  React.useEffect(() => {
    const key = t && t.op ? s.atk.op.id + ">" + t.op.id + ":" + s.ti : null;
    if (!key || faced.current === key) return;
    const fresh = faced.current !== null || !t.a.dice;
    faced.current = key;
    if (!fresh || !feat.fx || !document.body.animate) return;
    const screen = document.querySelector("[role=dialog][aria-label='Shoot']");
    playVersusFx(screen, ["atk", "t"].map(r => document.querySelector("[data-shot-card] [data-vs-name='" + r + "']")), document.querySelector("[data-vs='shoot']"));
  }, [t && t.op && t.op.id, s.ti]);
  React.useEffect(() => { const i = setInterval(() => setNow(Date.now()), 5000); return () => clearInterval(i); }, []);
  React.useEffect(() => { setEntry(null); }, [s.stage, s.ti]);
  // When a target's result comes in: the weapon's effect from the shooter to the target, and the damage number.
  const shown = React.useRef(null);
  React.useEffect(() => {
    const key = s.ti + ":" + s.stage;
    if (s.stage !== "result" || shown.current === key) return;
    shown.current = key;
    const total = shotTotal(t);
    const from = document.querySelector("[data-shot-card='atk']"), to = document.querySelector("[data-shot-card='t']");
    if (!from || !to || !total || !feat.fx || !from.animate) { if (total) setPop({ amount: total, key }); return; }
    from.scrollIntoView({ block: "nearest" }); // on a phone the buttons below may have scrolled the cards out of view
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { calmHit(to, s.atk.weapon); setPop({ amount: total, key }); return; }
    const hit = playAttackFx(s.atk.weapon, from, to);
    setTimeout(() => setPop({ amount: total, key }), hit);
  }, [s.stage, s.ti]);
  React.useEffect(() => {
    if (!s.hot || !s.hot.dmg) return;
    const card = document.querySelector("[data-shot-card='atk']"), still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (card && card.animate && feat.fx && !still) playHotFx(card);
  }, [s.hot && s.hot.v]);

  const sideOf = (owner) => owner === s.mine ? "mine" : "opp";
  const slow = dropped || (s.online && now - s.changedAt > 60000);
  const big = { padding: "10px 14px", fontSize: 13 };
  const wait = (text, key) => (
    <div key={key} style={{ ...mu, fontSize: 14, padding: "8px 0" }}>{text}
      {slow && <div style={{ marginTop: 8 }}><button onClick={onTakeOver} style={{ ...bs("var(--muted)"), ...big }}>Do it for them</button><div style={{ fontSize: 12, marginTop: 4 }}>{dropped ? "Or wait: when you're connected again, it carries on." : "No answer for a minute. You can finish this shot on your device."}</div></div>}
    </div>
  );
  const atkRules = shotRules(s);
  const dieBtn = (v, kind, i, canRe, onRe, rr, who2) => (
    <button key={i} data-die={"s:" + who2 + ":" + s.ti + ":" + i} data-v={v == null ? "" : v + (rr ? "r" : "")} disabled={!canRe || rr} onClick={onRe} aria-label={v == null ? "Not rolled" : "Die " + (i + 1) + ": " + v + (canRe && !rr ? ", tap to re-roll" : "")}
      className="compact-btn" style={dieStyle(kind, 30, { onClick: canRe && !rr ? onRe : null, rerolled: rr })}>{dieFace(v, kind, 30)}</button>
  );
  const diceRow = (who2) => {
    if (!t) return null;
    const side = t[who2], count = who2 === "a" ? fightDiceCount(s.atk.weapon) : shotDefCount(s, t).roll;
    const player = who2 === "a" ? "A" : t.owner;
    const canRe = mine(player) && side.dice && !side.ready && (who2 === "a" ? (s.stage === "attack" || s.stage === "defense") && !t.d.dice : s.stage === "defense");
    const kind = (v) => who2 === "a" ? attackDie(v, atkRules) : saveDie(v, t.save);
    if (entry && entry.who === who2) return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
        {entry.vals.map((v, i) => <button key={i} onClick={() => setEntry({ ...entry, vals: entry.vals.map((x, j) => j === i ? (x || 0) % 6 + 1 : x) })} aria-label={"Die " + (i + 1) + (v ? ": " + v : ": not set") + ", tap to change"} className="compact-btn"
          style={{ ...dieStyle(v ? "set" : null, 30, { onClick: true }), ...(v ? {} : { border: "2px solid var(--accent)", color: "var(--text)" }) }}>{v ? dieFace(v, "set", 30) : "?"}</button>)}
      </div>
    );
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6, alignItems: "center" }}>
        {(side.dice || Array(count).fill(null)).map((v, i) => dieBtn(v, v == null ? null : kind(v), i, canRe, () => onAct({ type: "reroll", who: who2, i, v: Math.floor(Math.random() * 6) + 1 }), side.rr[i], who2))}
        {who2 === "d" && (side.dice ? side.kept : shotDefCount(s, t).coverSave) > 0 && <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 7px", borderRadius: 4, border: "1px solid #5A9C3A", color: "#5A9C3A" }}>+1 cover save</span>}
      </div>
    );
  };
  const card = (role) => {
    const isAtk = role === "atk";
    const op = isAtk ? s.atk.op : t && t.op;
    if (!op) return (
      <div style={{ ...cd, marginBottom: 0, padding: 10, borderRight: "3px solid var(--line)" }}>
        <div style={{ ...h3, marginBottom: 2 }}>Target</div>
        <div style={{ ...mu, fontSize: 13 }}>Pick who {s.atk.op.name} is shooting.</div>
      </div>
    );
    const owner = isAtk ? "A" : t.owner, col = sideColor(sideOf(owner));
    const hp = isAtk ? Math.max(0, op.start - (s.hot ? s.hot.dmg : 0)) : Math.max(0, op.start - shotTotal(t));
    return (
      <div key={isAtk ? "atk" : "t:" + s.ti + ":" + op.id} data-shot-card={isAtk ? "atk" : "t"} style={vsCard(col, !isAtk, hp <= 0)}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
          <div style={{ ...h3, marginBottom: 0, color: col, flex: 1, minWidth: 0 }}>{isAtk ? "Shooting" : s.targets.length > 1 ? "Target " + (s.ti + 1) + " of " + s.targets.length : "Target"}{s.online && mine(owner) ? " (you)" : ""}</div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: hp <= 0 ? "#B8341C" : hp < op.max / 2 ? "var(--gold)" : "var(--text)" }}>{hp}/{op.max}W</span>
        </div>
        <div data-vs-name={role} style={{ ...vsName, textDecoration: hp <= 0 ? "line-through" : "none" }}>{op.name}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
          {isAtk ? <>{s.atk.weapon.name} {"·"} {s.atk.weapon.atk} {"·"} {s.atk.weapon.hit} {"·"} {s.atk.weapon.dmg}{s.atk.weapon.wr && s.atk.weapon.wr !== "-" ? " · " + s.atk.weapon.wr : ""}{op.injured ? " · injured: hits on 1 worse" : ""}</>
            : <>Save {t.save}+{t.cover ? " · in cover" : ""}{t.obscured ? " · obscured" : ""}</>}
        </div>
        {isAtk ? (t && diceRow("a")) : diceRow("d")}
        {!isAtk && pop && <span key={pop.key} className="ks-pop" style={{ position: "absolute", right: 10, top: 8, fontSize: 20, fontWeight: 700, color: "#E0664A", fontFamily: "'Rajdhani', sans-serif", pointerEvents: "none" }}>-{pop.amount}</span>}
      </div>
    );
  };
  // Roll, or type in the real dice rolled at the table.
  const rollControls = (who2, count, label, color) => entry && entry.who === who2 ? (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <button disabled={entry.vals.some(v => !v)} onClick={() => { onAct({ type: "roll", who: who2, dice: entry.vals }); setEntry(null); }} style={{ ...bs("var(--accent)"), ...big, opacity: entry.vals.some(v => !v) ? 0.5 : 1 }}>Use these dice</button>
      <button onClick={() => setEntry(null)} style={{ ...bs("var(--muted)"), ...big }}>Back</button>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>Tap each die until it shows what you rolled.</span>
    </div>
  ) : (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <button onClick={() => onAct({ type: "roll", who: who2, dice: Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1) })} style={{ ...bs(color), ...big }}><Icon name="dice" size={14} /> {label}</button>
      <button onClick={() => setEntry({ who: who2, vals: Array(count).fill(0) })} style={{ ...bs("var(--muted)"), ...big }}>Enter real dice</button>
    </div>
  );
  const toggle = (on, label, onClick, disabled) => (
    <button role="switch" aria-checked={on} disabled={disabled} onClick={onClick} style={{ ...bs(on ? "var(--accent)" : "var(--muted)"), padding: "8px 12px", fontSize: 12, background: on ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent", opacity: disabled ? 0.5 : 1 }}>{label}{on ? ": on" : ""}</button>
  );

  let body;
  if (s.stage === "target") {
    body = options.length ? (
      <div>
        <div style={{ ...mu, fontSize: 14, marginBottom: 8 }}>Who is {s.atk.op.name} shooting? Pick a valid target: visible, and not on Conceal in cover.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 6 }}>
          {options.map(o => (
            <button key={o.key} onClick={() => onAct({ type: "target", target: newShotTarget(o.owner, o.info) })} style={{ ...cd, marginBottom: 0, padding: "8px 10px", textAlign: "left", cursor: "pointer", borderLeft: "3px solid " + sideColor(sideOf(o.owner)), display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{o.info.name}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{o.info.start}/{o.info.max}</span>
            </button>
          ))}
        </div>
      </div>
    ) : <div style={{ ...mu, fontSize: 14 }}>{importHint}</div>;
  } else if (s.stage === "more") {
    const blast = /\bBlast\b/.test(s.atk.weapon.wr || ""), m = (s.atk.weapon.wr || "").match(/\b(Blast|Torrent) (\d+)"/);
    const dist = m ? m[2] + "\"" : "range";
    const list = blast ? others : others.filter(o => o.owner !== "A");
    body = (
      <div>
        <div style={{ ...mu, fontSize: 14, marginBottom: 8 }}>{blast
          ? <>Blast: every other operative within {dist} of {t.op.name} is hit too, friend or foe. Tick each one.</>
          : <>Torrent: you can also shoot any other enemies within {dist} of {t.op.name}. Tick the ones you shoot.</>} Each gets its own attack and defense roll.</div>
        {list.map(o => (
          <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--raised)", cursor: "pointer" }}>
            <input type="checkbox" checked={!!extra[o.key]} onChange={() => setExtra(x => ({ ...x, [o.key]: !x[o.key] }))} style={{ width: 18, height: 18 }} />
            <span style={{ width: 4, alignSelf: "stretch", background: sideColor(sideOf(o.owner)), borderRadius: 2 }} />
            <span style={{ flex: 1, fontSize: 14, color: "var(--text)" }}>{o.info.name}{o.owner === "A" ? " (yours)" : ""}</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{o.info.start}/{o.info.max}</span>
          </label>
        ))}
        <button onClick={() => onAct({ type: "more", targets: list.filter(o => extra[o.key]).map(o => newShotTarget(o.owner, o.info)) })} style={{ ...bs("var(--accent)"), ...big, marginTop: 10 }}>Start shooting{Object.values(extra).filter(Boolean).length ? " (" + (1 + list.filter(o => extra[o.key]).length) + " targets)" : ""}</button>
      </div>
    );
  } else if (s.stage === "attack" || s.stage === "defense") {
    const count = fightDiceCount(s.atk.weapon), r = shotAttack(s, t), n = shotDefCount(s, t), saturate = diceRules(s.atk.weapon).saturate;
    const summary = <><b style={{ color: "var(--gold)" }}>{r.crits} crit{r.crits === 1 ? "" : "s"}</b>, <b style={{ color: "#5A9C3A" }}>{r.hits} hit{r.hits === 1 ? "" : "s"}</b>{r.obscuredLost ? " (obscured: crits count as hits, one lost)" : ""}</>;
    // The shooter: roll, then re-roll or switch Obscured until the defender rolls.
    const shooter = !mine("A") ? (s.stage === "attack" ? wait("Waiting for your opponent to roll attack dice for " + s.atk.op.name + ".") : null) : (
      <div style={{ marginBottom: s.stage === "defense" ? 12 : 0 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {toggle(t.obscured, "Obscured", () => onAct({ type: "obscured", v: !t.obscured }), !!t.d.dice)}
        </div>
        {!t.a.dice ? rollControls("a", count, "Roll " + count + " attack dice", "#E0664A") : (
          <div>
            <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{summary}.{s.stage === "attack" ? " No hits." : ""}</div>
            {!t.d.dice && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Tap a die to re-roll it (Balanced, Ceaseless, Relentless, Command Re-roll), until the defender rolls. Each die only once.</div>}
            {s.stage === "attack" && <button onClick={() => onAct({ type: "ready", who: "a" })} style={{ ...bs("var(--accent)"), ...big }}>No hits: done</button>}
          </div>
        )}
      </div>
    );
    let defender = null;
    if (s.stage === "defense") {
      const handOver = local && t.owner !== "A"; // one device: the other player rolls their own saves
      defender = mine(t.owner) ? (
        <div style={{ borderTop: mine("A") ? "1px solid var(--raised)" : "none", paddingTop: mine("A") ? 10 : 0 }}>
          <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{s.online ? s.atk.op.name + " is shooting your " + t.op.name + " with " + s.atk.weapon.name + ": " : ""}{s.online ? <>{summary}. </> : ""}{n.roll ? "Roll " + n.roll + " defense " + (n.roll === 1 ? "die" : "dice") + ", " + t.save + "+ to save." : "No defense dice to roll."}</div>
          {handOver && !t.d.dice && <div style={{ ...mu, fontSize: 13, color: "var(--gold)", marginBottom: 6 }}>Hand the phone to {t.op.name}'s player, or roll your own dice and enter them.</div>}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" }}>
            {toggle(t.cover, "Cover", () => onAct({ type: "cover", v: !t.cover }), !!t.d.dice || saturate)}
            <label style={{ fontSize: 12, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>Save
              <select value={t.save} disabled={t.d.ready} onChange={e => onAct({ type: "save", v: parseInt(e.target.value, 10) })} style={{ background: "var(--raised)", color: "var(--text)", border: "1px solid var(--line)", borderRadius: 4, padding: "4px 6px" }}>
                {[2, 3, 4, 5, 6].map(v => <option key={v} value={v}>{v}+</option>)}
              </select></label>
            {saturate && <span style={{ fontSize: 12, color: "var(--muted)" }}>Saturate: no cover save.</span>}
          </div>
          {!t.d.dice && n.roll > 0 ? rollControls("d", n.roll, "Roll " + n.roll + " defense " + (n.roll === 1 ? "die" : "dice"), "var(--blue)") : (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => onAct({ type: "ready", who: "d" })} style={{ ...bs("var(--accent)"), ...big }}>{n.roll ? "Done: see the damage" : "Continue"}</button>
              {t.d.dice && <span style={{ fontSize: 12, color: "var(--muted)" }}>Tap a die to re-roll it (Command Re-roll). Each die only once.</span>}
            </div>
          )}
        </div>
      ) : wait((s.online ? "Waiting for your opponent to roll defense for " : "Defense for ") + t.op.name + ".");
    }
    body = <div>{shooter}{defender}</div>;
  } else if (s.stage === "result") {
    const total = shotTotal(t), dead = t.op.start - total <= 0, more = s.ti + 1 < s.targets.length;
    body = (
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{total ? total + " damage to " + t.op.name : t.op.name + " takes no damage"}{dead ? ": incapacitated" : ""}</div>
        {mine(t.owner) && t.dmg != null && <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "6px 0", fontSize: 12, color: "var(--muted)" }}>Another rule changes it?
          <button aria-label="One less damage" disabled={total <= 0} onClick={() => onAct({ type: "adjust", delta: -1 })} className="compact-btn" style={{ ...bs("var(--muted)"), padding: "2px 10px" }}>−</button>
          <button aria-label="One more damage" onClick={() => onAct({ type: "adjust", delta: 1 })} className="compact-btn" style={{ ...bs("var(--muted)"), padding: "2px 10px" }}>+</button></div>}
        {mine("A") ? <button onClick={() => onAct({ type: "next" })} style={{ ...bs("var(--accent)"), ...big, marginTop: 6 }}>{more ? "Next target" : "Finish"}</button> : wait(more ? "Waiting for your opponent to shoot the next target." : "Waiting for your opponent to finish.")}
      </div>
    );
  } else {
    const hot = /\bHot\b/.test(s.atk.weapon.wr || "");
    body = (
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Shooting done</div>
        <div style={{ ...mu, fontSize: 14, margin: "4px 0 10px" }}>{s.targets.map(x => x.op.name + ": " + shotTotal(x) + " damage").join(" · ")}</div>
        {hot && !s.hot && (mine("A")
          ? <button onClick={() => onAct({ type: "hot", v: Math.floor(Math.random() * 6) + 1 })} style={{ ...bs("#E0664A"), ...big, marginBottom: 8 }}>Roll for Hot</button>
          : wait("Waiting for your opponent's Hot roll."))}
        {s.hot && <div style={{ fontSize: 14, color: s.hot.dmg ? "#E0664A" : "#5A9C3A", marginBottom: 8 }}>Hot: rolled {s.hot.v}. {s.hot.dmg ? s.atk.op.name + " takes " + s.hot.dmg + " damage." : "No damage."}</div>}
        {(!hot || s.hot || !mine("A")) && <button onClick={onClose} style={{ ...bs("var(--accent)"), ...big }}>Close</button>}
      </div>
    );
  }
  const early = s.stage === "target" || s.stage === "more" || s.stage === "attack";
  // Tapping outside closes it only when nothing would be lost: before the shooter has rolled, or once it's done.
  // Once dice are rolled, or in a shot the other player started, use Cancel or Stop.
  const outside = (e) => {
    if (e.target !== e.currentTarget) return;
    if (s.stage === "done" || ((s.stage === "target" || s.stage === "more") && mine("A"))) onClose();
    else if (s.stage === "attack" && mine("A") && t && !t.a.dice) onAct({ type: "cancel" }); // tells the other device, if online
  };
  return (
    <div onClick={outside} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 12px", overflowY: "auto" }}>
      <div role="dialog" aria-modal="true" aria-label="Shoot" style={{ ...cd, width: "100%", maxWidth: 620, padding: 14, borderTop: "3px solid var(--accent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="ranged" size={14} /> SHOOT{s.online ? " (ONLINE)" : ""}{helpButton(help, () => setHelp(!help))}</div>
          {s.stage !== "done" && <button autoFocus onClick={() => onAct({ type: "cancel" })} style={{ ...bs("var(--muted)"), fontSize: 11, padding: "3px 8px" }}><Icon name="x" size={12} /> {early ? "Cancel" : "Stop"}</button>}
        </div>
        <AttackHelp kind="shoot" open={help} />
        {dropped && <div role="status" style={{ ...mu, fontSize: 13, color: "var(--gold)", marginBottom: 8 }}>Connection lost. Your dice and moves are saved here and go to your opponent when you're back online.</div>}
        {s.note && <div style={{ ...mu, fontSize: 13, color: "var(--gold)", marginBottom: 8 }}>{s.note}</div>}
        <VsPair kind="shoot">{card("atk")}{card("t")}</VsPair>
        {body}
      </div>
    </div>
  );
}

