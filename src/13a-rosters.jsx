/* ═══ SAVED ROSTERS ═══ */
// The roster library: the rosters saved on this device, each with Play, Edit and a menu (Rename, Copy code, Delete).
// The first piece moved out of the Battle tab's Builder (owner, Nov 13: the middle path). It holds no data itself: the
// Builder passes the list and what each button does. locked: a game is in progress, so Play and Edit wait for it to end.
function SavedRosterLibrary({ rosters, menuId, setMenuId, onPlay, onEdit, onRename, onCopy, onDelete, locked }) {
  if (!rosters.length) return null;
  const small = { ...bs("var(--muted)"), padding: "5px 10px", fontSize: 11 };
  return (
    <div id="ks-saved-rosters" style={{ marginBottom: 12 }}>
      <div style={{ ...h3, marginBottom: 6 }}>My saved rosters</div>
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
              <button onClick={() => onPlay(r)} disabled={locked} title={locked ? "End the game in progress first" : "Start a game with this roster"} style={{ ...bs("#5A9C3A"), padding: "6px 12px", fontSize: 12, opacity: locked ? 0.4 : 1 }}>Play</button>
              <button onClick={() => onEdit(r)} disabled={locked} title={locked ? "End the game in progress first" : "Load it to change operatives or equipment"} style={{ ...bs("var(--muted)"), padding: "6px 10px", fontSize: 12, opacity: locked ? 0.4 : 1 }}>Edit</button>
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
