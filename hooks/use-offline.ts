"use client"

import { useState, useEffect } from "react"

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Set initial status
    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOffline
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    isSlowConnection: false,
    connectionType: "unknown",
  })

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection =
        (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      setNetworkStatus({
        isOnline: navigator.onLine,
        isSlowConnection: connection
          ? connection.effectiveType === "2g" || connection.effectiveType === "slow-2g"
          : false,
        connectionType: connection ? connection.effectiveType : "unknown",
      })
    }

    updateNetworkStatus()

    window.addEventListener("online", updateNetworkStatus)
    window.addEventListener("offline", updateNetworkStatus)

    // Listen for connection changes if supported
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      connection.addEventListener("change", updateNetworkStatus)
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus)
      window.removeEventListener("offline", updateNetworkStatus)
      if (connection) {
        connection.removeEventListener("change", updateNetworkStatus)
      }
    }
  }, [])

  return networkStatus
}
