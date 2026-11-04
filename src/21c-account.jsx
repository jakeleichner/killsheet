/* ═══ ACCOUNTS AND CLOUD BACKUP ═══ */
// Optional sign-in (a code sent by email, or Google; server/account.js) backs up saved rosters, game history and settings,
// and brings them to any device signed in to the same account. The game in progress stays on its device.
// Signing in is an extra: without an account nothing here runs. Until ACCOUNTS_LIVE is true, only a device that has opened
// killsheet.app/?accounts sees it, so the owner can try it and read the Privacy and Terms pages first.
const ACCOUNTS_LIVE = false;
const accountsOn = () => !onOldAddress() && (ACCOUNTS_LIVE || !!window.__ksAccountsOn || !!readStored("accountsBeta", false));
const SYNC_LISTS = { savedRosters: (r) => r.savedAt || 0, gameHistory: (g) => g.id || 0 }; // each list's item, and when it last changed
const SYNC_SETTINGS = ["features", "appearance", "validate", "tutorialSeen"];
const SYNC_WATCHED = [...Object.keys(SYNC_LISTS), ...SYNC_SETTINGS];
const SYNC_DELAY = 10000; // after a change; longer than the 8 seconds Undo is offered, so an undone delete never reaches the cloud
const SYNC_EVERY = 5 * 60000; // at most this often when KillSheet comes back to the screen

// Puts two copies together. Lists join by item, the newest version of each winning, so a roster saved on one device can't
// wipe one saved on another. Only an item you deleted goes, and only if it wasn't saved again after that. Settings go as
// one group: the newest wins. Pure, so the self-test can check it.
function mergeSyncData(local, remote) {
  const r = remote || {};
  const deleted = { ...(r.deleted || {}) };
  Object.entries(local.deleted || {}).forEach(([id, t]) => { if (!(deleted[id] >= t)) deleted[id] = t; });
  const out = { deleted };
  Object.keys(SYNC_LISTS).forEach(key => {
    const timeOf = SYNC_LISTS[key], byId = new Map();
    [...(Array.isArray(r[key]) ? r[key] : []), ...(Array.isArray(local[key]) ? local[key] : [])].forEach(item => {
      if (!item || item.id === undefined) return;
      const have = byId.get(String(item.id));
      if (!have || timeOf(item) >= timeOf(have)) byId.set(String(item.id), item);
    });
    out[key] = [...byId.values()].filter(item => !(deleted[String(item.id)] >= timeOf(item))).sort((a, b) => timeOf(b) - timeOf(a));
  });
  const localAt = local.settingsAt || 0, remoteAt = r.settingsAt || 0, useRemote = !!r.settings && remoteAt > localAt;
  out.settings = useRemote ? r.settings : (local.settings || {});
  out.settingsAt = useRemote ? remoteAt : localAt;
  return out;
}
// A device that's never synced has no claim on its settings being newest, so an account's settings come to a new device.
function localSyncData(now) {
  const settings = {};
  SYNC_SETTINGS.forEach(k => { const v = readStored(k, null); if (v !== null) settings[k] = v; });
  const last = readStored("syncSettingsLast", null), cur = JSON.stringify(settings);
  const out = { deleted: readStored("syncDeleted", {}), settings, settingsAt: last === null ? 0 : cur === last ? readStored("syncSettingsAt", 0) : now };
  Object.keys(SYNC_LISTS).forEach(k => { out[k] = readStored(k, []); });
  return out;
}
function applySyncData(merged) {
  const changed = [];
  Object.keys(SYNC_LISTS).forEach(k => { if (JSON.stringify(readStored(k, [])) !== JSON.stringify(merged[k])) { writeStored(k, merged[k]); changed.push(k); } });
  SYNC_SETTINGS.forEach(k => { const v = merged.settings[k]; if (v !== undefined && JSON.stringify(readStored(k, null)) !== JSON.stringify(v)) { writeStored(k, v); changed.push(k); } });
  writeStored("syncDeleted", merged.deleted);
  writeStored("syncSettingsLast", JSON.stringify(merged.settings));
  writeStored("syncSettingsAt", merged.settingsAt);
  if (changed.length) window.dispatchEvent(new CustomEvent("ks-sync-applied", { detail: changed }));
}
const syncShape = (d) => { const out = { deleted: d.deleted || {} }; Object.keys(SYNC_LISTS).forEach(k => { out[k] = d[k] || []; }); out.settings = d.settings || {}; out.settingsAt = d.settingsAt || 0; return out; };

let syncSignedIn = false, syncBusy = false, syncAgain = false, syncTimer = null, syncLastTry = 0, syncState = "idle";
const setSyncState = (s) => { syncState = s; window.dispatchEvent(new Event("ks-sync-status")); };
function scheduleSync() {
  if (!syncSignedIn || window.__ksFrozen) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncNow, SYNC_DELAY);
}
function noteSyncDeleted(id) { writeStored("syncDeleted", { ...readStored("syncDeleted", {}), [String(id)]: Date.now() }); }
async function syncNow() {
  if (!syncSignedIn || window.__ksFrozen) return;
  if (syncBusy) { syncAgain = true; return; }
  clearTimeout(syncTimer);
  syncBusy = true; syncLastTry = Date.now();
  setSyncState("syncing");
  try {
    let done = false;
    for (let tries = 0; tries < 3 && !done; tries++) {
      const got = await fetch("/api/sync", { cache: "no-store" });
      if (got.status === 401) { window.dispatchEvent(new Event("ks-signed-out")); setSyncState("idle"); return; }
      if (!got.ok) throw new Error("sync " + got.status);
      const { data, rev } = await got.json();
      // No waiting between reading this device's data and writing the merge, so a save made meanwhile can't be lost.
      const merged = mergeSyncData(localSyncData(Date.now()), data);
      applySyncData(merged);
      if (data && JSON.stringify(syncShape(merged)) === JSON.stringify(syncShape(data))) { done = true; break; }
      const put = await fetch("/api/sync", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rev, data: merged }) });
      if (put.status === 413) { setSyncState("tooBig"); return; }
      if (put.status === 409) continue; // another device saved first: merge with that
      if (put.status === 401) { window.dispatchEvent(new Event("ks-signed-out")); setSyncState("idle"); return; }
      if (!put.ok) throw new Error("sync " + put.status);
      done = true;
    }
    if (!done) throw new Error("sync kept conflicting");
    writeStored("syncLastAt", Date.now());
    setSyncState("ok");
  } catch (e) {
    setSyncState("failed");
  } finally {
    syncBusy = false;
    if (syncAgain) { syncAgain = false; scheduleSync(); }
  }
}

// Who's signed in, for App. The name is kept on the device so KillSheet can say so offline; the cookie is what counts.
function useAccount() {
  const [account, setAccount] = useLocalStorage("account", null);
  const [panelNote, setPanelNote] = useState(null); // opens the Account page with a message after coming back from Google
  React.useEffect(() => {
    syncSignedIn = !!account;
    if (account) syncNow(); else clearTimeout(syncTimer);
  }, [!!account]);
  React.useEffect(() => {
    const onOut = () => setAccount(null);
    const onShow = () => { if (document.visibilityState === "visible" && syncSignedIn && Date.now() - syncLastTry > SYNC_EVERY) syncNow(); };
    window.addEventListener("ks-signed-out", onOut);
    document.addEventListener("visibilitychange", onShow);
    return () => { window.removeEventListener("ks-signed-out", onOut); document.removeEventListener("visibilitychange", onShow); };
  }, []);
  React.useEffect(() => {
    if (/[?&]selftest\b/.test(window.location.search)) return;
    const q = new URLSearchParams(window.location.search);
    if (q.has("accounts")) writeStored("accountsBeta", true);
    const back = q.has("signedin") ? "signedin" : q.get("signin") === "failed" ? "failed" : null;
    if (q.has("accounts") || q.has("signedin") || q.has("signin")) {
      ["accounts", "signedin", "signin"].forEach(k => q.delete(k));
      const rest = q.toString();
      window.history.replaceState(null, "", window.location.pathname + (rest ? "?" + rest : ""));
    }
    if (!accountsOn()) return;
    if (back === "failed") setPanelNote("Google sign-in didn't finish. Try again, or use your email.");
    fetch("/api/account", { cache: "no-store" }).then(r => {
      if (r.status === 401) { setAccount(null); return null; }
      return r.ok ? r.json() : null;
    }).then(j => {
      if (j && j.user) { setAccount({ email: j.user.email }); if (back === "signedin") setPanelNote("You're signed in."); }
    }).catch(() => {}); // offline: keep what we know
  }, []);
  return { account, setAccount, panelNote, setPanelNote };
}

function AccountPanel({ account, setAccount, note, onClose }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState("email"); // email, code
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(note || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [, redraw] = useState(0);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onStatus = () => redraw(n => n + 1);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ks-sync-status", onStatus);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("ks-sync-status", onStatus); };
  }, [onClose]);
  React.useEffect(() => { setStage("email"); setCode(""); }, [!!account]); // signed in or out: start from the email box next time
  const post = (url, body) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const offline = "Couldn't reach KillSheet. Check your connection and try again.";
  const sendCode = () => {
    setBusy(true); setMessage("");
    post("/api/auth/email/start", { email }).then(r => {
      if (r.ok) { setStage("code"); setCode(""); }
      else setMessage(r.status === 400 ? "That doesn't look like an email address." : r.status === 429 ? "That's a lot of codes in a short time. Try again in 15 minutes." : "Couldn't send the code. Try again in a minute.");
    }).catch(() => setMessage(offline)).finally(() => setBusy(false));
  };
  const verify = () => {
    setBusy(true); setMessage("");
    post("/api/auth/email/verify", { email, code }).then(r => r.json().catch(() => ({})).then(j => {
      if (r.ok && j.user) setAccount({ email: j.user.email });
      else setMessage(j.error === "expired" ? "That code has expired or had too many tries. Ask for a new one." : "That code isn't right. Check the email and try again.");
    })).catch(() => setMessage(offline)).finally(() => setBusy(false));
  };
  const signOutHere = () => {
    setBusy(true);
    post("/api/auth/signout", {}).catch(() => {}).finally(() => { setBusy(false); setAccount(null); setStage("email"); setMessage("Signed out. Your rosters and games stay on this device."); });
  };
  const deleteIt = () => {
    setBusy(true); setMessage("");
    fetch("/api/account", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: "DELETE" }) }).then(r => {
      if (r.ok || r.status === 401) { setAccount(null); setConfirmDelete(false); setStage("email"); setMessage("Your account and cloud backup are deleted. Your rosters and games stay on this device."); }
      else setMessage("Couldn't delete it. Try again in a minute.");
    }).catch(() => setMessage(offline)).finally(() => setBusy(false));
  };
  const googleOK = window.__ksShowGoogle || (window.location.hostname === "killsheet.app" && !navigator.standalone);
  const lastAt = readStored("syncLastAt", 0);
  const status = syncState === "syncing" ? "Backing up..." : syncState === "failed" ? "Couldn't back up just now. KillSheet will try again." : syncState === "tooBig" ? "Your backup is too big to save. Delete some old games from your history, then try again." : lastAt ? "Last backed up " + new Date(lastAt).toLocaleString() + "." : "Not backed up yet.";
  const field = { width: "100%", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "10px 12px", fontSize: 16, fontFamily: "'Inter', sans-serif" };
  const bad = /^(Couldn|That)/.test(message) || /didn't finish/.test(message);
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="Account" style={{ position: "fixed", inset: 0, zIndex: 9200, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div className="ks-appear" style={{ maxWidth: 560, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Account</div>
          <button autoFocus onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        {message && <p role={bad ? "alert" : "status"} style={{ fontSize: 14, color: bad ? "#E0664A" : "var(--text2)", margin: "0 0 10px", lineHeight: 1.45 }}>{message}</p>}
        {account ? (
          <>
            <div style={{ ...cd, padding: 14 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Signed in as</div>
              <div data-account-email="true" style={{ fontSize: 16, fontWeight: 600, overflowWrap: "anywhere", marginBottom: 8 }}>{account.email}</div>
              <p role="status" style={{ ...mu, fontSize: 14, margin: "0 0 12px" }}>{status}</p>
              <p style={{ ...mu, fontSize: 13, margin: "0 0 12px" }}>Your saved rosters, game history and settings are backed up, and show up on any device you sign in on. A game in progress stays on this device.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={syncNow} disabled={syncState === "syncing"} style={{ ...bs("var(--accent)"), padding: "10px 14px", fontSize: 13 }}>Back up now</button>
                <button onClick={signOutHere} disabled={busy} style={{ ...bs("var(--muted)"), padding: "10px 14px", fontSize: 13 }}>Sign out</button>
              </div>
            </div>
            <div style={{ ...cd, padding: 14 }}>
              {confirmDelete ? (
                <>
                  <p style={{ fontSize: 14, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.45 }}>This deletes your account and its cloud backup for good. Other devices will be signed out. What's on this device stays.</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={deleteIt} disabled={busy} style={{ ...bs("#E0664A"), padding: "10px 14px", fontSize: 13 }}>Delete my account</button>
                    <button onClick={() => setConfirmDelete(false)} style={{ ...bs("var(--muted)"), padding: "10px 14px", fontSize: 13 }}>Keep it</button>
                  </div>
                </>
              ) : <button onClick={() => setConfirmDelete(true)} style={{ ...bs("#E0664A"), padding: "8px 12px", fontSize: 12 }}>Delete my account</button>}
            </div>
          </>
        ) : (
          <>
            <p style={{ ...mu, fontSize: 14, margin: "0 0 12px" }}>Sign in to back up your rosters, games and settings, and use them on any device. KillSheet works the same without an account.</p>
            {googleOK && stage === "email" && (
              <>
                <button onClick={() => { window.location.href = "/api/auth/google/start"; }} style={{ ...bs("var(--text2)"), width: "100%", padding: "12px 14px", fontSize: 14, marginBottom: 12 }}>Continue with Google</button>
                <div style={{ ...mu, fontSize: 12, textAlign: "center", marginBottom: 12 }}>or</div>
              </>
            )}
            {stage === "email" ? (
              <form onSubmit={e => { e.preventDefault(); if (email.trim() && !busy) sendCode(); }}>
                <label htmlFor="ks-account-email" style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Your email</label>
                <input id="ks-account-email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" autoCapitalize="off" placeholder="you@example.com" style={{ ...field, marginBottom: 10 }} />
                <button type="submit" disabled={!email.trim() || busy} style={{ ...bs("var(--accent)"), width: "100%", padding: "12px 14px", fontSize: 14, opacity: !email.trim() || busy ? 0.5 : 1 }}>{busy ? "Sending..." : "Email me a code"}</button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if (code.trim() && !busy) verify(); }}>
                <p style={{ fontSize: 14, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.45 }}>We sent a 6-digit code to <strong style={{ overflowWrap: "anywhere" }}>{email.trim()}</strong>. It works for 15 minutes. Check your spam folder if it hasn't arrived after a minute.</p>
                <label htmlFor="ks-account-code" style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Code</label>
                <input id="ks-account-code" value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={7} placeholder="123456" style={{ ...field, letterSpacing: "0.2em", marginBottom: 10 }} />
                <button type="submit" disabled={!code.trim() || busy} style={{ ...bs("var(--accent)"), width: "100%", padding: "12px 14px", fontSize: 14, opacity: !code.trim() || busy ? 0.5 : 1 }}>{busy ? "Signing in..." : "Sign in"}</button>
                <button type="button" onClick={() => { setStage("email"); setMessage(""); }} style={{ ...bs("var(--muted)"), width: "100%", padding: "10px 14px", fontSize: 13, marginTop: 8 }}>Use a different email, or send a new code</button>
              </form>
            )}
            <p data-age-notice="true" style={{ ...mu, fontSize: 12, margin: "12px 0 0" }}>You need to be 13 or older to make an account. By signing up, you agree to the <a href="/terms" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>Terms</a> and <a href="/privacy" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>Privacy Policy</a>.</p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
