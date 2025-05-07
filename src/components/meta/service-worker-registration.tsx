"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function(error) {
            console.log('ServiceWorker registration failed: ', error);
          }
        );
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
