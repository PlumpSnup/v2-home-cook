// HomeCook service worker: shows order alerts and opens the right page when one is tapped.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let message = { title: "HomeCook", body: "", url: "/", tag: undefined };
  try {
    message = { ...message, ...event.data.json() };
  } catch {
    // Not JSON: show whatever text came through.
    if (event.data) message.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-96.png",
      tag: message.tag,
      renotify: Boolean(message.tag),
      data: { url: message.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      // Reuse an open HomeCook tab if there is one, otherwise open a new one.
      const tabs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const tab of tabs) {
        if (new URL(tab.url).origin === self.location.origin && "focus" in tab) {
          await tab.navigate(url);
          return tab.focus();
        }
      }
      return self.clients.openWindow(url);
    })(),
  );
});
