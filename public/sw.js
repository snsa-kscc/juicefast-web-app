// This is a replacement service worker that will clear caches and unregister itself
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    // Clear all caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Clear all caches again during activation
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache during activation:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      // Unregister itself
      return self.registration.unregister();
    })
  );
});

// No-op fetch handler to prevent any caching
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
