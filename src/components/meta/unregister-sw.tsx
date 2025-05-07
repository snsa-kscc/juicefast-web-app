"use client";

import { useEffect } from "react";

export function UnregisterServiceWorker() {
  useEffect(() => {
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
          console.log('ServiceWorker unregistered');
        }
      });
    }

    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      });
    }

    // Also try to clear the specific cache you mentioned
    if ('caches' in window) {
      caches.delete('taurus-cache-v1').then(function(success) {
        console.log('taurus-cache-v1 deletion was successful:', success);
      });
      // Also try juicefast-cache-v1 from your sw.js
      caches.delete('juicefast-cache-v1').then(function(success) {
        console.log('juicefast-cache-v1 deletion was successful:', success);
      });
    }
  }, []);

  return null;
}
