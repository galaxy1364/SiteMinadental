'use strict';
const VERSION='2026.09.06.2';
const BASE_URL=new URL('./',self.location.href);
const path=(v='')=>new URL(v,BASE_URL).pathname;
const STATIC_CACHE=`mina-public-static-${VERSION}`;
const RUNTIME_CACHE=`mina-public-runtime-${VERSION}`;
const PRECACHE=[path(''),path('index.html'),path('offline.html'),path('manifest.webmanifest'),path('assets/css/site.css'),path('assets/js/site.js'),path('icons/icon-192.png'),path('icons/icon-512.png'),path('icons/icon-maskable-512.png'),path('services/'),path('guides/'),path('experience/'),path('safety/dental-emergency/')];
const SENSITIVE=[path('api/'),path('portal/'),path('admin/'),path('admin.html'),path('booking/')];
const NEVER_CACHE=new Set([path('config.js'),path('version.json'),path('sw.js'),path('search-index.json')]);
const MUTABLE_RUNTIME=new Set([path('assets/css/site.css'),path('assets/js/site.js'),path('manifest.webmanifest')]);
const isSensitive=p=>SENSITIVE.some(prefix=>p===prefix||p.startsWith(prefix));
const canStore=(req,res)=>req.method==='GET'&&res?.ok&&['basic','cors','default'].includes(res.type||'default');
self.addEventListener('install',event=>event.waitUntil(caches.open(STATIC_CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mina-')&&![STATIC_CACHE,RUNTIME_CACHE].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
async function networkFirst(req){try{const res=await fetch(req,{cache:'no-store'});if(canStore(req,res)){const cache=await caches.open(RUNTIME_CACHE);await cache.put(req,res.clone())}return res}catch{return (await caches.match(req))||(await caches.match(path('offline.html')))}}
async function cacheFirst(req){const hit=await caches.match(req);if(hit)return hit;const res=await fetch(req);if(canStore(req,res)){const cache=await caches.open(RUNTIME_CACHE);await cache.put(req,res.clone())}return res}
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;if(isSensitive(url.pathname)||NEVER_CACHE.has(url.pathname)){event.respondWith(fetch(req,{cache:'no-store'}));return}if(req.mode==='navigate'||MUTABLE_RUNTIME.has(url.pathname)){event.respondWith(networkFirst(req));return}if(url.pathname.startsWith(BASE_URL.pathname))event.respondWith(cacheFirst(req))});