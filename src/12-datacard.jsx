/* ═══ WEAPON DISPLAY ═══ */
// requestAttack opens the Shoot screen (ranged) or the Fight screen (melee); without it, no dice button.
function WeaponBox({ w, tag, wtype, local, requestAttack }) {
  const { feat } = React.useContext(FeatureCtx);
  const color = wtype === "melee" ? "#D0573A" : "var(--accent)";
  return (
    <div style={{ background: "var(--raised)", borderRadius: 6, padding: "8px 10px", marginBottom: 6, borderLeft: "3px solid " + al(color, "70") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "1 1 140px", minWidth: 0 }}>
          <Icon name={wtype === "melee" ? "melee" : "ranged"} size={14} color={color} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.02em" }}>{w.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px 12px", flexWrap: "wrap", minWidth: 0 }}>
          {[["ATK", w.atk], ["HIT", w.hit], ["DMG", w.dmg]].map(([label, val]) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
              <Term k={label} style={{ fontSize: 13, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</Term>
              <span style={{ fontSize: 19, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{val}</span>
            </span>
          ))}
          {feat.dice && requestAttack && <button onClick={(e) => { e.stopPropagation(); requestAttack(); }} aria-label={(wtype === "melee" ? "Fight with " : "Shoot with ") + w.name}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, padding: "6px 10px", border: "1px solid " + al(color, "80"), borderRadius: 6, background: al(color, "18"), color, cursor: "pointer", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
            <Icon name={wtype === "melee" ? "melee" : "ranged"} size={14} />{wtype === "melee" ? "Fight" : "Shoot"}
          </button>}
        </div>
      </div>
      {(tag || (w.wr && w.wr !== "-")) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6, alignItems: "center" }}>
          {tag && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 19%, transparent)" }}>{tag}</span>}
          {w.wr && w.wr !== "-" && w.wr.split(", ").map((r, i) => (
            <Tip key={i} k={r} local={local}><span style={{ ...pl, fontSize: 12, marginBottom: 0, color: "inherit" }}>{r}</span></Tip>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ DATACARD ═══ */
// ── Limited uses (Limited x weapons, once-per-battle abilities, shared grenades) ──
const limitedMax = (wr) => { const m = /Limited (\d)/.exec(wr || ""); return m ? Number(m[1]) : 0; };
const isOncePerBattle = (text) => /once per battle/i.test(text || "") && !/once per battle (each|per|for each)|each (option|ploy|weapon)?\s*(only )?once per battle/i.test(text || "");
const grenadePool = (w) => w.note && w.note.indexOf("Explosive grenade") === 0;

function UsePips({ label, used, max, onSet }) {
  return (
    <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 8px 10px", flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: used >= max ? DS.threat : DS.textSecondary, fontFamily: DS.fontDisplay, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      {Array.from({ length: max }, (_, i) => (
        <button key={i} className="compact-btn" onClick={() => onSet(used > i ? i : i + 1)} aria-label={used > i ? "Mark use " + (i + 1) + " as unused" : "Mark use " + (i + 1) + " as used"}
          style={{ width: 30, height: 30, borderRadius: 4, border: "1.5px solid " + (used > i ? DS.threat : DS.divider), background: used > i ? al(DS.threat, "30") : "transparent", color: DS.threat, cursor: "pointer", fontSize: 12, padding: 0, lineHeight: 1 }}>{used > i ? "\u2715" : ""}</button>
      ))}
      {used >= max && <span style={{ fontSize: 11, color: DS.threat }}>used up</span>}
    </div>
  );
}

const ORDER_STYLE = { engage: { label: "Engage", color: "#C9772E" }, conceal: { label: "Conceal", color: "#6B9BF7" } };
function OrderChip({ order, onToggle }) {
  const o = ORDER_STYLE[order] || ORDER_STYLE.conceal;
  return (
    <button onClick={(e) => { e.stopPropagation(); onToggle(); }} title="Tap to switch order"
      style={{ flexShrink: 0, padding: "4px 8px", borderRadius: 4, border: "1px solid " + al(o.color, "70"), background: al(o.color, "20"), color: o.color, cursor: "pointer", fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{o.label}</button>
  );
}

const weaponBase = (name) => name.replace(/\s*\([^)]*\)\s*$/, "");
// "Name: rule text" shows the name in bold so it can be found at a glance.
const abilityText = (a, f) => {
  const m = a.match(/^([^:.]{2,40}):\s(.*)$/s);
  return m ? <React.Fragment><strong style={{ color: "var(--text)", fontWeight: 700 }}>{m[1]}:</strong> <RefText text={m[2]} f={f} self={m[1].replace(/\s*\([^)]*\)\s*$/, "")} /></React.Fragment> : <RefText text={a} f={f} />;
};
// The datacard's health bar: a tick per wound, a brighter tick at the injured line, and a pale trail that shrinks a
// moment after a hit so you can see the wounds just lost.
function HealthBar({ cw, maxW, color }) {
  const pct = maxW > 0 ? Math.max(0, Math.min(100, (cw / maxW) * 100)) : 0, line = maxW > 0 ? (Math.ceil(maxW / 2) / maxW) * 100 : 50;
  return (
    <div data-health={Math.round(pct)} role="meter" aria-label="Wounds" aria-valuemin={0} aria-valuemax={maxW} aria-valuenow={Math.max(0, cw)} style={{ height: 3, position: "relative" }}>
      <div style={{ position: "absolute", left: 6, right: 6, top: -3, height: 6, borderRadius: 3, background: DS.bgBase, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pct + "%", background: "#E9E2D3", opacity: 0.5, transition: "width 0.6s ease 0.45s" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pct + "%", background: "linear-gradient(180deg, color-mix(in srgb, " + color + " 70%, white), " + color + " 60%)", boxShadow: "0 0 6px " + al(color, "80"), transition: "width 0.25s ease-out, background 0.3s" }} />
        {maxW <= 30 && <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, transparent 0, transparent calc(" + (100 / maxW) + "% - 1px), rgba(0,0,0,0.45) calc(" + (100 / maxW) + "% - 1px), rgba(0,0,0,0.45) " + (100 / maxW) + "%)" }} />}
        <div style={{ position: "absolute", left: "calc(" + line + "% - 1px)", top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.55)" }} />
      </div>
    </div>
  );
}

// ── End-of-game recap: VP by turning point (from the score kept at the end of each one), who took out whom, and each
// side's best operative by damage dealt (from the battle log). Saved with the game in its history. ──
function gameRecap(log, vpByTp) {
  const rec = vpByTp || {}, last = Math.max(1, ...Object.keys(rec).map(Number).filter(n => n > 0));
  const vp = []; let prev = { you: 0, them: 0 };
  for (let t = 1; t <= last; t++) { const cur = rec[t] || prev; vp.push({ tp: t, you: cur.you - prev.you, them: cur.them - prev.them }); prev = cur; }
  const kills = (log || []).filter(e => e.after <= 0 && e.before > 0).map(e => ({ tp: e.tp, target: e.target, by: e.how === "dice" && e.by ? e.by : "", theirs: e.side === "opp" }));
  const dealt = {};
  (log || []).forEach(e => { if (e.how === "dice" && e.by && e.before > e.after) { const k = (e.side === "opp" ? "you" : "them") + "|" + e.by; dealt[k] = (dealt[k] || 0) + e.before - e.after; } });
  const best = (side) => { const top = Object.entries(dealt).filter(([k]) => k.startsWith(side + "|")).sort((a, b) => b[1] - a[1])[0]; return top ? { name: top[0].slice(side.length + 1), dmg: top[1] } : null; };
  return { vp, kills, best: { you: best("you"), them: best("them") } };
}
function GameRecap({ recap }) {
  if (!recap) return null;
  const cell = { padding: "3px 6px", textAlign: "center", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 14 };
  const sign = (n) => n > 0 ? "+" + n : n < 0 ? String(n) : "0";
  const { best } = recap;
  return (
    <div data-recap="true" style={{ marginTop: 10 }}>
      <div style={{ ...h3, marginBottom: 4 }}>VP by turning point</div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th />{recap.vp.map(v => <th key={v.tp} style={{ ...cell, color: "var(--muted)", fontSize: 12 }}>TP{v.tp}</th>)}<th style={{ ...cell, color: "var(--muted)", fontSize: 12 }}>Total</th></tr></thead>
          <tbody>
            {[["you", "You", "#5A9C3A"], ["them", "Them", "#E0664A"]].map(([k, label, col]) => (
              <tr key={k} style={{ borderTop: "1px solid var(--raised)" }}>
                <td style={{ ...cell, textAlign: "left", color: col, paddingLeft: 0 }}>{label}</td>
                {recap.vp.map(v => <td key={v.tp} style={{ ...cell, color: v[k] ? "var(--text)" : "var(--dim)" }}>{sign(v[k])}</td>)}
                <td style={{ ...cell, color: col }}>{recap.vp.reduce((a, v) => a + v[k], 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ ...h3, margin: "10px 0 4px" }}>Taken out</div>
      {recap.kills.length ? recap.kills.map((x, i) => (
        <div key={i} style={{ fontSize: 13, color: "var(--text2)", padding: "2px 0", display: "flex", gap: 6, alignItems: "baseline" }}>
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, minWidth: 28 }}>TP{x.tp}</span>
          <span><span style={{ color: x.theirs ? "#5A9C3A" : "#E0664A", fontWeight: 600 }}>{x.theirs ? "Their " : "Your "}{x.target}</span>{x.by ? ", by " + x.by : ""}</span>
        </div>
      )) : <div style={{ fontSize: 13, color: "var(--muted)" }}>Nobody was taken out.</div>}
      {(best.you || best.them) && <div style={{ ...h3, margin: "10px 0 4px" }}>Most damage dealt</div>}
      {best.you && <div style={{ fontSize: 13, color: "var(--text2)" }}>Yours: <strong style={{ color: "var(--text)" }}>{best.you.name}</strong>, {best.you.dmg} damage</div>}
      {best.them && <div style={{ fontSize: 13, color: "var(--text2)" }}>Theirs: <strong style={{ color: "var(--text)" }}>{best.them.name}</strong>, {best.them.dmg} damage</div>}
    </div>
  );
}

// Hits from the other player (online): chat-style bubbles that slide out from the Log button on the team bar and stay
// about 8 seconds, newest on top, three at most. Tapping one opens the battle log at that hit. If the Log button has
// scrolled off screen, or a screen (Shoot, Fight) covers it, they show at the top right, above that screen.
function HitBubbles({ notes, onOpen, onDismiss }) {
  const { feat } = React.useContext(FeatureCtx);
  const [pos, setPos] = useState(null);
  React.useLayoutEffect(() => {
    if (!notes.length) return;
    const b = document.querySelector("[data-logbtn]"), r = b && b.getBoundingClientRect();
    const covered = !!document.querySelector("[role=dialog][aria-modal=true]");
    const seen = !covered && r && r.width > 0 && r.bottom > 0 && r.bottom < window.innerHeight - 120;
    // Kept on screen: lined up with the Log button's right edge where it fits, the pointer moved to stay under the button.
    const w = Math.min(320, window.innerWidth - 16);
    if (!seen) { setPos({ top: 12, right: 8, w, tail: null }); return; }
    const right0 = window.innerWidth - r.right, right = Math.max(8, Math.min(right0, window.innerWidth - w - 8));
    setPos({ top: r.bottom + 10, right, w, tail: Math.max(8, Math.round(right0 - right + r.width / 2 - 6)) });
  }, [notes.length]);
  if (!notes.length || !pos) return null;
  return (
    <div aria-live="polite" style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 10001, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", width: pos.w, pointerEvents: "none" }}>
      {notes.map((n, i) => <HitBubble key={n.id} n={n} tail={i === 0 ? pos.tail : null} animate={feat.fx} onOpen={onOpen} onDismiss={onDismiss} />)}
    </div>
  );
}
function HitBubble({ n, tail, animate, onOpen, onDismiss }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || still || !ref.current || !ref.current.animate) return;
    ref.current.animate([{ transform: "translateY(-16px) scale(0.55)", opacity: 0 }, { offset: 0.7, transform: "translateY(2px) scale(1.03)", opacity: 1 }, { transform: "none" }], { duration: 340, easing: "cubic-bezier(.2,.8,.3,1)" });
  }, []);
  return (
    <div ref={ref} data-hit-note={n.id} role="button" tabIndex={0} aria-label={n.text + ". Open the battle log"} onClick={() => onOpen(n.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(n.id); } }}
      style={{ pointerEvents: "auto", position: "relative", width: "100%", transformOrigin: "top right", opacity: n.leaving ? 0 : 1, transition: "opacity 0.3s", cursor: "pointer", fontFamily: "'Inter', sans-serif", background: "var(--card)", border: "1px solid var(--line)", borderLeft: "3px solid var(--miss)", borderRadius: 8, padding: "8px 34px 8px 10px", boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}>
      {tail != null && <span aria-hidden="true" style={{ position: "absolute", top: -6, right: tail, width: 10, height: 10, background: "var(--card)", borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)", transform: "rotate(45deg)" }} />}
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.35 }}>{n.text}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{n.sub}</div>
      <button onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }} aria-label="Dismiss" className="compact-btn" style={{ position: "absolute", top: 4, right: 4, width: 28, height: 28, padding: 0, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={14} /></button>
    </div>
  );
}

function Datacard({ op, f, fc, equipWeapons, equipEffects, curWounds, onWound, collapsed, onToggle, ignoreInjured, cp, setCp, isActivated, onActivate, order, onOrder, uses, setUse, carried, onCarried, narrow, requestFight, requestShoot, scars }) {
  const [pickWeapons, setPickWeapons] = useState(false);
  const { feat } = React.useContext(FeatureCtx);
  const opRules = React.useMemo(() => opWeaponRules(op), [op]);
  const loadout = op.abilities.find(a => /^Loadout/i.test(a));
  const bases = [...new Set([...op.ranged, ...op.melee].map(x => weaponBase(x.name)))];
  const chosen = carried && carried.length ? new Set(carried) : null;
  const carries = (x) => !chosen || chosen.has(weaponBase(x.name));
  const canPick = !!onCarried && (loadout || bases.length > 3);
  const toggleCarried = (b) => {
    const next = new Set(chosen || []);
    if (next.has(b)) next.delete(b); else next.add(b);
    onCarried([...next]);
  };
  const weaponUses = (w) => {
    if (!uses) return null;
    if (grenadePool(w)) return <UsePips label="Team grenades" used={uses["team|explosive"] || 0} max={2} onSet={(n) => setUse("team|explosive", n)} />;
    const max = limitedMax(w.wr);
    if (!max) return null;
    const key = op.id + "|w|" + w.name;
    return <UsePips label={"Limited " + max} used={uses[key] || 0} max={max} onSet={(n) => setUse(key, n)} />;
  };
  const allRanged = [...op.ranged.filter(carries).map(w => ({ ...w, type: "ranged" })), ...equipWeapons.filter(w => w.type === "ranged")];
  const allMelee = [...op.melee.filter(carries).map(w => ({ ...w, type: "melee" })), ...equipWeapons.filter(w => w.type === "melee")];

  const maxW = op.wounds;
  const cw = curWounds !== undefined ? curWounds : maxW;
  const rawInjured = cw > 0 && cw < Math.ceil(maxW / 2);
  const injured = rawInjured && !ignoreInjured;
  const incapacitated = cw <= 0;
  const woundPct = maxW > 0 ? (cw / maxW) * 100 : 0;
  // Green while healthy, amber once injured (below half), red when nearly out (a quarter or less, or 2 wounds).
  const nearlyOut = !incapacitated && cw <= Math.max(2, Math.floor(maxW / 4));
  const woundColorTone = incapacitated ? DS.textTertiary : nearlyOut ? DS.threat : rawInjured ? DS.goldSignal : "#5A9C3A";
  const cardOpacity = incapacitated ? 0.45 : 1;
  // Out of action: the card folds shut (it can still be opened) so the operatives still fighting stand out.
  const wasOut = React.useRef(incapacitated);
  React.useEffect(() => {
    if (incapacitated && !wasOut.current && !collapsed && onToggle) onToggle();
    wasOut.current = incapacitated;
  }, [incapacitated]);
  const moveDisplay = injured ? (parseInt(op.move) - 2) + "\"" : op.move;
  // narrow: the 320px opponent column on desktop uses the phone layout (stats on a second row).
  const isMobile = useIsMobile();
  const mobile = isMobile || narrow;
  const readyChip = onActivate ? (
    <button onClick={(e) => { e.stopPropagation(); onActivate(); }} title={isActivated ? "Expended: tap to mark ready" : "Ready: tap once it has activated"}
                style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid " + (isActivated ? "#5A9C3A" : "color-mix(in srgb, var(--muted) 44%, transparent)"), background: isActivated ? "#5A9C3A25" : "transparent", color: isActivated ? "#7CC05C" : "var(--text2)" }}>
                {isActivated && <Icon name="check" size={12} />}{isActivated ? "Expended" : "Ready"}
              </button>
  ) : null;
  const statsInline = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, fontFamily: DS.fontDisplay }}>
                  {feat.labels && <span style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary, letterSpacing: "0.04em" }}>APL</span>}
                  <span style={{ fontSize: 16, fontWeight: 600, color: DS.textPrimary }}>{op.apl}</span>
                  {feat.labels && <span style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary, letterSpacing: "0.04em" }}>Move</span>}
                  <span style={{ fontSize: 16, fontWeight: 600, color: injured ? DS.threat : DS.textPrimary }}>{moveDisplay}</span>
                  {feat.labels && <span style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary, letterSpacing: "0.04em" }}>Save</span>}
                  <span style={{ fontSize: 16, fontWeight: 600, color: DS.textPrimary }}>{op.save}</span>
                </div>
  );
  const woundBtn = (delta) => (
    <button className="compact-btn" onClick={(e) => { e.stopPropagation(); onWound(delta); }} aria-label={(delta < 0 ? "Remove a wound from " : "Add a wound to ") + op.name}
      style={{ width: 32, height: 32, border: "1px solid " + DS.divider, borderRadius: 4, background: DS.bgElevated, color: delta < 0 ? DS.threat : DS.success, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>{delta < 0 ? "\u2212" : "+"}</button>
  );
  const woundsInline = (
    <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontFamily: DS.fontDisplay, cursor: "default" }}>
      {onWound && woundBtn(-1)}
      <span style={{ fontSize: 16, fontWeight: 700, color: woundColorTone, minWidth: 34, textAlign: "center" }}>{cw}/{maxW}</span>
      {onWound && woundBtn(1)}
      {incapacitated && <Icon name="skull" size={14} color={DS.threat} />}
    </div>
  );

  return (
    <div className="datacard-print" style={{ background: DS.bgCard, borderRadius: 6, marginBottom: collapsed ? 8 : 12, boxShadow: "0 4px 16px rgba(0,0,0,0.35)", overflow: "hidden", opacity: cardOpacity, position: "relative", display: "flex", fontFamily: DS.fontBody }}>
      {/* Battle damage (Attack animations): marks from hits until it's back to full wounds, and a bandage while injured. */}
      {/* The marks sit behind the text and buttons, faint; the full-strength ones play on the attack screen. */}
      {feat.fx && cw < maxW && (scars || []).length > 0 && (
        <div aria-hidden="true" data-scars="true" style={{ position: "absolute", left: 4, right: 0, top: 0, height: 64, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          {/* Grouped in the top-right corner, where the header is empty, rather than over the name. */}
          {(scars || []).map((x, i) => <span key={i} data-scar={x.k} style={{ position: "absolute", left: (56 + x.x * 0.34) + "%", top: Math.round(x.y * 0.75), opacity: incapacitated ? 0.3 : 0.62 }} dangerouslySetInnerHTML={{ __html: decalSvg(x.k, x.s, x.r) }} />)}
        </div>
      )}
      {feat.fx && rawInjured && !incapacitated && <span aria-hidden="true" data-bandage="true" style={{ position: "absolute", left: 0, top: collapsed ? 4 : 8, zIndex: 2, pointerEvents: "none", lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: BANDAGE_SVG }} />}
      {/* Faction color accent stripe */}
      <div style={{ width: 4, background: incapacitated ? DS.textTertiary : fc, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        {incapacitated && !collapsed && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
            <div style={{ fontFamily: DS.fontDisplay, fontSize: 14, fontWeight: 700, color: DS.threat, letterSpacing: "0.18em", textTransform: "uppercase", background: al(DS.bgBase, "EE"), padding: "8px 18px", borderRadius: 4, border: "1px solid " + al(DS.threat, "60") }}>Incapacitated</div>
          </div>
        )}

        {/* Header: clickable */}
        <div role="button" tabIndex={0} onClick={onToggle} style={{ padding: collapsed ? "10px 12px" : "14px 16px 12px", cursor: "pointer", userSelect: "none", opacity: isActivated ? 0.55 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: collapsed ? "center" : "flex-start", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: DS.fontDisplay, fontSize: 18, fontWeight: 600, color: DS.textPrimary, lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isActivated ? "line-through" : "none" }}>{op.name}</div>
                {!collapsed && <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 500, color: fc, marginTop: 3, letterSpacing: "0.14em", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{op.kw || "OPERATIVE"}</div>}
              </div>
              {collapsed && !mobile && statsInline}
              {collapsed && !mobile && woundsInline}
            </div>
            {!mobile && readyChip}
            {!mobile && onOrder && <OrderChip order={order} onToggle={onOrder} />}
            {!mobile && (readyChip || onOrder) && <TermInfo k="Order" />}
            {collapsed && mobile && woundsInline}
            <span style={{ display: "inline-flex", alignSelf: "center" }}><Arrow open={!collapsed} /></span>
          </div>
          {mobile && (readyChip || onOrder || collapsed) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: collapsed ? 6 : 8, flexWrap: "wrap" }}>
              {readyChip}
              {onOrder && <OrderChip order={order} onToggle={onOrder} />}
              {(readyChip || onOrder) && <TermInfo k="Order" />}
              {collapsed && <div style={{ marginLeft: "auto" }}>{statsInline}</div>}
            </div>
          )}
        </div>

        {/* Health bar: always visible, in the same 3px of height the old wound strip used (it overlaps the header's padding). */}
        <HealthBar cw={cw} maxW={maxW} color={woundColorTone} />

        {/* Expanded content */}
        {!collapsed && (
          <div>
            {/* Bold stat block: 4 up */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid " + DS.divider, borderBottom: "1px solid " + DS.divider, background: DS.bgCard }}>
              {[
                { label: "APL", k: "APL", val: op.apl, color: DS.textPrimary },
                { label: "MOVE", k: "Move", val: moveDisplay, color: injured ? DS.threat : DS.textPrimary },
                { label: "SAVE", k: "Save", val: op.save, color: DS.textPrimary },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "14px 4px", borderRight: "1px solid " + DS.divider }}>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.val}</div>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 14, fontWeight: 600, color: DS.textSecondary, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}><Term k={s.k}>{s.label}</Term></div>
                </div>
              ))}
              {/* Interactive wounds cell */}
              <div style={{ textAlign: "center", padding: "10px 4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <button className="compact-btn" onClick={(e) => { e.stopPropagation(); onWound(-1); }} style={{ width: 32, height: 32, border: "1px solid " + DS.divider, borderRadius: 4, background: DS.bgElevated, color: DS.threat, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>{"\u2212"}</button>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 28, fontWeight: 700, color: woundColorTone, lineHeight: 1, minWidth: 50 }}>
                    {cw}<span style={{ fontSize: 13, color: DS.textSecondary, fontWeight: 500 }}>/{maxW}</span>
                  </div>
                  <button className="compact-btn" onClick={(e) => { e.stopPropagation(); onWound(1); }} style={{ width: 32, height: 32, border: "1px solid " + DS.divider, borderRadius: 4, background: DS.bgElevated, color: DS.success, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>+</button>
                </div>
                <div style={{ fontFamily: DS.fontDisplay, fontSize: 14, fontWeight: 600, color: injured ? DS.threat : (rawInjured && ignoreInjured) ? DS.success : DS.textSecondary, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}><Term k="Wounds" style={rawInjured || incapacitated ? { color: "inherit" } : undefined}>{injured ? "Injured" : incapacitated ? "Down" : rawInjured ? "Low" : "Wounds"}</Term></div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 18px 18px" }}>
              {rawInjured && !incapacitated && !ignoreInjured && (
                <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, color: DS.threat, background: al(DS.threat, "14"), padding: "8px 12px", borderRadius: 4, marginBottom: 12, borderLeft: "3px solid " + DS.threat, fontWeight: 500, letterSpacing: "0.06em" }}>
                  <Icon name="warning" size={13} /> Injured: {"\u2212"}2" Move, {"\u2212"}1 Hit
                </div>
              )}
              {rawInjured && !incapacitated && ignoreInjured && (
                <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, color: DS.success, background: al(DS.success, "14"), padding: "8px 12px", borderRadius: 4, marginBottom: 12, borderLeft: "3px solid " + DS.success, fontWeight: 500, letterSpacing: "0.06em" }}>
                  <Icon name="check" size={13} /> Below half wounds, but equipment ignores the injury penalties
                </div>
              )}

              {canPick && (
                <div style={{ marginBottom: 12, padding: pickWeapons ? "8px 10px" : 0, borderRadius: 6, border: pickWeapons ? "1px solid " + DS.divider : "none" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", fontSize: 13 }}>
                    <span style={{ color: DS.textSecondary }}>{chosen ? "Carrying: " + [...chosen].join(", ") : "Showing every weapon option."}</span>
                    <button className="link-btn" onClick={(e) => { e.stopPropagation(); setPickWeapons(!pickWeapons); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: pickWeapons ? "#5A9C3A" : "var(--accent)", textDecoration: "underline", fontSize: 13, fontWeight: 600 }}>{pickWeapons ? "Done" : chosen ? "Change" : "Pick weapons"}</button>
                  </div>
                  {pickWeapons && (
                    <div onClick={e => e.stopPropagation()} style={{ marginTop: 8 }}>
                      {loadout && <div style={{ fontSize: 13, color: DS.textSecondary, lineHeight: 1.5, marginBottom: 6 }}>{loadout}</div>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {bases.map(b => {
                          const on = !!chosen && chosen.has(b);
                          return <button key={b} onClick={() => toggleCarried(b)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 10px", borderRadius: 6, border: "1px solid " + (on ? fc : DS.divider), background: on ? al(fc, "25") : "transparent", color: on ? DS.textPrimary : DS.textSecondary, cursor: "pointer", fontSize: 13 }}>{on && <Icon name="check" size={13} />}{b}</button>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {allRanged.length > 0 && (
                <div style={{ marginBottom: allMelee.length > 0 || op.abilities.length > 0 || equipEffects.length > 0 ? 14 : 0 }}>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 600, color: DS.textSecondary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Ranged</div>
                  {allRanged.map((w, i) => (<React.Fragment key={"r" + i}><WeaponBox w={w} tag={w.note || null} wtype="ranged" requestAttack={requestShoot ? () => requestShoot(op, w) : undefined} local={opRules} />{weaponUses(w)}</React.Fragment>))}
                </div>
              )}
              {allMelee.length > 0 && (
                <div style={{ marginBottom: op.abilities.length > 0 || equipEffects.length > 0 ? 14 : 0 }}>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 600, color: DS.textSecondary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Melee</div>
                  {allMelee.map((w, i) => (<React.Fragment key={"m" + i}><WeaponBox w={w} tag={w.note || null} wtype="melee" requestAttack={requestFight ? () => requestFight(op, w) : undefined} local={opRules} />{weaponUses(w)}</React.Fragment>))}
                </div>
              )}
              {op.abilities.length > 0 && (
                <div style={{ marginBottom: equipEffects.length > 0 ? 14 : 0 }}>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 600, color: DS.textSecondary, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Abilities</div>
                  {op.abilities.map((a, i) => (
                    <React.Fragment key={i}>
                      <div style={{ fontSize: 13, color: DS.textPrimary, lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid " + al(fc, "40"), marginBottom: 6 }}>{abilityText(a, f)}</div>
                      {uses && isOncePerBattle(a) && <UsePips label="Once per battle" used={uses[op.id + "|a|" + i] || 0} max={1} onSet={(n) => setUse(op.id + "|a|" + i, n)} />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {equipEffects.length > 0 && (
                <div>
                  <div style={{ fontFamily: DS.fontDisplay, fontSize: 11, fontWeight: 600, color: DS.rust, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Equipment</div>
                  {equipEffects.map((e, i) => (
                    <div key={i} style={{ fontSize: 12, color: DS.textPrimary, background: al(DS.rust, "12"), padding: "6px 10px", borderRadius: 4, marginBottom: 4, borderLeft: "3px solid " + al(DS.rust, "70") }}>{e}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

