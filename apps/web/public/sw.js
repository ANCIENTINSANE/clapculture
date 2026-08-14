self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // A basic fetch handler is required by Chrome to trigger the PWA install prompt.
  // We just let the network handle it by default for this simple implementation.
  event.respondWith(fetch(event.request).catch(() => new Response("Network error")));
});
