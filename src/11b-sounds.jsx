/* ═══ SOUNDS ═══ */
// Attack sounds (owner, Oct 29; sample page Nov 14). Every sound is made here with the browser's Web Audio engine
// (noise, tones and volume shapes, like a small synthesizer): no sound files, nothing to license, nothing to download,
// and it works offline. One recipe per weapon kind that fxProfile sorts, plus the game's moments (hit, save, block...).
// Each recipe draws into any audio context, so the self-test can render it silently (OfflineAudioContext) and check it.
// Not in the game yet: the sample page (?sounds) is for tuning them first.

// Shared building blocks. t is the start time in the context's clock (seconds).
function sndNoise(ctx) {
  if (!ctx.__ksNoise) {
    const len = Math.floor(ctx.sampleRate * 2.5), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    ctx.__ksNoise = buf;
  }
  return ctx.__ksNoise;
}
// A volume shape: up to peak in a seconds, then down to silence over d seconds.
function sndEnv(param, t, peak, a, d) {
  param.setValueAtTime(0.0001, t);
  param.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
  param.exponentialRampToValueAtTime(0.0001, t + a + d);
}
// A burst of filtered noise (cracks, whooshes, explosions, hiss). o: dur, type, f, f1 (filter sweeps to it), q, gain, a.
function sndBurst(ctx, dest, t, o) {
  const a = o.a || 0.003, src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = sndNoise(ctx); src.loop = true;
  fl.type = o.type || "lowpass"; fl.Q.value = o.q || 0.7;
  fl.frequency.setValueAtTime(o.f, t);
  if (o.f1) fl.frequency.exponentialRampToValueAtTime(o.f1, t + a + o.dur);
  sndEnv(g.gain, t, o.gain || 0.5, a, o.dur);
  src.connect(fl); fl.connect(g); g.connect(dest);
  src.start(t, Math.random() * 2); src.stop(t + a + o.dur + 0.05);
}
// A tone that can slide in pitch (thumps, zaps, rings). o: wave, f, f1, sweep (seconds to reach f1), dur, gain, a, lp, lp1.
function sndTone(ctx, dest, t, o) {
  const a = o.a || 0.004, osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = o.wave || "sine";
  osc.frequency.setValueAtTime(o.f, t);
  if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + (o.sweep || a + o.dur));
  let node = osc;
  if (o.lp) {
    const fl = ctx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.setValueAtTime(o.lp, t);
    if (o.lp1) fl.frequency.exponentialRampToValueAtTime(o.lp1, t + a + o.dur);
    osc.connect(fl); node = fl;
  }
  sndEnv(g.gain, t, o.gain || 0.3, a, o.dur);
  node.connect(g); g.connect(dest);
  osc.start(t); osc.stop(t + a + o.dur + 0.05);
}
// A tone chopped on and off quickly (chainsword teeth, electric buzz).
function sndChopped(ctx, dest, t, o) {
  const osc = ctx.createOscillator(), fl = ctx.createBiquadFilter(), am = ctx.createGain(), lfo = ctx.createOscillator(), depth = ctx.createGain(), g = ctx.createGain();
  osc.type = o.wave || "sawtooth";
  osc.frequency.setValueAtTime(o.f, t);
  if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + (o.sweep || o.dur));
  fl.type = "lowpass"; fl.frequency.value = o.lp || 1400;
  am.gain.value = 0.5; lfo.type = "square"; lfo.frequency.value = o.rate || 36; depth.gain.value = 0.45;
  lfo.connect(depth); depth.connect(am.gain);
  sndEnv(g.gain, t, o.gain || 0.4, o.a || 0.04, o.dur);
  osc.connect(fl); fl.connect(am); am.connect(g); g.connect(dest);
  osc.start(t); lfo.start(t); osc.stop(t + o.dur + 0.15); lfo.stop(t + o.dur + 0.15);
}
const sndVary = () => 0.93 + Math.random() * 0.14; // a little different every time, so repeats don't sound robotic

// Pieces several sounds share.
function sndShot(ctx, d, t, s) { // a plain gunshot: crack and thump
  const v = sndVary();
  sndBurst(ctx, d, t, { type: "bandpass", f: 3000 * v, f1: 1100, q: 1, gain: 0.75 * s, dur: 0.05 });
  sndTone(ctx, d, t, { f: 180 * v, f1: 60, dur: 0.09, gain: 0.55 * s });
}
function sndBoom(ctx, d, t, big, krak) { // an explosion
  sndBurst(ctx, d, t, { type: "highpass", f: 2500, gain: 0.4, dur: 0.06 });
  sndBurst(ctx, d, t, { type: "lowpass", f: 1800, f1: 120, gain: 1, dur: krak ? 0.5 : big ? 1.2 : 0.95 });
  sndTone(ctx, d, t, { f: 90 * sndVary(), f1: 28, dur: big ? 0.8 : 0.65, gain: 1 });
  if (krak) sndTone(ctx, d, t, { wave: "square", f: 700, f1: 300, dur: 0.25, gain: 0.15, lp: 2000 });
}
function sndZap(ctx, d, t) { // the crackle of a power field
  sndTone(ctx, d, t, { wave: "sawtooth", f: 85, dur: 0.45, gain: 0.09, lp: 900 });
  sndBurst(ctx, d, t, { type: "highpass", f: 4000, a: 0.01, dur: 0.1, gain: 0.15 });
}

// The recipes. Each draws one sound starting at t and returns how long it lasts (seconds). o: { shots, power, light, krak }.
const SOUND_RECIPES = {
  bolt(ctx, d, t) {
    const v = sndVary();
    sndBurst(ctx, d, t, { type: "bandpass", f: 2400 * v, f1: 700, q: 0.8, gain: 0.9, dur: 0.09 });
    sndTone(ctx, d, t, { f: 140 * v, f1: 45, dur: 0.16, gain: 0.8 });
    sndBurst(ctx, d, t + 0.07, { type: "lowpass", f: 1500, f1: 200, gain: 0.6, dur: 0.18 }); // the bolt round going off
    sndTone(ctx, d, t + 0.07, { f: 90, f1: 40, dur: 0.15, gain: 0.5 });
    return 0.32;
  },
  slug(ctx, d, t) { sndShot(ctx, d, t, 1); return 0.15; },
  auto(ctx, d, t, o) {
    const n = Math.max(2, Math.min(6, (o && o.shots) || 4));
    for (let i = 0; i < n; i++) sndShot(ctx, d, t + i * 0.075 + Math.random() * 0.01, 0.8);
    return n * 0.075 + 0.15;
  },
  shotgun(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "lowpass", f: 4000, f1: 600, gain: 1, dur: 0.28 });
    sndTone(ctx, d, t, { f: 110 * sndVary(), f1: 40, dur: 0.22, gain: 0.9 });
    [0.45, 0.58].forEach(k => { // racking the next shell
      sndBurst(ctx, d, t + k, { type: "bandpass", f: 1800, q: 3, dur: 0.03, gain: 0.35 });
      sndTone(ctx, d, t + k, { wave: "square", f: 600, dur: 0.02, gain: 0.06, lp: 3000 });
    });
    return 0.7;
  },
  sniper(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "highpass", f: 2500, dur: 0.035, gain: 1 });
    sndTone(ctx, d, t, { f: 220 * sndVary(), f1: 50, dur: 0.12, gain: 0.6 });
    sndBurst(ctx, d, t + 0.02, { type: "bandpass", f: 900, f1: 300, q: 0.7, a: 0.02, dur: 0.9, gain: 0.18 }); // the echo
    return 1;
  },
  las(ctx, d, t) {
    const v = sndVary();
    sndTone(ctx, d, t, { wave: "sawtooth", f: 2200 * v, f1: 500, dur: 0.14, gain: 0.25, lp: 5000 });
    sndTone(ctx, d, t, { f: 1200 * v, f1: 300, dur: 0.12, gain: 0.3 });
    sndBurst(ctx, d, t, { type: "highpass", f: 3000, dur: 0.04, gain: 0.3 });
    return 0.2;
  },
  plasma(ctx, d, t) {
    sndTone(ctx, d, t, { wave: "sawtooth", f: 180, f1: 900, sweep: 0.28, a: 0.26, dur: 0.05, gain: 0.12, lp: 1500 }); // charging
    const f = t + 0.3;
    sndBurst(ctx, d, f, { type: "lowpass", f: 2500, f1: 300, gain: 0.9, dur: 0.45 });
    sndTone(ctx, d, f, { f: 420 * sndVary(), f1: 55, dur: 0.4, gain: 0.7 });
    sndTone(ctx, d, f, { wave: "square", f: 880, f1: 110, dur: 0.15, gain: 0.1, lp: 3000 });
    return 0.8;
  },
  melta(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "bandpass", f: 300, f1: 2500, q: 1.2, a: 0.05, dur: 0.35, gain: 0.8 });
    sndTone(ctx, d, t, { f: 70, f1: 40, a: 0.03, dur: 0.5, gain: 0.7 });
    sndBurst(ctx, d, t + 0.15, { type: "highpass", f: 5000, a: 0.1, dur: 0.6, gain: 0.2 }); // sizzle
    return 0.85;
  },
  flame(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "lowpass", f: 500, f1: 2200, a: 0.12, dur: 0.7, gain: 0.8 });
    sndTone(ctx, d, t, { f: 55, a: 0.1, dur: 0.8, gain: 0.35 });
    for (let i = 0; i < 10; i++) sndBurst(ctx, d, t + 0.1 + Math.random() * 0.7, { type: "highpass", f: 3000, dur: 0.015, gain: 0.25 }); // crackle
    return 0.95;
  },
  electric(ctx, d, t) {
    sndTone(ctx, d, t, { wave: "sawtooth", f: 100, dur: 0.45, gain: 0.1, lp: 1200 });
    for (let i = 0; i < 6; i++) {
      const k = t + i * 0.06 + Math.random() * 0.03;
      sndTone(ctx, d, k, { wave: "square", f: 300 + Math.random() * 1100, f1: 80 + Math.random() * 220, dur: 0.05, gain: 0.12, lp: 4000 });
      sndBurst(ctx, d, k, { type: "highpass", f: 2000, dur: 0.04, gain: 0.4 });
    }
    return 0.5;
  },
  psychic(ctx, d, t) {
    [330, 349].forEach(f => sndTone(ctx, d, t, { f, f1: f * 1.6, sweep: 0.5, a: 0.2, dur: 0.3, gain: 0.2 }));
    sndBurst(ctx, d, t, { type: "bandpass", f: 300, f1: 3000, q: 1, a: 0.45, dur: 0.05, gain: 0.5 }); // rushing in
    sndTone(ctx, d, t + 0.5, { f: 160, f1: 40, dur: 0.5, gain: 0.7 });
    sndBurst(ctx, d, t + 0.5, { type: "lowpass", f: 800, f1: 100, dur: 0.4, gain: 0.5 });
    return 1;
  },
  grenade(ctx, d, t, o) {
    sndTone(ctx, d, t, { f: 2600, dur: 0.08, gain: 0.15 }); // lands
    sndTone(ctx, d, t + 0.12, { f: 2500, dur: 0.06, gain: 0.1 }); // bounces
    sndBoom(ctx, d, t + 0.4, false, o && o.krak);
    return 1.5;
  },
  blast(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "bandpass", f: 600, f1: 2200, q: 1.5, a: 0.03, dur: 0.3, gain: 0.45 }); // launch
    sndTone(ctx, d, t, { f: 120, f1: 50, dur: 0.1, gain: 0.5 });
    sndBoom(ctx, d, t + 0.38, true);
    return 1.7;
  },
  blade(ctx, d, t, o) {
    sndBurst(ctx, d, t, { type: "bandpass", f: 1200, f1: 4500, q: 2, a: 0.06, dur: 0.12, gain: 0.6 }); // swing
    const k = t + 0.17;
    sndBurst(ctx, d, k, { type: "highpass", f: 1800, dur: 0.07, gain: 0.5 });
    sndTone(ctx, d, k, { wave: "triangle", f: 1400, f1: 900, dur: 0.1, gain: 0.08 });
    if (o && o.power) sndZap(ctx, d, k);
    return 0.5;
  },
  chain(ctx, d, t, o) {
    sndChopped(ctx, d, t, { f: 70, f1: 130, sweep: 0.35, dur: 0.7, gain: 0.4, rate: 36, lp: 1400 }); // the motor revving
    sndBurst(ctx, d, t + 0.2, { type: "bandpass", f: 2500, q: 1.5, a: 0.1, dur: 0.45, gain: 0.35 }); // teeth biting
    if (o && o.power) sndZap(ctx, d, t + 0.2);
    return 0.85;
  },
  heavy(ctx, d, t, o) {
    const light = o && o.light, k = t + (light ? 0.12 : 0.2);
    sndBurst(ctx, d, t, { type: "lowpass", f: 300, f1: 900, a: light ? 0.05 : 0.1, dur: 0.12, gain: light ? 0.3 : 0.45 }); // swing
    sndTone(ctx, d, k, { f: light ? 150 : 110, f1: light ? 60 : 35, dur: light ? 0.12 : 0.3, gain: light ? 0.7 : 1 });
    sndBurst(ctx, d, k, { type: "lowpass", f: light ? 900 : 1200, f1: 150, dur: light ? 0.06 : 0.25, gain: light ? 0.5 : 0.8 });
    if (o && o.power) sndZap(ctx, d, k);
    return light ? 0.3 : 0.6;
  },
  // The game's moments.
  hit(ctx, d, t) {
    sndTone(ctx, d, t, { f: 130, f1: 50, dur: 0.14, gain: 0.8 });
    sndBurst(ctx, d, t, { type: "lowpass", f: 1600, f1: 300, dur: 0.1, gain: 0.6 });
    return 0.2;
  },
  crit(ctx, d, t) {
    sndTone(ctx, d, t, { f: 110, f1: 35, dur: 0.3, gain: 1 });
    sndBurst(ctx, d, t, { type: "lowpass", f: 2500, f1: 200, dur: 0.2, gain: 0.9 });
    sndTone(ctx, d, t, { wave: "triangle", f: 1650, dur: 0.4, gain: 0.12 });
    sndTone(ctx, d, t, { wave: "triangle", f: 2470, dur: 0.3, gain: 0.07 });
    return 0.5;
  },
  save(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "highpass", f: 4000, dur: 0.03, gain: 0.3 });
    sndTone(ctx, d, t, { f: 2100, dur: 0.25, gain: 0.15 });
    sndTone(ctx, d, t, { f: 3150, dur: 0.18, gain: 0.08 });
    sndTone(ctx, d, t + 0.05, { f: 3200, f1: 1400, dur: 0.22, gain: 0.08 }); // ricochet
    return 0.35;
  },
  block(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "bandpass", f: 3000, q: 1, dur: 0.06, gain: 0.7 });
    [[820, 0.2], [1230, 0.14], [1960, 0.1], [2730, 0.06]].forEach(([f, g]) => sndTone(ctx, d, t, { wave: "triangle", f: f * sndVary(), dur: 0.5, gain: g }));
    return 0.6;
  },
  hot(ctx, d, t) {
    sndBurst(ctx, d, t, { type: "highpass", f: 2500, f1: 6000, a: 0.05, dur: 0.7, gain: 0.3 }); // venting steam
    [0.05, 0.22].forEach(k => sndTone(ctx, d, t + k, { wave: "square", f: 880, dur: 0.08, gain: 0.07, lp: 3000 })); // warning beeps
    sndTone(ctx, d, t, { wave: "sawtooth", f: 60, dur: 0.6, gain: 0.08, lp: 400 });
    return 0.8;
  },
  down(ctx, d, t) {
    sndTone(ctx, d, t, { f: 90, f1: 30, dur: 0.5, gain: 0.9 });
    sndBurst(ctx, d, t, { type: "lowpass", f: 600, f1: 100, dur: 0.4, gain: 0.5 });
    sndTone(ctx, d, t + 0.05, { wave: "triangle", f: 440, f1: 110, dur: 0.6, gain: 0.1 });
    return 0.7;
  },
  versus(ctx, d, t) {
    [55, 82.4].forEach(f => sndTone(ctx, d, t, { wave: "sawtooth", f, a: 0.3, dur: 0.6, gain: 0.18, lp: 200, lp1: 1800 }));
    sndTone(ctx, d, t + 0.75, { f: 70, f1: 35, dur: 0.5, gain: 1 });
    sndBurst(ctx, d, t + 0.75, { type: "lowpass", f: 900, f1: 100, dur: 0.35, gain: 0.6 });
    return 1.4;
  },
};

// The sample page's list, numbered so the owner can name the ones that need work. recipe + o pick the sound;
// trim evens out how loud they are. Weapon examples are from the teams in the app.
const SOUND_LIST = [
  { group: "Guns", n: 1, id: "bolt", name: "Bolt guns", eg: "Boltgun, bolt pistol" },
  { group: "Guns", n: 2, id: "auto", name: "Automatic fire", eg: "Autogun, heavy stubber, shoota, splinter rifle", o: { shots: 4 } },
  { group: "Guns", n: 3, id: "slug", name: "Single shot", eg: "Pistols and rifles that fit no other group" },
  { group: "Guns", n: 4, id: "shotgun", name: "Shotguns", eg: "Shotgun, scattergun, blunderbuss" },
  { group: "Guns", n: 5, id: "sniper", name: "Sniper rifles", eg: "Long-las, sniper rifle, marksman rifle" },
  { group: "Guns", n: 6, id: "las", name: "Las weapons", eg: "Lasgun, hot-shot lasgun, laspistol" },
  { group: "Guns", n: 7, id: "plasma", name: "Plasma and pulse", eg: "Plasma gun, pulse rifle, volkite" },
  { group: "Guns", n: 8, id: "melta", name: "Melta", eg: "Meltagun, fusion blaster, blaster" },
  { group: "Guns", n: 9, id: "flame", name: "Flamers", eg: "Flamer, burna, plague spewer" },
  { group: "Explosives and powers", n: 10, id: "grenade", name: "Frag grenade", eg: "Frag grenade, mines, charges" },
  { group: "Explosives and powers", n: 11, id: "grenade", name: "Krak grenade", eg: "Krak, melta and haywire grenades", o: { krak: true } },
  { group: "Explosives and powers", n: 12, id: "blast", name: "Launchers", eg: "Grenade launcher, missile launcher" },
  { group: "Explosives and powers", n: 13, id: "electric", name: "Electric and gauss", eg: "Gauss blaster, arc rifle, tesla" },
  { group: "Explosives and powers", n: 14, id: "psychic", name: "Psychic powers", eg: "Any weapon with the Psychic rule" },
  { group: "Melee", n: 15, id: "blade", name: "Blades", eg: "Combat knife, sword, claws" },
  { group: "Melee", n: 16, id: "blade", name: "Power blades", eg: "Power sword, force sword, power knife", o: { power: true } },
  { group: "Melee", n: 17, id: "chain", name: "Chainswords", eg: "Chainsword, eviscerator" },
  { group: "Melee", n: 18, id: "heavy", name: "Heavy blows", eg: "Hammer, maul, axe, great weapons", o: {} },
  { group: "Melee", n: 19, id: "heavy", name: "Power hammers and fists", eg: "Thunder hammer, power fist", o: { power: true } },
  { group: "Melee", n: 20, id: "heavy", name: "Punch", eg: "Fists, gun butt", o: { light: true } },
  { group: "Game moments", n: 21, id: "hit", name: "Hit lands", eg: "A normal hit" },
  { group: "Game moments", n: 22, id: "crit", name: "Critical hit", eg: "A critical hit" },
  { group: "Game moments", n: 23, id: "save", name: "Save", eg: "A defense die saves the hit" },
  { group: "Game moments", n: 24, id: "block", name: "Block", eg: "A fight die blocks the other" },
  { group: "Game moments", n: 25, id: "hot", name: "Hot", eg: "A Hot weapon overheats" },
  { group: "Game moments", n: 26, id: "down", name: "Operative down", eg: "An operative is incapacitated" },
  { group: "Game moments", n: 27, id: "versus", name: "Versus", eg: "The attack screen opens" },
];
// How loud each sound plays, so they come out about even (measured peaks, Nov 14: explosions came out six times
// louder than the chainsword). Keyed by recipe and variant.
const SOUND_TRIM = {
  bolt: 0.78, auto: 1.2, slug: 1.1, shotgun: 0.63, sniper: 0.6, las: 1, plasma: 0.68, melta: 1.2, flame: 1.25,
  grenade: 0.47, "grenade:krak": 0.5, blast: 0.52, electric: 1.5, psychic: 1,
  blade: 1.15, "blade:power": 0.87, chain: 2, "chain:power": 1.6, heavy: 0.65, "heavy:power": 0.67, "heavy:light": 0.85,
  hit: 0.9, crit: 0.58, save: 1.5, block: 1, hot: 1.2, down: 0.8, versus: 0.75,
};
const soundTrim = (id, o) => {
  const v = o && (o.krak ? "krak" : o.light ? "light" : o.power ? "power" : "");
  return SOUND_TRIM[v ? id + ":" + v : id] || SOUND_TRIM[id] || 1;
};
// Which sound a weapon makes, from the attack effects' sorting.
function soundOfWeapon(weapon) {
  const p = fxProfile(weapon);
  if (p.kind === "grenade") return { id: "grenade", o: { krak: !!p.krak } };
  if (p.kind === "heavy") return { id: "heavy", o: { power: !!p.power, light: !!p.light } };
  if (p.kind === "blade" || p.kind === "chain") return { id: p.kind, o: { power: !!p.power } };
  return { id: SOUND_RECIPES[p.kind] ? p.kind : "slug", o: {} };
}

// Playing out loud: one audio context for the page, through a volume control and a limiter that stops loud moments
// distorting. "ambient" lets the iPhone's silent switch mute it and leaves the player's music playing (Safari 16.4+).
let soundOut = null;
function soundOutput() {
  if (!soundOut) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = "ambient"; } catch (e) { /* older browsers */ }
    const ctx = new AC(), vol = ctx.createGain(), limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -6; limit.ratio.value = 12; limit.attack.value = 0.002; limit.release.value = 0.15;
    vol.connect(limit); limit.connect(ctx.destination);
    soundOut = { ctx, vol };
  }
  if (soundOut.ctx.state === "suspended") soundOut.ctx.resume();
  return soundOut;
}
// Play one sound now (or after delay seconds) at volume 0-1. Returns how long it lasts, or 0 if sound can't play here.
function playSound(id, o, volume, delay) {
  const out = soundOutput(), recipe = SOUND_RECIPES[id];
  if (!out || !recipe) return 0;
  out.vol.gain.setValueAtTime(volume == null ? 0.7 : volume, out.ctx.currentTime);
  const trim = out.ctx.createGain(); trim.gain.value = soundTrim(id, o); trim.connect(out.vol);
  try { return recipe(out.ctx, trim, out.ctx.currentTime + 0.02 + (delay || 0), o || {}); } catch (e) { return 0; }
}
const SOUND_MAX_PEAK = 1.5; // a sample this loud is a brief spike the limiter (soundOutput) catches; louder would crackle
// For the self-test: draws a sound silently and measures it: its loudest sample (peak), how loud it is over the
// loudest 10 ms (loud, closer to what the ear hears), and whether any samples are broken.
async function measureSound(id, o) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) return null;
  const ctx = new OAC(1, 44100 * 2, 44100), g = ctx.createGain();
  g.gain.value = soundTrim(id, o); g.connect(ctx.destination);
  const len = SOUND_RECIPES[id](ctx, g, 0.01, o || {});
  const d = (await ctx.startRendering()).getChannelData(0);
  let peak = 0, bad = false, loud = 0, sum = 0;
  const win = 441; // 10 ms
  for (let i = 0; i < d.length; i++) {
    const x = Math.abs(d[i]);
    if (x !== x) { bad = true; continue; }
    if (x > peak) peak = x;
    sum += x * x;
    if (i % win === win - 1) { loud = Math.max(loud, Math.sqrt(sum / win)); sum = 0; }
  }
  return { peak, loud, len, bad };
}

// The sample page (?sounds): every sound with a Play button, Play all, a volume control, and a box to hear what any
// weapon in the app sounds like. Hidden: only opened by its address.
function SoundLab({ onClose }) {
  const [volume, setVolume] = useState(0.7);
  const [playing, setPlaying] = useState(null); // the number of the sound playing
  const [weapon, setWeapon] = useState("");
  const timers = React.useRef([]);
  useBackClose(true, onClose);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); timers.current.forEach(clearTimeout); };
  }, []);
  const weapons = React.useMemo(() => {
    const seen = {};
    Object.values(FACTIONS).forEach(f => f.operatives.forEach(op => {
      op.ranged.forEach(w => { seen[w.name.toLowerCase()] = seen[w.name.toLowerCase()] || { ...w, type: "ranged" }; });
      op.melee.forEach(w => { seen[w.name.toLowerCase()] = seen[w.name.toLowerCase()] || { ...w, type: "melee" }; });
    }));
    return seen;
  }, []);
  const stopAll = () => { timers.current.forEach(clearTimeout); timers.current = []; setPlaying(null); };
  const play = (s) => {
    stopAll();
    const len = playSound(s.id, s.o, volume);
    setPlaying(s.n);
    timers.current.push(setTimeout(() => setPlaying(null), Math.max(300, len * 1000)));
  };
  const playAll = () => {
    stopAll();
    let at = 0;
    SOUND_LIST.forEach(s => {
      timers.current.push(setTimeout(() => { playSound(s.id, s.o, volume); setPlaying(s.n); }, at));
      at += 2200;
    });
    timers.current.push(setTimeout(() => setPlaying(null), at));
  };
  const typed = weapon.trim().toLowerCase();
  const found = typed && (weapons[typed] || Object.values(weapons).find(w => w.name.toLowerCase().startsWith(typed)));
  const heard = found && soundOfWeapon(found);
  const flags = (o) => ["power", "light", "krak"].map(k => !!(o && o[k])).join();
  const heardRow = heard && (SOUND_LIST.find(s => s.id === heard.id && flags(s.o) === flags(heard.o)) || SOUND_LIST.find(s => s.id === heard.id));
  const row = (s) => (
    <div key={s.n} data-sound={s.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid var(--raised)" }}>
      <span style={{ width: 28, flexShrink: 0, fontSize: 13, color: "var(--muted)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>#{s.n}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{s.name}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.eg}</div>
      </div>
      <button onClick={() => play(s)} aria-label={"Play " + s.name} style={{ ...bs(playing === s.n ? "#5A9C3A" : "var(--accent)"), padding: "8px 14px", fontSize: 12, flexShrink: 0 }}>{playing === s.n ? "Playing" : "Play"}</button>
    </div>
  );
  const groups = [...new Set(SOUND_LIST.map(s => s.group))];
  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label="Sound samples" style={{ position: "fixed", inset: 0, zIndex: 9300, background: "var(--bg)", overflowY: "auto", color: "var(--text)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>Sound samples</div>
          <button onClick={onClose} aria-label="Close" style={{ ...bs("var(--muted)"), padding: "8px 10px", display: "inline-flex" }}><Icon name="x" size={18} /></button>
        </div>
        <p style={{ ...mu, fontSize: 14, margin: "0 0 12px" }}>Attack sounds being tuned before they go into the game. Each one has a number, so you can say which ones need work. On an iPhone, turn the silent switch off to hear them.</p>
        <div style={{ ...cd, padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 100%", fontSize: 13, color: "var(--text2)" }}>
            Volume
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(Number(e.target.value))} aria-label="Volume" style={{ flex: 1, accentColor: "var(--accent)" }} />
          </label>
          <button onClick={playAll} style={{ ...bs("var(--accent)"), padding: "8px 14px", fontSize: 12, flex: 1 }}>Play all</button>
          <button onClick={stopAll} style={{ ...bs("var(--muted)"), padding: "8px 14px", fontSize: 12, flex: 1 }}>Stop</button>
        </div>
        <div style={{ ...cd, padding: 12, marginBottom: 12 }}>
          <div style={{ ...h3, marginBottom: 6 }}>Hear any weapon</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input list="ks-sound-weapons" value={weapon} onChange={e => setWeapon(e.target.value)} placeholder="Type a weapon, e.g. Plasma gun" aria-label="Weapon name" style={{ flex: 1, minWidth: 0, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--text)", padding: "10px 12px", fontSize: 16 }} />
            <button onClick={() => heard && playSound(heard.id, heard.o, volume)} disabled={!heard} style={{ ...bs(heard ? "var(--accent)" : "var(--muted)"), padding: "8px 14px", fontSize: 12, opacity: heard ? 1 : 0.5 }}>Play</button>
          </div>
          <datalist id="ks-sound-weapons">{Object.values(weapons).map(w => <option key={w.name + w.type} value={w.name} />)}</datalist>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, minHeight: 18 }}>
            {heard ? found.name + " uses #" + (heardRow ? heardRow.n + " " + heardRow.name : heard.id) : typed ? "No weapon in the app starts with that." : ""}
          </div>
        </div>
        {groups.map(g => (
          <div key={g} style={{ ...cd, padding: "10px 12px", marginBottom: 12 }}>
            <div style={{ ...h3, marginBottom: 2 }}>{g}</div>
            {SOUND_LIST.filter(s => s.group === g).map(row)}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
