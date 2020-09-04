'use strict';

var CACHE_NAME = 'static-cache-v1'; //list of files to cache.

var FILES_TO_CACHE = ['/public/offline.html'];
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
      if (key !== CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches["delete"](key);
      }
    }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (evt) {
  console.log('[ServiceWorker] Fetch', evt.request.url); //Add fetch event handler here.

  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }

  evt.respondWith(fetch(evt.request)["catch"](function () {
    return caches.open(CACHE_NAME).then(function (cache) {
      return cache.match('/public/offline.html');
    });
  }));
});