/* ═══ RULE TIPS ═══ */
// Bold orange words that explain themselves: tap on a phone, hover (or click to pin) on a computer.
// One sentence, plus a link to the full rule in the Rules tab when there is one. One tip open at a time.
const TERM_TIPS = {
  APL: ["APL (action point limit)", "The most action points this operative can spend each time it activates. Most actions cost 1.", "Datacard stats"],
  Move: ["Move", "How far this operative moves with a Reposition, in inches. A Charge adds 2\", and a Dash is always 3\".", "Reposition"],
  Save: ["Save", "The score each defense die needs to block a hit. Lower is better.", "Datacard stats"],
  Wounds: ["Wounds", "How much damage this operative can take. Under half, it's injured (2\" less Move, Hit 1 worse); at 0 it's incapacitated and removed.", "Damage"],
  ATK: ["ATK (attacks)", "How many attack dice you roll with this weapon.", "Weapon stats"],
  HIT: ["HIT", "The score each attack die needs to succeed. Lower is better. A 6 is always a critical success.", "Weapon stats"],
  DMG: ["DMG (damage)", "Damage for each normal success / each critical success. 3/4 means 3 for a normal hit and 4 for a critical.", "Weapon stats"],
  TP: ["Turning point", "One round of the game: a Strategy phase, then a Firefight phase. A battle lasts four unless the mission says otherwise.", "Turning points"],
  CP: ["CP (command points)", "Spend them on ploys, 1CP each. You start with 2 and gain more in every Strategy phase.", "Command Points"],
  VP: ["VP (victory points)", "Points you score from the mission. Whoever has the most at the end of the battle wins.", "Winning"],
  Crit: ["Critical success", "A die that rolls a 6 (some rules, like Lethal, lower that). An attack crit deals the weapon's critical Dmg, the second number. A defense crit can block a normal or a critical success.", "Dice"],
  Normal: ["Normal success", "A die that equals or beats the Hit stat (attack) or Save stat (defense) but isn't a critical success. An attack's normal success deals the first Dmg number.", "Dice"],
  Retain: ["Retain", "Keep a die as a success. After rolling, dice that equal or beat the stat are retained and the rest are discarded as fails. Some rules let you retain a die without rolling it, like a cover save.", "Dice"],
  Cover: ["Cover", "An operative is in cover if there's terrain between it and the shooter within 1\" of it, unless the shooter is within 2\". In cover it keeps one defense die as a normal success without rolling (its cover save), and on Conceal it can't be targeted.", "Cover"],
  Obscured: ["Obscured", "A target is obscured if there's Heavy terrain between it and the shooter more than 1\" from both. The shooter discards one success, and all their critical successes become normal successes.", "Obscured"],
  ValidTarget: ["Valid target", "An operative you're allowed to shoot. On Engage it's a valid target if it's visible. On Conceal it's only a valid target if it's visible and not in cover.", "Valid target"],
  ControlRange: ["Control range", "Within 1\" of an operative and visible to it. It works both ways: if either operative is within the other's control range, both are.", "Control range"],
  PrimaryTarget: ["Primary target", "The target you pick when shooting with a Blast or Torrent weapon. After it's shot, the weapon also shoots its secondary targets.", "Blast"],
  SecondaryTarget: ["Secondary target", "Other operatives a Blast or Torrent weapon also shoots, picked by the rule's distance from the primary target. Each one is shot separately, with its own dice.", "Torrent"],
  Order: ["Ready and orders", "Ready means it hasn't activated yet this turning point. Tap it once it has, and it shows Expended. Conceal or Engage is its order, chosen when it activates (tap to switch). On Conceal it can't be targeted while in cover, but it can't Shoot or Charge. On Engage it acts normally.", "Orders"],
};
const NUMBERED_WR = [
  [/^Range (\d+)"$/, (n) => "This weapon can only target operatives within " + n + "\" of the shooter."],
  [/^Lethal (\d)\+$/, (n) => "Attack rolls of " + n + " or more count as critical successes (normally only 6s do)."],
  [/^Piercing (\d)$/, (n) => "The defender rolls " + n + " fewer defense dice, whether or not you score crits."],
  [/^Piercing Crits (\d)$/, (n) => "If you retain at least one critical success, the defender rolls " + n + " fewer defense dice."],
  [/^Accurate (\d)$/, (n) => "Before rolling, you may set aside up to " + n + " attack dice and count them as automatic normal successes. Then roll the rest."],
  [/^Devastating (\d)$/, (n) => "Each time you retain a critical success, deal " + n + " damage to the target right away. The crit still counts in the normal damage step."],
  [/^(\d)" Devastating (\d)$/, (d, n) => "Each time you retain a critical success, deal " + n + " damage to the target and to each other operative visible to and within " + d + "\" of it."],
  [/^Blast (\d)"$/, (d) => WR["Blast 1\""].replace(/1"/g, d + "\"")],
  [/^Torrent (\d)"$/, (d) => WR["Torrent 1\""].replace(/1"/g, d + "\"")],
];
// A team's own weapon rules ("Blaze", "Salvo"...), from its faction rules and operative abilities.
let TEAM_WR = null;
const teamWeaponRules = () => {
  if (TEAM_WR) return TEAM_WR;
  TEAM_WR = {};
  Object.values(FACTIONS).forEach(f => {
    (f.factionRules || []).forEach(r => { if (r.name && r.desc && !TEAM_WR[r.name]) TEAM_WR[r.name] = r.desc.replace(/^Weapon rule\.\s*/, ""); });
    (f.operatives || []).forEach(op => (op.abilities || []).forEach(a => { const m = a.match(/^([^:(]+?) \(weapon rule\): ([\s\S]*)$/); if (m && !TEAM_WR[m[1]]) TEAM_WR[m[1]] = m[2]; }));
  });
  return TEAM_WR;
};
// The operative's own weapon rules come first, since some teams use the same name for different rules.
const opWeaponRules = (op) => {
  const out = {};
  (op.abilities || []).forEach(a => { const m = a.match(/^([^:(]+?) \(weapon rule\): ([\s\S]*)$/); if (m) out[m[1]] = m[2]; });
  return out;
};
// [text, Rules tab search] for a weapon rule, or null if KillSheet has nothing on it.
const weaponRuleTip = (k, local) => {
  if (local && local[k]) return [local[k], null];
  const base = k.replace(/^\d+" /, "").replace(/\s*\d+\+?"?$/, "");
  if (WR[k]) return [WR[k], base];
  for (const [re, fn] of NUMBERED_WR) { const m = k.match(re); if (m) return [fn(m[1], m[2]), base]; }
  const t = teamWeaponRules()[k];
  return t ? [t, null] : null;
};

// Words inside a tip that open their own explanation in the same card (first mention of each).
const TIP_LINKS = [
  [/[Cc]ritical success(?:es)?|\bcrits?\b/, "Crit"],
  [/[Nn]ormal success(?:es)?/, "Normal"],
  [/\b[Rr]etain(?:s|ed|ing)?\b/, "Retain"],
  [/\b[Cc]over\b/, "Cover"],
  [/\b[Oo]bscured\b/, "Obscured"],
  [/\b[Vv]alid targets?\b/, "ValidTarget"],
  [/\b[Cc]ontrol range\b/, "ControlRange"],
  [/\b[Pp]rimary targets?\b/, "PrimaryTarget"],
  [/\b[Ss]econdary targets?\b/, "SecondaryTarget"],
];
const TIP_LINK_RE = new RegExp(TIP_LINKS.map(([re]) => "(" + re.source + ")").join("|"), "g");
const termEntry = (k) => ({ key: k, term: TERM_TIPS[k][0], text: TERM_TIPS[k][1], link: TERM_TIPS[k][2] });
// Text with its linked words as buttons: the TIP_LINKS words, then any rule names from refs (first mention of each).
const tipText = (text, skip, onOpen, refs) => {
  const found = [];
  TIP_LINK_RE.lastIndex = 0;
  let m;
  while ((m = TIP_LINK_RE.exec(text))) found.push({ s: m.index, e: m.index + m[0].length, m: m[0], entry: termEntry(TIP_LINKS[m.slice(1).findIndex(Boolean)][1]) });
  refMatches(text, refs || coreRefs()).forEach(x => found.push(x));
  found.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s));
  const out = []; const used = new Set(skip); let last = 0;
  found.forEach(x => {
    if (x.s < last) return;
    if (used.has(x.entry.key)) return;
    used.add(x.entry.key);
    out.push(text.slice(last, x.s));
    out.push(<button key={x.s} className="link-btn" onClick={() => onOpen(x.entry)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontWeight: 600, fontSize: "inherit", fontFamily: "inherit", textDecoration: "underline dotted", textUnderlineOffset: 3 }}>{x.m}</button>);
    last = x.e;
  });
  out.push(text.slice(last));
  return out;
};

let closeOpenTip = null;
function RuleTip({ term, text, link, children, style, label, tkey, refs }) {
  const { feat, openRule } = React.useContext(FeatureCtx);
  const [open, setOpen] = useState(false); // false, "hover" or "pinned"
  const [trail, setTrail] = useState([]); // entries opened from inside this tip ({ key, term, text, link }), newest last
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const timer = React.useRef(null);
  const close = React.useCallback(() => { clearTimeout(timer.current); setOpen(false); setTrail([]); }, []);
  const show = (how) => { clearTimeout(timer.current); if (closeOpenTip && closeOpenTip !== close) closeOpenTip(); closeOpenTip = close; setOpen(how); };
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!(ref.current && ref.current.contains(e.target)) && !(cardRef.current && cardRef.current.contains(e.target))) close(); };
    const key = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      if (closeOpenTip === close) closeOpenTip = null;
    };
  }, [open, close]);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  if (!feat.tips || !text) return <span style={style}>{children || term}</span>;
  const leaveSoon = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(o => (o === "hover" ? false : o)), 150); };
  let card = null;
  const cur = trail.length ? trail[trail.length - 1] : { term, text, link };
  if (open && ref.current) {
    const r = ref.current.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 16);
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    const above = window.innerHeight - r.bottom < 170 && r.top > 170;
    card = ReactDOM.createPortal(
      <div ref={cardRef} role="tooltip" onClick={(e) => e.stopPropagation()}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") clearTimeout(timer.current); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") leaveSoon(); }}
        style={{ position: "fixed", zIndex: 9600, left, width, boxSizing: "border-box", ...(above ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
          background: "var(--card)", border: "1px solid color-mix(in srgb, var(--accent) 44%, transparent)", borderRadius: 6, padding: "10px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.45, color: "var(--text)", textAlign: "left", textTransform: "none", letterSpacing: "normal", whiteSpace: "normal" }}>
        {trail.length > 0 && (
          <button className="link-btn" onClick={() => setTrail(t => t.slice(0, -1))} style={{ display: "block", background: "none", border: "none", padding: 0, marginBottom: 6, cursor: "pointer", color: "var(--muted)", fontSize: 13 }}><Back size={13} /> Back to {trail.length > 1 ? trail[trail.length - 2].term : term}</button>
        )}
        <span style={{ fontWeight: 700, color: "var(--accent)" }}>{cur.term}: </span>{tipText(cur.text, [tkey, ...trail.map(t => t.key)], (entry) => { setOpen("pinned"); setTrail(t => [...t, entry]); }, refs)}
        {cur.link && (
          <div style={{ marginTop: 6 }}>
            <button className="link-btn" onClick={() => { const l = cur.link; close(); openRule(l); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>More information in Rules <Fwd size={13} /></button>
          </div>
        )}
      </div>,
      document.body
    );
  }
  return (
    <span ref={ref} role="button" tabIndex={0} aria-expanded={!!open} aria-label={label || ("What is " + term + "?")}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (open === "pinned") close(); else show("pinned"); }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse" && open !== "pinned") { clearTimeout(timer.current); timer.current = setTimeout(() => show("hover"), 300); } }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") leaveSoon(); }}
      onFocus={(e) => { if (e.target.matches(":focus-visible") && !open) show("hover"); }}
      onBlur={() => setOpen(o => (o === "hover" ? false : o))}
      style={{ fontWeight: 700, color: "var(--accent)", cursor: "help", textDecoration: feat.labels ? "underline dotted" : "none", textUnderlineOffset: 3, ...style }}>
      {children || term}{card}
    </span>
  );
}
// A word the app explains, by its key in TERM_TIPS.
function Term({ k, children, style }) {
  const t = TERM_TIPS[k];
  return <RuleTip term={t[0]} text={t[1]} link={t[2]} style={style} tkey={k}>{children || k}</RuleTip>;
}
// A small (i) for words that are also buttons, like the order chips. Learning mode only.
function TermInfo({ k }) {
  const { feat } = React.useContext(FeatureCtx);
  if (!feat.labels) return null;
  const t = TERM_TIPS[k];
  return <RuleTip term={t[0]} text={t[1]} link={t[2]} label={"What does " + t[0] + " mean?"} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, flexShrink: 0, textDecoration: "none" }}><Icon name="info" size={18} /></RuleTip>;
}
// Weapon rules, by their text on the weapon ("Lethal 5+", "Range 8\"", "Blaze").
function Tip({ k, children, local }) {
  const t = weaponRuleTip(k, local);
  if (!t) return <span>{children || k}</span>;
  return <RuleTip term={k} text={t[0]} link={t[1]}>{children || k}</RuleTip>;
}

// Rule names inside rule text open that rule as a tip: the team's own rules (faction rules, ploys,
// equipment, abilities and unique actions), weapon rules, universal equipment and core actions.
// Each ref: { id, re, term, text, link }; term and text can be functions of the matched words.
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const refEntry = (id, forms, term, text, link) => ({ id, re: new RegExp(forms, "g"), term, text, link: link || null });
const ruleBody = (it) => [it.summary, ...[].concat(it.detail || [])].filter(Boolean).join(" ");
let CORE_REFS = null;
const coreRefs = () => {
  if (CORE_REFS) return CORE_REFS;
  const act = (name, forms) => { const a = CORE_ACTIONS.find(x => x.name === name); return refEntry("act:" + name, forms, name + " (" + a.tag + ")", ruleBody(a), name); };
  const counter = GAME_SEQUENCE.find(x => x.name === "Counteract");
  const reroll = CORE_CONCEPTS.find(x => x.name === "Command Re-roll");
  const wrTip = (m) => (weaponRuleTip(m) || [""])[0];
  const list = [
    act("Reposition", "Reposition(?:s|ed|ing)?"),
    act("Dash", "Dash(?:es|ed|ing)?"),
    act("Fall Back", "(?:Fall(?:s|ing)?|Fell|Fallen) Back"),
    act("Charge", "Charg(?:e|es|ed|ing)"),
    act("Shoot", "Shoot(?:s|ing)?"),
    act("Fight", "Fight(?:s|ing)?|Fought"),
    act("Pick Up Marker", "Pick Up Marker"),
    act("Place Marker", "Place Marker"),
    refEntry("counteract", "[Cc]ounteract(?:s|ed|ing)?", "Counteract", ruleBody(counter), "Counteract"),
    refEntry("reroll", "Command Re-roll", "Command Re-roll (1CP)", reroll.summary, "Command Re-roll"),
    refEntry("gambit", "STRATEGIC GAMBIT|[Ss]trategic gambit", "Strategic gambit", "Used in the Gambits step of the Strategy phase, where players take turns using a strategy ploy or strategic gambit, or passing. A strategic gambit from a team rule costs no CP. Each one can be used once per turning point.", "Strategy phase"),
    refEntry("support", "SUPPORT", "SUPPORT", "A rule that helps other friendly operatives. If it reaches them within a distance, a Comms Device (universal equipment) adds 3\" to that distance while this operative controls the device."),
  ];
  // Weapon rules: exact names, numbered ones ("Lethal 5+"), and bare names ("ignore Piercing").
  Object.keys(WR).filter(k => !/^(Range|Poison|Toxic|PSYCHIC|Explosive)|\d/.test(k)).forEach(k => list.push(refEntry("wr:" + k, escapeRe(k) + (k === "Heavy" ? "(?! terrain| or Light| and Light| \\()" : ""), k, WR[k], k)));
  [["Lethal", "Lethal \\d\\+"], ["Piercing Crits", "Piercing Crits \\d"], ["Piercing", "Piercing \\d"], ["Accurate", "Accurate \\d"], ["Devastating", "\\d\" Devastating \\d|Devastating \\d"], ["Blast", "Blast \\d\""], ["Torrent", "Torrent \\d\""], ["Limited", "Limited \\d"]].forEach(([name, forms]) => {
    list.push(refEntry("wr:" + name, forms, (m) => m, (m) => wrTip(m) || WR[m] || "", name));
  });
  [["Lethal", "Lethal x+", "Attack rolls of x or more count as critical successes (normally only 6s do)."],
   ["Piercing Crits", "Piercing Crits x", "If you retain at least one critical success, the defender rolls x fewer defense dice."],
   ["Piercing", "Piercing x", "The defender rolls x fewer defense dice, whether or not you score crits."],
   ["Accurate", "Accurate x", "Before rolling, you may set aside up to x attack dice and count them as automatic normal successes."],
   ["Devastating", "Devastating x", "Each time you retain a critical success, deal x damage to the target right away."],
   ["Limited", "Limited x", "This weapon can only be used x times per battle."]].forEach(([name, term, text]) => list.push(refEntry("wr:" + name, escapeRe(name), term, text, name)));
  UNIV_EQUIPMENT.forEach(e => list.push(refEntry("eq:" + e.name, escapeRe(e.name.replace(/ \(x\d\)$/, "")) + "s?", e.name + " (universal equipment)", e.desc, e.name)));
  CORE_REFS = { key: "core", list };
  return CORE_REFS;
};
// A team's own rules first, then the core ones. Ability names that are also an operative's name ("Grenadier")
// and names that are core actions ("Reposition" in Forward Scouting) aren't linked.
const TEAM_REFS = {};
const ABILITY_RE = /^([^:]{2,40}?)(?: \(([^)]*)\))?: ([\s\S]*)$/;
const teamRefs = (f) => {
  if (!f) return coreRefs();
  if (TEAM_REFS[f.id]) return TEAM_REFS[f.id];
  const core = coreRefs().list;
  const opNames = (f.operatives || []).map(op => op.name.replace(/\s*\([^)]*\)\s*$/, ""));
  const own = []; const seen = new Set();
  const add = (name, term, text, isAbility) => {
    const n = name.replace(/\s*\([^)]*\)\s*$/, "").replace(/ action$/, "").trim();
    if (n.length < 3 || seen.has(n) || /^Loadout/.test(n) || !text || n === f.name) return;
    if (core.some(r => { r.re.lastIndex = 0; const m = r.re.exec(n); return m && m[0] === n; })) return;
    if (isAbility && opNames.some(o => o === n || o.endsWith(" " + n))) return;
    seen.add(n);
    own.push(refEntry("team:" + n, escapeRe(n) + "(?! (?:shotgun|boltgun|bolt|rifle|pistol|blade|knife)s?\\b)", term, text, null)); // not "Astartes shotgun"
  };
  (f.factionRules || []).forEach(r => { add(r.name, r.name, r.desc); if (r.name.includes(": ")) add(r.name.split(": ").pop(), r.name, r.desc); });
  ["strategy", "firefight"].forEach(k => ((f.ploys || {})[k] || []).forEach(p => add(p.name, p.name + " (" + k + " ploy, 1CP)", p.desc)));
  (f.equipment || []).forEach(q => add(q.name, q.name + " (equipment)", q.desc));
  (f.operatives || []).forEach(op => (op.abilities || []).forEach(a => { const m = a.match(ABILITY_RE); if (m) add(m[1], m[1] + (m[2] ? " (" + m[2] + ")" : ""), m[3], true); }));
  TEAM_REFS[f.id] = { key: f.id, list: [...own, ...core] };
  return TEAM_REFS[f.id];
};
// Rule names found in a text: [{ s, e, m, entry }], first mention of each, longest match wins, never `skip` itself.
const REF_CACHE = new Map();
const refMatches = (text, refs, skip) => {
  const ck = refs.key + "|" + (skip || "") + "|" + text;
  if (REF_CACHE.has(ck)) return REF_CACHE.get(ck);
  const found = [];
  refs.list.forEach((r, order) => {
    r.re.lastIndex = 0; let m;
    while ((m = r.re.exec(text))) {
      if (!m[0]) { r.re.lastIndex++; continue; }
      const s = m.index, e = s + m[0].length;
      if (/[A-Za-z0-9]/.test(text[s - 1] || "") || /[A-Za-z0-9-]/.test(text[e] || "")) continue;
      found.push({ s, e, m: m[0], r, order });
    }
  });
  found.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || a.order - b.order);
  const out = []; const used = new Set(); let pos = 0;
  const skipIds = skip ? ["team:" + skip, "act:" + skip, "wr:" + skip, "eq:" + skip] : [];
  found.forEach(x => {
    if (x.s < pos) return;
    pos = x.e;
    if (used.has(x.r.id) || skipIds.includes(x.r.id)) return;
    used.add(x.r.id);
    const term = typeof x.r.term === "function" ? x.r.term(x.m) : x.r.term;
    const body = typeof x.r.text === "function" ? x.r.text(x.m) : x.r.text;
    if (body) out.push({ s: x.s, e: x.e, m: x.m, entry: { key: x.r.id, term, text: body, link: x.r.link } });
  });
  if (REF_CACHE.size > 4000) REF_CACHE.clear();
  REF_CACHE.set(ck, out);
  return out;
};
// ── Rolls in rule text: D3, D6, 2D6, D3+3 and so on become tappable, and a check the rule names ("on a 4+",
// "roll of 3+", "on a total of 7", "on a 1") says whether the roll made it. ──
// No lookbehind (older iPhones can't read it): the character before is captured instead.
const RULE_DICE_RE = /(^|[^A-Za-z0-9])(\d?)D(3|6)(?:\s?\+\s?(\d+))?(?![A-Za-z0-9])/g;
const RULE_DICE_CACHE = new Map();
function ruleDiceMatches(text) {
  if (RULE_DICE_CACHE.has(text)) return RULE_DICE_CACHE.get(text);
  const all = [...text.matchAll(RULE_DICE_RE)].map(m => { const s = m.index + m[1].length; return { s, e: m.index + m[0].length, m: m[0].slice(m[1].length), count: parseInt(m[2] || "1", 10), sides: parseInt(m[3], 10), plus: parseInt(m[4] || "0", 10) }; });
  // A roll in brackets right after another is an alternative to it ("roll 2D6 (1D6 if ...)"), so they share the check.
  const inBrackets = (from, to) => { const w = text.slice(from, to); return w.lastIndexOf("(") > w.lastIndexOf(")"); };
  all.forEach((d, i) => {
    if (d.plus) return; // damage and wounds regained: just the total
    // What the rule needs from the roll: read up to the next roll that isn't in brackets, within three sentences.
    let j = i + 1; while (j < all.length && inBrackets(d.e, all[j].s)) j++;
    let w = text.slice(d.e, j < all.length ? all[j].s : text.length);
    const stops = [...w.matchAll(/\.(\s|$)/g)].filter(x => x.index > 2); // "roll a D6." ends a sentence that doesn't count
    if (stops.length > 2) w = w.slice(0, stops[2].index);
    const CHECK = /\b(on (?:a|any)(?: total of)?|(?:a |each )?roll of|(?:each )?result of) (\d+)(?:(\+)|-(\d+)| to (\d+))?/gi;
    const checks = [...w.matchAll(CHECK)].map(c => {
      const lo = parseInt(c[2], 10), hi = c[3] ? d.count * d.sides : parseInt(c[4] || c[5] || c[2], 10);
      return { lo, hi, label: c[3] ? lo + "+" : hi !== lo ? lo + "-" + hi : String(lo), each: /any|each/i.test(c[1]) };
    }).filter(c => c.lo >= 1 && c.lo <= d.count * d.sides);
    if (checks.length) { d.checks = checks; d.mods = /\b(add|adding|subtract|subtracting)\b/i.test(w.slice(0, w.search(CHECK))); }
  });
  if (RULE_DICE_CACHE.size > 2000) RULE_DICE_CACHE.clear();
  RULE_DICE_CACHE.set(text, all);
  return all;
}
// One roll in rule text: tap it to roll, tap again to re-roll.
function RuleDice({ d }) {
  const [res, setRes] = useState(null);
  const box = React.useRef(null);
  const roll = (e) => {
    e.stopPropagation();
    setRes(Array.from({ length: d.count }, () => 1 + Math.floor(Math.random() * d.sides)));
  };
  React.useEffect(() => {
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (res && box.current && box.current.animate && !still) box.current.animate([{ transform: "rotate(-200deg) scale(0.4)", opacity: 0 }, { offset: 0.7, transform: "rotate(10deg) scale(1.1)", opacity: 1 }, { transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.7,.3,1)" });
  }, [res]);
  const total = res ? res.reduce((a, b) => a + b, 0) + d.plus : 0;
  // One die, or a check on each die ("On any 4+", "each result of 1 to 4"): says how many dice made it.
  // Otherwise (2D6 "on a 7+", "on a total of 7") it's the total.
  const ok = (c, v) => v >= c.lo && v <= c.hi;
  const verdict = res && d.checks ? d.checks.map(c => {
    if (d.count > 1 && c.each) { const n = res.filter(v => ok(c, v)).length; return { label: c.label, text: c.label + ": " + n + " of " + res.length, ok: n > 0 }; }
    const yes = d.count > 1 ? ok(c, total) : ok(c, res[0]);
    return { label: c.label, text: c.label + ": " + (yes ? "yes" : "no"), ok: yes };
  }) : null;
  // Several outcomes ("On a 1 ... On a 4+ ..."): name the one that applies.
  const said = !verdict ? "" : verdict.length > 1 && !verdict.some(v => /of/.test(v.text)) ? (verdict.filter(v => v.ok).map(v => "on a " + v.label).join(", ") || "none of these") : verdict.map(v => v.text).join(", ");
  const pass = verdict && verdict.some(v => v.ok);
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <button onClick={roll} aria-label={(res ? "Roll again: " : "Roll ") + d.m} className="compact-btn" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "var(--accent)", fontWeight: 700, textDecoration: "underline dotted", textUnderlineOffset: 3 }}>{d.m}</button>
      {res && (
        <span ref={box} role="status" style={{ display: "inline-flex", alignItems: "center", gap: 3, marginLeft: 5, verticalAlign: "middle" }}>
          {res.map((v, i) => <span key={i} style={dieStyle(verdict ? (pass ? "hit" : "fail") : "set", 18)}>{dieFace(v, verdict ? (pass ? "hit" : "fail") : "set", 18)}</span>)}
          {(res.length > 1 || d.plus > 0) && <span style={{ fontWeight: 700, color: "var(--text)" }}>= {total}</span>}
          {verdict && <span style={{ fontWeight: 700, color: pass ? "var(--hit)" : "var(--miss)" }}>{said}{d.mods ? " (before modifiers)" : ""}</span>}
        </span>
      )}
    </span>
  );
}

// Rule text with the names of other rules as tips (Rule tips), and its rolls tappable (Dice roller).
// `self` is the rule's own name, which isn't linked.
function RefText({ text, f, self }) {
  const { feat } = React.useContext(FeatureCtx);
  if (!text) return null;
  const refs = feat.tips ? teamRefs(f) : null;
  const tips = feat.tips ? refMatches(text, refs, self) : [];
  const rolls = feat.dice ? ruleDiceMatches(text).filter(d => !tips.some(x => d.s < x.e && d.e > x.s)) : [];
  if (!tips.length && !rolls.length) return text;
  const marks = [...tips.map(x => ({ ...x, tip: true })), ...rolls].sort((a, b) => a.s - b.s);
  const out = []; let last = 0;
  marks.forEach(x => {
    out.push(text.slice(last, x.s));
    out.push(x.tip
      ? <RuleTip key={x.s} term={x.entry.term} text={x.entry.text} link={x.entry.link} tkey={x.entry.key} refs={refs} style={{ fontWeight: 600 }}>{x.m}</RuleTip>
      : <RuleDice key={x.s} d={x} />);
    last = x.e;
  });
  out.push(text.slice(last));
  return <React.Fragment>{out}</React.Fragment>;
}

