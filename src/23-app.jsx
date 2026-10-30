/* ═══ APP ═══ */
function App() {
  const [tab, setTab] = useLocalStorage("tab", "builder");
  // The tutorial lives inside Rules; the Builder shows new players a one-time banner pointing to it.
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialSeen, setTutorialSeen] = useLocalStorage("tutorialSeen", false);
  const [campaign, setCampaign] = useLocalStorage("campaign", null); // Ctesiphus Expedition, shared by Missions and Battle
  // What the app shows (Your KillSheet). null until a new player answers the first-time question.
  const [features, setFeatures] = useLocalStorage("features", null);
  const [validate, setValidate] = useLocalStorage("validate", true);
  const [returning, setReturning] = useState(isReturningPlayer);
  React.useEffect(() => { if (!features && returning) setFeatures({ ...FEATURE_PRESETS.expert }); }, []);
  // Play online joined the Learning preset (Oct 2026): saved Learning switches pick it up instead of turning Custom.
  React.useEffect(() => { if (features && features.online === false && featureMode({ ...features, online: true }) === "learning") setFeatures(prev => ({ ...prev, online: true })); }, []);
  const [showFeatures, setShowFeatures] = useState(false);
  // Updates and what's new: the bar when a new version is ready ("Later" hides it for that version), and a one-time
  // note after an update. A first-time player starts with everything seen.
  const [update, setUpdate] = useUpdateCheck();
  const [laterFor, setLaterFor] = useState(null);
  const [seenNews, setSeenNews] = useLocalStorage("seenNews", null);
  const [showNews, setShowNews] = useState(false);
  React.useEffect(() => { if (seenNews === null) setSeenNews(CHANGELOG[0].date); }, []);
  const openNews = () => { setSeenNews(CHANGELOG[0].date); setShowNews(true); };
  // Appearance: the theme, and whether the accent follows your team's color (Builder reports the team).
  const [appearance, setAppearance] = useLocalStorage("appearance", { theme: "default", matchTeam: false });
  const [teamId, setTeamId] = useState(null); // the Battle tab's team (Match my team)
  const teamColor = teamId && FACTIONS[teamId] ? FACTIONS[teamId].color : null;
  React.useLayoutEffect(() => applyTheme(appearance.theme), [appearance.theme]);
  TEXT_SCALE = TEXT_SIZES[appearance.text] || 1; // before anything below is drawn
  React.useLayoutEffect(() => { document.documentElement.style.setProperty("--ts", String(TEXT_SCALE)); }, [appearance.text]);
  const battleAccent = appearance.matchTeam && teamColor ? teamAccent(teamColor, THEMES[appearance.theme] || THEMES.default) : null;
  const cogButton = <button onClick={() => setShowFeatures(true)} aria-label="Settings" title="Settings" aria-haspopup="dialog" style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, cursor: "pointer", color: showFeatures ? "var(--accent)" : "var(--muted)" }}><Icon name="cog" size={20} /></button>;
  const feat = { ...FEATURE_PRESETS[features ? presetOf(features) : returning ? "expert" : "learning"], ...(features || {}) };
  const [ruleSearch, setRuleSearch] = useState(null);
  const featureCtx = {
    feat, validate, setValidate, appearance, setAppearance, teamColor, teamId,
    setFeat: (k, v) => setFeatures(prev => ({ ...feat, ...(prev || {}), [k]: v })),
    setMode: (m) => setFeatures({ ...FEATURE_PRESETS[m] }),
    openFeatures: (k) => setShowFeatures(typeof k === "string" ? k : true),
    openRule: (q) => { setTutorialOpen(false); setTab("rules"); setRuleSearch({ q, n: Date.now() }); window.scrollTo(0, 0); },
  };
  React.useEffect(() => { if (/[?&]selftest\b/.test(window.location.search)) setTimeout(() => runSelfTest({ setFeatures, setReturning, mpMessage: (m) => mpHandlerRef.current && mpHandlerRef.current(m) }), 1000); }, []);
  const openTutorial = () => { setTab("rules"); setTutorialOpen(true); setTutorialSeen(true); window.scrollTo(0, 0); };
  // Migration: old persisted tabs ("sequence" was deleted, "tutorial" moved into Rules)
  React.useEffect(() => {
    if (tab === "sequence") setTab("builder");
    if (tab === "tutorial") { setTab("rules"); setTutorialOpen(true); }
  }, [tab]);
  const [tp, setTp] = useLocalStorage("tp", 1);
  const mobile = useIsMobile();
  // Phones: the pinned tabs (and online banner) slide away when you scroll down and come back when you scroll up.
  // Small jitters don't count; near the top they always show. --pinned-h tells the Battle score bar where to sit.
  const [barHidden, setBarHidden] = useState(false);
  const pinnedRef = React.useRef(null);
  const scrollState = React.useRef({ y: 0, anchor: 0, dir: 0 });
  React.useEffect(() => {
    if (!mobile) { setBarHidden(false); return; }
    const onScroll = () => {
      const r = scrollState.current, y = window.scrollY, dir = y > r.y ? 1 : y < r.y ? -1 : 0;
      if (dir && dir !== r.dir) { r.dir = dir; r.anchor = r.y; }
      r.y = y;
      if (y < 120) setBarHidden(false);
      else if (dir > 0 && y - r.anchor > 30) setBarHidden(true);
      else if (dir < 0 && r.anchor - y > 15) setBarHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobile]);
  const [pinnedH, setPinnedH] = useState(54);
  React.useLayoutEffect(() => {
    const el = pinnedRef.current;
    if (!el) return;
    const measure = () => setPinnedH(el.offsetHeight);
    measure();
    const ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    return () => ro && ro.disconnect();
  }, []);
  React.useLayoutEffect(() => { document.documentElement.style.setProperty("--pinned-h", (barHidden ? 0 : pinnedH) + "px"); }, [barHidden, pinnedH]);
  React.useEffect(() => { setBarHidden(false); }, [tab]);
  // Enter or Space on a focused role="button" element acts like a click (buttons do this already).
  React.useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if ((e.key === "Enter" || e.key === " ") && t && t.getAttribute && t.getAttribute("role") === "button" && t.tagName !== "BUTTON") { e.preventDefault(); t.click(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const tabs = [["rules", "Rules"], ["missions", "Missions"], ["builder", "Battle"], ["community", "Community"]];
  // Multiplayer hosted at App level so banner is visible across tabs
  const mpHandlerRef = React.useRef(null);
  const mp = useMultiplayer((msg) => { if (mpHandlerRef.current) mpHandlerRef.current(msg); });
  const [showMP, setShowMP] = useState(false);
  // A dropped online game brings the hidden tabs back, so the Rejoin banner is seen.
  React.useEffect(() => { if (mp.status === "idle" || mp.status === "error" || mp.lost) setBarHidden(false); }, [mp.status, mp.lost]);

  return (
    <FeatureCtx.Provider value={featureCtx}>
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 14 }}>
      {features === null && !returning && <Welcome />}
      {showFeatures && <FeaturesPage focus={showFeatures} onClose={() => setShowFeatures(false)} onNews={openNews} />}
      {showNews && <WhatsNew onClose={() => setShowNews(false)} />}

      {/* HEADER: phones show the logo above the tabs; desktop puts it inside the tab bar. The cog (Settings) sits top right on both. */}
      {mobile && (
        <div style={{ padding: "10px 12px", background: "var(--card)", borderBottom: "1px solid var(--line)", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Logo size={20} /></div>
          <div style={{ position: "absolute", right: 4, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>{cogButton}</div>
        </div>
      )}

      {/* Tabs and the online banner stay pinned at the top together */}
      <div ref={pinnedRef} data-pinned={barHidden ? "hidden" : "shown"} style={{ position: "sticky", top: 0, zIndex: 10, transform: barHidden ? "translateY(-100%)" : "none", transition: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "none" : "transform 0.2s ease-out" }}>
      {update && update !== laterFor
        ? <NoticeBar color="var(--accent)" text={"A new version of KillSheet is ready." + (mp.status === "connected" ? " Updating reloads the page, so you'll reconnect to your online game." : "")} action="Update" onAction={() => window.location.reload()} onDismiss={() => setLaterFor(update)} dismissLabel="Later" />
        : newsSince(seenNews).length > 0 && <NoticeBar color="var(--blue)" text="KillSheet was updated." action="What's new" onAction={openNews} onDismiss={() => setSeenNews(CHANGELOG[0].date)} dismissLabel="Dismiss" />}
      {/* NAV */}
      <nav style={{ display: "flex", background: "var(--card)", borderBottom: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", padding: "0 20px", borderRight: "1px solid var(--line)", flexShrink: 0 }}>
            <Logo size={24} />
          </div>
        )}
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: mobile ? "10px 2px" : "16px 8px", border: "none", cursor: "pointer",
            display: "flex", flexDirection: mobile ? "column" : "row", alignItems: "center", justifyContent: "center", gap: mobile ? 3 : 6, minWidth: 0,
            fontSize: mobile ? 11 : 13, fontWeight: 600, letterSpacing: mobile ? "0.04em" : "0.08em", textTransform: "uppercase",
            fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
            background: tab === id ? "var(--raised)" : "transparent",
            color: tab === id ? "var(--accent)" : "var(--muted)",
            borderBottom: tab === id ? "2px solid var(--accent)" : "2px solid transparent",
            position: "relative", transition: "all 0.15s"
          }}>
            <Icon name={TAB_ICONS[id]} size={18} />
            {label}
          </button>
        ))}
        {!mobile && <div style={{ display: "flex", alignItems: "center", padding: "0 10px", borderLeft: "1px solid var(--line)", flexShrink: 0 }}>{cogButton}</div>}
      </nav>
      {/* CONNECTION BANNER (across all tabs): under the tabs, so it never covers them */}
      {(mp.status !== "idle" || mp.lastRoom) && (
        <div style={{
          background: "color-mix(in srgb, " + (mp.status === "connected" ? "#3D6B3F" : mp.status === "error" ? "#B8341C" : "var(--accent)") + " 16%, var(--bg))", // opaque: the page scrolls under it
          borderBottom: "1px solid " + (mp.status === "connected" ? "#3D6B3F" : mp.status === "error" ? "#B8341C" : "var(--accent)"),
          padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>
            <span style={{ color: mp.status === "connected" ? "#3D6B3F" : mp.status === "error" ? "#B8341C" : "var(--accent)", fontWeight: 700 }}>
              <MPIcon name={mpIconFor(mp.status)} size={11} />
            </span>
            <span style={{ color: "var(--text)" }}>
              {mp.status === "idle" && (mobile ? "Game dropped" : "Your online game dropped")}
              {mp.status === "hosting" && (mp.lost ? (mobile ? "Opponent dropped" : "Opponent dropped, waiting for them to rejoin") : mobile ? "Hosting" : "Hosting, waiting for opponent")}
              {mp.status === "joining" && (mp.lost ? "Rejoining..." : "Connecting...")}
              {mp.status === "connected" && (mobile ? "Live" : "Connected as " + mp.role)}
              {mp.status === "error" && (mp.peerError || "Error")}
            </span>
            {(mp.roomCode || mp.lastRoom) && (
              <span style={{ color: "var(--accent)", fontFamily: "monospace", letterSpacing: "0.15em", fontWeight: 700 }}>{mp.roomCode || mp.lastRoom.code}</span>
            )}
            {mp.pendingCount > 0 && mp.status !== "connected" && <span style={{ color: "var(--muted)" }}>{mp.pendingCount} {mp.pendingCount === 1 ? "change" : "changes"} to send</span>}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {(mp.status === "idle" || mp.status === "error") && mp.lastRoom && <button onClick={mp.rejoin} style={{ ...bs("var(--blue)"), fontSize: 11, padding: "2px 8px", background: "color-mix(in srgb, var(--blue) 13%, transparent)" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MPIcon name="join" size={11} />Rejoin</span></button>}
            {mp.status !== "idle" && <button onClick={() => { if (tab !== "builder") setTab("builder"); setShowMP(true); }} style={{ ...bs("var(--blue)"), fontSize: 11, padding: "2px 8px" }}>{mp.status === "connected" ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MPIcon name="chat" size={10} />Chat</span> : "Manage"}</button>}
            <button onClick={mp.disconnect} style={{ ...bs("var(--muted)"), fontSize: 11, padding: "2px 8px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MPIcon name="leave" size={11} />{mp.status === "idle" ? "Leave" : "Disconnect"}</span></button>
          </div>
        </div>
      )}
      </div>

      {/* CONTENT: all tabs stay mounted, hidden with display:none to preserve state */}
      <div className="ks-appear" style={{ display: tab === "rules" ? "block" : "none" }}><ErrorBoundary where="Rules"><Rules search={ruleSearch} tutorialOpen={tutorialOpen} openTutorial={openTutorial} closeTutorial={() => { setTutorialOpen(false); window.scrollTo(0, 0); }} /></ErrorBoundary></div>
      <div className="ks-appear" style={{ display: tab === "missions" ? "block" : "none" }}><ErrorBoundary where="Missions"><Missions campaign={campaign} startCampaign={() => { if (!campaign) setCampaign(cteNew("solo", "m26", 7, "", "")); setTab("builder"); window.scrollTo(0, 0); }} /></ErrorBoundary></div>
      <div id="panel-builder" className="ks-appear" style={{ display: tab === "builder" ? "block" : "none", ...(battleAccent ? { "--accent": battleAccent } : {}) }}><ErrorBoundary where="Battle"><Builder tp={tp} setTp={setTp} mp={mp} mpHandlerRef={mpHandlerRef} showMP={showMP} setShowMP={setShowMP} tutorialSeen={tutorialSeen} setTutorialSeen={setTutorialSeen} openTutorial={openTutorial} campaign={campaign} setCampaign={setCampaign} onTeamColor={setTeamId} showBattle={() => setTab("builder")} /></ErrorBoundary></div>
      <div className="ks-appear" style={{ display: tab === "community" ? "block" : "none" }}><ErrorBoundary where="Community"><CommunityRosters /><CrashTest /></ErrorBoundary></div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "20px 16px", borderTop: "1px solid var(--line)", background: "linear-gradient(180deg, var(--bg), #08070600)" }}>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>KillSheet: rosters, rules and game tracking for Kill Team players.</div>
        <div style={{ fontSize: 12, color: "var(--muted2)", lineHeight: 1.6 }}>Fan-made and not affiliated with Games Workshop. Rules are condensed from the free official downloads.</div>
      </div>
    </div>
    </FeatureCtx.Provider>
  );
}

/* ═══ MAP CHECK (open the app with ?maps) ═══ */
// Every redrawn mission map next to the page it came from, to check them by eye.
function MapCompare() {
  const list = [];
  MISSION_PACKS.forEach(p => {
    const where = {};
    p.missions.forEach(m => m.maps.forEach(id => { (where[id] = where[id] || []).push(missionLabel(m) + ": " + m.name); }));
    (p.maps || []).forEach(id => { where[id] = where[id] || ["Pack maps"]; });
    Object.keys(where).forEach(id => list.push({ id, pack: p.name, used: where[id] }));
  });
  const svgs = useMapSvgs(list.map(x => x.id), true);
  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: "0 auto", color: "var(--text)" }}>
      <h1 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, marginBottom: 4 }}>Mission maps: new diagram and original page</h1>
      <p style={{ ...mu, marginBottom: 16 }}>{list.length} map pages. <a href="./" style={{ color: "var(--accent)" }}>Back to the app</a></p>
      {list.map((x, i) => (
        <div key={x.id} style={{ ...cd, padding: 12 }}>
          <div style={{ ...h3, color: "var(--accent)", marginBottom: 2 }}>{x.pack}</div>
          <div style={{ ...mu, marginBottom: 8 }}>{x.used.join(" · ")} <span style={{ color: "var(--dim)" }}>({x.id})</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, alignItems: "start" }}>
            {svgs[i] ? <div className="km-tile" dangerouslySetInnerHTML={{ __html: svgs[i] }} /> : <div style={mu}>{svgs[i] === false ? "No diagram for this page." : "Loading..."}</div>}
            <img src={"maps/" + x.id + ".jpg"} alt="Original map page" loading="lazy" style={{ width: "100%", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══ RENDER ═══
const root = ReactDOM.createRoot(document.getElementById('root'));
// The self-test saves the player's data and clears it before the app starts, so the test begins from a clean slate.
// A test that was cut short left the player's data in the backup: a new test starts from that copy, and opening the
// app normally puts it back.
const cutShort = selfTestBackup();
if (/[?&]selftest\b/.test(window.location.search)) { window.__ksSaved = cutShort || snapshotKillSheetStorage(); selfTestBackup(window.__ksSaved); restoreKillSheetStorage({}); }
else if (cutShort) { restoreKillSheetStorage(cutShort); selfTestBackup(null); }
root.render(React.createElement(ErrorBoundary, null, React.createElement(/[?&]maps\b/.test(window.location.search) ? MapCompare : App)));
