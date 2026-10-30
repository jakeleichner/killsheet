/* ═══ MISSIONS ═══ */
const modeColor = (m) => m.startsWith("Co-op") ? "#5A9C3A" : m.startsWith("Head") ? "var(--accent)" : "var(--muted)";
const missionLabel = (m) => typeof m.num === "number" ? "Mission " + m.num : m.num === "AO" ? "Head-to-head rules" : "Maps";
// Arrows: Arrow (down, flips up) = opens in place; Fwd (right) = goes forward; Back (left) = goes back.
const Arrow = ({ open }) => <span aria-hidden="true" style={{ display: "inline-flex", flexShrink: 0, color: open ? "var(--accent)" : "var(--muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><Icon name="chevronDown" size={20} /></span>;
const Fwd = ({ size = 16 }) => <Icon name="chevronRight" size={size} style={{ verticalAlign: "-0.2em" }} />;
const Back = ({ size = 16 }) => <Icon name="chevronLeft" size={size} style={{ verticalAlign: "-0.2em" }} />;
const sectionHead = (text) => <div style={{ ...h3, color: "var(--accent)", margin: "20px 0 8px" }}>{text}</div>;

// Mission maps are redrawn as diagrams (maps/<id>.svg, made by tools/missions/draw_maps.py) in the
// app's colors. The original PDF page (maps/<id>.jpg) stays one tap away. Map key pages stay as pages.
const MAP_SVGS = {};
function useMapSvgs(ids, on) {
  const key = ids.join(",");
  const [, setTick] = useState(0);
  React.useEffect(() => {
    if (!on) return;
    let live = true;
    ids.filter(id => !(id in MAP_SVGS)).forEach(id => {
      MAP_SVGS[id] = null;
      fetch("maps/" + id + ".svg").then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(t => { MAP_SVGS[id] = t; }, () => { MAP_SVGS[id] = false; })
        .then(() => { if (live) setTick(n => n + 1); });
    });
    return () => { live = false; };
  }, [key, on]);
  return ids.map(id => !on ? false : id in MAP_SVGS ? MAP_SVGS[id] : null);
}

// Legend rows: [class in the drawing, label, swatch]. Labels depend on who the sides are.
const sideNames = (mode) => mode === "Co-op" ? ["Your", "NPO"] : mode === "Head-to-head" ? ["Player A", "Player B"] : ["Player A / your", "Player B / NPO"];
// Swatches match the map files' own colors (maps/*.svg), which don't change with the theme.
const mapLegend = (mode) => {
  const [a, b] = sideNames(mode);
  const box = (cls) => <rect className={cls} x="1" y="1" width="18" height="12" rx="1" />;
  const line = (cls, extra) => <path className={cls} d="M2 7H18" strokeWidth={extra || 2} />;
  return [
    ["z-dz_a", a + " drop zone", box("z-dz_a")], ["z-terr_a", a + " territory", box("z-terr_a")],
    ["z-dz_b", b + " drop zone", box("z-dz_b")], ["z-terr_b", b + " territory", box("z-terr_b")],
    ["ring", b + " drop zone (ring)", <circle className="ring" cx="10" cy="7" r="5" strokeWidth="1.2" />],
    ["ter", "Terrain", box("ter")], ["inf", "Tyranid infestation", <ellipse className="inf" cx="10" cy="7" rx="7" ry="5" />],
    ["wall", "Wall", line("wall", 2.5)], ["door", "Door", <path className="door" d="M2 7H18" strokeWidth="3" strokeDasharray="3 2" />],
    ["breach", "Breach point", <path className="breach" d="M2 7H18" strokeWidth="3" strokeDasharray="3 2" />],
    ["vant", "Under Vantage terrain", <rect className="vant" x="3" y="2" width="14" height="10" strokeDasharray="2 1.5" strokeWidth="1" />],
    ["pillar", "Pillar", <rect className="pillar" x="6" y="3" width="8" height="8" />], ["access", "Access point", <rect className="access" x="3" y="5" width="14" height="4" rx="2" />],
    ["xmark", "Wall end", <g><rect className="pillar" x="6" y="3" width="8" height="8" /><path className="xmark" d="M7 4L13 10M13 4L7 10" strokeWidth="1.2" /></g>],
    ["nside", "Necron side of wall", <path className="nside" d="M2 7H18" strokeWidth="3" strokeDasharray="3 2" />],
    ["obj", "Objective marker", <circle className="obj" cx="10" cy="7" r="5.5" fill="#C9772E" stroke="#0E0F13" />],
    ["objn", "Objective marker", <circle cx="10" cy="7" r="5.5" fill="#C9772E" stroke="#0E0F13" />],
    ["entry", "Entryway marker", <g className="entry"><circle cx="10" cy="7" r="5" /><path d="M5 7A5 5 0 0 1 15 7Z" /></g>],
    ["mark", "Mission marker", <circle className="mark" cx="10" cy="7" r="4" />],
    ["edge-p", a + " killzone edge", <g><path className="edge-p" d="M2 5.5H18M2 8.5H18" strokeWidth="1" /></g>],
    ["edge-b", "Player B killzone edge", <g><path className="edge-b" d="M2 5.5H18M2 8.5H18" strokeWidth="1" /></g>],
    ["edge-o", b + " killzone edge", <g><path className="edge-o" d="M2 5.5H18M2 8.5H18" strokeWidth="1" /></g>],
    ["edge-n", "Neutral killzone edge", <path d="M3 7H18" stroke="#5A6270" strokeWidth="2.2" strokeDasharray="0 4" strokeLinecap="round" />],
  ];
};

function MapLegend({ svgs, mode }) {
  const used = new Set();
  svgs.forEach(t => { if (t) (t.match(/class="[^"]+"/g) || []).forEach(c => used.add(c.slice(7, -1))); });
  const seen = new Set();
  const rows = mapLegend(mode).filter(([cls, label]) => {
    if (!used.has(cls) && !used.has(cls.replace("z-", "b-"))) return false;
    if (seen.has(label)) return false;
    seen.add(label); return true;
  });
  if (!rows.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 8 }}>
      {rows.map(([cls, label, sw]) => (
        <span key={cls} style={{ display: "inline-flex", alignItems: "center", gap: 6, ...mu, fontSize: 12 }}>
          <svg className="km" width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" style={{ background: "#1D2027", borderRadius: 2, flexShrink: 0 }}>{sw}</svg>{label}
        </span>
      ))}
    </div>
  );
}

function MapImages({ ids, diagram, mode }) {
  const [view, setView] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [original, setOriginal] = useState(false);
  const [turned, setTurned] = useState(false);
  const svgs = useMapSvgs(ids, !!diagram);
  const show = (i, orig) => { setView(i); setZoom(false); setOriginal(!!orig); };
  React.useEffect(() => {
    if (view == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setView(null);
      if (e.key === "ArrowRight") show((view + 1) % ids.length, original);
      if (e.key === "ArrowLeft") show((view - 1 + ids.length) % ids.length, original);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [view, ids.length, original]);
  const navBtn = { ...bs("var(--text)"), background: "color-mix(in srgb, var(--card) 88%, transparent)", padding: "8px 14px", fontSize: 16 };
  const page = (id, style, onClick) => <img src={"maps/" + id + ".jpg"} alt="Mission map page" loading="lazy" onClick={onClick} style={style} />;
  const drawn = view != null && !original && svgs[view];
  // Wide maps on an upright phone can turn sideways to fill the screen.
  const box = drawn && (drawn.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) || []).slice(1).map(Number);
  const canTurn = !!box && box[0] > box[1] && window.innerHeight > window.innerWidth;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: diagram ? "repeat(auto-fill, minmax(300px, 1fr))" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {ids.map((id, i) => (
          <div key={id}>
            <button onClick={() => show(i)} aria-label={svgs[i] ? "Enlarge map" : "Enlarge map page"} style={{ ...cd, display: "block", width: "100%", padding: 6, marginBottom: 0, cursor: "zoom-in" }}>
              {svgs[i] ? <div className="km-tile" role="img" aria-label="Mission map" dangerouslySetInnerHTML={{ __html: svgs[i] }} />
                : svgs[i] === null ? <div style={{ aspectRatio: "30 / 22" }} />
                : page(id, { width: "100%", display: "block", borderRadius: 4 })}
            </button>
            {svgs[i] && <button className="link-btn" onClick={() => show(i, true)} style={{ background: "none", border: "none", padding: "6px 0 0", color: "var(--muted)", fontSize: 12, cursor: "pointer", textDecoration: "underline", fontFamily: "'Inter', sans-serif" }}>View original page</button>}
          </div>
        ))}
      </div>
      {diagram && <MapLegend svgs={svgs} mode={mode} />}
      <div style={{ ...mu, fontSize: 12, marginTop: 6 }}>{diagram ? "Tap a map to enlarge it." : "Tap a page to enlarge it."}</div>
      {view != null && ReactDOM.createPortal(
        <div onClick={() => setView(null)} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(8,9,12,0.94)", display: "flex", flexDirection: "column" }}>
          <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
            <span style={{ flex: 1, ...mu, fontSize: 12 }}>{ids.length > 1 ? (diagram ? "Map " : "Page ") + (view + 1) + " of " + ids.length + " · " : ""}{zoom ? "Tap to fit" : "Tap to zoom"}</span>
            {canTurn && !zoom && <button onClick={() => setTurned(!turned)} aria-pressed={turned} style={{ ...navBtn, fontSize: 12 }}>Rotate</button>}
            {svgs[view] && <button onClick={() => { setOriginal(!original); setZoom(false); }} style={{ ...navBtn, fontSize: 12 }}>{original ? "Diagram" : "Original"}</button>}
            {ids.length > 1 && <button onClick={() => show((view - 1 + ids.length) % ids.length, original)} aria-label="Previous map" style={navBtn}><Back size={20} /></button>}
            {ids.length > 1 && <button onClick={() => show((view + 1) % ids.length, original)} aria-label="Next map" style={navBtn}><Fwd size={20} /></button>}
            <button onClick={() => setView(null)} aria-label="Close" style={navBtn}>{"✕"}</button>
          </div>
          <div onClick={e => e.stopPropagation()} style={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", alignItems: zoom ? "flex-start" : "center", justifyContent: zoom ? "flex-start" : "center", padding: zoom ? 0 : "0 12px 12px" }}>
            {drawn
              ? <div className="km-fit" role="img" aria-label="Mission map" onClick={() => setZoom(!zoom)} dangerouslySetInnerHTML={{ __html: drawn }}
                  style={zoom ? { width: "max(100%, 1100px)", flexShrink: 0, cursor: "zoom-out" }
                    : turned && canTurn ? { width: "calc(100vh - 76px)", height: "calc(100vw - 24px)", flexShrink: 0, transform: "rotate(90deg)", cursor: "zoom-in" }
                    : { width: "100%", height: "100%", cursor: "zoom-in" }} />
              : page(ids[view], zoom ? { width: "max(100%, 1100px)", maxWidth: "none", flexShrink: 0, cursor: "zoom-out" } : { maxWidth: "100%", maxHeight: "calc(100vh - 76px)", objectFit: "contain", cursor: "zoom-in" }, () => setZoom(!zoom))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function NpoCard({ npo, open, onToggle }) {
  const stats = [["APL", npo.apl], ["MOVE", npo.move], ["SAVE", npo.save], ["WOUNDS", npo.wounds]];
  return (
    <div role="button" tabIndex={0} onClick={onToggle} style={{ ...cd, padding: 12, marginBottom: 8, cursor: "pointer", borderLeft: "3px solid " + (open ? "var(--accent)" : "var(--line)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.03em", color: open ? "var(--accent)" : "var(--text)" }}>{npo.name}</span>
        {npo.base && <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>{npo.base}</span>}
        <Arrow open={open} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, marginTop: 8 }}>
        {stats.map(([l, v]) => (
          <div key={l} style={{ background: "var(--bg)", borderRadius: 4, padding: "4px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>{l}</div>
            <div style={{ fontSize: String(v).length > 4 ? 12 : 18, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{v}</div>
          </div>
        ))}
      </div>
      {npo.note && <div style={{ ...mu, fontSize: 12, marginTop: 6 }}>{npo.note}</div>}
      {open && (
        <div onClick={e => e.stopPropagation()} style={{ cursor: "default", marginTop: 10 }}>
          {npo.weapons.map((w, i) => (
            <div key={i} style={{ padding: "6px 0", borderTop: "1px solid var(--raised)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{w.name} <span style={{ fontSize: 11, color: w.type === "ranged" ? "var(--blue)" : "#B8341C" }}>{w.type}</span></span>
                <span style={{ fontSize: 13, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>{[["ATK", w.atk], ["HIT", w.hit], ["DMG", w.dmg]].map(([l, v]) => <span key={l} style={{ marginLeft: 8 }}><span style={{ color: "var(--muted)", fontWeight: 600, fontSize: 11 }}>{l} </span>{v}</span>)}</span>
              </div>
              {w.wr && w.wr !== "-" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 4 }}>
                  {w.wr.split(", ").map((r, j) => <Tip key={j} k={r}><span style={{ ...pl, color: "inherit" }}>{r}</span></Tip>)}
                </div>
              )}
            </div>
          ))}
          {npo.rules.map((r, i) => (
            <div key={i} style={{ ...mu, marginTop: 6 }}><span style={{ color: "var(--text)", fontWeight: 600 }}>{r.name}:</span> {r.desc}</div>
          ))}
          {npo.behaviour && <div style={{ ...mu, marginTop: 8, color: "var(--text2)" }}><span style={{ color: "var(--accent)", fontWeight: 600 }}>Behavior:</span> {npo.behaviour}</div>}
          {npo.priorities.length > 0 && <StepList items={npo.priorities} />}
        </div>
      )}
    </div>
  );
}

// A numbered NPO activation deck (cards 1-13) with the mission's result table.
function ActivationTable({ title, rows }) {
  const all = Array.from({ length: 13 }, (_, i) => i + 1);
  const [left, setLeft] = useState(all);
  const [card, setCard] = useState(null);
  const draw = () => {
    const pool = left.length ? left : all;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setLeft(pool.filter(n => n !== pick));
    setCard(pick);
  };
  const inRow = (roll) => { const [lo, hi] = roll.split("-").map(Number); return card != null && card >= lo && card <= (hi || lo); };
  return (
    <div style={{ ...cd, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: "var(--text)" }}>{title}</span>
        <button onClick={draw} style={{ ...bs("var(--accent)"), padding: "6px 12px", fontSize: 12 }}>Draw card</button>
        <button onClick={() => { setLeft(all); setCard(null); }} style={{ ...bs("var(--muted)"), padding: "6px 12px", fontSize: 12 }}>Reshuffle</button>
      </div>
      {card != null && <div style={{ ...mu, marginBottom: 8 }}>Drew <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16 }}>{card}</span>. {left.length} card{left.length === 1 ? "" : "s"} left in the deck.</div>}
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "6px 8px", borderRadius: 4, background: inRow(r.roll) ? "color-mix(in srgb, var(--gold) 9%, transparent)" : "transparent", border: "1px solid " + (inRow(r.roll) ? "color-mix(in srgb, var(--gold) 38%, transparent)" : "transparent") }}>
          <div style={{ width: 44, flexShrink: 0, fontSize: 14, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif" }}>{r.roll}</div>
          <div style={{ ...mu, flex: 1 }}>{r.effect}</div>
        </div>
      ))}
      <div style={{ ...mu, fontSize: 12, marginTop: 6 }}>If the mission takes cards out of the deck, redraw when you get one of those.</div>
    </div>
  );
}

// A deck of named cards (event cards, Blood and Zeal) with a random draw.
function CardDeck({ deck }) {
  const all = deck.cards.map((_, i) => i);
  const [left, setLeft] = useState(all);
  const [drawn, setDrawn] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const draw = () => {
    const pool = left.length ? left : all;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setLeft(pool.filter(n => n !== pick));
    setDrawn(pick);
  };
  const card = drawn != null ? deck.cards[drawn] : null;
  return (
    <div style={{ ...cd, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: "var(--text)" }}>{deck.name} <span style={{ fontSize: 12, color: "var(--muted)" }}>({deck.cards.length})</span></span>
        <button onClick={draw} style={{ ...bs("var(--accent)"), padding: "6px 12px", fontSize: 12 }}>Draw card</button>
        <button onClick={() => { setLeft(all); setDrawn(null); }} style={{ ...bs("var(--muted)"), padding: "6px 12px", fontSize: 12 }}>Shuffle back</button>
      </div>
      {deck.note && <div style={{ ...mu, fontSize: 12, marginTop: 4 }}>{deck.note}</div>}
      {card && (
        <div style={{ marginTop: 10, padding: 10, borderRadius: 6, background: "color-mix(in srgb, var(--gold) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--gold) 31%, transparent)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", fontFamily: "'Rajdhani', sans-serif" }}>{card.name}</div>
          <div style={{ ...mu, color: "var(--text)", marginTop: 2 }}>{card.effect}</div>
          <div style={{ ...mu, fontSize: 12, marginTop: 4 }}>{left.length} card{left.length === 1 ? "" : "s"} left.</div>
        </div>
      )}
      <button onClick={() => setShowAll(!showAll)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "8px 0 0", fontSize: 13, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
        <Arrow open={showAll} /> {showAll ? "Hide" : "Show"} all cards
      </button>
      {showAll && deck.cards.map((c, i) => (
        <div key={i} style={{ ...mu, padding: "6px 0", borderTop: i ? "1px solid var(--raised)" : "none" }}><span style={{ color: "var(--text)", fontWeight: 600 }}>{c.name}:</span> {c.effect}</div>
      ))}
    </div>
  );
}

// The body of one mission: maps, rules, actions, victory, activation deck, campaign links.
// Used on the Missions tab and in the Builder's mission panel.
function MissionBody({ pack, mission, idx, onGoMission }) {
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen(o => ({ ...o, [key]: !o[key] }));
  const rules = (items, prefix) => items.map(it => <RuleItem key={prefix + it.name} item={it} open={!!open[prefix + it.name]} onToggle={() => toggle(prefix + it.name)} />);
  const nextStep = (label, target) => {
    if (target == null) return null;
    const i = typeof target === "number" ? pack.missions.findIndex(m => m.num === target) : -1;
    return (
      <div style={{ ...mu, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        <span style={{ width: 44, color: label === "Win" ? "#5A9C3A" : "#B8341C", fontWeight: 700 }}>{label}</span>
        {i >= 0 && onGoMission
          ? <button onClick={() => onGoMission(i)} style={{ ...bs("var(--accent)"), padding: "4px 10px", fontSize: 12 }}>Mission {target}: {pack.missions[i].name}</button>
          : <span style={{ color: "var(--text)" }}>{i >= 0 ? "Mission " + target + ": " + pack.missions[i].name : target}</span>}
      </div>
    );
  };
  return (
    <div>
      {mission.maps.length > 0 && (<div>{sectionHead(mission.maps.length > 1 ? "Maps" : "Map")}<MapImages ids={mission.maps} diagram mode={mission.mode} /></div>)}
      {mission.maps.length === 0 && pack.maps && (<div>{sectionHead("Maps")}{pack.mapsNote && <p style={{ ...mu, marginBottom: 8 }}>{pack.mapsNote}</p>}<MapImages ids={pack.maps} diagram /></div>)}
      {mission.rules.length > 0 && (<div>{sectionHead("Mission rules")}{rules(mission.rules, "r/")}</div>)}
      {mission.actions.length > 0 && (<div>{sectionHead("Mission actions")}{rules(mission.actions, "a/")}</div>)}
      {mission.victory.length > 0 && (
        <div>
          {sectionHead("Victory")}
          <div style={{ ...cd, padding: 12 }}>
            {mission.victory.map((v, i) => <div key={i} style={{ ...mu, color: "var(--text2)", marginBottom: 4 }}>{mission.victory.length > 1 ? "• " : ""}{v}</div>)}
          </div>
        </div>
      )}
      {mission.cards && (<div>{sectionHead("NPO activation")}<ActivationTable key={pack.id + idx} title={mission.cardsTitle} rows={mission.cards} /></div>)}
      {(mission.nextWin != null || mission.nextLose != null) && (
        <div>
          {sectionHead("Campaign: next mission")}
          <div style={{ ...cd, padding: 12 }}>{nextStep("Win", mission.nextWin)}{nextStep("Lose", mission.nextLose)}</div>
        </div>
      )}
    </div>
  );
}

// Builder: the mission picked at Mission Setup. Victory is always shown; the rest opens on tap.
function MissionPanel({ mref, npoUnits, setNpoUnits }) {
  const [showAll, setShowAll] = useState(false);
  const pack = MISSION_PACKS.find(p => p.id === mref.pack);
  const mission = pack && pack.missions[mref.idx];
  if (!mission) return null;
  return (
    <div>
      <div style={{ ...cd, padding: 12, marginBottom: 10, borderLeft: "3px solid " + modeColor(mission.mode) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>{pack.name} {"·"} {missionLabel(mission)}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{mission.name}</div>
          </div>
          <span style={bg(modeColor(mission.mode))}>{mission.mode}</span>
        </div>
        {mission.victory.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ ...h3, color: "var(--gold)", marginBottom: 4 }}>How to win</div>
            {mission.victory.map((v, i) => <div key={i} style={{ ...mu, color: "var(--text2)", marginBottom: 2 }}>{mission.victory.length > 1 ? "• " : ""}{v}</div>)}
          </div>
        )}
        <button onClick={() => setShowAll(!showAll)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: "10px 0 0", fontSize: 13, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          <Arrow open={showAll} /> {showAll ? "Hide mission details" : "Map, mission rules and actions"}
        </button>
        {showAll && (
          <div>
            <MissionBody key={pack.id + "/" + mref.idx} pack={pack} mission={{ ...mission, victory: [] }} idx={mref.idx} />
            {pack.decks && pack.decks.map(d => <div key={d.name}>{sectionHead(d.name)}<CardDeck deck={d} /></div>)}
            {pack.rules.length > 0 && <p style={{ ...mu, fontSize: 12, marginTop: 10 }}>The pack's general rules (setup, NPO behavior, campaign) are on the Missions tab under {pack.name}.</p>}
          </div>
        )}
      </div>
      {pack.npos.length > 0 && <NpoTracker pack={pack} units={npoUnits} setUnits={setNpoUnits} />}
    </div>
  );
}

// Builder: enemy NPOs on the table, each with its own wound tracker.
function NpoTracker({ pack, units, setUnits }) {
  const [type, setType] = useState(pack.npos[0].name);
  const [openCard, setOpenCard] = useState(null);
  const [collapsed, setCollapsed] = useState(() => !units.some(u => u.pack === pack.id));
  const byName = Object.fromEntries(pack.npos.map(n => [n.name, n]));
  const mine = units.filter(u => u.pack === pack.id && byName[u.type]);
  const alive = mine.filter(u => u.wounds > 0);
  const add = () => {
    const n = byName[type] || pack.npos[0];
    const count = units.filter(u => u.pack === pack.id && u.type === n.name).length + 1;
    setUnits([...units, { uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), pack: pack.id, type: n.name, label: n.name + " " + count, max: Number(n.wounds) || 1, wounds: Number(n.wounds) || 1 }]);
  };
  const setW = (uid, w) => setUnits(units.map(u => u.uid === uid ? { ...u, wounds: Math.max(0, Math.min(u.max, w)) } : u));
  const remove = (uid) => setUnits(units.filter(u => u.uid !== uid));
  const small = { ...bs("var(--muted)"), padding: "6px 10px", fontSize: 12 };
  return (
    <div style={{ ...cd, padding: 12, marginBottom: 10, borderLeft: "3px solid #B8341C" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{ flex: 1, minWidth: 0, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
          <Arrow open={!collapsed} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{pack.id === "titus" ? "Operatives" : "Enemies (NPOs)"}</span>
        </button>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{alive.length} on the table {"·"} {alive.reduce((t, u) => t + u.max, 0)} starting wounds</span>
      </div>
      {!collapsed && (
        <div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            <select value={type} onChange={e => setType(e.target.value)} style={{ flex: "1 1 160px", minWidth: 0, background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 4, color: "var(--text)", fontSize: 13, padding: "7px 8px", fontFamily: "'Inter', sans-serif" }}>
              {pack.npos.map(n => <option key={n.name} value={n.name}>{n.name} ({n.wounds}W)</option>)}
            </select>
            <button onClick={add} style={{ ...bs("var(--accent)"), padding: "6px 14px", fontSize: 12 }}>+ Add</button>
            {mine.some(u => u.wounds <= 0) && <button onClick={() => setUnits(units.filter(u => !(u.pack === pack.id && u.wounds <= 0)))} style={small}>Clear dead</button>}
            {mine.length > 0 && <button onClick={() => { if (confirm("Remove all NPOs from the tracker?")) setUnits(units.filter(u => u.pack !== pack.id)); }} style={small}>Clear all</button>}
          </div>
          {alive.length > 10 && <div style={{ ...mu, fontSize: 12, color: "var(--gold)", marginTop: 6 }}>Most packs limit NPOs to 10 on the table at once.</div>}
          {mine.length === 0 && <div style={{ ...mu, fontSize: 13, marginTop: 8 }}>Add each NPO as you set it up. The mission rules above say how many and where.</div>}
          {mine.map(u => {
            const dead = u.wounds <= 0;
            const injured = !dead && u.wounds < u.max / 2;
            const isOpen = openCard === u.uid;
            return (
              <div key={u.uid} style={{ marginTop: 8, opacity: dead ? 0.5 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", borderRadius: 6, padding: "6px 8px" }}>
                  <button onClick={() => setOpenCard(isOpen ? null : u.uid)} style={{ flex: 1, minWidth: 0, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
                    <Arrow open={isOpen} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: dead ? "var(--muted)" : "var(--text)", fontFamily: "'Rajdhani', sans-serif", textDecoration: dead ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.label}</span>
                    {injured && <span style={{ fontSize: 11, color: "var(--gold)" }}>injured</span>}
                  </button>
                  <button onClick={() => setW(u.uid, u.wounds - 1)} aria-label="Lose a wound" style={{ width: 32, height: 32, border: "1px solid #B8341C60", borderRadius: 4, background: "transparent", color: "#E0664A", cursor: "pointer", fontSize: 16 }}>{"−"}</button>
                  <span style={{ minWidth: 48, textAlign: "center", fontSize: 15, fontWeight: 700, color: dead ? "#B8341C" : injured ? "var(--gold)" : "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{u.wounds}/{u.max}</span>
                  <button onClick={() => setW(u.uid, u.wounds + 1)} aria-label="Regain a wound" style={{ width: 32, height: 32, border: "1px solid #3D6B3F80", borderRadius: 4, background: "transparent", color: "#5A9C3A", cursor: "pointer", fontSize: 16 }}>+</button>
                  <button onClick={() => remove(u.uid)} aria-label="Remove" style={{ width: 32, height: 32, border: "1px solid var(--line)", borderRadius: 4, background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>{"✕"}</button>
                </div>
                <div style={{ height: 3, background: "var(--raised)", borderRadius: 2, margin: "3px 2px 0" }}>
                  <div style={{ height: 3, width: (100 * u.wounds / u.max) + "%", background: dead ? "#B8341C" : injured ? "var(--gold)" : "#5A9C3A", borderRadius: 2 }} />
                </div>
                {isOpen && <div style={{ marginTop: 6 }}><NpoCard npo={byName[u.type]} open={true} onToggle={() => setOpenCard(null)} /></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Missions({ campaign, startCampaign }) {
  const { feat, setFeat, openFeatures } = React.useContext(FeatureCtx);
  const [packId, setPackId] = useState(null);
  const [missionIdx, setMissionIdx] = useState(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen(o => ({ ...o, [key]: !o[key] }));
  const pack = MISSION_PACKS.find(p => p.id === packId);
  const mission = pack && missionIdx != null ? pack.missions[missionIdx] : null;
  const go = (pid, mi) => { setPackId(pid); setMissionIdx(mi); window.scrollTo(0, 0); };
  const back = (label, onClick) => <button onClick={onClick} style={{ ...bs("var(--muted)"), padding: "6px 12px", fontSize: 12, marginBottom: 12 }}><Back /> {label}</button>;
  const rules = (items, prefix) => items.map(it => <RuleItem key={prefix + it.name} item={it} open={!!open[prefix + it.name]} onToggle={() => toggle(prefix + it.name)} />);
  const filters = ["All", "Co-op / solo", "Head-to-head"];
  const shown = MISSION_PACKS.filter(p => filter === "All" || p.modes.some(m => m.startsWith(filter.slice(0, 5))));

  const campaignCard = feat.campaign && (
    <div style={{ ...cd, padding: 14, borderLeft: "3px solid var(--blue)", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 240px", minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Ctesiphus Expedition campaign</div>
        <div style={{ ...mu, fontSize: 13 }}>Link your games into a campaign on a hex map: explore, manage Supply, set up camps and race the threat level. Works solo, co-op or with a group.</div>
      </div>
      <button onClick={startCampaign} style={{ ...bs("var(--blue)"), background: "color-mix(in srgb, var(--blue) 13%, transparent)", padding: "10px 16px", fontSize: 14 }}>{campaign ? "Continue your campaign" : "Start a campaign"} <Fwd /></button>
    </div>
  );
  const heading = <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", marginBottom: 4, letterSpacing: "0.04em" }}>Missions</div>;

  // Not added yet: present mission packs as an optional extra, say what they are and how to add them.
  if (!feat.missions) return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
      {heading}
      <div style={{ ...cd, padding: 14, borderLeft: "3px solid var(--accent)", marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Mission packs</div>
          <span style={bg("var(--accent)")}>Optional extra</span>
        </div>
        <div style={{ ...mu, fontSize: 14, marginTop: 4 }}>When you want more than a standard game, try a mission. You don't need one to play.</div>
        {[["What they are", FEATURE_EXPLAIN.missions.what], ["What you need", FEATURE_EXPLAIN.missions.need], ["How they change your game", FEATURE_EXPLAIN.missions.changes], ["How to start", "Tap Add mission packs, then pick a pack and a mission. You can remove them again in Settings (the cog at the top)."]].map(([h, t]) => (
          <p key={h} style={{ ...mu, fontSize: 14, margin: "8px 0 0" }}><strong style={{ color: "var(--text)" }}>{h}:</strong> {t}</p>
        ))}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={() => setFeat("missions", true)} style={{ ...bs("var(--accent)"), background: "color-mix(in srgb, var(--accent) 8%, transparent)", padding: "10px 16px", fontSize: 14 }}>Add mission packs</button>
          <button onClick={openFeatures} style={{ ...bs("var(--muted)"), padding: "10px 16px", fontSize: 14 }}>See all extras</button>
        </div>
      </div>
      {campaignCard || <FeatureHint k="campaign" text="Another extra: the Ctesiphus Expedition campaign links your games on a hex map." style={{ marginTop: 12 }} />}
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
      {!pack && (
        <div>
          {heading}
          <p style={mu}>Games Workshop's free mission packs. You still build your roster as normal; a mission sets the map, special rules and how you score. Co-op packs pit you (alone or with a friend) against computer-run enemies.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0" }}>
            {filters.map(f => <button key={f} onClick={() => setFilter(f)} style={{ ...bs(filter === f ? "var(--accent)" : "var(--muted)"), background: filter === f ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent", padding: "7px 12px", fontSize: 12 }}>{f}</button>)}
          </div>
          {campaignCard || <FeatureHint k="campaign" text="Optional extra: the Ctesiphus Expedition campaign links your games on a hex map." style={{ margin: "0 0 12px" }} />}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {shown.map(p => (
              <div key={p.id} role="button" tabIndex={0} onClick={() => go(p.id, null)} style={{ ...cd, padding: 14, marginBottom: 0, cursor: "pointer", minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.03em" }}>{p.name}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "6px 0" }}>
                  {p.modes.map(m => <span key={m} style={bg(modeColor(m))}>{m}</span>)}
                </div>
                <div style={{ ...mu, fontSize: 13 }}>{p.summary}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
                  {p.missions.filter(m => typeof m.num === "number").length ? p.missions.filter(m => typeof m.num === "number").length + " MISSIONS · " : ""}{p.kind.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pack && !mission && (
        <div>
          {back("All packs", () => go(null, null))}
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>{pack.name}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "6px 0 8px" }}>
            {pack.modes.map(m => <span key={m} style={bg(modeColor(m))}>{m}</span>)}
            <span style={bg("var(--muted)")}>{pack.killzone}</span>
          </div>
          <p style={mu}>{pack.summary}</p>

          {pack.missions.length > 0 && sectionHead("Missions")}
          {pack.missions.map((m, i) => (
            <div key={i} role="button" tabIndex={0} onClick={() => go(pack.id, i)} style={{ ...cd, padding: 12, marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>{missionLabel(m)}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{m.name}</div>
                <div style={{ ...mu, fontSize: 13, marginTop: 2 }}>{m.summary}</div>
              </div>
              <span style={bg(modeColor(m.mode))}>{m.mode}</span>
              <Arrow open={false} />
            </div>
          ))}

          {pack.maps && pack.maps.length > 0 && (<div>{sectionHead("Maps")}{pack.mapsNote && <p style={{ ...mu, marginBottom: 8 }}>{pack.mapsNote}</p>}<MapImages ids={pack.maps} diagram /></div>)}

          {pack.rules.length > 0 && (<div>{sectionHead(pack.missions.length ? "Pack rules" : "Rules")}{rules(pack.rules, pack.id + "/r/")}</div>)}
          {pack.actions && pack.actions.length > 0 && (<div>{sectionHead("Actions")}{rules(pack.actions, pack.id + "/a/")}</div>)}
          {pack.decks && pack.decks.map(d => <div key={d.name}>{sectionHead(d.name)}<CardDeck deck={d} /></div>)}

          {pack.npos.length > 0 && (
            <div>
              {sectionHead(pack.id === "titus" ? "Datacards" : "Enemy datacards (NPOs)")}
              {pack.npos.map(n => <NpoCard key={n.name} npo={n} open={!!open[pack.id + "/n/" + n.name]} onToggle={() => toggle(pack.id + "/n/" + n.name)} />)}
            </div>
          )}

          {pack.keyMaps.length > 0 && (<div>{sectionHead("Map key")}<MapImages ids={pack.keyMaps} /></div>)}
          <p style={{ ...mu, fontSize: 12, marginTop: 20 }}>Condensed from Games Workshop's free {pack.source} PDF on warhammer-community.com. If anything here is unclear, the PDF is the final word.</p>
        </div>
      )}

      {mission && (
        <div>
          {back(pack.name, () => go(pack.id, null))}
          <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>{pack.name} {"·"} {missionLabel(mission)}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>{mission.name}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "6px 0 8px" }}><span style={bg(modeColor(mission.mode))}>{mission.mode}</span></div>
          <p style={mu}>{mission.summary}</p>

          <MissionBody key={pack.id + "/" + missionIdx} pack={pack} mission={mission} idx={missionIdx} onGoMission={(i) => go(pack.id, i)} />
          {pack.npos.length > 0 && <p style={{ ...mu, marginTop: 16 }}>Enemy datacards and the pack's general rules are on the <button className="link-btn" onClick={() => go(pack.id, null)} style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>{pack.name} page</button>.</p>}
        </div>
      )}
    </div>
  );
}

