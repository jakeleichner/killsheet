/* ═══ YOUR KILLSHEET (what the app shows) ═══ */
// Parts of the app a player can switch on or off. "Learning" and "I know the game" set them all at once;
// any switch can be changed after. Switching something off only hides it: nothing saved is lost.
const FEATURE_PRESETS = {
  learning: { guide: true, labels: true, tips: true, dice: true, fx: true, awake: true, uses: false, scoring: false, missions: false, campaign: false, online: true },
  expert: { guide: false, labels: false, tips: true, dice: true, fx: true, awake: true, uses: true, scoring: true, missions: true, campaign: true, online: true },
};
const FEATURE_MODE_NAMES = { learning: "Learning", expert: "I know the game", custom: "Custom" };
const FEATURE_GROUPS = [
  { title: "While you play", items: [
    { k: "guide", name: "Turning point guide opens by itself", desc: "The step-by-step guide opens at the start of every turning point, so you can follow along. With it off, the guide stays the way you left it." },
    { k: "labels", name: "Learning help", desc: "Labels on closed datacards, a dotted underline under words you can tap for an explanation, and an ⓘ next to the Ready and order buttons." },
    { k: "tips", name: "Rule tips", desc: "Tap a bold orange word, or hover over it on a computer, to see what it means in one sentence, with a link to more information in Rules." },
    { k: "dice", name: "Dice roller", desc: "A Shoot button on ranged weapons and a Fight button on melee weapons. Pick the target, roll the dice, and the damage goes on. Online, each player rolls on their own device. Rolls named in rules, like D3 or D6, can be tapped to roll them." },
    { k: "fx", name: "Attack animations", desc: "Shots, slashes, blasts and the damage number when an attack lands, on both players' screens. If your phone is set to reduce motion (on iPhone: Settings, Accessibility, Motion), you get a red glow instead." },
    { k: "awake", name: "Keep the screen on", desc: "While a game is in progress, your phone or tablet doesn't dim or lock. It goes back to normal when the game ends. Uses a little more battery." },
    { k: "uses", name: "Use tracking", desc: "Checkboxes for once-per-battle abilities and ploys, limited weapons and grenades, so you know what's been used." },
  ] },
  { title: "Scoring", items: [
    { k: "scoring", name: "Detailed scoring", desc: "Primary points for each turning point, your opponent's primary points, and tac ops. With it off, you keep a simple count of victory points." },
  ] },
  { title: "Beyond a standard game", items: [
    { k: "missions", name: "Mission packs", desc: "Games Workshop's free missions: maps, special rules, and solo or co-op games against computer-run enemies, with trackers for them." },
    { k: "campaign", name: "Campaign", desc: "The Ctesiphus Expedition: link your games into a campaign on a hex map." },
    { k: "online", name: "Play online", desc: "Link up with a friend on another device and see each other's teams live." },
  ] },
];
// "What is this?" for each switch: what it is, what you need, and how it changes a standard game.
// Written from Games Workshop's free downloads; anything that needs a paid product says so.
const FEATURE_EXPLAIN = {
  dice: {
    what: "Ranged weapons get a Shoot button and melee weapons a Fight button. Pick the target, roll (or enter the real dice you rolled), and KillSheet applies the weapon's rules, works out the damage and takes it off the operative.",
    need: "Nothing extra. To attack your opponent's operatives, their team needs to be in KillSheet: imported, or playing online.",
    changes: "The rules are the same as rolling real dice. Online, each player rolls their own dice on their own device, and both screens show the whole attack.",
  },
  uses: {
    what: "Some abilities, ploys and weapons can only be used once per battle, or a set number of times (Limited weapons, explosive grenades). Use tracking adds checkboxes so you can mark them used.",
    need: "Nothing extra.",
    changes: "No rules change. It saves you remembering what's gone, which matters more once you play teams with several once-per-battle rules.",
  },
  scoring: {
    what: "In Games Workshop's Approved Ops missions you score victory points in several ways: a kill op for taking out enemy operatives, a crit op for the objectives on the map, and a tac op you pick from your team's archetypes. You also choose one of them as your primary op. Detailed scoring lets you track points turning point by turning point, for you and your opponent, instead of keeping one total.",
    need: "The Approved Ops mission pack and its cards, sold by Games Workshop. KillSheet can't list them, because they aren't free.",
    changes: "Instead of one score, you keep an eye on several goals at once, and some only score at certain times. Your team's archetypes (shown when you pick a team) decide which tac ops you can choose.",
  },
  missions: {
    what: "Games Workshop's free mission packs: 40 missions with their own maps, special rules and ways to win. Most are co-op or solo games against computer-run enemies (NPOs), and some are head-to-head.",
    need: "Terrain for the pack's killzone (most use Killzone: Volkus or Killzone: Tomb World, but the packs say you can use your own), and models to stand in for the enemies in co-op missions. The rules are free and all in KillSheet.",
    changes: "A mission replaces the standard game's setup and scoring: it sets the map, adds actions and rules, and says how you win. In co-op missions the enemies act by drawing cards, which KillSheet can draw for you, and you track their wounds here.",
  },
  campaign: {
    what: "The Ctesiphus Expedition: a free campaign that links your games together on a hex map. Between battles you explore, gather Supply, set up camps and race a rising threat level. It works solo, co-op or with a group.",
    need: "Time for several games. Each battle is a normal game of Kill Team. KillSheet keeps the map, the rolls and the records.",
    changes: "Your games stop standing alone: where you are on the map decides each battle, and each result feeds back into the campaign.",
  },
  online: {
    what: "Link KillSheet with a friend's device. You each see the other's team and datacards live, damage you apply shows on both, and there's a chat.",
    need: "A friend with KillSheet open on another phone or computer, and an internet connection. You still play on a real table.",
    changes: "The turning point and initiative stay in step on both devices. You each keep your own command points and victory points.",
  },
  validation: {
    what: "Checks your roster against your team's building rules as you pick operatives: how many of each you can take, the leader, and equipment limits.",
    need: "Nothing extra.",
    changes: "With it off you can pick any operatives, for practice games or trying models out. Leave it on for a legal team.",
  },
};
const featureMode = (feat) => Object.keys(FEATURE_PRESETS).find(m => Object.keys(FEATURE_PRESETS[m]).every(k => !!feat[k] === FEATURE_PRESETS[m][k])) || "custom";
const FeatureCtx = React.createContext({ feat: FEATURE_PRESETS.expert, setFeat: () => {}, setMode: () => {}, validate: true, setValidate: () => {}, appearance: { theme: "default", matchTeam: false }, setAppearance: () => {}, teamColor: null, openFeatures: () => {}, openRule: () => {} });
// Saved switches fill in any newer switch from the preset they match, so adding a switch doesn't turn a preset into Custom.
const presetOf = (saved) => Object.keys(FEATURE_PRESETS).find(m => Object.keys(saved).every(k => !(k in FEATURE_PRESETS[m]) || !!saved[k] === FEATURE_PRESETS[m][k])) || "expert";
// Players with KillSheet data from before these switches existed keep everything on and aren't asked.
function isReturningPlayer() {
  const s = snapshotKillSheetStorage();
  const has = (k, empty) => s[LS_PREFIX + k] !== undefined && s[LS_PREFIX + k] !== empty;
  return has("fid", "null") || has("roster", "[]") || has("savedRosters", "[]") || has("gameHistory", "[]") || has("campaign", "null") || s[LS_PREFIX + "tutorialSeen"] === "true";
}

// "Detailed scoring is off. What is it?" where a switched-off feature would appear.
function FeatureHint({ k, text, style }) {
  const { feat, openFeatures } = React.useContext(FeatureCtx);
  if (feat[k]) return null;
  return (
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45, ...style }}>
      {text} <button className="link-btn" onClick={(e) => { e.stopPropagation(); openFeatures(k); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontSize: 13, textDecoration: "underline" }}>What is it?</button>
    </div>
  );
}

function Switch({ on, onChange, label }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 6, cursor: "pointer", flexShrink: 0, border: "1px solid " + (on ? "#5A9C3A" : "var(--line)"), background: on ? "#5A9C3A20" : "transparent", color: on ? "#7CC05C" : "var(--muted)", fontSize: 13, fontWeight: 600 }}>
      <span style={{ width: 30, height: 16, borderRadius: 8, background: on ? "#5A9C3A" : "var(--line)", position: "relative", display: "inline-block" }}><span style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 12, height: 12, borderRadius: "50%", background: "var(--text)", transition: "left 0.15s" }} /></span>
      {on ? "On" : "Off"}
    </button>
  );
}

// The two starting choices, used by the first-time question and the Settings page.
function ModeChoice({ mode, onPick, full }) {
  const opt = (id, title, text, offText) => {
    const on = mode === id;
    return (
      <button key={id} onClick={() => onPick(id)} aria-pressed={on} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 14px", marginBottom: 8, borderRadius: 6, cursor: "pointer", border: "1px solid " + (on ? "var(--accent)" : "var(--line)"), background: on ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--card)" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: on ? "var(--accent)" : "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45, marginTop: 2 }}>{text}</div>
        {full && offText && <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.45, marginTop: 6 }}>{offText}</div>}
      </button>
    );
  };
  return (
    <div>
      {opt("learning", "I'm learning", "Start with your team, datacards, points and a step-by-step guide for each turning point.", "Extras you can add later: detailed scoring, mission packs, the campaign and use tracking. They're in Settings, the cog at the top.")}
      {opt("expert", "I know the game", "Everything switched on.", "Turn anything off later from the same place.")}
    </div>
  );
}

// Asked once, the first time a new player opens the app.
function Welcome() {
  const { setMode } = React.useContext(FeatureCtx);
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="New to Kill Team?" style={{ position: "fixed", inset: 0, zIndex: 9500, background: "rgba(8,9,12,0.85)", overflowY: "auto", display: "flex", padding: "24px 16px", color: "var(--text)", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div className="ks-appear" style={{ ...cd, margin: "auto", width: "100%", maxWidth: 480, padding: 18, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Logo size={20} /></div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>New to Kill Team?</div>
        <p style={{ ...mu, fontSize: 14, margin: "4px 0 14px" }}>Pick how much KillSheet shows. You can change it any time.</p>
        <ModeChoice mode={null} onPick={setMode} full />
      </div>
    </div>,
    document.body
  );
}

// Every switch in one place, opened from the Battle tab's ⋯ menu and from the Rules tab.
// Appearance: theme tiles, each drawn in its own colors, then Text size and the Match my team switch.
function AppearancePicker() {
  const { appearance, setAppearance, teamColor, teamId } = React.useContext(FeatureCtx);
  const pick = (k) => setAppearance(a => ({ ...a, theme: k }));
  const theme = THEMES[appearance.theme] || THEMES.default;
  const teamCol = teamColor ? teamAccent(teamColor, theme) : null; // the team's color as the Battle tab would show it
  const battleCol = appearance.matchTeam && teamCol ? teamCol : theme.vars.accent;
  return (
    <div>
      <div role="radiogroup" aria-label="Theme" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
        {Object.entries(THEMES).map(([k, t]) => {
          const v = t.vars, on = appearance.theme === k;
          return (
            <button key={k} role="radio" aria-checked={on} aria-label={t.name} onClick={() => pick(k)} style={{ textAlign: "left", padding: 6, borderRadius: 8, cursor: "pointer", background: "var(--card)", border: "2px solid " + (on ? "var(--accent)" : "var(--line)") }}>
              <div aria-hidden="true" style={{ background: v.bg, border: "1px solid " + v.line, borderRadius: 5, padding: 6 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", color: v.text }}>KILL<span style={{ color: v.accent }}>SHEET</span></div>
                <div style={{ background: v.card, border: "1px solid " + v.line, borderLeft: "3px solid #3B6FD4", borderRadius: 3, padding: "4px 6px", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ flex: 1, height: 4, borderRadius: 2, background: v.muted, opacity: 0.6 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: v.accent, border: "1px solid " + v.accent, borderRadius: 3, padding: "0 4px", fontFamily: "'Rajdhani', sans-serif" }}>ROLL</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{t.name}</span>
                {on && <span style={{ color: "var(--accent)", display: "inline-flex" }}><Icon name="check" size={14} /></span>}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.desc}</div>
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 0 0", marginTop: 10, borderTop: "1px solid var(--raised)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Text size</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45, marginTop: 2 }}>Bigger text for reading across the table. Every screen follows it.</div>
        <div role="radiogroup" aria-label="Text size" style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {[["normal", "Normal"], ["large", "Large"], ["larger", "Larger"]].map(([k, label]) => {
            const on = (appearance.text || "normal") === k;
            return (
              <button key={k} role="radio" aria-checked={on} aria-label={label} onClick={() => setAppearance(a => ({ ...a, text: k }))}
                style={{ flex: "1 1 90px", padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: on ? "color-mix(in srgb, var(--accent) 12%, var(--card))" : "var(--card)", border: "2px solid " + (on ? "var(--accent)" : "var(--line)"), color: "var(--text)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span aria-hidden="true" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: Math.round(16 * TEXT_SIZES[k] / TEXT_SCALE), lineHeight: 1.1 }}>Aa</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: on ? "var(--accent)" : "var(--text2)" }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", marginTop: 10, borderTop: "1px solid var(--raised)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Match my team</div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45, marginTop: 2 }}>On the Battle tab, buttons and highlights take your team's color, on top of your theme. A few team colors are adjusted so they stay readable and don't look like dice or damage colors.</div>
          {/* What the switch does right now, with a sample Battle-tab button in the color it gives. */}
          <div data-match-preview="true" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span aria-hidden="true" style={{ ...bs(battleCol), padding: "5px 10px", fontSize: 12, background: al(battleCol, "18"), pointerEvents: "none" }}>Shoot</span>
            <span style={{ fontSize: 12, color: "var(--muted)", flex: "1 1 160px", lineHeight: 1.4 }}>
              {!teamCol ? "Pick a team in Battle to see its color here."
                : appearance.matchTeam ? "On: the Battle tab uses the " + FACTIONS[teamId].name + " color."
                : "Off: the Battle tab uses your theme's color. Turn it on to use the " + FACTIONS[teamId].name + " color."}
            </span>
          </div>
        </div>
        <Switch on={!!appearance.matchTeam} onChange={(v) => setAppearance(a => ({ ...a, matchTeam: v }))} label="Match my team" />
      </div>
    </div>
  );
}

function FeaturesPage({ onClose, focus, onNews }) {
  const { feat, setFeat, setMode, validate, setValidate } = React.useContext(FeatureCtx);
  const mode = featureMode(feat);
  const [explain, setExplain] = useState(typeof focus === "string" ? { [focus]: true } : {});
  React.useEffect(() => {
    const el = typeof focus === "string" && document.getElementById("feat-" + focus);
    if (el) el.scrollIntoView({ block: "center" });
  }, [focus]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const row = (key, name, desc, on, set) => {
    const ex = FEATURE_EXPLAIN[key];
    return (
      <div key={key} id={"feat-" + key} style={{ padding: "12px 0", borderTop: "1px solid var(--raised)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{name}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45, marginTop: 2 }}>{desc}</div>
            {key === "fx" && on && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches && <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 4 }}>This device is set to reduce motion right now, so attacks show the red glow.</div>}
            {ex && <button className="link-btn" aria-expanded={!!explain[key]} onClick={() => setExplain(x => ({ ...x, [key]: !x[key] }))} style={{ background: "none", border: "none", padding: 0, marginTop: 4, cursor: "pointer", color: "var(--accent)", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>{explain[key] ? "Hide" : "What is this?"}</button>}
          </div>
          <Switch on={on} onChange={set} label={name} />
        </div>
        {ex && explain[key] && (
          <div className="ks-appear" style={{ marginTop: 8, padding: "10px 12px", background: "var(--card)", borderRadius: 6, borderLeft: "3px solid var(--accent)", fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
            {[["What it is", ex.what], ["What you need", ex.need], ["How it changes your game", ex.changes]].map(([h, t]) => (
              <p key={h} style={{ margin: "0 0 6px" }}><strong style={{ color: "var(--text)" }}>{h}:</strong> {t}</p>
            ))}
          </div>
        )}
      </div>
    );
  };
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="Settings" style={{ position: "fixed", inset: 0, zIndex: 9000, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div className="ks-appear" style={{ maxWidth: 560, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Settings</div>
          <button onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        {onNews && <button onClick={onNews} style={{ ...bs("var(--blue)"), width: "100%", marginTop: 12, padding: "10px 12px", fontSize: 14, display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}><span style={{ flex: 1 }}>What's new</span><span style={{ fontSize: 12, color: "var(--muted)", textTransform: "none", letterSpacing: 0 }}>{newsDate(CHANGELOG[0].date)}</span></button>}
        <div style={{ ...h3, color: "var(--accent)", margin: "14px 0 8px" }}>APPEARANCE</div>
        <AppearancePicker />
        <div style={{ ...h3, color: "var(--accent)", margin: "14px 0 4px" }}>WHAT KILLSHEET SHOWS</div>
        <p style={{ ...mu, fontSize: 14, margin: "0 0 14px" }}>Choose what KillSheet shows. Switch things on as you're ready for them. Switching something off only hides it, so nothing you've saved is lost.</p>
        <ModeChoice mode={mode} onPick={setMode} />
        {mode === "custom" && <p style={{ ...mu, fontSize: 13, margin: "0 0 8px" }}>Custom: you've picked your own switches.</p>}
        {FEATURE_GROUPS.map(g => (
          <div key={g.title}>
            <div style={{ ...h3, color: "var(--accent)", margin: "18px 0 4px" }}>{g.title.toUpperCase()}</div>
            {g.items.map(it => row(it.k, it.name, it.desc, !!feat[it.k], (v) => setFeat(it.k, v)))}
          </div>
        ))}
        <div style={{ ...h3, color: "var(--accent)", margin: "18px 0 4px" }}>BUILDING YOUR TEAM</div>
        {row("validation", "Roster validation", "Checks your roster against the team's rules while you build it, so it's legal to play.", validate, setValidate)}
        <button onClick={onClose} style={{ ...bs("var(--accent)"), width: "100%", padding: "12px 0", marginTop: 16, fontSize: 14, background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}>Done</button>
      </div>
    </div>,
    document.body
  );
}

