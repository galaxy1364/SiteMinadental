const VERSION = '2026.08.03.13';
const BASE = '/SiteMinadental/';
const STATIC_CACHE = `mina-dental-static-${VERSION}`;
const RUNTIME_CACHE = `mina-dental-runtime-${VERSION}`;
const CACHE_PREFIXES = ['mina-dental-static-', 'mina-dental-runtime-', 'mina-dental-'];

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
  `${BASE}hero-bg.jpg`,
  `${BASE}doctor-portrait.jpg`,
  `${BASE}clinic-interior.jpg`
];

const OPTIONAL = [
  `${BASE}before-after.jpg`,
  `${BASE}service-implant.jpg`,
  `${BASE}service-orthodontics.jpg`,
  `${BASE}service-pediatric.jpg`,
  `${BASE}service-rootcanal.jpg`,
  `${BASE}service-veneer.jpg`,
  `${BASE}service-whitening.jpg`
];

const putIfValid = async (cache, request, response) => {
  if (response && response.ok && response.type !== 'opaque') {
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    const results = await Promise.allSettled(CORE.map(async url => {
      const response = await fetch(url, { cache: 'reload' });
      if (!response.ok) throw new Error(`Precache ${response.status}: ${url}`);
      await cache.put(url, response);
    }));
    const failedCore = results.filter(result => result.status === 'rejected');
    if (failedCore.length) console.error('Core precache failures', failedCore);
    await Promise.allSettled(OPTIONAL.map(async url => {
      const response = await fetch(url, { cache: 'reload' });
      if (response.ok) await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const valid = new Set([STATIC_CACHE, RUNTIME_CACHE]);
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      const owned = CACHE_PREFIXES.some(prefix => key.startsWith(prefix));
      return owned && !valid.has(key) ? caches.delete(key) : Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});

const networkFirst = async request => {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    return putIfValid(cache, request, response);
  } catch {
    return (await cache.match(request)) || (await caches.match(`${BASE}index.html`)) || Response.error();
  }
};

const staleWhileRevalidate = async request => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await caches.match(request);
  const networkPromise = fetch(request)
    .then(response => putIfValid(cache, request, response))
    .catch(() => null);
  return cached || (await networkPromise) || Response.error();
};

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  const dynamic = /clinic-config\.json$|content-data\.json$|manifest\.webmanifest$/.test(url.pathname);
  if (dynamic) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});

self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data?.json() || {}; } catch { payload = { body: event.data?.text() || '' }; }
  const title = payload.title || 'مینا دنتال';
  const options = {
    body: payload.body || 'یک اطلاعیه جدید از کلینیک دارید.',
    icon: `${BASE}pwa-icon-192.png`,
    badge: `${BASE}pwa-icon-192.png`,
    data: { url: payload.url || BASE },
    tag: payload.tag || 'mina-dental-notification',
    renotify: Boolean(payload.renotify),
    requireInteraction: Boolean(payload.requireInteraction),
    actions: Array.isArray(payload.actions) ? payload.actions.slice(0, 2) : []
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || BASE, self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const existing = list.find(client => client.url.startsWith(self.location.origin + BASE));
    if (existing) {
      existing.navigate(target);
      return existing.focus();
    }
    return clients.openWindow(target);
  }));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION') event.source?.postMessage({ type: 'VERSION', version: VERSION });
  if (event.data?.type === 'CLEAR_RUNTIME_CACHE') event.waitUntil(caches.delete(RUNTIME_CACHE));
});
