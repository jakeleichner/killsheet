import sys, os
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, "cut.py")).read().split("spec = runpy.run_path")[0]
names = sys.argv[2:]; sys.argv = ["cut", sys.argv[1], "x", os.path.join(here, "probe_out")]
g = {}; exec(compile(src, "cut", "exec"), g)
for nm in names:
    x, f = g["load"](nm); fr = g["frames"](x); m = max(fr) or 1
    step = 50 if len(fr) < 1200 else 200  # 0.25 s or 1 s per digit
    prof = "".join(str(min(9, int(9.99 * max(fr[i:i+step]) / m))) for i in range(0, len(fr), step))
    print("%-48s %5.1fs per %.2fs: %s" % (f[:48], len(x)/g["SR"], step*0.005, prof[:120]))
