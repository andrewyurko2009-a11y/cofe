const CACHE_NAME = 'delsenzo-v1';
const assets = ['./index.html', './style.css', './script.js'];

// Установка воркера и кэширование базовых файлов
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assets);
        })
    );
});

// Запрос файлов из кэша, если нет интернета
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return cachedResponse || fetch(e.request);
        })
    );
});
