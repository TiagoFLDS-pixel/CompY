const CACHE_NAME = "compy-v12-utf8-fix";

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./config.supabase.js",
  "./manifest.webmanifest",
  "./logo.png",
  "./data/compatibilidades.js"
];

const NETWORK_FIRST_PATHS = [
  "/",
  "/index.html",
  "/app.js",
  "/data/compatibilidades.js",
  "/service-worker.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const shouldUseNetworkFirst =
    event.request.method === "GET" &&
    url.origin === self.location.origin &&
    NETWORK_FIRST_PATHS.some(path => url.pathname.endsWith(path));

  if (shouldUseNetworkFirst) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
