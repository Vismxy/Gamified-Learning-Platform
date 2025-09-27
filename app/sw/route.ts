import { NextResponse } from "next/server"

export async function GET() {
  const swContent = `
const CACHE_NAME = "stem-gamify-v1"
const STATIC_CACHE = "stem-gamify-static-v1"
const DYNAMIC_CACHE = "stem-gamify-dynamic-v1"

// Assets to cache immediately
const STATIC_ASSETS = ["/", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg", "/offline"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Caching static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("[SW] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Handle static assets with cache-first strategy
  if (
    request.destination === "image" ||
    request.destination === "script" ||
    request.destination === "style" ||
    url.pathname.includes("/_next/static/")
  ) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Handle navigation requests with network-first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request))
    return
  }

  // Default strategy for other requests
  event.respondWith(networkFirstStrategy(request))
})

// Network-first strategy (good for API calls and dynamic content)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/offline")
    }
    throw error
  }
}

// Cache-first strategy (good for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] Failed to fetch:", request.url)
    throw error
  }
}

// Navigation strategy (for page requests)
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    console.log("[SW] Navigation failed, serving offline page")
    return caches.match("/offline") || caches.match("/")
  }
}

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "sync-user-data") {
    event.waitUntil(syncUserData())
  }

  if (event.tag === "sync-progress") {
    event.waitUntil(syncProgress())
  }
})

// Sync user data when online
async function syncUserData() {
  try {
    // Get pending data from IndexedDB
    const pendingData = await getPendingData()

    for (const data of pendingData) {
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        // Remove from pending after successful sync
        await removePendingData(data.id)
      } catch (error) {
        console.log("[SW] Failed to sync data:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Sync failed:", error)
  }
}

// Sync progress data
async function syncProgress() {
  try {
    const pendingProgress = await getPendingProgress()

    for (const progress of pendingProgress) {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(progress),
        })
        await removePendingProgress(progress.id)
      } catch (error) {
        console.log("[SW] Failed to sync progress:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Progress sync failed:", error)
  }
}

// Helper functions for IndexedDB operations
async function getPendingData() {
  return []
}

async function removePendingData(id) {
  // Remove data from IndexedDB
}

async function getPendingProgress() {
  return []
}

async function removePendingProgress(id) {
  // Remove progress from IndexedDB
}

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icon-192.jpg",
      badge: "/icon-192.jpg",
      data: data.data,
      actions: [
        {
          action: "open",
          title: "Open App",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow("/"))
  }
})
`

  return new NextResponse(swContent, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
