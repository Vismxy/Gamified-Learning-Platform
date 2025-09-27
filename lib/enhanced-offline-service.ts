"use client"

import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface OfflineDB extends DBSchema {
  lessons: {
    key: string
    value: {
      id: string
      title: string
      subject: string
      content: string
      materials: Array<{
        type: "pdf" | "video" | "image" | "audio"
        url: string
        name: string
        size: number
        blob?: Blob
      }>
      downloadedAt: Date
      lastAccessed: Date
    }
  }
  materials: {
    key: string
    value: {
      id: string
      lessonId: string
      type: "pdf" | "video" | "image" | "audio"
      name: string
      blob: Blob
      size: number
      downloadedAt: Date
    }
  }
  progress: {
    key: string
    value: {
      userId: string
      lessonId: string
      completed: boolean
      score?: number
      timeSpent: number
      lastUpdated: Date
      syncPending: boolean
    }
  }
  quizzes: {
    key: string
    value: {
      id: string
      subject: string
      questions: any[]
      downloadedAt: Date
    }
  }
}

class EnhancedOfflineService {
  private db: IDBPDatabase<OfflineDB> | null = null
  private static instance: EnhancedOfflineService

  static getInstance(): EnhancedOfflineService {
    if (!EnhancedOfflineService.instance) {
      EnhancedOfflineService.instance = new EnhancedOfflineService()
    }
    return EnhancedOfflineService.instance
  }

  async init(): Promise<void> {
    if (this.db) return

    this.db = await openDB<OfflineDB>("stem-gamify-offline", 1, {
      upgrade(db) {
        // Create lessons store
        if (!db.objectStoreNames.contains("lessons")) {
          db.createObjectStore("lessons", { keyPath: "id" })
        }

        // Create materials store
        if (!db.objectStoreNames.contains("materials")) {
          const materialsStore = db.createObjectStore("materials", { keyPath: "id" })
          materialsStore.createIndex("lessonId", "lessonId")
        }

        // Create progress store
        if (!db.objectStoreNames.contains("progress")) {
          const progressStore = db.createObjectStore("progress", { keyPath: ["userId", "lessonId"] })
          progressStore.createIndex("syncPending", "syncPending")
        }

        // Create quizzes store
        if (!db.objectStoreNames.contains("quizzes")) {
          db.createObjectStore("quizzes", { keyPath: "id" })
        }
      },
    })
  }

  async downloadLesson(lessonId: string, onProgress?: (progress: number) => void): Promise<boolean> {
    try {
      await this.init()
      if (!this.db) throw new Error("Database not initialized")

      // Simulate fetching lesson data
      const lessonData = {
        id: lessonId,
        title: `Lesson ${lessonId}`,
        subject: "Physics",
        content: "Lesson content here...",
        materials: [
          {
            type: "pdf" as const,
            url: `/materials/${lessonId}/lesson.pdf`,
            name: "Lesson Notes.pdf",
            size: 1024 * 1024 * 2, // 2MB
          },
          {
            type: "video" as const,
            url: `/materials/${lessonId}/video.mp4`,
            name: "Lesson Video.mp4",
            size: 1024 * 1024 * 50, // 50MB
          },
          {
            type: "image" as const,
            url: `/materials/${lessonId}/diagram.png`,
            name: "Diagram.png",
            size: 1024 * 500, // 500KB
          },
        ],
        downloadedAt: new Date(),
        lastAccessed: new Date(),
      }

      // Download materials with progress tracking
      const totalSize = lessonData.materials.reduce((sum, m) => sum + m.size, 0)
      let downloadedSize = 0

      for (const material of lessonData.materials) {
        try {
          // Simulate downloading material
          const blob = await this.downloadMaterial(material.url, (progress) => {
            const materialProgress = (progress * material.size) / 100
            const totalProgress = ((downloadedSize + materialProgress) / totalSize) * 100
            onProgress?.(Math.min(totalProgress, 100))
          })

          // Store material in IndexedDB
          await this.db.put("materials", {
            id: `${lessonId}-${material.name}`,
            lessonId,
            type: material.type,
            name: material.name,
            blob,
            size: material.size,
            downloadedAt: new Date(),
          })

          downloadedSize += material.size
          material.blob = blob
        } catch (error) {
          console.error(`Failed to download material ${material.name}:`, error)
          // Continue with other materials
        }
      }

      // Store lesson data
      await this.db.put("lessons", lessonData)

      return true
    } catch (error) {
      console.error("Failed to download lesson:", error)
      return false
    }
  }

  private async downloadMaterial(url: string, onProgress?: (progress: number) => void): Promise<Blob> {
    // Simulate download with progress
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        onProgress?.(Math.min(progress, 100))

        if (progress >= 100) {
          clearInterval(interval)
          // Create a dummy blob for simulation
          const blob = new Blob(["Simulated file content"], { type: "application/octet-stream" })
          resolve(blob)
        }
      }, 100)
    })
  }

  async getDownloadedLessons(): Promise<any[]> {
    await this.init()
    if (!this.db) return []

    const lessons = await this.db.getAll("lessons")
    return lessons
  }

  async getLessonMaterials(lessonId: string): Promise<any[]> {
    await this.init()
    if (!this.db) return []

    const materials = await this.db.getAllFromIndex("materials", "lessonId", lessonId)
    return materials
  }

  async openMaterial(materialId: string): Promise<string | null> {
    await this.init()
    if (!this.db) return null

    const material = await this.db.get("materials", materialId)
    if (!material) return null

    // Create blob URL for opening
    const url = URL.createObjectURL(material.blob)
    return url
  }

  async deleteLesson(lessonId: string): Promise<void> {
    await this.init()
    if (!this.db) return

    // Delete lesson
    await this.db.delete("lessons", lessonId)

    // Delete associated materials
    const materials = await this.db.getAllFromIndex("materials", "lessonId", lessonId)
    for (const material of materials) {
      await this.db.delete("materials", material.id)
    }
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      }
    }
    return { used: 0, quota: 0 }
  }

  async clearAllData(): Promise<void> {
    await this.init()
    if (!this.db) return

    const stores = ["lessons", "materials", "progress", "quizzes"]
    for (const store of stores) {
      await this.db.clear(store as any)
    }
  }

  async saveProgress(userId: string, lessonId: string, progress: any): Promise<void> {
    await this.init()
    if (!this.db) return

    await this.db.put("progress", {
      userId,
      lessonId,
      ...progress,
      lastUpdated: new Date(),
      syncPending: true,
    })
  }

  async syncPendingProgress(): Promise<void> {
    await this.init()
    if (!this.db) return

    const pendingProgress = await this.db.getAllFromIndex("progress", "syncPending", true)

    for (const progress of pendingProgress) {
      try {
        // Simulate API sync
        console.log("Syncing progress:", progress)

        // Mark as synced
        await this.db.put("progress", {
          ...progress,
          syncPending: false,
        })
      } catch (error) {
        console.error("Failed to sync progress:", error)
      }
    }
  }
}

export const enhancedOfflineService = EnhancedOfflineService.getInstance()
