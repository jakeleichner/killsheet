// KillSheet service worker: keeps the app, maps, scripts and fonts so it works offline.
// tools/build_deploy.py fills in VERSION and the file lists and writes deploy/sw.js.
// Do not edit deploy/sw.js by hand.
const VERSION = "__VERSION__";
const CACHE = "killsheet-" + VERSION;
const LOCAL = __LOCAL__;    // files on this site
const REMOTE = __REMOTE__;  // scripts from code libraries
const FONT_CSS = __FONTS__; // Google Fonts stylesheets (the font files they point to are cached too)
const HOSTS = ["cdnjs.cloudflare.com", "unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(LOCAL);
    await Promise.all(REMOTE.map(url => cache.add(url).catch(() => {})));
    for (const css of FONT_CSS) {
      try {
        const res = await fetch(css);
        const text = await res.clone().text();
        await cache.put(css, res);
        const fonts = [...text.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]);
        await Promise.all(fonts.map(url => cache.add(url).catch(() => {})));
      } catch (e) { /* fonts are a nicety; the app still works without them */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith("killsheet-") && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const local = url.origin === self.location.origin;
  if (!local && !HOSTS.includes(url.hostname)) return; // e.g. PeerJS signalling: always live

  // The page itself: try the network first so updates arrive, fall back to the saved copy offline.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        if (res.ok) cache.put("./", res.clone());
        return res;
      } catch (e) {
        return (await cache.match("./")) || (await cache.match("index.html")) || Response.error();
      }
    })());
    return;
  }

  // Everything else (maps, icons, scripts, fonts): saved copy first, then the network.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: local });
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  })());
});
