"use client"

interface OfflineContent {
  id: string
  type: "lesson" | "quiz" | "material"
  subject: string
  title: string
  content: any
  downloadedAt: Date
  lastAccessed?: Date
  size: number // in bytes
}

interface SyncQueue {
  id: string
  action: "create" | "update" | "delete"
  type: "progress" | "quiz_result" | "achievement"
  data: any
  timestamp: Date
  retryCount: number
}

class OfflineService {
  private static instance: OfflineService
  private dbName = "STEMGamifyOffline"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService()
    }
    return OfflineService.instance
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

        // Create object stores
        if (!db.objectStoreNames.contains("content")) {
          const contentStore = db.createObjectStore("content", { keyPath: "id" })
          contentStore.createIndex("subject", "subject", { unique: false })
          contentStore.createIndex("type", "type", { unique: false })
        }

        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncStore = db.createObjectStore("syncQueue", { keyPath: "id" })
          syncStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("userProgress")) {
          db.createObjectStore("userProgress", { keyPath: "id" })
        }
      }
    })
  }

  // Content Management
  async downloadContent(contentId: string, subject: string, type: "lesson" | "quiz" | "material"): Promise<void> {
    try {
      // Simulate API call to fetch content
      const response = await this.fetchContentFromAPI(contentId)

      const content: OfflineContent = {
        id: contentId,
        type,
        subject,
        title: response.title,
        content: response.data,
        downloadedAt: new Date(),
        size: JSON.stringify(response.data).length,
      }

      await this.storeContent(content)

      // Update UI to show download complete
      this.notifyDownloadComplete(content.title)
    } catch (error) {
      console.error("Failed to download content:", error)
      throw error
    }
  }

  async downloadSubjectContent(subject: string): Promise<void> {
    try {
      // Download all lessons and quizzes for a subject
      const lessons = await this.fetchSubjectLessons(subject)
      const quizzes = await this.fetchSubjectQuizzes(subject)

      const downloadPromises = [
        ...lessons.map((lesson) => this.downloadContent(lesson.id, subject, "lesson")),
        ...quizzes.map((quiz) => this.downloadContent(quiz.id, subject, "quiz")),
      ]

      await Promise.all(downloadPromises)

      // Store placeholder materials if none available
      await this.createPlaceholderMaterials(subject)
    } catch (error) {
      console.error(`Failed to download ${subject} content:`, error)
      throw error
    }
  }

  private async createPlaceholderMaterials(subject: string): Promise<void> {
    const placeholderMaterials = {
      physics: [
        { title: "Physics Formulas Reference", type: "pdf", content: "Basic physics formulas and constants" },
        { title: "Motion Diagrams", type: "image", content: "Visual representations of motion concepts" },
      ],
      chemistry: [
        { title: "Periodic Table", type: "pdf", content: "Complete periodic table with element properties" },
        { title: "Chemical Reactions Guide", type: "pdf", content: "Common chemical reactions and equations" },
      ],
      biology: [
        { title: "Cell Structure Diagram", type: "image", content: "Detailed cell organelle diagrams" },
        { title: "Human Body Systems", type: "pdf", content: "Overview of major body systems" },
      ],
      mathematics: [
        { title: "Mathematical Formulas", type: "pdf", content: "Essential mathematical formulas" },
        { title: "Geometry Shapes", type: "image", content: "Common geometric shapes and properties" },
      ],
    }

    const materials = placeholderMaterials[subject.toLowerCase() as keyof typeof placeholderMaterials] || []

    for (const material of materials) {
      const content: OfflineContent = {
        id: `${subject.toLowerCase()}-${material.title.toLowerCase().replace(/\s+/g, "-")}`,
        type: "material",
        subject,
        title: material.title,
        content: { type: material.type, data: material.content },
        downloadedAt: new Date(),
        size: material.content.length,
      }

      await this.storeContent(content)
    }
  }

  async getOfflineContent(subject?: string, type?: string): Promise<OfflineContent[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["content"], "readonly")
      const store = transaction.objectStore("content")
      const request = store.getAll()

      request.onsuccess = () => {
        let content = request.result as OfflineContent[]

        if (subject) {
          content = content.filter((item) => item.subject.toLowerCase() === subject.toLowerCase())
        }

        if (type) {
          content = content.filter((item) => item.type === type)
        }

        resolve(content)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async deleteOfflineContent(contentId: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["content"], "readwrite")
      const store = transaction.objectStore("content")
      const request = store.delete(contentId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Sync Management
  async addToSyncQueue(action: "create" | "update" | "delete", type: string, data: any): Promise<void> {
    if (!this.db) await this.initialize()

    const syncItem: SyncQueue = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readwrite")
      const store = transaction.objectStore("syncQueue")
      const request = store.add(syncItem)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async syncPendingData(): Promise<void> {
    if (!navigator.onLine) return

    const pendingItems = await this.getPendingSyncItems()

    for (const item of pendingItems) {
      try {
        await this.syncItem(item)
        await this.removeSyncItem(item.id)
      } catch (error) {
        console.error("Sync failed for item:", item.id, error)
        await this.incrementRetryCount(item.id)
      }
    }
  }

  private async getPendingSyncItems(): Promise<SyncQueue[]> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readonly")
      const store = transaction.objectStore("syncQueue")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async syncItem(item: SyncQueue): Promise<void> {
    // Simulate API sync
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`)
    }
  }

  // Utility Methods
  private async storeContent(content: OfflineContent): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["content"], "readwrite")
      const store = transaction.objectStore("content")
      const request = store.put(content)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async fetchContentFromAPI(contentId: string): Promise<any> {
    // Simulate API call - in real implementation, this would fetch from your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: `Content ${contentId}`,
          data: {
            content: `This is the content for ${contentId}`,
            materials: [],
            quiz: null,
          },
        })
      }, 1000)
    })
  }

  private async fetchSubjectLessons(subject: string): Promise<any[]> {
    // Simulate fetching lessons for a subject
    return Array.from({ length: 5 }, (_, i) => ({
      id: `${subject.toLowerCase()}-lesson-${i + 1}`,
      title: `${subject} Lesson ${i + 1}`,
    }))
  }

  private async fetchSubjectQuizzes(subject: string): Promise<any[]> {
    // Simulate fetching quizzes for a subject
    return Array.from({ length: 5 }, (_, i) => ({
      id: `${subject.toLowerCase()}-quiz-${i + 1}`,
      title: `${subject} Quiz ${i + 1}`,
    }))
  }

  private notifyDownloadComplete(title: string): void {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Download Complete", {
        body: `${title} is now available offline`,
        icon: "/favicon.ico",
      })
    }
  }

  private async removeSyncItem(id: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readwrite")
      const store = transaction.objectStore("syncQueue")
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async incrementRetryCount(id: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readwrite")
      const store = transaction.objectStore("syncQueue")
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (item) {
          item.retryCount += 1
          const putRequest = store.put(item)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          resolve()
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Storage Management
  async getStorageUsage(): Promise<{ used: number; available: number }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
      }
    }

    return { used: 0, available: 0 }
  }

  async clearOfflineData(): Promise<void> {
    if (!this.db) await this.initialize()

    const stores = ["content", "syncQueue", "userProgress"]

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
}

export const offlineService = OfflineService.getInstance()

// Initialize offline service when module loads
if (typeof window !== "undefined") {
  offlineService.initialize().catch(console.error)

  // Set up sync on connection restore
  window.addEventListener("online", () => {
    offlineService.syncPendingData().catch(console.error)
  })
}
