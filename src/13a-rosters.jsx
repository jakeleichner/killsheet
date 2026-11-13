/* ═══ SAVED ROSTERS ═══ */
// The roster library: the rosters saved on this device, each with Play, Edit and a menu (Rename, Copy code, Delete).
// The first piece moved out of the Battle tab's Builder (owner, Nov 13: the middle path). It holds no data itself: the
// Builder passes the list and what each button does. locked: a game is in progress, so Play and Edit wait for it to end.
function SavedRosterLibrary({ rosters, menuId, setMenuId, onPlay, onEdit, onRename, onCopy, onDelete, locked, onView }) {
  if (!rosters.length) return null;
  const small = { ...bs("var(--muted)"), padding: "5px 10px", fontSize: 11 };
  return (
    <div id="ks-saved-rosters" style={{ marginBottom: 12 }}>
      <div style={{ ...h3, marginBottom: 6 }}>Saved rosters</div>
      {rosters.map(r => {
        const fc = FACTIONS[r.f];
        const menu = menuId === r.id;
        return (
          <div key={r.id} data-saved-roster={r.id} style={{ ...cd, padding: "8px 10px", marginBottom: 6, borderLeft: "3px solid " + (fc ? fc.color : "var(--line)") }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif", overflowWrap: "anywhere" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{fc ? fc.name : "Unknown team"} {"\u00b7"} {r.o.length} operative{r.o.length === 1 ? "" : "s"} {"\u00b7"} {new Date(r.savedAt).toLocaleDateString()}</div>
              </div>
              {locked
                ? onView && <button onClick={() => onView(r)} title="Read its datacards" style={{ ...bs("var(--muted)"), padding: "6px 10px", fontSize: 12 }}>View cards</button>
                : <>
                  <button onClick={() => onPlay(r)} title="Start a game with this roster" style={{ ...bs("#5A9C3A"), padding: "6px 12px", fontSize: 12 }}>Play</button>
                  <button onClick={() => onEdit(r)} title="Load it to change operatives or equipment" style={{ ...bs("var(--muted)"), padding: "6px 10px", fontSize: 12 }}>Edit</button>
                </>}
              <button onClick={() => setMenuId(menu ? null : r.id)} aria-label="More options" style={{ ...bs("var(--muted)"), padding: "6px 10px", fontSize: 12 }}>{"\u22EF"}</button>
            </div>
            {menu && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <button onClick={() => onRename(r)} style={small}>Rename</button>
                <button onClick={() => onCopy(r)} style={small}>Copy code</button>
                <button onClick={() => onDelete(r)} style={{ ...small, color: "#E0664A", borderColor: "#B8341C60" }}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Game history: wins, losses and draws overall, by your team and against each team, average score, the current streak,
// and the last ten games with their recaps. Moved out of the Builder (middle path); remove asks the Builder (Undo).
function GameHistoryCard({ games, open, setOpen, openGame, setOpenGame, onRemove }) {
  if (!games.length) return null;
  const tally = (games) => games.reduce((t, g) => ({ ...t, [g.result]: t[g.result] + 1 }), { win: 0, loss: 0, draw: 0 });
  const all = tally(games);
  const byTeam = Object.values(games.reduce((m, g) => { (m[g.f] = m[g.f] || { f: g.f, team: g.team, games: [] }).games.push(g); return m; }, {})).sort((a, b) => b.games.length - a.games.length);
  const resColor = { win: "#5A9C3A", loss: "#E0664A", draw: "var(--gold)" };
  // Lifetime numbers: win rate (draws count as games), average score, the current run of results, record against each team.
  const winRate = Math.round(100 * all.win / games.length);
  const avg = (k) => { const v = games.reduce((t, g) => t + (Number(g[k]) || 0), 0) / games.length; return Math.round(v * 10) / 10; };
  let streak = 0; while (streak < games.length && games[streak].result === games[0].result) streak++;
  const streakText = streak >= 2 ? streak + " " + { win: "wins", loss: "losses", draw: "draws" }[games[0].result] + " in a row" : null;
  const vsTeam = Object.values(games.filter(g => g.oppId).reduce((m, g) => { (m[g.oppId] = m[g.oppId] || { f: g.oppId, team: g.opp, games: [] }).games.push(g); return m; }, {})).sort((a, b) => b.games.length - a.games.length);
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
      <div role="button" tabIndex={0} aria-expanded={open} onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Rajdhani', sans-serif" }}>Game history</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{games.length} game{games.length === 1 ? "" : "s"} {"\u00b7"} {all.win}W {all.loss}L {all.draw}D {"\u00b7"} {winRate}% wins</div>
        </div>
        <Arrow open={open} />
      </div>
      {open && (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 13, color: "var(--text2)", padding: "2px 0 8px" }}>
            <span>Average score: <strong style={{ color: "#5A9C3A" }}>You {avg("you")}</strong> {"\u00b7"} <strong style={{ color: "#E0664A" }}>Opponents {avg("them")}</strong></span>
            {streakText && <span>Streak: <strong style={{ color: resColor[games[0].result] }}>{streakText}</strong></span>}
          </div>
          <div style={{ ...h3, margin: "4px 0 4px" }}>Your teams</div>
          {byTeam.map(teamRow)}
          {vsTeam.length > 0 && <div style={{ ...h3, margin: "12px 0 4px" }}>Against each team</div>}
          {vsTeam.map(teamRow)}
          <div style={{ ...h3, margin: "12px 0 4px" }}>Recent games</div>
          {games.slice(0, 10).map(g => (
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
              <button className="compact-btn" onClick={(e) => { e.stopPropagation(); onRemove(g); }} aria-label="Remove this game" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 0, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="x" size={16} /></button>
            </div>
            {openGame === g.id && g.recap && <div style={{ padding: "0 0 10px 4px" }}><GameRecap recap={g.recap} /></div>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// The Battle tab with no game: start the roster that's built, or play a saved one (children: the library).
function NoGameScreen({ team, rosterSize, hasSaved, onStart, onBuild, children }) {
  return (
    <div data-no-game="true">
      <div style={{ ...cd, padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: "var(--text)" }}>No game in progress</div>
        <p style={{ ...mu, fontSize: 14, margin: "4px 0 12px" }}>{hasSaved ? "Tap Play on a saved roster, or build one in the Rosters tab." : "Build a roster in the Rosters tab, then start a game from there."}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {team && rosterSize > 0 && <button onClick={onStart} style={{ ...bs("#5A9C3A"), padding: "10px 14px", fontSize: 13 }}>Start a game with {team.name} ({rosterSize}) <Fwd /></button>}
          <button onClick={onBuild} style={{ ...bs("var(--accent)"), padding: "10px 14px", fontSize: 13 }}>{team && rosterSize ? "Change the roster" : "Build a roster"}</button>
        </div>
      </div>
      {children}
    </div>
  );
}

// The Rosters tab during a game: a slim bar to get back to the game or end it, then your rosters (children), which you
// can read (View cards) but not play or edit until the game ends.
function GameOnScreen({ team, onBack, onEnd, children }) {
  return (
    <div data-game-on="true">
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "8px 10px", marginBottom: 12, borderRadius: 6, background: "color-mix(in srgb, var(--gold) 12%, var(--card))", border: "1px solid color-mix(in srgb, var(--gold) 40%, transparent)" }}>
        <div style={{ flex: "1 1 160px", minWidth: 0, fontSize: 14, fontWeight: 700, fontFamily: "'Rajdhani', sans-serif", color: "var(--text)" }}>Game in progress{team ? ": " + team.name : ""}</div>
        <button onClick={onBack} style={{ ...bs("#5A9C3A"), padding: "6px 12px", fontSize: 12 }}>Back to the game <Fwd /></button>
        <button onClick={onEnd} style={{ ...bs("var(--muted)"), padding: "6px 12px", fontSize: 12 }}>End game</button>
      </div>
      <p style={{ ...mu, fontSize: 13, margin: "0 0 8px" }}>Play and Edit come back when the game ends.</p>
      {children}
    </div>
  );
}

// A saved roster's datacards, to read during a game. It opens over everything, like the other full-screen pages.
function RosterViewer({ entry, onClose }) {
  useBackClose(true, onClose);
  const [open, setOpen] = useState({});
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const fc = FACTIONS[entry.f];
  const ops = fc ? makeInstances(fc, entry.o).map((o, i) => entry.nk && entry.nk[i] ? { ...o, nick: entry.nk[i] } : o) : [];
  const equip = fc ? [...(entry.fe || []).map(id => (fc.equipment.find(q => q.id === id) || {}).name), ...(entry.ue || []).map(id => (UNIV_EQUIP.find(q => q.id === id) || {}).name)].filter(Boolean) : [];
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label={"Datacards: " + entry.name} style={{ position: "fixed", inset: 0, zIndex: 9200, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div className="ks-appear" style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 1, minWidth: 0, fontSize: 22, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", overflowWrap: "anywhere" }}>{entry.name}</div>
          <button autoFocus onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        <p style={{ ...mu, fontSize: 13, margin: "0 0 12px" }}>{fc ? fc.name : "Unknown team"} {"\u00b7"} {ops.length} operative{ops.length === 1 ? "" : "s"}{equip.length ? " \u00b7 Equipment: " + equip.join(", ") : ""}</p>
        {fc ? ops.map(op => (
          <Datacard key={op.id} op={op} preview f={fc} fc={fc.color} equipWeapons={[]} equipEffects={[]} photo={photoFor(entry.f, op.id)}
            collapsed={!open[op.id]} onToggle={() => setOpen(o => ({ ...o, [op.id]: !o[op.id] }))} />
        )) : <p style={mu}>This team is no longer in KillSheet.</p>}
      </div>
    </div>,
    document.body
  );
}
