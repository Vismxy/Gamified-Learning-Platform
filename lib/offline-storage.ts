"use client"

// IndexedDB wrapper for offline storage
class OfflineStorage {
  private dbName = "stem-gamify-db"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("lessons")) {
          const lessonStore = db.createObjectStore("lessons", { keyPath: "id" })
          lessonStore.createIndex("subject", "subject", { unique: false })
          lessonStore.createIndex("isDownloaded", "isDownloaded", { unique: false })
        }

        if (!db.objectStoreNames.contains("progress")) {
          const progressStore = db.createObjectStore("progress", { keyPath: "id" })
          progressStore.createIndex("userId", "userId", { unique: false })
          progressStore.createIndex("lessonId", "lessonId", { unique: false })
        }

        if (!db.objectStoreNames.contains("user-data")) {
          db.createObjectStore("user-data", { keyPath: "id" })
        }

        if (!db.objectStoreNames.contains("pending-sync")) {
          const syncStore = db.createObjectStore("pending-sync", { keyPath: "id" })
          syncStore.createIndex("type", "type", { unique: false })
          syncStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  async storeLessons(lessons: any[]): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["lessons"], "readwrite")
    const store = transaction.objectStore("lessons")

    for (const lesson of lessons) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ ...lesson, isDownloaded: true, downloadedAt: new Date() })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  }

  async getLessons(subject?: string): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["lessons"], "readonly")
      const store = transaction.objectStore("lessons")

      if (subject) {
        const index = store.index("subject")
        const request = index.getAll(subject)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      } else {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }
    })
  }

  async storeProgress(progress: any): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["progress"], "readwrite")
    const store = transaction.objectStore("progress")

    return new Promise((resolve, reject) => {
      const request = store.put({ ...progress, timestamp: new Date() })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getProgress(userId: string): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["progress"], "readonly")
      const store = transaction.objectStore("progress")
      const index = store.index("userId")
      const request = index.getAll(userId)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async storeUserData(userData: any): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["user-data"], "readwrite")
    const store = transaction.objectStore("user-data")

    return new Promise((resolve, reject) => {
      const request = store.put({ ...userData, lastUpdated: new Date() })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getUserData(userId: string): Promise<any | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["user-data"], "readonly")
      const store = transaction.objectStore("user-data")
      const request = store.get(userId)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async addPendingSync(data: any): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["pending-sync"], "readwrite")
    const store = transaction.objectStore("pending-sync")

    const syncData = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      timestamp: new Date(),
    }

    return new Promise((resolve, reject) => {
      const request = store.put(syncData)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingSync(): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pending-sync"], "readonly")
      const store = transaction.objectStore("pending-sync")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async removePendingSync(id: string): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["pending-sync"], "readwrite")
    const store = transaction.objectStore("pending-sync")

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init()

    const storeNames = ["lessons", "progress", "user-data", "pending-sync"]
    const transaction = this.db!.transaction(storeNames, "readwrite")

    for (const storeName of storeNames) {
      const store = transaction.objectStore(storeName)
      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  }
}

export const offlineStorage = new OfflineStorage()
