// Restbeat: service worker. La app va siempre a la red y, sin conexión, usa la última copia (nunca datos).
// v0.17: las librerías externas con versión fija (supabase-js, xlsx) se guardan para poder abrir la app sin conexión.
const CACHE = 'restbeat-v0.24';
const LIBS = ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js', 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './manifest.webmanifest', './icon-v5-192.png', ...LIBS]))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin === 'https://cdn.jsdelivr.net' && /@\d+\.\d+\.\d+\//.test(u.pathname)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => { const c = n.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return n; })));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
