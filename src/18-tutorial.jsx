/* ═══ TUTORIAL ═══ */
// One turning point against a bot, with the real datacards (Angels of Death Intercessors vs Kommandos).
const TUT_UNITS = {
  sgt: { name: "Intercessor Sergeant", side: "you", apl: 3, move: "6\"", save: "3+", wounds: 15, weapon: "Bolt rifle 4 · 3+ · 3/4" },
  war: { name: "Intercessor Warrior", side: "you", apl: 3, move: "6\"", save: "3+", wounds: 14, weapon: "Fists 4 · 3+ · 3/4" },
  nob: { name: "Boss Nob", side: "opp", apl: 3, move: "6\"", save: "5+", wounds: 14, weapon: "Big choppa 5 · 3+ · 5/6" },
  boy: { name: "Kommando Boy", side: "opp", apl: 2, move: "6\"", save: "5+", wounds: 10, weapon: "Choppa 4 · 3+ · 4/5" },
};
const TUT_STEPS = [
  ["Intro", "How a battle works"], ["Strategy", "Initiative"], ["Strategy", "Command points and ploys"], ["Firefight", "Orders: Engage or Conceal"],
  ["Firefight", "Your activation"], ["Firefight", "Shoot: attack dice"], ["Firefight", "Shoot: defense dice"], ["Firefight", "The enemy's turn"],
  ["Firefight", "Fight: both roll"], ["Firefight", "Fight: strike or block"], ["Firefight", "End of the turning point"], ["Intro", "Done"],
];
const TUT_PHASE_COLOR = { Intro: "var(--muted)", Strategy: "var(--accent)", Firefight: "#D0573A" };

// Defender's best use of saves against attack successes (normal dmg n, crit dmg c). Tries every split, like damageThrough.
function tutBlock(crits, normals, critSaves, normSaves, n, c) {
  let best = null;
  for (let cc = 0; cc <= Math.min(critSaves, crits); cc++) {                       // crit saves on crits
    for (let p = 0; p <= Math.min(crits - cc, Math.floor(normSaves / 2)); p++) {   // two normal saves per crit
      const left = { crits: crits - cc - p, normals: Math.max(0, normals - (critSaves - cc) - (normSaves - 2 * p)) };
      left.damage = left.crits * c + left.normals * n;
      if (!best || left.damage < best.damage) best = left;
    }
  }
  return best;
}

// Top-down map of the tutorial table. 10 units = 1 inch.
const TUT_MAP = { sgtStart: [190, 114], sgtShoot: [248, 112], sgtHide: [222, 116], war: [95, 118], boy: [255, 40], nobStart: [95, 30], nobEnd: [95, 102] };
const TUT_TERRAIN = [[150, 95, 90, 8], [30, 55, 40, 22], [200, 20, 22, 22]];
const TUT_MAP_DESC = {
  start: "your Sergeant is behind a wall and your Warrior is on the left. The Boss Nob and the Kommando Boy are across the table.",
  move: "the Sergeant moves past the end of the wall, where he can see the Kommando Boy.",
  shoot: "the Sergeant shoots the Kommando Boy.",
  charge: "the Sergeant Dashes back behind the wall, and the Boss Nob charges your Warrior.",
  fight: "the Boss Nob and your Warrior are in control range of each other.",
};

function TutMap({ scene, hp }) {
  const M = TUT_MAP, Y = "#5A9C3A", E = "#D0573A";
  const sgt = scene === "start" ? M.sgtStart : scene === "move" || scene === "shoot" ? M.sgtShoot : M.sgtHide;
  const nob = scene === "charge" || scene === "fight" ? M.nobEnd : M.nobStart;
  const los = scene === "move" || scene === "shoot";
  const ring = scene === "charge" || scene === "fight";
  const path = (a, b) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--text2)" strokeWidth="1.5" strokeDasharray="1.5 3" strokeLinecap="round" />;
  const ghost = (p, col) => <circle cx={p[0]} cy={p[1]} r="7" fill="none" stroke={col} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />;
  // Label above or below; "left" keeps it clear of the control range ring.
  const op = (p, letter, label, col, w, above, left) => (
    <g opacity={w <= 0 ? 0.4 : 1}>
      <circle cx={p[0]} cy={p[1]} r="7" fill="var(--bg)" />
      <circle cx={p[0]} cy={p[1]} r="7" fill={al(col, "40")} stroke={col} strokeWidth="2" />
      <text x={p[0]} y={p[1] + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--text)">{letter}</text>
      {w <= 0 && <path d={`M${p[0] - 6} ${p[1] - 6}L${p[0] + 6} ${p[1] + 6}M${p[0] + 6} ${p[1] - 6}L${p[0] - 6} ${p[1] + 6}`} stroke="#B8341C" strokeWidth="2" />}
      {left
        ? <text x={p[0] - 21} y={p[1] + 3} textAnchor="end" fontSize="8" fill="var(--muted)">{label}</text>
        : <text x={p[0]} y={above ? p[1] - 11 : p[1] + 17} textAnchor="middle" fontSize="8" fill="var(--muted)">{label}</text>}
    </g>
  );
  const key = (mark, text) => <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><svg width="16" height="10" aria-hidden="true">{mark}</svg>{text}</span>;
  return (
    <div style={{ marginBottom: 12, maxWidth: 520 }}>
      <svg viewBox="0 0 300 150" role="img" aria-label={"Map: " + TUT_MAP_DESC[scene]} style={{ display: "block", width: "100%", background: "var(--bg)", border: "1px solid var(--raised)", borderRadius: 6 }}>
        {TUT_TERRAIN.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="1.5" fill="var(--line)" stroke="#5A6170" strokeWidth="1" />)}
        {scene === "move" && <>{ghost(M.sgtStart, Y)}{path(M.sgtStart, M.sgtShoot)}</>}
        {scene === "charge" && <>{ghost(M.sgtShoot, Y)}{path(M.sgtShoot, M.sgtHide)}{ghost(M.nobStart, E)}{path(M.nobStart, M.nobEnd)}</>}
        {los && <line x1={M.sgtShoot[0]} y1={M.sgtShoot[1]} x2={M.boy[0]} y2={M.boy[1]} stroke="var(--gold)" strokeWidth={scene === "shoot" ? 2 : 1.5} strokeDasharray="5 3" />}
        {ring && <circle cx={M.war[0]} cy={M.war[1]} r="17" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />}
        {op(sgt, "S", "Sergeant", Y, hp.sgt, false)}
        {op(M.war, "W", "Warrior", Y, hp.war, false, ring)}
        {op(nob, "N", "Boss Nob", E, hp.nob, true, ring)}
        {op(M.boy, "B", "Kommando Boy", E, hp.boy, true)}
        <path d="M10 140v4h60v-4" fill="none" stroke="var(--muted2)" strokeWidth="1" />
        <text x="76" y="145" fontSize="8" fill="var(--muted2)">6"</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
        {key(<circle cx="8" cy="5" r="4" fill={al(Y, "40")} stroke={Y} strokeWidth="1.5" />, "Yours")}
        {key(<circle cx="8" cy="5" r="4" fill={al(E, "40")} stroke={E} strokeWidth="1.5" />, "Enemy")}
        {key(<rect x="1" y="2" width="14" height="6" rx="1" fill="var(--line)" stroke="#5A6170" />, "Terrain")}
        {(scene === "move" || scene === "charge") && key(<line x1="1" y1="5" x2="15" y2="5" stroke="var(--text2)" strokeWidth="1.5" strokeDasharray="1.5 3" strokeLinecap="round" />, "Move")}
        {los && key(<line x1="1" y1="5" x2="15" y2="5" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5 3" />, "Line of sight")}
        {ring && key(<circle cx="8" cy="5" r="4" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 2" />, "Control range (1\")")}
      </div>
    </div>
  );
}

// Engage vs Conceal, in the open vs in cover. Used by the tutorial and by Rules (Orders, Cover).
// ── Rule diagrams (Rules tab, shown when a rule is opened): two small panels each, one where the rule applies and one
// where it doesn't. Top-down unless noted. Red: an enemy. Blue: your operative. 1" is 16 units. ──
const DG = { enemy: "#D0573A", mine: "#6B9BF7", inch: 16 };
const dgBase = (x, y, col) => <circle cx={x} cy={y} r="6" fill={al(col, "40")} stroke={col} strokeWidth="1.5" />;
const dgRing = (x, y) => <circle cx={x} cy={y} r={6 + DG.inch} fill="none" stroke="var(--muted2)" strokeWidth="1" strokeDasharray="2 2" />;
const dgLine = (x1, y1, x2, y2, col) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col || "var(--gold)"} strokeWidth="1.5" strokeDasharray="4 3" />;
const dgCross = (x, y) => <path d={"M" + (x - 4) + " " + (y - 5) + "l8 10M" + (x + 4) + " " + (y - 5) + "l-8 10"} stroke="#B8341C" strokeWidth="2" />;
const dgTerrain = (x, y, w, h, heavy) => <g><rect x={x} y={y} width={w} height={h} rx="1" fill={heavy ? "var(--raised)" : "var(--line)"} stroke={heavy ? "var(--muted)" : "#5A6170"} strokeWidth={heavy ? 1.5 : 1} />{heavy && <text x={x + w / 2} y={y + h / 2 + 2} textAnchor="middle" fontSize="5" fontWeight="700" fill="var(--muted)" transform={"rotate(-90 " + (x + w / 2) + " " + (y + h / 2) + ")"}>HEAVY</text>}</g>;
const dgMeasure = (x1, x2, y, label) => <g stroke="var(--muted)" strokeWidth="0.8"><line x1={x1} y1={y} x2={x2} y2={y} /><line x1={x1} y1={y - 2} x2={x1} y2={y + 2} /><line x1={x2} y1={y - 2} x2={x2} y2={y + 2} /><text x={(x1 + x2) / 2} y={y - 2} textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--muted)" stroke="none">{label}</text></g>;
// Side view figure (Visible): a head and a body standing on the ground line.
const dgFigure = (x, col) => <g><rect x={x - 4} y="30" width="8" height="18" rx="2" fill={al(col, "40")} stroke={col} strokeWidth="1.5" /><circle cx={x} cy="25" r="4" fill={al(col, "40")} stroke={col} strokeWidth="1.5" /></g>;
function DiagramPanel({ ok, caption, children }) {
  return (
    <div style={{ background: "var(--bg)", border: "1px solid " + (ok ? "color-mix(in srgb, var(--hit) 55%, transparent)" : "var(--raised)"), borderRadius: 6, padding: "6px 6px 8px" }}>
      <svg viewBox="0 0 120 56" aria-hidden="true" style={{ display: "block", width: "100%" }}>{children}</svg>
      <div style={{ fontSize: 12, fontWeight: 700, color: ok ? "var(--hit)" : "var(--text2)", textAlign: "center", marginTop: 4, lineHeight: 1.3 }}>{caption}</div>
    </div>
  );
}
function RuleDiagram({ label, children, key2 }) {
  return (
    <div role="img" aria-label={label} data-diagram={key2} style={{ marginBottom: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{children}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Red: an enemy. Blue: your operative.</div>
    </div>
  );
}
const coverPanels = {
  cover: <DiagramPanel ok caption={'In cover: terrain within 1" of it, in between'}>{dgBase(14, 28, DG.enemy)}{dgLine(20, 28, 88, 28)}{dgRing(96, 28)}{dgTerrain(79, 16, 5, 24)}{dgBase(96, 28, DG.mine)}</DiagramPanel>,
  obscured: <DiagramPanel ok caption={'Obscured: Heavy terrain in between, more than 1" from both'}>{dgBase(12, 28, DG.enemy)}{dgLine(18, 28, 102, 28)}{dgTerrain(56, 8, 8, 40, true)}{dgBase(108, 28, DG.mine)}</DiagramPanel>,
};
const RULE_DIAGRAMS = {
  orders: () => <OrderGrid />,
  visible: () => (
    <RuleDiagram key2="visible" label="Side view. A low wall: the shooter can see the target's head over it, so the target is visible. A tall wall blocks every line, so it isn't.">
      <DiagramPanel ok caption="Visible: a clear line from its head to part of the target"><line x1="2" y1="48" x2="118" y2="48" stroke="var(--line)" />{dgFigure(14, DG.enemy)}{dgTerrain(56, 38, 8, 10)}{dgLine(14, 25, 104, 25)}{dgFigure(104, DG.mine)}</DiagramPanel>
      <DiagramPanel caption="Not visible: the wall blocks every line"><line x1="2" y1="48" x2="118" y2="48" stroke="var(--line)" />{dgFigure(14, DG.enemy)}{dgTerrain(56, 10, 8, 38)}{dgLine(14, 25, 54, 25, "var(--muted2)")}{dgCross(52, 25)}{dgFigure(104, DG.mine)}</DiagramPanel>
    </RuleDiagram>
  ),
  intervening: () => (
    <RuleDiagram key2="intervening" label="Targeting lines run from the shooter's base to the target's base. Terrain one line crosses is intervening. Terrain every line crosses is wholly intervening.">
      <DiagramPanel ok caption="Intervening: a line crosses it">{dgBase(14, 28, DG.enemy)}{dgLine(14, 22, 104, 22)}{dgLine(20, 28, 98, 28)}{dgLine(14, 34, 104, 34)}{dgTerrain(56, 14, 8, 11)}{dgBase(104, 28, DG.mine)}</DiagramPanel>
      <DiagramPanel ok caption="Wholly intervening: every line crosses it">{dgBase(14, 28, DG.enemy)}{dgLine(14, 22, 104, 22)}{dgLine(20, 28, 98, 28)}{dgLine(14, 34, 104, 34)}{dgTerrain(56, 12, 8, 32)}{dgBase(104, 28, DG.mine)}</DiagramPanel>
    </RuleDiagram>
  ),
  cover: () => (
    <RuleDiagram key2="cover" label={'Terrain within 1" of your operative, between it and the shooter, puts it in cover. If the shooter is within 2", there is no cover.'}>
      {coverPanels.cover}
      <DiagramPanel caption={'No cover: the shooter is within 2"'}>{dgBase(52, 28, DG.enemy)}{dgLine(58, 28, 88, 28)}{dgRing(96, 28)}{dgTerrain(79, 16, 5, 24)}{dgBase(96, 28, DG.mine)}{dgMeasure(58, 90, 53, '2"')}</DiagramPanel>
    </RuleDiagram>
  ),
  obscured: () => (
    <RuleDiagram key2="obscured" label={'Heavy terrain between the two, more than 1" from both, obscures the target. Heavy terrain within 1" of the target gives cover instead.'}>
      {coverPanels.obscured}
      <DiagramPanel caption={'Not obscured: it\'s within 1" of the target (that\'s cover)'}>{dgBase(12, 28, DG.enemy)}{dgLine(18, 28, 88, 28)}{dgRing(96, 28)}{dgTerrain(80, 10, 7, 36, true)}{dgBase(96, 28, DG.mine)}</DiagramPanel>
    </RuleDiagram>
  ),
  covervsobscured: () => (
    <RuleDiagram key2="covervsobscured" label={'Cover: terrain within 1" of the target. Obscured: Heavy terrain in between, more than 1" from both operatives.'}>
      {coverPanels.cover}{coverPanels.obscured}
    </RuleDiagram>
  ),
  control: () => (
    <RuleDiagram key2="control" label={'The dashed ring is 1" around your operative. An enemy inside it, and visible, is within control range. One outside it is not.'}>
      <DiagramPanel ok caption={'Within control range: within 1" and visible'}>{dgRing(46, 28)}{dgBase(46, 28, DG.mine)}{dgBase(64, 28, DG.enemy)}{dgMeasure(52, 68, 54, '1"')}</DiagramPanel>
      <DiagramPanel caption={'Not in control range: more than 1" away'}>{dgRing(40, 28)}{dgBase(40, 28, DG.mine)}{dgBase(92, 28, DG.enemy)}{dgMeasure(46, 62, 54, '1"')}</DiagramPanel>
    </RuleDiagram>
  ),
  charge: () => (
    <RuleDiagram key2="charge" label={'Charge: move up to your Move plus 2" and finish within 1" of an enemy. If you can\'t get that close, you can\'t Charge it.'}>
      <DiagramPanel ok caption={'Charge: finish within 1" of the enemy'}>{dgBase(12, 36, DG.mine)}<path d="M18 36 Q48 10 80 26" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" /><path d="M80 26l-6-1 3 5z" fill="var(--accent)" />{dgRing(94, 30)}{dgBase(94, 30, DG.enemy)}<text x="50" y="12" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--accent)">{'Move + 2"'}</text></DiagramPanel>
      <DiagramPanel caption="Too far: no Charge">{dgBase(12, 36, DG.mine)}<path d="M18 36 Q44 14 70 24" fill="none" stroke="var(--muted2)" strokeWidth="1.5" strokeDasharray="4 3" />{dgCross(70, 24)}{dgRing(96, 30)}{dgBase(96, 30, DG.enemy)}<text x="44" y="12" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--muted)">{'Move + 2"'}</text></DiagramPanel>
    </RuleDiagram>
  ),
};

function OrderGrid() {
  const cell = (order, cover) => {
    const col = order === "engage" ? "#C9772E" : "#6B9BF7";
    const safe = order === "conceal" && cover;
    return (
      <div style={{ background: "var(--bg)", border: "1px solid " + (safe ? "var(--blue)" : "var(--raised)"), borderRadius: 6, padding: "6px 6px 8px" }}>
        <svg viewBox="0 0 120 36" aria-hidden="true" style={{ display: "block", width: "100%" }}>
          <circle cx="10" cy="18" r="6" fill="#D0573A40" stroke="#D0573A" strokeWidth="1.5" />
          {cover && <rect x="91" y="5" width="5" height="26" rx="1" fill="var(--line)" stroke="#5A6170" />}
          {safe
            ? <><line x1="17" y1="18" x2="84" y2="18" stroke="var(--muted2)" strokeWidth="1.5" strokeDasharray="4 3" /><path d="M80 13l8 10M88 13l-8 10" stroke="#B8341C" strokeWidth="2" /></>
            : <line x1="17" y1="18" x2="102" y2="18" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" />}
          <circle cx="109" cy="18" r="6" fill={al(col, "40")} stroke={col} strokeWidth="2" />
        </svg>
        <div style={{ fontSize: 12, fontWeight: 700, color: safe ? "var(--blue)" : "var(--text2)", textAlign: "center", marginTop: 4, lineHeight: 1.3 }}>{safe ? "Can't be shot" : cover ? "Can be shot, with a cover save" : "Can be shot"}</div>
      </div>
    );
  };
  const head = (t) => <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textAlign: "center", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>{t}</div>;
  const rowHead = (t, col) => <div style={{ fontSize: 14, fontWeight: 700, color: col, fontFamily: "'Rajdhani', sans-serif", alignSelf: "center" }}>{t}</div>;
  return (
    <div role="img" aria-label="An Engage operative can be shot whenever it's visible. A Conceal operative can't be shot while it's in cover, but can be shot in the open." style={{ display: "grid", gridTemplateColumns: "58px 1fr 1fr", gap: 6, marginBottom: 12, maxWidth: 520 }}>
      <div />{head("In the open")}{head("In cover")}
      {rowHead("Engage", "#C9772E")}{cell("engage", false)}{cell("engage", true)}
      {rowHead("Conceal", "var(--blue)")}{cell("conceal", false)}{cell("conceal", true)}
      <div /><div style={{ gridColumn: "span 2", fontSize: 12, color: "var(--muted)" }}>Left: an enemy shooting. Right: your operative.</div>
    </div>
  );
}

function Tutorial({ onExit }) {
  const mobile = useIsMobile();
  const [part, setPart] = useState(1); // 2: objectives, scoring and ploys (TutorialPart2)
  const [step, setStep] = useState(0);
  useDiceTumble("t"); // new dice spin and drop in, as on the Shoot and Fight screens
  const [init, setInit] = useState(null);           // { you, opp, youHave }
  const [order, setOrder] = useState(null);
  const [atk, setAtk] = useState(null);
  const [def, setDef] = useState(null);
  const [hp, setHp] = useState({ sgt: 15, war: 14, nob: 14, boy: 10 });
  const [fight, setFight] = useState(null);         // { youDice, oppDice, you: [..], opp: [..], turn, log: [] }

  const d6 = () => Math.floor(Math.random() * 6) + 1;
  const roll = (n) => Array.from({ length: n }, d6);
  const go = (n) => { setStep(n); window.scrollTo(0, 0); };
  const restart = () => { setStep(0); setInit(null); setOrder(null); setAtk(null); setDef(null); setFight(null); setHp({ sgt: 15, war: 14, nob: 14, boy: 10 }); window.scrollTo(0, 0); };

  // ── Pieces ──
  const Say = ({ children }) => <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.65, marginBottom: 12 }}>{children}</p>;
  const B = ({ children, color }) => <strong style={{ color: color || "var(--accent)", fontWeight: 700 }}>{children}</strong>;
  const Next = ({ to, label }) => (
    <button onClick={() => go(to)} style={{ ...bs("var(--accent)"), background: "color-mix(in srgb, var(--accent) 9%, transparent)", padding: "12px 18px", fontSize: 14, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>{label || "Continue"} <Fwd /></button>
  );
  const Act = ({ children, onClick, color, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{ ...bs(color || "var(--accent)"), background: al((color || "var(--accent)"), "18"), padding: "12px 16px", fontSize: 14, width: "100%", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? 0.4 : 1, cursor: disabled ? "default" : "pointer" }}>{children}</button>
  );
  const Box = ({ title, children, color }) => (
    <div style={{ background: "var(--bg)", border: "1px solid " + (color || "var(--line)"), borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
      {title && <div style={{ ...h3, color: color || "var(--muted)", marginBottom: 6 }}>{title}</div>}
      <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
  const Die = ({ v, kind, k }) => <div role="img" aria-label={"Die: " + v} data-die={"t:" + k} data-v={v} style={dieStyle(kind === "miss" ? "fail" : kind, 40)}>{dieFace(v, kind === "miss" ? "fail" : kind, 40)}</div>;
  const DiceRow = ({ dice, hit, k }) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
      {dice.map((v, i) => <Die key={i} k={k + i} v={v} kind={v === 6 ? "crit" : v >= hit ? "hit" : "miss"} />)}
    </div>
  );
  const chip = (text, col, off) => <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, marginRight: 6, marginBottom: 6, border: "1px solid " + (off ? "var(--line)" : col), color: off ? "var(--muted2)" : col, textDecoration: off ? "line-through" : "none", fontSize: 13, fontWeight: 700 }}>{text}</span>;
  const count = (dice, hit) => ({ crits: dice.filter(v => v === 6).length, normals: dice.filter(v => v >= hit && v < 6).length, fails: dice.filter(v => v < hit || v === 1).length });
  const Unit = ({ id }) => {
    const u = TUT_UNITS[id];
    const w = hp[id];
    const col = u.side === "you" ? "#5A9C3A" : "#D0573A";
    const pct = Math.max(0, w) / u.wounds * 100;
    return (
      <div style={{ ...cd, padding: "10px 12px", marginBottom: 8, borderLeft: "3px solid " + col, opacity: w <= 0 ? 0.5 : 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", textDecoration: w <= 0 ? "line-through" : "none" }}>{u.name}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: w <= 0 ? "#B8341C" : w < u.wounds / 2 ? "var(--gold)" : col, fontFamily: "'Rajdhani', sans-serif" }}>{Math.max(0, w)}/{u.wounds}W</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>APL {u.apl} {"·"} Move {u.move} {"·"} Save {u.save} {"·"} {u.weapon}</div>
        <div style={{ height: 4, background: "var(--bg)", borderRadius: 2, marginTop: 6 }}><div style={{ height: 4, width: pct + "%", background: col, borderRadius: 2, transition: "width 0.4s" }} /></div>
      </div>
    );
  };
  const Teams = () => (
    <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 0 : 12, marginBottom: 6 }}>
      <div><div style={{ ...h3, color: "#5A9C3A" }}>Your team</div><Unit id="sgt" /><Unit id="war" /></div>
      <div><div style={{ ...h3, color: "#D0573A" }}>Enemy team</div><Unit id="nob" /><Unit id="boy" /></div>
    </div>
  );

  // ── Shooting maths ──
  const a = atk ? count(atk, 3) : null;
  const pierced = a && a.crits > 0;                  // Piercing Crits 1: one fewer defense die
  const defDice = pierced ? 2 : 3;
  const d = def ? count(def, 5) : null;
  const shot = a && d ? tutBlock(a.crits, a.normals, d.crits, d.normals, 3, 4) : null;

  // ── Fight: alternate resolving successes, attacker (Nob) first ──
  const startFight = () => {
    const nob = roll(5), war = roll(4);
    const succ = (dice) => dice.filter(v => v >= 3 || v === 6).map(v => v === 6 ? "crit" : "norm").sort((x, y) => (x === "crit" ? -1 : 1));
    setFight({ youDice: war, oppDice: nob, you: succ(war), opp: succ(nob), turn: "opp", log: [] });
  };
  const DMG = { opp: { norm: 5, crit: 6 }, you: { norm: 3, crit: 4 } };
  const fightOver = fight && (hp.war <= 0 || hp.nob <= 0 || (fight.you.length === 0 && fight.opp.length === 0));
  const nextTurn = (f) => (f.turn === "opp" ? (f.you.length ? "you" : "opp") : (f.opp.length ? "opp" : "you"));
  const oppResolves = () => {
    // The Nob always strikes, crits first.
    const f = { ...fight, opp: [...fight.opp], you: [...fight.you], log: [...fight.log] };
    const s = f.opp.shift();
    const dmg = DMG.opp[s];
    setHp(h => ({ ...h, war: h.war - dmg }));
    f.log.push("The Nob strikes with a " + (s === "crit" ? "crit" : "normal success") + ": " + dmg + " damage.");
    f.turn = nextTurn(f);
    setFight(f);
  };
  const youResolve = (mode) => {
    const f = { ...fight, opp: [...fight.opp], you: [...fight.you], log: [...fight.log] };
    // Use a normal success if it can do the job, so crits are kept for later.
    let s;
    if (mode === "block") {
      const canNormBlock = f.opp.includes("norm") && f.you.includes("norm");
      s = canNormBlock ? "norm" : "crit";
      f.you.splice(f.you.indexOf(s), 1);
      const target = s === "crit" && f.opp.includes("crit") ? "crit" : "norm";
      f.opp.splice(f.opp.indexOf(target), 1);
      f.log.push("You block one of the Nob's " + (target === "crit" ? "crits" : "normal successes") + ".");
    } else {
      s = f.you.includes("crit") ? "crit" : "norm";
      f.you.splice(f.you.indexOf(s), 1);
      const dmg = DMG.you[s];
      setHp(h => ({ ...h, nob: h.nob - dmg }));
      f.log.push("You strike with a " + (s === "crit" ? "crit" : "normal success") + ": " + dmg + " damage.");
    }
    f.turn = nextTurn(f);
    setFight(f);
  };
  const canBlock = fight && fight.you.length > 0 && fight.opp.length > 0 && (fight.you.includes("crit") || fight.opp.includes("norm"));

  const phase = TUT_STEPS[step][0];
  const pc = TUT_PHASE_COLOR[phase];

  const body = [
    // 0 How a battle works
    () => (
      <div>
        <Say>You'll play one turning point against a bot: your two Intercessors (Angels of Death) against two Ork Kommandos, with their real datacards. You roll the dice, and the bot plays the Orks.</Say>
        <div role="img" aria-label="Each turning point has a Strategy phase, then a Firefight phase. A battle has four turning points." style={{ display: "flex", alignItems: "stretch", gap: 6, marginBottom: 12 }}>
          {[["Strategy phase", "Initiative, CP, ploys", "var(--accent)"], ["Firefight phase", "Take turns activating operatives", "#D0573A"]].map(([t, s, col], i) => (
            <React.Fragment key={t}>
              {i > 0 && <div style={{ alignSelf: "center", color: "var(--muted)" }}><Fwd /></div>}
              <div style={{ flex: 1, background: al(col, "14"), border: "1px solid " + col, borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: col, fontFamily: "'Rajdhani', sans-serif" }}>{t}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4 }}>{s}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <Say>That's one turning point. A battle has <B>four</B>.</Say>
        <Teams />
        <Say>Each card shows APL (action points per activation), Move, Save (what each defense die needs) and Wounds, then its weapon: attack dice, the roll each one needs, and damage.</Say>
        <Next to={1} label="Start turning point 1" />
      </div>
    ),
    // 1 Initiative
    () => (
      <div>
        <Say>Both players roll a D6. Whoever rolls higher picks who has <B>initiative</B>, and that player activates first in the Firefight phase. On a tie, the player who doesn't have initiative picks.</Say>
        {!init ? (
          <Act onClick={() => { let y = d6(), o = d6(); setInit({ you: y, opp: o, youHave: y >= o }); }}><Icon name="dice" size={16} /> Roll for initiative</Act>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
              <div><div style={{ ...h3, color: "#5A9C3A" }}>You</div><Die k="initYou" v={init.you} kind={init.youHave ? "hit" : "miss"} /></div>
              <div><div style={{ ...h3, color: "#D0573A" }}>Bot</div><Die k="initBot" v={init.opp} kind={!init.youHave ? "hit" : "miss"} /></div>
            </div>
            <Say>{init.you > init.opp ? <>You rolled higher, so you take initiative and <B>go first</B>.</> : init.you < init.opp ? <>The bot rolled higher. In a real game it would go first. Here you go first anyway.</> : <>A tie. Here you take initiative and <B>go first</B>.</>}</Say>
            <Next to={2} />
          </div>
        )}
      </div>
    ),
    // 2 Command points and ploys
    () => (
      <div>
        <Box title="Then, in order" color="var(--accent)">
          <div><B>Gain CP.</B> You start the battle with 2CP, and both players gain 1CP in the first turning point, so you have <B>3CP</B>. After that, the player with initiative gains 1CP and the other gains 2CP.</div>
          <div style={{ marginTop: 6 }}><B>Ready.</B> Flip every order token to its ready side.</div>
          <div style={{ marginTop: 6 }}><B>Gambits.</B> Starting with initiative, take turns using a strategy ploy (1CP) or passing. The step ends when both players pass in a row.</div>
        </Box>
        <Say>Ploys are your team's special tricks, listed on its cards. You pass this time and keep your CP.</Say>
        <Next to={3} label="Begin the Firefight phase" />
      </div>
    ),
    // 3 Orders
    () => (
      <div>
        <Say>When an operative activates, you give it an order: <B>Engage</B> to attack, or <B color="var(--blue)">Conceal</B> to hide. The order decides whether enemies can shoot it.</Say>
        <OrderGrid />
        <Say><B>In cover</B> means there's terrain between it and the shooter, within 1" of it. Nothing counts as in cover from a shooter within 2".</Say>
        <Box title="On Conceal, an operative" color="var(--blue)">
          <div><B color="var(--blue)">Can:</B> move, Dash, fight enemies in melee, and pick up markers.</div>
          <div style={{ marginTop: 4 }}><B color="var(--blue)">Can't:</B> Shoot, Charge or counteract.</div>
        </Box>
        <Say>Every operative starts the battle on Conceal.</Say>
        <Next to={4} />
      </div>
    ),
    // 4 Your activation
    () => (
      <div>
        <TutMap scene={order === "engage" ? "move" : "start"} hp={hp} />
        <Say>You activate your <B color="#5A9C3A">Sergeant</B>. He's behind a wall, and the Kommando Boy is out in the open. Pick his order:</Say>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[["engage", "Engage", "#C9772E", "Can Shoot. Can be shot whenever he's visible."], ["conceal", "Conceal", "#6B9BF7", "Can't be shot behind the wall. Can't Shoot."]].map(([id, label, col, txt]) => (
            <button key={id} onClick={() => setOrder(id)} style={{ textAlign: "left", padding: 12, borderRadius: 6, cursor: "pointer", border: "2px solid " + (order === id ? col : "var(--line)"), background: order === id ? al(col, "18") : "var(--card)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: col, fontFamily: "'Rajdhani', sans-serif" }}>{label}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, marginTop: 2 }}>{txt}</div>
            </button>
          ))}
        </div>
        {order === "conceal" && <Box color="var(--blue)">On Conceal he's safe behind the wall, but he can't Shoot. Pick <B>Engage</B> to attack.</Box>}
        {order === "engage" && (
          <div>
            <Say>His <B>APL is 3</B>, so he has 3 action points to spend. He can't take the same action twice in one activation.</Say>
            <Box title="His plan" color="var(--accent)">
              <div><B>Reposition (1AP):</B> move up to 6" past the end of the wall, where he can see the Kommando Boy.</div>
              <div style={{ marginTop: 4 }}><B>Shoot (1AP):</B> fire the bolt rifle.</div>
              <div style={{ marginTop: 4 }}><B>Dash (1AP):</B> move up to 3" back behind the wall.</div>
            </Box>
            <Next to={5} label="Take the shot" />
          </div>
        )}
      </div>
    ),
    // 5 Attack dice
    () => (
      <div>
        <TutMap scene="shoot" hp={hp} />
        <Box title="Bolt rifle" color="var(--accent)">ATK <B>4</B> {"·"} HIT <B>3+</B> {"·"} DMG <B>3/4</B> {"·"} <B>Piercing Crits 1</B></Box>
        <Say>Roll <B>4 attack dice</B>. Each <B>3 or more</B> is a hit, and a <B color="var(--gold)">6 is a critical hit</B>. A 1 always misses. Normal hits deal 3 damage and crits deal 4.</Say>
        <Say>Piercing Crits 1: if you roll any crits, the defender rolls one fewer defense die.</Say>
        {!atk ? <Act onClick={() => setAtk(roll(4))}><Icon name="dice" size={16} /> Roll 4 attack dice</Act> : (
          <div>
            <DiceRow k="atk" dice={atk} hit={3} />
            <Say><B color="var(--gold)">{a.crits} crit{a.crits === 1 ? "" : "s"}</B>, <B color="#5A9C3A">{a.normals} normal hit{a.normals === 1 ? "" : "s"}</B>, <B color="#B8341C">{a.fails} miss{a.fails === 1 ? "" : "es"}</B>.{pierced ? " You rolled a crit, so the Ork rolls 2 defense dice instead of 3." : ""}</Say>
            {a.crits + a.normals === 0 ? <><Say>No hits. Roll again so the tutorial can carry on.</Say><Act onClick={() => setAtk(roll(4))} color="var(--muted)"><Icon name="reset" size={16} /> Roll again</Act></> : <Next to={6} label="The Ork rolls defense" />}
          </div>
        )}
      </div>
    ),
    // 6 Defense dice
    () => (
      <div>
        <Say>The <B color="#D0573A">Kommando Boy</B> rolls <B>{defDice} defense dice</B>, and each <B>5 or more</B> is a save (Save 5+). He's in the open, so he gets no cover save. In cover he'd keep one die as a save without rolling it.</Say>
        <Box title="Each save blocks" color="var(--line)">
          <div>One normal save blocks a normal hit.</div>
          <div>Two normal saves block a crit.</div>
          <div>A critical save (a 6) blocks either.</div>
        </Box>
        {!def ? <Act onClick={() => setDef(roll(defDice))} color="#D0573A"><Icon name="dice" size={16} /> Roll {defDice} defense dice for the Ork</Act> : (
          <div>
            <DiceRow k="def" dice={def} hit={5} />
            <Box title="Your hits after his saves" color="#D0573A">
              <div style={{ marginBottom: 2 }}>
                {Array.from({ length: a.crits }, (_, i) => <React.Fragment key={"c" + i}>{chip(i < a.crits - shot.crits ? "Crit blocked" : "Crit: 4", "var(--gold)", i < a.crits - shot.crits)}</React.Fragment>)}
                {Array.from({ length: a.normals }, (_, i) => <React.Fragment key={"n" + i}>{chip(i < a.normals - shot.normals ? "Hit blocked" : "Hit: 3", "#5A9C3A", i < a.normals - shot.normals)}</React.Fragment>)}
              </div>
              <B color="#D0573A">{shot.damage} damage</B> gets through.
            </Box>
            <Say>{shot.damage >= 10 ? <>That's all 10 of his wounds. He's <B color="#D0573A">incapacitated</B> and removed.</> : 10 - shot.damage < 5 ? <>He's down to {10 - shot.damage} wounds, under half, so he's <B color="var(--gold)">injured</B>: -2" Move, and his weapons hit on 1 worse.</> : shot.damage > 0 ? <>He's down to {10 - shot.damage} wounds.</> : <>He blocks everything.</>}</Say>
            <button onClick={() => { setHp(h => ({ ...h, boy: 10 - shot.damage })); go(7); }} style={{ ...bs("var(--accent)"), background: "color-mix(in srgb, var(--accent) 9%, transparent)", padding: "12px 18px", fontSize: 14 }}>Continue <Fwd /></button>
          </div>
        )}
      </div>
    ),
    // 7 The enemy's turn
    () => (
      <div>
        <TutMap scene="charge" hp={hp} />
        <Say>Your Sergeant spends his last AP on a Dash back behind the wall. He's now <B>expended</B>: done for this turning point. Players take turns, one operative each.</Say>
        <Say>The bot activates the <B color="#D0573A">Boss Nob</B> on Engage and <B>Charges (1AP)</B>: he moves up to his Move plus 2", and has to finish within <B>control range</B> of your <B color="#5A9C3A">Warrior</B>. Control range is within 1" and visible. Then he <B>Fights (1AP)</B>.</Say>
        <Next to={8} label="Fight" />
      </div>
    ),
    // 8 Fight: both roll
    () => (
      <div>
        <Say>In a fight, <B>both sides roll attack dice at once</B> with melee weapons. The Nob started it, so he's the attacker. Your Warrior fights back (that's called retaliating).</Say>
        <Box color="var(--line)">
          <div><B color="#D0573A">Nob, big choppa:</B> 5 dice, hits on 3+, 5 damage (6 on a crit).</div>
          <div style={{ marginTop: 4 }}><B color="#5A9C3A">Your Warrior, fists:</B> 4 dice, hits on 3+, 3 damage (4 on a crit).</div>
        </Box>
        {!fight ? <Act onClick={startFight} color="#D0573A"><Icon name="melee" size={16} /> Both roll</Act> : (
          <div>
            <div style={{ ...h3, color: "#D0573A" }}>Nob</div><DiceRow k="nob" dice={fight.oppDice} hit={3} />
            <div style={{ ...h3, color: "#5A9C3A" }}>Your Warrior</div><DiceRow k="war" dice={fight.youDice} hit={3} />
            <Say>The Nob has <B>{fight.opp.length}</B> success{fight.opp.length === 1 ? "" : "es"} and you have <B>{fight.you.length}</B>.</Say>
            <Next to={9} label="Resolve the fight" />
          </div>
        )}
      </div>
    ),
    // 9 Fight: strike or block
    () => {
      const chips = (list, col) => list.length ? list.map((s, i) => <React.Fragment key={i}>{chip(s === "crit" ? "Crit" : "Normal", s === "crit" ? "var(--gold)" : col)}</React.Fragment>) : <span style={{ fontSize: 13, color: "var(--muted2)" }}>none left</span>;
      return (
        <div>
          <Say>Starting with the attacker, take turns using <B>one success at a time</B>. <B>Strike</B> deals its damage now. <B>Block</B> cancels one of the enemy's successes: a normal blocks a normal, and a crit blocks either. When one side runs out, the other uses the rest.</Say>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 0 : 8, marginBottom: 10 }}>
            <Unit id="nob" /><Unit id="war" />
          </div>
          <Box>
            <div style={{ marginBottom: 4 }}><B color="#D0573A">Nob left:</B> {chips(fight.opp, "#D0573A")}</div>
            <div><B color="#5A9C3A">You left:</B> {chips(fight.you, "#5A9C3A")}</div>
          </Box>
          {!fightOver && fight.turn === "opp" && <Act onClick={oppResolves} color="#D0573A">The Nob's turn <Fwd /></Act>}
          {!fightOver && fight.turn === "you" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <button onClick={() => youResolve("strike")} style={{ ...bs("#5A9C3A"), background: "#5A9C3A18", padding: "12px", fontSize: 14 }}>Strike</button>
              <button onClick={() => youResolve("block")} disabled={!canBlock} style={{ ...bs("var(--blue)"), background: "color-mix(in srgb, var(--blue) 9%, transparent)", padding: "12px", fontSize: 14, opacity: canBlock ? 1 : 0.4 }}>Block</button>
            </div>
          )}
          {fight.log.length > 0 && <Box title="What happened">{fight.log.map((l, i) => <div key={i}>{i + 1}. {l}</div>)}</Box>}
          {fightOver && (
            <div>
              <Say>{hp.war <= 0 ? <>Your Warrior is <B color="#D0573A">incapacitated</B>. Each of the Nob's hits deals 5 or 6, so blocking them is often worth more than striking.</> : hp.nob <= 0 ? <>You took down the Nob.</> : <>Both survive. The Nob's Krumpin' Time ability lets him Fight twice in one activation, so in a real game he could attack again.</>}</Say>
              <Next to={10} />
            </div>
          )}
        </div>
      );
    },
    // 10 End of the turning point
    () => (
      <div>
        <TutMap scene="fight" hp={hp} />
        <Say>Players keep taking turns until every operative is <B>expended</B>.</Say>
        <Box title="Counteract" color="var(--accent)">If all your operatives are expended and your opponent still has ready ones, you can counteract when it's your turn: pick an expended operative on <B>Engage</B> and give it one free 1AP action. It can't move more than 2". Each operative can counteract once per turning point.</Box>
        <Box title="End of the turning point" color="var(--accent)">When every operative is expended, the turning point ends. Score victory points (VP) as your mission says, for example for holding objective markers. Then the next turning point starts with a new Strategy phase.</Box>
        <Next to={11} />
      </div>
    ),
    // 11 Done
    () => (
      <div>
        <Say>That's one turning point. After four, the player with the most VP wins.</Say>
        <Box title="You've learned" color="#5A9C3A">
          {["Initiative decides who activates first", "Strategy phase: CP, ready, ploys", "Engage or Conceal, and what cover does", "Shooting: attack dice, defense dice, damage", "Fighting: both roll, then strike or block", "Counteracting and scoring"].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}><span style={{ color: "#5A9C3A" }}><Icon name="check" size={14} /></span>{t}</div>
          ))}
        </Box>
        <Say>Next, part 2 covers objective markers, scoring and ploys. Or build a team in <B>Battle</B>, or look up a rule in <B>Rules</B>.</Say>
        <button onClick={() => { setPart(2); window.scrollTo(0, 0); }} style={{ ...bs("var(--accent)"), background: "color-mix(in srgb, var(--accent) 9%, transparent)", padding: "12px 18px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, marginRight: 8, marginBottom: 8 }}>Part 2: objectives, scoring and ploys <Fwd /></button>
        <button onClick={restart} style={{ ...bs("var(--muted)"), padding: "12px 18px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="reset" size={14} /> Play again</button>
      </div>
    ),
  ];

  if (part === 2) return <TutorialPart2 onExit={onExit} onPart1={() => { setPart(1); window.scrollTo(0, 0); }} />;
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px" }}>
      {onExit && <button onClick={onExit} style={{ ...bs("var(--muted)"), padding: "6px 12px", fontSize: 12, marginBottom: 12 }}><Back /> Rules</button>}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Tutorial</div>
        {step > 0 && <button onClick={restart} style={{ ...bs("var(--muted)"), padding: "8px 12px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="reset" size={13} /> Restart</button>}
      </div>
      <p style={{ ...mu, marginBottom: 12 }}>One turning point against a bot, with real datacards. You roll the dice. <button className="link-btn" onClick={() => { setPart(2); window.scrollTo(0, 0); }} style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", cursor: "pointer", textDecoration: "underline", font: "inherit" }}>Part 2: objectives, scoring and ploys</button></p>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {TUT_STEPS.map(([ph], i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? TUT_PHASE_COLOR[ph] : "var(--raised)", transition: "background 0.3s" }} />)}
      </div>
      <div style={{ ...cd, padding: mobile ? 16 : 22, borderTop: "3px solid " + pc }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <span style={bg(pc)}>{phase === "Intro" ? "Tutorial" : phase + " phase"}</span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Step {step + 1} of {TUT_STEPS.length}</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.02em", marginBottom: 12 }}>{TUT_STEPS[step][1]}</div>
        {body[step]()}
      </div>
      {step > 0 && step < TUT_STEPS.length - 1 && <button onClick={() => go(step - 1)} className="link-btn" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, marginTop: 10, padding: 0 }}><Back /> Back a step</button>}
    </div>
  );
}

// ── Tutorial part 2: objectives, scoring and ploys, as turning point 2 with the same teams. Combat Doctrine is a real
// Angels of Death strategy ploy (Devastator gives shots at targets more than 6" away Balanced); Command Re-roll is the
// core firefight ploy. ──
const TUT2_STEPS = [["Intro", "Turning point 2"], ["Strategy", "Command points"], ["Strategy", "A strategy ploy"], ["Firefight", "Objective markers"], ["Firefight", "A firefight ploy"], ["Firefight", "Scoring"], ["Intro", "Done"]];
const TUT2_OPS = { S: { name: "Sergeant", apl: 3, col: "#5A9C3A" }, W: { name: "Warrior", apl: 3, col: "#5A9C3A" }, N: { name: "Boss Nob", apl: 3, col: "#D0573A" }, B: { name: "Kommando Boy", apl: 2, col: "#D0573A" } };
// Who controls a marker: the side whose contesting operatives have the higher total APL; equal totals, nobody.
const tut2Control = (ids) => {
  const you = ids.filter(k => TUT2_OPS[k].col === "#5A9C3A").reduce((a, k) => a + TUT2_OPS[k].apl, 0), them = ids.filter(k => TUT2_OPS[k].col !== "#5A9C3A").reduce((a, k) => a + TUT2_OPS[k].apl, 0);
  return { you, them, who: you > them ? "you" : them > you ? "them" : "nobody" };
};
const TUT2_QUIZ = [["W", "B"], ["W", "B", "N"], ["W", "S", "B", "N"], ["W", "N"]];
// A marker (or two) with the operatives contesting it. The dashed ring is how close an operative has to be.
function ObjScene({ markers }) {
  const spots = [[-16, -9], [16, -9], [-16, 11], [16, 11]];
  return (
    <svg viewBox={markers.length > 1 ? "0 0 300 96" : "80 4 140 88"} role="img" aria-label={markers.map(m => "Objective " + m.label + ": " + (m.ids.map(k => TUT2_OPS[k].name).join(", ") || "nobody") + " contesting").join(". ")} style={{ display: "block", width: "100%", maxWidth: 520, background: "var(--bg)", border: "1px solid var(--raised)", borderRadius: 6, marginBottom: 10 }}>
      {markers.map((m, mi) => {
        const cx = markers.length > 1 ? (mi === 0 ? 80 : 220) : 150, cy = 46;
        return (
          <g key={mi}>
            <circle cx={cx} cy={cy} r="26" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
            <circle cx={cx} cy={cy} r="5" fill={al("#FFB627", "55")} stroke="var(--gold)" strokeWidth="1.5" />
            <text x={cx} y={cy + 40} textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--gold)">{"Objective " + m.label}</text>
            {m.ids.map((k, i) => {
              const o = TUT2_OPS[k], [dx, dy] = spots[i];
              return <g key={k}><circle cx={cx + dx} cy={cy + dy} r="7" fill="var(--bg)" /><circle cx={cx + dx} cy={cy + dy} r="7" fill={al(o.col, "40")} stroke={o.col} strokeWidth="2" /><text x={cx + dx} y={cy + dy + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--text)">{k}</text></g>;
            })}
          </g>
        );
      })}
    </svg>
  );
}

function TutorialPart2({ onExit, onPart1 }) {
  const mobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [cp, setCp] = useState(3);
  const [doctrine, setDoctrine] = useState(false);
  const [passed, setPassed] = useState(false);
  const [quiz, setQuiz] = useState({ i: 0, pick: null, right: 0 });
  const [shot, setShot] = useState(null); // { dice, rr: [bool], stage: "balanced" | "cmd" | "done" }
  const [scored, setScored] = useState(false);
  useDiceTumble("t2");
  const go = (n) => { setStep(n); window.scrollTo(0, 0); };
  const restart = () => { setStep(0); setCp(3); setDoctrine(false); setPassed(false); setQuiz({ i: 0, pick: null, right: 0 }); setShot(null); setScored(false); window.scrollTo(0, 0); };
  const d6 = () => 1 + Math.floor(Math.random() * 6);

  const Say = ({ children }) => <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.65, marginBottom: 12 }}>{children}</p>;
  const B = ({ children, color }) => <strong style={{ color: color || "var(--accent)", fontWeight: 700 }}>{children}</strong>;
  const Box = ({ title, children, color }) => (
    <div style={{ background: "var(--bg)", border: "1px solid " + (color || "var(--line)"), borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
      {title && <div style={{ ...h3, color: color || "var(--muted)", marginBottom: 6 }}>{title}</div>}
      <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
  const Act = ({ children, onClick, color, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{ ...bs(color || "var(--accent)"), background: al((color || "var(--accent)"), "18"), padding: "12px 16px", fontSize: 14, width: "100%", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? 0.5 : 1 }}>{children}</button>
  );
  const Next = ({ to, label }) => (
    <button onClick={() => go(to)} style={{ ...bs("var(--accent)"), background: "color-mix(in srgb, var(--accent) 9%, transparent)", padding: "12px 18px", fontSize: 14, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>{label || "Next"} <Fwd /></button>
  );
  const cpChip = <span data-tut-cp={cp} style={{ ...bg("var(--gold)") }}>{cp}CP</span>;

  // The shot: 4 attack dice, hits on 3+. Balanced re-rolls one free; Command Re-roll (1CP) one more; never the same die twice.
  const kindOf = (v) => v === 6 ? "crit" : v >= 3 ? "hit" : "fail";
  const reroll = (i) => {
    if (!shot || shot.rr[i] || shot.stage === "done") return;
    const dice = shot.dice.map((v, j) => j === i ? d6() : v), rr = shot.rr.map((r, j) => r || j === i);
    if (shot.stage === "cmd") setCp(c => c - 1);
    setShot({ dice, rr, stage: shot.stage === "balanced" ? "cmd" : "done" });
  };
  const hits = shot ? shot.dice.filter(v => v >= 3).length : 0, crits = shot ? shot.dice.filter(v => v === 6).length : 0;

  const q = TUT2_QUIZ[Math.min(quiz.i, TUT2_QUIZ.length - 1)], qc = tut2Control(q);
  const body = [
    () => (
      <div>
        <Say>Part 1 played a turning point. Part 2 adds what wins games: <B>objective markers</B>, <B>scoring</B> and <B>ploys</B>. Same teams, all four operatives back at full strength for this lesson.</Say>
        <Box title="You'll learn" color="var(--accent)">
          <div>Gaining CP after the first turning point</div>
          <div>Using a strategy ploy and a firefight ploy</div>
          <div>Who controls an objective marker</div>
          <div>Scoring at the end of a turning point</div>
        </Box>
        <Next to={1} label="Start turning point 2" />
      </div>
    ),
    () => (
      <div>
        <Say>Initiative is rolled again at the start of every turning point. This time you win it.</Say>
        <Say>You saved your <B>3CP</B> from turning point 1. After the first turning point, the player with initiative gains <B>1CP</B> and the other player gains <B>2CP</B>.</Say>
        {cp === 3 ? <Act onClick={() => setCp(4)}>Gain 1CP</Act> : (
          <div>
            <Box color="var(--gold)">You have {cpChip}. The bot gains 2CP.</Box>
            <Next to={2} label="Gambits" />
          </div>
        )}
      </div>
    ),
    () => (
      <div>
        <Say>In the <B>Gambits</B> step, starting with the player with initiative, players take turns using a strategy ploy or passing. It ends when both pass in a row. Each ploy costs <B>1CP</B> and can be used once per turning point.</Say>
        <Box title="Combat Doctrine (strategy ploy, 1CP)" color="var(--accent)">
          <RefText text={(FACTIONS.angels.ploys.strategy.find(p => p.name === "Combat Doctrine") || {}).desc} self="Combat Doctrine" />
        </Box>
        <Say>The Kommando Boy is more than 6" from your Sergeant, so pick <B>Devastator</B>. His shots this turning point gain <B>Balanced</B>: after rolling, re-roll one attack die.</Say>
        {!doctrine ? <Act onClick={() => { setDoctrine(true); setCp(c => c - 1); }}>Use Combat Doctrine: Devastator (1CP)</Act> : !passed ? (
          <div>
            <Box color="var(--gold)">Devastator is active. You have {cpChip}.</Box>
            <Say>The bot passes. If you pass too, the step ends.</Say>
            <Act onClick={() => setPassed(true)} color="var(--muted)">Pass</Act>
          </div>
        ) : (
          <div>
            <Say>Both of you passed in a row, so the Strategy phase is over.</Say>
            <Next to={3} label="Begin the Firefight phase" />
          </div>
        )}
      </div>
    ),
    () => (
      <div>
        <Say>An operative <B>contests</B> an objective marker that's within its control range (the dashed ring). The side whose contesting operatives have the higher <B>total APL</B> controls it.</Say>
        {quiz.i < TUT2_QUIZ.length ? (
          <div>
            <ObjScene markers={[{ label: "A", ids: q }]} />
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{q.map(k => TUT2_OPS[k].name + " (APL " + TUT2_OPS[k].apl + ")").join(", ")}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "'Rajdhani', sans-serif" }}>Question {quiz.i + 1} of {TUT2_QUIZ.length}: who controls it?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
              {[["you", "You", "#5A9C3A"], ["them", "The bot", "#D0573A"], ["nobody", "Nobody", "var(--muted)"]].map(([k, label, col]) => (
                <button key={k} disabled={!!quiz.pick} onClick={() => setQuiz(x => ({ ...x, pick: k, right: x.right + (k === qc.who ? 1 : 0) }))} style={{ ...bs(col), padding: "10px 8px", fontSize: 14, background: quiz.pick === k ? al(col, "20") : "transparent", opacity: quiz.pick && quiz.pick !== k ? 0.5 : 1 }}>{label}</button>
              ))}
            </div>
            {quiz.pick && (
              <div>
                <Box color={quiz.pick === qc.who ? "#5A9C3A" : "#D0573A"}>
                  <B color={quiz.pick === qc.who ? "#5A9C3A" : "#D0573A"}>{quiz.pick === qc.who ? "Right." : "Not quite."}</B> Your total is <B>{qc.you}</B>, the bot's is <B>{qc.them}</B>. {qc.who === "nobody" ? "Equal totals: nobody controls it." : (qc.who === "you" ? "Yours" : "The bot's") + " is higher, so " + (qc.who === "you" ? "you control" : "the bot controls") + " it."}
                </Box>
                <Act onClick={() => setQuiz(x => ({ i: x.i + 1, pick: null, right: x.right }))}>{quiz.i + 1 < TUT2_QUIZ.length ? "Next question" : "See how you did"}</Act>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Box title="Control" color="var(--gold)">You got <B>{quiz.right} of {TUT2_QUIZ.length}</B>. Higher total APL controls a marker, and equal totals mean nobody does. More operatives on a marker usually wins it, so it's worth sending a second one.</Box>
            <Next to={4} />
          </div>
        )}
      </div>
    ),
    () => (
      <div>
        <Say>Your <B color="#5A9C3A">Sergeant</B> shoots the Kommando Boy with his bolt rifle: <B>4 attack dice</B>, hitting on <B>3+</B>.</Say>
        {!shot ? <Act onClick={() => setShot({ dice: Array.from({ length: 4 }, d6), rr: [false, false, false, false], stage: "balanced" })}><Icon name="dice" size={16} /> Roll 4 attack dice</Act> : (
          <div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {shot.dice.map((v, i) => {
                const can = shot.stage !== "done" && !shot.rr[i];
                return <button key={i} data-tut-die={i} data-die={"t2:" + i} data-v={v + (shot.rr[i] ? "r" : "")} onClick={can ? () => reroll(i) : undefined} disabled={!can} aria-label={"Die " + (i + 1) + ": " + v + (shot.rr[i] ? ", re-rolled" : can ? ", tap to re-roll" : "")} style={dieStyle(kindOf(v), 40, { onClick: can, rerolled: shot.rr[i] })}>{dieFace(v, kindOf(v), 40)}</button>;
              })}
            </div>
            {shot.stage === "balanced" && (
              <div>
                <Box title="Balanced (from Combat Doctrine)" color="var(--accent)">Tap one die to re-roll it for free. Usually you'd pick a miss. You keep the new result, even if it's worse.</Box>
                <Act onClick={() => setShot(x => ({ ...x, stage: "cmd" }))} color="var(--muted)">Keep these dice</Act>
              </div>
            )}
            {shot.stage === "cmd" && (
              <div>
                <Box title="Command Re-roll (firefight ploy, 1CP)" color="var(--gold)">After rolling your attack or defense dice, re-roll one of them. You have {cpChip}. Tap another die to spend 1CP on it. A die can only be re-rolled once, so the one with the dashed outline is locked.</Box>
                <Act onClick={() => setShot(x => ({ ...x, stage: "done" }))} color="var(--muted)">Keep these dice and save the CP</Act>
              </div>
            )}
            {shot.stage === "done" && (
              <div>
                <Say><B color="#5A9C3A">{hits} hit{hits === 1 ? "" : "s"}</B>{crits ? <>, {crits} of them <B color="var(--gold)">crit{crits === 1 ? "" : "s"}</B></> : null}. The Boy rolls his defense dice, as in part 1. You have {cpChip} left.</Say>
                <Say>Command Re-roll is the one ploy you can use more than once in a turning point, but each use costs 1CP.</Say>
                <Next to={5} label="End the turning point" />
              </div>
            )}
          </div>
        )}
      </div>
    ),
    () => {
      const a = tut2Control(["W", "B"]), b = tut2Control(["N"]);
      return (
        <div>
          <Say>Every operative is expended, so the turning point ends. In this example mission, you score <B>1VP</B> for each objective marker you control at the end of each turning point. Your mission tells you what scores, and when.</Say>
          <ObjScene markers={[{ label: "A", ids: ["W", "B"] }, { label: "B", ids: ["N"] }]} />
          {!scored ? <Act onClick={() => setScored(true)}>Score the turning point</Act> : (
            <div>
              <Box title="Scoring" color="var(--gold)">
                <div>Objective A: your Warrior (APL {a.you}) beats the Kommando Boy (APL {a.them}). <B color="#5A9C3A">You score 1VP.</B></div>
                <div style={{ marginTop: 4 }}>Objective B: only the Boss Nob is there. <B color="#D0573A">The bot scores 1VP.</B></div>
              </Box>
              <Say>It's 1VP each. Next turning point, sending your Sergeant to Objective B (3 against 3) would make it nobody's, and the bot wouldn't score it.</Say>
              <Next to={6} />
            </div>
          )}
        </div>
      );
    },
    () => (
      <div>
        <Box title="You've learned" color="#5A9C3A">
          {["After the first turning point: initiative gains 1CP, the other player 2CP", "Gambits: take turns using a strategy ploy or passing", "A strategy ploy lasts the turning point (Combat Doctrine gave Balanced)", "Command Re-roll: 1CP to re-roll one die, and a die can only be re-rolled once", "Higher total APL controls an objective marker; equal totals, nobody", "Score VP at the end of each turning point, as your mission says"].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}><span style={{ color: "#5A9C3A" }}><Icon name="check" size={14} /></span>{t}</div>
          ))}
        </Box>
        <Say>You know enough to play a full game. Build your team in <B>Battle</B>; the Turn and mission tab walks you through each turning point.</Say>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={restart} style={{ ...bs("var(--muted)"), padding: "12px 18px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="reset" size={14} /> Play part 2 again</button>
          <button onClick={onPart1} style={{ ...bs("var(--muted)"), padding: "12px 18px", fontSize: 14 }}>Back to part 1</button>
        </div>
      </div>
    ),
  ];
  const phase = TUT2_STEPS[step][0], pc = TUT_PHASE_COLOR[phase];
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px" }}>
      {onExit && <button onClick={onExit} style={{ ...bs("var(--muted)"), padding: "6px 12px", fontSize: 12, marginBottom: 12 }}><Back /> Rules</button>}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Tutorial, part 2</div>
        {step > 0 && <button onClick={restart} style={{ ...bs("var(--muted)"), padding: "8px 12px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="reset" size={13} /> Restart</button>}
      </div>
      <p style={{ ...mu, marginBottom: 12 }}>Objectives, scoring and ploys. <button className="link-btn" onClick={onPart1} style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", cursor: "pointer", textDecoration: "underline", font: "inherit" }}>Part 1: a turning point</button></p>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {TUT2_STEPS.map(([ph], i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? TUT_PHASE_COLOR[ph] : "var(--raised)", transition: "background 0.3s" }} />)}
      </div>
      <div style={{ ...cd, padding: mobile ? 16 : 22, borderTop: "3px solid " + pc }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <span style={bg(pc)}>{phase === "Intro" ? "Tutorial" : phase + " phase"}</span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Step {step + 1} of {TUT2_STEPS.length}</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.02em", marginBottom: 12 }}>{TUT2_STEPS[step][1]}</div>
        {body[step]()}
      </div>
      {step > 0 && step < TUT2_STEPS.length - 1 && <button onClick={() => go(step - 1)} className="link-btn" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, marginTop: 10, padding: 0 }}>Back a step</button>}
    </div>
  );
}

