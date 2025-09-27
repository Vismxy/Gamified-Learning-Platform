"use client"

import type React from "react"

import { useEffect } from "react"
import { pwaUtils } from "@/lib/pwa-utils"
import { offlineStorage } from "@/lib/offline-storage"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PWA features
    const initializePWA = async () => {
      try {
        // Register service worker
        await pwaUtils.registerServiceWorker()

        // Initialize offline storage
        await offlineStorage.init()

        console.log("PWA initialized successfully")
      } catch (error) {
        console.error("PWA initialization failed:", error)
      }
    }

    initializePWA()
  }, [])

  return <>{children}</>
}
