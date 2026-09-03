'use strict';

const VERSION = '2026.08.05.1';
const BASE_URL = new URL('./', self.location.href);
const BASE = BASE_URL.pathname;
const STATIC_CACHE = `mina-dental-static-${VERSION}`;
const RUNTIME_CACHE = `mina-dental-runtime-${VERSION}`;

const path = (value = '') => new URL(value, BASE_URL).pathname;
const PRECACHE = [
  path(''), path('index.html'), path('manifest.webmanifest'),
  path('path-fix.js'), path('site-hardening.js'), path('pwa-runtime.js'),
  path('assets/index-ClUC_4GS.js'), path('assets/index-SCz4HByz.css'),
  path('before-after.jpg'), path('clinic-interior.jpg'), path('doctor-portrait.jpg'), path('hero-bg.jpg'),
  path('service-implant.jpg'), path('service-orthodontics.jpg'), path('service-pediatric.jpg'),
  path('service-rootcanal.jpg'), path('service-veneer.jpg'), path('service-whitening.jpg'),
  path('icons/icon-192.png'), path('icons/icon-512.png'), path('icons/icon-maskable-512.png'),
  path('icons/apple-touch-icon.png'), path('icons/favicon-32.png')
];

const SENSITIVE_PREFIXES = [path('api/'), path('portal/'), path('admin/'), path('admin.html')];
const NO_CACHE_PATHS = new Set([path('config.js'), path('version.json'), path('sw.js')]);
const isSensitive = (pathname) =>
  SENSITIVE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('mina-dental-') && ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

const canStore = (request, response) =>
  request.method === 'GET' &&
  response?.ok &&
  ['basic', 'cors', 'default'].includes(response.type || 'default');

const networkFirstPublicNavigation = async (request) => {
  try {
    const response = await fetch(request);
    if (canStore(request, response)) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match(path('index.html')));
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (canStore(request, response) || response?.type === 'opaque') {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache or synthesize fallbacks for mutable truth data or future authenticated/clinical/admin/API surfaces.
  if (url.origin === self.location.origin && (isSensitive(url.pathname) || NO_CACHE_PATHS.has(url.pathname))) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPublicNavigation(request));
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
  }
});
