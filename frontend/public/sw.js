self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'MedBot', body: 'You have a new notification' }
  const options = {
    body: data.body,
    icon: '/assets/Logo.jpeg',
    badge: '/assets/Logo.jpeg',
    data: data.url || '/dashboard',
    vibrate: [100, 50, 100],
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data))
})
