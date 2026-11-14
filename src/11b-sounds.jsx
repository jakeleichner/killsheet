/* ═══ SOUNDS ═══ */
// Attack sounds (owner, Oct 29; sample page Nov 14). Every sound is made here with the browser's Web Audio engine: no
// sound files, nothing to license or download, and it works offline. One recipe per weapon kind that fxProfile sorts,
// plus the game's moments (hit, save, block...). Not in the game yet: the sample page (?sounds) is for tuning them.
// Owner, Nov 14, on the first round: "Warhammer is grim dark... make this cool as hell", not arcade. So every sound
// now plays through a bus (soundBus) that dirties it (distortion), gives it a sub-bass channel and puts it in a big
// ruined space (a long dark echo); recipes use noise for anything bright, never clean high tones or beeps.
// Each recipe draws into any audio context, so the self-test can render it silently (OfflineAudioContext) and check it.

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
// A burst of filtered noise (cracks, roars, hiss, metal). o: dur, type, f, f1 (filter sweeps to it), q, gain, a,
// chop (times a second the sound stutters, for engine teeth).
function sndBurst(ctx, dest, t, o) {
  const a = o.a || 0.003, src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = sndNoise(ctx); src.loop = true;
  fl.type = o.type || "lowpass"; fl.Q.value = o.q || 0.7;
  fl.frequency.setValueAtTime(o.f, t);
  if (o.f1) fl.frequency.exponentialRampToValueAtTime(o.f1, t + a + o.dur);
  sndEnv(g.gain, t, o.gain || 0.5, a, o.dur);
  let last = g;
  if (o.chop) {
    const am = ctx.createGain(), lfo = ctx.createOscillator(), depth = ctx.createGain();
    am.gain.value = 0.55; lfo.type = "square"; lfo.frequency.value = o.chop; depth.gain.value = 0.45;
    lfo.connect(depth); depth.connect(am.gain); g.connect(am); last = am;
    lfo.start(t); lfo.stop(t + a + o.dur + 0.05);
  }
  src.connect(fl); fl.connect(g); last.connect(dest);
  src.start(t, Math.random() * 2); src.stop(t + a + o.dur + 0.05);
}
// A tone that can slide in pitch (thumps, sub drops, drones). o: wave, f, f1, sweep (seconds to reach f1), dur, gain,
// a, lp, lp1 (a low-pass filter that can open or close over the sound).
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
// A tone chopped on and off quickly: the chainsword's two-stroke engine.
function sndChopped(ctx, dest, t, o) {
  const osc = ctx.createOscillator(), fl = ctx.createBiquadFilter(), am = ctx.createGain(), lfo = ctx.createOscillator(), depth = ctx.createGain(), g = ctx.createGain();
  osc.type = o.wave || "sawtooth";
  osc.frequency.setValueAtTime(o.f, t);
  if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + (o.sweep || o.dur));
  fl.type = "lowpass"; fl.frequency.value = o.lp || 1400;
  am.gain.value = 0.5; lfo.type = "square"; lfo.frequency.setValueAtTime(o.rate || 36, t); depth.gain.value = 0.45;
  if (o.rate1) lfo.frequency.exponentialRampToValueAtTime(o.rate1, t + (o.sweep || o.dur));
  lfo.connect(depth); depth.connect(am.gain);
  sndEnv(g.gain, t, o.gain || 0.4, o.a || 0.04, o.dur);
  osc.connect(fl); fl.connect(am); am.connect(g); g.connect(dest);
  osc.start(t); lfo.start(t); osc.stop(t + o.dur + 0.15); lfo.stop(t + o.dur + 0.15);
}
const sndVary = () => 0.93 + Math.random() * 0.14; // a little different every time, so repeats don't sound robotic
const sndRand = (lo, hi) => lo + Math.random() * (hi - lo);

// The bus every sound plays through. Layers go to b.main (dirtied by distortion, which also adds overtones a phone
// speaker can play, so the bass comes through as weight) or b.sub (clean deep bass). Then a long, dark echo, like
// firing in a ruined hab-block. SOUND_FX sets each sound's dirt (drive), echo level (verb) and echo length (size).
const SOUND_FX = {
  bolt: { drive: 4, verb: 0.5, size: 2.2 }, auto: { drive: 5, verb: 0.45, size: 2 }, slug: { drive: 4, verb: 0.5, size: 2.2 },
  shotgun: { drive: 4, verb: 0.45, size: 2 }, sniper: { drive: 3, verb: 0.6, size: 3 }, las: { drive: 6, verb: 0.45, size: 1.8 },
  plasma: { drive: 5, verb: 0.5, size: 2.4 }, melta: { drive: 5, verb: 0.45, size: 2 }, flame: { drive: 4, verb: 0.4, size: 2 },
  grenade: { drive: 4, verb: 0.55, size: 3 }, blast: { drive: 4, verb: 0.6, size: 3.2 }, electric: { drive: 6, verb: 0.45, size: 2 },
  psychic: { drive: 3, verb: 0.7, size: 3.5 }, blade: { drive: 4, verb: 0.35, size: 1.6 }, chain: { drive: 7, verb: 0.35, size: 1.6 },
  heavy: { drive: 5, verb: 0.4, size: 2 }, hit: { drive: 4, verb: 0.35, size: 1.5 }, crit: { drive: 5, verb: 0.5, size: 2.2 },
  save: { drive: 2, verb: 0.4, size: 1.6 }, block: { drive: 3, verb: 0.45, size: 1.8 }, hot: { drive: 4, verb: 0.4, size: 1.8 },
  down: { drive: 4, verb: 0.5, size: 2.5 }, versus: { drive: 3, verb: 0.55, size: 3 },
};
function sndCurve(drive) { // soft clipping: loud parts get rounded and gritty instead of cracking
  const n = 2048, c = new Float32Array(n), k = Math.tanh(drive);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(drive * x) / k; }
  return c;
}
// The echo: dark noise that fades over secs, brighter at first and duller as it dies (like a big stone space), with a
// few early slaps off nearby walls. Made once per length and kept.
function sndImpulse(ctx, secs) {
  const key = "__ksVerb" + secs;
  if (ctx[key]) return ctx[key];
  const rate = ctx.sampleRate, len = Math.floor(rate * secs), buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const p = i / len, k = 0.45 - 0.4 * p;
      lp += k * ((Math.random() * 2 - 1) - lp);
      d[i] = lp * Math.pow(1 - p, 2.5) * Math.min(1, i / (rate * 0.012));
    }
    [0.045, 0.09, 0.15, 0.23].forEach((s, j) => { const i = Math.floor(rate * (s + c * 0.011)); if (i < len) d[i] += 0.5 / (j + 1); });
  }
  ctx[key] = buf;
  return buf;
}
function soundBus(ctx, out, id, o) {
  const fx = SOUND_FX[id] || { drive: 3, verb: 0.4, size: 2 };
  const main = ctx.createGain(), sub = ctx.createGain(), shaper = ctx.createWaveShaper(), post = ctx.createGain(), subLevel = ctx.createGain(), send = ctx.createGain(), verb = ctx.createConvolver();
  shaper.curve = sndCurve(fx.drive); shaper.oversample = "4x";
  post.gain.value = subLevel.gain.value = soundTrim(id, o); // after the distortion, so the level doesn't change the grit
  send.gain.value = fx.verb;
  verb.buffer = sndImpulse(ctx, fx.size);
  main.connect(shaper); shaper.connect(post); post.connect(out);
  sub.connect(subLevel); subLevel.connect(out);
  post.connect(send); send.connect(verb); verb.connect(out);
  return { main, sub, tail: fx.size };
}

// Pieces several sounds share. b is the bus; s scales how big.
function sndClunk(ctx, b, t, s) { // a heavy mechanical action
  sndBurst(ctx, b.main, t, { type: "bandpass", f: 650, q: 4, dur: 0.05, gain: 0.6 * s });
  sndTone(ctx, b.main, t, { wave: "square", f: 140, dur: 0.04, gain: 0.25 * s, lp: 700 });
}
function sndGun(ctx, b, t, s) { // a deep gun report: crack, body and a bass hit; the bus adds the echo
  const v = sndVary();
  sndBurst(ctx, b.main, t, { type: "bandpass", f: 1800 * v, q: 0.9, dur: 0.03, gain: 1 * s });
  sndBurst(ctx, b.main, t, { type: "lowpass", f: 1300 * v, f1: 180, dur: 0.28, gain: 0.9 * s });
  sndTone(ctx, b.main, t, { wave: "triangle", f: 95 * v, f1: 42, dur: 0.22, gain: 0.6 * s });
  sndTone(ctx, b.sub, t, { f: 110 * v, f1: 38, dur: 0.4, gain: 1 * s });
}
function sndDebris(ctx, b, t, n, span, s) { // bits falling and rattling after a blast or a fall
  for (let i = 0; i < n; i++) {
    const k = Math.pow(Math.random(), 1.6);
    sndBurst(ctx, b.main, t + k * span, { type: "bandpass", f: sndRand(900, 3500), q: sndRand(2, 6), dur: sndRand(0.02, 0.07), gain: (0.06 + 0.12 * (1 - k)) * s });
  }
}
function sndCrackle(ctx, b, t, n, span, s) { // fire, sparks, power fields
  for (let i = 0; i < n; i++) sndBurst(ctx, b.main, t + Math.random() * span, { type: "highpass", f: sndRand(2500, 5000), dur: sndRand(0.008, 0.025), gain: sndRand(0.12, 0.3) * s });
}
function sndBoom(ctx, b, t, s, krak) { // an explosion: crack, deep boom, bass drop, roar, debris
  sndBurst(ctx, b.main, t, { type: "highpass", f: 1500, dur: 0.05, gain: 0.8 * s });
  sndBurst(ctx, b.main, t, { type: "lowpass", f: 2000, f1: 150, dur: krak ? 0.7 : 1.6, gain: 1 * s });
  sndBurst(ctx, b.main, t, { type: "lowpass", f: 400, f1: 60, a: 0.02, dur: krak ? 1.2 : 2.2, gain: 0.9 * s });
  sndTone(ctx, b.sub, t, { f: 70 * sndVary(), f1: 25, dur: 1.5, gain: 1 * s });
  sndTone(ctx, b.sub, t, { f: 40, a: 0.1, dur: 2, gain: 0.4 * s });
  sndDebris(ctx, b, t + 0.25, krak ? 12 : 25, krak ? 0.9 : 1.6, s);
  if (krak) sndBurst(ctx, b.main, t, { type: "bandpass", f: 2500, f1: 900, q: 6, a: 0.01, dur: 0.35, gain: 0.35 * s }); // armor tearing
}
function sndPowerField(ctx, b, t, len) { // a power weapon's deep crackling hum
  sndTone(ctx, b.main, t, { wave: "sawtooth", f: 50, a: 0.15, dur: len, gain: 0.25, lp: 600 });
  sndTone(ctx, b.main, t, { wave: "sawtooth", f: 53, a: 0.15, dur: len, gain: 0.2, lp: 600 });
  sndCrackle(ctx, b, t, 6, len, 1);
}
function sndDischarge(ctx, b, t) { // the snap when a power field strikes
  sndBurst(ctx, b.main, t, { type: "highpass", f: 1500, dur: 0.04, gain: 0.9 });
  sndBurst(ctx, b.main, t, { type: "bandpass", f: 3000, q: 2, a: 0.01, dur: 0.3, gain: 0.3 });
}
function sndImpact(ctx, b, t, s) { // a meaty hit
  sndTone(ctx, b.main, t, { wave: "triangle", f: 110, f1: 45, dur: 0.2, gain: 0.9 * s });
  sndTone(ctx, b.sub, t, { f: 70, f1: 30, dur: 0.3, gain: 0.9 * s });
  sndBurst(ctx, b.main, t, { type: "lowpass", f: 1800, f1: 250, dur: 0.15, gain: 0.8 * s });
}
function sndDrum(ctx, b, t, s) { // a war drum
  sndTone(ctx, b.sub, t, { f: 75, f1: 32, dur: 0.5, gain: 1 * s });
  sndTone(ctx, b.main, t, { wave: "triangle", f: 110, f1: 45, dur: 0.3, gain: 0.7 * s });
  sndBurst(ctx, b.main, t, { type: "lowpass", f: 700, f1: 100, dur: 0.3, gain: 0.6 * s });
}

// The recipes. Each draws one sound starting at t into the bus b and returns how long it lasts before its echo
// (seconds). o: { shots, power, light, krak }.
const SOUND_RECIPES = {
  bolt(ctx, b, t) {
    sndClunk(ctx, b, t, 1);
    sndGun(ctx, b, t, 1);
    sndBurst(ctx, b.main, t + 0.03, { type: "bandpass", f: 3000, f1: 1500, q: 1, a: 0.02, dur: 0.25, gain: 0.25 }); // the bolt's rocket
    const k = t + 0.28; // the bolt detonating
    sndBurst(ctx, b.main, k, { type: "highpass", f: 1200, dur: 0.04, gain: 0.7 });
    sndBurst(ctx, b.main, k, { type: "lowpass", f: 1800, f1: 150, dur: 0.5, gain: 0.9 });
    sndTone(ctx, b.main, k, { wave: "triangle", f: 100, f1: 45, dur: 0.3, gain: 0.5 });
    sndTone(ctx, b.sub, k, { f: 80, f1: 30, dur: 0.6, gain: 1 });
    return 0.9;
  },
  auto(ctx, b, t, o) {
    const n = Math.max(2, Math.min(6, (o && o.shots) || 4)), gap = 0.085;
    for (let i = 0; i < n; i++) sndGun(ctx, b, t + i * gap + Math.random() * 0.012, 0.8);
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 300, a: 0.02, dur: n * gap + 0.3, gain: 0.4 }); // the burst's rumble
    return n * gap + 0.4;
  },
  slug(ctx, b, t) { sndGun(ctx, b, t, 1); return 0.5; },
  shotgun(ctx, b, t) {
    sndGun(ctx, b, t, 1.1);
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 900, f1: 100, dur: 0.6, gain: 1 });
    sndTone(ctx, b.sub, t, { f: 60, f1: 25, dur: 0.7, gain: 1 });
    [0.55, 0.72].forEach(k => sndClunk(ctx, b, t + k, 1.1)); // racking the next shell: back, then forward
    sndBurst(ctx, b.main, t + 0.6, { type: "bandpass", f: 2000, q: 2, a: 0.02, dur: 0.1, gain: 0.15 });
    return 0.9;
  },
  sniper(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "highpass", f: 2000, dur: 0.02, gain: 1 }); // the round breaking the sound barrier
    sndGun(ctx, b, t + 0.01, 0.9);
    sndBurst(ctx, b.main, t + 0.12, { type: "lowpass", f: 500, f1: 120, a: 0.15, dur: 1.8, gain: 0.5 }); // rolling across the battlefield
    sndTone(ctx, b.sub, t + 0.1, { f: 45, a: 0.2, dur: 1.6, gain: 0.4 });
    return 2;
  },
  las(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "highpass", f: 1500, dur: 0.02, gain: 1 });
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 2500 * sndVary(), f1: 900, q: 1.5, dur: 0.12, gain: 0.8 }); // the crack
    sndBurst(ctx, b.main, t + 0.02, { type: "highpass", f: 5000, a: 0.01, dur: 0.35, gain: 0.2 }); // ozone sizzle
    sndTone(ctx, b.main, t, { wave: "triangle", f: 120, f1: 50, dur: 0.15, gain: 0.6 });
    sndTone(ctx, b.sub, t, { f: 90, f1: 40, dur: 0.2, gain: 0.7 });
    return 0.5;
  },
  plasma(ctx, b, t) {
    sndTone(ctx, b.main, t, { wave: "sawtooth", f: 60, f1: 220, sweep: 0.45, a: 0.4, dur: 0.06, gain: 0.25, lp: 500, lp1: 2500 }); // charging
    sndTone(ctx, b.sub, t, { f: 40, f1: 80, sweep: 0.45, a: 0.4, dur: 0.1, gain: 0.5 });
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 400, f1: 3000, q: 3, a: 0.4, dur: 0.05, gain: 0.25 });
    const k = t + 0.48; // the discharge
    sndBurst(ctx, b.main, k, { type: "lowpass", f: 3000, f1: 150, dur: 0.9, gain: 1 });
    sndTone(ctx, b.main, k, { wave: "triangle", f: 160, f1: 40, dur: 0.6, gain: 0.7 });
    sndTone(ctx, b.sub, k, { f: 70, f1: 25, dur: 0.9, gain: 1 });
    sndBurst(ctx, b.main, k + 0.07, { type: "highpass", f: 4000, a: 0.05, dur: 0.9, gain: 0.18 }); // sizzle
    return 1.5;
  },
  melta(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 200, f1: 1200, a: 0.04, dur: 0.3, gain: 1 }); // the whump
    sndBurst(ctx, b.main, t + 0.05, { type: "bandpass", f: 500, f1: 1800, q: 0.8, a: 0.1, dur: 0.9, gain: 0.7 }); // the roar
    sndTone(ctx, b.sub, t, { f: 55, f1: 30, a: 0.03, dur: 1.2, gain: 1 });
    sndBurst(ctx, b.main, t + 0.3, { type: "highpass", f: 4500, a: 0.2, dur: 1, gain: 0.25 }); // metal melting
    sndCrackle(ctx, b, t + 0.3, 8, 0.9, 0.8);
    return 1.5;
  },
  flame(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "highpass", f: 3000, a: 0.02, dur: 0.2, gain: 0.3 }); // gas
    sndBurst(ctx, b.main, t + 0.05, { type: "lowpass", f: 300, f1: 1400, a: 0.15, dur: 1.3, gain: 1 }); // the roar
    sndBurst(ctx, b.main, t + 0.1, { type: "bandpass", f: 700, q: 0.7, a: 0.2, dur: 1.2, gain: 0.5 });
    sndTone(ctx, b.sub, t, { f: 45, a: 0.2, dur: 1.2, gain: 0.6 });
    sndCrackle(ctx, b, t + 0.15, 18, 1.3, 1);
    return 1.6;
  },
  grenade(ctx, b, t, o) {
    sndTone(ctx, b.main, t, { wave: "triangle", f: 90, f1: 60, dur: 0.08, gain: 0.5 }); // lands with a thud
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 600, dur: 0.05, gain: 0.4 });
    sndBoom(ctx, b, t + 0.35, 1, o && o.krak);
    return 2.2;
  },
  blast(ctx, b, t) {
    sndTone(ctx, b.main, t, { wave: "triangle", f: 80, f1: 40, dur: 0.15, gain: 0.8 }); // launch
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 1500, dur: 0.1, gain: 0.8 });
    sndBurst(ctx, b.main, t + 0.02, { type: "bandpass", f: 800, f1: 1600, q: 0.8, a: 0.03, dur: 0.4, gain: 0.6 }); // the rocket
    sndBoom(ctx, b, t + 0.45, 1.2);
    return 2.4;
  },
  electric(ctx, b, t) {
    sndTone(ctx, b.main, t, { wave: "sawtooth", f: 55, a: 0.05, dur: 0.7, gain: 0.35, lp: 800 }); // the air being torn
    sndTone(ctx, b.main, t, { wave: "sawtooth", f: 58, a: 0.05, dur: 0.7, gain: 0.3, lp: 800 });
    sndTone(ctx, b.sub, t, { f: 45, a: 0.05, dur: 0.7, gain: 0.6 });
    for (let i = 0; i < 8; i++) sndBurst(ctx, b.main, t + Math.random() * 0.6, { type: "bandpass", f: sndRand(1500, 3500), q: 2, dur: sndRand(0.03, 0.08), gain: 0.5 }); // arcs
    sndBurst(ctx, b.main, t + 0.1, { type: "bandpass", f: 300, f1: 2500, q: 1, a: 0.5, dur: 0.1, gain: 0.5 });
    const k = t + 0.62;
    sndBurst(ctx, b.main, k, { type: "highpass", f: 1200, dur: 0.05, gain: 0.9 });
    sndTone(ctx, b.sub, k, { f: 90, f1: 30, dur: 0.5, gain: 0.8 });
    return 1.2;
  },
  psychic(ctx, b, t) {
    [[73.4, 0.1], [77.8, 0.09], [110, 0.08], [116.5, 0.07]].forEach(([f, g]) => sndTone(ctx, b.main, t, { wave: "sawtooth", f, a: 0.6, dur: 0.5, gain: g, lp: 900 })); // a dissonant choir
    for (let i = 0; i < 6; i++) sndBurst(ctx, b.main, t + Math.random() * 0.9, { type: "bandpass", f: sndRand(1500, 3500), q: 8, a: 0.05, dur: 0.15, gain: 0.15 }); // whispers
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 200, f1: 4000, a: 1, dur: 0.03, gain: 0.6 }); // rushing in
    const k = t + 1.05; // the warp tearing open
    sndBurst(ctx, b.main, k, { type: "highpass", f: 1500, dur: 0.05, gain: 0.8 });
    sndBurst(ctx, b.main, k, { type: "lowpass", f: 1200, f1: 80, dur: 1, gain: 0.9 });
    sndTone(ctx, b.sub, k, { f: 70, f1: 25, dur: 1.2, gain: 1 });
    return 2.2;
  },
  blade(ctx, b, t, o) {
    const power = o && o.power, k = t + 0.25;
    if (power) sndPowerField(ctx, b, t, 0.45);
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 400, f1: 1800, q: 1.2, a: 0.1, dur: 0.15, gain: 0.7 }); // the swing
    sndBurst(ctx, b.main, k, { type: "lowpass", f: 2500, f1: 300, dur: 0.12, gain: 1 }); // the hit
    sndTone(ctx, b.main, k, { wave: "triangle", f: 140, f1: 60, dur: 0.15, gain: 0.6 });
    sndTone(ctx, b.sub, k, { f: 80, f1: 40, dur: 0.2, gain: 0.7 });
    for (let i = 0; i < 4; i++) sndBurst(ctx, b.main, k + Math.random() * 0.06, { type: "bandpass", f: sndRand(800, 1600), q: 3, dur: 0.03, gain: 0.4 }); // crunch
    if (power) sndDischarge(ctx, b, k);
    return 0.7;
  },
  chain(ctx, b, t, o) {
    sndChopped(ctx, b.main, t, { f: 45, f1: 70, sweep: 0.35, rate: 22, rate1: 38, dur: 1.2, gain: 0.6, lp: 1200 }); // the engine revving
    sndChopped(ctx, b.main, t, { f: 90, f1: 140, sweep: 0.35, rate: 44, rate1: 76, dur: 1.2, gain: 0.35, lp: 1800 });
    sndTone(ctx, b.sub, t, { f: 45, f1: 70, sweep: 0.35, a: 0.05, dur: 1.2, gain: 0.5 });
    const k = t + 0.35; // the teeth biting
    sndBurst(ctx, b.main, k, { type: "bandpass", f: 1800, q: 1.2, a: 0.05, dur: 0.7, gain: 0.6, chop: 60 });
    sndBurst(ctx, b.main, k, { type: "lowpass", f: 1500, f1: 200, dur: 0.2, gain: 0.8 });
    sndTone(ctx, b.sub, k, { f: 70, f1: 35, dur: 0.3, gain: 0.7 });
    if (o && o.power) { sndPowerField(ctx, b, t, 0.9); sndDischarge(ctx, b, k); }
    return 1.4;
  },
  heavy(ctx, b, t, o) {
    if (o && o.light) { // a punch
      sndBurst(ctx, b.main, t, { type: "lowpass", f: 200, f1: 600, a: 0.08, dur: 0.1, gain: 0.5 });
      sndImpact(ctx, b, t + 0.15, 1);
      return 0.5;
    }
    const k = t + 0.32;
    if (o && o.power) sndPowerField(ctx, b, t, 0.5);
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 200, f1: 700, a: 0.18, dur: 0.15, gain: 0.8 }); // the swing
    sndTone(ctx, b.main, k, { wave: "triangle", f: 100, f1: 35, dur: 0.4, gain: 1 });
    sndTone(ctx, b.sub, k, { f: 65, f1: 25, dur: 0.6, gain: 1 });
    sndBurst(ctx, b.main, k, { type: "lowpass", f: 2000, f1: 150, dur: 0.35, gain: 1 }); // bone and armor
    for (let i = 0; i < 6; i++) sndBurst(ctx, b.main, k + Math.random() * 0.2, { type: "bandpass", f: sndRand(600, 1400), q: 4, dur: sndRand(0.03, 0.06), gain: 0.3 }); // armor crumpling
    if (o && o.power) { // a thunderclap
      sndBurst(ctx, b.main, k, { type: "highpass", f: 800, dur: 0.05, gain: 1 });
      sndBurst(ctx, b.main, k, { type: "lowpass", f: 3000, f1: 200, dur: 0.8, gain: 0.7 });
      sndCrackle(ctx, b, k + 0.1, 10, 0.8, 1);
    }
    return 1.2;
  },
  // The game's moments.
  hit(ctx, b, t) {
    sndImpact(ctx, b, t, 1);
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 450, q: 8, dur: 0.25, gain: 0.25 }); // a low armor clang
    return 0.4;
  },
  crit(ctx, b, t) {
    sndImpact(ctx, b, t, 1.1);
    sndTone(ctx, b.sub, t, { f: 90, f1: 22, dur: 0.9, gain: 1 }); // bass drop
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 2500, f1: 100, dur: 0.5, gain: 1 });
    sndBurst(ctx, b.main, t + 0.02, { type: "bandpass", f: 1800, f1: 700, q: 5, a: 0.01, dur: 0.4, gain: 0.35 }); // armor tearing open
    return 1;
  },
  save(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 600, q: 12, dur: 0.35, gain: 0.5 }); // ceramite
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 950, q: 12, dur: 0.3, gain: 0.3 });
    sndBurst(ctx, b.main, t, { type: "highpass", f: 4000, dur: 0.04, gain: 0.3 });
    sndCrackle(ctx, b, t, 6, 0.15, 0.5); // sparks
    sndBurst(ctx, b.main, t + 0.04, { type: "bandpass", f: 1600, f1: 700, q: 10, a: 0.02, dur: 0.3, gain: 0.25 }); // ricochet
    return 0.5;
  },
  block(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "highpass", f: 1500, dur: 0.03, gain: 0.9 });
    [[700, 0.6, 0.5], [1100, 0.5, 0.35], [1650, 0.4, 0.2]].forEach(([f, dur, g]) => sndBurst(ctx, b.main, t, { type: "bandpass", f: f * sndVary(), q: 15, dur, gain: g })); // the clash
    sndBurst(ctx, b.main, t + 0.05, { type: "bandpass", f: 2200, q: 2, a: 0.03, dur: 0.25, gain: 0.3 }); // grinding
    sndTone(ctx, b.main, t, { wave: "triangle", f: 100, f1: 50, dur: 0.1, gain: 0.5 });
    return 0.7;
  },
  hot(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "highpass", f: 1200, f1: 3500, a: 0.04, dur: 1, gain: 0.6 }); // venting
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 400, a: 0.05, dur: 0.8, gain: 0.5 });
    sndTone(ctx, b.main, t, { wave: "sawtooth", f: 70, f1: 55, a: 0.1, dur: 0.8, gain: 0.2, lp: 500 }); // metal groaning
    sndBurst(ctx, b.main, t, { type: "bandpass", f: 300, q: 10, a: 0.1, dur: 0.8, gain: 0.3 });
    sndTone(ctx, b.sub, t, { f: 45, a: 0.05, dur: 0.8, gain: 0.5 });
    sndCrackle(ctx, b, t + 0.1, 10, 0.8, 1);
    return 1.1;
  },
  down(ctx, b, t) {
    sndBurst(ctx, b.main, t, { type: "lowpass", f: 900, f1: 150, dur: 0.25, gain: 1 }); // the body hitting the ground
    sndTone(ctx, b.main, t, { wave: "triangle", f: 90, f1: 40, dur: 0.25, gain: 0.8 });
    sndTone(ctx, b.sub, t, { f: 60, f1: 25, dur: 0.8, gain: 1 });
    sndDebris(ctx, b, t + 0.08, 8, 0.5, 1.5); // armor clattering
    sndTone(ctx, b.sub, t + 0.3, { f: 45, f1: 22, a: 0.02, dur: 1.4, gain: 0.8 }); // the closing boom
    sndBurst(ctx, b.main, t + 0.3, { type: "lowpass", f: 300, f1: 60, a: 0.05, dur: 1.2, gain: 0.5 });
    return 1.7;
  },
  versus(ctx, b, t) {
    [[36.7, 0.2], [55, 0.2], [73.4, 0.15]].forEach(([f, g]) => sndTone(ctx, b.main, t, { wave: "sawtooth", f, a: 0.5, dur: 1.9, gain: g, lp: 150, lp1: 1200 })); // the deep drone
    [73.4, 110].forEach(f => sndTone(ctx, b.main, t + 0.3, { wave: "sawtooth", f, a: 0.6, dur: 1.2, gain: 0.12, lp: 300, lp1: 900 })); // a war horn swelling
    [[0.3, 0.6], [0.7, 0.7], [1.0, 0.8], [1.12, 0.7], [1.45, 1.3]].forEach(([k, s]) => sndDrum(ctx, b, t + k, s)); // boom, boom, ba-BOOM
    sndBurst(ctx, b.main, t + 1.45, { type: "highpass", f: 3000, a: 0.01, dur: 1.2, gain: 0.2 }); // the crash on the last hit
    return 2.4;
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
// How loud each sound plays, so they come out about even (set from the self-test's loudness readings). Keyed by
// recipe and variant.
const SOUND_TRIM = {
  bolt: 0.41, auto: 0.53, slug: 0.56, shotgun: 0.4, sniper: 0.69, las: 0.45, plasma: 0.45, melta: 0.58, flame: 0.75,
  grenade: 0.45, "grenade:krak": 0.45, blast: 0.41, electric: 0.59, psychic: 0.56,
  blade: 0.53, "blade:power": 0.52, chain: 0.54, "chain:power": 0.5, heavy: 0.34, "heavy:power": 0.35, "heavy:light": 0.39,
  hit: 0.36, crit: 0.35, save: 1.9, block: 0.82, hot: 0.58, down: 0.32, versus: 0.34,
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
// Play one sound now (or after delay seconds) at volume 0-1. Returns how long it lasts with its echo, or 0 if sound
// can't play here.
function playSound(id, o, volume, delay) {
  const out = soundOutput(), recipe = SOUND_RECIPES[id];
  if (!out || !recipe) return 0;
  out.vol.gain.setValueAtTime(volume == null ? 0.7 : volume, out.ctx.currentTime);
  try { const b = soundBus(out.ctx, out.vol, id, o); return recipe(out.ctx, b, out.ctx.currentTime + 0.02 + (delay || 0), o || {}) + b.tail; } catch (e) { return 0; }
}
const SOUND_MAX_PEAK = 1.5; // a sample this loud is a brief spike the limiter (soundOutput) catches; louder would crackle
// For the self-test: draws a sound silently and measures it: its loudest sample (peak), how loud it is over the
// loudest 10 ms (loud, closer to what the ear hears), and whether any samples are broken.
async function measureSound(id, o) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) return null;
  const ctx = new OAC(1, 44100 * 6, 44100);
  const b = soundBus(ctx, ctx.destination, id, o);
  const len = SOUND_RECIPES[id](ctx, b, 0.01, o || {});
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
  const playAll = () => { // one after another, each starting as the last one's echo fades
    stopAll();
    const next = (i) => {
      if (i >= SOUND_LIST.length) { setPlaying(null); return; }
      const s = SOUND_LIST[i], len = playSound(s.id, s.o, volume);
      setPlaying(s.n);
      timers.current.push(setTimeout(() => next(i + 1), Math.max(1500, len * 750)));
    };
    next(0);
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
