/* ═══ ICONS ═══ */
// Line icons on a 24x24 grid, drawn with the current text color (same style as the tab and multiplayer icons).
const ICON_PATHS = {
  dice: <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="9" cy="9" r="1.2" fill="currentColor" /><circle cx="15" cy="15" r="1.2" fill="currentColor" /><circle cx="15" cy="9" r="1.2" fill="currentColor" /><circle cx="9" cy="15" r="1.2" fill="currentColor" /></>,
  ranged: <><circle cx="12" cy="12" r="7" /><path d="M12 2v5M12 17v5M2 12h5M17 12h5" /></>,
  melee: <><path d="M14.5 3.5L20.5 3l-.5 6L9.5 19.5l-5-5z" /><path d="M6.5 13.5l4 4M4.5 19.5l2-2" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronUp: <path d="M6 15l6-6 6 6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  play: <path d="M7 4l12 8-12 8z" />,
  rulebook: <g><path d="M3 5.5c3-1.2 6-1 9 1v13c-3-2-6-2.2-9-1z" /><path d="M21 5.5c-3-1.2-6-1-9 1v13c3-2 6-2.2 9-1z" /></g>,
  map: <g><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></g>,
  swords: <g><path d="M5 3l12 12M14 18l4-4M16 16l4 4" /><path d="M19 3L7 15M6 14l4 4M8 16l-4 4" /></g>,
  people: <g><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.2.7 3.5 2.8 3.5 5.7" /></g>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  download: <path d="M12 4v11M7 10.5l5 4.5 5-4.5M5 20h14" />,
  warning: <><path d="M12 3.5l9 16H3z" /><path d="M12 10v4.5" /><circle cx="12" cy="17" r="0.6" fill="currentColor" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" /></>,
  skull: <><path d="M12 3a7.5 7.5 0 0 0-7.5 7.5c0 2.6 1.3 4.5 3 5.6V20h9v-3.9c1.7-1.1 3-3 3-5.6A7.5 7.5 0 0 0 12 3z" /><circle cx="9" cy="11" r="1.6" /><circle cx="15" cy="11" r="1.6" /></>,
  reset: <><path d="M4 5v5h5" /><path d="M5.3 14.5A7.5 7.5 0 1 0 7 7.2L4 10" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><circle cx="12" cy="7.5" r="0.6" fill="currentColor" /></>,
  cog: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
  log: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" fill="currentColor" /><circle cx="4.5" cy="12" r="1" fill="currentColor" /><circle cx="4.5" cy="18" r="1" fill="currentColor" /></>,
};
function Icon({ name, size = 14, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0, color, ...style }}>{ICON_PATHS[name]}</svg>
  );
}

/* ═══ ATTACK EFFECTS ═══ */
// The Shoot and Fight screens' effects. A canvas layer draws particles (rounds, sparks, fire, smoke, shockwaves,
// lightning); Web Animations move the cards and the screen frame (recoil, lunges, shake, border flashes); damage marks
// land on the target card. Plain shapes, no artwork. Motion follows a real swing or shot: wind-up, a fast strike,
// impact, follow-through, and an easing return. Players switch it all off with Attack animations.
const FX_PACE = 1.2; // overall tempo: 1 is the designed speed; higher is slower
const fxMs = (t) => Math.round(t * FX_PACE);

// Which effect a weapon gets, from its name and rules.
function fxProfile(w) {
  if (typeof w === "string") w = { name: w, type: w === "melee" ? "melee" : "ranged", wr: "" };
  const n = (w.name || "").toLowerCase(), wr = w.wr || "";
  const power = /power|relic|force|arc|shock|lightning|null|energ|xenophase|transonic|hylas|blessed|sanctus|thunder|witch|soul|warp|sword of/.test(n);
  if (w.type === "melee") {
    if (/chain|eviscerator|ripper|saw\b|buzz/.test(n)) return { kind: "chain", power };
    if (/^(fists?|unarmed|claws and fists)$|butt|headbutt|bash/.test(n)) return { kind: "heavy", power: false, light: true }; // a plain punch
    if (/fist|klaw|hammer|maul|mace|club|crusher|great|tremor|stave|staff|cleaver|lance|ram\b|axe|butt|tankhammer|siege/.test(n)) return { kind: "heavy", power };
    return { kind: "blade", power };
  }
  if (/grenade|bomb|\bmine|charge|explosive|squig/.test(n)) return { kind: "grenade", krak: /krak|melta|haywire/.test(n) };
  if (/PSYCHIC/.test(wr)) return { kind: "psychic" };
  if (/melta|fusion|inferno|thermal|heat ray|meltagun/.test(n)) return { kind: "melta", color: "#FF8A3D" };
  if (/blaster|dark lance|lance/.test(n)) return { kind: "melta", color: "#C77DFF" };
  if (/Torrent/.test(wr) && /flam|burna|spew|plague wind|ignit|pyre|censer|brazier|torch|skinner|spit|incinerat|fire|purg/.test(n)) return { kind: "flame", green: /plague|venom|spit|spew|blight/.test(n) };
  if (/flam|burna|incinerat|pyre|torch/.test(n)) return { kind: "flame", green: false };
  if (/gauss|tesla|synaptic|staff of light|transdimensional|arc |arc$|lightning|shock/.test(n)) return { kind: "electric", color: /gauss|staff of light|transdimensional/.test(n) ? "#6BFF8A" : "#8FD8FF" };
  if (/plasma|pulse|ion\b|neutron|volkite|graviton|disintegrator|particle|accelerator|xenophase|transuranic/.test(n)) return { kind: "plasma", color: /pulse|ion\b/.test(n) ? "#5FE6FF" : /neutron|graviton/.test(n) ? "#C9A0FF" : "#8FE9FF" };
  if (/shotgun|shotpistol|scattergun|blunderbuss|shotcannon|scatter/.test(n)) return { kind: "shotgun" };
  if (/sniper|long-las|marksman|rail|scoped|needle|stalker|long rifle|longrifle|caliver|arquebus|magna-coil|executioner|ranger|hunting/.test(n)) return { kind: "sniper", color: /las|needle/.test(n) ? "#FF6B5B" : "#FFE6A8" };
  if (/las|hot-shot|hellgun|laser|beam/.test(n)) return { kind: "las" };
  if (/burst|rotary|gatling|minigun|assault cannon/.test(n) || (/Torrent/.test(wr))) return { kind: "auto" };
  if (/Blast/.test(wr) || /launcher|missile|rocket|mortar|cannon|tankstopper/.test(n)) return { kind: "blast" };
  if (/auto|storm|assault|shoota|stubber|heavy bolter|splinter|shuriken|catapult|repeater|dakka|big gun/.test(n)) return { kind: "auto" };
  if (/bolt|condemnor|stakethrower/.test(n)) return { kind: "bolt" };
  return { kind: "slug" };
}
// The mark a weapon leaves (on the attack screen, and kept on the datacard).
const scarKindOf = (p) => ({ bolt: "hole", auto: "hole", slug: "hole", shotgun: "hole", sniper: "hole", las: "burn", plasma: "melt", electric: "burn", melta: "melt", flame: "scorch", grenade: "scorch", blast: "scorch", psychic: "burn", blade: "slash", chain: "slash", heavy: "crack" })[p.kind] || "hole";
const fxColor = (p) => p.color || ({ bolt: "#FFC46B", auto: "#FFD27A", slug: "#FFD9A0", shotgun: "#FFC46B", las: "#FF4B3E", flame: "#FF8A3D", grenade: "#FF9A3C", blast: "#FF9A3C", psychic: "#B48CFF", blade: "#FFE6A8", chain: "#FFB347", heavy: "#FFE6A8" })[p.kind] || "#FFD27A";

// ── Damage marks (SVG strings, so the same marks work on the attack screen and in React on datacards) ──
function decalSvg(k, size, rot) {
  // Each mark is drawn from a seed (its rotation), so a saved mark looks the same every time the card redraws.
  rot = rot || 0;
  const u = "dk" + k + size + "_" + rot, o = 'width="' + size + '" height="' + size + '" viewBox="-12 -12 24 24" style="transform:rotate(' + rot + 'deg);overflow:visible"';
  let sd = (rot * 7919 + k.length * 131 + size) | 1;
  const rnd = () => { sd = (sd + 0x6D2B79F5) | 0; let t = Math.imul(sd ^ (sd >>> 15), 1 | sd); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const n2 = (v) => v.toFixed(2);
  // A ragged ring of points (torn metal, soot edges).
  const blob = (r0, r1, n) => { let d = ""; for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2, r = r0 + (r1 - r0) * rnd(); d += (i ? "L" : "M") + n2(Math.cos(an) * r) + " " + n2(Math.sin(an) * r); } return d + "Z"; };
  // A tapered stroke: thin at both ends ("mid"), or wide at the start and thin at the tip ("out", for cracks).
  const taper = (x0, y0, x1, y1, bend, w, shape) => {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, top = [], bot = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, b = bend * 4 * t * (1 - t), hw = (shape === "out" ? (1 - t) * 0.95 + 0.05 : Math.pow(Math.sin(Math.PI * t), 0.7)) * w / 2;
      const x = x0 + dx * t + nx * b, y = y0 + dy * t + ny * b;
      top.push(n2(x + nx * hw) + " " + n2(y + ny * hw)); bot.unshift(n2(x - nx * hw) + " " + n2(y - ny * hw));
    }
    return "M" + top.join("L") + "L" + bot.join("L") + "Z";
  };
  const soot = '<radialGradient id="' + u + 's"><stop offset="0" stop-color="#000" stop-opacity="0.6"/><stop offset="0.5" stop-color="#1a120c" stop-opacity="0.32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
  const core = '<radialGradient id="' + u + 'c" cx="0.42" cy="0.4" r="0.62"><stop offset="0" stop-color="#000"/><stop offset="0.75" stop-color="#0b0806"/><stop offset="1" stop-color="#2a211a"/></radialGradient>';
  if (k === "hole") {
    let cracks = "";
    for (let i = 0, n = 3 + Math.floor(rnd() * 2); i < n; i++) { const an = rnd() * Math.PI * 2, r1 = 7 + rnd() * 3.5; cracks += '<path d="' + taper(Math.cos(an) * 4.4, Math.sin(an) * 4.4, Math.cos(an) * r1, Math.sin(an) * r1, rnd() - 0.5, 1.2, "out") + '" fill="#0c0907" fill-opacity="0.85"/>'; }
    return '<svg ' + o + '><defs>' + soot + core + '<linearGradient id="' + u + 'r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdbda8"/><stop offset="0.35" stop-color="#7a6c5e"/><stop offset="1" stop-color="#1d1814"/></linearGradient></defs>'
      + '<circle r="11.5" fill="url(#' + u + 's)"/>' + cracks + '<path d="' + blob(4.3, 5.5, 16) + '" fill="url(#' + u + 'r)"/><path d="' + blob(3.5, 4.3, 12) + '" fill="url(#' + u + 'c)"/></svg>';
  }
  if (k === "burn") {
    const bend = rnd() * 1.4 - 0.7;
    return '<svg ' + o + '><defs><radialGradient id="' + u + 's"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="' + u + 'e"><stop offset="0" stop-color="#ff5a2a" stop-opacity="0"/><stop offset="0.5" stop-color="#ffb070" stop-opacity="0.95"/><stop offset="1" stop-color="#ff5a2a" stop-opacity="0"/></linearGradient></defs>'
      + '<ellipse rx="11.5" ry="4.6" fill="url(#' + u + 's)"/><path d="' + taper(-9.5, 0, 9.5, 0, bend, 3.4) + '" fill="#120a06"/><path d="' + taper(-7, 0, 7, 0, bend, 1.1) + '" fill="url(#' + u + 'e)"/>'
      + '<circle cx="' + n2(rnd() * 8 - 4) + '" cy="' + n2(rnd() * 2 - 2.6) + '" r="0.45" fill="#ffc07a"/><circle cx="' + n2(rnd() * 8 - 4) + '" cy="' + n2(rnd() * 2 + 0.8) + '" r="0.35" fill="#ff8a3d"/></svg>';
  }
  if (k === "scorch") {
    let specks = "";
    for (let i = 0; i < 5; i++) { const an = rnd() * Math.PI * 2, r = 3 + rnd() * 5; specks += '<circle cx="' + n2(Math.cos(an) * r) + '" cy="' + n2(Math.sin(an) * r) + '" r="' + n2(0.3 + rnd() * 0.5) + '" fill="' + (i % 2 ? "#ff8a3d" : "#ffc46b") + '" fill-opacity="0.9"/>'; }
    return '<svg ' + o + '><defs><radialGradient id="' + u + 's"><stop offset="0" stop-color="#050302" stop-opacity="0.92"/><stop offset="0.35" stop-color="#1a0f08" stop-opacity="0.75"/><stop offset="0.7" stop-color="#2a180c" stop-opacity="0.32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="' + u + 'e"><stop offset="0.5" stop-color="#ff7a2a" stop-opacity="0"/><stop offset="0.78" stop-color="#ff7a2a" stop-opacity="0.3"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient></defs>'
      + '<path d="' + blob(8, 11.8, 18) + '" fill="url(#' + u + 's)"/><path d="' + blob(6.5, 9, 14) + '" fill="url(#' + u + 'e)"/><path d="' + blob(2.4, 3.8, 10) + '" fill="#030201"/>' + specks + '</svg>';
  }
  if (k === "melt") {
    const body = blob(4, 7.2, 15);
    return '<svg ' + o + '><defs><radialGradient id="' + u + 'g"><stop offset="0" stop-color="#ff9a40" stop-opacity="0.55"/><stop offset="0.6" stop-color="#ff5a1a" stop-opacity="0.18"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="' + u + 'b" cx="0.45" cy="0.4"><stop offset="0" stop-color="#050302"/><stop offset="0.7" stop-color="#1a0904"/><stop offset="1" stop-color="#6b2208"/></radialGradient>'
      + '<linearGradient id="' + u + 'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a"/><stop offset="0.5" stop-color="#ff6a1a"/><stop offset="1" stop-color="#7a1e05"/></linearGradient></defs>'
      + '<circle r="11.5" fill="url(#' + u + 'g)"/><path d="' + body + '" fill="url(#' + u + 'b)" stroke="url(#' + u + 'r)" stroke-width="0.9"/><ellipse cx="-1.6" cy="-2" rx="1.7" ry="0.7" fill="#fff" fill-opacity="0.16"/></svg>';
  }
  if (k === "slash") {
    const b1 = -1.2 - rnd(), b2 = -0.8 - rnd() * 0.8, y2 = 4 + rnd() * 2;
    const gash = (x0, y0, x1, y1, b, w) => '<path d="' + taper(x0, y0 + 0.4, x1, y1 + 0.4, b, w * 2.2) + '" fill="#000" fill-opacity="0.28"/><path d="' + taper(x0, y0 - 0.85, x1, y1 - 0.85, b, w * 0.85) + '" fill="#efe3cf" fill-opacity="0.55"/><path d="' + taper(x0, y0, x1, y1, b, w) + '" fill="#070505"/>';
    return '<svg ' + o + '>' + gash(-11.5, -4, 11.5, 3, b1, 2.6) + gash(-8, y2 - 4.5, 9, y2 + 1.5, b2, 1.8) + '</svg>';
  }
  // crack: an impact crater with tapered cracks running out of it.
  let cracks = "";
  for (let i = 0; i < 6; i++) {
    const an = (i / 6) * Math.PI * 2 + rnd() * 0.7, len = 6 + rnd() * 5.5, ex = Math.cos(an) * len, ey = Math.sin(an) * len;
    cracks += '<path d="' + taper(Math.cos(an) * 2.5, Math.sin(an) * 2.5, ex, ey, rnd() - 0.5, 1.9, "out") + '" fill="#0a0806"/>';
    const mx = Math.cos(an) * len * 0.55, my = Math.sin(an) * len * 0.55, ba = an + (rnd() < 0.5 ? -0.7 : 0.7);
    cracks += '<path d="' + taper(mx, my, mx + Math.cos(ba) * 3.2, my + Math.sin(ba) * 3.2, 0, 0.8, "out") + '" fill="#0a0806"/>';
  }
  return '<svg ' + o + '><defs>' + soot + core + '</defs><circle r="10.5" fill="url(#' + u + 's)"/>' + cracks + '<path d="' + blob(3, 4.4, 12) + '" fill="url(#' + u + 'c)" stroke="#cbbba8" stroke-opacity="0.35" stroke-width="0.5"/></svg>';
}
// The gauze an injured operative wears, wrapped round the colored edge of its datacard (left of the text, so it covers nothing).
const BANDAGE_SVG = '<svg width="12" height="37" viewBox="0 0 15 46">'
  + [2, 12, 22, 32].map((y) => '<path d="M0 ' + (y + 3) + 'L15 ' + y + 'L15 ' + (y + 9) + 'L0 ' + (y + 12) + 'Z" fill="#E6DFD0" stroke="#8F8572" stroke-width="0.8" stroke-linejoin="round"/>').join("")
  + '</svg>';
// A mark on a card right now (the attack screen); it stays until the screen closes.
function fxDecal(card, k, x, y, size) {
  const r = card.getBoundingClientRect();
  const d = document.createElement("span");
  d.setAttribute("data-decal", k); d.setAttribute("aria-hidden", "true");
  d.style.cssText = "position:absolute;pointer-events:none;z-index:3;left:" + Math.round(x - r.left - size / 2) + "px;top:" + Math.round(y - r.top - size / 2) + "px";
  d.innerHTML = decalSvg(k, size, Math.round(Math.random() * 360));
  card.appendChild(d);
  if (d.animate) d.animate([{ opacity: 0, transform: "scale(1.8)" }, { opacity: 1, transform: "scale(1)" }], { duration: 180, easing: "cubic-bezier(.2,.9,.3,1.3)" });
  if (k === "melt") { const g = document.createElement("span"); g.style.cssText = "position:absolute;inset:0;border-radius:50%;box-shadow:0 0 10px 4px #ff8a3d;pointer-events:none"; d.appendChild(g); if (g.animate) g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 2400, fill: "forwards" }); }
}

// ── The particle layer ──
const FX = (() => {
  let cv = null, cx = null, list = [], raf = 0, last = 0;
  const layer = () => {
    if (cv && cv.isConnected) return;
    cv = document.createElement("canvas");
    cv.setAttribute("data-fx", "layer"); cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:10002";
    document.body.appendChild(cv);
    cx = cv.getContext("2d");
    const d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d);
    cx.setTransform(d, 0, 0, d, 0, 0);
  };
  const easeOut = (k) => 1 - Math.pow(1 - k, 3), easeIn = (k) => k * k;
  const draw = (p, dt) => {
    const k = Math.min(1, p.t / p.life), c = cx;
    c.globalCompositeOperation = p.add === false ? "source-over" : "lighter";
    c.globalAlpha = 1; c.shadowBlur = 0;
    if (p.vx !== undefined) {
      const drag = Math.pow(p.drag || 1, dt / 16);
      p.vx *= drag; p.vy = p.vy * drag + (p.g || 0) * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    switch (p.type) {
      case "spark": {
        c.strokeStyle = p.color; c.lineWidth = p.w || 2; c.lineCap = "round"; c.globalAlpha = 1 - k;
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * (p.len || 18), p.y - p.vy * (p.len || 18)); c.stroke(); break;
      }
      case "glow": {
        const r = p.r0 + (p.r1 - p.r0) * easeOut(k), a = Math.pow(1 - k, p.pow || 2);
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, r));
        g.addColorStop(0, "rgba(255,255,255," + a + ")"); g.addColorStop(0.25, hexA(p.color, a)); g.addColorStop(1, hexA(p.color, 0));
        c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, Math.max(1, r), 0, 7); c.fill(); break;
      }
      case "fire": {
        const r = p.r0 + (p.r1 - p.r0) * easeOut(k), a = (1 - k) * (p.a || 0.9);
        const hue = p.hue !== undefined ? p.hue : 48 - 42 * k;
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, r));
        g.addColorStop(0, "hsla(" + hue + ",100%," + (70 - 25 * k) + "%," + a + ")"); g.addColorStop(1, "hsla(" + hue + ",100%,40%,0)");
        c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, Math.max(1, r), 0, 7); c.fill(); break;
      }
      case "smoke": {
        c.globalCompositeOperation = "source-over";
        const r = p.r0 + (p.r1 - p.r0) * easeOut(k);
        c.fillStyle = "rgba(" + (p.rgb || "70,66,62") + "," + (p.a || 0.35) * (1 - k) + ")";
        c.beginPath(); c.arc(p.x, p.y, Math.max(1, r), 0, 7); c.fill(); break;
      }
      case "debris": {
        c.globalCompositeOperation = "source-over";
        p.rot = (p.rot || 0) + (p.vr || 0.02) * dt;
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.globalAlpha = 1 - easeIn(k);
        c.fillStyle = p.color; c.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); c.restore(); break;
      }
      case "round": {
        const e = p.ease ? easeIn(k) : k, x = p.x0 + (p.x1 - p.x0) * e, y = p.y0 + (p.y1 - p.y0) * e;
        const len = Math.hypot(p.x1 - p.x0, p.y1 - p.y0) || 1, tx = (p.x1 - p.x0) / len, ty = (p.y1 - p.y0) / len, tail = p.tail || 40;
        const gr = c.createLinearGradient(x - tx * tail, y - ty * tail, x, y);
        gr.addColorStop(0, hexA(p.color, 0)); gr.addColorStop(1, p.color);
        c.strokeStyle = gr; c.lineWidth = p.w || 3; c.lineCap = "round"; c.shadowColor = p.color; c.shadowBlur = p.blur || 12;
        c.beginPath(); c.moveTo(x - tx * tail, y - ty * tail); c.lineTo(x, y); c.stroke();
        c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, (p.w || 3) * 0.6, 0, 7); c.fill();
        if (p.trail && Math.random() < 0.6) list.push({ type: p.trail === "smoke" ? "smoke" : "glow", t: 0, delay: 0, life: p.trail === "smoke" ? 700 : 300, x, y, r0: 3, r1: p.trail === "smoke" ? 14 : 8, color: p.color, vx: (Math.random() - 0.5) * 0.02, vy: -0.02, drag: 0.98, add: p.trail !== "smoke", a: 0.3 });
        break;
      }
      case "beam": {
        const env = k < 0.12 ? k / 0.12 : k > 0.75 ? (1 - k) / 0.25 : 1, wob = p.wob || 0;
        const mx = (p.x0 + p.x1) / 2 + (Math.random() - 0.5) * wob, my = (p.y0 + p.y1) / 2 + (Math.random() - 0.5) * wob;
        c.lineCap = "round"; c.shadowColor = p.color; c.shadowBlur = 18; c.globalAlpha = env;
        c.strokeStyle = p.color; c.lineWidth = p.w * (0.85 + Math.random() * 0.3);
        c.beginPath(); c.moveTo(p.x0, p.y0); c.quadraticCurveTo(mx, my, p.x1, p.y1); c.stroke();
        c.strokeStyle = "#fff"; c.lineWidth = Math.max(1, p.w * 0.3);
        c.beginPath(); c.moveTo(p.x0, p.y0); c.quadraticCurveTo(mx, my, p.x1, p.y1); c.stroke(); break;
      }
      case "ring": {
        const r = p.r0 + (p.r1 - p.r0) * easeOut(k);
        c.strokeStyle = hexA(p.color, (1 - k) * (p.a || 1)); c.lineWidth = (p.w || 3) * (1 - k * 0.6);
        c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.stroke(); break;
      }
      case "bolt": {
        c.strokeStyle = p.color; c.lineWidth = p.w || 2; c.shadowColor = p.color; c.shadowBlur = 14; c.globalAlpha = Math.random() < 0.25 ? 0.25 : 1 - k * 0.6;
        const segs = 9, dx = p.x1 - p.x0, dy = p.y1 - p.y0, nx = -dy, ny = dx, l = Math.hypot(dx, dy) || 1;
        c.beginPath(); c.moveTo(p.x0, p.y0);
        for (let i = 1; i < segs; i++) { const f = i / segs, j = (Math.random() - 0.5) * (p.jag || 26) / l; c.lineTo(p.x0 + dx * f + nx * j, p.y0 + dy * f + ny * j); }
        c.lineTo(p.x1, p.y1); c.stroke(); break;
      }
      case "slash": {
        const sweep = easeOut(Math.min(1, k * 1.8)), a0 = p.a0, a1 = p.a0 + (p.a1 - p.a0) * sweep, fade = 1 - easeIn(k);
        c.lineCap = "round"; c.shadowColor = p.color; c.shadowBlur = 16;
        for (let i = 0; i < 6; i++) {
          const f = i / 6, aa = a1 - (a1 - a0) * f * 0.85;
          c.strokeStyle = hexA(p.color, fade * (1 - f)); c.lineWidth = (p.w || 5) * (1 - f * 0.7);
          c.beginPath(); c.arc(p.x, p.y, p.r, aa - (a1 - a0) * 0.15 * (p.a1 > p.a0 ? 1 : -1), aa, p.a1 < p.a0); c.stroke();
        }
        break;
      }
      case "lob": {
        const x = p.x0 + (p.x1 - p.x0) * k, y = p.y0 + (p.y1 - p.y0) * k - 4 * p.h * k * (1 - k);
        c.globalCompositeOperation = "source-over";
        c.save(); c.translate(x, y); c.rotate(k * 12);
        c.fillStyle = "#3b3f38"; c.beginPath(); c.arc(0, 0, p.s, 0, 7); c.fill();
        c.fillStyle = "#9aa58f"; c.fillRect(-p.s * 0.35, -p.s * 1.2, p.s * 0.7, p.s * 0.6);
        c.restore();
        if (Math.random() < 0.5) list.push({ type: "spark", t: 0, delay: 0, life: 220, x, y, vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1, color: "#FFB347", w: 1.5, len: 6 });
        break;
      }
      case "edge": {
        const a = (p.a || 0.55) * (1 - k);
        const g = c.createRadialGradient(innerWidth / 2, innerHeight / 2, Math.min(innerWidth, innerHeight) * 0.35, innerWidth / 2, innerHeight / 2, Math.max(innerWidth, innerHeight) * 0.75);
        g.addColorStop(0, hexA(p.color, 0)); g.addColorStop(1, hexA(p.color, a));
        c.globalCompositeOperation = "source-over"; c.fillStyle = g; c.fillRect(0, 0, innerWidth, innerHeight); break;
      }
      case "shield": {
        // A glowing arc in front of the blocker, facing the attack: snaps up, holds, fades.
        const up = Math.min(1, k / 0.15), fade = k < 0.5 ? 1 : 1 - (k - 0.5) / 0.5, r = p.r * (0.85 + 0.15 * up);
        c.lineCap = "round"; c.shadowColor = p.color; c.shadowBlur = 22;
        [[p.w, p.color, 1], [p.w * 0.35, "#FFFFFF", 0.9]].forEach(([w, col, a]) => {
          c.strokeStyle = hexA(col, a * fade * up); c.lineWidth = w;
          c.beginPath(); c.arc(p.x, p.y, r, p.ang - 0.95 * up, p.ang + 0.95 * up); c.stroke();
        });
        break;
      }
      case "sight": {
        c.strokeStyle = hexA(p.color, 0.5 + Math.random() * 0.4); c.lineWidth = 1; c.setLineDash([6, 5]);
        c.beginPath(); c.moveTo(p.x0, p.y0); c.lineTo(p.x1, p.y1); c.stroke(); c.setLineDash([]);
        c.fillStyle = p.color; c.beginPath(); c.arc(p.x1, p.y1, 2.5, 0, 7); c.fill(); break;
      }
      default: break;
    }
  };
  const tick = (now) => {
    if (window.__ksFxFreeze) { last = now; raf = requestAnimationFrame(tick); return; } // testing: hold the current frame
    const dt = Math.min(48, now - last); last = now;
    cx.clearRect(0, 0, innerWidth, innerHeight);
    const cur = list, keep = [];
    list = []; // particles spawned while drawing (trails, impacts) land here and join next frame
    for (let i = 0; i < cur.length; i++) {
      const p = cur[i];
      if (p.delay > 0) { p.delay -= dt; keep.push(p); continue; }
      if (!p.started) { p.started = true; if (p.onStart) p.onStart(); }
      p.t += dt;
      if (p.t >= p.life) { if (p.done) p.done(); continue; }
      draw(p, dt); keep.push(p);
    }
    list = keep.concat(list);
    if (list.length) raf = requestAnimationFrame(tick);
    else { raf = 0; if (cv) cv.remove(); cv = null; }
  };
  const add = (p) => {
    layer();
    list.push(Object.assign({ t: 0, delay: 0, life: 500 }, p));
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  };
  return { add, count: (type) => list.filter(p => !type || p.type === type).length, clear: () => { list = []; } };
})();
const hexA = (hex, a) => { const h = hex.replace("#", ""), v = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16); return "rgba(" + (v >> 16 & 255) + "," + (v >> 8 & 255) + "," + (v & 255) + "," + Math.max(0, Math.min(1, a)) + ")"; };

// ── Card and screen motion (Web Animations; nothing is left translated, so cards settle back smoothly) ──
const fxMove = {
  recoil: (el, ux, uy, s, delay) => el.animate([
    { transform: "none" },
    { transform: "translate(" + (-ux * s) + "px," + (-uy * s) + "px) rotate(" + (-ux * s * 0.15) + "deg)", offset: 0.12, easing: "cubic-bezier(.2,.8,.2,1)" },
    { transform: "none" },
  ], { duration: 320, delay: delay || 0 }),
  jolt: (el, ux, uy, s, delay) => el.animate([
    { transform: "none", filter: "none" },
    { transform: "translate(" + ux * s + "px," + uy * s + "px) rotate(" + ux * s * 0.25 + "deg) scale(0.97)", filter: "brightness(1.9) saturate(1.4)", offset: 0.08 },
    { transform: "translate(" + (-ux * s * 0.45) + "px," + (-uy * s * 0.45) + "px) rotate(" + (-ux * s * 0.1) + "deg)", filter: "brightness(1.2)", offset: 0.3 },
    { transform: "translate(" + ux * s * 0.18 + "px," + uy * s * 0.18 + "px)", offset: 0.55 },
    { transform: "none", filter: "none" },
  ], { duration: 520, delay: delay || 0, easing: "ease-out" }),
  shake: (el, s, delay, dur) => {
    const f = []; const n = 9;
    for (let i = 0; i <= n; i++) { const d = s * Math.pow(1 - i / n, 1.6), a = i * 2.4; f.push({ transform: i === n ? "none" : "translate(" + (Math.cos(a) * d).toFixed(1) + "px," + (Math.sin(a * 1.3) * d * 0.7).toFixed(1) + "px)" }); }
    return el.animate(f, { duration: dur || 420, delay: delay || 0, easing: "linear" });
  },
  border: (el, color, s, delay) => el.animate([
    { boxShadow: "0 0 0 0 " + hexA(color, 0) + ", inset 0 0 0 0 " + hexA(color, 0) },
    { boxShadow: "0 0 " + 30 * s + "px " + 6 * s + "px " + hexA(color, 0.85) + ", inset 0 0 " + 24 * s + "px " + hexA(color, 0.6), offset: 0.12 },
    { boxShadow: "0 0 0 0 " + hexA(color, 0) + ", inset 0 0 0 0 " + hexA(color, 0) },
  ], { duration: 700, delay: delay || 0, easing: "ease-out" }),
  heat: (el, color, delay, dur) => el.animate([
    { filter: "none" }, { filter: "sepia(0.6) saturate(2.2) hue-rotate(-12deg) brightness(1.35)", offset: 0.25 }, { filter: "none" },
  ], { duration: dur || 900, delay: delay || 0, easing: "ease-in-out" }),
  warp: (el, delay) => el.animate([
    { transform: "none", filter: "none" }, { transform: "skewX(4deg) scale(1.02)", filter: "hue-rotate(60deg) blur(1px)", offset: 0.3 },
    { transform: "skewX(-3deg)", filter: "hue-rotate(-30deg)", offset: 0.6 }, { transform: "none", filter: "none" },
  ], { duration: 700, delay: delay || 0, easing: "ease-in-out" }),
};

// ── The effects ──
// Plays the attack from the attacker's card to the target's card. Returns when (ms) the first hit lands.
// opts: { shock, screen (the dialog, for shake and border), scars: false to leave no marks }
function playAttackFx(weapon, card, target, opts = {}) {
  const p = fxProfile(weapon), color = fxColor(p), add = FX.add;
  const a = card.getBoundingClientRect(), b = target.getBoundingClientRect();
  const ax = a.left + a.width / 2, ay = a.top + a.height / 2, bx = b.left + b.width / 2, by = b.top + b.height / 2;
  const dx = bx - ax, dy = by - ay, dist = Math.hypot(dx, dy) || 1, ux = dx / dist, uy = dy / dist;
  const mx = ax + ux * a.width * 0.42, my = ay + uy * a.height * 0.3; // muzzle: the attacker card's edge facing the target
  const screen = opts.screen || card.closest("[role=dialog]");
  const ms = fxMs, rnd = (lo, hi) => lo + Math.random() * (hi - lo);
  const spot = () => [b.left + b.width * rnd(0.2, 0.8), b.top + b.height * rnd(0.25, 0.7)];
  const mark = (k, x, y, size) => { if (opts.scars !== false) fxDecal(target, k, x, y, size || 22); };
  const big = (s, col, delay) => { if (screen) { fxMove.shake(screen, s, delay, 380 + s * 18); fxMove.border(screen, col || color, Math.min(1.6, s / 8), delay); } };
  const sparks = (x, y, n, col, power, delay, back) => { for (let i = 0; i < n * 1.6; i++) { const ang = Math.atan2(-uy, -ux) * (back ? 1 : 0) + (back ? rnd(-1.3, 1.3) : rnd(0, 6.28)), sp = rnd(0.3, 1) * (power || 1); add({ type: "spark", delay, life: rnd(320, 680), x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, drag: 0.925, g: 0.0011, color: Math.random() < 0.3 ? "#FFFFFF" : col || color, w: rnd(1.6, 3.4), len: 22 }); } };
  const flash = (x, y, r, col, delay, life) => { add({ type: "glow", delay, life: life || 240, x, y, r0: r * 0.6, r1: r * 1.7, color: col || color, pow: 1.4 }); add({ type: "glow", delay, life: (life || 240) * 0.5, x, y, r0: r * 0.3, r1: r * 0.8, color: "#FFFFFF", pow: 2 }); };
  const smoke = (x, y, n, delay, rgb) => { for (let i = 0; i < n; i++) add({ type: "smoke", delay: delay + i * 30, life: rnd(700, 1200), x: x + rnd(-6, 6), y: y + rnd(-6, 6), vx: rnd(-0.02, 0.02) - ux * 0.01, vy: rnd(-0.05, -0.01), drag: 0.99, r0: 4, r1: rnd(14, 26), rgb, a: 0.3 }); };
  const boom = (x, y, size, col, delay, krak) => {
    flash(x, y, size, "#FFF3C4", delay, 260);
    add({ type: "ring", delay, life: 600, x, y, r0: 8, r1: size * 1.9, color: "#FFE2A8", w: 4 });
    add({ type: "ring", delay: delay + ms(70), life: 700, x, y, r0: 6, r1: size * 1.3, color: col, w: 3 });
    for (let i = 0; i < (krak ? 14 : 28); i++) { const ang = rnd(0, 6.28), sp = rnd(0.05, 0.28); add({ type: "fire", delay: delay + rnd(0, 80), life: rnd(450, 800), x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.03, drag: 0.95, r0: size * 0.15, r1: size * rnd(0.35, 0.6) }); }
    for (let i = 0; i < 14; i++) { const ang = rnd(0, 6.28), sp = rnd(0.25, 0.6); add({ type: "debris", delay, life: rnd(600, 1000), x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.2, drag: 0.97, g: 0.0012, s: rnd(3, 6), vr: rnd(-0.03, 0.03), color: ["#3a3530", "#5b544c", "#2a2622"][i % 3] }); }
    sparks(x, y, 18, "#FFD27A", 1.3, delay);
    smoke(x, y, 10, delay + ms(120));
    add({ type: "edge", delay, life: 600, color: col, a: krak ? 0.35 : 0.5 });
  };
  const fire = (t, sx, sy, tx, ty, o) => add({ type: "round", delay: t, life: o.life || Math.max(90, Math.hypot(tx - sx, ty - sy) / (o.speed || 1.8)), x0: sx, y0: sy, x1: tx, y1: ty, color: o.color || color, w: (o.w || 3) * 1.5, tail: (o.tail || 46) * 1.6, blur: (o.blur || 12) * 1.6, trail: o.trail, ease: o.ease, done: o.hit });
  const muzzle = (t, s, col) => {
    flash(mx, my, s, col || color, t, 140);
    for (let i = 0; i < 3; i++) { const ang = Math.atan2(uy, ux) + rnd(-0.35, 0.35), sp = rnd(0.15, 0.3); add({ type: "fire", delay: t, life: rnd(140, 220), x: mx, y: my, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r0: s * 0.3, r1: s * 0.9, hue: 40 }); }
    sparks(mx, my, 4, col || color, 0.8, t); smoke(mx, my, 3, t + 40, "110,104,96"); fxMove.recoil(card, ux, uy, s * 0.5, t);
  };
  let hit = 0;
  const shots = (n, gap, o) => {
    for (let i = 0; i < n; i++) {
      const t = ms(o.start || 140) + i * ms(gap), [tx, ty] = o.stitch ? [b.left + b.width * (0.15 + 0.7 * i / Math.max(1, n - 1)), by + rnd(-b.height * 0.2, b.height * 0.2)] : spot();
      const travel = Math.max(90, Math.hypot(tx - mx, ty - my) / (o.speed || 1.8));
      if (i === 0) hit = t + travel;
      muzzle(t, o.muzzle || 16, o.color);
      fire(t, mx, my, tx, ty, { ...o, hit: () => {
        flash(tx, ty, o.impact || 22, o.color || color, 0);
        add({ type: "ring", life: 300, x: tx, y: ty, r0: 4, r1: (o.impact || 22) * 1.6, color: "#FFFFFF", w: 2, a: 0.7 });
        sparks(tx, ty, o.sparks || 8, o.color || color, 1.1, 0, true); smoke(tx, ty, 2, 0, "80,74,68");
        fxMove.jolt(target, ux, uy, o.jolt || 4); if (o.mark !== false) mark(o.markKind || "hole", tx, ty, o.markSize || 20);
      } });
    }
    big(o.shake || 5, o.color, hit + (n - 1) * ms(gap));
  };

  switch (p.kind) {
    case "bolt": shots(Math.min(5, Math.max(3, parseInt(weapon && weapon.atk, 10) || 4)), 125, { w: 4, tail: 52, muzzle: 22, impact: 30, sparks: 12, jolt: 6, shake: 8, speed: 2.2, markSize: 22 }); break;
    case "slug": shots(3, 140, { w: 3, tail: 40, muzzle: 15, impact: 20, sparks: 7, jolt: 4, shake: 5 }); break;
    case "auto": shots(9, 60, { w: 2.4, tail: 34, muzzle: 13, impact: 16, sparks: 5, jolt: 3, shake: 7, stitch: true, speed: 2.4, markSize: 16 }); break;
    case "shotgun": {
      const t = ms(150); muzzle(t, 34); hit = t + 120;
      for (let i = 0; i < 8; i++) { const [tx, ty] = spot(); fire(t, mx, my, tx, ty, { w: 2, tail: 22, life: 120, hit: () => { sparks(tx, ty, 4, color, 0.8, 0, true); mark("hole", tx, ty, 13); } }); }
      setTimeout(() => fxMove.jolt(target, ux, uy, 11), hit); big(10, color, hit); break;
    }
    case "sniper": {
      const aim = ms(520); add({ type: "sight", life: aim, x0: mx, y0: my, x1: bx, y1: by, color: "#FF3B30" });
      muzzle(aim, 30, "#FFFFFF"); fxMove.recoil(card, ux, uy, 16, aim);
      add({ type: "beam", delay: aim, life: 520, x0: mx, y0: my, x1: bx, y1: by, w: 2.5, color: p.color });
      hit = aim + 40; flash(bx, by, 46, "#FFFFFF", hit, 260); sparks(bx, by, 18, p.color, 1.5, hit, true);
      add({ type: "ring", delay: hit, life: 420, x: bx, y: by, r0: 4, r1: 46, color: p.color, w: 2 });
      setTimeout(() => { fxMove.jolt(target, ux, uy, 14); mark("hole", bx, by, 30); }, hit); big(11, "#FFFFFF", hit); break;
    }
    case "las": {
      for (let i = 0; i < 3; i++) {
        const t = ms(120) + i * ms(150), [tx, ty] = spot(); if (i === 0) hit = t + 20;
        flash(mx, my, 14, "#FF4B3E", t, 120); fxMove.recoil(card, ux, uy, 3, t);
        add({ type: "beam", delay: t, life: 170, x0: mx, y0: my, x1: tx, y1: ty, w: 4, color: "#FF3B30" });
        add({ type: "glow", delay: t + 20, life: 260, x: tx, y: ty, r0: 6, r1: 22, color: "#FF4B3E", done: () => mark("burn", tx, ty, 20) });
        sparks(tx, ty, 6, "#FF8A6B", 0.8, t + 20, true);
        setTimeout(() => fxMove.jolt(target, ux, uy, 3), t + 20);
      }
      big(5, "#FF4B3E", hit + ms(300)); break;
    }
    case "plasma": case "electric": {
      const col = p.color, charge = ms(380);
      for (let i = 0; i < 14; i++) { const ang = rnd(0, 6.28), r = rnd(26, 46); add({ type: "spark", delay: i * ms(22), life: 260, x: mx + Math.cos(ang) * r, y: my + Math.sin(ang) * r, vx: -Math.cos(ang) * 0.12, vy: -Math.sin(ang) * 0.12, color: col, w: 1.6, len: 10 }); }
      add({ type: "glow", life: charge + 80, x: mx, y: my, r0: 4, r1: 26, color: col, pow: 0.4 });
      fxMove.recoil(card, ux, uy, 13, charge);
      if (p.kind === "electric") {
        hit = charge + 30;
        for (let i = 0; i < 4; i++) add({ type: "bolt", delay: charge + i * ms(70), life: 260, x0: mx, y0: my, x1: bx + rnd(-20, 20), y1: by + rnd(-12, 12), color: col, w: 2.4, jag: 40 });
        for (let i = 0; i < 5; i++) add({ type: "bolt", delay: hit + i * ms(60), life: 200, x0: bx + rnd(-30, 30), y0: by + rnd(-20, 20), x1: bx + rnd(-30, 30), y1: by + rnd(-20, 20), color: col, w: 1.6, jag: 16 });
      } else {
        const travel = Math.max(160, dist / 1.2); hit = charge + travel;
        fire(charge, mx, my, bx, by, { color: col, w: 10, tail: 70, blur: 24, life: travel, trail: "glow" });
      }
      flash(bx, by, 70, col, hit, 380); add({ type: "ring", delay: hit, life: 650, x: bx, y: by, r0: 8, r1: 110, color: col, w: 4 });
      sparks(bx, by, 22, col, 1.4, hit);
      for (let i = 0; i < 10; i++) add({ type: "fire", delay: hit + i * 40, life: 700, x: bx + rnd(-24, 24), y: by + rnd(-10, 10), vx: rnd(-0.02, 0.02), vy: rnd(-0.08, -0.04), r0: 3, r1: 12, hue: col === "#6BFF8A" ? 130 : col === "#C9A0FF" ? 270 : 190, a: 0.7 });
      add({ type: "edge", delay: hit, life: 520, color: col, a: 0.4 });
      setTimeout(() => { fxMove.jolt(target, ux, uy, 12); fxMove.heat(target, col, 0, 900); mark(p.kind === "electric" ? "burn" : "melt", bx + rnd(-10, 10), by + rnd(-6, 6), 30); }, hit);
      big(12, col, hit); break;
    }
    case "melta": {
      const col = p.color, on = ms(140), dur = ms(650); hit = on + 60;
      flash(mx, my, 24, col, on, dur);
      add({ type: "beam", delay: on, life: dur, x0: mx, y0: my, x1: bx, y1: by, w: 13, color: col, wob: 22 });
      for (let i = 0; i < 18; i++) { const f = rnd(0.1, 1), x = mx + (bx - mx) * f, y = my + (by - my) * f; add({ type: "fire", delay: on + rnd(0, dur), life: 500, x, y, vx: rnd(-0.02, 0.02), vy: rnd(-0.07, -0.03), r0: 2, r1: 9, a: 0.5 }); }
      for (let i = 0; i < 12; i++) sparks(bx, by, 2, "#FFE2A8", 1, on + i * ms(45), true);
      fxMove.recoil(card, ux, uy, 6, on); fxMove.heat(target, col, hit, dur + 300);
      for (let i = 0; i < 5; i++) fxMove.jolt(target, ux, uy, 3, hit + i * ms(120));
      setTimeout(() => { mark("melt", bx - 10, by, 30); mark("melt", bx + 12, by + 6, 22); }, hit + ms(200));
      if (screen) { for (let i = 0; i < 4; i++) fxMove.shake(screen, 4, hit + i * ms(140), 160); fxMove.border(screen, col, 1.4, hit); }
      add({ type: "edge", delay: hit, life: dur, color: col, a: 0.35 }); break;
    }
    case "flame": {
      const fire1 = p.green ? 95 : null, on = ms(120), dur = ms(700); hit = on + ms(220);
      for (let i = 0; i < 130; i++) {
        const ang = Math.atan2(dy, dx) + rnd(-0.32, 0.32), sp = rnd(0.5, 0.95), t = on + (dur * i) / 130;
        add({ type: "fire", delay: t, life: rnd(560, 820), x: mx + rnd(-3, 3), y: my + rnd(-3, 3), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.02, drag: 0.958, r0: 6, r1: rnd(26, 48), a: 1, hue: fire1 !== null ? fire1 - rnd(0, 35) : undefined });
      }
      for (let i = 0; i < 10; i++) add({ type: "glow", delay: on + i * (dur / 10), life: 160, x: mx + ux * 10, y: my + uy * 10, r0: 10, r1: 30, color: p.green ? "#C8F06A" : "#FFE08A", pow: 1.2 });
      for (let i = 0; i < 14; i++) add({ type: "fire", delay: hit + i * ms(40), life: 700, x: bx + rnd(-b.width * 0.35, b.width * 0.35), y: by + rnd(-10, 14), vx: rnd(-0.02, 0.02), vy: rnd(-0.09, -0.05), r0: 4, r1: rnd(12, 22), a: 0.85, hue: fire1 !== null ? fire1 - 20 : undefined }); // the target keeps burning
      for (let i = 0; i < 6; i++) fxMove.recoil(card, ux, uy, 2.5, on + i * ms(110));
      smoke(bx, by - 10, 10, hit + ms(250), "60,52,46");
      fxMove.heat(target, "#FF8A3D", hit, dur + 200);
      setTimeout(() => { for (let i = 0; i < 3; i++) { const [tx, ty] = spot(); mark("scorch", tx, ty, 30); } }, hit + ms(150));
      if (screen) { fxMove.border(screen, p.green ? "#9BD35A" : "#FF8A3D", 1.3, hit); for (let i = 0; i < 3; i++) fxMove.shake(screen, 3, hit + i * ms(160), 180); }
      add({ type: "edge", delay: hit, life: dur, color: p.green ? "#9BD35A" : "#FF8A3D", a: 0.3 }); break;
    }
    case "grenade": {
      const flight = ms(620); hit = ms(80) + flight;
      fxMove.recoil(card, ux, uy, 8, ms(80));
      add({ type: "lob", delay: ms(80), life: flight, x0: mx, y0: my, x1: bx, y1: by, h: Math.max(70, dist * 0.5), s: 6 });
      boom(bx, by, p.krak ? 46 : 64, "#FF9A3C", hit, p.krak);
      setTimeout(() => { fxMove.jolt(target, ux, uy, 16); mark("scorch", bx, by, 40); mark(p.krak ? "crack" : "scorch", bx + rnd(-16, 16), by + rnd(-8, 8), 22); }, hit);
      big(16, "#FF9A3C", hit); break;
    }
    case "blast": {
      const t = ms(140), travel = Math.max(220, dist / 1.3); hit = t + travel;
      muzzle(t, 26); fxMove.recoil(card, ux, uy, 14, t);
      fire(t, mx, my, bx, by, { color: "#FFB347", w: 6, tail: 30, life: travel, trail: "smoke", ease: true });
      boom(bx, by, 72, "#FF9A3C", hit);
      setTimeout(() => { fxMove.jolt(target, ux, uy, 18); mark("scorch", bx, by, 44); mark("crack", bx + rnd(-18, 18), by + rnd(-8, 8), 24); }, hit);
      big(18, "#FF9A3C", hit); break;
    }
    case "psychic": {
      for (let i = 0; i < 4; i++) add({ type: "ring", delay: i * ms(110), life: ms(520), x: mx + (bx - mx) * (i / 4), y: my + (by - my) * (i / 4), r0: 6, r1: 34, color: "#B48CFF", w: 3 });
      hit = ms(480);
      for (let i = 0; i < 6; i++) add({ type: "bolt", delay: hit + i * ms(70), life: 220, x0: bx + rnd(-40, 40), y0: by + rnd(-26, 26), x1: bx + rnd(-40, 40), y1: by + rnd(-26, 26), color: "#C9A0FF", w: 2, jag: 22 });
      flash(bx, by, 60, "#B48CFF", hit, 420); add({ type: "edge", delay: hit, life: 600, color: "#7E57C2", a: 0.45 });
      setTimeout(() => { fxMove.warp(target); mark("burn", bx, by, 26); }, hit);
      big(9, "#B48CFF", hit); break;
    }
    default: {
      // Melee: wind-up, a fast lunge, impact, follow-through, and an easing return (no snapping back).
      const heavy = p.kind === "heavy", chain = p.kind === "chain";
      const dur = ms(heavy && !p.light ? 1500 : chain ? 1300 : 1100), wind = heavy && !p.light ? 0.3 : 0.22, strike = heavy && !p.light ? 0.52 : 0.46;
      const col = p.power ? "#9FDCFF" : chain ? "#FFB347" : "#FFE6A8";
      const reach = 0.64;
      card.animate([
        { transform: "none", offset: 0, easing: "cubic-bezier(.3,0,.2,1)" },
        { transform: "translate(" + (-ux * (heavy ? 22 : 14)) + "px," + (-uy * (heavy ? 22 : 14)) + "px) rotate(" + (heavy ? -6 : -3) + "deg) scale(0.96)", offset: wind, easing: "cubic-bezier(.55,0,.9,.4)" },
        { transform: "translate(" + dx * reach + "px," + dy * reach + "px) rotate(" + (heavy ? 4 : 2) + "deg) scale(1.05)", offset: strike, easing: "cubic-bezier(.2,.7,.3,1)" },
        { transform: "translate(" + dx * (reach - 0.05) + "px," + dy * (reach - 0.05) + "px) rotate(-1deg) scale(1.02)", offset: strike + 0.1, easing: "cubic-bezier(.45,0,.25,1)" },
        { transform: "none", offset: 1 },
      ], { duration: dur });
      hit = Math.round(dur * strike);
      for (let i = 0; i < 6; i++) add({ type: "glow", delay: Math.round(dur * wind) + i * ms(25), life: 220, x: ax + dx * reach * (i / 6), y: ay + dy * reach * (i / 6), r0: 4, r1: 14, color: col, pow: 1.5 }); // motion trail
      const R = Math.min(70, b.width * 0.42);
      if (chain) {
        for (let i = 0; i < 6; i++) { const a0 = rnd(-2.6, -0.4); add({ type: "slash", delay: hit + i * ms(65), life: 260, x: bx + rnd(-10, 10), y: by + rnd(-6, 6), r: R * rnd(0.7, 1), a0, a1: a0 + rnd(1.2, 1.8), color: col, w: 4 }); }
        for (let i = 0; i < 24; i++) sparks(bx + rnd(-14, 14), by + rnd(-8, 8), 1, i % 2 ? "#FFD27A" : col, 1.2, hit + i * ms(18), true);
        for (let i = 0; i < 6; i++) fxMove.jolt(target, ux, uy, 4, hit + i * ms(65));
        setTimeout(() => { mark("slash", bx - 12, by - 4, 30); mark("slash", bx + 10, by + 6, 26); mark("slash", bx, by, 22); }, hit + ms(200));
        big(9, col, hit);
      } else if (heavy && p.light) {
        flash(bx, by, 40, "#FFF3C4", hit, 220);
        add({ type: "ring", delay: hit, life: 420, x: bx, y: by, r0: 6, r1: 60, color: "#FFE6A8", w: 3 });
        sparks(bx, by, 10, "#FFE6A8", 1, hit, true);
        setTimeout(() => { fxMove.jolt(target, ux, uy, 12); mark("crack", bx, by, 26); }, hit);
        big(9, "#FFE6A8", hit);
      } else if (heavy) {
        flash(bx, by, 80, p.power ? "#9FDCFF" : "#FFF3C4", hit, 320);
        add({ type: "ring", delay: hit, life: 620, x: bx, y: by, r0: 10, r1: 130, color: col, w: 5 });
        add({ type: "ring", delay: hit + ms(80), life: 700, x: bx, y: by, r0: 8, r1: 90, color: "#FFFFFF", w: 2, a: 0.6 });
        for (let i = 0; i < 12; i++) { const ang = rnd(0, 6.28), sp = rnd(0.25, 0.55); add({ type: "debris", delay: hit, life: rnd(600, 900), x: bx, y: by, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.15, drag: 0.97, g: 0.0012, s: rnd(3, 6), vr: rnd(-0.03, 0.03), color: "#4a443e" }); }
        sparks(bx, by, 26, col, 1.6, hit);
        add({ type: "edge", delay: hit, life: 520, color: p.power ? "#5FB8FF" : "#FFE6A8", a: 0.45 });
        setTimeout(() => { fxMove.jolt(target, ux, uy, 18); mark("crack", bx, by, 40); }, hit);
        big(18, col, hit);
      } else {
        [[-2.4, -0.5], [-0.6, -2.5]].forEach(([a0, a1], i) => add({ type: "slash", delay: hit + i * ms(110), life: 300, x: bx, y: by, r: R, a0, a1, color: col, w: 5 }));
        sparks(bx, by, 14, col, 1.2, hit, true);
        setTimeout(() => { fxMove.jolt(target, ux, uy, 10); mark("slash", bx - 4, by - 2, 32); }, hit);
        setTimeout(() => mark("slash", bx + 6, by + 8, 26), hit + ms(110));
        big(10, col, hit);
      }
    }
  }
  if (opts.shock) {
    for (let i = 0; i < 5; i++) add({ type: "bolt", delay: hit + ms(200) + i * ms(70), life: 240, x0: b.left + rnd(0, b.width * 0.3), y0: by + rnd(-14, 14), x1: b.right - rnd(0, b.width * 0.3), y1: by + rnd(-14, 14), color: "#9FE6FF", w: 2.2, jag: 30 });
    if (screen) fxMove.border(screen, "#9FE6FF", 1.4, hit + ms(200));
  }
  return hit;
}

// A block in a fight: the blocker braces and pushes toward the attacker, a shield arc flares in front of it, the two
// meet in a clash of sparks, and the attacker's card is knocked back. Returns when the clash lands (ms).
function playBlockFx(weapon, blocker, other, opts = {}) {
  const p = fxProfile({ ...weapon, type: "melee" }), add = FX.add, ms = fxMs, rnd = (lo, hi) => lo + Math.random() * (hi - lo);
  const a = blocker.getBoundingClientRect(), b = other.getBoundingClientRect();
  const ax = a.left + a.width / 2, ay = a.top + a.height / 2, bx = b.left + b.width / 2, by = b.top + b.height / 2;
  const dx = bx - ax, dy = by - ay, dist = Math.hypot(dx, dy) || 1, ux = dx / dist, uy = dy / dist;
  const col = p.power ? "#9FDCFF" : "#BFD7FF", screen = opts.screen || blocker.closest("[role=dialog]");
  const dur = ms(820), clash = Math.round(dur * 0.3);
  // the brace: a quick crouch back, a hard push toward the attacker, then an easing settle
  blocker.animate([
    { transform: "none", easing: "cubic-bezier(.3,0,.2,1)" },
    { transform: "translate(" + (-ux * 6) + "px," + (-uy * 6) + "px) scale(0.97)", offset: 0.14, easing: "cubic-bezier(.5,0,.9,.5)" },
    { transform: "translate(" + ux * dist * 0.16 + "px," + uy * dist * 0.16 + "px) rotate(" + (ux > 0 ? 2 : -2) + "deg) scale(1.04)", offset: 0.3, easing: "cubic-bezier(.2,.7,.3,1)" },
    { transform: "translate(" + ux * dist * 0.1 + "px," + uy * dist * 0.1 + "px)", offset: 0.45, easing: "cubic-bezier(.45,0,.25,1)" },
    { transform: "none" },
  ], { duration: dur });
  // where they meet: just past the front edge of the blocker's pushed card
  const fx0 = ax + ux * (a.width * 0.5 + dist * 0.16), fy0 = ay + uy * (a.height * 0.5 + dist * 0.16);
  const cx = fx0 + (bx - b.width * 0.5 * ux - fx0) * 0.5, cy = (fy0 + by) / 2;
  add({ type: "shield", delay: clash - ms(80), life: ms(700), x: fx0 - ux * 34, y: fy0 - uy * 34, r: Math.min(64, a.height * 0.75), ang: Math.atan2(uy, ux), color: col, w: 7 });
  add({ type: "glow", delay: clash, life: 240, x: cx, y: cy, r0: 20, r1: 60, color: col, pow: 1.4 });
  add({ type: "glow", delay: clash, life: 140, x: cx, y: cy, r0: 8, r1: 26, color: "#FFFFFF", pow: 2 });
  add({ type: "ring", delay: clash, life: 420, x: cx, y: cy, r0: 6, r1: 70, color: col, w: 3 });
  const base = Math.atan2(uy, ux) + Math.PI / 2;
  [[-0.8, 0.8], [0.8, -0.8]].forEach(([a0, a1], i) => add({ type: "slash", delay: clash + i * ms(40), life: 220, x: cx, y: cy, r: 26, a0: base + a0, a1: base + a1, color: "#FFFFFF", w: 3 }));
  for (let i = 0; i < 26; i++) { const ang = base + (i % 2 ? 0 : Math.PI) + rnd(-0.7, 0.7), sp = rnd(0.35, 0.9); add({ type: "spark", delay: clash, life: rnd(300, 600), x: cx, y: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, drag: 0.92, g: 0.0011, color: i % 3 ? col : "#FFFFFF", w: rnd(1.6, 3), len: 20 }); }
  setTimeout(() => fxMove.jolt(other, ux, uy, 12), clash);
  if (screen) { fxMove.shake(screen, 6, clash, 320); fxMove.border(screen, col, 1.1, clash); }
  return clash;
}

// The versus intro, when both sides first face off: the names slam down onto their cards one after the other, the
// marker between them pops, the window shakes and flashes, and fire spews outward all round its border.
// Reduce Motion: the names just fade in.
function playVersusFx(screen, names, marker) {
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) { names.forEach(el => el && el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" })); return; }
  const rnd = (lo, hi) => lo + Math.random() * (hi - lo), land = 200;
  names.forEach((el, i) => el && el.animate([
    { transform: "translateY(-28px) scale(2.1)", opacity: 0, filter: "blur(2px)" },
    { offset: 0.55, transform: "translateY(2px) scale(0.94)", opacity: 1, filter: "blur(0)" },
    { offset: 0.8, transform: "translateY(-1px) scale(1.02)" },
    { transform: "none" },
  ], { duration: 360, delay: i * 140, easing: "cubic-bezier(.3,0,.4,1)", fill: "backwards" }));
  if (marker) marker.animate([{ transform: "translate(-50%, -50%) scale(0)" }, { offset: 0.6, transform: "translate(-50%, -50%) scale(1.35)" }, { transform: "translate(-50%, -50%) scale(1)" }], { duration: 300, delay: land + 140, easing: "ease-out", fill: "backwards" });
  if (!screen) return;
  fxMove.shake(screen, 10, land, 460);
  fxMove.border(screen, "#FF8A3D", 1.3, land);
  // Fire along all four edges: a dense wall of flame pushed outward (and upward, as flames go), with embers flying off.
  const r = screen.getBoundingClientRect(), per = 2 * (r.width + r.height), n = 170;
  const edge = (d) => {
    if (d < r.width) return [r.left + d, r.top, 0, -1];
    if ((d -= r.width) < r.height) return [r.right, r.top + d, 1, 0];
    if ((d -= r.height) < r.width) return [r.right - d, r.bottom, 0, 1];
    d -= r.width; return [r.left, r.bottom - d, -1, 0];
  };
  for (let i = 0; i < n; i++) {
    const [x, y, nx, ny] = edge((i + Math.random()) / n * per), sp = rnd(0.06, 0.22);
    FX.add({ type: "fire", delay: land + rnd(0, 120), life: rnd(320, 560), x: x + rnd(-4, 4), y: y + rnd(-4, 4), vx: nx * sp + rnd(-0.03, 0.03), vy: ny * sp + rnd(-0.03, 0.03) - 0.06, drag: 0.95, r0: rnd(5, 9), r1: rnd(18, 32), a: 0.95 });
  }
  for (let i = 0; i < 40; i++) {
    const [x, y, nx, ny] = edge(Math.random() * per), sp = rnd(0.25, 0.6);
    FX.add({ type: "spark", delay: land + rnd(0, 160), life: rnd(260, 480), x, y, vx: nx * sp + rnd(-0.1, 0.1), vy: ny * sp + rnd(-0.1, 0.1) - 0.05, color: Math.random() < 0.5 ? "#FFD27A" : "#FF8A3D", w: 1.6, len: 8 });
  }
}

// With the phone set to reduce motion: no movement, just a glow around the card that was hit and on the screen frame.
function calmHit(card, weapon) {
  const p = weapon ? fxProfile(weapon) : null, col = p ? fxColor(p) : "#B8341C";
  card.animate([{ boxShadow: "0 0 0 3px " + col }, { boxShadow: "0 0 0 3px " + col, offset: 0.6 }, { boxShadow: "0 0 0 0 transparent" }], { duration: 1400, easing: "ease-out" });
  const screen = card.closest("[role=dialog]");
  if (screen) fxMove.border(screen, col, 1, 0);
  if (p) { const r = card.getBoundingClientRect(); fxDecal(card, scarKindOf(p), r.left + r.width * 0.6, r.top + r.height * 0.45, 26); }
}

// Hot: when a Hot weapon hurts its own user, the card glows red and shakes, embers rise, and the frame flares.
function playHotFx(card, fromEl) {
  const ms = fxMs, r = card.getBoundingClientRect(), o = (fromEl || card).getBoundingClientRect();
  const glow = document.createElement("div");
  glow.setAttribute("data-fx", "hot");
  glow.style.cssText = "position:fixed;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;border-radius:6px;opacity:0;pointer-events:none;z-index:10001;background:#B8341C30;box-shadow:inset 0 0 28px #E0664A, 0 0 18px #B8341C";
  document.body.appendChild(glow);
  glow.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0.7, offset: 0.6 }, { opacity: 0 }], { duration: ms(800), fill: "forwards" });
  setTimeout(() => glow.remove(), ms(900));
  fxMove.shake(card, 7, 0, ms(500));
  fxMove.heat(card, "#FF6B3D", 0, ms(900));
  for (let i = 0; i < 24; i++) FX.add({ type: "fire", delay: i * ms(25), life: 700, x: o.left + Math.random() * o.width, y: o.top + o.height * 0.6, vx: (Math.random() - 0.5) * 0.04, vy: -0.08 - Math.random() * 0.06, r0: 3, r1: 10, a: 0.8 });
  const screen = card.closest("[role=dialog]");
  if (screen) fxMove.border(screen, "#FF5A3C", 1.3, 0);
}


