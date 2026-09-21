// sw.js - Service Worker con attivazione immediata e notifiche
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

let timerId = null;

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.action === 'START_TIMER') {
    if (timerId) clearTimeout(timerId);

    const delayMs = event.data.seconds * 1000;

    timerId = setTimeout(() => {
      self.registration.showNotification("⏱️ Recupero Terminato!", {
        body: "Tempo scaduto, è ora di iniziare la serie successiva!",
        icon: "https://cdn-icons-png.flaticon.com/512/1216/1216895.png",
        vibrate: [500, 250, 500, 250, 500],
        tag: "workout-timer",
        renotify: true,
        requireInteraction: true
      });
      timerId = null;
    }, delayMs);
  } 
  else if (event.data.action === 'STOP_TIMER') {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});