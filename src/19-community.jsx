/* ═══ COMMUNITY ROSTERS (preview until the backend is built) ═══ */
const COMMUNITY_EXAMPLES = [
  { name: "Stalker Overwatch", faction: "angels", votes: 24, ops: 6, note: "Two stalker bolt rifles on Vantage, the rest hold the middle." },
  { name: "Choppa Rush", faction: "kommandos", votes: 17, ops: 10, note: "Smoke, then charge everything. Bomb Squig opens the door." },
  { name: "Poison Wall", faction: "plaguemarines", votes: 9, ops: 6, note: "Slow and tough. Stack Poison and sit on objectives." },
];

function CommunityRosters() {
  const mobile = useIsMobile();
  const steps = [
    ["Save your roster", "In the Battle tab, tap Save on your datacards bar and give it a name."],
    ["Copy its code", "In the team list under My saved rosters, tap ⋯ then Copy code."],
    ["Send the code", "Paste it into a message to your friend."],
    ["They import it", "In their Battle tab: Import a roster, choose My roster or Opponent, and paste."],
  ];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em", marginBottom: 4 }}>Community Rosters</div>
      <p style={mu}>A shared board where players post rosters, browse by team, and vote for the ones that work.</p>

      <div style={{ ...cd, padding: 14, marginTop: 14, borderLeft: "3px solid var(--gold)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={bg("var(--gold)")}>Coming soon</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>The board isn't live yet. Below is a preview of how it will look. Posting and voting arrive with the next big update, along with sign-in so your saved rosters follow you between devices.</div>
      </div>

      <div style={{ ...h3, color: "var(--accent)", margin: "22px 0 8px" }}>Share a roster today</div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, minmax(0, 1fr))", gap: 8 }}>
        {steps.map(([title, text], i) => (
          <div key={i} style={{ ...cd, padding: 12, marginBottom: 0, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "color-mix(in srgb, var(--accent) 13%, transparent)", color: "var(--accent)", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Rajdhani', sans-serif" }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginTop: 2 }}>{text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "26px 0 8px" }}>
        <div style={{ ...h3, color: "var(--accent)", marginBottom: 0 }}>Preview</div>
        <span style={{ fontSize: 12, color: "var(--muted2)" }}>example posts, not real yet</span>
      </div>
      <div aria-hidden="true" style={{ opacity: 0.75, pointerEvents: "none" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {["All teams", "Imperium", "Chaos", "Xenos"].map((t, i) => <span key={t} style={{ ...bs(i === 0 ? "var(--accent)" : "var(--muted)"), background: i === 0 ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent", padding: "7px 12px", fontSize: 12 }}>{t}</span>)}
          <div style={{ flex: "1 1 160px", minWidth: 0, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--muted2)", padding: "7px 10px", fontSize: 13 }}>Search rosters</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Sort:</span>
          {["Top", "New", "Trending"].map((t, i) => <span key={t} style={{ fontSize: 13, padding: "4px 10px", borderRadius: 6, color: i === 0 ? "var(--text)" : "var(--muted)", background: i === 0 ? "var(--raised)" : "transparent" }}>{t}</span>)}
        </div>
        {COMMUNITY_EXAMPLES.map((r, i) => {
          const f = FACTIONS[r.faction];
          return (
            <div key={i} style={{ ...cd, padding: 0, marginBottom: 8, display: "flex", overflow: "hidden", borderLeft: "3px solid " + f.color }}>
              <div style={{ width: 52, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--muted)", padding: "10px 0" }}>
                <Icon name="chevronUp" size={18} />
                <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{r.votes}</span>
                <Icon name="chevronDown" size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0, padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>{r.name}</span>
                  <span style={bg(f.color)}>{f.name}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, marginTop: 4 }}>{r.note}</div>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 4 }}>{r.ops} operatives {"·"} example post</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Logo: a die showing five with a crosshair for the center pip, plus the KILLSHEET wordmark.
// Small sizes drop the crosshair ticks so the mark stays readable. Icons live in icons/ (favicon.svg is the source).
const Logo = ({ size = 22 }) => {
  const small = size < 28;
  return (
    <span role="img" aria-label="KillSheet" style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.35), lineHeight: 1 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
        <rect x="2" y="2" width="28" height="28" rx="6" fill="none" stroke="var(--text)" strokeWidth={small ? 2.6 : 2} />
        {[[9, 9], [23, 9], [9, 23], [23, 23]].map(([x, y]) => <circle key={x + "-" + y} cx={x} cy={y} r={small ? 2.6 : 2.2} fill="var(--text)" />)}
        <g fill="none" stroke="var(--accent)" strokeWidth={small ? 2.6 : 2} strokeLinecap="round">
          <circle cx="16" cy="16" r={small ? 3.8 : 3.6} />
          {!small && <path d="M16 9.5v1.9M16 20.6v1.9M9.5 16h1.9M20.6 16h1.9" />}
        </g>
      </svg>
      <span aria-hidden="true" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: Math.round(size * 0.9), letterSpacing: "0.06em" }}>
        <span style={{ color: "var(--text)" }}>KILL</span><span style={{ color: "var(--accent)" }}>SHEET</span>
      </span>
    </span>
  );
};

// Nav tab id -> ICON_PATHS name. Drawn with Icon so they take the tab's color.
const TAB_ICONS = {
  rules: "rulebook",
  missions: "map",
  builder: "swords",
  community: "people",
};

