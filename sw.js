const cacheName = "news-v1";
const staticAssets = [
  "./",
  "./index.html",
  "./style.css",
  "./style.css.map",
  "./style.scss",
  "./index.js",
  "./manifest.webmanifest",
];

self.addEventListener("install", async (e) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  // it can be empty if you just want to get rid of that error
});
