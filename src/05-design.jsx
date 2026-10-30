/* ═══ STYLES: V2 DESIGN SYSTEM ═══ */
const cd = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, padding: 16, marginBottom: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.35)" };
const mu = { fontSize: 13, color: "var(--muted)", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" };
const h3 = { fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 8, letterSpacing: "0.14em", fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase" };
const dv = { height: 1, background: "var(--line)", margin: "14px 0" };
const pl = { display: "inline-block", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "var(--raised)", color: "var(--text)", marginRight: 4, marginBottom: 4, fontFamily: "'Inter', sans-serif" };
// Adds an alpha (two hex digits) to a color. Works for hex colors and for theme variables like var(--accent).
const al = (c, a) => c && c[0] === "#" ? c + a : "color-mix(in srgb, " + c + " " + Math.round(parseInt(a, 16) / 2.55) + "%, transparent)";
const bg = (c) => ({ display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", padding: "4px 10px", borderRadius: 4, background: al(c, "18"), color: c, border: "1px solid " + al(c, "40"), textTransform: "uppercase", fontFamily: "'Rajdhani', sans-serif" });
const bs = (c) => ({ padding: "8px 14px", border: "1px solid " + al((c || "var(--accent)"), "60"), borderRadius: 4, background: "transparent", color: c || "var(--accent)", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase" });

/* ═══════════════════════════════════════════════════════════════
   NEW DESIGN SYSTEM v2 (preview)
   Rust + neutral grays + UI-tuned faction colors. Inter body, Rajdhani display.
   See spec in chat. This is additive and won't replace old styles until approved.
   ═══════════════════════════════════════════════════════════════ */
const DS = {
  // Surfaces
  bgBase: "var(--bg)",
  bgCard: "var(--card)",
  bgElevated: "var(--raised)",
  divider: "var(--line)",
  // Text
  textPrimary: "var(--text)",
  textSecondary: "var(--muted)",
  textTertiary: "var(--dim)",
  // Accents
  rust: "var(--accent)",
  goldSignal: "var(--gold)",
  threat: "#B8341C",
  success: "#3D6B3F",
  // Type
  fontDisplay: "'Rajdhani', 'Segoe UI', sans-serif",
  fontBody: "'Inter', 'Segoe UI', sans-serif",
};

/* ═══ APPEARANCE (themes) ═══ */
// Each theme is a set of CSS variables on :root. Dice, wound, damage and team colors stay fixed in every theme;
// gold and blue only darken in Light so they stay readable on white.
const THEMES = {
  default: { name: "Default", desc: "Dark slate, orange", vars: { bg: "#0E0F13", card: "#1A1D24", raised: "#262A33", line: "#3A4150", text: "#F1F2F5", text2: "#C8CDD3", muted: "#9AA5B1", muted2: "#8B95A1", dim: "#5A6470", accent: "#C9772E", gold: "#FFB627", blue: "#6B9BF7", hit: "#6AAE45", miss: "#D9603F" } },
  midnight: { name: "Midnight", desc: "Navy, teal", vars: { bg: "#0B1018", card: "#141C28", raised: "#1E2836", line: "#2C3A4F", text: "#EEF3F8", text2: "#C3CEDB", muted: "#93A3B8", muted2: "#8494A9", dim: "#4F5F75", accent: "#4FB8C9", gold: "#FFB627", blue: "#6B9BF7", hit: "#6AAE45", miss: "#D0573A" } },
  desert: { name: "Desert", desc: "Warm brown, bone", vars: { bg: "#15110D", card: "#221C16", raised: "#2C251D", line: "#43382C", text: "#F3EBDD", text2: "#D3C7B3", muted: "#B3A48D", muted2: "#A2937D", dim: "#6A5D4C", accent: "#CDBB94", gold: "#FFB627", blue: "#6B9BF7", hit: "#7AB050", miss: "#D8603F" } },
  violet: { name: "Violet", desc: "Deep purple, lilac", vars: { bg: "#110E17", card: "#1C1726", raised: "#262033", line: "#3B3150", text: "#F2EEF8", text2: "#D0C8DC", muted: "#A79CB8", muted2: "#988CA9", dim: "#5E5270", accent: "#A98BEA", gold: "#FFB627", blue: "#6B9BF7", hit: "#6AAE45", miss: "#D0573A" } },
  light: { name: "Light", desc: "For bright rooms", light: true, vars: { bg: "#F2F0EB", card: "#FFFFFF", raised: "#E8E5DE", line: "#D6D2C8", text: "#1C1F24", text2: "#3A3F47", muted: "#5C6370", muted2: "#6B7280", dim: "#A0A4AB", accent: "#A85A1C", gold: "#9A6412", blue: "#3F6FD1", hit: "#3E7A25", miss: "#A8321B" } },
  contrast: { name: "High contrast", desc: "Black, white, bright edges", vars: { bg: "#000000", card: "#0D0D0D", raised: "#1F1F1F", line: "#8A8A8A", text: "#FFFFFF", text2: "#F0F0F0", muted: "#D6D6D6", muted2: "#C8C8C8", dim: "#8A8A8A", accent: "#FF9A3C", gold: "#FFB627", blue: "#8FB4FF", hit: "#7CD64F", miss: "#FF6A4D" } },
};
const hexRgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbHex = (c) => "#" + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const luminance = (h) => { const [r, g, b] = hexRgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hueOf = (h) => { const [r, g, b] = hexRgb(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return 0; const k = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (k * 60 + 360) % 360; };
// Turns the color wheel by deg, keeping lightness and saturation.
const rotateHue = (h, deg) => {
  const [r, g, b] = hexRgb(h), a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), k = 1 / 3, q = Math.sqrt(k);
  const m = [c + (1 - c) * k, k * (1 - c) - q * s, k * (1 - c) + q * s];
  return rgbHex([r * m[0] + g * m[1] + b * m[2], r * m[2] + g * m[0] + b * m[1], r * m[1] + g * m[2] + b * m[0]]);
};
const mixHex = (a, b, t) => { const x = hexRgb(a), y = hexRgb(b); return rgbHex(x.map((v, i) => v + (y[i] - v) * t)); };
const MEANING_COLORS = ["#5A9C3A", "#B8341C", "#FFB627"]; // hit, damage, crit
// Match my team: the team's color as the accent, made readable on the theme's panels and kept clear of the dice and damage colors.
function teamAccent(hex, theme) {
  let c = hex;
  for (let pass = 0; pass < 3; pass++) {
    MEANING_COLORS.forEach(m => {
      const d = Math.hypot(...hexRgb(c).map((v, i) => v - hexRgb(m)[i]));
      if (d < 60) { const diff = ((hueOf(c) - hueOf(m) + 540) % 360) - 180; c = rotateHue(c, diff >= 0 ? 40 : -40); }
    });
    for (let i = 0; i < 20 && contrast(c, theme.vars.card) < 4.5; i++) c = mixHex(c, theme.vars.text, 0.12);
  }
  return c;
}
// The team color (Match my team) isn't set here: it applies to the Battle tab only, so the logo, tabs and other tabs keep the theme.
function applyTheme(id) {
  const t = THEMES[id] || THEMES.default;
  const root = document.documentElement;
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty("--" + k, v));
  root.style.colorScheme = t.light ? "light" : "dark";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t.vars.bg);
}

/* Mobile detection hook */
function useIsMobile(breakpoint) {
  const bp = breakpoint || 700;
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.innerWidth < bp);
  React.useEffect(() => {
    const handler = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [bp]);
  return mobile;
}

/* ═══ PERSISTENCE ═══ */
const LS_PREFIX = "ks_";
function useLocalStorage(key, initialValue) {
  const fullKey = LS_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const stored = window.localStorage.getItem(fullKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (e) { return initialValue; }
  });
  useEffect(() => {
    try {
      if (typeof window === "undefined" || window.__ksFrozen) return; // frozen: the self-test has put your data back
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) { /* quota or serialization errors ignored */ }
  }, [fullKey, value]);
  return [value, setValue];
}
// Undo support: copy all KillSheet keys, and put a copy back.
// Back up: every KillSheet key as a JSON file. Phones get the share sheet (Save to Files, AirDrop, Drive); elsewhere it downloads.
// Returns the file name when it downloaded. Plain function, so the crash screen can use it without the app running.
function downloadBackup(share) {
  const payload = { app: "KillSheet", kind: "backup", version: 1, savedAt: new Date().toISOString(), data: snapshotKillSheetStorage() };
  const d = new Date();
  const name = "killsheet-backup-" + d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") + ".json";
  const file = new File([JSON.stringify(payload)], name, { type: "application/json" });
  // On a phone: the share sheet (Save to Files, AirDrop, Mail). Falls back to a download if sharing isn't there or fails
  // straight away. window.__ksNoShare is the self-test's: Safari won't let a page replace navigator.share.
  let canShare = false;
  try { canShare = !!(share && !window.__ksNoShare && typeof navigator.share === "function" && navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) { canShare = false; }
  if (canShare) {
    try { navigator.share({ files: [file], title: "KillSheet backup" }).catch(() => {}); return null; } catch (e) { /* fall back to a download */ }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return name;
}

// Keeps the screen on while a game is in progress (Screen Wake Lock), so the phone doesn't dim mid-turn.
// The lock drops when the page is hidden, so it's asked for again when KillSheet comes back. window.__ksAwake is for the self-test.
function useKeepAwake(on) {
  React.useEffect(() => {
    if (!on) { window.__ksAwake = "off"; return; }
    if (!("wakeLock" in navigator)) { window.__ksAwake = "unsupported"; return; }
    let lock = null, live = true;
    const get = () => {
      if (lock && !lock.released) return;
      if (document.visibilityState !== "visible") { window.__ksAwake = "hidden"; return; } // asked for again when the page shows
      window.__ksAwake = "requested";
      navigator.wakeLock.request("screen").then(l => { if (!live) { l.release().catch(() => {}); return; } lock = l; window.__ksAwake = "on"; }, () => { if (live) window.__ksAwake = "refused"; });
    };
    get();
    document.addEventListener("visibilitychange", get);
    return () => { live = false; document.removeEventListener("visibilitychange", get); if (lock) lock.release().catch(() => {}); window.__ksAwake = "off"; };
  }, [on]);
}

// Crash safety net: if a screen crashes, show a way out instead of a blank page.
// window.__ksCrashTest makes CrashTest throw, so the self-test can check this screen.
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { if (window.console) console.error("KillSheet crashed in " + (this.props.where || "the app") + ":", error); }
  render() {
    const error = this.state.error;
    if (!error) return this.props.children;
    const where = this.props.where;
    return (
      <div role="alert" style={{ maxWidth: 560, margin: "32px auto", padding: "0 16px" }}>
        <div style={{ ...cd, borderLeft: "3px solid #B8341C", padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Something went wrong</div>
          <p style={{ ...mu, fontSize: 14, margin: "6px 0 12px" }}>{where ? "The " + where + " tab" : "KillSheet"} hit an error. Your rosters and games are still saved on this device. If you're worried, back them up first, then reload.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => window.location.reload()} style={{ ...bs("var(--accent)"), padding: "10px 16px", fontSize: 14 }}>Reload</button>
            <button onClick={() => downloadBackup(window.innerWidth < 700)} style={{ ...bs("var(--muted)"), padding: "10px 16px", fontSize: 14 }}>Back up my data</button>
            <button onClick={() => this.setState({ error: null })} style={{ ...bs("var(--muted)"), padding: "10px 16px", fontSize: 14 }}>Try again</button>
          </div>
          <details style={{ marginTop: 12 }}><summary style={{ ...mu, fontSize: 12, cursor: "pointer" }}>Error details</summary><code style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{String((error && error.message) || error)}</code></details>
        </div>
      </div>
    );
  }
}
function CrashTest() { if (window.__ksCrashTest) throw new Error("Self-test crash"); return null; }

function snapshotKillSheetStorage() {
  const snap = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.indexOf(LS_PREFIX) === 0) snap[k] = window.localStorage.getItem(k);
    }
  } catch (e) { /* storage unavailable */ }
  return snap;
}
// The player's data while a self-test runs, kept outside the ks_ keys the test clears. If the page is closed or left
// before the test finishes, the app puts the data back from here the next time it opens.
const SELFTEST_BACKUP = "killsheet-selftest-backup";
function selfTestBackup(write) { try { if (write === undefined) return JSON.parse(window.localStorage.getItem(SELFTEST_BACKUP) || "null"); if (write === null) window.localStorage.removeItem(SELFTEST_BACKUP); else window.localStorage.setItem(SELFTEST_BACKUP, JSON.stringify(write)); } catch (e) { return null; } return null; }
function restoreKillSheetStorage(snap) {
  try {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.indexOf(LS_PREFIX) === 0) keys.push(k);
    }
    keys.forEach(k => window.localStorage.removeItem(k));
    Object.keys(snap).forEach(k => window.localStorage.setItem(k, snap[k]));
  } catch (e) { /* storage unavailable */ }
}
// "Clear current game data" keeps saved rosters, game history and the Your KillSheet switches.
const KEEP_ON_CLEAR = ["savedRosters", "gameHistory", "features", "validate", "appearance", "lastBackup", "backupNudgeAt", "homeTipSeen"]; // battle damage marks ("scars") are game state and clear
function clearKillSheetStorage() {
  try {
    if (typeof window === "undefined") return;
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.indexOf(LS_PREFIX) === 0 && !KEEP_ON_CLEAR.includes(k.slice(LS_PREFIX.length))) keys.push(k);
    }
    keys.forEach(k => window.localStorage.removeItem(k));
  } catch (e) { /* ignore */ }
}

