"""Render every page the mission data names (keyMaps, maps, mission maps) to maps/<pack>-pNN.jpg.

Usage: python3 -I tools/missions/render_maps.py <pdf_dir> <pypdf_lib_dir>

<pdf_dir> holds GW's mission pack PDFs (as downloaded). pypdf splits out the page,
macOS `sips` renders it. Only renders images that don't exist yet.
"""
import glob
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))

# Pack id -> filename pattern of GW's PDF.
PDFS = {
    "devlan": "eng_terror_on_devlan_mission_pack-*.pdf",
    "typhon": "eng_aug25_kt_typhon_mission_pack-*.pdf",
    "tombworld": "eng_19-11_kt_mission_pack_tomb_world-*.pdf",
    "shadowhunt": "eng_25-02_kt_missionpacks_shadowhunt_mission_pack-*.pdf",
    "sniper": "kt_sniper_rules_eng_*.pdf",
    "ambull": "eng_ambull_mission_pack-*.pdf",
    "archivist": "eng_the_archivist_mission_pack-*.pdf",
    "volkus": "eng_kt_volkus_compound_mission_pack-*.pdf",
    "titus": "eng_kt_lieutenant_titus_mission_pack_warcom-*.pdf",
    "kz_tombworld": "eng_29-04_kt_mission_pack_killzone_tomb_world-*.pdf",
}


def main():
    pdf_dir, lib = sys.argv[1], sys.argv[2]
    sys.path.insert(0, lib)
    sys.path.insert(0, HERE)
    import pypdf
    from build import load_packs

    out_dir = os.path.join(ROOT, "maps")
    os.makedirs(out_dir, exist_ok=True)
    wanted = set()
    for p in load_packs():
        wanted.update(p.get("keyMaps", []))
        wanted.update(p.get("maps", []))
        for m in p["missions"]:
            wanted.update(m["maps"])
    made = 0
    with tempfile.TemporaryDirectory() as tmp:
        for mid in sorted(wanted):
            out = os.path.join(out_dir, mid + ".jpg")
            if os.path.exists(out):
                continue
            pack, page = mid.rsplit("-p", 1)
            src = sorted(glob.glob(os.path.join(pdf_dir, PDFS[pack])))[0]
            w = pypdf.PdfWriter()
            w.add_page(pypdf.PdfReader(src).pages[int(page) - 1])
            one = os.path.join(tmp, mid + ".pdf")
            w.write(one)
            subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "40", "-Z", "1000", one, "--out", out],
                           check=True, capture_output=True)
            made += 1
    total = sum(os.path.getsize(f) for f in glob.glob(os.path.join(out_dir, "*.jpg")))
    print(f"Rendered {made} new map pages. maps/ holds {len(wanted)} images, {total // 1024} KB.")


if __name__ == "__main__":
    main()
