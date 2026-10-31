"""Remakes icons/share.png, the picture shown when a KillSheet link is shared (Discord, Reddit, iMessage).

Usage: python3 tools/share/make_share_image.py
Draws tools/share/share-card.html at 1200x630 with headless Google Chrome.
"""
import os
import subprocess
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
card = os.path.join(ROOT, "tools", "share", "share-card.html")
out = os.path.join(ROOT, "icons", "share.png")
with tempfile.TemporaryDirectory() as profile:
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=" + profile, "--window-size=1200,630",
                    "--virtual-time-budget=5000", "--screenshot=" + out, "file://" + card], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Wrote icons/share.png (%d KB)" % (os.path.getsize(out) // 1024))
