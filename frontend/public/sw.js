const CACHE_NAME = 'medbot-v1'
const STATIC_CACHE = 'medbot-static-v1'
const DYNAMIC_CACHE = 'medbot-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/Logoico.png',
  '/assets/Logo.jpeg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
        }
        return response
      }).catch(() => cached)
      return cached || fetched
    })
  )
})

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'MedBot', body: 'You have a new notification' }
  const options = {
    body: data.body,
    icon: '/assets/Logo.jpeg',
    badge: '/assets/Logoico.png',
    data: data.url || '/dashboard',
    vibrate: [100, 50, 100],
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data))
})
