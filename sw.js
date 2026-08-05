'use strict';
const VERSION = '2026.08.05.1';
const BASE = '/SiteMinadental/';
const STATIC_CACHE = `mina-dental-static-${VERSION}`;
const RUNTIME_CACHE = `mina-dental-runtime-${VERSION}`;
const PRECACHE = [
  BASE, `${BASE}index.html`, `${BASE}manifest.webmanifest`, `${BASE}version.json`,
  `${BASE}path-fix.js`, `${BASE}site-hardening.js`, `${BASE}pwa-runtime.js`,
  `${BASE}assets/index-ClUC_4GS.js`, `${BASE}assets/index-SCz4HByz.css`,
  `${BASE}before-after.jpg`, `${BASE}clinic-interior.jpg`, `${BASE}doctor-portrait.jpg`, `${BASE}hero-bg.jpg`,
  `${BASE}service-implant.jpg`, `${BASE}service-orthodontics.jpg`, `${BASE}service-pediatric.jpg`,
  `${BASE}service-rootcanal.jpg`, `${BASE}service-veneer.jpg`, `${BASE}service-whitening.jpg`,
  `${BASE}icons/icon-192.png`, `${BASE}icons/icon-512.png`, `${BASE}icons/icon-maskable-512.png`,
  `${BASE}icons/apple-touch-icon.png`, `${BASE}icons/favicon-32.png`
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('mina-dental-') && ![STATIC_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    if (response?.ok) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match(`${BASE}index.html`));
  }
};
const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
  return response;
};
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') event.respondWith(cacheFirst(event.request));
});
