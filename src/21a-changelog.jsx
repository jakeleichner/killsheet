/* ═══ WHAT'S NEW AND UPDATES ═══ */
// The change log players see (Settings > What's new). Newest first, one entry per day something a player would
// notice changed, in plain words. kind: "new", "better" or "fixed". Add an entry with every such change.
const CHANGELOG = [
  { date: "2026-11-14", items: [
    ["better", "The Rosters tab is easier to find your way around: Your rosters, then New roster to pick a team, then building, with a Back button at the top of each step."],
    ["better", "While building, Save sits at the top right and Start game stays at the bottom of the screen."],
    ["better", "During a game, the Rosters tab still shows your rosters: View cards opens any saved roster's datacards, and a bar at the top takes you back to the game or ends it."],
    ["new", "Tap an operative's photo to see it full size."],
    ["better", "On the Shoot and Fight screens, photos slam in with the names. New photos are saved sharper."],
    ["new", "In online games, your opponent sees the photos of your operatives, and you see theirs. Turn it off in Settings, under Privacy."],
    ["new", "Signed in, your operative photos back up with your account and show up on your other devices."],
    ["fixed", "Short pages no longer leave a big empty gap above the About KillSheet section at the bottom."],
    ["new", "Sign in to back up your rosters, game history and settings, and use them on any device. In Settings, tap Account. It's optional: KillSheet works the same without an account."],
    ["new", "Add photos of your painted models: tap Add photo on a datacard in the Rosters tab. One photo covers every operative of that type in all your rosters for that team, and shows on the datacard and when shooting and fighting."],
    ["fixed", "Opening KillSheet during a game goes straight to your game on the Battle tab, instead of the team list."],
  ] },
  { date: "2026-11-13", items: [
    ["better", "Datacards on the Rosters tab are for building: stats, weapons and abilities, without wound buttons, orders, or Shoot and Fight. Those appear once the game starts."],
    ["new", "If something breaks, KillSheet sends a crash report so it can be fixed: the error and your device type, nothing that identifies you. You can turn it off in Settings, under Privacy."],
    ["new", "A new Rosters tab for building, saving and sharing rosters. The Battle tab is now just the game: Start game or Play on a saved roster takes you there."],
    ["better", "The save button shows whether your roster is saved: Save roster, Saved, or Save changes after you edit a saved roster."],
    ["better", "In online games, every hit reaches your opponent exactly once, even when the connection drops for a moment."],
    ["new", "On Android, the Back gesture closes the panel or menu you have open, instead of leaving KillSheet."],
    ["better", "The message that slides out when you're hit goes away when you tap anywhere else, so it never covers your datacards."],
    ["better", "Numbers that change during a game, like wounds, CP and VP, no longer make the text beside them shift."],
    ["better", "Small buttons, like the wound buttons on datacards, are easier to tap on a phone."],
    ["better", "Titles and longer text wrap more evenly on narrow screens."],
  ] },
  { date: "2026-11-02", items: [
    ["new", "Name your operatives. Tap Name it on a datacard before the game. The name shows on the card, when shooting and fighting, in the battle log and the recap, and it's saved with the roster. Online, your opponent sees it too."],
    ["new", "Send feedback, in Settings: report a bug or a rules mistake, or suggest an idea. If something crashes, Report this problem sends the details for you."],
  ] },
  { date: "2026-11-01", items: [
    ["new", "Start a game from a saved roster in one tap with Play. Edit opens it to make changes first."],
    ["better", "Save roster now sits next to Start game, and My rosters next to Change team. Saving a roster you've edited updates it instead of making a copy."],
  ] },
  { date: "2026-10-31", items: [
    ["new", "KillSheet has moved to killsheet.app. If you used the old address, tap Move in the note at the top to bring your rosters, games and settings with you."],
  ] },
  { date: "2026-10-30", items: [
    ["new", "When a new version of KillSheet is ready, a note at the top lets you update with one tap."],
    ["new", "What's new: this page, in Settings."],
    ["new", "In an online game, KillSheet tells you if your opponent is on a different version and which phone needs updating."],
    ["better", "Opens faster on slow connections and takes up less space on your phone."],
    ["better", "During a game, your game settings line moves into the game menu to save space."],
    ["better", "The Missions tab shows mission packs first, with the campaign below."],
    ["fixed", "Match my team in Settings now previews your team's color."],
    ["fixed", "The score bar fits on the smallest iPhones."],
    ["fixed", "Brood Brothers: Telepathic Overload matches Games Workshop's August 2026 errata."],
  ] },
  { date: "2026-10-29", items: [
    ["new", "Tutorial part 2: command points, ploys, controlling objectives, Command Re-roll and scoring."],
    ["new", "Diagrams in the Rules tab for Visible, Intervening, Cover, Obscured, Control range and Charge."],
    ["new", "Text size: Normal, Large or Larger, in Settings under Appearance."],
    ["new", "End-of-game recap: VP each turning point, who took out whom, and the biggest hits. Saved with each game."],
    ["new", "In online games, a message pops out of the Log button when you're hit. Tap it to see the hit."],
    ["better", "Dice in the tutorial tumble, like they do when you shoot and fight."],
  ] },
  { date: "2026-10-28", items: [
    ["new", "Tap any roll in a rule (D3, D6, 2D6 and so on) to roll it and see if you got what the rule needs."],
    ["new", "Shooting and fighting open with a versus screen: both names slam down and fire runs round the edge."],
    ["new", "Dice with pips that tumble, and a health bar on each datacard."],
    ["better", "Dice match your color theme, and battle damage no longer covers datacard buttons."],
    ["new", "Add enemy roster checks the team's building limits. You can switch this off."],
    ["fixed", "Damage marks reset when you change target, and frag grenades leave scorch marks instead of bullet holes."],
  ] },
  { date: "2026-10-27", items: [
    ["new", "Add your opponent's team from the \u22EF menu on your team bar, no code needed."],
    ["new", "A block animation when fighting."],
    ["new", "End game now has Discard, to end without recording a result. Undo brings it back."],
    ["better", "New attack effects for each kind of weapon, with recoil, screen shake, damage marks and bandages."],
  ] },
];
const NEWS_KIND = { new: ["New", "var(--hit)"], better: ["Better", "var(--blue)"], fixed: ["Fixed", "var(--gold)"] };
// The entries newer than the last one a player has seen (a date string, or null for someone who's never seen any).
const newsSince = (seen) => seen ? CHANGELOG.filter(e => e.date > seen) : [];
const newsDate = (d) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

function WhatsNew({ onClose }) {
  useBackClose(true, onClose);
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
      fetchWithin("version.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null)
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

// Moving to killsheet.app (Oct 2026). Browsers keep saved data per address, so the new address starts empty. On the old
// one, "Move my data" opens killsheet.app with everything in the link's # part (which never leaves the phone), and the
// Battle tab there offers to restore it. A Home Screen app keeps its own data apart from Safari, so it moves by backup file.
// window.__ksOldAddress lets the self-test and the preview act as the old address.
const NEW_HOME = "https://killsheet.app/";
const onOldAddress = () => window.location.hostname === "killsheet.pages.dev" || !!window.__ksOldAddress;
const isHomeScreenApp = () => !!(navigator.standalone || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches));
async function moveLink() {
  const json = JSON.stringify({ app: "KillSheet", kind: "backup", version: 1, savedAt: new Date().toISOString(), data: snapshotKillSheetStorage() });
  let bytes = new TextEncoder().encode(json), tag = "j";
  if (window.CompressionStream) { bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer()); tag = "z"; }
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return NEW_HOME + "#move=" + tag + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
// The backup inside a move link, or null when the # part isn't one. Throws when it is one but can't be read.
async function readMoveLink(hash) {
  const m = /^#move=([jz])([A-Za-z0-9_-]+)$/.exec(hash || "");
  if (!m) return null;
  const bin = atob(m[2].replace(/-/g, "+").replace(/_/g, "/"));
  let bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  if (m[1] === "z") bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
  return JSON.parse(new TextDecoder().decode(bytes));
}

function MovePanel({ onClose }) {
  const [busy, setBusy] = useState(false);
  const homeApp = isHomeScreenApp();
  useBackClose(true, onClose);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const move = () => {
    setBusy(true);
    moveLink().then(url => { if (window.__ksMoveTo) window.__ksMoveTo(url); else window.location.href = url; })
      .catch(() => { setBusy(false); alert("Couldn't move your data from this browser. Use the backup file steps below."); });
  };
  const stepRow = (n, body) => (
    <div style={{ display: "flex", gap: 10, padding: "6px 0" }}>
      <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 11, background: "var(--raised)", color: "var(--accent)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      <div style={{ fontSize: 14, lineHeight: 1.45, color: "var(--text)" }}>{body}</div>
    </div>
  );
  const fileSteps = (
    <div style={{ ...cd, padding: 12, marginBottom: 10 }}>
      <div style={{ ...h3, color: "var(--text2)", marginBottom: 4 }}>{homeApp ? "From this Home Screen app" : "From a Home Screen app"}</div>
      <p style={{ ...mu, margin: "0 0 6px" }}>A Home Screen app keeps its data apart from Safari, so it moves with a backup file.</p>
      {stepRow(1, <><button onClick={() => downloadBackup(true)} style={{ ...bs("var(--accent)"), padding: "6px 12px", fontSize: 13 }}>Back up</button> <span style={{ color: "var(--text2)" }}>and tap Save to Files.</span></>)}
      {stepRow(2, <>In Safari, open <a href={NEW_HOME} target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>killsheet.app</a>, tap Share, then Add to Home Screen.</>)}
      {stepRow(3, <>Open the new KillSheet from your Home Screen. On the Rosters tab, open the {"⋯"} menu, tap Restore from backup and pick the file.</>)}
      {stepRow(4, <>Once your data is there, delete the old KillSheet from your Home Screen.</>)}
    </div>
  );
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="Move to killsheet.app" style={{ position: "fixed", inset: 0, zIndex: 9100, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div className="ks-appear" style={{ maxWidth: 560, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Move to killsheet.app</div>
          <button autoFocus onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        <p style={{ ...mu, margin: "0 0 12px", lineHeight: 1.5 }}>KillSheet's new address is killsheet.app. Your rosters, games and settings are saved under this address, so the new one starts empty until you bring them across. This address keeps working for now, and your data stays here too.</p>
        {!homeApp && (
          <div style={{ ...cd, padding: 12, marginBottom: 10 }}>
            <div style={{ ...h3, color: "var(--text2)", marginBottom: 4 }}>In this browser</div>
            <p style={{ ...mu, margin: "0 0 10px" }}>Opens killsheet.app with your data. Tap Restore there.</p>
            <button onClick={move} disabled={busy} style={{ ...bs("var(--accent)"), padding: "10px 16px", fontSize: 14, opacity: busy ? 0.6 : 1 }}>{busy ? "Opening..." : "Move my data"}</button>
          </div>
        )}
        {fileSteps}
      </div>
    </div>,
    document.body
  );
}
