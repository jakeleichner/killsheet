# Cut, deepen, layer and level audition clips from the Sonniss libraries.
# Usage: python3 -I cut.py <sonniss dir> <spec.py> <out dir> [only-ids]
# Pure Python (no numpy): afconvert decodes to 16-bit mono WAV, this script
# finds onsets, trims, resamples, layers, fades, levels, then afconvert makes AAC.
import sys, os, subprocess, wave, array, math, json, runpy, tempfile

SR = 44100
SRC, SPEC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ONLY = set(sys.argv[4].split(",")) if len(sys.argv) > 4 else None
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp(prefix="sndcut")

index = {}
for root, _, files in os.walk(SRC):
    for f in files:
        if f.lower().endswith((".wav", ".aif")):
            index.setdefault(f, os.path.join(root, f))

def find(name):
    hits = [p for f, p in index.items() if name.lower() in f.lower()]
    if not hits: raise SystemExit("no file matches " + name)
    return sorted(hits, key=len)[0]

cache = {}
def load(name):
    p = find(name)
    if p in cache: return cache[p]
    w = os.path.join(TMP, "%d.wav" % len(cache))
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@%d" % SR, "-c", "1", p, w], check=True)
    with wave.open(w) as r:
        a = array.array("h"); a.frombytes(r.readframes(r.getnframes()))
    x = [v / 32768.0 for v in a]
    cache[p] = (x, os.path.basename(p))
    return cache[p]

FR = int(SR * 0.005)
def frames(x):
    out = []
    for i in range(0, len(x) - FR, FR):
        s = 0.0
        for v in x[i:i + FR]: s += v * v
        out.append(math.sqrt(s / FR))
    return out

def onsets(x, thr=0.2, gap=0.12):
    f = frames(x); m = max(f) or 1; t = thr * m; res = []; below = True
    for i, v in enumerate(f):
        if below and v >= t and (not res or (i * FR - res[-1]) > gap * SR):
            res.append(max(0, i * FR - FR)); below = False
        elif v < t * 0.5: below = True
    return res

def resample(x, rate):  # rate < 1: deeper and longer
    if rate == 1: return x
    n = int(len(x) / rate); out = [0.0] * n
    for i in range(n):
        p = i * rate; j = int(p); fr = p - j
        a = x[j] if j < len(x) else 0.0; b = x[j + 1] if j + 1 < len(x) else 0.0
        out[i] = a + (b - a) * fr
    return out

def lowpass(x, hz):
    if not hz: return x
    k = math.exp(-2 * math.pi * hz / SR); y = 0.0; out = []
    for v in x: y = (1 - k) * v + k * y; out.append(y)
    return out

def clip(layer):
    x, fname = load(layer["file"])
    at = layer.get("at", ("on", 0))
    if isinstance(at, tuple):
        on = onsets(x, layer.get("thr", 0.2)); k = min(at[1], len(on) - 1)
        start = on[k] if on else 0
    else:
        start = int(at * SR)
    rate = layer.get("rate", 1.0)
    need = int(layer.get("len", 1.5) * SR * rate) + 2
    seg = x[start:start + need]
    seg = resample(seg, rate)
    seg = lowpass(seg, layer.get("lp"))
    g = layer.get("gain", 1.0)
    return [v * g for v in seg], fname, start / SR

def mix(layers, total):
    n = int(total * SR); out = [0.0] * n; used = []
    for L in layers:
        seg, fname, t0 = clip(L); off = int(L.get("off", 0) * SR)
        for i, v in enumerate(seg):
            if off + i < n: out[off + i] += v
        used.append({"file": fname, "from": round(t0, 3), "rate": L.get("rate", 1.0)})
    return out, used

def finish(x, fade):
    n = len(x); fi = int(0.002 * SR)
    for i in range(min(fi, n)): x[i] *= i / fi
    fs = int(n * (1 - fade))
    for i in range(fs, n):
        t = (i - fs) / max(1, n - fs); x[i] *= (1 - t) ** 2
    # level: loudest 50 ms window to a common target, peak kept under 0.95
    w = int(0.05 * SR); best = 0.0; s = 0.0; sq = [v * v for v in x]
    for i, v in enumerate(sq):
        s += v
        if i >= w: s -= sq[i - w]
        best = max(best, s)
    loud = math.sqrt(best / w) or 1e-9; peak = max(abs(v) for v in x) or 1e-9
    g = min(0.22 / loud, 0.95 / peak)
    return [v * g for v in x], round(20 * math.log10(peak * g), 1)

def write(path, x):
    a = array.array("h", [max(-32767, min(32767, int(v * 32767))) for v in x])
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())

spec = runpy.run_path(SPEC)["SOUNDS"]
old = {}
try:
    for r in json.load(open(os.path.join(OUT, "list.json"))):
        for o in r["opts"]: old[o["key"]] = o
except Exception: pass
manifest = []
for s in spec:
    row = {"n": s["n"], "name": s["name"], "eg": s["eg"], "group": s["group"], "opts": []}
    for letter, opt in zip("ABCD", s["opts"]):
        key = "%d%s" % (s["n"], letter)
        if ONLY and key not in ONLY and str(s["n"]) not in ONLY:
            if key in old: row["opts"].append(dict(old[key], note=opt.get("note", "")))
            continue
        x, used = mix(opt["layers"], opt["len"])
        x, pk = finish(x, opt.get("fade", 0.4))
        wav = os.path.join(TMP, key + ".wav"); write(wav, x)
        m4a = os.path.join(OUT, key + ".m4a")
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "96000", wav, m4a], check=True)
        row["opts"].append({"key": key, "note": opt.get("note", ""), "src": used, "len": opt["len"]})
        print("%-4s %4.1fs  peak %5.1f dB  %s" % (key, opt["len"], pk, " + ".join("%s @%.2fs%s" % (u["file"][:48], u["from"], "" if u["rate"] == 1 else " x%.2f" % u["rate"]) for u in used)), flush=True)
    manifest.append(row)
json.dump(manifest, open(os.path.join(OUT, "list.json"), "w"), indent=1)
