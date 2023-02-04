/**
 * @file
 *
 * YE Channel service workers
 */

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('mba').then(function(cache) {
      return cache.addAll([

      ])
    })
    .catch((error) => {
      console.error(error)
    })
  )
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request)
    })
      .catch((error) => {
        console.error(error)
      })
  )
})