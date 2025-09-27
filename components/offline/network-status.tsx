"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface NetworkStatusProps {
  onSyncRequested?: () => void
}

export function NetworkStatus({ onSyncRequested }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Initialize network status
    setIsOnline(navigator.onLine)

    // Listen for network changes
    const handleOnline = () => {
      setIsOnline(true)
      // Notify parent component when coming back online
      onSyncRequested?.()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [onSyncRequested])

  return (
    <Badge variant="secondary" className={isOnline ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </>
      )}
    </Badge>
  )
}
