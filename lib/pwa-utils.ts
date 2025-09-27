"use client"

// PWA utility functions
export class PWAUtils {
  private static instance: PWAUtils

  static getInstance(): PWAUtils {
    if (!PWAUtils.instance) {
      PWAUtils.instance = new PWAUtils()
    }
    return PWAUtils.instance
  }

  // Register service worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.log("Service Worker not supported")
      return null
    }

    try {
      console.log("Attempting to register service worker...")

      // For now, disable service worker registration to avoid MIME type issues
      // This can be re-enabled when deploying to a proper server environment
      console.log("Service Worker registration disabled in preview environment")
      return null

      /* 
      // This would work in a production environment:
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      console.log("Service Worker registered successfully:", registration)

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available
              this.showUpdateAvailable()
            }
          })
        }
      })

      return registration
      */
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return null
    }
  }

  // Check if app can be installed
  canInstall(): boolean {
    return typeof window !== "undefined" && "BeforeInstallPromptEvent" in window
  }

  // Trigger app installation
  async installApp(): Promise<boolean> {
    if (typeof window === "undefined") return false

    const deferredPrompt = (window as any).deferredPrompt
    if (!deferredPrompt) {
      console.log("Install prompt not available")
      return false
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log("Install prompt outcome:", outcome)

      // Clear the deferred prompt
      ;(window as any).deferredPrompt = null

      return outcome === "accepted"
    } catch (error) {
      console.error("Install failed:", error)
      return false
    }
  }

  // Check if app is installed
  isInstalled(): boolean {
    if (typeof window === "undefined") return false

    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
  }

  // Check network status
  isOnline(): boolean {
    if (typeof window === "undefined") return true
    return navigator.onLine
  }

  // Listen for network changes
  onNetworkChange(callback: (isOnline: boolean) => void): () => void {
    if (typeof window === "undefined") return () => {}

    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }

  // Request background sync (fallback without service worker)
  async requestBackgroundSync(tag: string): Promise<void> {
    if (typeof window === "undefined") return

    try {
      // Store sync request in localStorage as fallback
      const pendingSyncs = JSON.parse(localStorage.getItem("pending-syncs") || "[]")
      pendingSyncs.push({ tag, timestamp: Date.now() })
      localStorage.setItem("pending-syncs", JSON.stringify(pendingSyncs))

      console.log("Background sync request stored:", tag)
    } catch (error) {
      console.error("Background sync storage failed:", error)
    }
  }

  // Show update available notification
  private showUpdateAvailable(): void {
    // This would typically show a toast or modal
    console.log("New version available! Please refresh the page.")

    // You could dispatch a custom event here
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sw-update-available"))
    }
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; quota: number } | null> {
    if (typeof window === "undefined" || !("storage" in navigator)) return null

    try {
      const estimate = await (navigator.storage as any).estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      }
    } catch (error) {
      console.error("Failed to get storage usage:", error)
      return null
    }
  }

  // Clear app data
  async clearAppData(): Promise<void> {
    if (typeof window === "undefined") return

    try {
      // Clear caches
      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((name) => caches.delete(name)))
      }

      // Clear IndexedDB
      const { offlineStorage } = await import("./offline-storage")
      await offlineStorage.clearAll()

      // Clear localStorage
      localStorage.clear()

      console.log("App data cleared successfully")
    } catch (error) {
      console.error("Failed to clear app data:", error)
    }
  }
}

export const pwaUtils = PWAUtils.getInstance()
