/* ═══ BUILDER ═══ */
// Line icons for multiplayer, drawn in the same style as the share/print icons.
const MP_ICON_PATHS = {
  players: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.2c2.6.3 4.5 2.6 4.5 5.8" /></>,
  host: <><circle cx="12" cy="12" r="2" /><path d="M8.5 8.5a5 5 0 0 0 0 7" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M5.6 5.6a9 9 0 0 0 0 12.8" /><path d="M18.4 5.6a9 9 0 0 1 0 12.8" /></>,
  join: <><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /><path d="M9 17l5-5-5-5" /><path d="M14 12H3" /></>,
  waiting: <><path d="M6 2h12" /><path d="M6 22h12" /><path d="M7 2v4l5 6-5 6v4" /><path d="M17 2v4l-5 6 5 6v4" /></>,
  connected: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  error: <><path d="M12 3L2 21h20L12 3z" /><path d="M12 10v4" /><path d="M12 17.5h.01" /></>,
  leave: <><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
};
const mpIconFor = (status) => status === "connected" ? "connected" : status === "hosting" || status === "joining" ? "waiting" : status === "error" ? "error" : "players";
function MPIcon({ name, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0 }} aria-hidden="true">
      {MP_ICON_PATHS[name]}
    </svg>
  );
}

// Team picker groups, keyed off each team's badge. Anything not listed is Xenos.
const IMPERIUM_BADGES = ["ADEPTUS ASTARTES", "SPACE MARINES", "SPACE WOLVES", "IMPERIAL NAVY", "INQUISITION", "ADEPTUS MECHANICUS", "ADEPTA SORORITAS", "ADEPTUS MINISTORUM", "ASTRA MILITARUM", "ADEPTUS ARBITES", "ROGUE TRADER"];
const CHAOS_BADGES = ["CHAOS", "CHAOS SPACE MARINES", "DEATH GUARD"];
const FACTION_GROUPS = ["Imperium", "Chaos", "Xenos"];
const factionGroup = (fc) => IMPERIUM_BADGES.includes(fc.badge) ? "Imperium" : CHAOS_BADGES.includes(fc.badge) ? "Chaos" : "Xenos";
// Extra words the team search matches, so players can find a team by the name they know.
const BADGE_SEARCH_WORDS = {
  "ADEPTUS ASTARTES": "space marines", "SPACE WOLVES": "space marines", "SPACE MARINES": "adeptus astartes",
  "ASTRA MILITARUM": "imperial guard guardsmen", "ADEPTA SORORITAS": "sisters of battle", "ADEPTUS MINISTORUM": "sisters ecclesiarchy",
  "ADEPTUS MECHANICUS": "admech skitarii", "ADEPTUS ARBITES": "arbites enforcers", "INQUISITION": "inquisitor",
  "CHAOS SPACE MARINES": "heretic astartes", "DEATH GUARD": "chaos space marines heretic astartes nurgle", "CHAOS": "heretic traitor",
  "AELDARI": "eldar", "DRUKHARI": "dark eldar aeldari", "T'AU EMPIRE": "tau", "LEAGUES OF VOTANN": "squats kin dwarfs",
  "GENE\u00adSTEALER CULTS": "genestealer cults tyranids", "TYRANIDS": "nids",
};
const TEAM_SEARCH_WORDS = { gellerpox: "nurgle", goremongers: "khorne", warpcoven: "thousand sons tzeentch", voiddancers: "harlequins", blooded: "traitor guard" };
const searchNorm = (t) => t.toLowerCase().replace(/\u00ad/g, "").replace(/[^a-z0-9 ]/g, "");
const factionSearchText = (fc) => searchNorm([fc.name, fc.badge, factionGroup(fc), BADGE_SEARCH_WORDS[fc.badge] || "", TEAM_SEARCH_WORDS[fc.id] || ""].join(" "));

// Builder score bar: sticky under the pinned tabs (App measures them into --pinned-h; 0 while they're hidden). BAR_H offsets the other sticky panels.
const BAR_H = 66;
function Stepper({ label, value, color, onMinus, onPlus, compact, term }) {
  const btn = { width: 34, height: 34, border: "1px solid var(--line)", borderRadius: 6, background: "var(--card)", cursor: "pointer", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 4 : 6, flexShrink: 0 }}>
      {label && (term ? <Term k={term} style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</Term>
        : <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>)}
      <button className="compact-btn" onClick={onMinus} aria-label={"Lower " + (label || "")} style={{ ...btn, color: "#E0664A" }}>{"−"}</button>
      <span style={{ fontSize: "24px", fontWeight: 700, color, fontFamily: "'Rajdhani', sans-serif", minWidth: 22, textAlign: "center" }}>{value}</span>
      <button className="compact-btn" onClick={onPlus} aria-label={"Raise " + (label || "")} style={{ ...btn, color: "#5A9C3A" }}>+</button>
    </div>
  );
}

// Mission scoring checklist, for missions whose data has `scoring` lines (see S() in tools/missions/_lib.py).
// score: { "<turning point | any | end>|<line key>": { you, opp } }. Each tick or count adds that line's VP.
const missionScoreVp = (defs, score, side) => !defs ? 0 : Object.keys(score).reduce((sum, k) => {
  const d = defs.find(x => x.key === k.split("|")[1]);
  return sum + (d ? (score[k][side] || 0) * d.vp : 0);
}, 0);

function MissionScoring({ mission, numTPs, tp, score, setScore }) {
  const [at, setAt] = useState(tp);
  React.useEffect(() => { setAt(tp); }, [tp]);
  const defs = mission.scoring;
  const sides = [["you", "You", "#5A9C3A"], ["opp", mission.mode === "Co-op" ? "NPOs" : "Opp", "#E0664A"]];
  const slot = (d) => d.when === "tp" ? at : d.when;
  const get = (d, side) => (score[slot(d) + "|" + d.key] || {})[side] || 0;
  const put = (d, side, n) => {
    const k = slot(d) + "|" + d.key;
    setScore(sc => ({ ...sc, [k]: { ...(sc[k] || {}), [side]: Math.max(0, Math.min(n, d.most || 9)) } }));
  };
  const small = { width: 32, height: 32, border: "1px solid var(--line)", borderRadius: 6, background: "var(--card)", cursor: "pointer", fontSize: 17, fontWeight: 700, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" };
  const control = (d, [side, , color]) => {
    if (d.side !== "both" && d.side !== side) return <span key={side} style={{ width: 96, textAlign: "center", color: "var(--line)" }}>{"–"}</span>;
    const n = get(d, side);
    const off = d.when === "tp" && at < (d.start || 1);
    if (d.most === 1) return (
      <span key={side} style={{ width: 96, display: "flex", justifyContent: "center" }}>
        <button className="compact-btn" disabled={off} onClick={() => put(d, side, n ? 0 : 1)} aria-pressed={!!n} aria-label={(side === "you" ? "You: " : "Opponent: ") + d.text}
          style={{ ...small, width: 40, height: 34, border: "1.5px solid " + (n ? color : "var(--line)"), background: n ? al(color, "22") : "transparent", color, opacity: off ? 0.35 : 1, cursor: off ? "default" : "pointer" }}>{n ? <Icon name="check" size={16} /> : ""}</button>
      </span>
    );
    return (
      <span key={side} style={{ width: 96, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, opacity: off ? 0.35 : 1 }}>
        <button className="compact-btn" disabled={off || !n} onClick={() => put(d, side, n - 1)} aria-label={"One fewer: " + d.text} style={{ ...small, color: "var(--muted)" }}>{"−"}</button>
        <span style={{ minWidth: 18, textAlign: "center", fontSize: 18, fontWeight: 700, color: n ? color : "var(--dim)", fontFamily: "'Rajdhani', sans-serif" }}>{n}</span>
        <button className="compact-btn" disabled={off || n >= (d.most || 9)} onClick={() => put(d, side, n + 1)} aria-label={"One more: " + d.text} style={{ ...small, color }}>+</button>
      </span>
    );
  };
  const groups = [["tp", "Turning point " + at], ["any", "When it happens"], ["end", "At the end of the battle"]].filter(([w]) => defs.some(d => d.when === w));
  const head = { fontSize: 11, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" };
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
        <span style={{ ...head, color: "var(--accent)", flex: 1 }}>Mission scoring</span>
        {defs.some(d => d.when === "tp") && Array.from({ length: numTPs }, (_, i) => i + 1).map(t => (
          <button key={t} className="compact-btn" onClick={() => setAt(t)} aria-label={"Turning point " + t} aria-pressed={at === t}
            style={{ ...small, width: 30, height: 30, fontSize: 14, border: "1.5px solid " + (at === t ? "var(--gold)" : "var(--line)"), background: at === t ? "color-mix(in srgb, var(--gold) 13%, transparent)" : "var(--card)", color: at === t ? "var(--gold)" : "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 0 4px" }}>
        <span style={{ flex: 1 }} />
        {sides.map(([side, name, color]) => <span key={side} style={{ ...head, width: 96, textAlign: "center", color }}>{name}</span>)}
      </div>
      {groups.map(([w, title]) => (
        <div key={w} style={{ marginBottom: 6 }}>
          <div style={{ ...head, color: "var(--muted)", fontSize: 10, margin: "2px 0 4px" }}>{title}</div>
          {defs.filter(d => d.when === w).map(d => (
            <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderTop: "1px solid var(--raised)" }}>
              <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--text2)", lineHeight: 1.35 }}>
                {d.text} <span style={{ color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}>+{d.vp}VP{d.most === 1 ? "" : " each"}</span>
                {d.when === "tp" && d.most > 1 && <span style={{ ...mu, fontSize: 11 }}> (up to {d.most} a turning point)</span>}
                {d.when === "tp" && at < (d.start || 1) && <div style={{ ...mu, fontSize: 11 }}>Scores from turning point {d.start}.</div>}
              </div>
              {sides.map(sd => control(d, sd))}
            </div>
          ))}
        </div>
      ))}
      {mission.scoringNote && <div style={{ ...mu, fontSize: 12 }}>{mission.scoringNote}</div>}
    </div>
  );
}

// Builder: step-by-step checklist for the current turning point.
const STRATEGY_HINT = /strategic gambit|strategy phase|ready step|initiative step|initiative roll/i;
function TurnGuide({ tp, numTPs, setTp, hasInitiative, onInitiative, cp, f, roster, getWounds, activated, orders, counteracted, setCounteracted, checks, setChecks, onEndGame }) {
  const [open, setOpen] = useLocalStorage("guideOpen", false);
  const { feat } = React.useContext(FeatureCtx);
  React.useEffect(() => { if (feat.guide) setOpen(true); }, [tp, feat.guide]);
  const alive = roster.filter(op => getWounds(op.id, op.wounds) > 0);
  const expended = alive.filter(op => activated[op.id]);
  const engaged = alive.filter(op => orders[op.id] === "engage");
  const canCounter = expended.filter(op => orders[op.id] === "engage");
  const firefight = expended.length > 0 || ["f1", "f2", "f3", "end"].some(k => checks[k]);
  const toggle = (k) => setChecks({ ...checks, [k]: !checks[k] });
  const seen = new Set();
  const teamHints = [
    ...(f.factionRules || []).filter(r => STRATEGY_HINT.test(r.desc)).map(r => ({ name: r.name, desc: r.desc })),
    ...roster.flatMap(op => op.abilities.filter(a => STRATEGY_HINT.test(a)).map(a => ({ name: a.split(":")[0], desc: a.split(":").slice(1).join(":").trim() }))),
  ].filter(h => h.name && h.name.length < 60 && !seen.has(h.name) && seen.add(h.name));
  // Each chip opens its ploy or rule text as a tip.
  const chip = (item, color, kind) => (
    <RuleTip key={item.name} term={item.name + (kind ? " (" + kind + ")" : "")} text={item.desc} tkey={"team:" + item.name} refs={teamRefs(f)} style={{ fontWeight: 400 }}>
      <span style={{ display: "inline-block", fontSize: 12, padding: "2px 8px", borderRadius: 4, background: al((color || "var(--muted)"), "18"), border: "1px solid " + al((color || "var(--muted)"), "40"), color: color || "var(--text2)", margin: "4px 4px 0 0", textDecoration: feat.labels && feat.tips ? "underline dotted" : "none", textUnderlineOffset: 3 }}>{item.name}</span>
    </RuleTip>
  );
  const Step = ({ id, title, children }) => (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: "1px solid var(--raised)" }}>
      <button onClick={() => toggle(id)} aria-label={checks[id] ? "Mark not done" : "Mark done"} style={{ width: 22, height: 22, flexShrink: 0, marginTop: 1, borderRadius: 4, border: "1.5px solid " + (checks[id] ? "#5A9C3A" : "var(--line)"), background: checks[id] ? "#5A9C3A30" : "transparent", color: "#5A9C3A", cursor: "pointer", padding: 0, fontSize: 12 }}>{checks[id] ? "\u2713" : ""}</button>
      <div style={{ flex: 1, minWidth: 0, opacity: checks[id] ? 0.55 : 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{title}</div>
        <div style={{ ...mu, fontSize: 13 }}>{children}</div>
      </div>
    </div>
  );
  const phaseHead = (text, color) => <div style={{ ...h3, color, margin: "12px 0 2px" }}>{text}</div>;
  return (
    <div style={{ ...cd, padding: 12, marginBottom: 10, borderLeft: "3px solid var(--gold)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
        <Arrow open={open} />
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Turning point guide</span>
        <span style={{ fontSize: 12, color: "var(--gold)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>TP {tp} {"\u00b7"} {firefight ? "Firefight" : "Strategy"}</span>
      </button>
      {open && (
        <div>
          {phaseHead("Strategy phase", "var(--accent)")}
          <Step id="s1" title="Initiative">
            {tp === 1 ? "Follow the mission's setup for who has initiative." : "Roll off. The winner decides who has initiative; on a tie, the player without it decides."}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
              <span style={{ color: hasInitiative ? "var(--accent)" : "var(--blue)", fontWeight: 600 }}>{hasInitiative ? "You have initiative." : "Your opponent has initiative."}</span>
              <button onClick={onInitiative} style={{ ...bs("var(--muted)"), padding: "3px 10px", fontSize: 11 }}>Switch</button>
            </div>
          </Step>
          <Step id="s2" title="Gain CP">
            {tp === 1 ? "Both players gain 1CP." : "The player with initiative gains 1CP; the other gains 2CP."} KillSheet adds yours when the turning point starts. You have {cp}<Term k="CP">CP</Term>.
          </Step>
          <Step id="s3" title="Ready"><Term k="Order">Ready</Term> all operatives. KillSheet sets every card back to Ready when the turning point changes.</Step>
          <Step id="s4" title="Gambits">
            Starting with initiative, take turns using a strategy ploy or passing until both players pass in a row. Each strategy ploy once per turning point.
            <div>{(f.ploys.strategy || []).map(p => chip(p, "var(--accent)", "strategy ploy, 1CP"))}</div>
            {teamHints.length > 0 && <div style={{ marginTop: 6 }}>Your team rules for this phase:<div>{teamHints.map(h => chip(h))}</div></div>}
          </Step>
          {phaseHead("Firefight phase", "#B8341C")}
          <Step id="f1" title="Activate">
            Take turns activating one ready operative, starting with initiative. Pick its <Term k="Order">order</Term>, do actions up to its <Term k="APL">APL</Term>, then tap Ready to mark it Expended.
            <div style={{ marginTop: 4, color: "var(--text2)" }}>{expended.length} of {alive.length} expended {"\u00b7"} {engaged.length} Engage, {alive.length - engaged.length} Conceal</div>
          </Step>
          <Step id="f2" title="Counteract">
            When all your operatives are expended but your opponent still has ready ones, one expended <Term k="Order">Engage</Term> operative can make a free 1AP action (moving no more than 2"). Each operative once per turning point.
            <div>
              {canCounter.length === 0
                ? <div style={{ marginTop: 4 }}>Nobody can counteract yet: it needs an expended operative with an Engage order.</div>
                : canCounter.map(op => (
                  <button key={op.id} onClick={() => setCounteracted({ ...counteracted, [op.id]: !counteracted[op.id] })} style={{ ...bs(counteracted[op.id] ? "var(--muted)" : "var(--accent)"), padding: "3px 10px", fontSize: 11, margin: "4px 4px 0 0", textDecoration: counteracted[op.id] ? "line-through" : "none", textTransform: "none", letterSpacing: "0.02em" }}>{op.name}</button>
                ))}
              {canCounter.length > 0 && <div style={{ fontSize: 12, marginTop: 4 }}>Tap an operative once it has counteracted.</div>}
            </div>
          </Step>
          <Step id="f3" title="Firefight ploys">
            Use these during activations, each once per turning point. Command Re-roll (1CP: re-roll one attack or defense die) can be used any number of times.
            <div>{(f.ploys.firefight || []).map(p => chip(p, "#B8341C", "firefight ploy, 1CP"))}</div>
          </Step>
          <Step id="end" title="End of turning point">
            When every operative on both sides is expended, the turning point ends. Score any <Term k="VP">VP</Term> your mission gives now.
            <div style={{ marginTop: 6 }}>
              {tp < numTPs
                ? <button onClick={() => setTp(tp + 1)} style={{ ...bs("var(--gold)"), padding: "6px 12px", fontSize: 12 }}>Start turning point {tp + 1}</button>
                : <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}><span style={{ color: "var(--gold)" }}>This is the last turning point. The battle ends after it, and the most VP wins.</span>{onEndGame && <button onClick={onEndGame} style={{ ...bs("#5A9C3A"), background: "#5A9C3A20", padding: "6px 12px", fontSize: 12 }}>End game</button>}</span>}
            </div>
          </Step>
        </div>
      )}
    </div>
  );
}

function Builder({ tp, setTp, mp, mpHandlerRef, showMP, setShowMP, tutorialSeen, setTutorialSeen, openTutorial, campaign, setCampaign, onTeamColor, showBattle }) {
  const phone = useIsMobile();
  const compactBar = useIsMobile(1000); // the full score bar needs about 1000px; below that it uses the phone layout
  const tinyBar = useIsMobile(350); // the smallest phones (320px): the phone bar drops its "VP" label and some padding to fit
  const navH = "var(--pinned-h, 54px)"; // height of the pinned tabs and online banner, measured by App
  // Persisted game state
  const [gameConfig, setGameConfig] = useLocalStorage("gameConfig", null);
  const [fid, setFid] = useLocalStorage("fid", null);
  const [roster, setRoster] = useLocalStorage("roster", []);
  const [eq, setEq] = useLocalStorage("eq", {});
  const [uEq, setUEq] = useLocalStorage("uEq", {});
  const [wounds, setWounds] = useLocalStorage("wounds", {});
  const { feat, validate, openFeatures } = React.useContext(FeatureCtx);
  const [rosterLocked, setRosterLocked] = useLocalStorage("rosterLocked", false);
  const barH = rosterLocked ? BAR_H : 0; // the score bar only shows once the game starts
  // On a phone, building starts on the operative list; playing starts on the datacards.
  React.useEffect(() => { setMobilePanel(rosterLocked ? "cards" : "roster"); }, [rosterLocked, fid]);
  const [cardCollapsed, setCardCollapsed] = useLocalStorage("cardCollapsed", {});
  const [usedPloys, setUsedPloys] = useLocalStorage("usedPloys", {});
  const [cp, setCp] = useLocalStorage("cp", 3); // 2 to start + 1 for the first Strategy phase
  const [vpYou, setVpYou] = useLocalStorage("vpYou", 0);
  const [vpByTp, setVpByTp] = useLocalStorage("vpByTp", {}); // each side's VP total at the end of each turning point, for the recap
  // The score as the game goes: the latest totals are kept against the current turning point. vpNow is set further
  // down, once the score is worked out (this hook has to sit above the Builder's early returns).
  const vpNow = React.useRef(null);
  React.useEffect(() => {
    const v = vpNow.current, had = (vpByTp || {})[v && v.tp];
    if (!v || (had && had.you === v.you && had.them === v.them)) return;
    setVpByTp(p => ({ ...(p || {}), [v.tp]: { you: v.you, them: v.them } }));
  });
  const [vpOpp, setVpOpp] = useLocalStorage("vpOpp", 0);
  const [hasInitiative, setHasInitiative] = useLocalStorage("hasInitiative", true);
  const [lastCpTp, setLastCpTp] = useLocalStorage("lastCpTp", 1);
  const [primaryYou, setPrimaryYou] = useLocalStorage("primaryYou", []);
  const [primaryOpp, setPrimaryOpp] = useLocalStorage("primaryOpp", []);
  const [tacOps, setTacOps] = useLocalStorage("tacOps", []);
  const [missionScore, setMissionScore] = useLocalStorage("missionScore", {}); // MissionScoring ticks and counts
  const [oppRoster, setOppRoster] = useLocalStorage("oppRoster", null);
  // Ploys, your datacards and theirs side by side need about 1000px. Narrower (an upright iPad), with their team
  // showing, use the stacked phone layout so the page doesn't scroll sideways.
  const mobile = phone || (compactBar && !!oppRoster);
  const [oppWounds, setOppWounds] = useLocalStorage("oppWounds", {});
  const [oppCollapsed, setOppCollapsed] = useLocalStorage("oppCollapsed", {});
  const [activated, setActivated] = useLocalStorage("activated", {});
  const [npoUnits, setNpoUnits] = useLocalStorage("npoUnits", []);
  const [savedRosters, setSavedRosters] = useLocalStorage("savedRosters", []);
  const [orders, setOrders] = useLocalStorage("orders", {});
  const [battleUses, setBattleUses] = useLocalStorage("battleUses", {});
  const [counteracted, setCounteracted] = useLocalStorage("counteracted", {});
  const [guideChecks, setGuideChecks] = useLocalStorage("guideChecks", {});
  const [carried, setCarried] = useLocalStorage("carried", {});
  const [chapterPrimary, setChapterPrimary] = useLocalStorage("chapterPrimary", "");
  const [chapterSecondary, setChapterSecondary] = useLocalStorage("chapterSecondary", "");
  const [chapterVeteran, setChapterVeteran] = useLocalStorage("chapterVeteran", {});
  const [prevTp, setPrevTp] = useLocalStorage("prevTp", tp);
  // Transient UI state (not persisted)
  const [setupMission, setSetupMission] = useState("");
  const [setupEquip, setSetupEquip] = useState(3);
  const [setupTacOps, setSetupTacOps] = useState(3);
  const [setupTPs, setSetupTPs] = useState(4);
  const [setupKZ, setSetupKZ] = useState("open");
  const [showRules, setShowRules] = useState(false);
  const [mobilePanel, setMobilePanel] = useState("cards");
  const [showScoring, setShowScoring] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [cardsMenu, setCardsMenu] = useState(false); // ⋯ menu on the datacards bar
  const [addingOpp, setAddingOpp] = useState(false); // the "Add enemy roster" screen
  const [importCode, setImportCode] = useState("");
  const [importError, setImportError] = useState("");
  const [setupRef, setSetupRef] = useState({ pack: "", idx: "" });
  const [savedMenu, setSavedMenu] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showUniv, setShowUniv] = useState(false); // universal equipment list, folded while building
  const [peek, setPeek] = useState(null); // team opened inline in the picker
  const [peekRule, setPeekRule] = useState(null);
  const peekScrolled = React.useRef(null);
  const peekRuleScrolled = React.useRef(null);
  const [undo, setUndo] = useState(null);
  const undoTimer = React.useRef(null);
  // Run a big change (reset, switch team, load or delete a roster) and offer Undo for a few seconds.
  const withUndo = (label, run) => {
    const snap = snapshotKillSheetStorage();
    run();
    setUndo({ label, snap });
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), 8000);
  };
  const [gameMenu, setGameMenu] = useState(false);
  // Back up and restore: everything KillSheet stores on this device, as one file.
  const restoreInput = React.useRef(null);
  const [pendingRestore, setPendingRestore] = useState(null);
  const [gameHistory, setGameHistory] = useLocalStorage("gameHistory", []);
  const [endGame, setEndGame] = useState(null); // the End game card: { you, them, opp }
  const [showGames, setShowGames] = useState(false);
  const [openGame, setOpenGame] = useState(null); // the game in history whose recap is showing
  const backUp = () => {
    setLastBackup(Date.now());
    const name = downloadBackup(mobile);
    if (name) showToast("Backup saved as " + name, 4000);
  };
  const readBackup = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const b = JSON.parse(reader.result);
        const keys = b && b.data ? Object.keys(b.data) : [];
        if (b.app !== "KillSheet" || keys.length === 0 || !keys.every(k => k.indexOf(LS_PREFIX) === 0)) throw new Error("not a backup");
        let rosters = 0;
        try { rosters = JSON.parse(b.data[LS_PREFIX + "savedRosters"] || "[]").length; } catch (e) { /* older backup */ }
        setPendingRestore({ data: b.data, savedAt: b.savedAt, rosters });
        window.scrollTo(0, 0);
      } catch (e) {
        showToast("That file isn't a KillSheet backup.", 4000);
      }
    };
    reader.readAsText(file);
  };
  // First visit: start a standard game straight away; settings live in the game menu.
  React.useEffect(() => {
    if (gameConfig) return;
    setGameConfig({ missionName: "", equipSlots: 3, numTacOps: 3, numTPs: 4, killzone: "open", mission: null, auto: true });
    setPrimaryYou(Array(4).fill(0));
    setPrimaryOpp(Array(4).fill(0));
    setTacOps(Array.from({ length: 3 }, () => ({ name: "", checks: [false, false] })));
  }, [gameConfig]);
  const [pickerOpen, setPickerOpen] = useState(true);
  const [pickerGroup, setPickerGroup] = useState(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [importMode, setImportMode] = useState("opponent");
  const [toast, setToast] = useState("");
  const toastTimer = React.useRef(null);
  React.useEffect(() => { if (onTeamColor) onTeamColor(fid && FACTIONS[fid] ? fid : null); }, [fid]); // for Match my team: which team you're using
  useKeepAwake(rosterLocked && feat.awake !== false);
  // Keeping data safe: backup reminders, and the Home Screen note for iPhone Safari (which can clear site data after a while).
  const [lastBackup, setLastBackup] = useLocalStorage("lastBackup", null);
  const [backupNudgeAt, setBackupNudgeAt] = useLocalStorage("backupNudgeAt", null);
  const [homeTipSeen, setHomeTipSeen] = useLocalStorage("homeTipSeen", false);
  const hasData = savedRosters.length > 0 || gameHistory.length > 0;
  React.useEffect(() => {
    if (hasData && navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(() => {});
  }, [hasData]);
  // Fights (melee): the Fight screen's state (see reduceFight). fightRef is the latest copy, for messages that arrive between renders;
  // fightApi holds the handlers, which are defined further down.
  // Both are saved, so a reload (a phone often reloads the page after being locked) brings the screen back with its dice.
  const [fight, setFight] = useLocalStorage("fight", null);
  const fightRef = React.useRef(fight);
  const fightApi = React.useRef(null);
  // Shooting: the Shoot screen's state (see reduceShot), kept the same way.
  const [shot, setShot] = useLocalStorage("shot", null);
  const shotRef = React.useRef(shot);
  const shotApi = React.useRef(null);
  // Back online: send our moves in the shared fight or shot again; the other device skips any it already has.
  React.useEffect(() => {
    if (!mp || mp.status !== "connected") return;
    if (fightApi.current) fightApi.current.resend();
    if (shotApi.current) shotApi.current.resend();
  }, [mp && mp.status]);
  // Battle log: every change to an operative's wounds this game, oldest first.
  // { side: "mine" | "opp" (whose operative), target, max, before, after, how: "dice" | "hand" | "self", by, weapon, tp, t }
  const [battleLog, setBattleLog] = useLocalStorage("battleLog", []);
  // Battle damage on datacards: marks from each hit, by "mine:" / "opp:" + operative id. Cleared with the game.
  const [scars, setScars] = useLocalStorage("scars", {});
  const addScars = (side, opId, kind, n) => setScars(prev => {
    const key = side + ":" + opId, list = [...((prev || {})[key] || [])];
    for (let i = 0; i < n; i++) list.push({ k: kind, x: Math.round(8 + Math.random() * 80), y: Math.round(8 + Math.random() * 30), s: Math.round(20 + Math.random() * 12), r: Math.round(Math.random() * 360) });
    return { ...(prev || {}), [key]: list.slice(-14) };
  });
  const clearScars = (side) => setScars(prev => side ? Object.fromEntries(Object.entries(prev || {}).filter(([k]) => !k.startsWith(side + ":"))) : {});
  const [showLog, setShowLog] = useState(false);
  const [mpVersionNote, setMpVersionNote] = useState(null); // online: the two phones run different versions
  const [hitNotes, setHitNotes] = useState([]); // bubbles from the Log button: hits from the other player online
  const [unreadHits, setUnreadHits] = useState(0); // shown on the Log button until the log is opened
  const [logFocus, setLogFocus] = useState(null); // the hit the log opens at (a bubble's note id)
  // Bring saved datacards up to date with the current team data when the app opens or the team changes.
  // Old imported opponents kept the whole team (oppRoster.faction); they switch to factionId here.
  React.useEffect(() => {
    const mine = fid ? FACTIONS[fid] : null;
    if (mine && roster.length) { const fresh = freshOps(mine, roster); if (JSON.stringify(fresh) !== JSON.stringify(roster)) setRoster(fresh); }
    const theirs = oppRoster ? FACTIONS[oppRoster.factionId || (oppRoster.faction && oppRoster.faction.id)] : null;
    if (theirs) {
      const next = { factionId: theirs.id, operatives: freshOps(theirs, oppRoster.operatives || []), eq: oppRoster.eq || {}, uEq: oppRoster.uEq || {} };
      if (JSON.stringify(next) !== JSON.stringify(oppRoster)) setOppRoster(next);
    }
  }, [fid]);
  // Escape closes whatever is on top: the target screen, the battle log, Play online, then the ⋯ menus.
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (shot && shotApi.current) shotApi.current.escape();
      else if (fight && fightApi.current) fightApi.current.escape();
      else if (showLog) setShowLog(false);
      else if (showMP) setShowMP(false);
      else if (addingOpp) setAddingOpp(false);
      else if (cardsMenu) setCardsMenu(false);
      else if (gameMenu) setGameMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shot, fight, showLog, showMP, addingOpp, cardsMenu, gameMenu]);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // {from: 'me'|'them', text, ts}
  const [chatDraft, setChatDraft] = useState("");
  const sendChat = () => {
    const text = chatDraft.trim();
    if (!text || !mp || mp.status !== "connected") return;
    if (mp.send({ type: "chat", text })) {
      setChatHistory(prev => [...prev, { from: "me", text, ts: Date.now() }].slice(-50));
      setChatDraft("");
    }
  };
  const mpSuppressRef = React.useRef(false); // suppress broadcast while applying remote message
  const handleMpMessage = (msg) => {
    if (!msg || typeof msg !== "object") return;
    // Fights: the other player started one against us, or took an action in the one we share.
    if ((msg.type === "fightStart" || msg.type === "fight" || msg.type === "fightResync") && typeof msg.id === "string") {
      if (fightApi.current) fightApi.current.receive(msg);
      return;
    }
    if ((msg.type === "shootStart" || msg.type === "shot" || msg.type === "shotResync") && typeof msg.id === "string") {
      if (shotApi.current) shotApi.current.receive(msg);
      return;
    }
    // The opponent hit or healed one of our operatives. We own our wounds, so apply it here; the change is
    // broadcast back (ownedDelta), which updates our operative's card on their screen.
    if ((msg.type === "applyRemoteDamage" || msg.type === "applyRemoteHeal") && typeof msg.opId === "string" && typeof msg.amount === "number") {
      const op = roster.find(o => o.id === msg.opId);
      const amount = Math.max(0, Math.floor(msg.amount));
      if (op && amount) {
        const note = "hit-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
        const before = getWounds(op.id, op.wounds), after = clampW(before + (msg.type === "applyRemoteDamage" ? -amount : amount), op.wounds);
        logMine(op, msg.type === "applyRemoteDamage" ? -amount : amount, msg.by ? "dice" : "hand", msg.by ? { by: msg.by, weapon: msg.weapon, note } : { note });
        setOpWounds(op.id, op.wounds, msg.type === "applyRemoteDamage" ? -amount : amount);
        if (msg.type === "applyRemoteDamage") pushHitNote({ id: note, text: msg.by ? msg.by + " hit your " + op.name + (msg.weapon ? " with " + msg.weapon : "") + ": " + amount + " damage" : "Your " + op.name + " took " + amount + " damage", sub: before + " \u2192 " + after + " wounds" + (after <= 0 ? ", incapacitated" : "") + ". Tap to see the log." });
      }
      return;
    }
    mpSuppressRef.current = true;
    try {
      if (msg.type === "snapshot" && msg.payload) {
        const p = msg.payload;
        // Peer's "owned" state becomes our opponent state.
        // Always propagate, even if empty: clears stale opponent data and shows correct faction/color from the moment they pick one.
        if (p.fid !== undefined) {
          if (p.fid === null) {
            setOppRoster(null);
          } else {
            const opF = FACTIONS[p.fid];
            if (opF) setOppRoster({ factionId: p.fid, operatives: freshOps(opF, (p.roster || []).map(o => ({ ...o, equipNote: "" }))), eq: p.eq || {}, uEq: p.uEq || {} });
          }
        }
        if (p.wounds) setOppWounds(p.wounds);
        // Shared state: only the host's snapshot seeds shared values for the guest
        if (p.shared) {
          if (p.shared.tp !== undefined) setTp(p.shared.tp);
          if (p.shared.hasInitiative !== undefined) setHasInitiative(!p.shared.hasInitiative); // mirror: their "I have it" means we don't
          if (p.shared.gameConfig && !p.shared.gameConfig.auto && (!gameConfig || gameConfig.auto)) setGameConfig(p.shared.gameConfig);
        }
        // Different versions on the two phones can make online play disagree: say which one is older. This message
        // replaces "synced", so it's the one left on screen.
        if (p.v && window.KS_VERSION && p.v !== window.KS_VERSION) {
          const theirsNewer = !!(p.built && window.KS_BUILT && p.built > window.KS_BUILT);
          const note = theirsNewer
            ? "Your opponent has a newer KillSheet than you. Tap Update at the top so online play works the same on both phones."
            : "Your opponent's KillSheet is older than yours. Ask them to close and reopen it so online play works the same on both phones.";
          showToast(note, 9000);
          setMpVersionNote(note);
          if (theirsNewer && window.__ksShowUpdate) window.__ksShowUpdate(p.v);
        } else {
          if (p.v) setMpVersionNote(null);
          showToast("Opponent connected & synced");
        }
      } else if (msg.type === "ownedDelta" && msg.payload) {
        const p = msg.payload;
        // Always propagate so live edits appear (adding operatives, swapping weapons, removing operatives, faction changes)
        if (p.fid !== undefined) {
          if (p.fid === null) {
            setOppRoster(null);
          } else {
            const opF = FACTIONS[p.fid];
            if (opF) setOppRoster({ factionId: p.fid, operatives: freshOps(opF, (p.roster || []).map(o => ({ ...o, equipNote: "" }))), eq: p.eq || {}, uEq: p.uEq || {} });
          }
        }
        if (p.wounds) setOppWounds(p.wounds);
      } else if (msg.type === "shared" && msg.payload) {
        const p = msg.payload;
        if (p.tp !== undefined) setTp(p.tp);
        if (p.hasInitiative !== undefined) setHasInitiative(!p.hasInitiative);
      } else if (msg.type === "chat" && msg.text) {
        showToast("Opponent: " + msg.text);
        setChatHistory(prev => [...prev, { from: "them", text: String(msg.text).slice(0, 500), ts: Date.now() }].slice(-50));
      }
    } finally {
      // Release on next tick so the state-change useEffect doesn't re-broadcast
      setTimeout(() => { mpSuppressRef.current = false; }, 50);
    }
  };
  // Register our message handler with the App-level multiplayer hook
  useEffect(() => {
    if (mpHandlerRef) mpHandlerRef.current = handleMpMessage;
  });

  // ── Multiplayer broadcasting ── (must be before any early return to satisfy Rules of Hooks)
  // Broadcast our owned state when it changes
  useEffect(() => {
    if (mp.status !== "connected" || mpSuppressRef.current) return;
    mp.send({ type: "ownedDelta", payload: { fid, roster, wounds, eq, uEq } });
  }, [fid, roster, wounds, eq, uEq, mp.status]);
  // Broadcast shared state when it changes
  useEffect(() => {
    if (mp.status !== "connected" || mpSuppressRef.current) return;
    mp.send({ type: "shared", payload: { tp, hasInitiative } });
  }, [tp, hasInitiative, mp.status]);
  // On host's first connect, send an initial snapshot including shared seed
  useEffect(() => {
    if (mp.status === "connected" && mp.role === "host") {
      mp.send({ type: "snapshot", payload: { fid, roster, wounds, eq, uEq, shared: { tp, hasInitiative, gameConfig }, v: window.KS_VERSION || null, built: window.KS_BUILT || null } });
    } else if (mp.status === "connected" && mp.role === "guest") {
      mp.send({ type: "snapshot", payload: { fid, roster, wounds, eq, uEq, v: window.KS_VERSION || null, built: window.KS_BUILT || null } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mp.status, mp.role]);

  // Config helpers
  const gc = gameConfig || { missionName: "", equipSlots: 3, numTacOps: 3, numTPs: 4, killzone: "open" };
  const killzoneNames = { open: "Open Play", volkus: "Volkus", gallowdark: "Gallowdark", tomb_world: "Tomb World", bheta_decima: "Bheta-Decima" };

  const confirmSetup = () => {
    const mission = feat.missions && setupRef.pack && setupRef.idx !== "" ? { pack: setupRef.pack, idx: Number(setupRef.idx) } : null;
    const cfg = { missionName: setupMission, equipSlots: setupEquip, numTacOps: setupTacOps, numTPs: setupTPs, killzone: setupKZ, mission };
    setGameConfig(cfg);
    setShowSetup(false);
    setNpoUnits([]);
    setOrders({}); setBattleUses({}); setCounteracted({}); setGuideChecks({}); setMissionScore({});
    setPrimaryYou(Array(cfg.numTPs).fill(0));
    setPrimaryOpp(Array(cfg.numTPs).fill(0));
    setTacOps(Array.from({ length: cfg.numTacOps }, () => ({ name: "", checks: [false, false] })));
  };

  // TP change: reset ploys, gain CP only on forward advancement
  if (prevTp !== tp) {
    setPrevTp(tp);
    setCounteracted({});
    setGuideChecks({});
    setUsedPloys({});
    setActivated({});
    if (tp > lastCpTp) {
      const cpGain = tp === 1 ? 1 : (hasInitiative ? 1 : 2);
      setCp(prev => prev + cpGain);
      setLastCpTp(tp);
    }
  }

  // Game settings screen (opened from the game menu)
  if (showSetup) {
    const InputRow = ({ label, children }) => (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--raised)" }}>
        <div style={{ fontSize: 11, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{label}</div>
        <div>{children}</div>
      </div>
    );

    const NumPicker = ({ value, onChange, min, max }) => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 24, height: 24, border: "1px solid var(--line)", borderRadius: 2, background: "var(--raised)", color: "#E0664A", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>{"\u2212"}</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", minWidth: 24, textAlign: "center" }}>{value}</div>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 24, height: 24, border: "1px solid var(--line)", borderRadius: 2, background: "var(--raised)", color: "#5A9C3A", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>+</button>
      </div>
    );

    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Game settings</div>
          <p style={{ ...mu, marginTop: 4 }}>Pick a mission, or set equipment, tac ops and turning points for your own game.</p>
        </div>

        <div style={{ ...cd, padding: 14 }}>
          <div style={{ ...h3, color: "var(--accent)" }}>GAME PARAMETERS</div>
          <div style={dv} />

          {feat.missions && <InputRow label="Mission pack">
            <select value={setupRef.pack} onChange={(e) => { setSetupRef({ pack: e.target.value, idx: "" }); if (!e.target.value) setSetupMission(""); }} style={{ background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "4px 8px", fontFamily: "'Segoe UI', sans-serif", outline: "none", maxWidth: 190 }}>
              <option value="">None / custom</option>
              {MISSION_PACKS.filter(mp => mp.missions.length > 0).map(mp => <option key={mp.id} value={mp.id}>{mp.name}</option>)}
            </select>
          </InputRow>}

          {feat.missions && setupRef.pack && (
            <InputRow label="Mission">
              <select value={setupRef.idx} onChange={(e) => {
                const idx = e.target.value;
                setSetupRef({ pack: setupRef.pack, idx });
                if (idx === "") return;
                const mp = MISSION_PACKS.find(x => x.id === setupRef.pack);
                const m = mp.missions[Number(idx)];
                const standalone = m.num === "AO" || m.num === "MAPS";
                setSetupMission(standalone ? mp.name + " (" + m.name + ")" : m.name);
                setSetupKZ(m.kz || mp.kz || "open");
                setSetupTPs(m.tps || 4);
                if (!standalone) { setSetupEquip(m.equip || 4); setSetupTacOps(m.tacOps || 0); }
              }} style={{ background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "4px 8px", fontFamily: "'Segoe UI', sans-serif", outline: "none", maxWidth: 190 }}>
                <option value="">Pick a mission</option>
                {MISSION_PACKS.find(x => x.id === setupRef.pack).missions.map((m, i) => <option key={i} value={i}>{(typeof m.num === "number" ? m.num + ". " : "") + m.name + " (" + m.mode + ")"}</option>)}
              </select>
            </InputRow>
          )}

          <InputRow label="Mission Name">
            <input type="text" value={setupMission} onChange={(e) => setSetupMission(e.target.value)} placeholder="e.g. Loot & Salvage" style={{ background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "4px 8px", width: mobile ? 140 : 180, fontFamily: "'Segoe UI', sans-serif", outline: "none" }} />
          </InputRow>

          <InputRow label="Equipment Slots">
            <NumPicker value={setupEquip} onChange={setSetupEquip} min={0} max={6} />
          </InputRow>

          {feat.scoring && <InputRow label="Tac Ops">
            <NumPicker value={setupTacOps} onChange={setSetupTacOps} min={0} max={6} />
          </InputRow>}

          <InputRow label="Turning Points">
            <NumPicker value={setupTPs} onChange={setSetupTPs} min={1} max={6} />
          </InputRow>

          <InputRow label="Killzone">
            <select value={setupKZ} onChange={(e) => setSetupKZ(e.target.value)} style={{ background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "4px 8px", fontFamily: "'Segoe UI', sans-serif", outline: "none" }}>
              <option value="open">Open Play</option>
              <option value="volkus">Volkus</option>
              <option value="gallowdark">Gallowdark</option>
              <option value="tomb_world">Tomb World</option>
              <option value="bheta_decima">Bheta-Decima</option>
            </select>
          </InputRow>
        </div>

        <div style={{ ...cd, padding: 12, background: "var(--raised)", marginTop: 4 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>Standard game:</span> 3 equipment slots, {feat.scoring ? "3 Tac Ops, " : ""}4 turning points. Adjust for custom missions or narrative play.
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {(() => { const changed = setupRef.pack !== "" || setupMission !== "" || setupEquip !== 3 || setupTacOps !== 3 || setupTPs !== 4 || setupKZ !== "open"; return (
          <button onClick={() => { setSetupRef({ pack: "", idx: "" }); setSetupMission(""); setSetupEquip(3); setSetupTacOps(3); setSetupTPs(4); setSetupKZ("open"); }} style={{ ...bs(changed ? "var(--accent)" : "var(--muted)"), flex: 1, padding: "10px 0", fontSize: 11, background: changed ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent" }}>Reset to Defaults</button>
          ); })()}
          <button onClick={confirmSetup} style={{ ...bs("var(--accent)"), flex: 2, padding: "10px 0", fontSize: 12, fontWeight: 700, background: "color-mix(in srgb, var(--accent) 7%, transparent)", letterSpacing: "0.08em" }}>
            Use these settings
          </button>
        </div>
        <FeatureHint k="missions" text="Optional extra: mission packs add free missions with their own maps and rules." style={{ textAlign: "center", marginTop: 10 }} />
        <FeatureHint k="scoring" text="Tac ops come with detailed scoring, an optional extra." style={{ textAlign: "center", marginTop: 4 }} />
        <div style={{ ...mu, fontSize: 13, textAlign: "center", marginTop: 10 }}>Roster validation, mission packs and the other switches are in <button className="link-btn" onClick={openFeatures} style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Settings</button>.</div>
        {gameConfig && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button onClick={() => setShowSetup(false)} style={{ ...bs("var(--muted)"), padding: "8px 16px", fontSize: 12 }}>Cancel</button>
          </div>
        )}
        {(fid || (roster && roster.length > 0)) && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => {
              if (confirm("Clear the current game? This clears your roster, team, equipment, wounds, CP, VP and game state. Your saved rosters, game history and Settings are kept. This can't be undone.")) {
                clearKillSheetStorage();
                if (typeof window !== "undefined") window.location.reload();
              }
            }} style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 11, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em", cursor: "pointer", textDecoration: "underline", padding: "4px 8px" }}>
              Clear current game data
            </button>
          </div>
        )}
      </div>
    );
  }
  const f = fid ? FACTIONS[fid] : null;

  // Toggle initiative: if we already gained CP for this TP (TP > 1), adjust difference
  const handleInitiativeToggle = () => {
    const newInit = !hasInitiative;
    if (tp > 1 && tp <= lastCpTp) {
      setCp(prev => newInit ? Math.max(0, prev - 1) : prev + 1);
    }
    setHasInitiative(newInit);
  };

  // Toggle ploy: block if no CP available
  const togglePloy = (type, idx) => {
    const key = type + "-" + idx;
    const wasUsed = usedPloys[key] || false;
    if (!wasUsed && cp <= 0) return;
    setUsedPloys(prev => ({ ...prev, [key]: !wasUsed }));
    setCp(prev => wasUsed ? prev + 1 : prev - 1);
  };
  const isPloyUsed = (type, idx) => usedPloys[type + "-" + idx] || false;

  // Scoring helpers
  const cyclePrimary = (arr, setter, tpIdx) => {
    const newArr = [...arr];
    const oldVal = newArr[tpIdx];
    const newVal = oldVal >= 2 ? 0 : oldVal + 1;
    newArr[tpIdx] = newVal;
    setter(newArr);
    return newVal - oldVal; // VP delta
  };
  const toggleTacOp = (opIdx, checkIdx) => {
    const newOps = tacOps.map((t, i) => i === opIdx ? { ...t, checks: t.checks.map((c, j) => j === checkIdx ? !c : c) } : t);
    const wasChecked = tacOps[opIdx].checks[checkIdx];
    setTacOps(newOps);
    return wasChecked ? -1 : 1; // VP delta
  };
  const setTacOpName = (opIdx, name) => {
    setTacOps(tacOps.map((t, i) => i === opIdx ? { ...t, name } : t));
  };
  // A mission with its own scoring lines replaces the primary-op rows.
  const activeMission = feat.missions ? gc.mission : null;
  const scoreMission = activeMission ? (MISSION_PACKS.find(p => p.id === gc.mission.pack) || { missions: [] }).missions[gc.mission.idx] : null;
  const scoreDefs = (scoreMission && scoreMission.scoring) || null;
  const detailScoring = !!scoreDefs || feat.scoring; // a VP-scored mission brings its own checklist
  const primarySumYou = scoreDefs ? missionScoreVp(scoreDefs, missionScore, "you") : primaryYou.reduce((s, v) => s + v, 0);
  const primarySumOpp = scoreDefs ? missionScoreVp(scoreDefs, missionScore, "opp") : primaryOpp.reduce((s, v) => s + v, 0);
  const tacSum = tacOps.reduce((s, t) => s + t.checks.filter(Boolean).length, 0);
  const computedVpYou = primarySumYou + tacSum;
  // Game history: one record per finished game (kept by "Clear current game data" and in backups).
  const resetGame = () => { setVpByTp({}); setBattleLog([]); clearScars(); setWounds({}); setCp(3); setVpYou(0); setVpOpp(0); setUsedPloys({}); setActivated({}); setHasInitiative(true); setLastCpTp(1); setTp(1); setPrimaryYou(Array(gc.numTPs).fill(0)); setPrimaryOpp(Array(gc.numTPs).fill(0)); setTacOps(Array.from({ length: gc.numTacOps }, () => ({ name: "", checks: [false, false] }))); setOppWounds({}); setNpoUnits([]); setOrders({}); setBattleUses({}); setCounteracted({}); setGuideChecks({}); setMissionScore({}); };
  const openEndGame = () => {
    setEndGame({ you: vpYou + computedVpYou, them: vpOpp + computedVpOpp, opp: oppF ? oppF.id : "" });
    window.scrollTo(0, 0);
  };
  const saveGame = () => {
    const e = endGame;
    const oppF = e.opp && FACTIONS[e.opp];
    const rec = {
      id: Date.now(), date: new Date().toISOString(), f: fid, team: f.name,
      opp: oppF ? oppF.name : "", oppId: oppF ? e.opp : "",
      mission: gc.mission ? gc.missionName : (gc.missionName || "Standard game"),
      you: e.you, them: e.them, result: e.you > e.them ? "win" : e.you < e.them ? "loss" : "draw",
      survivors: roster.filter(o => getWounds(o.id, o.wounds) > 0).length, size: roster.length,
      recap: gameRecap(battleLog, vpByTp),
    };
    if (campaign && campaign.phase === "battle") { rec.campaign = true; setCampaign(cc => cteBattle(cc, rec.result, e.incap || 0)); }
    setGameHistory(h => [rec, ...h]);
    setEndGame(null);
    resetGame();
    showToast("Game saved to your history");
  };
  // Discard: end without recording a result, clear the game, and go back to picking a team (Undo puts it all back).
  const discardGame = () => withUndo("Game discarded", () => {
    setEndGame(null);
    resetGame();
    setFight(null); fightRef.current = null; setShot(null); shotRef.current = null;
    setRosterLocked(false);
    setPickerGroup(f ? factionGroup(f) : null); setPickerSearch(""); setPickerOpen(true);
    window.scrollTo(0, 0);
  });
  const computedVpOpp = primarySumOpp;
  vpNow.current = rosterLocked ? { tp, you: vpYou + computedVpYou, them: vpOpp + computedVpOpp } : null;

  const toggleEq = (id) => {
    if (rosterLocked) return;
    setEq(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id] && validate) {
        // Check if adding would exceed limit
        const count = Object.keys(next).filter(k => next[k]).length +
          (uEq["frag_gren"] || uEq["krak_gren"] ? 1 : 0) +
          (uEq["smoke_gren"] || uEq["stun_gren"] ? 1 : 0) +
          Object.keys(uEq).filter(k => uEq[k] && !["frag_gren","krak_gren","smoke_gren","stun_gren"].includes(k)).length;
        if (count > gc.equipSlots) return prev;
      }
      return next;
    });
  };
  const toggleUEq = (id) => {
    if (rosterLocked) return;
    setUEq(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id] && validate) {
        const isExplosive = id === "frag_gren" || id === "krak_gren";
        const isUtility = id === "smoke_gren" || id === "stun_gren";
        const hasExistingExplosive = prev["frag_gren"] || prev["krak_gren"];
        const hasExistingUtility = prev["smoke_gren"] || prev["stun_gren"];
        const wouldShareSlot = (isExplosive && hasExistingExplosive) || (isUtility && hasExistingUtility);
        if (!wouldShareSlot) {
          const factionCount = Object.keys(eq).filter(k => eq[k]).length;
          const newHasExp = next["frag_gren"] || next["krak_gren"];
          const newHasUtil = next["smoke_gren"] || next["stun_gren"];
          const newOther = Object.keys(next).filter(k => next[k] && !["frag_gren","krak_gren","smoke_gren","stun_gren"].includes(k)).length;
          const total = factionCount + (newHasExp ? 1 : 0) + (newHasUtil ? 1 : 0) + newOther;
          if (total > gc.equipSlots) return prev;
        }
      }
      return next;
    });
  };

  const getEquipSlotCount = () => {
    const factionEqCount = Object.keys(eq).filter(k => eq[k]).length;
    const hasExplosiveGrenades = uEq["frag_gren"] || uEq["krak_gren"];
    const hasUtilityGrenades = uEq["smoke_gren"] || uEq["stun_gren"];
    const otherUnivCount = Object.keys(uEq).filter(k => uEq[k] && !["frag_gren", "krak_gren", "smoke_gren", "stun_gren"].includes(k)).length;
    return factionEqCount + (hasExplosiveGrenades ? 1 : 0) + (hasUtilityGrenades ? 1 : 0) + otherUnivCount;
  };

  const canAddEquip = (type, id) => {
    if (!validate) return true;
    // Already selected? Can always toggle off
    if (type === "faction" && eq[id]) return true;
    if (type === "universal" && uEq[id]) return true;
    // Check slot sharing for grenades
    if (type === "universal") {
      const isExplosive = id === "frag_gren" || id === "krak_gren";
      const isUtility = id === "smoke_gren" || id === "stun_gren";
      const hasExistingExplosive = uEq["frag_gren"] || uEq["krak_gren"];
      const hasExistingUtility = uEq["smoke_gren"] || uEq["stun_gren"];
      if ((isExplosive && hasExistingExplosive) || (isUtility && hasExistingUtility)) return true;
    }
    return getEquipSlotCount() < gc.equipSlots;
  };
  const selectFaction = (id) => { setBattleLog([]); clearScars("mine"); setFid(id); setRoster([]); setEq({}); setUEq({}); setWounds({}); setCardCollapsed({}); setUsedPloys({}); setCp(3); setVpYou(0); setVpOpp(0); setHasInitiative(true); setLastCpTp(1); setTp(1); setPrimaryYou(Array(gc.numTPs).fill(0)); setPrimaryOpp(Array(gc.numTPs).fill(0)); setTacOps(Array.from({ length: gc.numTacOps }, () => ({ name: "", checks: [false, false] }))); setOppRoster(null); setOppWounds({}); setShowImport(false); setActivated({}); setChapterPrimary(""); setChapterSecondary(""); setChapterVeteran({}); setRosterLocked(false); setNpoUnits([]); setCarried({}); setOrders({}); setBattleUses({}); setCounteracted({}); setGuideChecks({}); setMissionScore({}); };

  const getWounds = (opId, maxW) => wounds[opId] !== undefined ? wounds[opId] : maxW;
  const logWounds = (e) => {
    if (e.before === e.after) return;
    setBattleLog(prev => {
      const list = prev || [];
      const last = list[list.length - 1];
      // Quick taps on one operative's wound buttons make one line.
      if (e.how === "hand" && last && last.how === "hand" && last.side === e.side && last.target === e.target && last.tp === tp && Date.now() - last.t < 15000 && Math.sign(e.after - e.before) === Math.sign(last.after - last.before)) {
        return [...list.slice(0, -1), { ...last, after: Math.max(0, Math.min(last.max, last.after + e.after - e.before)), t: Date.now() }];
      }
      return [...list, { ...e, tp, t: Date.now() }].slice(-200);
    });
  };
  const clampW = (v, max) => Math.max(0, Math.min(max, v));
  const logMine = (op, delta, how, extra) => { const cw = getWounds(op.id, op.wounds); logWounds({ side: "mine", target: op.name, max: op.wounds, before: cw, after: clampW(cw + delta, op.wounds), how, ...extra }); };
  const setOpWounds = (opId, maxW, delta) => {
    setWounds(prev => ({ ...prev, [opId]: Math.max(0, Math.min(maxW, (prev[opId] !== undefined ? prev[opId] : maxW) + delta)) }));
  };
  const resetAllWounds = () => setWounds({});
  // Opening a card closes the others, so the list stays short during a game.
  const toggleCardCollapse = (opId) => setCardCollapsed(prev => {
    if (!prev[opId]) return { ...prev, [opId]: true };
    const next = {};
    roster.forEach(op => { next[op.id] = op.id !== opId; });
    return next;
  });
  const collapseAll = () => { const c = {}; roster.forEach(op => { c[op.id] = true; }); setCardCollapsed(c); };
  const expandAll = () => setCardCollapsed({});

  // ── Export/Import ──
  const showToast = (msg, ms = 2500) => {
    setToast(msg);
    clearTimeout(toastTimer.current); // an older message's timer mustn't cut this one short
    toastTimer.current = setTimeout(() => setToast(""), ms);
  };
  // A hit bubble: stays 8 seconds, then fades; three at most, newest on top.
  const pushHitNote = (note) => {
    setHitNotes(prev => [note, ...prev.filter(x => x.id !== note.id)].slice(0, 3));
    setUnreadHits(u => u + 1);
    setTimeout(() => setHitNotes(prev => prev.map(x => x.id === note.id ? { ...x, leaving: true } : x)), 8000);
    setTimeout(() => setHitNotes(prev => prev.filter(x => x.id !== note.id)), 8300);
  };
  const openLog = (focus) => { setLogFocus(focus || null); setShowLog(true); setUnreadHits(0); setHitNotes([]); };

  const exportRoster = () => {
    if (!fid || roster.length === 0) return;
    const data = {
      f: fid,
      o: roster.map(r => baseOf(r)),
      fe: Object.keys(eq).filter(k => eq[k]),
      ue: Object.keys(uEq).filter(k => uEq[k]),
    };
    const code = btoa(JSON.stringify(data));
    navigator.clipboard.writeText(code).then(() => {
      showToast("Roster code copied");
    }).catch(() => {
      prompt("Copy this roster code:", code);
    });
  };

  // Once-per-battle ploys: one box, or a chip per operative for "each operative once per battle".
  const ployUses = (type, i, p) => {
    if (!feat.uses || !isOncePerBattle(p.desc)) return null;
    const base = "ploy|" + type + "-" + i;
    if (/each operative once per battle/i.test(p.desc)) {
      return (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>USED ON:</span>
          {roster.map(op => {
            const k = base + "|" + op.id;
            const on = !!battleUses[k];
            return <button key={op.id} onClick={() => setBattleUses(prev => ({ ...prev, [k]: on ? 0 : 1 }))} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 3, border: "1px solid " + (on ? "#B8341C" : "var(--line)"), background: on ? "#B8341C25" : "transparent", color: on ? "#B8341C" : "var(--muted)", textDecoration: on ? "line-through" : "none", cursor: "pointer" }}>{op.name}</button>;
          })}
        </div>
      );
    }
    return <div style={{ marginTop: 4 }}><UsePips label="Once per battle" used={battleUses[base] || 0} max={1} onSet={(n) => setBattleUses(prev => ({ ...prev, [base]: n }))} /></div>;
  };

  // ── Saved rosters (this device only) ──
  const rosterData = () => ({ f: fid, o: roster.map(r => baseOf(r)), fe: Object.keys(eq).filter(k => eq[k]), ue: Object.keys(uEq).filter(k => uEq[k]), cp: chapterPrimary, cs: chapterSecondary, cv: chapterVeteran, cw: carried });
  const saveRoster = () => {
    if (!fid || roster.length === 0) return;
    const fallback = f.name + " (" + roster.length + ")";
    const typed = prompt("Name this roster:", fallback);
    if (typed == null) return;
    const name = typed.trim() || fallback;
    const entry = { id: Date.now().toString(36), name, savedAt: Date.now(), ...rosterData() };
    const same = savedRosters.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (same) {
      if (!confirm('Replace your saved roster "' + same.name + '"?')) return;
      setSavedRosters(savedRosters.map(r => r.id === same.id ? { ...entry, id: same.id } : r));
    } else {
      setSavedRosters([entry, ...savedRosters]);
    }
    showToast("Saved: " + name);
  };
  const loadSaved = (entry) => {
    const faction = FACTIONS[entry.f];
    if (!faction) { showToast("That team is no longer in the app."); return; }
    withUndo("Loaded " + entry.name, () => {
    selectFaction(entry.f);
    setRoster(makeInstances(faction, entry.o));
    const e = {}; (entry.fe || []).forEach(id => { e[id] = true; }); setEq(e);
    const u = {}; (entry.ue || []).forEach(id => { u[id] = true; }); setUEq(u);
    setChapterPrimary(entry.cp || ""); setChapterSecondary(entry.cs || ""); setChapterVeteran(entry.cv || {}); setCarried(entry.cw || {});
    });
    setPickerOpen(false); setPickerSearch(""); setSavedMenu(null); setPeek(null);
  };
  const renameSaved = (entry) => {
    const typed = prompt("Rename roster:", entry.name);
    if (typed == null || !typed.trim()) return;
    setSavedRosters(savedRosters.map(r => r.id === entry.id ? { ...r, name: typed.trim() } : r));
  };
  const deleteSaved = (entry) => {
    withUndo("Deleted " + entry.name, () => setSavedRosters(savedRosters.filter(r => r.id !== entry.id)));
    setSavedMenu(null);
  };
  const copySavedCode = (entry) => {
    const code = btoa(JSON.stringify({ f: entry.f, o: entry.o, fe: entry.fe, ue: entry.ue }));
    navigator.clipboard.writeText(code).then(() => showToast("Roster code copied")).catch(() => prompt("Copy this roster code:", code));
  };

  const importMyRoster = (code) => {
    try {
      const raw = atob(code.trim());
      const data = JSON.parse(raw);
      const faction = FACTIONS[data.f];
      if (!faction) return "Unknown faction: " + data.f;
      const ops = makeInstances(faction, data.o);
      if (ops.length === 0) return "No valid operatives found.";
      setFid(data.f);
      setRoster(ops);
      const newEq = {};
      (data.fe || []).forEach(id => { newEq[id] = true; });
      setEq(newEq);
      const newUEq = {};
      (data.ue || []).forEach(id => { newUEq[id] = true; });
      setUEq(newUEq);
      setWounds({}); clearScars("mine");
      setCardCollapsed({});
      setActivated({});
      showToast("Roster imported: " + faction.name + " (" + ops.length + " operatives)");
      return null;
    } catch (e) {
      return "Invalid code.";
    }
  };

  const importOpponent = () => {
    setImportError("");
    try {
      const raw = atob(importCode.trim());
      const data = JSON.parse(raw);
      const faction = FACTIONS[data.f];
      if (!faction) { setImportError("Unknown faction: " + data.f); return; }
      const ops = makeInstances(faction, data.o);
      if (ops.length === 0) { setImportError("No valid operatives found."); return; }
      // Build equipment state for opponent
      const oppEq = {};
      (data.fe || []).forEach(id => { oppEq[id] = true; });
      const oppUEq = {};
      (data.ue || []).forEach(id => { oppUEq[id] = true; });
      setOppRoster({ factionId: faction.id, operatives: ops, eq: oppEq, uEq: oppUEq });
      const initCollapsed = {};
      ops.forEach(op => { initCollapsed[op.id] = true; });
      setOppWounds({}); clearScars("opp");
      setOppCollapsed(initCollapsed);
      setShowImport(false);
      setImportCode("");
    } catch (e) {
      setImportError("Invalid code. Check and try again.");
    }
  };

  const getOppWounds = (opId, maxW) => oppWounds[opId] !== undefined ? oppWounds[opId] : maxW;
  const logOpp = (op, delta, how, extra) => { const cw = getOppWounds(op.id, op.wounds); logWounds({ side: "opp", target: op.name, max: op.wounds, before: cw, after: clampW(cw + delta, op.wounds), how, ...extra }); };
  // Imported rosters used to keep the whole faction (oppRoster.faction); online ones only send its id.
  const oppF = oppRoster ? (oppRoster.faction || FACTIONS[oppRoster.factionId]) : null;
  const oppEquip = (op) => oppF ? oppEquipFor(oppF, oppRoster.eq || {}, oppRoster.uEq || {}, op) : { weapons: [], effects: [], ignoreInjured: false };
  const setOppWound = (opId, maxW, delta) => {
    setOppWounds(prev => ({ ...prev, [opId]: Math.max(0, Math.min(maxW, (prev[opId] !== undefined ? prev[opId] : maxW) + delta)) }));
  };

  // ── Fights ──
  // One device runs both sides. Online, each player runs their own side and every action travels as a "fight" message.
  const fightTestSend = () => window.__ksMpTestSend; // the self-test plays the other device
  const fightSend = (msg) => fightTestSend() ? (fightTestSend()(msg), true) : !!(mp && mp.status === "connected" && mp.send(msg));
  const linkUp = () => !!fightTestSend() || !!(mp && mp.status === "connected");
  // Moves in a shared fight or shot are numbered (n) and kept in state.out. If the connection drops they wait there;
  // when it's back, or the other device asks (a gap in the numbers), they're sent again and the other side skips repeats.
  const postAttack = (state, msg) => {
    const m = { ...msg, n: (state.out ? state.out.length : 0) + 1 };
    fightSend(m);
    return { ...state, out: [...(state.out || []), m] };
  };
  const resendAttack = (state) => { if (state && state.wasOnline && state.out) state.out.forEach(m => fightSend(m)); };
  // Applies the other device's numbered move only in order; a gap asks them to send everything again.
  const inOrder = (cur, msg, kind) => {
    if (!msg.n) return true;
    if (msg.n <= (cur.inN || 0)) return false;
    if (msg.n > (cur.inN || 0) + 1) { fightSend({ type: kind + "Resync", id: cur.id }); return false; }
    return true;
  };
  const oppOps = () => (oppRoster && oppRoster.operatives) || [];
  const fightOpInfo = (side, op) => {
    const start = side === "mine" ? getWounds(op.id, op.wounds) : getOppWounds(op.id, op.wounds);
    const eq = side === "mine" ? getEquipForOp(op) : oppEquip(op);
    return { id: op.id, name: op.name, max: op.wounds, start, injured: start > 0 && start < Math.ceil(op.wounds / 2) && !(eq && eq.ignoreInjured) };
  };
  const meleeFor = (side, op) => {
    const eq = side === "mine" ? getEquipForOp(op) : oppEquip(op);
    const pick = side === "mine" && carried[op.id] && carried[op.id].length ? new Set(carried[op.id]) : null;
    return [...op.melee.filter(w => !pick || pick.has(weaponBase(w.name))), ...((eq && eq.weapons) || []).filter(w => w.type === "melee")];
  };
  const fightWeapon = (w) => ({ name: w.name, atk: w.atk, hit: w.hit, dmg: w.dmg, wr: w.wr || "-" });
  const showFight = (f) => { fightRef.current = f; setFight(f); };
  const startFight = (side, op, weapon) => {
    const online = side === "mine" && (!!fightTestSend() || (mp && mp.status === "connected"));
    showFight({ ...newFight("f" + Date.now() + Math.floor(Math.random() * 1000), online, online ? ["atk"] : ["atk", "def"], newFightSide(side, fightOpInfo(side, op), fightWeapon(weapon))), wasOnline: online });
  };
  // A strike's damage goes on the struck operative. Online, each device only changes its own operatives' wounds;
  // if a shared fight was finished on one device, the other side's damage is sent as a normal hit.
  const fightDamage = (prev, next) => {
    ["atk", "def"].forEach(role => {
      const d = next.dmg[role] - prev.dmg[role];
      if (d <= 0) return;
      const s = next[role], by = next[otherRole(role)], extra = { by: by.op.name, weapon: by.weapon.name };
      addScars(s.side, s.op.id, scarKindOf(fxProfile({ ...by.weapon, type: "melee" })), 1);
      if (s.side === "mine") {
        const op = roster.find(o => o.id === s.op.id);
        if (op) { logMine(op, -d, "dice", extra); setOpWounds(op.id, op.wounds, -d); }
      } else {
        const op = oppOps().find(o => o.id === s.op.id);
        if (!op) return;
        logOpp(op, -d, "dice", extra);
        if (!next.wasOnline) setOppWound(op.id, op.wounds, -d);
        else if (!next.online && mp) mp.sendOrQueue({ type: "applyRemoteDamage", opId: op.id, amount: d, ...extra });
      }
    });
  };
  const dispatchFight = (action, remote, n) => {
    const cur = fightRef.current;
    if (!cur) return;
    let next = reduceFight(cur, action);
    if (next === cur) { if (n) showFight({ ...cur, inN: n }); return; }
    next = { ...next, changedAt: Date.now(), ...(n ? { inN: n } : {}) };
    if (!remote && cur.online) {
      next = postAttack(next, action.type === "target"
        ? { type: "fightStart", id: cur.id, atk: { opId: cur.atk.op.id, weapon: cur.atk.weapon }, def: { opId: action.def.op.id } }
        : { type: "fight", id: cur.id, action });
    }
    if (next.stage === "canceled" || next.stage === "takenOver") {
      showFight(null);
      if (remote) showToast(next.stage === "canceled" ? "Your opponent stopped the fight" : "Your opponent finished the fight on their device", 4000);
      return;
    }
    showFight(next);
    fightDamage(cur, next);
  };
  const okDice = (d) => Array.isArray(d) && d.length <= 20 && d.every(v => Number.isInteger(v) && v >= 1 && v <= 6);
  fightApi.current = {
    escape: () => { const f = fightRef.current; if (!f) return; if (f.stage === "done") showFight(null); else dispatchFight({ type: "cancel" }); },
    resend: () => resendAttack(fightRef.current),
    receive: (msg) => {
      const cur = fightRef.current;
      if (msg.type === "fightResync") { if (cur && cur.id === msg.id) resendAttack(cur); return; }
      if (msg.type === "fightStart") {
        if (cur && cur.id === msg.id) return; // sent again after a reconnect
        const atkOp = oppOps().find(o => o.id === (msg.atk && msg.atk.opId)), defOp = roster.find(o => o.id === (msg.def && msg.def.opId));
        if (!atkOp || !defOp || !msg.atk.weapon) return;
        const f = { ...newFight(msg.id, true, ["def"], newFightSide("opp", fightOpInfo("opp", atkOp), fightWeapon(msg.atk.weapon))), wasOnline: true, inN: msg.n || 0 };
        showFight({ ...f, def: newFightSide("mine", fightOpInfo("mine", defOp)), stage: "weapon" });
        if (showBattle) showBattle();
        return;
      }
      const a = msg.action;
      if (!cur || cur.id !== msg.id) { if (!cur || cur.stage === "done") fightSend({ type: "fightResync", id: msg.id }); return; } // we missed the start
      if (!a || typeof a.type !== "string" || !inOrder(cur, msg, "fight")) return;
      // A move we won't apply still counts as received, so the numbers don't look like a gap.
      const skip = () => { if (msg.n) showFight({ ...cur, inN: msg.n }); };
      if (a.role && cur.roles.includes(a.role) && a.type !== "takeover") return skip(); // our own side is only moved from this device
      if ((a.type === "roll" && !okDice(a.dice)) || (a.type === "reroll" && !okDice([a.v]))) return skip();
      if (a.type === "weapon") a.weapon = fightWeapon(a.weapon || {});
      dispatchFight(a, true, msg.n);
    },
  };
  // ── Shooting ──
  const showShot = (x) => { shotRef.current = x; setShot(x); };
  const shotOpInfo = (side, op) => ({ ...fightOpInfo(side, op), save: op.save });
  const startShot = (side, op, weapon) => {
    const online = side === "mine" && (!!fightTestSend() || (mp && mp.status === "connected"));
    showShot(newShot("s" + Date.now() + Math.floor(Math.random() * 1000), online, side === "mine" ? "A" : "B", shotOpInfo(side, op), fightWeapon(weapon)));
  };
  // Damage (or a correction) on one operative. Online, the other device changes its own operatives; if the shared
  // action was finished here, theirs is sent as a normal hit or heal.
  const hitOperative = (side, opId, d, extra, x, how, scar) => {
    if (!d) return;
    if (scar && d > 0) addScars(side, opId, scar, Math.min(4, Math.max(1, Math.round(d / 3))));
    if (side === "mine") {
      const op = roster.find(o => o.id === opId);
      if (op) { logMine(op, -d, how || "dice", extra); setOpWounds(op.id, op.wounds, -d); }
      return;
    }
    const op = oppOps().find(o => o.id === opId);
    if (!op) return;
    logOpp(op, -d, how || "dice", extra);
    if (!x.wasOnline) setOppWound(op.id, op.wounds, -d);
    else if (!x.online && mp) mp.sendOrQueue(d > 0 ? { type: "applyRemoteDamage", opId: op.id, amount: d, ...extra } : { type: "applyRemoteHeal", opId: op.id, amount: -d });
  };
  const shotDamageApply = (prev, next) => {
    const sideOf = (owner) => owner === next.mine ? "mine" : "opp", extra = { by: next.atk.op.name, weapon: next.atk.weapon.name };
    next.targets.forEach((t, i) => {
      const p = prev.targets[i] || { dmg: null, adjust: 0 };
      hitOperative(sideOf(t.owner), t.op.id, (t.dmg || 0) - (p.dmg || 0), extra, next, "dice", scarKindOf(fxProfile(next.atk.weapon))); // the hit
      hitOperative(sideOf(t.owner), t.op.id, (t.adjust || 0) - (p.adjust || 0), {}, next, "hand");  // a correction after it
    });
    const hot = (next.hot ? next.hot.dmg : 0) - (prev.hot ? prev.hot.dmg : 0);
    if (hot) { hitOperative(sideOf("A"), next.atk.op.id, hot, {}, next, "self", "melt"); showToast(next.atk.op.name + " took " + hot + " damage from Hot", 3000); }
  };
  const dispatchShot = (action, remote, n) => {
    const cur = shotRef.current;
    if (!cur) return;
    let next = reduceShot(cur, action);
    if (next === cur) { if (n) showShot({ ...cur, inN: n }); return; }
    next = { ...next, changedAt: Date.now(), ...(n ? { inN: n } : {}) };
    if (!remote && action.type === "roll" && action.who === "d") {
      const t = cur.targets[cur.ti];
      action = { ...action, atk: t.a.dice, arr: t.a.rr, obs: t.obscured };
      next = { ...reduceShot(cur, action), changedAt: Date.now() };
    }
    if (!remote && cur.online) {
      // Picking targets stays on this device until the attack starts; then both devices get the whole card.
      if (action.type === "target" || action.type === "more") {
        if (next.stage === "attack") next = postAttack(next, { type: "shootStart", id: cur.id, atk: { opId: cur.atk.op.id, weapon: cur.atk.weapon }, targets: next.targets.map(t => ({ owner: t.owner, opId: t.op.id })) });
      } else next = postAttack(next, { type: "shot", id: cur.id, action });
    }
    if (next.stage === "canceled" || next.stage === "takenOver") {
      showShot(null);
      if (remote) showToast(next.stage === "canceled" ? "Your opponent canceled the shot" : "Your opponent finished the shot on their device", 4000);
      return;
    }
    showShot(next);
    shotDamageApply(cur, next);
  };
  shotApi.current = {
    escape: () => { const x = shotRef.current; if (!x) return; if (x.stage === "done") showShot(null); else dispatchShot({ type: "cancel" }); },
    resend: () => resendAttack(shotRef.current),
    receive: (msg) => {
      if (msg.type === "shotResync") { if (shotRef.current && shotRef.current.id === msg.id) resendAttack(shotRef.current); return; }
      if (msg.type === "shootStart") {
        if (shotRef.current && shotRef.current.id === msg.id) return; // sent again after a reconnect
        const atkOp = oppOps().find(o => o.id === (msg.atk && msg.atk.opId));
        if (!atkOp || !msg.atk.weapon || !Array.isArray(msg.targets) || !msg.targets.length) return;
        const targets = msg.targets.map(x => {
          const owner = x.owner === "A" ? "A" : "B", side = owner === "B" ? "mine" : "opp";
          const op = (side === "mine" ? roster : oppOps()).find(o => o.id === x.opId);
          return op ? newShotTarget(owner, shotOpInfo(side, op)) : null;
        });
        if (targets.some(x => !x)) return;
        showShot({ ...newShot(msg.id, true, "B", shotOpInfo("opp", atkOp), fightWeapon(msg.atk.weapon)), targets, stage: "attack", inN: msg.n || 0 });
        if (showBattle) showBattle();
        return;
      }
      const a = msg.action, cur = shotRef.current;
      if (!cur || cur.id !== msg.id) { if (!cur || cur.stage === "done") fightSend({ type: "shotResync", id: msg.id }); return; } // we missed the start
      if (!a || typeof a.type !== "string" || !inOrder(cur, msg, "shot")) return;
      const actor = shotActor(cur, a);
      const skip = () => { if (msg.n) showShot({ ...cur, inN: msg.n }); }; // still counts as received
      if (a.type !== "cancel" && a.type !== "takeover" && (!actor || cur.roles.includes(actor))) return skip(); // each device only moves its own side
      if ((a.type === "roll" && !okDice(a.dice)) || ((a.type === "reroll" || a.type === "hot") && !okDice([a.v]))) return skip();
      dispatchShot(a, true, msg.n);
    },
  };
  const takeOverShot = () => {
    const cur = shotRef.current;
    if (!cur) return;
    const sent = postAttack(cur, { type: "shot", id: cur.id, action: { type: "takeover" } }); // reaches them when they're back
    showShot({ ...sent, online: false, roles: ["A", "B"], note: "You're finishing this for both sides.", changedAt: Date.now() });
  };
  const takeOverFight = () => {
    const cur = fightRef.current;
    if (!cur) return;
    const sent = postAttack(cur, { type: "fight", id: cur.id, action: { type: "takeover" } }); // reaches them when they're back
    showFight({ ...sent, online: false, roles: ["atk", "def"], note: "You're finishing this fight for both sides.", changedAt: Date.now() });
  };

  const printRoster = () => {
    const fName = f ? f.name : "KillSheet";
    const fBadge = f ? f.badge : "";
    const mission = gc.missionName || "";
    const fc = f ? f.color : "#333";
    const activeEq = f.equipment.filter(q => eq[q.id]);
    const activeUEq = UNIV_EQUIP.filter(q => uEq[q.id]);

    let html = '<div style="font-family: Rajdhani, sans-serif; padding: 0.15in; font-size: 8px;">';

    // Header
    html += '<div style="text-align:center;margin-bottom:10px;border-bottom:2px solid #333;padding-bottom:6px;">';
    html += '<div style="font-size:8px;letter-spacing:0.2em;color:#888;">KILLSHEET \u2022 TACTICAL SKIRMISH COMPANION</div>';
    html += '<div style="font-size:20px;font-weight:700;color:' + fc + ';margin:2px 0;">' + fName + '</div>';
    html += '<div style="font-size:8px;color:#888;">' + fBadge + (mission ? ' \u2022 ' + mission : '') + ' \u2022 ' + roster.length + ' Operatives \u2022 ' + roster.reduce((s,o)=>s+o.wounds,0) + 'W total</div>';
    html += '</div>';

    // Datacards - 2 column grid
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
    roster.forEach(op => {
      const result = getEquipForOp(op);
      const allR = [...op.ranged, ...result.weapons.filter(w => w.type === "ranged")];
      const allM = [...op.melee, ...result.weapons.filter(w => w.type === "melee")];
      html += '<div style="border:1.5px solid ' + fc + ';border-radius:4px;break-inside:avoid;page-break-inside:avoid;overflow:hidden;">';
      // Header
      html += '<div style="background:' + fc + ';color:white;padding:3px 8px;display:flex;justify-content:space-between;align-items:center;">';
      html += '<div><div style="font-size:11px;font-weight:700;">' + op.name + '</div>';
      html += '<div style="font-size:6px;opacity:0.7;letter-spacing:0.06em;">' + op.kw + '</div></div>';
      html += '<div style="font-size:8px;">' + op.pts + 'mm base</div></div>';
      // Stats
      html += '<div style="display:flex;border-bottom:1px solid #ddd;">';
      [["APL", op.apl], ["MOVE", op.move], ["SAVE", op.save], ["W", op.wounds]].forEach(([label, val]) => {
        html += '<div style="flex:1;text-align:center;padding:3px 1px;border-right:1px solid #eee;">';
        html += '<div style="font-size:13px;font-weight:700;">' + val + '</div>';
        html += '<div style="font-size:6px;color:#888;letter-spacing:0.06em;">' + label + '</div></div>';
      });
      // Wound tracker boxes
      html += '<div style="flex:1.2;text-align:center;padding:3px 2px;">';
      html += '<div style="display:flex;gap:1px;justify-content:center;flex-wrap:wrap;">';
      for (let i = 0; i < op.wounds; i++) {
        html += '<div style="width:6px;height:6px;border:1px solid #aaa;border-radius:1px;' + (i < Math.ceil(op.wounds/2) ? '' : 'background:#fee;') + '"></div>';
      }
      html += '</div><div style="font-size:5px;color:#888;margin-top:1px;">TRACK</div></div>';
      html += '</div>';
      // Weapons
      const weaponSec = (weapons, label, icon) => {
        if (weapons.length === 0) return '';
        let s = '<div style="padding:2px 6px;border-bottom:1px solid #eee;">';
        s += '<div style="font-size:7px;font-weight:700;color:' + fc + ';letter-spacing:0.08em;">' + icon + ' ' + label + '</div>';
        weapons.forEach(w => {
          s += '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:1px 0;">';
          s += '<div style="font-weight:600;font-size:8px;">' + w.name + '</div>';
          s += '<div style="font-size:8px;font-weight:700;color:#333;white-space:nowrap;">' + w.atk + ' \u2022 ' + w.hit + ' \u2022 ' + w.dmg + '</div></div>';
          if (w.wr && w.wr !== "-") s += '<div style="font-size:6px;color:#777;line-height:1.2;margin-bottom:1px;">' + w.wr + '</div>';
        });
        s += '</div>';
        return s;
      };
      html += weaponSec(allR, "RANGED", "\u2316");
      html += weaponSec(allM, "MELEE", "\u2694");
      // Abilities
      if (op.abilities.length > 0) {
        html += '<div style="padding:2px 6px;border-bottom:1px solid #eee;">';
        html += '<div style="font-size:7px;font-weight:700;color:#555;letter-spacing:0.08em;">ABILITIES</div>';
        op.abilities.forEach(a => {
          html += '<div style="font-size:7px;color:#333;line-height:1.3;border-left:2px solid ' + fc + '40;padding-left:4px;margin:1px 0;">' + a + '</div>';
        });
        html += '</div>';
      }
      // Equipment
      if (result.effects.length > 0) {
        html += '<div style="padding:2px 6px;">';
        result.effects.forEach(e => {
          html += '<div style="font-size:6px;color:#B8960C;background:#f8f4e8;padding:1px 3px;border-radius:1px;margin:1px 0;">' + e + '</div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div>';

    // Page 2: Reference sheet
    html += '<div style="break-before:page;page-break-before:always;padding-top:8px;">';
    html += '<div style="text-align:center;margin-bottom:8px;border-bottom:2px solid #333;padding-bottom:4px;">';
    html += '<div style="font-size:14px;font-weight:700;color:' + fc + ';">' + fName + ' Reference Sheet</div></div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';

    // Faction Rules
    html += '<div style="border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:' + fc + ';letter-spacing:0.1em;margin-bottom:4px;">FACTION RULES</div>';
    f.factionRules.forEach(r => {
      html += '<div style="margin-bottom:3px;"><div style="font-size:8px;font-weight:700;">' + r.name + '</div>';
      html += '<div style="font-size:7px;color:#444;line-height:1.3;">' + r.desc + '</div></div>';
    });
    html += '</div>';

    // Equipment
    html += '<div style="border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:#B8960C;letter-spacing:0.1em;margin-bottom:4px;">EQUIPMENT SELECTIONS</div>';
    if (activeEq.length > 0) {
      html += '<div style="font-size:7px;font-weight:700;margin-bottom:2px;">Faction:</div>';
      activeEq.forEach(q => { html += '<div style="font-size:7px;color:#444;margin-bottom:2px;">\u2022 ' + q.name + ': ' + q.desc + '</div>'; });
    }
    if (activeUEq.length > 0) {
      html += '<div style="font-size:7px;font-weight:700;margin-top:3px;margin-bottom:2px;">Universal:</div>';
      activeUEq.forEach(q => { html += '<div style="font-size:7px;color:#444;margin-bottom:2px;">\u2022 ' + q.name + ': ' + q.desc + '</div>'; });
    }
    if (activeEq.length === 0 && activeUEq.length === 0) html += '<div style="font-size:7px;color:#888;">None selected</div>';
    html += '</div>';

    // Strategy Ploys
    html += '<div style="border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:#8B7B20;letter-spacing:0.1em;margin-bottom:4px;">STRATEGY PLOYS (1CP)</div>';
    f.ploys.strategy.forEach(p => {
      html += '<div style="margin-bottom:3px;display:flex;gap:4px;align-items:flex-start;">';
      html += '<div style="width:8px;height:8px;border:1px solid #aaa;border-radius:1px;flex-shrink:0;margin-top:1px;"></div>';
      html += '<div><div style="font-size:7px;font-weight:700;">' + p.name + '</div>';
      html += '<div style="font-size:6px;color:#555;line-height:1.3;">' + p.desc + '</div></div></div>';
    });
    html += '</div>';

    // Firefight Ploys
    html += '<div style="border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:#993333;letter-spacing:0.1em;margin-bottom:4px;">FIREFIGHT PLOYS (1CP)</div>';
    f.ploys.firefight.forEach(p => {
      html += '<div style="margin-bottom:3px;display:flex;gap:4px;align-items:flex-start;">';
      html += '<div style="width:8px;height:8px;border:1px solid #aaa;border-radius:1px;flex-shrink:0;margin-top:1px;"></div>';
      html += '<div><div style="font-size:7px;font-weight:700;">' + p.name + '</div>';
      html += '<div style="font-size:6px;color:#555;line-height:1.3;">' + p.desc + '</div></div></div>';
    });
    html += '</div>';

    // Quick Reference
    html += '<div style="border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:#333;letter-spacing:0.1em;margin-bottom:4px;">SHOOTING SEQUENCE</div>';
    ["1. Select ranged weapon (ATK dice)", "2. Select valid target (Engage=visible, Conceal=visible+not in cover)", "3. Roll ATK: >= Hit = success, 6 = crit, 1 = fail", "4. If obscured: discard 1 success, crits become normals", "5. Defense: 3D6 >= Save. Cover: +1 auto normal save", "6. Block: norm\u2192norm, crit\u2192any, 2 norms\u2192crit", "7. Unblocked: Normal Dmg / Critical Dmg"].forEach(s => {
      html += '<div style="font-size:6px;color:#444;line-height:1.4;padding-left:2px;">' + s + '</div>';
    });
    html += '</div>';

    html += '<div style="border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:#333;letter-spacing:0.1em;margin-bottom:4px;">FIGHTING SEQUENCE</div>';
    ["1. Select enemy in control range (they retaliate)", "2. Both select melee weapon, collect ATK dice", "3. Both roll: >= Hit = success, 6 = crit", "4. Alternate (attacker first): Strike or Block", "   Strike: deal Normal/Critical Dmg immediately", "   Block: cancel 1 opponent success (norm\u2192norm, crit\u2192any)"].forEach(s => {
      html += '<div style="font-size:6px;color:#444;line-height:1.4;padding-left:2px;">' + s + '</div>';
    });
    html += '</div>';

    // Key rules reminder
    html += '<div style="grid-column:span 2;border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;color:#333;letter-spacing:0.1em;margin-bottom:4px;">KEY RULES</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:6px;color:#444;line-height:1.3;">';
    html += '<div><b>Control Range:</b> Visible + within 1\u2033. Mutual.</div>';
    html += '<div><b>Injured:</b> Below half wounds: -2\u2033 Move, -1 Hit.</div>';
    html += '<div><b>Incapacitated:</b> 0 wounds = removed.</div>';
    html += '<div><b>Cover:</b> Intervening terrain in target CR. +1 auto defense.</div>';
    html += '<div><b>Obscured:</b> Intervening Heavy terrain >1\u2033 from both.</div>';
    html += '<div><b>Counteract:</b> All expended? 1 Engaged op: free 1AP (max 2\u2033 move).</div>';
    html += '<div><b>Conceal:</b> No Shoot/Charge. Not valid target in cover.</div>';
    html += '<div><b>Cmd Re-roll:</b> 1CP. Re-roll one attack or defense die.</div>';
    html += '<div><b>Orders:</b> Engage (normal) or Conceal (hidden).</div>';
    html += '</div></div>';

    html += '</div>'; // end grid
    html += '</div>'; // end page 2

    // Scoring tracker
    html += '<div style="margin-top:12px;border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;letter-spacing:0.1em;margin-bottom:4px;">SCORING TRACKER</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:7px;">';
    html += '<tr><td style="border:1px solid #ccc;padding:2px 4px;font-weight:700;">TP</td>';
    for (let i = 1; i <= gc.numTPs; i++) html += '<td style="border:1px solid #ccc;padding:2px 8px;text-align:center;font-weight:700;">' + i + '</td>';
    html += '<td style="border:1px solid #ccc;padding:2px 4px;font-weight:700;">TOTAL</td></tr>';
    html += '<tr><td style="border:1px solid #ccc;padding:4px;">Your Primary</td>';
    for (let i = 0; i < gc.numTPs; i++) html += '<td style="border:1px solid #ccc;padding:4px;"></td>';
    html += '<td style="border:1px solid #ccc;padding:4px;"></td></tr>';
    html += '<tr><td style="border:1px solid #ccc;padding:4px;">Opponent Primary</td>';
    for (let i = 0; i < gc.numTPs; i++) html += '<td style="border:1px solid #ccc;padding:4px;"></td>';
    html += '<td style="border:1px solid #ccc;padding:4px;"></td></tr>';
    for (let t = 0; t < gc.numTacOps; t++) {
      html += '<tr><td style="border:1px solid #ccc;padding:4px;">Tac Op ' + (t+1) + ': ____________</td>';
      for (let i = 0; i < gc.numTPs; i++) html += '<td style="border:1px solid #ccc;padding:4px;"></td>';
      html += '<td style="border:1px solid #ccc;padding:4px;"></td></tr>';
    }
    html += '</table></div>';

    // CP tracker
    html += '<div style="margin-top:6px;border:1px solid #ccc;border-radius:4px;padding:6px;break-inside:avoid;">';
    html += '<div style="font-size:8px;font-weight:700;letter-spacing:0.1em;margin-bottom:4px;">CP TRACKER</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:7px;">';
    html += '<tr><td style="border:1px solid #ccc;padding:2px 4px;font-weight:700;">TP</td><td style="border:1px solid #ccc;padding:2px;text-align:center;">Start</td>';
    for (let i = 1; i <= gc.numTPs; i++) html += '<td style="border:1px solid #ccc;padding:2px 8px;text-align:center;">' + i + '</td>';
    html += '</tr><tr><td style="border:1px solid #ccc;padding:4px;">CP</td><td style="border:1px solid #ccc;padding:4px;text-align:center;">2</td>';
    for (let i = 0; i < gc.numTPs; i++) html += '<td style="border:1px solid #ccc;padding:4px;"></td>';
    html += '</tr></table></div>';

    html += '</div>'; // end outer

    const pw = window.open('', '_blank');
    if (!pw) { showToast("Your browser blocked the print window. Allow pop-ups for KillSheet, then try again.", 5000); return; }
    pw.document.write('<!DOCTYPE html><html><head><title>' + fName + ' Roster</title>');
    pw.document.write('<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">');
    pw.document.write('<style>@page{margin:0.3in;size:auto;} body{margin:0;} @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>');
    pw.document.write('</head><body>' + html + '</body></html>');
    pw.document.close();
    setTimeout(() => { pw.print(); }, 500);
  };

  // ── Validation logic ──
  const getValidation = () => {
    if (!f || !f.composition) return { errors: [], warnings: [], valid: true, complete: false, selections: roster.length };
    const { errors, warnings, complete, selections } = compCheck(f, roster, eq);

    // Equipment validation
    const factionEqCount = Object.keys(eq).filter(k => eq[k]).length;
    const hasExplosiveGrenades = uEq["frag_gren"] || uEq["krak_gren"];
    const hasUtilityGrenades = uEq["smoke_gren"] || uEq["stun_gren"];
    const otherUnivCount = Object.keys(uEq).filter(k => uEq[k] && !["frag_gren", "krak_gren", "smoke_gren", "stun_gren"].includes(k)).length;
    const univEqSlots = (hasExplosiveGrenades ? 1 : 0) + (hasUtilityGrenades ? 1 : 0) + otherUnivCount;
    const totalEqSlots = factionEqCount + univEqSlots;

    if (totalEqSlots > gc.equipSlots) {
      warnings.push("Equipment: " + totalEqSlots + " selections (limit is " + gc.equipSlots + ").");
    }

    return { errors, warnings, valid: errors.length === 0, complete, selections, equipCount: totalEqSlots };
  };

  // ── Can another copy of this operative be added? ──
  const canAdd = (opId, rosterOverride) => {
    if (!validate || !f || !f.composition) return true;
    return compCanAdd(f, rosterOverride || roster, opId, eq);
  };

  // Add one copy of an operative (numbered if it's a repeat)
  const addOp = (id) => {
    if (rosterLocked) return;
    setRoster(prev => {
      if (validate && !canAdd(id, prev)) return prev;
      const op = f.operatives.find(x => x.id === id);
      return op ? [...prev, makeInstance(op, compCount(prev, id) + 1)] : prev;
    });
  };
  // Remove the most recent copy of an operative
  const removeOp = (id) => {
    if (rosterLocked) return;
    setRoster(prev => {
      const idx = prev.map(baseOf).lastIndexOf(id);
      return idx < 0 ? prev : prev.filter((_, i) => i !== idx);
    });
  };
  const toggleOp = (id) => (compCount(roster, id) > 0 ? removeOp(id) : addOp(id));

  const getEquipForOp = (op) => {
    if (!f) return { weapons: [], effects: [], ignoreInjured: false };
    const weapons = [];
    const effects = [];
    let ignoreInjured = false;
    // Faction equipment
    f.equipment.forEach(q => {
      if (!eq[q.id]) return;
      if (op.ex && op.ex.includes(q.id)) return;
      if (q.ex && q.ex.includes(baseOf(op))) return;
      if (q.gw) weapons.push({ ...q.gw });
      if (q.mod === "ignore_injured") {
        ignoreInjured = true;
        effects.push(q.name + ": Ignore all stat changes from being injured.");
      }
      else if (q.mod === "poison_bolts") {
        const hasBolt = op.ranged.some(r => r.name.toLowerCase().includes("boltgun") || r.name.toLowerCase().includes("bolt pistol"));
        if (hasBolt) effects.push("Plague Rounds: boltguns and bolt pistols gain Poison and Severe.");
      }
      else if (q.mod === "remove_range") {
        const has = op.ranged.some(r => r.name.toLowerCase().includes("slugga") || r.name.toLowerCase().includes("shokka"));
        if (has) effects.push("Collapsible Stocks: the slugga and shokka pistol lose their Range limit.");
      }
      else if (!q.gw && !q.mod) effects.push(q.name + ": " + q.desc);
    });
    // Universal equipment
    UNIV_EQUIP.forEach(q => {
      if (!uEq[q.id]) return;
      if (q.gw) weapons.push({ ...q.gw });
      if (!q.gw && !q.mod) effects.push(q.name + ": " + q.desc);
    });
    return { weapons, effects, ignoreInjured };
  };

  const v = f ? getValidation() : { errors: [], warnings: [], valid: true, complete: false, selections: 0 };
  const isComplete = !!(f && f.composition && v.complete);

  // Shown on the Battle tab when not playing: one note at a time, never mid-game.
  const iosSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
  const installed = navigator.standalone || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
  const MONTH = 30 * 24 * 3600 * 1000;
  const safetyNote = rosterLocked || !hasData ? null
    : iosSafari && !installed && !homeTipSeen ? "home"
    : (!lastBackup || Date.now() - lastBackup > MONTH) && (!backupNudgeAt || Date.now() - backupNudgeAt > MONTH) ? "backup" : null;
  const noteCard = (title, text, buttons) => (
    <div role="note" style={{ ...cd, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "10px 12px 10px 14px", borderLeft: "3px solid var(--accent)" }}>
      <div style={{ flex: "1 1 220px", minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>{text}</div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>{buttons}</div>
    </div>
  );
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px", position: "relative" }}>
      {safetyNote === "home" && noteCard("Keep your data safe",
        <>Safari can clear a website's saved data if you don't open it for a while. Add KillSheet to your Home Screen and your rosters and games are kept: tap Share, then Add to Home Screen.</>,
        <button onClick={() => setHomeTipSeen(true)} style={{ ...bs("var(--accent)"), padding: "8px 14px", fontSize: 13 }}>Got it</button>)}
      {safetyNote === "backup" && noteCard("Back up your rosters and games",
        <>KillSheet keeps them only on this device{lastBackup ? ", and your last backup was over a month ago" : ""}. A backup file lets you restore them on a new phone or after clearing your browser.</>,
        <><button onClick={backUp} style={{ ...bs("var(--accent)"), padding: "8px 14px", fontSize: 13 }}>Back up</button>
          <button onClick={() => setBackupNudgeAt(Date.now())} style={{ ...bs("var(--muted)"), padding: "8px 14px", fontSize: 13 }}>Later</button></>)}
      {/* Undo toast */}
      {undo && (
        <div role="status" style={{ position: "fixed", bottom: "calc(16px + env(safe-area-inset-bottom))", left: 16, right: 16, margin: "0 auto", width: "fit-content", maxWidth: 560, boxSizing: "border-box", zIndex: 9999, display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 8px 16px", borderRadius: 8, background: "var(--raised)", border: "1px solid var(--line)", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.35 }}>{undo.label}</span>
          <button onClick={() => { restoreKillSheetStorage(undo.snap); window.location.reload(); }} style={{ ...bs("var(--gold)"), padding: "8px 14px", fontSize: 13, flexShrink: 0 }}>Undo</button>
          <button onClick={() => setUndo(null)} aria-label="Dismiss" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 0, width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={20} /></button>
        </div>
      )}
      {/* Toast notification */}
      {toast && (
        <div style={{ position: "fixed", top: 80, left: 16, right: 16, margin: "0 auto", width: "fit-content", maxWidth: 560, textAlign: "center", zIndex: 9999, background: "#3D6B3F", color: "white", padding: "10px 20px", borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", boxShadow: "0 4px 20px rgba(0,0,0,0.6)", animation: "fadeIn 0.2s ease" }}>{toast}</div>
      )}
      {addingOpp && <AddTheirTeam onClose={() => setAddingOpp(false)} onAdd={(teamId, ids) => {
        const fc = FACTIONS[teamId], ops = makeInstances(fc, ids);
        setOppRoster({ factionId: teamId, operatives: ops, eq: {}, uEq: {} });
        setOppWounds({}); clearScars("opp");
        setOppCollapsed(Object.fromEntries(ops.map(o => [o.id, true])));
        setAddingOpp(false);
        showToast(fc.name + " added: " + ops.length + " operative" + (ops.length === 1 ? "" : "s"), 3000);
      }} />}
      {shot && (() => {
        const sideOf = (owner) => owner === shot.mine ? "mine" : "opp";
        const opsOf = (owner) => sideOf(owner) === "mine" ? roster : oppOps();
        const entry = (owner, op) => ({ key: owner + op.id, owner, info: shotOpInfo(sideOf(owner), op) });
        const alive = (e) => e.info.start > 0;
        const options = shot.stage === "target" ? opsOf("B").map(op => entry("B", op)).filter(alive) : [];
        const taken = new Set(shot.targets.map(t => t.owner + t.op.id).concat("A" + shot.atk.op.id));
        const others = shot.stage === "more" ? [...opsOf("B").map(op => entry("B", op)), ...opsOf("A").map(op => entry("A", op))].filter(e => alive(e) && !taken.has(e.key)) : [];
        const oppColor = oppF ? oppF.color : "var(--muted)";
        return <ShootScreen shot={shot} dropped={shot.online && !linkUp()} options={options} others={others}
          sideColor={(side) => side === "mine" ? (f ? f.color : "var(--accent)") : oppColor}
          onAct={(a) => dispatchShot(a, false)} onClose={() => showShot(null)} onTakeOver={takeOverShot}
          importHint={sideOf("B") === "opp" ? "Their team isn't in KillSheet yet. Add it from the ⋯ menu on your team bar (Add enemy roster), or play online, to shoot their operatives here." : "None of your operatives can be shot."} />;
      })()}
      {fight && (() => {
        const enemySide = fight.atk.side === "mine" ? "opp" : "mine";
        const enemyOps = enemySide === "opp" ? oppOps() : roster;
        const enemies = fight.stage === "target" ? enemyOps.map(op => ({ op, side: enemySide, info: fightOpInfo(enemySide, op) })).filter(e => e.info.start > 0) : [];
        const defOp = fight.def && (fight.def.side === "mine" ? roster : oppOps()).find(o => o.id === fight.def.op.id);
        const oppColor = oppF ? oppF.color : "var(--muted)";
        return <FightScreen fight={fight} dropped={fight.online && !linkUp()} enemies={enemies} defWeapons={fight.stage === "weapon" && defOp && fight.roles.includes("def") ? meleeFor(fight.def.side, defOp) : []}
          sideColor={(side) => side === "mine" ? (f ? f.color : "var(--accent)") : oppColor}
          onAct={(a) => dispatchFight(a, false)} onClose={() => showFight(null)} onTakeOver={takeOverFight}
          importHint={enemySide === "opp" ? "Their team isn't in KillSheet yet. Add it from the ⋯ menu on your team bar (Add enemy roster), or play online, to fight their operatives here." : "None of your operatives can fight back."} />;
      })()}
      <HitBubbles notes={hitNotes} onOpen={openLog} onDismiss={(id) => setHitNotes(prev => prev.filter(x => x.id !== id))} />
      {/* Battle log: their operatives' changes on the right (what you did), yours on the left. */}
      {showLog && (
        <div onClick={() => setShowLog(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div role="dialog" aria-modal="true" aria-label="Battle log" onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid color-mix(in srgb, var(--blue) 38%, transparent)", borderRadius: 4, padding: 16, maxWidth: 480, width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--blue)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}><Icon name="log" size={16} /> Battle log</div>
              <button autoFocus onClick={() => setShowLog(false)} style={{ ...bs("var(--muted)"), fontSize: 13, padding: "8px 12px" }}><Icon name="x" size={12} /> Close</button>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Their operatives on the right, yours on the left.</div>
            <div ref={(el) => { if (!el) return; const at = logFocus && el.querySelector("[data-note='" + logFocus + "']"); if (at) at.scrollIntoView({ block: "center" }); else el.scrollTop = el.scrollHeight; }} style={{ flex: 1, minHeight: 120, overflowY: "auto", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 6, padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {battleLog.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--muted2)", textAlign: "center", margin: "auto 0", lineHeight: 1.5 }}>Nothing yet. Damage from the dice roller and the wound buttons shows up here.</div>
              ) : battleLog.map((e, i) => {
                const theirs = e.side === "opp";
                const lost = e.before - e.after;
                const n = Math.abs(lost), w = n === 1 ? " wound" : " wounds";
                const main = e.how === "dice" && e.by ? e.by + " hit " + e.target + (e.weapon ? " with " + e.weapon : "") + ": " + lost + " damage"
                  : e.how === "self" ? e.target + " took " + lost + " damage from its own weapon"
                  : lost > 0 ? e.target + " lost " + n + w
                  : e.target + " got " + n + w + " back";
                const newTp = i === 0 || battleLog[i - 1].tp !== e.tp;
                return (
                  <React.Fragment key={e.t + "-" + i}>
                    {newTp && <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.12em", textAlign: "center", margin: i === 0 ? "0 0 2px" : "8px 0 2px" }}>TURNING POINT {e.tp}</div>}
                    <div data-note={e.note} data-focus={e.note && e.note === logFocus ? "true" : undefined} style={{ display: "flex", justifyContent: theirs ? "flex-end" : "flex-start" }}>
                      <div style={{ ...(e.note && e.note === logFocus ? { boxShadow: "0 0 0 2px var(--blue)" } : {}), maxWidth: "85%", padding: "6px 9px", borderRadius: 6, background: theirs ? "#3B6FD420" : "#B8341C20", border: "1px solid " + (theirs ? "#3B6FD440" : "#B8341C40"), fontSize: 13, color: "var(--text)", lineHeight: 1.4, wordBreak: "break-word" }}>
                        <div>{main}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{e.before} {"→"} {e.after} wounds{e.after <= 0 ? ", incapacitated" : ""}</div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Multiplayer modal */}
      {showMP && (
        <div onClick={() => setShowMP(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div role="dialog" aria-modal="true" aria-label="Play online" onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid color-mix(in srgb, var(--blue) 50%, transparent)", borderRadius: 10, padding: 20, maxWidth: 460, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--blue)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}><MPIcon name="players" size={20} /> Play online</div>
              <button autoFocus onClick={() => setShowMP(false)} style={{ ...bs("var(--muted)"), fontSize: 13, padding: "8px 12px" }}><Icon name="x" size={12} /> Close</button>
            </div>

            {mp.status === "connected" && mpVersionNote && <div role="status" style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 6, border: "1px solid var(--gold)", background: "color-mix(in srgb, var(--gold) 10%, transparent)", fontSize: 13, color: "var(--text)", lineHeight: 1.45 }}>{mpVersionNote}</div>}
            {/* Status row */}
            <div style={{ marginBottom: 12, padding: "8px 10px", background: "var(--raised)", borderRadius: 6, border: "1px solid var(--line)", fontSize: 13, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>STATUS</span>
                <span style={{ color: mp.status === "connected" ? "#3D6B3F" : mp.status === "error" ? "#B8341C" : mp.status === "idle" ? "var(--muted)" : "var(--accent)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <MPIcon name={mp.status === "idle" ? "players" : mpIconFor(mp.status)} size={11} />
                  {mp.status === "idle" && "Not connected"}
                  {mp.status === "hosting" && "Waiting for opponent..."}
                  {mp.status === "joining" && "Connecting..."}
                  {mp.status === "connected" && "Connected as " + mp.role}
                  {mp.status === "error" && "Error"}
                </span>
              </div>
              {mp.roomCode && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>ROOM CODE</span>
                  <span style={{ color: "var(--accent)", fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.15em" }}>{mp.roomCode}</span>
                </div>
              )}
              {mp.peerError && <div style={{ marginTop: 4, color: "#E0664A", fontSize: 13 }}>{mp.peerError}</div>}
            </div>

            {mp.status === "idle" || mp.status === "error" ? (
              <div>
                {mp.lastRoom && (
                  <button onClick={mp.rejoin} style={{ ...bs("var(--blue)"), width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 700, background: "color-mix(in srgb, var(--blue) 13%, transparent)", letterSpacing: "0.06em", marginBottom: 10 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MPIcon name="join" size={15} /> Rejoin room {mp.lastRoom.code}</span>
                  </button>
                )}
                <button onClick={mp.host} style={{ ...bs("var(--accent)"), width: "100%", padding: "10px 0", fontSize: 14, fontWeight: 700, background: "color-mix(in srgb, var(--accent) 7%, transparent)", letterSpacing: "0.06em", marginBottom: 10 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MPIcon name="host" size={15} /> Host a new game</span>
                </button>
                <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", margin: "8px 0", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>OR</div>
                <div style={{ display: "flex", gap: 4 }}>
                  <input type="text" value={joinCodeInput} onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} placeholder="ROOM CODE" maxLength={6} style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--blue)", borderRadius: 6, color: "var(--accent)", fontSize: 14, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.2em", padding: "8px 10px", outline: "none", textAlign: "center" }} />
                  <button onClick={() => { mp.join(joinCodeInput); setJoinCodeInput(""); }} disabled={joinCodeInput.length < 4} style={{ ...bs(joinCodeInput.length >= 4 ? "var(--blue)" : "var(--line)"), padding: "8px 12px", fontSize: 13, fontWeight: 700, background: joinCodeInput.length >= 4 ? "color-mix(in srgb, var(--blue) 13%, transparent)" : "transparent", opacity: joinCodeInput.length >= 4 ? 1 : 0.5, cursor: joinCodeInput.length >= 4 ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 5 }}><MPIcon name="join" size={13} />Join</button>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 12, lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--accent)" }}>How it works:</strong> One player hosts and gets a room code; the other enters it to connect. The two browsers connect directly, and nobody needs an account. If the connection drops, KillSheet tries the same room again, and after a reload you can rejoin it with one tap. Wounds, CP and score stay saved on each device.
                </div>
              </div>
            ) : mp.status === "hosting" ? (
              <div>
                <div style={{ textAlign: "center", padding: "12px 0", marginBottom: 10, background: "var(--bg)", borderRadius: 6, border: "1px dashed color-mix(in srgb, var(--accent) 38%, transparent)" }}>
                  <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>SHARE THIS CODE</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: "var(--accent)", fontFamily: "monospace", letterSpacing: "0.3em" }}>{mp.roomCode}</div>
                  <button onClick={() => { try { navigator.clipboard.writeText(mp.roomCode); showToast("Code copied"); } catch (e) {} }} style={{ ...bs("var(--muted)"), fontSize: 13, padding: "8px 12px", marginTop: 6 }}>Copy code</button>
                </div>
                <div style={{ fontSize: 13, color: "var(--accent)", textAlign: "center", marginBottom: 10, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><MPIcon name="waiting" size={12} /> {mp.lost ? "Your opponent dropped. They can rejoin with this code." : "Waiting for your opponent to join..."}</div>
                <button onClick={mp.disconnect} style={{ ...bs("#B8341C"), width: "100%", padding: "8px 0", fontSize: 13 }}>Cancel</button>
              </div>
            ) : mp.status === "joining" ? (
              <div>
                <div style={{ textAlign: "center", padding: "12px 0", color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><MPIcon name="waiting" size={12} /> {mp.lost ? "Connection lost. Rejoining " : "Connecting to "}{mp.roomCode}...</div>
                <button onClick={mp.disconnect} style={{ ...bs("#B8341C"), width: "100%", padding: "8px 0", fontSize: 13 }}>Cancel</button>
              </div>
            ) : mp.status === "connected" ? (
              <div>
                <div style={{ padding: "10px", background: "#3D6B3F15", border: "1px solid #3D6B3F40", borderRadius: 6, marginBottom: 10, fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                  <div style={{ color: "#5A9C3A", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}><MPIcon name="connected" size={13} /> Connected as {mp.role}</div>
                  Roster, wounds, TP, and initiative sync automatically.
                </div>

                {/* Chat */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>CHAT</div>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 6, height: 140, overflowY: "auto", padding: 6, marginBottom: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                    {chatHistory.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--muted2)", fontStyle: "italic", textAlign: "center", marginTop: 50 }}>No messages yet.</div>
                    ) : chatHistory.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "80%", padding: "4px 8px", borderRadius: 6, background: m.from === "me" ? "#3B6FD420" : "#B8341C20", border: "1px solid " + (m.from === "me" ? "#3B6FD440" : "#B8341C40"), fontSize: 13, color: "var(--text)", wordBreak: "break-word" }}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <input type="text" value={chatDraft} onChange={(e) => setChatDraft(e.target.value.slice(0, 500))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendChat(); } }} placeholder="Type a message..." style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", fontSize: 13, padding: "8px 12px", outline: "none" }} />
                    <button onClick={sendChat} disabled={!chatDraft.trim()} style={{ ...bs(chatDraft.trim() ? "var(--blue)" : "var(--line)"), padding: "8px 12px", fontSize: 13, background: chatDraft.trim() ? "color-mix(in srgb, var(--blue) 13%, transparent)" : "transparent", opacity: chatDraft.trim() ? 1 : 0.5, cursor: chatDraft.trim() ? "pointer" : "not-allowed" }}>Send</button>
                  </div>
                </div>

                <button onClick={mp.disconnect} style={{ ...bs("#B8341C"), width: "100%", padding: "8px 0", fontSize: 13 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MPIcon name="leave" size={11} />Disconnect</span></button>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>{f && rosterLocked ? f.name : "Your kill team"}</div>
          {/* The game's settings line, while setting up; during a game it's in the game menu (Game settings), to save space. */}
          {!rosterLocked && <button onClick={() => setShowSetup(true)} className="link-btn" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", ...mu, fontSize: 13 }}>{[gc.mission ? gc.missionName : gc.auto || (!gc.missionName && gc.equipSlots === 3 && gc.numTacOps === 3 && gc.numTPs === 4) ? "Standard game" : (gc.missionName || "Custom game"), gc.killzone !== "open" ? killzoneNames[gc.killzone] : null, gc.equipSlots + " equipment", gc.numTPs + " turning points", validate ? null : "validation off"].filter(Boolean).join(" \u00b7 ")} <span style={{ color: "var(--accent)", textDecoration: "underline" }}>Change</span></button>}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, position: "relative" }}>
          {mp.status !== "idle" && <button onClick={() => setShowMP(true)} title={mp.status === "connected" ? "Connected: " + mp.roomCode : mp.status === "hosting" ? "Hosting: " + mp.roomCode : "Multiplayer"} style={{ ...bs(mp.status === "connected" ? "#3D6B3F" : mp.status === "hosting" || mp.status === "joining" ? "var(--accent)" : mp.status === "error" ? "#B8341C" : "var(--blue)"), fontSize: 12, padding: "8px 12px", background: mp.status === "connected" ? "#3D6B3F20" : mp.status === "hosting" || mp.status === "joining" ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MPIcon name={mpIconFor(mp.status)} size={14} />{mp.status === "connected" ? "Online" : mp.status === "hosting" ? "Hosting" : mp.status === "joining" ? "Joining" : "Play online"}</span>
          </button>}
          <button onClick={() => setGameMenu(!gameMenu)} aria-label="Game menu" style={{ ...bs("var(--muted)"), padding: "8px 12px", fontSize: 16, lineHeight: 1 }}>{"\u22EF"}</button>
          {gameMenu && (
            <div>
              <div onClick={() => setGameMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 41, minWidth: 230, background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", padding: 6 }}>
                {[
                  mp.status === "idle" && feat.online ? ["Play online", "Link up with a friend on another device", () => setShowMP(true), "var(--blue)"] : null,
                  window.__ksInstall ? ["Install app", "Add KillSheet to this device. Works offline.", () => { const p = window.__ksInstall; window.__ksInstall = null; p.prompt(); }, "var(--text)"]
                    : /iPhone|iPad|iPod/.test(navigator.userAgent) && !navigator.standalone ? ["Add to Home Screen", "Works offline once added", () => showToast("In Safari, tap Share, then Add to Home Screen", 6000), "var(--text)"] : null,
                  ["Game settings", feat.missions ? "Mission, equipment, turning points" : "Equipment and turning points", () => setShowSetup(true), "var(--text)"],
                  ["Back up", "Save your rosters, game and settings to a file", backUp, "var(--text)"],
                  ["Restore from backup", "Load a backup file onto this device", () => restoreInput.current && restoreInput.current.click(), "var(--text)"],
                  f && rosterLocked ? ["End game", "Record the result in your game history", openEndGame, "#5A9C3A"] : null,
                  f ? ["Reset game", "Clears wounds, CP, VP, orders and tracking", () => withUndo("Game reset", resetGame), "#B8341C"] : null,
                ].filter(Boolean).map(([label, hint, run, color]) => (
                  <button key={label} onClick={() => { setGameMenu(false); run(); }} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderRadius: 4, padding: "10px 10px", cursor: "pointer" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color, fontFamily: "'Inter', sans-serif" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}>{hint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {campaign && feat.campaign && <CampaignBoundary><CampaignCard c={campaign} setC={setCampaign} mobile={mobile} f={f} showToast={showToast} playing={!!(f && rosterLocked && !pickerOpen)} /></CampaignBoundary>}
      <input ref={restoreInput} type="file" accept=".json,application/json" style={{ display: "none" }} onChange={e => { readBackup(e.target.files[0]); e.target.value = ""; }} />
      {pendingRestore && (
        <div role="alertdialog" aria-label="Restore backup" className="ks-appear" style={{ ...cd, padding: 14, borderLeft: "3px solid var(--gold)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Restore this backup?</div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, marginTop: 4 }}>
            Saved {pendingRestore.savedAt ? new Date(pendingRestore.savedAt).toLocaleString() : "at an unknown time"}, with {pendingRestore.rosters} saved roster{pendingRestore.rosters === 1 ? "" : "s"}. It replaces the rosters, game and settings on this device. To keep what's here, back it up first.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button onClick={() => { restoreKillSheetStorage(pendingRestore.data); window.location.reload(); }} style={{ ...bs("var(--gold)"), padding: "8px 16px", fontSize: 13 }}>Restore</button>
            <button onClick={backUp} style={{ ...bs("var(--muted)"), padding: "8px 16px", fontSize: 13 }}>Back up this device first</button>
            <button onClick={() => setPendingRestore(null)} style={{ ...bs("var(--muted)"), padding: "8px 16px", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {endGame && f && (() => {
        const res = endGame.you > endGame.them ? ["Win", "#5A9C3A"] : endGame.you < endGame.them ? ["Loss", "#E0664A"] : ["Draw", "var(--gold)"];
        return (
          <div role="dialog" aria-label="End game" className="ks-appear" style={{ ...cd, padding: 14, borderLeft: "3px solid #5A9C3A" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>End game</div>
              <span style={bg(res[1])}>{res[0]}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", margin: "10px 0" }}>
              <Stepper label="Your VP" value={endGame.you} color="#5A9C3A" onMinus={() => setEndGame({ ...endGame, you: Math.max(0, endGame.you - 1) })} onPlus={() => setEndGame({ ...endGame, you: endGame.you + 1 })} />
              <Stepper label="Their VP" value={endGame.them} color="#E0664A" onMinus={() => setEndGame({ ...endGame, them: Math.max(0, endGame.them - 1) })} onPlus={() => setEndGame({ ...endGame, them: endGame.them + 1 })} />
            </div>
            <GameRecap recap={gameRecap(battleLog, vpByTp)} />
            <div style={{ height: 10 }} />
            <label style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Opponent's team</label>
            <select value={endGame.opp} onChange={e => setEndGame({ ...endGame, opp: e.target.value })} style={{ width: "100%", maxWidth: 360, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "9px 10px", fontSize: 14 }}>
              <option value="">Not recorded</option>
              {Object.values(FACTIONS).sort((a, b) => a.name.localeCompare(b.name)).map(fc => <option key={fc.id} value={fc.id}>{fc.name}</option>)}
            </select>
            {campaign && campaign.phase === "battle" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 10 }}>
                <Stepper label="Enemies taken out" value={endGame.incap || 0} color="#E0664A" onMinus={() => setEndGame({ ...endGame, incap: Math.max(0, (endGame.incap || 0) - 1) })} onPlus={() => setEndGame({ ...endGame, incap: (endGame.incap || 0) + 1 })} />
                <span style={{ fontSize: 12, color: "var(--muted)", flex: "1 1 160px" }}>Counts toward your Ctesiphus campaign: 5 or fewer wounds count as 0, 6-10 as 1, 11 or more as 2.</span>
              </div>
            )}
            {campaign && campaign.phase !== "battle" && campaign.phase !== "over" && campaign.phase !== "setup" && <div style={{ fontSize: 13, color: "var(--gold)", marginTop: 10 }}>Your campaign isn't in its Battle phase, so this result won't count there.</div>}
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginTop: 10 }}>Saving clears wounds, CP, VP and orders for your next game. Your roster stays. Discard ends the game without recording it and takes you back to picking a team.{campaign && campaign.phase === "battle" ? " It also records the battle in your campaign." : ""}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <button onClick={saveGame} style={{ ...bs("#5A9C3A"), background: "#5A9C3A20", padding: "10px 18px", fontSize: 14 }}>Save result</button>
              <button onClick={discardGame} style={{ ...bs("#E0664A"), padding: "10px 16px", fontSize: 13 }}>Discard game</button>
              <button onClick={() => setEndGame(null)} style={{ ...bs("var(--muted)"), padding: "10px 16px", fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        );
      })()}

      {/* Faction select: collapses to one bar once a team is picked */}
      {f && !pickerOpen ? (rosterLocked ? null :
        <div style={{ ...cd, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 14, borderTop: "2px solid " + f.color }}>
          <div style={bg(f.color)}>{f.badge}</div>
          <div style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: f.color, letterSpacing: "0.04em" }}>{f.name}</div>
          <button onClick={() => { setPickerGroup(factionGroup(f)); setPickerSearch(""); setPickerOpen(true); }} style={{ ...bs("var(--muted)"), fontSize: 11, padding: "6px 12px" }}>Change team</button>
        </div>
      ) : (() => {
        const group = pickerGroup || (f ? factionGroup(f) : "Imperium");
        const q = searchNorm(pickerSearch.trim());
        const all = Object.values(FACTIONS).sort((x, y) => x.name.localeCompare(y.name));
        const shown = q ? all.filter(fc => factionSearchText(fc).includes(q)) : all.filter(fc => factionGroup(fc) === group);
        const choose = (fc) => {
          setPeek(null);
          if (fid === fc.id) { setPickerOpen(false); return; }
          if (roster.length > 0) withUndo("Switched to " + fc.name, () => selectFaction(fc.id)); else selectFaction(fc.id);
          setPickerOpen(false); setPickerSearch(""); window.scrollTo(0, 0);
        };
        const pick = (fc) => { setPeekRule(null); setPeek(peek === fc.id ? null : fc.id); };
        const chip = (on, color) => ({ padding: "8px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: "pointer", textAlign: "left", border: "1px solid " + (on ? color : "var(--line)"), background: on ? al(color, "25") : "var(--card)", color: on ? "var(--text)" : "var(--text2)" });
        const panel = (fc) => {
          const rules = [...(fc.factionRules || []).map(r => ({ name: r.name, desc: r.desc })),
            ...(fc.composition && fc.composition.rules && fc.composition.rules.length ? [{ name: "Building the team", list: fc.composition.rules }] : [])];
          const open = peekRule !== null ? rules[peekRule] : null;
          return (
            <div key={"peek-" + fc.id} className="ks-appear" ref={el => { if (el && peekScrolled.current !== fc.id) { peekScrolled.current = fc.id; el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } }}
              style={{ gridColumn: "1 / -1", ...cd, padding: mobile ? 12 : 16, borderTop: "3px solid " + fc.color, background: "linear-gradient(135deg, " + fc.color + "1A, transparent 55%), var(--bg)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", marginRight: 4 }}>{fc.name}</span>
                {fc.archetypes && fc.archetypes.split(/,\s*/).map(a => <span key={a} style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "var(--raised)", color: "var(--text2)" }}>{a}</span>)}
                <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "var(--raised)", color: "var(--text2)" }}>{fc.operatives.length} operative types</span>
                {(() => {
                  const mine = gameHistory.filter(g => g.f === fc.id);
                  if (!mine.length) return null;
                  const n = (r) => mine.filter(g => g.result === r).length;
                  return <span style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, background: "#5A9C3A20", color: "var(--text2)" }}>Your record: {n("win")}W {n("loss")}L {n("draw")}D</span>;
                })()}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {rules.map((r, i) => (
                  <button key={i} aria-expanded={peekRule === i} onClick={() => setPeekRule(peekRule === i ? null : i)} style={chip(peekRule === i, r.list ? "var(--muted)" : fc.color)}>{r.name}</button>
                ))}
              </div>
              {open && (
                <div className="ks-appear" ref={el => { const k = fc.id + "|" + peekRule; if (el && peekRuleScrolled.current !== k) { peekRuleScrolled.current = k; el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } }} style={{ marginTop: 8, padding: "10px 12px", borderRadius: 6, background: "var(--bg)", borderLeft: "3px solid " + (open.list ? "var(--muted)" : fc.color), fontSize: 13, color: "var(--text2)", lineHeight: 1.55 }}>
                  {open.list ? open.list.map((t, i) => <div key={i} style={{ marginBottom: i < open.list.length - 1 ? 4 : 0 }}><RefText text={t} f={fc} /></div>) : <RefText text={open.desc} f={fc} self={open.name} />}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <button onClick={() => choose(fc)} style={{ ...bs("var(--accent)"), background: "color-mix(in srgb, var(--accent) 13%, transparent)", padding: "10px 18px", fontSize: 14, flex: mobile ? "1 1 auto" : "0 0 auto" }}>{fid === fc.id ? "Continue with this team" : "Build my roster"} <Fwd /></button>
              </div>
            </div>
          );
        };
        return (
          <div className="ks-appear" style={{ marginBottom: 14 }}>
            {!f && !tutorialSeen && (
              <div style={{ ...cd, display: "flex", alignItems: "center", gap: 10, padding: "10px 8px 10px 14px", borderLeft: "3px solid var(--gold)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>First game?</div>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>Learn the basics in a 5-minute tutorial.</div>
                </div>
                <button onClick={openTutorial} style={{ ...bs("var(--gold)"), padding: "8px 12px", fontSize: 13, flexShrink: 0 }}>Try it <Fwd /></button>
                <button onClick={() => setTutorialSeen(true)} aria-label="Dismiss" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 0, width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={20} /></button>
              </div>
            )}
            {f && (
              <button onClick={() => { setPickerOpen(false); setPickerSearch(""); setPeek(null); }} style={{ ...cd, width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 10, cursor: "pointer", textAlign: "left", borderTop: "2px solid " + f.color }}>
                <div style={bg(f.color)}>{f.badge}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: f.color, letterSpacing: "0.04em" }}>Continue with {f.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}>{roster.length > 0 ? roster.length + " operative" + (roster.length === 1 ? "" : "s") + " picked" + (rosterLocked ? ", roster locked" : "") : "No operatives picked yet"}</div>
                </div>
                <span style={{ color: f.color, display: "inline-flex" }}><Fwd size={20} /></span>
              </button>
            )}
            {savedRosters.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ ...h3, marginBottom: 6 }}>My saved rosters</div>
                {savedRosters.map(r => {
                  const fc = FACTIONS[r.f];
                  const menu = savedMenu === r.id;
                  const small = { ...bs("var(--muted)"), padding: "5px 10px", fontSize: 11 };
                  return (
                    <div key={r.id} style={{ ...cd, padding: "8px 10px", marginBottom: 6, borderLeft: "3px solid " + (fc ? fc.color : "var(--line)") }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>{fc ? fc.name : "Unknown team"} {"\u00b7"} {r.o.length} operative{r.o.length === 1 ? "" : "s"} {"\u00b7"} {new Date(r.savedAt).toLocaleDateString()}</div>
                        </div>
                        <button onClick={() => loadSaved(r)} style={{ ...bs("var(--accent)"), padding: "6px 12px", fontSize: 12 }}>Load</button>
                        <button onClick={() => setSavedMenu(menu ? null : r.id)} aria-label="More options" style={{ ...bs("var(--muted)"), padding: "6px 10px", fontSize: 12 }}>{"\u22EF"}</button>
                      </div>
                      {menu && (
                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                          <button onClick={() => renameSaved(r)} style={small}>Rename</button>
                          <button onClick={() => copySavedCode(r)} style={small}>Copy code</button>
                          <button onClick={() => deleteSaved(r)} style={{ ...small, color: "#E0664A", borderColor: "#B8341C60" }}>Delete</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {gameHistory.length > 0 && (() => {
              const tally = (games) => games.reduce((t, g) => ({ ...t, [g.result]: t[g.result] + 1 }), { win: 0, loss: 0, draw: 0 });
              const all = tally(gameHistory);
              const byTeam = Object.values(gameHistory.reduce((m, g) => { (m[g.f] = m[g.f] || { f: g.f, team: g.team, games: [] }).games.push(g); return m; }, {})).sort((a, b) => b.games.length - a.games.length);
              const resColor = { win: "#5A9C3A", loss: "#E0664A", draw: "var(--gold)" };
              // Lifetime numbers: win rate (draws count as games), average score, the current run of results, record against each team.
              const winRate = Math.round(100 * all.win / gameHistory.length);
              const avg = (k) => { const v = gameHistory.reduce((t, g) => t + (Number(g[k]) || 0), 0) / gameHistory.length; return Math.round(v * 10) / 10; };
              let streak = 0; while (streak < gameHistory.length && gameHistory[streak].result === gameHistory[0].result) streak++;
              const streakText = streak >= 2 ? streak + " " + { win: "wins", loss: "losses", draw: "draws" }[gameHistory[0].result] + " in a row" : null;
              const vsTeam = Object.values(gameHistory.filter(g => g.oppId).reduce((m, g) => { (m[g.oppId] = m[g.oppId] || { f: g.oppId, team: g.opp, games: [] }).games.push(g); return m; }, {})).sort((a, b) => b.games.length - a.games.length);
              const teamRow = (t) => {
                const r = tally(t.games); const fc = FACTIONS[t.f];
                return (
                  <div key={t.f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--raised)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: fc ? fc.color : "var(--line)", flexShrink: 0 }} />
                    <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.team}</span>
                    <span style={{ fontSize: 13, color: "var(--text2)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{r.win}W {r.loss}L {r.draw}D</span>
                  </div>
                );
              };
              return (
                <div style={{ ...cd, padding: 0, marginBottom: 12, overflow: "hidden" }}>
                  <div role="button" tabIndex={0} aria-expanded={showGames} onClick={() => setShowGames(!showGames)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Game history</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{gameHistory.length} game{gameHistory.length === 1 ? "" : "s"} {"\u00b7"} {all.win}W {all.loss}L {all.draw}D {"\u00b7"} {winRate}% wins</div>
                    </div>
                    <Arrow open={showGames} />
                  </div>
                  {showGames && (
                    <div style={{ padding: "0 12px 12px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 13, color: "var(--text2)", padding: "2px 0 8px" }}>
                        <span>Average score: <strong style={{ color: "#5A9C3A" }}>You {avg("you")}</strong> {"\u00b7"} <strong style={{ color: "#E0664A" }}>Opponents {avg("them")}</strong></span>
                        {streakText && <span>Streak: <strong style={{ color: resColor[gameHistory[0].result] }}>{streakText}</strong></span>}
                      </div>
                      <div style={{ ...h3, margin: "4px 0 4px" }}>Your teams</div>
                      {byTeam.map(teamRow)}
                      {vsTeam.length > 0 && <div style={{ ...h3, margin: "12px 0 4px" }}>Against each team</div>}
                      {vsTeam.map(teamRow)}
                      <div style={{ ...h3, margin: "12px 0 4px" }}>Recent games</div>
                      {gameHistory.slice(0, 10).map(g => (
                        <React.Fragment key={g.id}>
                        <div onClick={g.recap ? () => setOpenGame(openGame === g.id ? null : g.id) : undefined} role={g.recap ? "button" : undefined} aria-expanded={g.recap ? openGame === g.id : undefined} aria-label={g.recap ? "Recap of " + g.team + (g.opp ? " vs " + g.opp : "") : undefined}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--raised)", cursor: g.recap ? "pointer" : "default" }}>
                          <span style={{ ...bg(resColor[g.result]), flexShrink: 0 }}>{g.result === "win" ? "W" : g.result === "loss" ? "L" : "D"}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.team}{g.opp ? " vs " + g.opp : ""}</div>
                            <div style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{new Date(g.date).toLocaleDateString()} {"\u00b7"} {g.mission}</div>
                          </div>
                          <span style={{ flexShrink: 0, fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{g.you}{"\u2013"}{g.them}</span>
                          {g.recap && <Arrow open={openGame === g.id} />}
                          <button className="compact-btn" onClick={(e) => { e.stopPropagation(); withUndo("Game removed from history", () => setGameHistory(h => h.filter(x => x.id !== g.id))); }} aria-label="Remove this game" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 0, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="x" size={16} /></button>
                        </div>
                        {openGame === g.id && g.recap && <div style={{ padding: "0 0 10px 4px" }}><GameRecap recap={g.recap} /></div>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            <div style={{ ...h3, marginBottom: 6 }}>{f ? "Or pick another team" : "Pick a team"}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
              {FACTION_GROUPS.map(g => {
                const on = !q && g === group;
                return (
                  <button key={g} onClick={() => { setPickerGroup(g); setPickerSearch(""); }} style={{ ...bs(on ? "var(--accent)" : "var(--muted)"), fontSize: 12, padding: "6px 12px", background: on ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent" }}>
                    {g} <span style={{ opacity: 0.6 }}>{all.filter(fc => factionGroup(fc) === g).length}</span>
                  </button>
                );
              })}
              <input value={pickerSearch} onChange={e => setPickerSearch(e.target.value)} placeholder="Search teams or factions" style={{ flex: "1 1 140px", minWidth: 0, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "7px 10px", fontSize: 13, fontFamily: "'Inter', sans-serif" }} />
            </div>
            {shown.length === 0 && <p style={{ ...mu, margin: "8px 0" }}>No team matches "{pickerSearch}".</p>}
            {/* dense packing pulls the rest of a row up, so the opened panel lands right under its row */}
            <div style={{ display: "grid", gridAutoFlow: "row dense", gridTemplateColumns: mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
              {shown.flatMap(fc => [
                <div key={fc.id} role="button" tabIndex={0} aria-expanded={peek === fc.id} onClick={() => pick(fc)} style={{ ...cd, cursor: "pointer", borderColor: peek === fc.id || fid === fc.id ? fc.color : "var(--line)", background: peek === fc.id ? al(fc.color, "18") : cd.background, textAlign: "center", padding: 10, minWidth: 0, overflowWrap: "anywhere", borderTop: "2px solid " + (fid === fc.id ? fc.color : al(fc.color, "60")), boxShadow: fid === fc.id ? "0 0 16px " + fc.color + "20, 0 2px 8px rgba(0,0,0,0.4)" : cd.boxShadow }}>
                  <div style={bg(fc.color)}>{fc.badge}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, fontFamily: "'Rajdhani', sans-serif", color: fid === fc.id ? fc.color : "var(--text)", letterSpacing: "0.04em" }}>{fc.name}</div>
                </div>,
                peek === fc.id ? panel(fc) : null,
              ])}
            </div>
          </div>
        );
      })()}

      {f && !pickerOpen && (
        <div className="ks-appear">
          {/* Score bar: slim, stays under the nav while you scroll. Only during a game. Its big numbers are sized as
              "22px" strings, which Text size leaves alone, so the phone bar still fits on one line at Larger. */}
          <div style={{ position: "sticky", top: navH, zIndex: 9, background: "var(--bg)", padding: "6px 0", marginBottom: 6, display: rosterLocked ? "block" : "none", transition: "top 0.2s ease-out" }}>
            <div style={{ ...cd, marginBottom: 0, padding: tinyBar ? "8px 4px" : mobile ? "8px 8px" : "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: compactBar ? 4 : 14 }}>
              {compactBar ? (
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <button className="compact-btn" onClick={() => setTp(Math.max(1, tp - 1))} disabled={tp <= 1} aria-label="Previous turning point" style={{ width: 30, height: 34, border: "1px solid var(--line)", borderRadius: 6, background: "var(--card)", color: "var(--gold)", cursor: tp <= 1 ? "default" : "pointer", opacity: tp <= 1 ? 0.35 : 1, fontSize: 16, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Back size={20} /></button>
                  <div style={{ textAlign: "center", minWidth: 30 }}>
                    <div style={{ fontSize: "11px", color: "var(--gold)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.08em", lineHeight: 1 }}><Term k="TP" style={{ color: "inherit" }}>TP</Term></div>
                    <div style={{ fontSize: "22px", color: "var(--gold)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, lineHeight: 1 }}>{tp}</div>
                  </div>
                  <button className="compact-btn" onClick={() => setTp(Math.min(gc.numTPs, tp + 1))} disabled={tp >= gc.numTPs} aria-label="Next turning point" style={{ width: 30, height: 34, border: "1px solid var(--line)", borderRadius: 6, background: "var(--card)", color: "var(--gold)", cursor: tp >= gc.numTPs ? "default" : "pointer", opacity: tp >= gc.numTPs ? 0.35 : 1, fontSize: 16, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Fwd size={20} /></button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <Term k="TP" style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>TURNING POINT</Term>
                  {Array.from({ length: gc.numTPs }, (_, k) => k + 1).map(t => (
                    <button key={t} onClick={() => setTp(t)} style={{ width: 34, height: 34, borderRadius: 6, background: tp === t ? "color-mix(in srgb, var(--gold) 13%, transparent)" : "var(--raised)", border: "2px solid " + (tp === t ? "var(--gold)" : "var(--line)"), fontSize: 16, fontWeight: 700, color: tp === t ? "var(--gold)" : "var(--muted)", fontFamily: "'Rajdhani', sans-serif", cursor: "pointer", padding: 0 }}>{t}</button>
                  ))}
                  <button onClick={handleInitiativeToggle} title="Tap to switch initiative" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6, padding: "8px 10px", borderRadius: 6, cursor: "pointer", background: hasInitiative ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "color-mix(in srgb, var(--blue) 8%, transparent)", border: "1px solid " + (hasInitiative ? "color-mix(in srgb, var(--accent) 25%, transparent)" : "color-mix(in srgb, var(--blue) 25%, transparent)"), color: hasInitiative ? "var(--accent)" : "var(--blue)", fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: hasInitiative ? "var(--accent)" : "var(--blue)" }} />{hasInitiative ? "Your initiative" : "Their initiative"}
                  </button>
                </div>
              )}
              <Stepper label={feat.labels && !compactBar ? "Command points" : "CP"} term="CP" value={cp} color={cp > 0 ? "var(--gold)" : "#B8341C"} onMinus={() => setCp(Math.max(0, cp - 1))} onPlus={() => setCp(cp + 1)} compact={compactBar} />
              {!compactBar && <Stepper label="You" term="VP" value={vpYou + computedVpYou} color="#5A9C3A" onMinus={() => setVpYou(v => (v + computedVpYou > 0 ? v - 1 : v))} onPlus={() => setVpYou(vpYou + 1)} />}
              {!compactBar && <Stepper label="Opp" term="VP" value={vpOpp + computedVpOpp} color="#B8341C" onMinus={() => setVpOpp(v => (v + computedVpOpp > 0 ? v - 1 : v))} onPlus={() => setVpOpp(vpOpp + 1)} />}
              {(compactBar || detailScoring) && <button className="compact-btn" onClick={() => setShowScoring(!showScoring)} aria-label={showScoring ? "Hide scoring" : "Show scoring"} style={{ display: "flex", alignItems: "center", gap: 6, height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid " + (showScoring ? "color-mix(in srgb, var(--accent) 38%, transparent)" : "var(--line)"), background: showScoring ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent", cursor: "pointer", flexShrink: 0 }}>
                {compactBar && <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "20px" }}><span style={{ color: "#5A9C3A" }}>{vpYou + computedVpYou}</span><span style={{ color: "var(--muted2)" }}>{"–"}</span><span style={{ color: "#E0664A" }}>{vpOpp + computedVpOpp}</span></span>}
                {!tinyBar && <span style={{ fontSize: compactBar ? "11px" : 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em", fontWeight: 700 }}>{compactBar ? "VP" : "SCORING"}</span>}
                <Arrow open={showScoring} />
              </button>}
            </div>
          </div>

          {/* Full scoring panel, opened from the score bar */}
          <div style={{ ...cd, padding: 12, marginBottom: 10, display: showScoring && rosterLocked && (compactBar || detailScoring) ? "block" : "none" }}>
            {compactBar && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <Stepper label="Your VP" term="VP" value={vpYou + computedVpYou} color="#5A9C3A" onMinus={() => setVpYou(v => (v + computedVpYou > 0 ? v - 1 : v))} onPlus={() => setVpYou(vpYou + 1)} />
                <Stepper label="Opp VP" term="VP" value={vpOpp + computedVpOpp} color="#B8341C" onMinus={() => setVpOpp(v => (v + computedVpOpp > 0 ? v - 1 : v))} onPlus={() => setVpOpp(vpOpp + 1)} />
                <button onClick={handleInitiativeToggle} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 6, cursor: "pointer", background: hasInitiative ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "color-mix(in srgb, var(--blue) 8%, transparent)", border: "1px solid " + (hasInitiative ? "color-mix(in srgb, var(--accent) 25%, transparent)" : "color-mix(in srgb, var(--blue) 25%, transparent)"), color: hasInitiative ? "var(--accent)" : "var(--blue)", fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: hasInitiative ? "var(--accent)" : "var(--blue)" }} />{hasInitiative ? "You have initiative" : "Opponent has initiative"} {"·"} switch
                </button>
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{hasInitiative ? "You gain 1CP next turning point." : "You gain 2CP next turning point."}</div>
            {!detailScoring && <FeatureHint k="scoring" text="Optional extra: detailed scoring tracks kill ops, crit ops and tac ops." style={{ fontSize: 12 }} />}
            {/* Scoring panel */}
            {showScoring && detailScoring && (
              <div style={{ marginTop: 6, paddingTop: 4 }}>
                {scoreDefs ? <MissionScoring mission={scoreMission} numTPs={gc.numTPs} tp={tp} score={missionScore} setScore={setMissionScore} /> : (<>
                {/* Primary: You */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#5A9C3A", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>YOUR PRIMARY (tap to cycle: 0 → 1 → 2VP)</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: gc.numTPs }, (_, i) => i).map(tpIdx => (
                      <div key={tpIdx} role="button" tabIndex={0} onClick={() => { const delta = cyclePrimary(primaryYou, setPrimaryYou, tpIdx); }} style={{ flex: 1, background: "var(--card)", borderRadius: 2, padding: "4px 2px", border: "1px solid " + (primaryYou[tpIdx] > 0 ? "#3D6B3F30" : "var(--raised)"), textAlign: "center", cursor: "pointer" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>TP{tpIdx + 1}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: primaryYou[tpIdx] > 0 ? "#3D6B3F" : "var(--line)", fontFamily: "monospace" }}>{primaryYou[tpIdx]}</div>
                      </div>
                    ))}
                    <div style={{ width: 36, background: "#3D6B3F10", borderRadius: 2, padding: "4px 2px", border: "1px solid #3D6B3F20", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#5A9C3A", fontFamily: "'Rajdhani', sans-serif" }}>TOTAL</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#5A9C3A", fontFamily: "monospace" }}>{primaryYou.reduce((s, v) => s + v, 0)}</div>
                    </div>
                  </div>
                </div>

                {/* Primary: Opponent */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#E0664A", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>OPPONENT PRIMARY</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: gc.numTPs }, (_, i) => i).map(tpIdx => (
                      <div key={tpIdx} role="button" tabIndex={0} onClick={() => cyclePrimary(primaryOpp, setPrimaryOpp, tpIdx)} style={{ flex: 1, background: "var(--card)", borderRadius: 2, padding: "4px 2px", border: "1px solid " + (primaryOpp[tpIdx] > 0 ? "#B8341C30" : "var(--raised)"), textAlign: "center", cursor: "pointer" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>TP{tpIdx + 1}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: primaryOpp[tpIdx] > 0 ? "#B8341C" : "var(--line)", fontFamily: "monospace" }}>{primaryOpp[tpIdx]}</div>
                      </div>
                    ))}
                    <div style={{ width: 36, background: "#B8341C10", borderRadius: 2, padding: "4px 2px", border: "1px solid #B8341C20", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#E0664A", fontFamily: "'Rajdhani', sans-serif" }}>TOTAL</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#E0664A", fontFamily: "monospace" }}>{primaryOpp.reduce((s, v) => s + v, 0)}</div>
                    </div>
                  </div>
                </div>
                </>)}

                {/* Tac Ops: You */}
                {tacOps.length > 0 && <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>YOUR TAC OPS (1VP each checkbox)</div>
                  {tacOps.map((t, opIdx) => (
                    <div key={opIdx} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, padding: "4px 6px", background: "var(--card)", borderRadius: 2, border: "1px solid var(--raised)" }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", width: 12, flexShrink: 0 }}>{opIdx + 1}</div>
                      <input type="text" value={t.name} onChange={(e) => setTacOpName(opIdx, e.target.value)} placeholder={"Tac Op " + (opIdx + 1)} style={{ flex: 1, background: "var(--raised)", border: "1px solid var(--raised)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "3px 6px", fontFamily: "'Segoe UI', sans-serif", outline: "none", minWidth: 0 }} />
                      {[0, 1].map(checkIdx => {
                        const checked = t.checks[checkIdx];
                        return (
                          <div key={checkIdx} role="button" tabIndex={0} onClick={() => toggleTacOp(opIdx, checkIdx)} style={{ width: 18, height: 18, borderRadius: 2, border: "1.5px solid " + (checked ? "var(--accent)" : "var(--raised)"), background: checked ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--accent)", cursor: "pointer", flexShrink: 0 }}>{checked ? <Icon name="check" size={10} /> : ""}</div>
                        );
                      })}
                      <div style={{ fontSize: 11, fontWeight: 700, color: t.checks.filter(Boolean).length > 0 ? "var(--accent)" : "var(--line)", fontFamily: "monospace", width: 16, textAlign: "center", flexShrink: 0 }}>{t.checks.filter(Boolean).length}</div>
                    </div>
                  ))}
                </div>}

                {/* Summary */}
                <div style={{ marginTop: 8, padding: "6px 8px", background: "var(--raised)", borderRadius: 2, border: "1px solid var(--raised)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    You: {[primarySumYou + (scoreDefs ? " mission" : " primary"), tacOps.length ? tacSum + " tac ops" : null].filter(Boolean).join(" + ")}{vpYou ? (vpYou > 0 ? " + " : " − ") + Math.abs(vpYou) + " by hand" : ""} = <span style={{ color: "#5A9C3A", fontWeight: 700 }}>{vpYou + computedVpYou}VP</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {scoreMission && scoreMission.mode === "Co-op" && scoreDefs ? "NPOs" : "Opp"}: {primarySumOpp}{scoreDefs ? " mission" : " primary"}{vpOpp ? (vpOpp > 0 ? " + " : " − ") + Math.abs(vpOpp) + " by hand" : ""} = <span style={{ color: "#E0664A", fontWeight: 700 }}>{vpOpp + computedVpOpp}VP</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        {!mobile && rosterLocked && roster.length > 0 && <TurnGuide tp={tp} numTPs={gc.numTPs} setTp={setTp} hasInitiative={hasInitiative} onInitiative={handleInitiativeToggle} cp={cp} f={f} roster={roster} getWounds={getWounds} activated={activated} orders={orders} counteracted={counteracted} setCounteracted={setCounteracted} checks={guideChecks} setChecks={setGuideChecks} onEndGame={openEndGame} />}
        {!(mobile && rosterLocked) && activeMission && <MissionPanel mref={activeMission} npoUnits={npoUnits} setNpoUnits={setNpoUnits} />}

        {/* Mobile panel toggle: building has two panels, playing has three */}
        {mobile && (!rosterLocked || roster.length > 0) && (
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {(rosterLocked ? [["cards", "Datacards"], ["roster", "Ploys & rules"], ["turn", "Turn & mission"]] : [["roster", "Build roster"], ["cards", "Datacards"]]).map(([id, label]) => (
              <button key={id} onClick={() => setMobilePanel(id)} style={{ flex: 1, padding: "10px 4px", border: "1px solid " + (mobilePanel === id ? al(f.color, "70") : "var(--line)"), borderRadius: 6, background: mobilePanel === id ? al(f.color, "18") : "transparent", color: mobilePanel === id ? "var(--text)" : "var(--muted)", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>{label}</button>
            ))}
          </div>
        )}
        {mobile && rosterLocked && mobilePanel === "turn" && (
          <div>
            <TurnGuide tp={tp} numTPs={gc.numTPs} setTp={setTp} hasInitiative={hasInitiative} onInitiative={handleInitiativeToggle} cp={cp} f={f} roster={roster} getWounds={getWounds} activated={activated} orders={orders} counteracted={counteracted} setCounteracted={setCounteracted} checks={guideChecks} setChecks={setGuideChecks} onEndGame={openEndGame} />
            {activeMission && <MissionPanel mref={activeMission} npoUnits={npoUnits} setNpoUnits={setNpoUnits} />}
          </div>
        )}

        <div style={{ display: "flex", gap: 14, flexWrap: mobile ? "wrap" : "nowrap", alignItems: "flex-start" }}>
          {/* LEFT PANEL */}
          <div style={{ width: mobile ? "100%" : 260, flexShrink: 0, display: mobile && mobilePanel !== "roster" ? "none" : "block", position: mobile ? "static" : "sticky", top: mobile ? "auto" : "calc(" + navH + " + " + barH + "px)", maxHeight: mobile ? "none" : "calc(100vh - " + navH + " - " + (barH + 10) + "px)", overflowY: mobile ? "visible" : "auto", overflowX: "hidden" }}>

            {/* Roster Section: collapsible when locked */}
            {rosterLocked ? (
              <div style={{ ...cd, padding: 10, borderColor: "#3D6B3F40", marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#5A9C3A", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Playing</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                      {v.selections}{f.composition ? "/" + f.composition.total : ""} selections {"\u2022"} {roster.length} operatives {"\u2022"} {roster.reduce((s, o) => s + o.wounds, 0)}W
                    </div>
                  </div>
                  <button onClick={() => { setRosterLocked(false); setMobilePanel("roster"); }} style={{ ...bs("var(--muted)"), fontSize: 12, padding: "8px 12px" }}>Edit roster</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Composition Rules */}
            {f.composition && (
              <div style={{ ...cd, padding: 10, borderColor: showRules ? al(f.color, "40") : "var(--line)" }}>
                <div role="button" tabIndex={0} onClick={() => setShowRules(!showRules)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ ...h3, color: "var(--accent)", marginBottom: 0 }}>TEAM COMPOSITION</div>
                  <span style={{ display: "inline-flex", marginTop: 1 }}><Arrow open={showRules} /></span>
                </div>
                {/* Quick summary always visible */}
                {f.composition.groups.filter(g => g.desc).map((g, i) => (
                  <div key={i} style={{ ...mu, fontSize: 11, marginTop: i === 0 ? 4 : 0 }}>{g.desc}</div>
                ))}
                {showRules && (
                  <div style={{ marginTop: 8 }}>
                    <div style={dv} />
                    {f.composition.rules.map((r, i) => (
                      <div key={i} style={{ fontSize: 11, color: "var(--muted)", paddingLeft: 8, borderLeft: "2px solid " + al(f.color, "25"), marginBottom: 4, lineHeight: 1.4 }}>{r}</div>
                    ))}
                    {f.composition.cost && Object.keys(f.composition.cost).length > 0 && (
                      <div style={{ fontSize: 11, color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 3%, transparent)", padding: "4px 6px", borderRadius: 2, marginTop: 6, border: "1px solid color-mix(in srgb, var(--accent) 8%, transparent)" }}>
                        <Icon name="warning" size={12} /> Selection weights: {Object.keys(f.composition.cost).map(id => opName(f, id) + " = " + (f.composition.cost[id] === 0.5 ? "\u00BD" : f.composition.cost[id])).join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Validation Status */}
            {validate && roster.length > 0 && (
              <div style={{ ...cd, padding: 10, order: mobile ? 2 : 0, borderColor: isComplete ? "#3D6B3F40" : v.errors.length > 0 ? "#B8341C40" : "color-mix(in srgb, var(--accent) 25%, transparent)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isComplete ? "#3D6B3F" : v.errors.length > 0 ? "#B8341C" : "var(--accent)" }} />
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: isComplete ? "#3D6B3F" : v.errors.length > 0 ? "#B8341C" : "var(--accent)" }}>
                    {isComplete ? "Roster complete" : v.errors.length > 0 ? "Roster has problems" : "Roster not finished"}
                  </div>
                </div>
                {v.errors.map((e, i) => (
                  <div key={"e" + i} style={{ fontSize: 11, color: "#E0664A", paddingLeft: 8, borderLeft: "2px solid #B8341C40", marginBottom: 3, lineHeight: 1.4 }}><Icon name="x" size={12} /> {e}</div>
                ))}
                {v.warnings.map((w, i) => (
                  <div key={"w" + i} style={{ fontSize: 11, color: "var(--accent)", paddingLeft: 8, borderLeft: "2px solid color-mix(in srgb, var(--accent) 25%, transparent)", marginBottom: 3, lineHeight: 1.4 }}><Icon name="warning" size={12} /> {w}</div>
                ))}
                {v.equipCount !== undefined && (
                  <div style={{ fontSize: 11, color: v.equipCount > gc.equipSlots ? "var(--accent)" : "var(--muted)", paddingLeft: 8, borderLeft: "2px solid color-mix(in srgb, var(--muted) 25%, transparent)", marginTop: 4, lineHeight: 1.4 }}>
                    Equipment: {v.equipCount}/{gc.equipSlots} selections {v.equipCount > gc.equipSlots ? "(exceeds limit)" : ""}
                  </div>
                )}
              </div>
            )}

            {/* Operatives, one section per composition group */}
            <div style={{ ...cd, padding: 10, order: mobile ? 1 : 0 }}>
              {f.composition.groups.map((g, gi) => {
                const gated = g.equip && !eq[g.equip];
                const used = compGroupUsed(f.composition, roster, g);
                return (
                <div key={gi} style={{ marginTop: gi === 0 ? 0 : 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ ...h3, color: f.color, marginBottom: 0 }}>{g.name.toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: used >= g.min && used <= g.max ? "var(--muted)" : "var(--accent)", fontFamily: "monospace" }}>{used}/{g.min === g.max ? g.max : g.min + "\u2013" + g.max}</div>
                  </div>
                  <div style={dv} />
                  {gated && <div style={{ ...mu, fontSize: 11, marginBottom: 4 }}>Select the {(f.equipment.find(q => q.id === g.equip) || {}).name} equipment to add these.</div>}
                  {f.operatives.filter(op => g.ids.includes(op.id)).map(op => {
                    const n = compCount(roster, op.id);
                    const multi = compMaxCount(f.composition, op.id) > 1;
                    const blocked = validate && !canAdd(op.id);
                    const cost = compCost(f.composition, op.id);
                    const nameEl = (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: mobile ? 15 : 11, lineHeight: mobile ? "20px" : "15px", fontWeight: n ? 700 : 400, color: n ? "var(--text)" : "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: n ? "'Rajdhani', sans-serif" : "inherit" }}>{op.name}</span>
                          {cost !== 1 && (<span style={{ fontSize: 11, color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)", padding: "0 4px", borderRadius: 2, border: "1px solid color-mix(in srgb, var(--accent) 13%, transparent)" }}>{cost === 0.5 ? "\u00BD" : "\u00D7" + cost}</span>)}
                        </div>
                        <div style={{ fontSize: mobile ? 12 : 11, color: "var(--muted)" }}>{op.wounds}W {"\u2022"} {op.save} {"\u2022"} APL {op.apl}</div>
                      </div>
                    );
                    if (multi) {
                      const btn = (on) => ({ width: mobile ? 40 : 26, height: mobile ? 40 : 26, border: "1px solid var(--line)", borderRadius: 4, background: "var(--card)", cursor: on ? "pointer" : "not-allowed", opacity: on ? 1 : 0.3, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 });
                      return (
                        <div key={op.id} style={{ display: "flex", alignItems: "center", gap: mobile ? 10 : 6, padding: mobile ? "6px 2px" : "4px 2px", borderBottom: "1px solid var(--raised)", opacity: !n && blocked ? 0.3 : 1 }}>
                          {nameEl}
                          <button onClick={() => n && removeOp(op.id)} disabled={!n} aria-label={"Remove " + op.name} style={{ ...btn(!!n), color: "#E0664A" }}>{"\u2212"}</button>
                          <div style={{ minWidth: 18, textAlign: "center", fontSize: 13, fontWeight: 700, color: n ? f.color : "var(--dim)", fontFamily: "'Rajdhani', sans-serif" }}>{n}</div>
                          <button onClick={() => !blocked && addOp(op.id)} disabled={blocked} aria-label={"Add " + op.name} style={{ ...btn(!blocked), color: "#5A9C3A" }}>+</button>
                        </div>
                      );
                    }
                    const off = !n && blocked;
                    return (
                      <div key={op.id} role="button" tabIndex={off ? -1 : 0} aria-disabled={off} onClick={() => !off && toggleOp(op.id)} style={{ display: "flex", alignItems: "center", gap: mobile ? 12 : 6, padding: mobile ? "12px 4px" : "5px 2px", minHeight: mobile ? 52 : 0, cursor: off ? "not-allowed" : "pointer", borderBottom: "1px solid var(--raised)", opacity: off ? 0.3 : 1 }}>
                        <div style={{ width: mobile ? 22 : 14, height: mobile ? 22 : 14, borderRadius: mobile ? 4 : 2, border: "1.5px solid " + (n ? f.color : "var(--raised)"), background: n ? al(f.color, "20") : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: f.color, flexShrink: 0 }}>{n ? <Icon name="check" size={mobile ? 15 : 10} /> : ""}</div>
                        {nameEl}
                      </div>
                    );
                  })}
                </div>
                );
              })}

              {/* Roster summary */}
              <div style={{ marginTop: 8, padding: "6px 0", borderTop: "1px solid color-mix(in srgb, var(--line) 19%, transparent)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: isComplete ? "#3D6B3F" : f.color, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>
                    {v.selections}{f.composition ? "/" + f.composition.total : ""} selected {"\u2022"} {roster.reduce((s, o) => s + o.wounds, 0)}W
                  </div>
                  {roster.length > 0 && (
                    <button onClick={() => { setRosterLocked(true); setMobilePanel("cards"); collapseAll(); window.scrollTo(0, 0); }} style={{ ...bs("#5A9C3A"), fontSize: 13, padding: "8px 14px" }}>Start game <Fwd /></button>
                  )}
                </div>
                {isComplete && !validate && (
                  <div style={{ textAlign: "center", fontSize: 11, color: "#5A9C3A", marginTop: 2, letterSpacing: "0.1em" }}><Icon name="check" size={12} /> Roster complete</div>
                )}
              </div>
            </div>
              </div>
            )}

            {/* Ploys: only during a game (you can read them on the team panel before that) */}
            {rosterLocked && <div style={{ ...cd, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ ...h3, color: "var(--accent)", marginBottom: 0 }}>PLOYS</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: cp > 0 ? "var(--accent)" : "#B8341C", fontFamily: "'Rajdhani', sans-serif" }}>{cp}CP {"\u2022"} TP{tp}</div>
              </div>
              <div style={dv} />
              {([...f.ploys.strategy, ...f.ploys.firefight].some(p => isOncePerBattle(p.desc)) || roster.some(op => op.abilities.some(isOncePerBattle) || [...op.ranged, ...op.melee].some(w => limitedMax(w.wr)))) && <FeatureHint k="uses" text="Some of your team's rules can only be used once per battle, or a set number of times. Use tracking, an optional extra, checks them off." style={{ fontSize: 12, marginBottom: 6 }} />}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 4, letterSpacing: "0.1em", fontFamily: "'Rajdhani', sans-serif" }}>STRATEGY (1CP)</div>
              {f.ploys.strategy.map((p, i) => {
                const used = isPloyUsed("strategy", i);
                const canUse = used || cp > 0;
                return (
                  <div key={i} role="button" tabIndex={0} onClick={() => togglePloy("strategy", i)} style={{ marginBottom: 4, padding: "4px 6px", borderRadius: 2, cursor: canUse ? "pointer" : "not-allowed", background: used ? "color-mix(in srgb, var(--accent) 3%, transparent)" : "transparent", border: "1px solid " + (used ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent"), opacity: used ? 0.5 : canUse ? 1 : 0.35 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, border: "1.5px solid " + (used ? "var(--accent)" : "var(--raised)"), background: used ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--accent)", flexShrink: 0 }}>{used ? <Icon name="check" size={10} /> : ""}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: used ? "var(--muted)" : "var(--text)", fontFamily: "'Rajdhani', sans-serif", textDecoration: used ? "line-through" : "none" }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}><RefText text={p.desc} f={f} self={p.name} /></div>
                        {ployUses("strategy", i, p)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={dv} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "#E0664A", marginBottom: 4, letterSpacing: "0.1em", fontFamily: "'Rajdhani', sans-serif" }}>FIREFIGHT (1CP)</div>
              {f.ploys.firefight.map((p, i) => {
                const used = isPloyUsed("firefight", i);
                const canUse = used || cp > 0;
                return (
                  <div key={i} role="button" tabIndex={0} onClick={() => togglePloy("firefight", i)} style={{ marginBottom: 4, padding: "4px 6px", borderRadius: 2, cursor: canUse ? "pointer" : "not-allowed", background: used ? "#B8341C08" : "transparent", border: "1px solid " + (used ? "#B8341C25" : "transparent"), opacity: used ? 0.5 : canUse ? 1 : 0.35 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, border: "1.5px solid " + (used ? "#B8341C" : "var(--raised)"), background: used ? "#B8341C20" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#E0664A", flexShrink: 0 }}>{used ? <Icon name="check" size={10} /> : ""}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: used ? "var(--muted)" : "var(--text)", fontFamily: "'Rajdhani', sans-serif", textDecoration: used ? "line-through" : "none" }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}><RefText text={p.desc} f={f} self={p.name} /></div>
                        {ployUses("firefight", i, p)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 6, padding: "4px 6px", background: "var(--card)", borderRadius: 2, border: "1px solid color-mix(in srgb, var(--line) 19%, transparent)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>COMMAND RE-ROLL (1CP)</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}>Re-roll one attack or defense die. Unlimited uses per turning point.</div>
                </div>
                <button onClick={() => { if (cp > 0) setCp(cp - 1); }} style={{ ...bs(cp > 0 ? "var(--accent)" : "var(--line)"), fontSize: 11, padding: "2px 6px", opacity: cp > 0 ? 1 : 0.3, cursor: cp > 0 ? "pointer" : "not-allowed" }}>Use (-1CP)</button>
              </div>
              {cp === 0 && (
                <div style={{ marginTop: 4, fontSize: 11, color: "#E0664A", textAlign: "center", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}><Icon name="warning" size={12} /> No command points left</div>
              )}
            </div>}


            {/* Faction Equipment */}
            <div style={{ ...cd, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ ...h3, color: "var(--accent)", marginBottom: 0 }}>FACTION EQUIPMENT</div>
                {rosterLocked && <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em" }}><Icon name="lock" size={12} /> Locked: {f.equipment.filter(q => eq[q.id]).length} SELECTED</div>}
              </div>
              <div style={dv} />
              {rosterLocked && f.equipment.filter(q => eq[q.id]).length === 0 && <div style={{ ...mu, fontSize: 11 }}>No faction equipment selected.</div>}
              {(rosterLocked ? f.equipment.filter(q => eq[q.id]) : f.equipment).map(q => {
                const canUse = canAddEquip("faction", q.id);
                return (
                <div key={q.id} role="button" tabIndex={0} onClick={() => canUse && toggleEq(q.id)} style={{ display: "flex", gap: 6, alignItems: "flex-start", padding: "4px 0", cursor: rosterLocked ? "default" : canUse ? "pointer" : "not-allowed", borderBottom: "1px solid var(--raised)", opacity: canUse ? 1 : 0.35 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 2, border: "1.5px solid " + (eq[q.id] ? "var(--accent)" : "var(--raised)"), background: eq[q.id] ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>{eq[q.id] ? <Icon name="check" size={10} /> : ""}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: eq[q.id] ? "var(--accent)" : "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>{q.name}</span>
                      {q.gw && (<span style={{ fontSize: 11, color: "#E0664A", background: "#B8341C10", padding: "0 4px", borderRadius: 2, border: "1px solid #B8341C20" }}>weapon</span>)}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}><RefText text={q.desc} f={f} self={q.name} /></div>
                    {q.gw && <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.4, marginTop: 2, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{q.gw.name.replace(/ \(equip\)$/, "")}: ATK {q.gw.atk} {"·"} HIT {q.gw.hit} {"·"} DMG {q.gw.dmg}{q.gw.wr && q.gw.wr !== "-" ? " · " + q.gw.wr : ""}</div>}
                  </div>
                </div>
                );
              })}
            </div>

            {/* Universal Equipment */}
            <div style={{ ...cd, padding: 10 }}>
              <div role={rosterLocked ? undefined : "button"} tabIndex={rosterLocked ? undefined : 0} aria-expanded={rosterLocked ? undefined : showUniv} onClick={() => !rosterLocked && setShowUniv(!showUniv)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, cursor: rosterLocked ? "default" : "pointer", minHeight: mobile && !rosterLocked ? 40 : 0 }}>
                <div style={{ ...h3, color: "var(--muted)", marginBottom: 0, flex: 1 }}>UNIVERSAL EQUIPMENT{!rosterLocked && <span style={{ color: "var(--muted2)", fontWeight: 400 }}> ({UNIV_EQUIP.length})</span>}</div>
                {rosterLocked ? (
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em" }}><Icon name="lock" size={12} /> Locked: {UNIV_EQUIP.filter(q => uEq[q.id]).length} SELECTED</div>
                ) : validate && f && f.composition && (
                  <div style={{ fontSize: 11, color: v.equipCount > gc.equipSlots ? "var(--accent)" : "var(--muted)", fontFamily: "monospace" }}>{v.equipCount}/{gc.equipSlots} slots</div>
                )}
                {!rosterLocked && <Arrow open={showUniv} />}
              </div>
              {!rosterLocked && showUniv && <div style={{ ...mu, fontSize: 11, marginBottom: 4, marginTop: 2 }}>Available to all kill teams. Grenades of the same type share 1 slot. Each option once per game.</div>}
              {(rosterLocked || showUniv || UNIV_EQUIP.some(q => uEq[q.id])) && <div style={dv} />}
              {rosterLocked && UNIV_EQUIP.filter(q => uEq[q.id]).length === 0 && <div style={{ ...mu, fontSize: 11 }}>No universal equipment selected.</div>}
              {["Explosive Grenades", "Utility Grenades", "Equipment", "Terrain"].map(cat => {
                const items = UNIV_EQUIP.filter(q => q.category === cat && ((!rosterLocked && showUniv) || uEq[q.id]));
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", marginTop: 6, marginBottom: 3, fontFamily: "'Rajdhani', sans-serif" }}>{cat.toUpperCase()}</div>
                    {items.map(q => {
                      const canUse = canAddEquip("universal", q.id);
                      return (
                      <div key={q.id} role="button" tabIndex={0} onClick={() => canUse && toggleUEq(q.id)} style={{ display: "flex", gap: 6, alignItems: "flex-start", padding: "3px 0", cursor: rosterLocked ? "default" : canUse ? "pointer" : "not-allowed", borderBottom: "1px solid var(--raised)", opacity: canUse ? 1 : 0.35 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 2, border: "1.5px solid " + (uEq[q.id] ? "var(--muted)" : "var(--raised)"), background: uEq[q.id] ? "color-mix(in srgb, var(--muted) 13%, transparent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--muted)", flexShrink: 0, marginTop: 1 }}>{uEq[q.id] ? <Icon name="check" size={10} /> : ""}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: uEq[q.id] ? "var(--text)" : "var(--muted)", fontFamily: "'Rajdhani', sans-serif" }}>{q.name}</span>
                            {q.gw && (<span style={{ fontSize: 11, color: "#E0664A", background: "#B8341C10", padding: "0 4px", borderRadius: 2, border: "1px solid #B8341C20" }}>weapon</span>)}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}>{q.desc}</div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Faction Rules */}
            <div style={{ ...cd, padding: 10 }}>
              <div style={{ ...h3, color: f.color }}>FACTION RULES</div>
              <div style={dv} />
              {f.factionRules.map((r, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}><RefText text={r.desc} f={f} self={r.name} /></div>
                </div>
              ))}
              {/* Chapter Tactics selector (Angels of Death only) */}
              {fid === "angels" && (() => {
                const tactics = [
                  { id: "aggressive", name: "Aggressive", desc: "Melee weapons gain Rending" },
                  { id: "dueler", name: "Dueler", desc: "Normal successes can block crits in melee" },
                  { id: "resolute", name: "Resolute", desc: "Ignore APL mods and Shock" },
                  { id: "stealthy", name: "Stealthy", desc: "+1 auto save when in cover" },
                  { id: "mobile", name: "Mobile", desc: "Fall Back costs -1AP; can Charge from Control Range" },
                  { id: "hardy", name: "Hardy", desc: "5+ crit defense save (extra save on 5+)" },
                  { id: "sharpshooter", name: "Sharpshooter", desc: "Stationary bolt weapons: Accurate 1, Severe" },
                  { id: "siege", name: "Siege Specialist", desc: "Ranged weapons gain Saturate" },
                ];
                const veteranOps = roster.filter(r => r.abilities && r.abilities.some(a => a.includes("Chapter Veteran")));
                return (
                  <div style={{ marginTop: 8, padding: 8, background: "var(--raised)", borderRadius: 4, border: "1px solid var(--raised)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: f.color, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em", marginBottom: 6 }}>CHAPTER TACTICS</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Choose a primary and secondary tactic for your kill team.</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 3 }}>PRIMARY</div>
                        <select value={chapterPrimary} onChange={(e) => setChapterPrimary(e.target.value)} style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "4px 6px", outline: "none" }}>
                          <option value="">Select...</option>
                          {tactics.filter(t => t.id !== chapterSecondary).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        {chapterPrimary && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{tactics.find(t => t.id === chapterPrimary)?.desc}</div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 3 }}>SECONDARY</div>
                        <select value={chapterSecondary} onChange={(e) => setChapterSecondary(e.target.value)} style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "4px 6px", outline: "none" }}>
                          <option value="">Select...</option>
                          {tactics.filter(t => t.id !== chapterPrimary).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        {chapterSecondary && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{tactics.find(t => t.id === chapterSecondary)?.desc}</div>}
                      </div>
                    </div>
                    {veteranOps.length > 0 && (
                      <div style={{ marginTop: 6, padding: "6px 8px", background: "var(--bg)", borderRadius: 2, border: "1px solid " + al(f.color, "30") }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: f.color, marginBottom: 4 }}>CHAPTER VETERAN (+1 TACTIC)</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>These operatives gain one additional Chapter Tactic:</div>
                        {veteranOps.map(op => (
                          <div key={op.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", minWidth: 80 }}>{op.name}</span>
                            <select value={chapterVeteran[op.id] || ""} onChange={(e) => setChapterVeteran(prev => ({ ...prev, [op.id]: e.target.value }))} style={{ flex: 1, background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 2, color: "var(--text)", fontSize: 11, padding: "3px 4px", outline: "none" }}>
                              <option value="">Select +1 tactic...</option>
                              {tactics.filter(t => t.id !== chapterPrimary && t.id !== chapterSecondary).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div style={{ flex: 1, minWidth: mobile ? "100%" : 320, display: mobile && mobilePanel !== "cards" ? "none" : "block" }}>
            {roster.length === 0 ? (
              <div style={{ ...cd, textAlign: "center", padding: 40, borderColor: "color-mix(in srgb, var(--line) 50%, transparent)" }}>
                <div style={{ fontSize: 14, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}>Awaiting Orders</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>Select operatives on the left to assemble your kill team. Full datacards with weapon profiles, abilities, and equipment effects will appear here.</div>
                <div style={{ marginTop: 10, fontSize: 11, color: "var(--muted)", letterSpacing: "0.3em" }}></div>
              </div>
            ) : (
              <div>
                {/* Sticky faction bar */}
                <div style={{ position: mobile ? "static" : "sticky", top: "calc(" + navH + " + " + barH + "px)", zIndex: 8, background: "var(--bg)", paddingBottom: 6 }}>
                  <div style={{ background: "linear-gradient(135deg, " + f.color + "18, var(--card))", border: "1px solid " + al(f.color, "35"), borderRadius: 4, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 3px 12px rgba(0,0,0,0.6)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      {!mobile && <div style={bg(f.color)}>{f.badge}</div>}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: f.color, fontFamily: "'Rajdhani', sans-serif" }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          {roster.filter(o => getWounds(o.id, o.wounds) > 0).length}/{roster.length} alive {"\u00b7"} {roster.reduce((s, o) => s + getWounds(o.id, o.wounds), 0)}W
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: mobile ? 6 : 3, alignItems: "center" }}>
                      {(() => {
                        const allCollapsed = roster.length > 0 && roster.every(op => cardCollapsed[op.id]);
                        return <button onClick={allCollapsed ? expandAll : collapseAll} title={allCollapsed ? "Expand all" : "Collapse all"} style={{ ...bs("var(--muted)"), fontSize: 11, padding: mobile ? "6px 8px" : "2px 5px" }}><Icon name={allCollapsed ? "chevronDown" : "chevronUp"} size={20} /></button>;
                      })()}
                      <button onClick={saveRoster} title="Save to My Rosters on this device" style={{ ...bs("#5A9C3A"), fontSize: 11, padding: mobile ? "5px 8px" : "2px 7px", display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>Save
                      </button>
                      {rosterLocked && <button data-logbtn="true" onClick={() => openLog()} aria-label={"Battle log" + (unreadHits ? ", " + unreadHits + " new" : "")} title="Every hit this game" style={{ ...bs("var(--blue)"), fontSize: 11, padding: mobile ? "5px 8px" : "2px 7px", display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
                        {unreadHits > 0 && <span data-unread={unreadHits} aria-hidden="true" style={{ position: "absolute", top: -7, right: -7, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 9, background: "var(--miss)", color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: "17px", textAlign: "center", fontFamily: "'Rajdhani', sans-serif" }}>{unreadHits}</span>}<Icon name="log" size={12} />Log</button>}
                      <div style={{ position: "relative" }}>
                        <button onClick={() => setCardsMenu(!cardsMenu)} aria-label="More roster options" aria-expanded={cardsMenu} style={{ ...bs("var(--muted)"), fontSize: 16, lineHeight: 1, padding: mobile ? "6px 10px" : "2px 8px" }}>{"\u22EF"}</button>
                        {cardsMenu && (
                          <div>
                            <div onClick={() => setCardsMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                            <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 41, minWidth: 220, background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", padding: 6 }}>
                              {[
                                ["Share roster code", "Copy a code a friend can import", exportRoster],
                                ["Print roster", "Datacards on paper", printRoster],
                                oppRoster && mp.status !== "connected" ? ["Remove opponent's team", "Clears their cards and wounds", () => withUndo("Opponent removed", () => { setOppRoster(null); setOppWounds({}); setShowImport(false); })] : null,
                                !oppRoster && mp.status !== "connected" ? ["Add enemy roster", "Pick their team and operatives, no code needed", () => setAddingOpp(true)] : null,
                                !oppRoster ? ["Import a roster", "Load an opponent's or your own code", () => { setShowImport(true); setTimeout(() => { const el = document.getElementById("ks-import"); if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 60); }] : null,
                              ].filter(Boolean).map(([label, hint, run]) => (
                                <button key={label} className={label === "Print roster" ? "no-print" : undefined} onClick={() => { setCardsMenu(false); run(); }} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderRadius: 4, padding: "10px 10px", cursor: "pointer" }}>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>{label}</div>
                                  <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Inter', sans-serif" }}>{hint}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {isComplete && <span title="Roster complete" style={{ color: "#5A9C3A" }}><Icon name="check" size={16} /></span>}
                    </div>
                  </div>
                </div>
                {/* Desktop import dialog */}
                {!mobile && showImport && !oppRoster && (
                  <div id="ks-import" style={{ ...cd, padding: 12, marginBottom: 8, borderColor: "color-mix(in srgb, var(--blue) 19%, transparent)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[["opponent", "Opponent"], ["mine", "My roster"]].map(([mode, label]) => (
                          <button key={mode} onClick={() => setImportMode(mode)} style={{ ...bs(importMode === mode ? (mode === "opponent" ? "#B8341C" : "var(--accent)") : "var(--muted)"), fontSize: 13, padding: "8px 12px", background: importMode === mode ? (mode === "opponent" ? "#B8341C15" : "color-mix(in srgb, var(--accent) 8%, transparent)") : "transparent" }}>{label}</button>
                        ))}
                      </div>
                      <button onClick={() => setShowImport(false)} style={{ ...bs("var(--muted)"), fontSize: 13, padding: "8px 12px" }} title="Close"><Icon name="x" size={13} /></button>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{importMode === "opponent" ? "Paste opponent's roster code:" : "Paste a roster code to load as your team:"}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input type="text" value={importCode} onChange={(e) => setImportCode(e.target.value)} placeholder="Paste roster code here..." style={{ flex: 1, background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", fontSize: 13, padding: "8px 12px", fontFamily: "'Segoe UI', sans-serif", outline: "none" }} />
                      <button onClick={() => {
                        if (importMode === "mine") {
                          const err = importMyRoster(importCode);
                          if (err) setImportError(err);
                          else { setShowImport(false); setImportCode(""); setImportError(""); }
                        } else {
                          importOpponent();
                        }
                      }} style={{ ...bs(importMode === "opponent" ? "#B8341C" : "var(--accent)"), fontSize: 13, padding: "8px 12px" }}>Import</button>
                    </div>
                    {importError && <div style={{ fontSize: 13, color: "#E0664A", marginTop: 4 }}><Icon name="x" size={12} /> {importError}</div>}
                  </div>
                )}
                {[...roster].sort((a, b) => {
                  const aAlive = getWounds(a.id, a.wounds) > 0 ? 0 : 1;
                  const bAlive = getWounds(b.id, b.wounds) > 0 ? 0 : 1;
                  return aAlive - bAlive;
                }).map(op => {
                  const result = getEquipForOp(op);
                  return (<Datacard key={op.id} op={op} f={f} fc={f.color} equipWeapons={result.weapons} equipEffects={result.effects} curWounds={getWounds(op.id, op.wounds)} onWound={(delta) => { logMine(op, delta, "hand"); setOpWounds(op.id, op.wounds, delta); }} collapsed={cardCollapsed[op.id] || false} onToggle={() => toggleCardCollapse(op.id)} ignoreInjured={result.ignoreInjured} cp={cp} setCp={setCp} isActivated={activated[op.id] || false} onActivate={() => setActivated(prev => ({ ...prev, [op.id]: !prev[op.id] }))} requestFight={(o, w) => startFight("mine", o, w)} requestShoot={(o, w) => startShot("mine", o, w)} scars={scars["mine:" + op.id]} order={orders[op.id] || "conceal"} onOrder={() => setOrders(prev => ({ ...prev, [op.id]: prev[op.id] === "engage" ? "conceal" : "engage" }))} uses={feat.uses ? battleUses : null} setUse={(k, n) => setBattleUses(prev => ({ ...prev, [k]: n }))} carried={carried[op.id]} onCarried={(list) => setCarried(prev => ({ ...prev, [op.id]: list }))} />);
                })}

              </div>
            )}
          </div>

          {/* OPPONENT PANEL: third column on desktop, below on mobile */}
          {!mobile && roster.length > 0 && (
            <div style={{ width: oppRoster ? 320 : 0, flexShrink: 0, transition: "width 0.3s", overflow: "hidden" }}>
              {oppRoster ? (
                <div style={{ width: 320 }}>
                  <div style={{ position: "sticky", top: "calc(" + navH + " + " + barH + "px)", maxHeight: "calc(100vh - " + navH + " - " + (barH + 10) + "px)", overflowY: "auto", overflowX: "hidden" }}>
                    <div style={{ background: "linear-gradient(135deg, " + "#B8341C" + "18, var(--card))", border: "1px solid " + al("#B8341C", "35"), borderRadius: 4, padding: "8px 12px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#E0664A", fontFamily: "'Rajdhani', sans-serif" }}>{oppF ? oppF.name : "Opponent"}</div>
                        <div style={{ fontSize: 13, color: "var(--muted)" }}>{oppRoster.operatives.reduce((s, o) => s + getOppWounds(o.id, o.wounds), 0)}W alive {"\u2022"} {oppRoster.operatives.filter(o => getOppWounds(o.id, o.wounds) <= 0).length} dead</div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {(() => {
                          const allOppCollapsed = oppRoster.operatives.every(op => oppCollapsed[op.id]);
                          return <button onClick={() => { if (allOppCollapsed) setOppCollapsed({}); else { const c = {}; oppRoster.operatives.forEach(op => { c[op.id] = true; }); setOppCollapsed(c); } }} style={{ ...bs("var(--muted)"), fontSize: 13, padding: "8px 12px" }}><Icon name={allOppCollapsed ? "chevronDown" : "chevronUp"} size={20} /></button>;
                        })()}
                      </div>
                    </div>
                    {oppRoster.operatives.map(op => {
                      const result = oppEquip(op);
                      const oCollapsed = oppCollapsed[op.id] || false;
                      return (<Datacard key={"opp-" + op.id} side="opp" narrow op={op} f={oppF} fc={oppF ? oppF.color : "var(--muted)"} equipWeapons={result.weapons} equipEffects={result.effects} curWounds={getOppWounds(op.id, op.wounds)} onWound={(delta) => { logOpp(op, delta, "hand"); if (mp && mp.status === "connected" && delta < 0) { mp.send({ type: "applyRemoteDamage", opId: op.id, amount: -delta }); } else if (mp && mp.status === "connected" && delta > 0) { mp.send({ type: "applyRemoteHeal", opId: op.id, amount: delta }); } else { setOppWound(op.id, op.wounds, delta); if (delta) mp.sendOrQueue({ type: delta < 0 ? "applyRemoteDamage" : "applyRemoteHeal", opId: op.id, amount: Math.abs(delta) }); } }} collapsed={oCollapsed} onToggle={() => setOppCollapsed(prev => ({ ...prev, [op.id]: !oCollapsed }))} ignoreInjured={result.ignoreInjured} cp={0} setCp={() => {}} requestFight={mp && mp.status === "connected" ? undefined : (o, w) => startFight("opp", o, w)} requestShoot={mp && mp.status === "connected" ? undefined : (o, w) => startShot("opp", o, w)} scars={scars["opp:" + op.id]} />);
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Mobile: import + opponent below datacards */}
          {mobile && roster.length > 0 && mobilePanel === "cards" && (showImport || oppRoster) && (
            <div style={{ width: "100%" }}>
                {/* Import Opponent */}
                <div id="ks-import" style={{ marginTop: 12 }}>
                  <div role="button" tabIndex={0} onClick={() => setShowImport(!showImport)} style={{ ...cd, padding: "8px 12px", cursor: "pointer", borderColor: oppRoster ? "#B8341C40" : showImport ? "color-mix(in srgb, var(--blue) 25%, transparent)" : "var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: oppRoster ? "#B8341C" : "var(--blue)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em" }}>
                      {oppRoster ? "Opponent: " + (oppF ? oppF.name : "team") + " (" + oppRoster.operatives.length + ")" : "Import a roster"}
                    </div>
                    <span style={{ display: "inline-flex", marginTop: 1 }}><Arrow open={showImport} /></span>
                  </div>

                  {showImport && !oppRoster && (
                    <div style={{ ...cd, padding: 12, borderColor: "color-mix(in srgb, var(--blue) 19%, transparent)" }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                        {[["opponent", "Opponent"], ["mine", "My roster"]].map(([mode, label]) => (
                          <button key={mode} onClick={() => setImportMode(mode)} style={{ ...bs(importMode === mode ? (mode === "opponent" ? "#B8341C" : "var(--accent)") : "var(--muted)"), fontSize: 13, padding: "8px 12px", flex: 1, background: importMode === mode ? (mode === "opponent" ? "#B8341C15" : "color-mix(in srgb, var(--accent) 8%, transparent)") : "transparent" }}>{label}</button>
                        ))}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{importMode === "opponent" ? "Paste opponent's roster code:" : "Paste a roster code to load as your team:"}</div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <input type="text" value={importCode} onChange={(e) => setImportCode(e.target.value)} placeholder="Paste roster code here..." style={{ flex: 1, background: "var(--raised)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", fontSize: 13, padding: "8px 12px", fontFamily: "'Segoe UI', sans-serif", outline: "none" }} />
                        <button onClick={() => {
                          if (importMode === "mine") {
                            const err = importMyRoster(importCode);
                            if (err) setImportError(err);
                            else { setShowImport(false); setImportCode(""); setImportError(""); }
                          } else {
                            importOpponent();
                          }
                        }} style={{ ...bs(importMode === "opponent" ? "#B8341C" : "var(--accent)"), fontSize: 13, padding: "8px 12px" }}>Import</button>
                      </div>
                      {importError && <div style={{ fontSize: 13, color: "#E0664A" }}><Icon name="x" size={12} /> {importError}</div>}
                    </div>
                  )}

                  {oppRoster && showImport && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontSize: 13, color: "var(--muted)" }}>
                          {oppRoster.operatives.reduce((s, o) => s + getOppWounds(o.id, o.wounds), 0)}W alive {"\u2022"} {oppRoster.operatives.filter(o => getOppWounds(o.id, o.wounds) <= 0).length} dead
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {(() => {
                            const allOppCollapsed = oppRoster.operatives.length > 0 && oppRoster.operatives.every(op => oppCollapsed[op.id]);
                            return <button onClick={() => { if (allOppCollapsed) setOppCollapsed({}); else { const c = {}; oppRoster.operatives.forEach(op => { c[op.id] = true; }); setOppCollapsed(c); } }} style={{ ...bs("var(--muted)"), fontSize: 13, padding: "8px 12px" }}><Icon name={allOppCollapsed ? "chevronDown" : "chevronUp"} size={20} /></button>;
                          })()}
                        </div>
                      </div>
                      {oppRoster.operatives.map(op => {
                        const result = oppEquip(op);
                        const oCollapsed = oppCollapsed[op.id] || false;
                        return (<Datacard key={"opp-m-" + op.id} side="opp" op={op} f={oppF} fc={oppF ? oppF.color : "var(--muted)"} equipWeapons={result.weapons} equipEffects={result.effects} curWounds={getOppWounds(op.id, op.wounds)} onWound={(delta) => { logOpp(op, delta, "hand"); if (mp && mp.status === "connected" && delta < 0) { mp.send({ type: "applyRemoteDamage", opId: op.id, amount: -delta }); } else if (mp && mp.status === "connected" && delta > 0) { mp.send({ type: "applyRemoteHeal", opId: op.id, amount: delta }); } else { setOppWound(op.id, op.wounds, delta); if (delta) mp.sendOrQueue({ type: delta < 0 ? "applyRemoteDamage" : "applyRemoteHeal", opId: op.id, amount: Math.abs(delta) }); } }} collapsed={oCollapsed} onToggle={() => setOppCollapsed(prev => ({ ...prev, [op.id]: !oCollapsed }))} ignoreInjured={result.ignoreInjured} cp={0} setCp={() => {}} requestFight={mp && mp.status === "connected" ? undefined : (o, w) => startFight("opp", o, w)} requestShoot={mp && mp.status === "connected" ? undefined : (o, w) => startShot("opp", o, w)} scars={scars["opp:" + op.id]} />);
                      })}
                    </div>
                  )}
                </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}

