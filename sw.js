const CACHE_NAME = 'animal-sounds-v7';

const CORE_ASSETS = [
    './',
    './index.html',
    './app.js',
    './animals.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Core assets: cache first
    if (!url.includes('/sounds/') && !url.includes('/images/')) {
        event.respondWith(
            caches.match(event.request).then((cached) => cached || fetch(event.request))
        );
        return;
    }

    // Media: network first, cache for offline
    event.respondWith(
        fetch(event.request).then((response) => {
            if (response.ok) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => caches.match(event.request).then((cached) => cached || new Response('', { status: 503 })))
    );
});
