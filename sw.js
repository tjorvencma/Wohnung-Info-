/* Wohnungsplaner: Service Worker. Immer zuerst frisch aus dem Netz laden, nur ohne Netz auf die zuletzt gespeicherte Fassung zurückgreifen. */
var V = 'wp-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(['./', 'manifest.webmanifest', 'icon-192.png']); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(r, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r.mode === 'navigate' ? './' : r, cp); }).catch(function () {}); }
      return res;
    }).catch(function () {
      return caches.match(r, { ignoreSearch: true }).then(function (x) { return x || (r.mode === 'navigate' ? caches.match('./') : undefined) || Response.error(); });
    })
  );
});
