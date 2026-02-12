const CACHE_NAME = '{{ CACHE_NAME }}-{{ VERSION }}';
const urlsToCache = [
    '/static/pwa/icons/icon-192x192.png',
    '/static/pwa/icons/icon-512x512.png',
    
    
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
    '/static/css/style.css',
    '/static/css/about.css',
    '/static/css/apply.css',
    '/static/css/dashboard.css',
    '/static/css/main.css',
    '/static/js/about.js',
    '/static/js/apply.js',
    '/static/js/main.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    
];

// Événement d'installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Événement d'activation
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Événement de fetch
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(response => {
                        // Vérifier si la réponse est valide
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cloner la réponse pour le cache
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                if (event.request.destination === 'style' ||
                                    event.request.destination === 'script' ||
                                    event.request.destination === 'image' ||
                                    event.request.destination === 'font') {
                                    cache.put(event.request, responseToCache);
                                }
                                {% comment %} cache.put(event.request, responseToCache); {% endcomment %}
                            });

                        return response;
                    })
                    .catch(() => {
                        // Si c'est une navigation, retourner la page hors ligne
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline/');
                        }
                        return new Response('Hors ligne', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});