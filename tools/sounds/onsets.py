import sys, os, importlib.util
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, "cut.py")).read().split("spec = runpy.run_path")[0]
names = sys.argv[2:]; sys.argv = ["cut", sys.argv[1], "x", os.path.join(here, "probe_out")]
g = {}; exec(compile(src, "cut", "exec"), g)
for nm in names:
    x, f = g["load"](nm); fr = g["frames"](x); m = max(fr)
    on = g["onsets"](x)
    print("%-60s %5.1fs  onsets: %s" % (f[:60], len(x)/g["SR"], " ".join("%.2f" % (o/g["SR"]) for o in on[:24])))
