/* ═══ OPERATIVE PHOTOS ═══ */
// Photos of your own painted models (owner, Nov 13). One per operative type for each army ("Kasrkin Trooper"), so every
// roster of that team uses it, new or saved, and five Troopers share one photo. Kept on this device in IndexedDB (too
// big for the normal saves), shrunk to a small square first, and included in backup files. Shown with the name, never
// instead of it, and only on your own operatives: the other side's models aren't yours, even in a mirror match.
const PHOTO_DB = "killsheet-photos";
const PHOTO_SIZE = 320; // pixels square; about 20-40 KB each
const photoCache = {}; // "team|operative type" -> data URL
let photosLoaded = null;
const photoKey = (teamId, opId) => teamId + "|" + String(opId).replace(/~\d+$/, "");
const photoFor = (teamId, opId) => (teamId && opId && photoCache[photoKey(teamId, opId)]) || null;

function photoDb() {
  return new Promise((ok, fail) => {
    if (!window.indexedDB) { fail(new Error("no IndexedDB")); return; }
    const r = window.indexedDB.open(PHOTO_DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore("photos");
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fail(r.error);
  });
}
function loadPhotos() {
  if (!photosLoaded) photosLoaded = photoDb().then(db => new Promise(ok => {
    const req = db.transaction("photos", "readonly").objectStore("photos").openCursor();
    req.onsuccess = () => { const c = req.result; if (c) { photoCache[c.key] = c.value; c.continue(); } else ok(); };
    req.onerror = () => ok();
  })).catch(() => {}).then(() => window.dispatchEvent(new Event("ks-photos")));
  return photosLoaded;
}
// Save (or, with no data URL, remove) one photo.
async function setPhoto(key, dataUrl) {
  const db = await photoDb();
  await new Promise((ok, fail) => {
    const tx = db.transaction("photos", "readwrite");
    if (dataUrl) tx.objectStore("photos").put(dataUrl, key); else tx.objectStore("photos").delete(key);
    tx.oncomplete = ok;
    tx.onerror = () => fail(tx.error);
  });
  if (dataUrl) photoCache[key] = dataUrl; else delete photoCache[key];
  window.dispatchEvent(new Event("ks-photos"));
}
// A picked photo, cropped to its middle square and shrunk to PHOTO_SIZE, as a JPEG data URL.
function shrinkPhoto(file) {
  return new Promise((ok, fail) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement("canvas");
      c.width = c.height = PHOTO_SIZE;
      c.getContext("2d").drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); fail(new Error("not an image")); };
    img.src = url;
  });
}
// Redraws when photos load or change.
function usePhotos() {
  const [, redraw] = useState(0);
  useEffect(() => {
    const on = () => redraw(n => n + 1);
    window.addEventListener("ks-photos", on);
    loadPhotos();
    return () => window.removeEventListener("ks-photos", on);
  }, []);
  return photoCache;
}
