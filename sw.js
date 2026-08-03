const VERSION = '2026.08.03.11';
const BASE = '/SiteMinadental/';
const CACHE = `mina-dental-${VERSION}`;
const CORE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}pwa.js`,
  `${BASE}site-core.js`,
  `${BASE}booking-engine.js`,
  `${BASE}install-promotion.js`,
  `${BASE}ai-assistant.js`,
  `${BASE}content-hub.js`,
  `${BASE}content-upgrade.js`,
  `${BASE}content-data.json`,
  `${BASE}clinic-config.json`,
  `${BASE}apple-touch-icon-180.png`,
  `${BASE}pwa-icon-192.png`,
  `${BASE}pwa-icon-512.png`,
  `${BASE}pwa-icon-maskable-512.png`,
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
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
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
          if (response.ok) caches.open(CACHE).then(cache => cache.put(`${BASE}index.html`, response.clone()));
          return response;
        })
        .catch(() => caches.match(`${BASE}index.html`))
    );
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data?.json() || {}; } catch { payload = { body: event.data?.text() || '' }; }
  const title = payload.title || 'مینا دنتال';
  const options = {
    body: payload.body || 'یک اطلاعیه جدید از کلینیک دارید.',
    icon: `${BASE}pwa-icon-192.png`,
    badge: `${BASE}pwa-icon-192.png`,
    data: { url: payload.url || `${BASE}` },
    tag: payload.tag || 'mina-dental-notification',
    renotify: Boolean(payload.renotify)
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || BASE, self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(client => client.url.startsWith(self.location.origin + BASE));
      if (existing) { existing.navigate(target); return existing.focus(); }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION') event.source?.postMessage({ type: 'VERSION', version: VERSION });
});
