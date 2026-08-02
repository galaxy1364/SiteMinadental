const VERSION = '2026.08.02.1';
const BASE = '/SiteMinadental/';
const CACHE = `mina-dental-${VERSION}`;
const CORE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}pwa.js`,
  `${BASE}pwa-icon.png`,
  `${BASE}assets/index-ClUC_4GS.js`,
  `${BASE}assets/index-SCz4HByz.css`,
  `${BASE}before-after.jpg`,
  `${BASE}clinic-interior.jpg`,
  `${BASE}doctor-portrait.jpg`,
  `${BASE}hero-bg.jpg`,
  `${BASE}service-implant.jpg`,
  `${BASE}service-orthodontics.jpg`,
  `${BASE}service-pediatric.jpg`,
  `${BASE}service-rootcanal.jpg`,
  `${BASE}service-veneer.jpg`,
  `${BASE}service-whitening.jpg`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('mina-dental-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(`${BASE}index.html`, copy));
          return response;
        })
        .catch(() => caches.match(`${BASE}index.html`))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
      return cached || network;
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
