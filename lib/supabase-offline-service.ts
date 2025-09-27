"use client"

import { createClient } from "@/lib/supabase/client"

interface OfflineData {
  id: string
  user_id: string
  data_type: "lesson_progress" | "quiz_result" | "achievement" | "user_activity"
  data: any
  synced: boolean
  created_at: string
}

interface SyncQueueItem {
  id: string
  action: "create" | "update" | "delete"
  table: string
  data: any
  timestamp: Date
  retryCount: number
}

class SupabaseOfflineService {
  private static instance: SupabaseOfflineService
  private supabase = createClient()
  private dbName = "stem-gamify-offline"
  private dbVersion = 2
  private db: IDBDatabase | null = null
  private syncInProgress = false

  static getInstance(): SupabaseOfflineService {
    if (!SupabaseOfflineService.instance) {
      SupabaseOfflineService.instance = new SupabaseOfflineService()
    }
    return SupabaseOfflineService.instance
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create offline_data store
        if (!db.objectStoreNames.contains("offline_data")) {
          const offlineStore = db.createObjectStore("offline_data", { keyPath: "id" })
          offlineStore.createIndex("user_id", "user_id", { unique: false })
          offlineStore.createIndex("data_type", "data_type", { unique: false })
          offlineStore.createIndex("synced", "synced", { unique: false })
        }

        // Create sync_queue store
        if (!db.objectStoreNames.contains("sync_queue")) {
          const syncStore = db.createObjectStore("sync_queue", { keyPath: "id" })
          syncStore.createIndex("timestamp", "timestamp", { unique: false })
          syncStore.createIndex("retryCount", "retryCount", { unique: false })
        }

        // Create cached_data store for offline content
        if (!db.objectStoreNames.contains("cached_data")) {
          const cacheStore = db.createObjectStore("cached_data", { keyPath: "id" })
          cacheStore.createIndex("type", "type", { unique: false })
          cacheStore.createIndex("subject", "subject", { unique: false })
          cacheStore.createIndex("lastAccessed", "lastAccessed", { unique: false })
        }
      }
    })
  }

  async storeOfflineData(userId: string, dataType: string, data: any): Promise<void> {
    if (!this.db) await this.initialize()

    const offlineData: OfflineData = {
      id: `${dataType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      data_type: dataType as any,
      data,
      synced: false,
      created_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")
      const request = store.put(offlineData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async syncOfflineData(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return

    this.syncInProgress = true
    try {
      if (!this.db) await this.initialize()

      const unsyncedData = await this.getUnsyncedData()

      for (const item of unsyncedData) {
        try {
          // Insert into Supabase offline_data table
          const { error } = await this.supabase.from("offline_data").insert({
            user_id: item.user_id,
            data_type: item.data_type,
            data: item.data,
          })

          if (error) {
            console.error("Failed to sync offline data:", error)
            continue
          }

          // Mark as synced in IndexedDB
          await this.markAsSynced(item.id)

          // Process the data based on type
          await this.processOfflineData(item)
        } catch (error) {
          console.error("Error syncing item:", item.id, error)
        }
      }
    } finally {
      this.syncInProgress = false
    }
  }

  private async processOfflineData(item: OfflineData): Promise<void> {
    switch (item.data_type) {
      case "lesson_progress":
        await this.syncLessonProgress(item)
        break
      case "quiz_result":
        await this.syncQuizResult(item)
        break
      case "achievement":
        await this.syncAchievement(item)
        break
      case "user_activity":
        await this.syncUserActivity(item)
        break
    }
  }

  private async syncLessonProgress(item: OfflineData): Promise<void> {
    // Update user profile with progress
    const { data: profile } = await this.supabase
      .from("profiles")
      .select("total_points, level")
      .eq("id", item.user_id)
      .single()

    if (profile) {
      const newPoints = profile.total_points + (item.data.pointsEarned || 0)
      const newLevel = Math.floor(newPoints / 1000) + 1

      await this.supabase
        .from("profiles")
        .update({
          total_points: newPoints,
          level: newLevel,
          last_activity: new Date().toISOString(),
        })
        .eq("id", item.user_id)
    }
  }

  private async syncQuizResult(item: OfflineData): Promise<void> {
    // Store quiz results and update user stats
    const { data: profile } = await this.supabase
      .from("profiles")
      .select("total_points")
      .eq("id", item.user_id)
      .single()

    if (profile) {
      const pointsEarned = Math.floor((item.data.score / 100) * 50) // Max 50 points per quiz
      await this.supabase
        .from("profiles")
        .update({
          total_points: profile.total_points + pointsEarned,
          last_activity: new Date().toISOString(),
        })
        .eq("id", item.user_id)
    }
  }

  private async syncAchievement(item: OfflineData): Promise<void> {
    // Achievements would be stored in a separate table
    console.log("Achievement synced:", item.data)
  }

  private async syncUserActivity(item: OfflineData): Promise<void> {
    // Update last activity timestamp
    await this.supabase.from("profiles").update({ last_activity: new Date().toISOString() }).eq("id", item.user_id)
  }

  private async getUnsyncedData(): Promise<OfflineData[]> {
    try {
      if (!this.db) await this.initialize()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(["offline_data"], "readonly")
        const store = transaction.objectStore("offline_data")

        const request = store.getAll()

        request.onsuccess = () => {
          const allData = request.result
          const unsyncedData = allData.filter((item: OfflineData) => !item.synced)
          resolve(unsyncedData)
        }

        request.onerror = () => {
          console.error("Error getting unsynced data:", request.error)
          resolve([]) // Return empty array instead of rejecting
        }
      })
    } catch (error) {
      console.error("Error in getUnsyncedData:", error)
      return [] // Return empty array on any error
    }
  }

  private async markAsSynced(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          data.synced = true
          const putRequest = store.put(data)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          resolve()
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async cacheContent(content: any): Promise<void> {
    if (!this.db) await this.initialize()

    const cachedItem = {
      id: content.id,
      type: content.type,
      subject: content.subject,
      title: content.title,
      data: content,
      lastAccessed: new Date().toISOString(),
      downloadedAt: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readwrite")
      const store = transaction.objectStore("cached_data")
      const request = store.put(cachedItem)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedContent(type?: string, subject?: string): Promise<any[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readonly")
      const store = transaction.objectStore("cached_data")
      const request = store.getAll()

      request.onsuccess = () => {
        let results = request.result

        if (type) {
          results = results.filter((item) => item.type === type)
        }

        if (subject) {
          results = results.filter((item) => item.subject === subject)
        }

        resolve(results.map((item) => item.data))
      }

      request.onerror = () => reject(request.error)
    })
  }

  async getPendingSyncCount(): Promise<number> {
    try {
      if (!this.db) await this.initialize()

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(["offline_data"], "readonly")
        const store = transaction.objectStore("offline_data")

        const request = store.getAll()

        request.onsuccess = () => {
          const allData = request.result
          const unsyncedCount = allData.filter((item: OfflineData) => !item.synced).length
          resolve(unsyncedCount)
        }

        request.onerror = () => {
          console.error("Error counting pending sync items:", request.error)
          resolve(0) // Return 0 instead of rejecting to prevent crashes
        }
      })
    } catch (error) {
      console.error("Error in getPendingSyncCount:", error)
      return 0 // Return 0 on any error to prevent crashes
    }
  }

  async clearOfflineData(): Promise<void> {
    if (!this.db) await this.initialize()

    const stores = ["offline_data", "sync_queue", "cached_data"]

    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], "readwrite")
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  }

  setupAutoSync(): void {
    if (typeof window === "undefined") return

    // Sync when coming online
    window.addEventListener("online", () => {
      this.syncOfflineData().catch(console.error)
    })

    // Periodic sync when online
    setInterval(() => {
      if (navigator.onLine) {
        this.syncOfflineData().catch(console.error)
      }
    }, 30000) // Every 30 seconds
  }

  async storeLessonProgress(userId: string, lessonId: string, progress: any): Promise<void> {
    const progressData = {
      lessonId,
      progress: progress.progress,
      completed: progress.completed,
      timeSpent: progress.timeSpent,
      pointsEarned: progress.pointsEarned || 0,
      timestamp: new Date().toISOString(),
    }

    if (navigator.onLine) {
      try {
        // Try to sync immediately if online
        await this.supabase.from("offline_data").insert({
          user_id: userId,
          data_type: "lesson_progress",
          data: progressData,
        })

        // Also update profile immediately
        await this.syncLessonProgress({
          id: "",
          user_id: userId,
          data_type: "lesson_progress",
          data: progressData,
          synced: true,
          created_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Failed to sync lesson progress immediately:", error)
        // Fall back to offline storage
        await this.storeOfflineData(userId, "lesson_progress", progressData)
      }
    } else {
      // Store offline
      await this.storeOfflineData(userId, "lesson_progress", progressData)
    }
  }

  async storeQuizResult(userId: string, quizId: string, result: any): Promise<void> {
    const quizData = {
      quizId,
      score: result.score,
      answers: result.answers,
      timeSpent: result.timeSpent,
      completedAt: new Date().toISOString(),
    }

    if (navigator.onLine) {
      try {
        await this.supabase.from("offline_data").insert({
          user_id: userId,
          data_type: "quiz_result",
          data: quizData,
        })

        await this.syncQuizResult({
          id: "",
          user_id: userId,
          data_type: "quiz_result",
          data: quizData,
          synced: true,
          created_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Failed to sync quiz result immediately:", error)
        await this.storeOfflineData(userId, "quiz_result", quizData)
      }
    } else {
      await this.storeOfflineData(userId, "quiz_result", quizData)
    }
  }
}

export const supabaseOfflineService = SupabaseOfflineService.getInstance()

// Initialize and setup auto-sync when module loads
if (typeof window !== "undefined") {
  supabaseOfflineService
    .initialize()
    .then(() => {
      supabaseOfflineService.setupAutoSync()
    })
    .catch(console.error)
}
