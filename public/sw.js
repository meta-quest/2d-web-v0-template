/*
 * Minimal, dependency-free service worker for Quest PWA installability +
 * offline fallback.
 *
 * Strategy:
 * - Precache the app shell + offline page on install.
 * - Navigations: network-first, fall back to the cached offline page.
 * - Static assets (script/style/image/font): stale-while-revalidate.
 *
 * For richer offline/precaching, swap this for Serwist (@serwist/next). See
 * docs/QUEST_GUIDELINES.md.
 */

const VERSION = "v1";
const CACHE = `v0-quest-${VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE = ["/", OFFLINE_URL, "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // App navigations: network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE);
          return (
            (await cache.match(request)) ??
            (await cache.match(OFFLINE_URL)) ??
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  const dest = request.destination;
  if (["script", "style", "image", "font"].includes(dest)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached ?? network;
      })(),
    );
  }
});
