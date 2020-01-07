importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

if (workbox) {
  console.log(`Workbox is loaded.`);
  workbox.precaching.precacheAndRoute([]);
  const matchCb = ({ url, event }) => {
    return url.pathname === "/assets/*/.(?:png|css|jpg|js)$/" || "index.html";
  };

  workbox.routing.registerRoute(
    matchCb,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "images",
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    new RegExp("http://article.com"),
    workbox.strategies.networkFirst({
      cacheName: "api"
    })
  );
  self.addEventListener("push", event => {
    var msg = event.data.json();
    event.waitUntil(self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: msg.icon,
      actions: msg.actions}));
  
  self.addEventListener('notificationclick', function(event) {
  if (event.action == "View")
    {
      clients.openWindow("http://vue.article.com");  
    }  
  }, false);
  });
}
else {
  console.log(`Workbox loading failed.`);
}
