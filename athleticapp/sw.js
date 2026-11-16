// Service worker de la dirección vieja: se borra solo y recarga las pestañas hacia la app nueva.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('athleticapp')).map(k => caches.delete(k))))
  .then(() => self.registration.unregister()).then(() => self.clients.matchAll()).then(cs => cs.forEach(c => c.navigate('/')))));
