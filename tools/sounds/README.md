# Recorded attack sounds

The sounds come from the Sonniss GDC Game Audio Bundles (2016 and 2026), downloaded by the owner to `~/Downloads/Sonniss` (outside iCloud). Their license allows use inside the finished app with no credit, but bars handing the files out as sound effects, so **no audio files go in this repository**. Only the tools and the recipe live here.

- `spec.py`: every sound and its choices (which file, where it starts, how long, how much it is deepened, what is layered on it).
- `cut.py`: makes the clips. `python3 -I tools/sounds/cut.py ~/Downloads/Sonniss tools/sounds/spec.py /tmp/killsheet-preview/audition [5,12B]` (the last part redoes only those). It finds each shot, trims, deepens, layers, fades, levels the loudness, and writes AAC `.m4a` plus `list.json`.
- `onsets.py` / `profile.py`: show where shots start and how loud a file is over time, to pick cut points (same arguments: the Sonniss folder, then file-name pieces).
- `audition.html`: the listening page. Copy it to `/tmp/killsheet-preview/audition/index.html` and open `http://localhost:3456/audition/` (a phone on the same Wi-Fi uses the Mac's address).
