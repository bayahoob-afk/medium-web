// Service Worker ของ Medium — ทำให้เว็บติดตั้งเป็นแอปและเปิดออฟไลน์ได้
const CACHE = "medium-v1";
const CORE = [
  "./index.html", "./seers.html", "./session.html", "./medium.html", "./dashboard.html",
  "./assets/css/style.css", "./assets/js/app.js",
  "./data/seers.js", "./data/personas.js",
  "./manifest.webmanifest", "./icon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // API ต้องสดเสมอ ไม่ cache
  // network-first: ได้ของใหม่เสมอเมื่อออนไลน์, ออฟไลน์ใช้ cache
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
