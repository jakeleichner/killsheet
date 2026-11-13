/* ═══ OPERATIVE PHOTOS ═══ */
// Photos of your own painted models (owner, Nov 13). One per operative type for each army ("Kasrkin Trooper"), so every
// roster of that team uses it, new or saved, and five Troopers share one photo. Kept on this device in IndexedDB (too
// big for the normal saves), shrunk to a small square first, and included in backup files. Shown with the name, never
// instead of it, and only on your own operatives: the other side's models aren't yours, even in a mirror match.
const PHOTO_DB = "killsheet-photos";
const PHOTO_SIZE = 320; // pixels square; about 20-40 KB each
const photoCache = {}; // "team|operative type" -> data URL
const photoTimes = {}; // "team|operative type" -> when it last changed (for syncing with an account; 1 for photos from before)
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
    req.onsuccess = () => {
      const c = req.result;
      if (!c) { ok(); return; }
      const v = c.value; // { url, t }, or a bare data URL from before photos synced
      photoCache[c.key] = typeof v === "string" ? v : v.url;
      photoTimes[c.key] = typeof v === "string" ? 1 : v.t || 1;
      c.continue();
    };
    req.onerror = () => ok();
  })).catch(() => {}).then(() => window.dispatchEvent(new Event("ks-photos")));
  return photosLoaded;
}
// Save (or, with no data URL, remove) one photo. t: when it changed; fromSync: it came from the account, so don't
// send it back. A removal is remembered (ks_photoDeleted), so a signed-in account removes it on other devices too.
async function setPhoto(key, dataUrl, t, fromSync) {
  const when = t || Date.now();
  const db = await photoDb();
  await new Promise((ok, fail) => {
    const tx = db.transaction("photos", "readwrite");
    if (dataUrl) tx.objectStore("photos").put({ url: dataUrl, t: when }, key); else tx.objectStore("photos").delete(key);
    tx.oncomplete = ok;
    tx.onerror = () => fail(tx.error);
  });
  if (dataUrl) { photoCache[key] = dataUrl; photoTimes[key] = when; }
  else { delete photoCache[key]; delete photoTimes[key]; writeStored("photoDeleted", { ...readStored("photoDeleted", {}), [key]: when }); }
  window.dispatchEvent(new Event("ks-photos"));
  if (!fromSync && typeof scheduleSync === "function") scheduleSync();
}
// Stage 3: photos back up with the account (/api/photos, server/account.js). For each photo, the newest change wins,
// here or there; a removal counts as a change. Runs after each cloud backup (syncNow).
async function syncPhotos() {
  await loadPhotos();
  const got = await fetchWithin("/api/photos", { cache: "no-store" });
  if (!got.ok) return;
  const remote = (await got.json()).items || {};
  const deleted = readStored("photoDeleted", {});
  const keys = new Set([...Object.keys(photoCache), ...Object.keys(deleted), ...Object.keys(remote)]);
  for (const key of keys) {
    const lt = photoCache[key] ? photoTimes[key] || 1 : -1, ld = deleted[key] || -1, r = remote[key], rt = r ? r.t : -1;
    const here = Math.max(lt, ld);
    if (rt > here) {
      if (r.gone) { if (photoCache[key]) await setPhoto(key, null, rt, true); else writeStored("photoDeleted", { ...readStored("photoDeleted", {}), [key]: rt }); }
      else {
        const one = await fetchWithin("/api/photos?key=" + encodeURIComponent(key), { cache: "no-store" });
        if (one.ok) { const j = await one.json(); if (j && j.data) await setPhoto(key, j.data, j.t, true); }
      }
    } else if (here > rt) {
      const body = ld > lt ? { key, data: null, t: ld } : { key, data: photoCache[key], t: lt };
      await fetchWithin("/api/photos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
  }
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
// Online play (stage 2): the photos of the operatives in your roster, for your opponent's screen during that game.
// Off with Settings, Privacy, "Show my photos to my opponent" (ks_sharePhotos).
function photosToShare(teamId, roster) {
  if (readStored("sharePhotos", true) === false || !teamId) return null;
  const items = {};
  (roster || []).forEach(o => { const k = photoKey(teamId, o.id); if (photoCache[k]) items[k.slice(teamId.length + 1)] = photoCache[k]; });
  return Object.keys(items).length ? { team: teamId, items } : null;
}
// What arrives from the other phone: kept (in memory, for that game) only if each is a small JPEG photo.
const OPP_PHOTO_MAX = 200000; // characters, about 150 KB
function acceptOppPhotos(p) {
  if (!p || typeof p.team !== "string" || !p.items || typeof p.items !== "object") return null;
  const items = {};
  Object.entries(p.items).slice(0, 40).forEach(([k, v]) => {
    if (k.length < 80 && typeof v === "string" && v.length <= OPP_PHOTO_MAX && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(v)) items[k] = v;
  });
  return Object.keys(items).length ? { team: p.team, items } : null;
}
// Redraws when photos load or change; returns a number that changes with them.
function usePhotos() {
  const [version, redraw] = useState(0);
  useEffect(() => {
    const on = () => redraw(n => n + 1);
    window.addEventListener("ks-photos", on);
    loadPhotos();
    return () => window.removeEventListener("ks-photos", on);
  }, []);
  return version;
}
