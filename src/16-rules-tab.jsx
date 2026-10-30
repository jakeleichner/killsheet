/* ═══ RULES ═══ */
// Weapon rules: first sentence is the summary, the rest expands.
const splitRule = (text) => {
  const m = text.match(/^(.+?[.!?])\s+(.+)$/s);
  return m ? { summary: m[1], detail: m[2] } : { summary: text };
};
const EQUIP_TYPE_COLOR = { weapon: "#B8341C", action: "var(--accent)", terrain: "var(--muted)", upgrade: "var(--blue)" };
const RULE_SECTIONS = [
  { id: "play", label: "How to Play", groups: [
    { title: "Game sequence", items: GAME_SEQUENCE },
    { title: "Operatives and dice", items: CORE_CONCEPTS },
    { title: "Actions", items: CORE_ACTIONS },
  ] },
  { id: "terrain", label: "Moving & Terrain", groups: [
    { title: "Movement", items: MOVEMENT_RULES },
    { title: "Seeing and cover", items: VISIBILITY_RULES },
    { title: "Terrain types", intro: "Terrain features are made of parts, and each part has one or more types. If a rule says to ignore Light terrain, ignore only the Light parts.", items: TERRAIN_TYPES.map(t => ({ name: t.name, swatch: t.color, summary: t.desc, detail: t.rules })) },
  ] },
  { id: "combat", label: "Combat", groups: [
    { title: "Shooting", items: SHOOTING_RULES },
    { title: "Fighting", items: FIGHTING_RULES },
    { title: "Weapon rules", items: Object.entries(WR).map(([k, v]) => ({ name: k, ...splitRule(v) })) },
  ] },
  { id: "equipment", label: "Equipment", groups: [
    { title: "Universal equipment", intro: "Any kill team can take these. Each option can be selected once per game. Your team's own equipment is listed in the Battle tab.", items: UNIV_EQUIPMENT.map(e => ({ name: e.name, tag: e.type, tagColor: EQUIP_TYPE_COLOR[e.type], summary: e.desc, stats: e.stats, detail: e.note })) },
  ] },
  { id: "glossary", label: "Glossary", glossary: true },
];
const ruleText = (it) => [it.name, it.summary, ...(it.steps || []), ...[].concat(it.detail || []), it.stats ? it.stats.wr : ""].join(" ").toLowerCase();

function StepList({ items }) {
  return items.map((s, i) => (
    <div key={i} style={{ display: "flex", gap: 8, marginTop: 6 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "color-mix(in srgb, var(--accent) 13%, transparent)", color: "var(--accent)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Rajdhani', sans-serif" }}>{i + 1}</div>
      <div style={mu}>{s}</div>
    </div>
  ));
}

function RuleItem({ item, open, onToggle }) {
  const more = !!(item.detail || item.stats);
  const lines = [].concat(item.detail || []);
  return (
    <div role={more ? "button" : undefined} tabIndex={more ? 0 : undefined} aria-expanded={more ? open : undefined} onClick={more ? onToggle : undefined} style={{ ...cd, padding: 12, marginBottom: 8, cursor: more ? "pointer" : "default", borderLeft: "3px solid " + (open ? "var(--accent)" : "var(--line)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {item.swatch && <div style={{ width: 10, height: 10, borderRadius: 2, background: item.swatch, flexShrink: 0 }} />}
        <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.03em", color: open ? "var(--accent)" : "var(--text)" }}>{item.name}</span>
        {item.tag && <span style={bg(item.tagColor || "#B8341C")}>{item.tag}</span>}
        {more && <Arrow open={open} />}
      </div>
      {item.summary && <div style={{ ...mu, marginTop: 4 }}><RefText text={item.summary} self={item.name} /></div>}
      {item.steps && <StepList items={item.steps} />}
      {more && open && (
        <div style={{ marginTop: 8, paddingLeft: 10, borderLeft: "2px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
          {item.visual && RULE_DIAGRAMS[item.visual] && React.createElement(RULE_DIAGRAMS[item.visual])}
          {lines.map((l, i) => <div key={i} style={{ ...mu, color: "var(--text2)", marginBottom: 4 }}>{lines.length > 1 ? "• " : ""}<RefText text={l} self={item.name} /></div>)}
          {item.stats && (
            <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 5, padding: "8px 10px", marginTop: 6, border: "1px solid var(--raised)", cursor: "default" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                {[["ATK", item.stats.atk], ["HIT", item.stats.hit], ["DMG", item.stats.dmg]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif" }}>{val}</div>
                  </div>
                ))}
              </div>
              {item.stats.wr && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 6 }}>
                  {item.stats.wr.split(", ").map((r, j) => <Tip key={j} k={r}><span style={{ ...pl, color: "inherit" }}>{r}</span></Tip>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Rules({ search, tutorialOpen, openTutorial, closeTutorial }) {
  const { feat, openFeatures } = React.useContext(FeatureCtx);
  const [sec, setSec] = useState("play");
  const [open, setOpen] = useState({});
  const [query, setQuery] = useState("");
  React.useEffect(() => { if (search) setQuery(search.q); }, [search]); // "More information in Rules" from a rule tip
  const q = query.trim().toLowerCase();
  const toggle = (key) => setOpen(o => ({ ...o, [key]: !o[key] }));
  const groupHead = (text) => <div style={{ ...h3, color: "var(--accent)", margin: "18px 0 8px" }}>{text}</div>;

  const renderGroups = (section, groups, searching) => groups.map(g => (
    <div key={section.id + g.title}>
      {groupHead(searching ? section.label + " · " + g.title : g.title)}
      {g.intro && !searching && <div style={{ ...mu, marginBottom: 10 }}>{g.intro}</div>}
      {g.items.map(it => {
        const key = section.id + "/" + g.title + "/" + it.name;
        return <RuleItem key={key} item={it} open={searching || !!open[key]} onToggle={() => toggle(key)} />;
      })}
    </div>
  ));

  const glossaryTable = (rows) => (
    <div style={{ ...cd, padding: "4px 12px" }}>
      {rows.map((g, i) => (
        <div key={g.term} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--raised)" : "none" }}>
          <div style={{ width: 96, flexShrink: 0, fontSize: 14, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif" }}>{g.term}</div>
          <div style={{ ...mu, flex: 1 }}>{g.def}</div>
        </div>
      ))}
    </div>
  );

  const results = q ? RULE_SECTIONS.filter(sc => !sc.glossary).map(sc => ({ sc, groups: sc.groups.map(g => ({ ...g, items: g.items.filter(it => ruleText(it).includes(q)) })).filter(g => g.items.length) })).filter(r => r.groups.length) : [];
  const glossHits = q ? GLOSSARY.filter(g => (g.term + " " + g.def).toLowerCase().includes(q)) : [];
  const current = RULE_SECTIONS.find(sc => sc.id === sec);

  if (tutorialOpen) return <Tutorial onExit={closeTutorial} />;
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", marginBottom: 4, letterSpacing: "0.04em" }}>Rules Reference</div>
      <p style={mu}>Cards with an arrow open for more detail.</p>
      {sec === "play" && !q && (
        <button onClick={openTutorial} style={{ ...cd, width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", margin: "12px 0 0", cursor: "pointer", textAlign: "left", borderLeft: "3px solid var(--gold)" }}>
          <span style={{ color: "var(--gold)", display: "inline-flex" }}><Icon name="play" size={20} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>New to Kill Team? Play the tutorial</span>
            <span style={{ display: "block", fontSize: 13, color: "var(--text2)" }}>Two short parts: a turning point against a bot, then objectives, scoring and ploys.</span>
          </span>
          <span style={{ color: "var(--muted)", display: "inline-flex" }}><Fwd size={20} /></span>
        </button>
      )}
      {sec === "play" && !q && (
        <button className="link-btn" onClick={openFeatures} style={{ background: "none", border: "none", padding: "8px 0 0", cursor: "pointer", textAlign: "left", fontSize: 13, color: "var(--muted)" }}>
          Settings: {FEATURE_MODE_NAMES[featureMode(feat)]}. <span style={{ color: "var(--accent)", textDecoration: "underline" }}>Change what's shown</span>
        </button>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0 8px" }}>
        {RULE_SECTIONS.map(sc => {
          const on = !q && sec === sc.id;
          return <button key={sc.id} onClick={() => { setSec(sc.id); setQuery(""); }} style={{ ...bs(on ? "var(--accent)" : "var(--muted)"), background: on ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent", padding: "7px 12px", fontSize: 12 }}>{sc.label}</button>;
        })}
      </div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search all rules" style={{ width: "100%", boxSizing: "border-box", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "9px 12px", fontSize: 14, fontFamily: "'Inter', sans-serif", marginBottom: 4 }} />

      {q ? (
        <div>
          {results.length === 0 && glossHits.length === 0 && <p style={{ ...mu, marginTop: 12 }}>Nothing matches "{query}".</p>}
          {results.map(r => renderGroups(r.sc, r.groups, true))}
          {glossHits.length > 0 && <div>{groupHead("Glossary")}{glossaryTable(glossHits)}</div>}
        </div>
      ) : current.glossary ? (
        <div>{groupHead("Terms and abbreviations")}{glossaryTable(GLOSSARY)}</div>
      ) : renderGroups(current, current.groups, false)}
    </div>
  );
}

