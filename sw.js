const CACHE_NAME = 'animanga-tracker-v4.2.0';
const urlsToCache = [
  '/animanga-tracker/',
  '/animanga-tracker/index.html',
  '/animanga-tracker/manifest.json',
  '/animanga-tracker/icon-192x192.png',
  '/animanga-tracker/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  console.log('Service Worker installing v4.2.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Service Worker fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating v4.2.0');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
