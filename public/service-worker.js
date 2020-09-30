const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.webmanifest",
  "/styles.css",
  "/dist/icons/background.png",
  "/dist/icons/budget.png",
  "/dist/icons/icon-96x96.png",
  "/dist/icons/icon-128x128.png",
  "/dist/icons/icon-192x192.png",
  "/dist/icons/icon-256x256.png",
  "/dist/icons/icon-384x384.png",
  "/dist/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install
self.addEventListener("install", evt => {
  // pre cache all static assets
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Files pre-cached.");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // tell the browser to activate this service worker immediately once it has finished installing
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

//fetch
self.addEventListener("fetch", evt => {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                //cache.put(evt.request, response.clone());
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              console.log(err);
              return cache.match(evt.request);
            });
        })
        .catch(err => console.log(err))
    );
  } else {
    evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
        });
      })
    );
  }
});
