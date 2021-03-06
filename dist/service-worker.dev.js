'use strict';

var CACHE_NAME = 'static-cache-v5';
var DATA_CACHE_NAME = 'data-cache-v1'; //list of files to cache.

var FILES_TO_CACHE = [//'/public/offline.html',
'/', '/public/styles/index.css', '/public/scripts/index.js', '/public/index.html'];
self.addEventListener('install', function (evt) {
  console.log('[ServiceWorker] Install'); //Precache static resources here.

  evt.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    console.log('[ServiceWorker] Pre-caching offline page');
    return cache.addAll(FILES_TO_CACHE);
  }));
  self.skipWaiting();
});
self.addEventListener('activate', function (evt) {
  console.log('[ServiceWorker] Activate'); //Remove previous cached data from disk.

  evt.waitUntil(caches.keys().then(function (keyList) {
    return Promise.all(keyList.map(function (key) {
      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches["delete"](key);
      }
    }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (evt) {
  console.log('[ServiceWorker] Fetch', evt.request.url);

  if (evt.request.url.includes('/public/')) {
    console.log('[Service Worker] Fetch (data)', evt.request.url);
    evt.respondWith(caches.open(DATA_CACHE_NAME).then(function (cache) {
      return fetch(evt.request).then(function (response) {
        // If the response was good, clone it and store it in the cache.
        if (response.status === 200) {
          cache.put(evt.request.url, response.clone());
        }

        return response;
      })["catch"](function (err) {
        // Network request failed, try to get it from the cache.
        return cache.match(evt.request);
      });
    }));
    return;
  }

  evt.respondWith(caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    });
  }));
});