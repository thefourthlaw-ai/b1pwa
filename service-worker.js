const CACHE_NAME = 'hello-world-pwa-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './icon.png',
  './qr-list.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).then(() => {
        return fetch('./qr-list.json').then(response => response.json()).then(qrList => {
          return Promise.all(
            qrList.map(qrName => {
              const qrUrl = `./qr/${qrName}`;
              return fetch(qrUrl).then(qrResponse => {
                if (qrResponse.ok) {
                  return cache.put(qrUrl, qrResponse);
                }
              });
            })
          );
        });
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        if (event.request.url.includes('qr/')) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
