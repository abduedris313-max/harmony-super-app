/**
 * @file sw.js
 * @description Advanced Service Worker for Harmony OS Super App.
 * Implements Stale-While-Revalidate caching for static assets & mini-app code chunks,
 * Cache-First for media/fonts, and offline snapshot data caching for true offline functionality.
 */

const SHELL_CACHE_NAME = 'harmony-os-shell-v3';
const DATA_CACHE_NAME = 'harmony-os-data-v3';
const ASSETS_CACHE_NAME = 'harmony-os-assets-v3';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './harmony-logo.jpg'
];

// Install Event: Precaches App Shell with resilient fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME).then(async (cache) => {
      console.log('[SW] Precaching Harmony OS app shell');
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Precache skipped for:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: Prunes old caches & claims clients
self.addEventListener('activate', (event) => {
  const currentCaches = [SHELL_CACHE_NAME, DATA_CACHE_NAME, ASSETS_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting deprecated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message Event: Caches Mini-App data snapshots & offline payloads sent from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_MINI_APP_SNAPSHOT') {
    const { key, data, timestamp } = event.data;
    const url = new URL(`/offline-cache/${key}`, self.location.origin).href;
    const responsePayload = new Response(JSON.stringify({ key, data, timestamp }), {
      headers: {
        'Content-Type': 'application/json',
        'X-Harmony-Cached-At': new Date(timestamp || Date.now()).toISOString()
      }
    });

    caches.open(DATA_CACHE_NAME).then((cache) => {
      cache.put(url, responsePayload);
      console.log(`[SW] Mini-app snapshot cached for key: ${key}`);
    }).catch((err) => {
      console.warn('[SW] Failed to cache mini-app snapshot:', err);
    });
  }
});

// Fetch Event: Tiered caching strategies (Stale-While-Revalidate for static assets & code chunks)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or unsupported schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle synthetic offline data cache endpoints
  if (url.pathname.startsWith('/offline-cache/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response(JSON.stringify({ status: 'not_found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Navigation Requests: Network-First with HTML App Shell fallback for single-page app
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match('./') || caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Static Assets and Code Chunks (JS, CSS, Fonts, Images, Icons, CDNs)
  const isStaticAssetOrChunk = 
    url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|webp|ico|woff|woff2|ttf|wasm)$/) ||
    url.pathname.includes('/assets/') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('images.unsplash.com');

  if (isStaticAssetOrChunk) {
    // Stale-While-Revalidate Caching Strategy
    event.respondWith(
      caches.open(ASSETS_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((err) => {
              console.log('[SW] Fetch failed in SWR for asset:', request.url, err);
            });

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // API Requests & General Dynamic Resources: Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DATA_CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
