"""Redraw the mission map pages as themed diagrams: maps/<pack>-pNN.svg next to the original page image.

Usage: python3 -I tools/missions/draw_maps.py <pdf_dir> <pypdf_lib_dir> [map id ...]

With no map ids it redraws every mission map the mission data names (not the map key pages).

How it works:
- The PDF's own drawing gives exact terrain outlines, walls, doors, vantage lines, killzone edges,
  markers and labels. Each is recoloured by what it is (see classify_shapes).
- Drop zones and territories are often baked into a picture of the board, so they come from the
  rendered page instead: sample the colours on a 0.1" grid, tidy, trace the outlines. When the PDF has
  zone rectangles of its own, those are used (exact) and only their colour is sampled.
- Pages with two boards (Tomb World, Shadowhunt's Descent killzone) become one drawing with both.

Needs macOS `sips` (renders pages) and pypdf. Takes about a minute and a half for all maps.
Prints any shapes it didn't recognise; those are drawn in their original colour so they still show.
"""
import glob
import math
import os
import struct
import subprocess
import sys
import tempfile
from collections import Counter, deque

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from render_maps import PDFS  # noqa: E402  pack id -> PDF filename pattern


def rgb(c):
    return tuple(c) if c else None


def fmt(v):
    return ("%.1f" % v).rstrip("0").rstrip(".")


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ═══ Reading the PDF's drawing ═══════════════════════════════════════════════════════════

def _mul(a, b):
    return [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2],
            a[2] * b[1] + a[3] * b[3], a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5]]


def _apply(m, x, y):
    return (m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5])


def _cmyk(c, m, y, k):
    return [round(255 * (1 - c) * (1 - k)), round(255 * (1 - m) * (1 - k)), round(255 * (1 - y) * (1 - k))]


def _colour(vals):
    if len(vals) == 4: return _cmyk(*vals)
    if len(vals) == 3: return [round(v * 255) for v in vals]
    if len(vals) == 1: return [round(vals[0] * 255)] * 3
    return None


def _walk(reader, stream, resources, ctm, out, depth=0):
    """Collect filled and stroked paths (in page points) with their colours, line widths and dashes.
    Curves are flattened into short straight pieces. Clipping is ignored."""
    from pypdf.generic import ContentStream, IndirectObject
    if depth > 8: return
    st = {"ctm": ctm, "fill": [0, 0, 0], "stroke": [0, 0, 0], "lw": 1.0, "dash": []}
    stack, path, cur = [], [], None
    xobjs = resources.get("/XObject") if resources else None
    for operands, op in ContentStream(stream, reader).operations:
        op = op.decode() if isinstance(op, bytes) else op
        num = [float(v) for v in operands if isinstance(v, (int, float)) or type(v).__name__ in ("FloatObject", "NumberObject")]
        if op == "q": stack.append(dict(st))
        elif op == "Q": st = stack.pop() if stack else st
        elif op == "cm": st["ctm"] = _mul(num, st["ctm"])
        elif op in ("rg", "g", "k", "sc", "scn"): st["fill"] = _colour(num) or st["fill"]
        elif op in ("RG", "G", "K", "SC", "SCN"): st["stroke"] = _colour(num) or st["stroke"]
        elif op == "w": st["lw"] = num[0]
        elif op == "d": st["dash"] = [float(v) for v in operands[0]] if operands else []
        elif op == "m":
            cur = [_apply(st["ctm"], num[0], num[1])]; path.append(cur)
        elif op == "l":
            if cur is None: cur = []; path.append(cur)
            cur.append(_apply(st["ctm"], num[0], num[1]))
        elif op in ("c", "v", "y"):
            if cur is None: cur = []; path.append(cur)
            p0 = cur[-1] if cur else _apply(st["ctm"], num[-2], num[-1])
            if op == "c": p1, p2, p3 = _apply(st["ctm"], num[0], num[1]), _apply(st["ctm"], num[2], num[3]), _apply(st["ctm"], num[4], num[5])
            elif op == "v": p1, p2, p3 = p0, _apply(st["ctm"], num[0], num[1]), _apply(st["ctm"], num[2], num[3])
            else: p1, p2, p3 = _apply(st["ctm"], num[0], num[1]), _apply(st["ctm"], num[2], num[3]), _apply(st["ctm"], num[2], num[3])
            for k in range(1, 7):
                t = k / 6; u = 1 - t
                cur.append((u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
                            u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]))
        elif op == "h":
            if cur: cur.append(cur[0])
        elif op == "re":
            x, y, w, h = num
            cur = [_apply(st["ctm"], x, y), _apply(st["ctm"], x + w, y), _apply(st["ctm"], x + w, y + h), _apply(st["ctm"], x, y + h), _apply(st["ctm"], x, y)]
            path.append(cur)
        elif op in ("f", "F", "f*", "B", "B*", "b", "b*", "S", "s"):
            scale = math.sqrt(abs(st["ctm"][0] * st["ctm"][3] - st["ctm"][1] * st["ctm"][2]))
            kind = "fill" if op in ("f", "F", "f*") else "stroke" if op in ("S", "s") else "both"
            for sp in path:
                if len(sp) >= 2:
                    out.append({"kind": kind, "pts": sp, "fill": st["fill"], "stroke": st["stroke"],
                                "lw": st["lw"] * scale, "dash": [d * scale for d in st["dash"]]})
            path, cur = [], None
        elif op == "n": path, cur = [], None
        elif op == "Do" and xobjs is not None:
            xo = xobjs.get(operands[0])
            if isinstance(xo, IndirectObject): xo = xo.get_object()
            if xo is None: continue
            if xo.get("/Subtype") == "/Form":
                m = [float(v) for v in xo.get("/Matrix", [1, 0, 0, 1, 0, 0])]
                _walk(reader, xo, xo.get("/Resources", resources), _mul(m, st["ctm"]), out, depth + 1)
            elif xo.get("/Subtype") == "/Image":
                out.append({"kind": "image", "pts": [_apply(st["ctm"], 0, 0), _apply(st["ctm"], 1, 1)]})


def read_page(pdf, pageno):
    from pypdf import PdfReader
    reader = PdfReader(pdf)
    page = reader.pages[pageno - 1]
    shapes, texts = [], []
    _walk(reader, page.get_contents(), page.get("/Resources"), [1, 0, 0, 1, 0, 0], shapes)

    def visit(text, cm, tm, font, size):
        t = text.strip()
        if t:
            m = _mul(tm, cm)
            texts.append({"t": t, "x": m[4], "y": m[5], "size": size * math.sqrt(abs(m[0] * m[3] - m[1] * m[2])),
                          "rot": math.degrees(math.atan2(m[1], m[0]))})
    page.extract_text(visitor_text=visit)
    return {"h": float(page.mediabox.height), "shapes": shapes, "texts": texts}


# ═══ The rendered page ═══════════════════════════════════════════════════════════════════

class PageImage:
    """The page rendered by sips at 2600px tall, read through a BMP for fast pixel lookups."""

    def __init__(self, pdf, pageno, tmp):
        import pypdf
        one, bmp = os.path.join(tmp, "page.pdf"), os.path.join(tmp, "page.bmp")
        w = pypdf.PdfWriter(); w.add_page(pypdf.PdfReader(pdf).pages[pageno - 1]); w.write(one)
        subprocess.run(["sips", "-s", "format", "bmp", "-Z", "2600", one, "--out", bmp], check=True, capture_output=True)
        data = open(bmp, "rb").read()
        self.off = struct.unpack_from("<I", data, 10)[0]
        w, h = struct.unpack_from("<ii", data, 18)
        self.bpp = struct.unpack_from("<H", data, 28)[0] // 8
        self.row = (w * self.bpp + 3) & ~3
        self.bottom_up = h > 0
        self.w, self.h, self.data = w, abs(h), data

    def px(self, x, y):
        x = 0 if x < 0 else self.w - 1 if x >= self.w else int(x)
        y = 0 if y < 0 else self.h - 1 if y >= self.h else int(y)
        i = self.off + ((self.h - 1 - y) if self.bottom_up else y) * self.row + x * self.bpp
        return (self.data[i + 2], self.data[i + 1], self.data[i])


def nearest(palette):
    """Colour -> class of the closest palette colour (cached)."""
    cache = {}

    def f(c):
        k = (c[0] >> 2, c[1] >> 2, c[2] >> 2)
        if k not in cache:
            cache[k] = min(palette, key=lambda p: (p[0][0] - c[0]) ** 2 + (p[0][1] - c[1]) ** 2 + (p[0][2] - c[2]) ** 2)[1]
        return cache[k]
    return f


# ═══ Zones ═══════════════════════════════════════════════════════════════════════════════
# Zone classes: dz_a / terr_a = player (player A) drop zone and territory; dz_b / terr_b = NPO
# (or player B) drop zone and territory; mid = neutral. "x" marks colours that aren't zones.

ZONES = ["mid", "terr_b", "dz_b", "terr_a", "dz_a"]
X_COMMON = [((88, 106, 98), "x"), ((12, 12, 18), "x"), ((250, 250, 250), "x"), ((47, 51, 51), "x"), ((60, 72, 72), "x")]
PALETTES = {
    "devlan": [((156, 158, 157), "dz_b"), ((188, 190, 187), "terr_b"), ((225, 203, 178), "terr_a"), ((213, 159, 120), "dz_a"),
               ((92, 107, 96), "x"), ((45, 61, 49), "x"), ((10, 10, 15), "x"), ((245, 245, 245), "x"), ((47, 51, 51), "x")],
    "typhon": [((186, 188, 187), "terr_b"), ((150, 150, 150), "dz_b"), ((222, 198, 175), "terr_a"), ((213, 148, 112), "dz_a"),
               ((90, 106, 98), "x"), ((108, 80, 122), "x"), ((12, 12, 24), "x"), ((250, 250, 250), "x"), ((47, 51, 51), "x"), ((60, 72, 72), "x")],
    "volkus": [((222, 198, 175), "terr_a"), ((210, 150, 112), "dz_a"), ((182, 182, 182), "terr_b"), ((154, 154, 152), "dz_b"), ((217, 30, 20), "x")] + X_COMMON,
    "ambull": [((222, 198, 175), "terr_a"), ((208, 155, 110), "dz_a"), ((162, 194, 194), "terr_b"), ((108, 168, 170), "dz_b"), ((216, 84, 36), "x")] + X_COMMON,
    "shadowhunt": [((226, 226, 226), "mid"), ((225, 198, 172), "terr_a"), ((208, 150, 108), "dz_a"), ((182, 182, 182), "terr_b"), ((152, 152, 152), "dz_b"),
                   ((216, 84, 36), "x"), ((36, 144, 60), "x"), ((132, 96, 72), "x"), ((118, 118, 118), "x")] + X_COMMON,
    "tombworld": [((222, 196, 170), "terr_a"), ((212, 146, 108), "dz_a"), ((182, 182, 182), "terr_b"), ((154, 154, 150), "dz_b"),
                  ((216, 84, 36), "x"), ((144, 96, 84), "x"), ((118, 118, 118), "x")] + X_COMMON,
    "sniper": [((230, 195, 180), "terr_a"), ((226, 155, 122), "dz_a"), ((200, 202, 200), "terr_b"), ((108, 120, 108), "x"), ((0, 0, 0), "x"),
               ((72, 84, 84), "x"), ((228, 72, 0), "x"), ((250, 250, 250), "x")],
    # Titus draws the player in blue; here the player is side A like everywhere else.
    "titus": [((195, 205, 222), "terr_a"), ((144, 156, 198), "dz_a"), ((204, 204, 204), "terr_b"), ((108, 120, 108), "x"), ((0, 0, 0), "x"),
              ((72, 84, 84), "x"), ((250, 250, 250), "x")],
}
PALETTES["archivist"] = PALETTES["ambull"] + [((36, 144, 60), "x"), ((204, 48, 36), "x"), ((132, 96, 72), "x")]
# Packs whose zone edges run along the grid: snap traced corners to this many inches.
# Typhon (round NPO drop zones) and Volkus Compound (diagonal zones) keep their traced shapes.
RECTILINEAR = {"tombworld": 1.0, "shadowhunt": 0.5, "devlan": 0.5, "ambull": 0.5, "archivist": 0.5, "sniper": 0.5, "titus": 0.5}

TERRAIN_FILLS = {(92, 115, 92), (122, 134, 124), (125, 133, 124)}
ZONE_FILLS = {(0, 0, 0), (247, 77, 0), (51, 204, 173), (213, 217, 217), (255, 255, 255), (233, 79, 9), (56, 76, 151)} | TERRAIN_FILLS


def classify_grid(im, left, top, ppi, w_in, h_in, palette, cell):
    near = nearest(palette)
    grid = []
    for j in range(round(h_in / cell)):
        row = []
        for i in range(round(w_in / cell)):
            c = Counter(near(im.px(left + (i + fx) * cell * ppi, top + (j + fy) * cell * ppi))
                        for fx, fy in ((0.3, 0.3), (0.7, 0.3), (0.3, 0.7), (0.7, 0.7), (0.5, 0.5)))
            row.append(c.most_common(1)[0][0])
        grid.append(row)
    return grid


def fill_bfs(grid, keep):
    """Cells whose class isn't in `keep` take the class of the nearest cell that is."""
    ny, nx = len(grid), len(grid[0])
    out = [[c if c in keep else None for c in row] for row in grid]
    q = deque((i, j) for j in range(ny) for i in range(nx) if out[j][i] is not None)
    while q:
        i, j = q.popleft()
        for a, b in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
            if 0 <= a < nx and 0 <= b < ny and out[b][a] is None:
                out[b][a] = out[j][i]; q.append((a, b))
    return out


def fill_straight(grid, keep):
    """Like fill_bfs, but each cell takes the nearest kept class straight up, down, left or right.
    That splits walls and pillars down their middle, so zone edges that follow walls stay straight."""
    ny, nx = len(grid), len(grid[0])
    best = [[(10 ** 9, None)] * nx for _ in range(ny)]

    def scan(cells):
        last, d = None, 0
        for i, j in cells:
            if grid[j][i] in keep: last, d = grid[j][i], 0
            elif last is not None: d += 1
            if last is not None and d < best[j][i][0]: best[j][i] = (d, last)
    for j in range(ny):
        scan([(i, j) for i in range(nx)]); scan([(i, j) for i in range(nx - 1, -1, -1)])
    for i in range(nx):
        scan([(i, j) for j in range(ny)]); scan([(i, j) for j in range(ny - 1, -1, -1)])
    out = [[best[j][i][1] for i in range(nx)] for j in range(ny)]
    if any(c is None for row in out for c in row):
        out = fill_bfs([[c if c is not None else "x" for c in row] for row in out], keep)
    return out


def drop_thin(grid, keep, k=3):
    """Remove zone features thinner than about 2k cells (grid lines, centre lines), then refill them."""
    ny, nx = len(grid), len(grid[0])
    held = [[False] * nx for _ in range(ny)]
    for cls in keep:
        m = [[c == cls for c in row] for row in grid]
        for j in range(ny):
            for i in range(nx):
                if m[j][i] and all(0 <= i + di < nx and 0 <= j + dj < ny and m[j + dj][i + di] for di in range(-k, k + 1) for dj in range(-k, k + 1)):
                    for dj in range(-k, k + 1):
                        for di in range(-k, k + 1):
                            if m[j + dj][i + di]: held[j + dj][i + di] = True
    return fill_bfs([[grid[j][i] if held[j][i] else "x" for i in range(nx)] for j in range(ny)], keep)


def drop_specks(grid, keep, min_cells):
    """Zone patches smaller than min_cells (board art, edge notches) take the class around them."""
    ny, nx = len(grid), len(grid[0])
    seen = [[False] * nx for _ in range(ny)]
    out = [row[:] for row in grid]
    for j in range(ny):
        for i in range(nx):
            if seen[j][i]: continue
            cls, comp, k = grid[j][i], [(i, j)], 0
            seen[j][i] = True
            while k < len(comp):
                a, b = comp[k]; k += 1
                for p, q in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
                    if 0 <= p < nx and 0 <= q < ny and not seen[q][p] and grid[q][p] == cls:
                        seen[q][p] = True; comp.append((p, q))
            if len(comp) < min_cells:
                for a, b in comp: out[b][a] = "x"
    return fill_straight(out, keep)


def outlines(mask):
    """Boolean grid -> closed outlines along cell edges, as lists of (x, y) grid corners."""
    ny, nx = len(mask), len(mask[0])
    ins = lambda i, j: 0 <= i < nx and 0 <= j < ny and mask[j][i]
    nxt = {}
    for j in range(ny):
        for i in range(nx):
            if not mask[j][i]: continue
            if not ins(i, j - 1): nxt.setdefault((i, j), []).append((i + 1, j))
            if not ins(i + 1, j): nxt.setdefault((i + 1, j), []).append((i + 1, j + 1))
            if not ins(i, j + 1): nxt.setdefault((i + 1, j + 1), []).append((i, j + 1))
            if not ins(i - 1, j): nxt.setdefault((i, j + 1), []).append((i, j))
    loops = []
    while nxt:
        start = next(iter(nxt))
        loop, cur, prev = [start], start, None
        while True:
            outs = nxt.get(cur)
            if not outs: break
            if len(outs) > 1 and prev is not None:
                dx, dy = cur[0] - prev[0], cur[1] - prev[1]
                outs.sort(key=lambda p: dx * (p[1] - cur[1]) - dy * (p[0] - cur[0]), reverse=True)
            p = outs.pop(0)
            if not outs: del nxt[cur]
            prev, cur = cur, p
            if cur == start: break
            loop.append(cur)
        if len(loop) >= 4: loops.append(loop)
    return loops


def _dp(pts, tol):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-9
    best, bi = -1, 0
    for k in range(1, len(pts) - 1):
        d = abs(dy * pts[k][0] - dx * pts[k][1] + x2 * y1 - y2 * x1) / L
        if d > best: best, bi = d, k
    if best <= tol: return [pts[0], pts[-1]]
    return _dp(pts[:bi + 1], tol)[:-1] + _dp(pts[bi:], tol)


def simplify(loop, tol):
    """Douglas-Peucker on a closed outline: staircases become straight diagonals."""
    n = len(loop)
    pts = [loop[k] for k in range(n) if (loop[k][0] - loop[k - 1][0]) * (loop[(k + 1) % n][1] - loop[k][1]) != (loop[k][1] - loop[k - 1][1]) * (loop[(k + 1) % n][0] - loop[k][0])]
    if len(pts) < 3: return pts
    far = max(range(len(pts)), key=lambda k: (pts[k][0] - pts[0][0]) ** 2 + (pts[k][1] - pts[0][1]) ** 2)
    return _dp(pts[:far + 1], tol)[:-1] + _dp(pts[far:] + [pts[0]], tol)[:-1]


def snap_near(loop, cell, step=0.5, tol=0.2):
    """Corners within tol inches of a half-inch line move onto it."""
    g = step / cell
    out = []
    for x, y in loop:
        sx, sy = round(x / g) * g, round(y / g) * g
        out.append((sx if abs(sx - x) <= tol / cell else x, sy if abs(sy - y) <= tol / cell else y))
    return [p for k, p in enumerate(out) if p != out[k - 1]]


def snap_square(loop, cell, step):
    """Square outlines: every corner onto the nearest `step` inches, then drop repeats and straight-through points."""
    g = step / cell
    pts = [(round(x / g) * g, round(y / g) * g) for x, y in loop]
    changed = True
    while changed and len(pts) >= 4:
        changed = False
        out = [p for k, p in enumerate(pts) if p != pts[k - 1]]
        keep = []
        for k in range(len(out)):
            a, b, c = out[k - 1], out[k], out[(k + 1) % len(out)]
            if a[0] == b[0] == c[0] or a[1] == b[1] == c[1]:
                changed = True
            else:
                keep.append(b)
        pts = keep
    return pts if len(pts) >= 4 else []


def area(pts):
    return sum(pts[k - 1][0] * pts[k][1] - pts[k][0] * pts[k - 1][1] for k in range(len(pts))) / 2


def inside(pts, x, y):
    c = False
    for k in range(len(pts)):
        (x1, y1), (x2, y2) = pts[k - 1], pts[k]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def traced_zones(im, ph, b, W, H, palette, square=None, cell=0.1):
    """Zones traced from the rendered page. Returns (most common class, [(class, path)])."""
    s = im.h / ph
    g = classify_grid(im, b[0] * s, (ph - b[3]) * s, (b[1] - b[0]) * s / W, W, H, palette, cell)
    keep = [z for z in ZONES if any(cls == z for _, cls in palette)]
    g = fill_straight(g, set(keep))
    g = drop_thin(g, set(keep), 3)
    g = drop_specks(g, set(keep), int(2.5 / (cell * cell)))
    counts = Counter(c for row in g for c in row)
    base = counts.most_common(1)[0][0]
    out = []
    for z in keep:
        if z == base or not counts.get(z): continue
        loops = outlines([[c == z for c in row] for row in g])
        loops = [snap_square(l, cell, square) if square else snap_near(simplify(l, 2.5), cell) for l in loops]
        d = "".join("M" + "L".join(fmt(x * cell * 10) + " " + fmt(y * cell * 10) for x, y in l) + "Z" for l in loops if len(l) >= 3 and abs(area(l)) >= 4)
        out.append((z, d))
    return base, out


def vector_zones(im, ph, shapes, b, W, H, palette):
    """Zones from the PDF's own zone rectangles, coloured by sampling the page. None if there aren't any."""
    bx0, bx1, by0, by1 = b
    sx, sy = (bx1 - bx0) / W, (by1 - by0) / H
    polys = []
    for s in shapes:
        if s["kind"] != "fill" or rgb(s["fill"]) not in ZONE_FILLS: continue
        xs = [p[0] for p in s["pts"]]; ys = [p[1] for p in s["pts"]]
        bw, bh = (max(xs) - min(xs)) / sx, (max(ys) - min(ys)) / sy
        if min(bw, bh) < 1.5 or bw * bh < (60 if rgb(s["fill"]) in TERRAIN_FILLS else 10): continue
        if min(xs) < bx0 - sx or max(xs) > bx1 + sx or min(ys) < by0 - sy or max(ys) > by1 + sy: continue
        polys.append(s["pts"])
    if len(polys) < 2: return None
    # Only when they cover the board. Some packs use big rectangles for other things (Typhon's round drop zones).
    grid = [(bx0 + (i + 0.5) * sx, by0 + (j + 0.5) * sy) for i in range(int(W)) for j in range(int(H))]
    if sum(any(inside(q, x, y) for q in polys) for x, y in grid) < 0.95 * len(grid): return None
    near = nearest(palette)
    sc = im.h / ph
    out = []
    for k, pts in enumerate(polys):
        later, c = polys[k + 1:], Counter()
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        step = sx * 0.3
        y = max(min(ys), by0) + step / 2
        while y < min(max(ys), by1):
            x = max(min(xs), bx0) + step / 2
            while x < min(max(xs), bx1):
                if inside(pts, x, y) and not any(inside(q, x, y) for q in later):
                    c[near(im.px(x * sc, (ph - y) * sc))] += 1
                x += step
            y += step
        c.pop("x", None)
        if not c: continue
        clip = [(min(max(x, bx0), bx1), min(max(y, by0), by1)) for x, y in pts]
        out.append((c.most_common(1)[0][0], "M" + "L".join(fmt((x - bx0) / sx * 10) + " " + fmt((by1 - y) / sy * 10) for x, y in clip) + "Z"))
    return (out[0][0], out) if out else None


# ═══ Boards ══════════════════════════════════════════════════════════════════════════════

def find_boards(shapes):
    """Board outlines in page points (x0, x1, y0, y1), top of the page first."""
    boards = []
    for s in shapes:
        if s["kind"] == "stroke" and rgb(s["stroke"]) == (47, 51, 51) and s["lw"] >= 1:
            xs = [p[0] for p in s["pts"]]; ys = [p[1] for p in s["pts"]]
            b = (round(min(xs), 1), round(max(xs), 1), round(min(ys), 1), round(max(ys), 1))
            if b[1] - b[0] > 150 and b[3] - b[2] > 100 and b not in boards: boards.append(b)
    if not boards:
        # Older packs (Sniper, Titus): a white board with a thin black outline.
        for s in shapes:
            if s["kind"] == "fill" and rgb(s["fill"]) == (255, 255, 255) and len(s["pts"]) == 5:
                xs = [p[0] for p in s["pts"]]; ys = [p[1] for p in s["pts"]]
                w, h = max(xs) - min(xs), max(ys) - min(ys)
                if w > 150 and h > 100 and min(abs(w / h - 30 / 22), abs(w / h - 22 / 30)) < 0.03:
                    b = (round(min(xs), 1), round(max(xs), 1), round(min(ys), 1), round(max(ys), 1))
                    if b not in boards: boards.append(b)
    return sorted(boards, key=lambda b: -b[3])


def board_size(b, pack):
    """Board size in inches from its shape."""
    w, h = b[1] - b[0], b[3] - b[2]
    if pack == "shadowhunt":
        # Descent killzone: 559 x 381mm boards for Volkus, 607 x 414mm for Tomb World.
        size = (24, 16.3) if max(w, h) > 410 else (22, 15)
        return size if w > h else size[::-1]
    return min([(30, 22), (22, 30), (28, 24), (24, 28)], key=lambda s: abs(math.log(w / h / (s[0] / s[1]))))


# ═══ Recolouring the drawing ═════════════════════════════════════════════════════════════

LABEL_FILLS = {(47, 51, 51), (81, 84, 85), (83, 85, 86)}
SPECIAL_FILLS = {(108, 76, 217): "inf"}  # Typhon's Tyranid infestation
OBJ_FILLS = {(255, 54, 0), (233, 79, 9)}
COLOUR_BOXES = {(240, 14, 0): "rbox", (46, 218, 0): "gbox", (233, 79, 9): "onum"}
COLOUR_LINES = {(240, 14, 0): "rline", (46, 218, 0): "gline"}
CENTRE_MARK = {(77, 77, 77), (71, 77, 77), (86, 92, 92), (105, 109, 110), (106, 108, 110)}
PLAYER_EDGE = {(255, 114, 77), (255, 115, 77), (250, 129, 75), (241, 138, 81)}
OTHER_EDGE = {(0, 0, 0), (89, 89, 89), (77, 77, 77), (128, 128, 128), (156, 157, 157), (155, 155, 155)}
TER_PAL = [((92, 107, 96), "ter"), ((45, 61, 49), "ter2"), ((245, 245, 245), "x"), ((10, 10, 15), "x"), ((47, 51, 51), "x"),
           ((225, 203, 178), "x"), ((213, 159, 120), "x"), ((188, 190, 187), "x"), ((156, 158, 157), "x")]
SKULL = "M5 .6C2.5.6.8 2.3.8 4.5c0 1.4.7 2.5 1.6 3.1V9.4h1.3v-.9h.7v.9h1.2v-.9h.7v.9h1.3V7.6c.9-.6 1.6-1.7 1.6-3.1C9.2 2.3 7.5.6 5 .6zM3.3 3.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zm3.4 0a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"
_ter_near = nearest(TER_PAL)


def terrain_class(im, ph, pts, step=3.0):
    """Light or dark terrain, from the page colours inside the outline."""
    s = im.h / ph
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    c = Counter()
    y = min(ys) + step / 2
    while y < max(ys):
        x = min(xs) + step / 2
        while x < max(xs):
            if inside(pts, x, y): c[_ter_near(im.px(x * s, (ph - y) * s))] += 1
            x += step
        y += step
    c.pop("x", None)
    return c.most_common(1)[0][0] if c else "ter"


def draw_board(mid, pack, page, im, b, n_boards, index, unknown):
    """One board: zones, recoloured shapes and labels, in board tenths of an inch (y down)."""
    shapes, ph = page["shapes"], page["h"]
    W, H = board_size(b, pack)
    bx0, bx1, by0, by1 = b
    sx, sy = (bx1 - bx0) / W, (by1 - by0) / H
    P = lambda x, y: ((x - bx0) / sx * 10, (by1 - y) / sy * 10)
    inb = lambda x, y, m=0: bx0 - m * sx <= x <= bx1 + m * sx and by0 - m * sy <= y <= by1 + m * sy
    path = lambda pts: "M" + "L".join(fmt(x) + " " + fmt(y) for x, y in (P(a, c) for a, c in pts))
    base, zones = vector_zones(im, ph, shapes, b, W, H, PALETTES[pack]) or traced_zones(im, ph, b, W, H, PALETTES[pack], RECTILINEAR.get(pack))
    el, boxes, rings = [], [], []

    # Objective markers (skulls) and entryway markers (half-black circles) are redrawn whole.
    markers, entries = [], []
    for s in shapes:
        if s["kind"] == "fill" and rgb(s["fill"]) in OBJ_FILLS:
            xs = [p[0] for p in s["pts"]]; ys = [p[1] for p in s["pts"]]
            bw, bh = (max(xs) - min(xs)) / sx, (max(ys) - min(ys)) / sy
            if not (inb(min(xs), min(ys), 1) and inb(max(xs), max(ys), 1)): continue
            if 1.0 <= bw <= 2.2 and 1.0 <= bh <= 2.2 and abs(bw - bh) < 0.2:
                markers.append((min(xs), max(xs), min(ys), max(ys)))
            elif 0.5 <= bw < 1.0 and abs(bw - bh) < 0.1 and len(s["pts"]) > 8:
                entries.append((min(xs), max(xs), min(ys), max(ys)))
    for a, c, e, f in markers:
        x, y = P((a + c) / 2, (e + f) / 2); r = (c - a) / sx * 5
        el.append((7, f'<g class="obj"><circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}"/><path transform="translate({fmt(x - r * 0.62)} {fmt(y - r * 0.62)}) scale({fmt(r * 0.124)})" d="{SKULL}"/></g>'))
    within = lambda box, xs, ys, m: box[0] - m <= min(xs) and max(xs) <= box[1] + m and box[2] - m <= min(ys) and max(ys) <= box[3] + m
    for e in entries:
        x, y = P((e[0] + e[1]) / 2, (e[2] + e[3]) / 2); r = (e[1] - e[0]) / sx * 5
        g = f'<g class="entry"><circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}"/>'
        for s in shapes:  # the black rectangle the PDF clips to one half
            if s["kind"] == "fill" and rgb(s["fill"]) == (0, 0, 0) and len(s["pts"]) == 5 and within(e, [p[0] for p in s["pts"]], [p[1] for p in s["pts"]], 2):
                top = sum(p[1] for p in s["pts"][:4]) / 4 > (e[2] + e[3]) / 2
                g += f'<path d="M{fmt(x - r)} {fmt(y)}A{fmt(r)} {fmt(r)} 0 0 {1 if top else 0} {fmt(x + r)} {fmt(y)}Z"/>'
                break
        el.append((7, g + "</g>"))

    n_img = 0
    for s in shapes:
        xs = [p[0] for p in s["pts"]]; ys = [p[1] for p in s["pts"]]
        bw, bh = (max(xs) - min(xs)) / sx, (max(ys) - min(ys)) / sy
        if s["kind"] == "image":
            if pack == "titus" and 1.4 <= bw <= 2.0 and abs(bw - bh) < 0.1 and inb(min(xs), min(ys)) and inb(max(xs), max(ys)):
                # Titus draws its numbered objective markers as pictures, in number order.
                n_img += 1
                x, y = P((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2); r = bw * 3.6
                el.append((7, f'<g class="objn"><circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}"/><text x="{fmt(x)}" y="{fmt(y + r * 0.42)}" font-size="{fmt(r * 1.2)}">{n_img}</text></g>'))
            continue
        if not (inb(min(xs), min(ys), 1.2) and inb(max(xs), max(ys), 1.2)): continue
        if any(within(m, xs, ys, 0.5) for m in markers): continue
        fc, scol = rgb(s["fill"]), rgb(s["stroke"])
        if any(within(e, xs, ys, 2) for e in entries) and s["kind"] == "fill":
            if fc == (255, 255, 255): el.append((8, f'<path class="glyph" d="{path(s["pts"])}Z"/>'))
            if fc in {(0, 0, 0), (255, 255, 255)} | OBJ_FILLS: continue
        d = path(s["pts"])
        lw = s["lw"] / sx * 10
        dash = [v / sx * 10 for v in s["dash"]]
        ratio = abs(area(s["pts"])) / max(1e-6, (max(xs) - min(xs)) * (max(ys) - min(ys)))
        round_ = len(s["pts"]) > 8 and 0.7 < ratio < 0.86
        mid_pt = ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)
        if s["kind"] in ("fill", "both"):
            if fc == (255, 255, 255) and round_ and bw < 1.3:
                el.append((7, f'<path class="mark" d="{d}Z"/>'))
            elif fc in TERRAIN_FILLS and bw * bh >= 60:
                pass  # a zone
            elif fc in TERRAIN_FILLS:
                el.append((2, f'<path class="{terrain_class(im, ph, s["pts"])}" d="{d}Z"/>'))
            elif fc in SPECIAL_FILLS:
                el.append((2, f'<path class="{SPECIAL_FILLS[fc]}" d="{d}Z"/>'))
            elif fc in LABEL_FILLS and max(bw, bh) < 1.5 and 0.45 < min(bw, bh) < 1.3 and len(s["pts"]) <= 6 and ratio > 0.95:
                boxes.append(("lbl", *mid_pt, bh, None, bw))
            elif fc == (47, 51, 51) and bw < 1.6 and bh < 1.6 and abs(bw - bh) < 0.15:
                # a label box turned on its side
                side = math.hypot(s["pts"][1][0] - s["pts"][0][0], s["pts"][1][1] - s["pts"][0][1]) / sx
                ang = math.degrees(math.atan2(-(s["pts"][1][1] - s["pts"][0][1]), s["pts"][1][0] - s["pts"][0][0]))
                boxes.append(("lbl", *mid_pt, side, ang, side))
            elif fc == (255, 255, 255) and bw < 1.3 and bh < 1.3 and len(s["pts"]) <= 6 and ratio > 0.9:
                boxes.append(("num", *mid_pt, bw, None, bw))
            elif fc in OBJ_FILLS and bw < 1.0 and bh < 1.0 and abs(bw - bh) < 0.15:
                boxes.append(("onum", *mid_pt, bw, None, bw))
            elif fc in ZONE_FILLS and min(bw, bh) >= 1.5 and bw * bh >= 10:
                pass  # a zone
            elif fc == (0, 0, 0) and 0.6 <= bw <= 1.2 and 0.6 <= bh <= 1.2 and abs(bw - bh) < 0.2:
                el.append((5, f'<path class="pillar" d="{d}Z"/>'))
            elif fc == (0, 0, 0) and min(bw, bh) >= 1.2:
                el.append((5, f'<path class="piece" d="{d}Z"/>'))
            elif fc == (47, 51, 51) and max(bw, bh) <= 2 and min(bw, bh) <= 0.7:
                el.append((5, f'<path class="access" d="{d}Z"/>'))
            elif fc in COLOUR_BOXES and min(bw, bh) < 1.3:
                boxes.append((COLOUR_BOXES[fc], *mid_pt, bh, None, bw))
            elif fc in CENTRE_MARK and bw < 0.5:
                el.append((6, f'<path class="ctr" d="{d}Z"/>'))
            else:
                unknown[("fill", fc, round(bw, 1), round(bh, 1))] += 1
                el.append((5, f'<path fill="rgb{fc}" d="{d}Z"/>'))
        if s["kind"] in ("stroke", "both"):
            attrs = f'stroke-width="{fmt(lw)}"' + (f' stroke-dasharray="{" ".join(fmt(v) for v in dash)}"' if dash else "")
            outside = not inb(min(xs), min(ys), 0.1) or not inb(max(xs), max(ys), 0.1)
            if bw < 0.05 and bh < 0.05:
                pass  # zero-length dots
            elif scol == (0, 0, 0) and lw <= 0.4 and (bw > W - 0.5 or bh > H - 0.5):
                pass  # the PDF's own grid lines
            elif scol == (0, 0, 0) and lw >= 1.7 and not dash and not outside:
                el.append((4, f'<path class="wall" {attrs} d="{d}"/>'))
            elif scol == (255, 255, 255) and lw >= 1.7:
                el.append((5, f'<path class="door" {attrs} d="{d}"/>'))
            elif scol in ((217, 0, 0), (240, 14, 0)) and lw >= 1.7:
                el.append((5, f'<path class="breach" {attrs} d="{d}"/>'))
            elif scol == (46, 218, 0) and lw >= 2.5:
                el.append((5, f'<path class="nside" {attrs} d="{d}"/>'))
            elif scol in COLOUR_LINES:
                el.append((5, f'<path class="{COLOUR_LINES[scol]}" {attrs} d="{d}"/>'))
            elif scol in ((153, 153, 153), (0, 0, 0)) and 0.3 < bw < 1 and 0.3 < bh < 1:
                el.append((6, f'<path class="xmark" d="{d}"/>'))
            elif scol == (255, 255, 255):
                el.append((5, f'<path class="vant" {attrs} d="{d}"/>'))
            elif scol == (89, 89, 89):
                el.append((3, f'<path class="zline" {attrs} d="{d}"/>'))
            elif not outside and lw <= 1.6 and (bw > W * 0.5 or bh > H * 0.5) and (dash or scol == (86, 92, 92)):
                el.append((3, f'<path class="{"ocline" if scol in OBJ_FILLS else "cline"}" d="{d}"/>'))
            elif scol in CENTRE_MARK and bw < 1 and bh < 1:
                el.append((6, f'<path class="ctr" d="{d}"/>'))
            elif scol in ((25, 25, 25), (51, 51, 51)) and lw <= 1.2 and bw > 2:
                el.append((6, f'<path class="ring" d="{d}"/>'))
                pts = [P(a, c) for a, c in s["pts"]]
                rings.append((sum(x for x, _ in pts) / len(pts), sum(y for _, y in pts) / len(pts), bw * 5))
            elif outside and scol == (92, 204, 184):
                el.append((6, f'<path class="edge-b" {attrs} d="{d}"/>'))
            elif outside and (scol in PLAYER_EDGE or (pack == "titus" and scol == (56, 76, 151))):
                el.append((6, f'<path class="edge-p" {attrs} d="{d}"/>'))
            elif outside and dash and dash[0] < 0.1:
                el.append((6, f'<path class="edge-n" d="{d}"/>'))
            elif outside and scol in OTHER_EDGE and lw < 2.5:
                el.append((6, f'<path class="edge-o" {attrs} d="{d}"/>'))
            elif scol in OBJ_FILLS and lw < 1.2:
                el.append((3, f'<path class="oline" {attrs} d="{d}"/>'))
            elif scol == (47, 51, 51) and bw > W - 1:
                pass  # the board outline
            else:
                unknown[("stroke", scol, round(lw, 1), tuple(round(v, 1) for v in dash), round(bw, 1), round(bh, 1))] += 1
                el.append((5, f'<path fill="none" stroke="rgb{scol}" {attrs} d="{d}"/>'))

    # Labels: each box takes the nearest text; the rest of the text stays where the PDF put it.
    texts, cand, used = [], [t for t in page["texts"] if inb(t["x"], t["y"], 1.2)], set()
    for kind, cx, cy, h, ang, w in boxes:
        best, bd = None, 1e9
        for k, t in enumerate(cand):
            if k in used: continue
            dist = math.hypot(cx - (t["x"] + t["size"] * 0.27 * len(t["t"])), cy - (t["y"] + t["size"] * 0.36))
            if dist < h * sx * 0.8 and dist < bd: best, bd = k, dist
        if best is not None: used.add(best)
        x, y = P(cx, cy); h, w = h * 10, w * 10
        tilt = ((ang + 45) % 90) - 45 if ang is not None else 0
        rot = f' transform="rotate({fmt(-tilt)} {fmt(x)} {fmt(y)})"' if abs(tilt) > 1 else ""
        fs = min(h, w, 9.5) * 0.9
        texts.append(f'<g class="{kind}"{rot}><rect x="{fmt(x - w / 2)}" y="{fmt(y - h / 2)}" width="{fmt(w)}" height="{fmt(h)}" rx="1"/>'
                     f'<text x="{fmt(x)}" y="{fmt(y + fs * 0.345)}" font-size="{fmt(fs)}">{esc(cand[best]["t"]) if best is not None else ""}</text></g>')
    dz = [k for k, t in enumerate(cand) if k not in used and "NPO Drop Zone" in t["t"]]
    if dz and rings:
        # Typhon's round NPO drop zones: the caption follows the ring.
        starts = {}
        for k in dz:
            used.add(k)
            x, y = P(cand[k]["x"], cand[k]["y"])
            ri = min(range(len(rings)), key=lambda i: abs(math.hypot(x - rings[i][0], y - rings[i][1]) - rings[i][2]))
            starts.setdefault(ri, math.atan2(y - rings[ri][1], x - rings[ri][0]))
        for i, (cx, cy, r) in enumerate(rings):
            a0, rr = starts.get(i, math.radians(-150)), r + 0.8
            x0, y0 = cx + rr * math.cos(a0), cy + rr * math.sin(a0)
            x1, y1 = cx + rr * math.cos(a0 + math.pi), cy + rr * math.sin(a0 + math.pi)
            pid = f"{mid}-{index}-r{i}"
            texts.append(f'<path id="{pid}" fill="none" d="M{fmt(x0)} {fmt(y0)}A{fmt(rr)} {fmt(rr)} 0 0 1 {fmt(x1)} {fmt(y1)}A{fmt(rr)} {fmt(rr)} 0 0 1 {fmt(x0)} {fmt(y0)}"/>'
                         f'<text class="note" font-size="7.4"><textPath href="#{pid}">NPO Drop Zone</textPath></text>')
    for k, t in enumerate(cand):
        if k in used: continue
        x, y = P(t["x"], t["y"])
        texts.append(f'<text class="note" x="{fmt(x)}" y="{fmt(y)}" font-size="{fmt(t["size"] / sx * 10)}"'
                     + (f' transform="rotate({fmt(-t["rot"])} {fmt(x)} {fmt(y)})"' if abs(t["rot"]) > 0.5 else "") + f'>{esc(t["t"])}</text>')

    caption = None
    if pack == "shadowhunt":
        caption = "Lower killzone (Tomb World)" if W * H > 360 else "Upper killzone (Volkus)"
    elif n_boards > 1:
        for t in page["texts"]:
            if t["size"] >= 30 and t["t"].isdigit() and by0 <= t["y"] <= by1 and (t["x"] < bx0 or t["x"] > bx1):
                caption = "Map " + t["t"]
                if any("JOINT OPS ONLY" in u["t"].upper() and abs(u["x"] - t["x"]) < 60 and abs(u["y"] - t["y"]) < 60 for u in page["texts"]):
                    caption += " (Joint Ops only)"
    return dict(W=W, H=H, base=base, zones=zones, el=el, texts=texts, caption=caption)


# ═══ SVG ═════════════════════════════════════════════════════════════════════════════════
# Colours match the app (dark cards, orange accent). Side A (player) is warm, side B (NPOs or
# player B) is blue. The app's map legend uses the same class names.

STYLE = """
.km{font-family:Rajdhani,'Barlow Condensed',sans-serif;font-weight:700}
.km .b-mid,.km .z-mid{fill:#1D2027;stroke:#1D2027}.km .b-terr_a,.km .z-terr_a{fill:#3D2D20;stroke:#3D2D20}.km .b-dz_a,.km .z-dz_a{fill:#7A4520;stroke:#7A4520}
.km .b-terr_b,.km .z-terr_b{fill:#1E2B40;stroke:#1E2B40}.km .b-dz_b,.km .z-dz_b{fill:#2C4A78;stroke:#2C4A78}
.km [class^=z-]{stroke-width:.4;stroke-linejoin:round}.km [class^=b-]{stroke:none}
.km .grid{stroke:#fff;stroke-opacity:.07;stroke-width:.35;fill:none}
.km .ter{fill:#5B6A60}.km .ter2{fill:#3B463F}.km .inf{fill:#6A4FA8}
.km .wall{fill:none;stroke:#E4E7EB;stroke-linecap:square;stroke-linejoin:miter}
.km .door{fill:none;stroke:#E08A3C;stroke-linecap:butt}.km .breach{fill:none;stroke:#E0503C;stroke-linecap:butt}
.km .vant{fill:none;stroke:#F1F2F5;stroke-width:.8}
.km .zline{fill:none;stroke:#0E0F13;stroke-opacity:.6}
.km .cline{fill:none;stroke:#9AA5B1;stroke-opacity:.45;stroke-width:.6;stroke-dasharray:2 1.5}
.km .ocline{fill:none;stroke:#C9772E;stroke-opacity:.7;stroke-width:.6;stroke-dasharray:2 1.5}
.km .ctr{fill:none;stroke:#9AA5B1;stroke-width:.5}
.km .edge-p{fill:none;stroke:#C9772E}.km .edge-b{fill:none;stroke:#6B9BF7}.km .edge-o{fill:none;stroke:#7D8592}
.km .edge-n{fill:none;stroke:#5A6270;stroke-width:2.2;stroke-dasharray:0 6.9;stroke-linecap:round}
.km .outline{fill:none;stroke:#3A4150;stroke-width:.8}
.km .lbl rect{fill:#0E0F13;stroke:#9AA5B1;stroke-width:.4}.km .num rect,.km .onum rect{fill:#C9772E}
.km .rbox rect{fill:#E0503C}.km .gbox rect{fill:#5A9C3A}
.km .lbl text,.km .num text,.km .onum text,.km .rbox text,.km .gbox text{text-anchor:middle;fill:#F1F2F5}.km .num text,.km .onum text{fill:#0E0F13}
.km .note{fill:#F1F2F5;opacity:.85}.km .cap{fill:#9AA5B1;font-size:9px;letter-spacing:.06em}
.km .obj circle,.km .objn circle{fill:#C9772E;stroke:#0E0F13;stroke-width:.8}.km .obj path{fill:#0E0F13;fill-rule:evenodd}.km .objn text{fill:#0E0F13;text-anchor:middle}
.km .entry circle{fill:#C9772E;stroke:#0E0F13;stroke-width:.5}.km .entry path{fill:#0E0F13}.km .glyph{fill:#F1F2F5}
.km .mark{fill:#F1F2F5;stroke:#0E0F13;stroke-width:.5}.km .ring{fill:none;stroke:#0E0F13;stroke-width:.6;stroke-opacity:.8}
.km .pillar{fill:#E4E7EB}.km .piece{fill:#46524A;stroke:#9AA5B1;stroke-width:.4}.km .access{fill:#9AA5B1}
.km .xmark{fill:none;stroke:#0E0F13;stroke-width:.7}.km .nside,.km .gline{fill:none;stroke:#5A9C3A}.km .rline{fill:none;stroke:#E0503C}
.km .oline{fill:none;stroke:#C9772E;stroke-opacity:.8}
"""


def to_svg(boards):
    gap, margin = 30, 14
    width = max(b["W"] for b in boards) * 10 + 2 * margin
    parts, y = [], margin
    for b in boards:
        W, H = b["W"] * 10, b["H"] * 10
        if b["caption"]:
            parts.append(f'<text class="cap" x="{margin}" y="{fmt(y + 2)}">{esc(b["caption"].upper())}</text>')
            y += 9
        parts.append(f'<g transform="translate({margin} {fmt(y)})"><rect class="b-{b["base"]}" width="{fmt(W)}" height="{fmt(H)}"/>')
        parts += [f'<path class="z-{z}" d="{d}" fill-rule="evenodd"/>' for z, d in b["zones"] if d]
        grid = "".join(f"M{x * 10} 0V{fmt(H)}" for x in range(1, math.ceil(b["W"]))) + "".join(f"M0 {r * 10}H{fmt(W)}" for r in range(1, math.ceil(b["H"])))
        parts.append(f'<path class="grid" d="{grid}"/>')
        parts += [e for _, e in sorted(b["el"], key=lambda t: t[0])]
        parts.append(f'<rect class="outline" width="{fmt(W)}" height="{fmt(H)}"/>')
        parts += b["texts"]
        parts.append("</g>")
        y += H + gap
    return (f'<svg class="km" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(width)} {fmt(y - gap + margin)}">'
            f'<style>{STYLE}</style>' + "".join(parts) + "</svg>\n")


def mission_map_ids():
    from build import load_packs
    ids = []
    for p in load_packs():
        for mid in list(p.get("maps", [])) + [m for ms in p["missions"] for m in ms["maps"]]:
            if mid not in ids: ids.append(mid)
    return ids


def main():
    pdf_dir, lib = sys.argv[1], sys.argv[2]
    sys.path.insert(0, lib)
    ids = sys.argv[3:] or mission_map_ids()
    with tempfile.TemporaryDirectory() as tmp:
        for mid in ids:
            pack, n = mid.rsplit("-p", 1)
            pdf = sorted(glob.glob(os.path.join(pdf_dir, PDFS[pack])))[0]
            page = read_page(pdf, int(n))
            im = PageImage(pdf, int(n), tmp)
            unknown = Counter()
            found = find_boards(page["shapes"])
            boards = [draw_board(mid, pack, page, im, b, len(found), i, unknown) for i, b in enumerate(found)]
            if not boards:
                print(f"{mid}: no board found, skipped")
                continue
            open(os.path.join(ROOT, "maps", mid + ".svg"), "w", encoding="utf-8").write(to_svg(boards))
            note = "; ".join(f"{v}x {k}" for k, v in unknown.most_common(4))
            print(f"{mid}: {len(boards)} board(s)" + (f", unrecognised: {note}" if note else ""))


if __name__ == "__main__":
    main()
