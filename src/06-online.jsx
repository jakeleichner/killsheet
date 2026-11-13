/* ═══ MULTIPLAYER (PeerJS peer-to-peer) ═══ */
const MP_PREFIX = "KS-";
// ICE config: multiple STUN servers (redundancy) plus ExpressTURN TURN servers for symmetric-NAT fallback.
// TURN traffic is encrypted end-to-end; the relay just forwards opaque packets.
const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
    { urls: "stun:global.stun.twilio.com:3478" },
    // ExpressTURN free tier: UDP, TCP, and TCP-on-443 (firewall bypass)
    { urls: "turn:free.expressturn.com:3478", username: "000000002093370707", credential: "c2p512k7LlW6Rc9l98gsjjQkdAo=" },
    { urls: "turn:free.expressturn.com:3478?transport=tcp", username: "000000002093370707", credential: "c2p512k7LlW6Rc9l98gsjjQkdAo=" },
    { urls: "turn:free.expressturn.com:443?transport=tcp", username: "000000002093370707", credential: "c2p512k7LlW6Rc9l98gsjjQkdAo=" },
  ],
};
function genRoomCode() {
  // 6-char base32 (avoid 0/O/I/1 confusion)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
const MP_RETRY_MS = 3000;
const MP_RETRIES = 20; // about a minute of trying the same room
const MP_ROOM_HOURS = 12; // how long the Rejoin bar offers a dropped room
// Hits and heals arrive exactly once. Each gets a tag (mid) and waits in the outbox until the other phone says "got it"
// (an ack); it's resent every few seconds and on reconnect, and a phone that has seen a tag ignores it the second time.
// A phone on an older KillSheet never acks, so nothing is resent to it unless it has acked before (no double hits there).
// Pure, so the self-test can run two pretend phones through drops and repeats.
const MP_RESEND_MS = 4000;
const MP_SEEN_MAX = 300;
const mpTag = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
function mpOutboxAdd(outbox, msg) { const out = { ...msg, mid: mpTag() }; return [[...(outbox || []), out].slice(-50), out]; }
// What to send now: everything never sent, plus (once the other phone acks) anything unanswered for MP_RESEND_MS.
// Returns the messages to send and the outbox to keep. Without acks, a message is sent once, as before tags.
function mpOutboxDue(outbox, now, peerAcks) {
  const send = [], keep = [];
  (outbox || []).forEach(m => {
    if (m.sentAt == null) { send.push(m); keep.push({ ...m, sentAt: now }); }
    else if (peerAcks) { if (now - m.sentAt >= MP_RESEND_MS) { send.push(m); keep.push({ ...m, sentAt: now }); } else keep.push(m); }
  });
  return { send: send.map(({ sentAt, ...m }) => m), keep };
}
const mpAcked = (outbox, mid) => (outbox || []).filter(m => m.mid !== mid);
// An incoming tagged message: always answer "got it"; pass it on only the first time.
function mpReceive(seen, msg) {
  const ack = { type: "ack", mid: msg.mid };
  if ((seen || []).includes(msg.mid)) return { deliver: false, ack, seen };
  return { deliver: true, ack, seen: [...(seen || []), msg.mid].slice(-MP_SEEN_MAX) };
}

function useMultiplayer(onMessage) {
  // status: 'idle' | 'hosting' | 'joining' | 'connected' | 'error'
  const [status, setStatus] = useState("idle");
  const [role, setRole] = useState(null); // 'host' | 'guest' | null
  const [roomCode, setRoomCode] = useState(null);
  const [peerError, setPeerError] = useState("");
  const [lost, setLost] = useState(false); // the link dropped and we're waiting for it to come back
  // The room survives reloads so either player can rejoin it with one tap.
  const [lastRoom, setLastRoom] = useLocalStorage("mpRoom", null); // { code, role, ts }
  // Damage and heals waiting for the other phone's "got it" (sent, or held while the link is down). Kept across reloads.
  const [pending, setPending] = useLocalStorage("mpPending", []);
  const [seen, setSeen] = useLocalStorage("mpSeen", []); // tags already applied here
  const seenRef = React.useRef(seen);
  seenRef.current = seen;
  const peerAcksRef = React.useRef(false); // the other phone answers "got it" (a current KillSheet)
  const peerRef = React.useRef(null);
  const connRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const triesRef = React.useRef(0);
  const pendingRef = React.useRef(pending);
  pendingRef.current = pending;
  const onMessageRef = React.useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  // Send what's due in the outbox on this connection; all = everything waiting (just reconnected).
  const flush = (conn, all) => {
    const now = Date.now(), waiting = pendingRef.current || [];
    const due = all ? { send: waiting.map(({ sentAt, ...m }) => m), keep: waiting.map(m => ({ ...m, sentAt: now })) } : mpOutboxDue(waiting, now, peerAcksRef.current);
    if (!due.send.length) return;
    try { due.send.forEach(m => conn.send(m)); } catch (e) { return; } // left as they were: the next try or reconnect sends them
    // Without "got it" from the other phone, a message sent once is done (as before tags).
    const keep = peerAcksRef.current ? due.keep : due.keep.filter(m => !due.send.some(x => x.mid === m.mid));
    pendingRef.current = keep; setPending(keep);
  };
  const cleanup = () => {
    clearTimeout(timerRef.current);
    const conn = connRef.current, peer = peerRef.current;
    connRef.current = null;
    peerRef.current = null;
    try { if (conn) conn.close(); } catch (e) {}
    try { if (peer) peer.destroy(); } catch (e) {}
  };

  const friendlyError = (msg) => {
    if (msg.indexOf("Negotiation") !== -1) return "Connection failed, probably a network or firewall problem. Try a different network or use export/import codes.";
    if (msg.indexOf("network") !== -1 || msg.indexOf("Network") !== -1) return "Network error. Check your internet connection.";
    if (msg.indexOf("server-error") !== -1) return "PeerJS broker is having issues. Try again in a minute.";
    return msg;
  };

  const wireConnection = (conn, asRole, code) => {
    connRef.current = conn;
    let opened = false;
    const dropped = () => {
      if (connRef.current !== conn) return; // an older link closing after a newer one opened
      connRef.current = null;
      setLost(true);
      if (asRole === "host") setStatus("hosting"); // the room stays open; the guest can come back
      else retryJoin(code);
    };
    conn.on("open", () => {
      opened = true;
      setStatus("connected"); setPeerError(""); setLost(false);
      triesRef.current = 0;
      setLastRoom({ code, role: asRole, ts: Date.now() });
      // Say this KillSheet answers "got it", then send everything not yet answered; the other phone ignores repeats.
      try { conn.send({ type: "hello", acks: 1 }); } catch (e) {}
      flush(conn, true);
    });
    conn.on("data", (msg) => {
      if (msg && msg.type === "hello") { if (msg.acks) peerAcksRef.current = true; return; }
      if (msg && msg.type === "ack" && typeof msg.mid === "string") {
        peerAcksRef.current = true;
        setPending(prev => mpAcked(prev, msg.mid));
        return;
      }
      if (msg && typeof msg.mid === "string") {
        peerAcksRef.current = true; // it tags its messages, so it answers ours
        const r = mpReceive(seenRef.current, msg);
        try { conn.send(r.ack); } catch (e) {}
        if (!r.deliver) return;
        seenRef.current = r.seen; setSeen(r.seen);
      }
      if (msg && msg.type === "bye") { // they pressed Disconnect: don't wait for them to come back
        connRef.current = null;
        cleanup();
        setLastRoom(null); setPending([]); setLost(false);
        setPeerError("Your opponent ended the online game.");
        setStatus("error");
        return;
      }
      if (onMessageRef.current) onMessageRef.current(msg);
    });
    conn.on("close", dropped);
    conn.on("error", (err) => {
      if (!opened) setPeerError(friendlyError(String(err && err.message || err)));
      dropped();
    });
  };

  // PeerJS loads after the page shows (only online play needs it), so a tap in the first moments waits for it,
  // up to 15 seconds, showing "Connecting...".
  const withPeer = (go) => {
    setStatus("joining");
    let waited = 0;
    const t = setInterval(() => {
      if (window.Peer) { clearInterval(t); go(); }
      else if ((waited += 250) >= 15000) { clearInterval(t); setPeerError("Couldn't load online play. Check your connection and try again."); setStatus("error"); }
    }, 250);
  };

  const host = (reuse) => {
    if (!window.Peer) return withPeer(() => host(reuse));
    const code = typeof reuse === "string" ? reuse : genRoomCode();
    if (typeof reuse !== "string") triesRef.current = 0;
    cleanup();
    const peer = new window.Peer(MP_PREFIX + code, { debug: 0, config: ICE_CONFIG });
    peerRef.current = peer;
    setStatus("hosting");
    setRole("host");
    setRoomCode(code);
    setLastRoom({ code, role: "host", ts: Date.now() });
    peer.on("connection", (conn) => { wireConnection(conn, "host", code); });
    // Lost touch with the broker (not the opponent): get the same ID back so the guest can still find us.
    peer.on("disconnected", () => { if (peerRef.current === peer) { try { peer.reconnect(); } catch (e) {} } });
    peer.on("error", (err) => {
      if (peerRef.current !== peer) return;
      const msg = String(err && err.message || err);
      if (msg.indexOf("is taken") !== -1 || msg.indexOf("unavailable-id") !== -1) {
        // Rejoining: the broker still holds our old room for a few seconds after a reload. New game: someone has this code.
        if (typeof reuse === "string" && triesRef.current++ < MP_RETRIES) { setPeerError("Reopening room " + code + "..."); timerRef.current = setTimeout(() => host(code), MP_RETRY_MS); return; }
        if (typeof reuse !== "string") { setTimeout(() => host(), 100); return; }
      }
      setPeerError(friendlyError(msg));
      setStatus("error");
    });
  };

  const join = (raw, retrying) => {
    if (!window.Peer) return withPeer(() => join(raw, retrying));
    if (!raw || raw.length < 4) { setPeerError("Invalid room code"); setStatus("error"); return; }
    const code = raw.toUpperCase();
    if (!retrying) triesRef.current = 0;
    cleanup();
    const peer = new window.Peer(undefined, { debug: 0, config: ICE_CONFIG });
    peerRef.current = peer;
    setStatus("joining");
    setRole("guest");
    setRoomCode(code);
    setLastRoom({ code, role: "guest", ts: Date.now() });
    peer.on("open", () => { wireConnection(peer.connect(MP_PREFIX + code, { reliable: true }), "guest", code); });
    peer.on("error", (err) => {
      if (peerRef.current !== peer) return;
      const msg = String(err && err.message || err);
      // While rejoining, the host may be reloading too: keep trying for a while.
      if (retrying) { retryJoin(code); return; }
      setPeerError(msg.indexOf("Could not connect") !== -1 || msg.indexOf("peer-unavailable") !== -1 ? "Room not found. Check the code." : friendlyError(msg));
      setStatus("error");
    });
  };

  const retryJoin = (code) => {
    clearTimeout(timerRef.current);
    setLost(true);
    if (triesRef.current++ >= MP_RETRIES) {
      cleanup();
      setPeerError("Couldn't reach room " + code + ". The host may have closed it.");
      setStatus("error");
      return;
    }
    setStatus("joining");
    timerRef.current = setTimeout(() => join(code, true), MP_RETRY_MS);
  };

  // A phone that slept can come back with a dead link and no close event yet.
  useEffect(() => {
    const onVisible = () => {
      const conn = connRef.current;
      if (document.visibilityState === "visible" && conn && status === "connected" && conn.open === false) { try { conn.close(); } catch (e) {} }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [status]);

  const disconnect = () => {
    const conn = connRef.current, peer = peerRef.current;
    if (conn && status === "connected") {
      // Say goodbye first so their app stops trying to rejoin, then close once it has gone out.
      try { conn.send({ type: "bye" }); } catch (e) {}
      connRef.current = null; peerRef.current = null;
      clearTimeout(timerRef.current);
      setTimeout(() => { try { conn.close(); } catch (e) {} try { peer.destroy(); } catch (e) {} }, 300);
    } else cleanup();
    setStatus("idle");
    setRole(null);
    setRoomCode(null);
    setPeerError("");
    setLost(false);
    setLastRoom(null);
    setPending([]);
    setSeen([]);
    peerAcksRef.current = false;
  };

  const rejoin = () => {
    if (!lastRoom) return;
    triesRef.current = 0;
    if (lastRoom.role === "host") host(lastRoom.code); else join(lastRoom.code, true);
  };

  const send = (msg) => {
    const conn = connRef.current;
    if (conn && status === "connected") {
      try { conn.send(msg); return true; } catch (e) { return false; }
    }
    return false;
  };
  // Hits and heals: into the outbox with a tag, sent now if connected, and resent until the other phone answers.
  const sendOrQueue = (msg) => {
    if (!lastRoom && status !== "connected") return false;
    const [outbox] = mpOutboxAdd(pendingRef.current, msg);
    pendingRef.current = outbox; setPending(outbox);
    const conn = connRef.current;
    if (conn && status === "connected") { flush(conn); return true; }
    return false;
  };
  // While connected, resend anything the other phone hasn't answered.
  useEffect(() => {
    if (status !== "connected") return;
    const t = setInterval(() => { const conn = connRef.current; if (conn && (pendingRef.current || []).length) flush(conn); }, 1000);
    return () => clearInterval(t);
  }, [status]);

  const roomFresh = lastRoom && Date.now() - lastRoom.ts < MP_ROOM_HOURS * 3600 * 1000 ? lastRoom : null;
  return { status, role, roomCode, peerError, lost, lastRoom: roomFresh, pendingCount: (pending || []).filter(m => m.sentAt == null || Date.now() - m.sentAt > MP_RESEND_MS).length, host, join, rejoin, disconnect, send, sendOrQueue };
}

