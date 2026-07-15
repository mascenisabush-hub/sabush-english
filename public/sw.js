/**
 * Sabush Notification Service Worker
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus or open the application window
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Listen for messages from client to trigger notifications directly from Service Worker context
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon, badge, data } = event.data.payload || {};
    event.waitUntil(
      self.registration.showNotification(title || 'Sabush English Club 🦉', {
        body: body || '',
        tag: tag || 'general-nudge',
        icon: icon || '/logo.jpg',
        badge: badge || '/logo.jpg',
        data: data || {},
        requireInteraction: true
      })
    );
  }
});

