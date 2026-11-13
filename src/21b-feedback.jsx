/* ═══ FEEDBACK AND THE ADMIN PAGE ═══ */
// Send feedback (Settings, and Report this problem on the crash screen) posts to /api/feedback, which keeps it in
// the site's database (server/feedback.js). The owner reads it on the admin page: killsheet.app/?admin, unlocked
// with the ADMIN_KEY password. The password is only held while the page is open, never saved.
const FEEDBACK_KINDS = [["problem", "Something's wrong"], ["idea", "An idea"], ["other", "Something else"]];

// The phone and browser in a few words, e.g. "iPhone · Safari · Home Screen app". Nothing that identifies a person.
function deviceSummary() {
  const ua = navigator.userAgent || "";
  const device = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "iPad" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "Other";
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox|FxiOS/.test(ua) ? "Firefox" : /Chrome|CriOS/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Other";
  return device + " · " + browser + (isHomeScreenApp() ? " · Home Screen app" : "");
}

function FeedbackForm({ onClose, tab, error }) {
  const [kind, setKind] = useState(error ? "problem" : "idea");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [trap, setTrap] = useState(""); // hidden from people; spam robots fill it in
  const [state, setState] = useState("ready"); // ready, sending, sent, failed, busy
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const sending = React.useRef(false); // a fast double tap sends once
  const send = () => {
    if (!message.trim() || sending.current) return;
    sending.current = true;
    setState("sending");
    const body = { kind, message: message.trim(), contact: contact.trim(), version: window.KS_VERSION || "preview", device: deviceSummary(), screen: window.innerWidth + "x" + window.innerHeight, tab: tab || "", error: error || "", website: trap };
    fetchWithin("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(r => setState(r.ok ? "sent" : r.status === 429 ? "busy" : "failed"))
      .catch(() => setState("failed"))
      .finally(() => { sending.current = false; });
  };
  const field = { width: "100%", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "10px 12px", fontSize: 16, fontFamily: "'Inter', sans-serif" };
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="Send feedback" style={{ position: "fixed", inset: 0, zIndex: 9200, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div className="ks-appear" style={{ maxWidth: 560, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>{error ? "Report this problem" : "Send feedback"}</div>
          <button autoFocus onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        {state === "sent" ? (
          <div style={{ ...cd, padding: 16, marginTop: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: "var(--text)" }}>Thanks, it's sent.</div>
            <p style={{ ...mu, fontSize: 14, margin: "6px 0 12px" }}>{contact.trim() ? "If it needs a reply, you'll hear back at the address you gave." : "Every message gets read."}</p>
            <button onClick={onClose} style={{ ...bs("var(--accent)"), padding: "10px 16px", fontSize: 14 }}>Done</button>
          </div>
        ) : (
          <>
            <p style={{ ...mu, fontSize: 14, margin: "0 0 12px" }}>Found a mistake in a rule, hit a bug, or have an idea? Tell me here.</p>
            <div role="radiogroup" aria-label="What it's about" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {FEEDBACK_KINDS.map(([id, label]) => (
                <button key={id} role="radio" aria-checked={kind === id} onClick={() => setKind(id)} style={{ ...bs(kind === id ? "var(--accent)" : "var(--muted)"), padding: "8px 12px", fontSize: 13, background: kind === id ? "color-mix(in srgb, var(--accent) 13%, transparent)" : "transparent" }}>{label}</button>
              ))}
            </div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 4 }} htmlFor="ks-fb-message">Your message</label>
            <textarea id="ks-fb-message" value={message} maxLength={2000} rows={6} onChange={e => setMessage(e.target.value)}
              placeholder={kind === "problem" ? "What happened, and what were you doing just before?" : kind === "idea" ? "What would make KillSheet better for you?" : "What's on your mind?"}
              style={{ ...field, resize: "vertical", lineHeight: 1.45 }} />
            <label style={{ display: "block", fontSize: 13, color: "var(--text2)", margin: "10px 0 4px" }} htmlFor="ks-fb-contact">How can I reply? (optional)</label>
            <input id="ks-fb-contact" value={contact} maxLength={200} onChange={e => setContact(e.target.value)} placeholder="Email or Reddit name" autoComplete="email" style={field} />
            <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} name="website" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
            <p style={{ ...mu, fontSize: 12, margin: "8px 0 12px" }}>Sent with it: the KillSheet version, your device type and screen size{error ? ", and the error" : ""}. Nothing else.</p>
            {state === "failed" && <p role="alert" style={{ fontSize: 13, color: "#E0664A", margin: "0 0 10px" }}>Couldn't send it. Check your connection and try again.</p>}
            {state === "busy" && <p role="alert" style={{ fontSize: 13, color: "#E0664A", margin: "0 0 10px" }}>That's a lot of messages in a short time. Try again in an hour.</p>}
            <button onClick={send} disabled={!message.trim() || state === "sending"} style={{ ...bs("var(--accent)"), padding: "10px 18px", fontSize: 14, opacity: !message.trim() || state === "sending" ? 0.5 : 1 }}>{state === "sending" ? "Sending..." : "Send"}</button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// killsheet.app/?admin: the owner's page for reading feedback.
function AdminPage({ onClose }) {
  const [key, setKey] = useState("");
  const [items, setItems] = useState(null);
  const [note, setNote] = useState("");
  const call = (method, query) => fetchWithin("/api/admin/feedback" + (query || ""), { method, headers: { Authorization: "Bearer " + key }, cache: "no-store" });
  const load = () => {
    setNote("Loading...");
    call("GET").then(r => r.ok ? r.json().then(j => { setItems(j.items || []); setNote(""); })
      : setNote(r.status === 401 ? "Wrong admin password." : r.status === 503 ? "The database or admin password isn't set up on Cloudflare yet." : "Couldn't load (error " + r.status + ")."))
      .catch(() => setNote("Couldn't reach the site. Check your connection."));
  };
  const remove = (m) => {
    if (!confirm("Delete this message?")) return;
    call("DELETE", "?id=" + m.id).then(r => { if (r.ok) setItems(list => list.filter(x => x.id !== m.id)); else setNote("Couldn't delete (error " + r.status + ")."); })
      .catch(() => setNote("Couldn't reach the site. Check your connection."));
  };
  const kindLabel = Object.fromEntries(FEEDBACK_KINDS);
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="Admin" style={{ position: "fixed", inset: 0, zIndex: 9300, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Admin: feedback</div>
          <button onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); load(); }} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input type="text" name="username" value="admin" autoComplete="username" readOnly hidden />
          <input type="password" aria-label="Admin password" value={key} onChange={e => setKey(e.target.value)} autoComplete="current-password" placeholder="Admin password" style={{ flex: 1, minWidth: 0, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "10px 12px", fontSize: 16 }} />
          <button type="submit" disabled={!key} style={{ ...bs("var(--accent)"), padding: "10px 14px", fontSize: 13, opacity: key ? 1 : 0.5 }}>{items ? "Refresh" : "Show messages"}</button>
        </form>
        {note && <p role="status" style={{ ...mu, fontSize: 14, margin: "0 0 10px" }}>{note}</p>}
        {items && items.length === 0 && <p style={{ ...mu, fontSize: 14 }}>No messages.</p>}
        {items && items.map(m => (
          <div key={m.id} data-feedback={m.id} style={{ ...cd, padding: 12, marginBottom: 8, borderLeft: "3px solid " + (m.kind === "problem" ? "#E0664A" : m.kind === "idea" ? "var(--blue)" : "var(--line)") }}>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Rajdhani', sans-serif" }}>{kindLabel[m.kind] || m.kind}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", flex: 1 }}>{new Date(m.created_at).toLocaleString()}</span>
              <button onClick={() => remove(m)} style={{ ...bs("#E0664A"), padding: "4px 10px", fontSize: 12 }}>Delete</button>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.5, margin: "6px 0", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{m.message}</div>
            {m.contact && <div style={{ fontSize: 13, color: "var(--text2)", overflowWrap: "anywhere" }}>Reply to: {m.contact}</div>}
            {m.error && <div style={{ fontSize: 12, color: "#E0664A", marginTop: 4, overflowWrap: "anywhere" }}>Error: {m.error}</div>}
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{[m.device, m.screen, m.tab && "tab: " + m.tab, m.version && "version " + m.version].filter(Boolean).join(" · ")}</div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
