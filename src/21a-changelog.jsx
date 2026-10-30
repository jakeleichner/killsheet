/* ═══ WHAT'S NEW AND UPDATES ═══ */
// The change log players see (Settings > What's new). Newest first, one entry per day something a player would
// notice changed, in plain words. kind: "new", "better" or "fixed". Add an entry with every such change.
const CHANGELOG = [
  { date: "2026-10-30", items: [
    ["new", "A note tells you when a new version of KillSheet is ready, with an Update button."],
    ["new", "What's new: this page, in Settings. After an update, a note links to it once."],
    ["new", "Online, you're told if your opponent's KillSheet is a different version, and which phone needs updating."],
    ["better", "Every update is tested automatically before it reaches the site."],
  ] },
  { date: "2026-10-29", items: [
    ["new", "Tutorial part 2: command points, a strategy ploy, who controls an objective, Command Re-roll and scoring."],
    ["new", "Diagrams in the Rules tab for Visible, Intervening, Cover, Obscured, Control range and Charge."],
    ["new", "Text size in Settings, Appearance: Normal, Large or Larger."],
    ["new", "End-of-game recap: VP by turning point, who took out whom, and the most damage dealt. Saved with each game."],
    ["new", "When you're hit in an online game, a message slides out of the Log button. Tap it to see the hit in the battle log."],
    ["better", "The tutorial's dice tumble when rolled, like the Shoot and Fight screens."],
    ["fixed", "Closing the self-test before it finished could replace your saved data with the test game."],
    ["fixed", "The self-test's backup step failed on iPhone."],
  ] },
  { date: "2026-10-28", items: [
    ["new", "Tap a roll in any rule (D3, D6, 2D6, D3+3) to roll it. It also says whether you got what the rule needs."],
    ["new", "The Shoot and Fight screens open with both names slamming down and fire round the border."],
    ["new", "Dice with pips that tumble when rolled, a health bar on datacards, and a versus layout on the Shoot and Fight screens."],
    ["better", "Dice are flat and colored to match your theme. Battle damage and bandages sit behind the buttons on datacards."],
    ["new", "Add enemy roster follows the team's limits, with a switch to turn them off."],
    ["fixed", "Damage marks no longer carry over when you change target. Frag grenades leave scorch marks, not bullet holes."],
  ] },
  { date: "2026-10-27", items: [
    ["new", "Add enemy roster from the ⋯ menu on your team bar, without a code."],
    ["new", "Block animation in fights."],
    ["new", "End game, Discard: end without recording a result and go back to picking a team, with Undo."],
    ["better", "Attack effects rebuilt: weapon-specific shots, recoil, screen shake, damage marks and bandages."],
  ] },
];
const NEWS_KIND = { new: ["New", "var(--hit)"], better: ["Better", "var(--blue)"], fixed: ["Fixed", "var(--gold)"] };
// The entries newer than the last one a player has seen (a date string, or null for someone who's never seen any).
const newsSince = (seen) => seen ? CHANGELOG.filter(e => e.date > seen) : [];
const newsDate = (d) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

function WhatsNew({ onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="What's new" style={{ position: "fixed", inset: 0, zIndex: 9100, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div className="ks-appear" style={{ maxWidth: 560, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>What's new</div>
          <button autoFocus onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        <p style={{ ...mu, margin: "0 0 12px" }}>New features and fixes, newest first.</p>
        {CHANGELOG.map(e => (
          <div key={e.date} style={{ ...cd, padding: 12, marginBottom: 10 }}>
            <div style={{ ...h3, color: "var(--text2)", marginBottom: 6 }}>{newsDate(e.date)}</div>
            {e.items.map(([kind, text], i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "4px 0", borderTop: i ? "1px solid var(--raised)" : "none" }}>
                <span style={{ flexShrink: 0, minWidth: 52, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: NEWS_KIND[kind][1], fontFamily: "'Rajdhani', sans-serif" }}>{NEWS_KIND[kind][0]}</span>
                <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.45 }}>{text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

// "A new version is ready": the page knows its own build (window.KS_VERSION, set by tools/build_deploy.py) and asks the
// site's version.json when it opens, when it's brought back to the screen, and every 30 minutes. A copy without a build
// version (the preview) never asks. window.__ksShowUpdate is the self-test's way to show the bar.
function useUpdateCheck() {
  const [ready, setReady] = useState(null);
  React.useEffect(() => {
    window.__ksShowUpdate = setReady;
    if (!window.KS_VERSION) return () => { delete window.__ksShowUpdate; };
    let alive = true;
    const check = () => {
      if (document.visibilityState !== "visible") return;
      fetch("version.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null)
        .then(j => { if (alive && j && j.version && j.version !== window.KS_VERSION) setReady(j.version); }).catch(() => {});
      // The offline copy updates itself too, so the next start has the new files.
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {});
    };
    check();
    const timer = setInterval(check, 30 * 60 * 1000);
    document.addEventListener("visibilitychange", check);
    return () => { alive = false; clearInterval(timer); document.removeEventListener("visibilitychange", check); delete window.__ksShowUpdate; };
  }, []);
  return [ready, setReady];
}

// A slim bar at the top of the app: the update, or (once, after one) what's new.
function NoticeBar({ text, action, onAction, onDismiss, dismissLabel, color }) {
  return (
    <div role="status" data-notice="true" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 12px", background: "color-mix(in srgb, " + color + " 14%, var(--card))", borderBottom: "1px solid " + al(color, "60"), fontSize: 13, color: "var(--text)" }}>
      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>{text}</span>
      <button onClick={onAction} style={{ ...bs(color), padding: "6px 12px", fontSize: 12, flexShrink: 0, background: al(color, "1C") }}>{action}</button>
      <button onClick={onDismiss} aria-label={dismissLabel} className="compact-btn" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="x" size={14} /></button>
    </div>
  );
}

