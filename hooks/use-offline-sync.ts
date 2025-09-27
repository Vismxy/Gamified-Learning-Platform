"use client"

import { useState, useEffect } from "react"
import { supabaseOfflineService } from "@/lib/supabase-offline-service"
import { AuthService } from "@/lib/auth"

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSyncCount, setPendingSyncCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const authService = AuthService.getInstance()

  useEffect(() => {
    // Initialize network status
    setIsOnline(navigator.onLine)

    // Listen for network changes
    const handleOnline = () => {
      setIsOnline(true)
      syncData()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial sync check
    checkPendingSync()

    // Periodic sync check
    const interval = setInterval(checkPendingSync, 15000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  const checkPendingSync = async () => {
    try {
      const count = await supabaseOfflineService.getPendingSyncCount()
      setPendingSyncCount(count)
    } catch (error) {
      console.error("Failed to check pending sync:", error)
    }
  }

  const syncData = async () => {
    if (!isOnline || isSyncing) return

    setIsSyncing(true)
    try {
      await supabaseOfflineService.syncOfflineData()
      await checkPendingSync()
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const storeLessonProgress = async (lessonId: string, progress: any) => {
    const user = await authService.getCurrentUser()
    if (!user) return

    try {
      await supabaseOfflineService.storeLessonProgress(user.id, lessonId, progress)
      await checkPendingSync()
    } catch (error) {
      console.error("Failed to store lesson progress:", error)
    }
  }

  const storeQuizResult = async (quizId: string, result: any) => {
    const user = await authService.getCurrentUser()
    if (!user) return

    try {
      await supabaseOfflineService.storeQuizResult(user.id, quizId, result)
      await checkPendingSync()
    } catch (error) {
      console.error("Failed to store quiz result:", error)
    }
  }

  const cacheContent = async (content: any) => {
    try {
      await supabaseOfflineService.cacheContent(content)
    } catch (error) {
      console.error("Failed to cache content:", error)
    }
  }

  const getCachedContent = async (type?: string, subject?: string) => {
    try {
      return await supabaseOfflineService.getCachedContent(type, subject)
    } catch (error) {
      console.error("Failed to get cached content:", error)
      return []
    }
  }

  return {
    isOnline,
    pendingSyncCount,
    isSyncing,
    syncData,
    storeLessonProgress,
    storeQuizResult,
    cacheContent,
    getCachedContent,
  }
}
