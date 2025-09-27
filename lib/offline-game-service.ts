"use client"

interface GameData {
  id: string
  type: "chemistry" | "math" | "physics" | "biology"
  data: any
  assets: string[]
  lastUpdated: Date
  version: string
}

interface GameProgress {
  gameId: string
  userId: string
  progress: any
  score: number
  completedLevels: string[]
  achievements: string[]
  lastPlayed: Date
  syncStatus: "synced" | "pending" | "offline"
}

class OfflineGameService {
  private dbName = "STEMGamifyDB"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Game data store
        if (!db.objectStoreNames.contains("games")) {
          const gameStore = db.createObjectStore("games", { keyPath: "id" })
          gameStore.createIndex("type", "type", { unique: false })
        }

        // Game progress store
        if (!db.objectStoreNames.contains("progress")) {
          const progressStore = db.createObjectStore("progress", { keyPath: ["gameId", "userId"] })
          progressStore.createIndex("userId", "userId", { unique: false })
          progressStore.createIndex("syncStatus", "syncStatus", { unique: false })
        }

        // Assets store for game resources
        if (!db.objectStoreNames.contains("assets")) {
          const assetStore = db.createObjectStore("assets", { keyPath: "url" })
          assetStore.createIndex("gameId", "gameId", { unique: false })
        }

        // Leaderboard cache
        if (!db.objectStoreNames.contains("leaderboard")) {
          const leaderboardStore = db.createObjectStore("leaderboard", { keyPath: "id" })
          leaderboardStore.createIndex("lastUpdated", "lastUpdated", { unique: false })
        }
      }
    })
  }

  async downloadGame(gameId: string, gameType: "chemistry" | "math" | "physics" | "biology"): Promise<boolean> {
    try {
      if (!this.db) await this.init()

      // Mock game data - in real app this would fetch from API
      const gameData: GameData = {
        id: gameId,
        type: gameType,
        data: this.getGameDataByType(gameType),
        assets: this.getGameAssets(gameType),
        lastUpdated: new Date(),
        version: "1.0.0",
      }

      // Store game data
      const transaction = this.db!.transaction(["games", "assets"], "readwrite")
      const gameStore = transaction.objectStore("games")
      const assetStore = transaction.objectStore("assets")

      await gameStore.put(gameData)

      // Download and store assets
      for (const assetUrl of gameData.assets) {
        try {
          const response = await fetch(assetUrl)
          const blob = await response.blob()
          await assetStore.put({
            url: assetUrl,
            gameId: gameId,
            data: blob,
            lastUpdated: new Date(),
          })
        } catch (error) {
          console.warn(`Failed to download asset: ${assetUrl}`, error)
        }
      }

      return true
    } catch (error) {
      console.error("Failed to download game:", error)
      return false
    }
  }

  async getOfflineGame(gameId: string): Promise<GameData | null> {
    try {
      if (!this.db) await this.init()

      const transaction = this.db!.transaction(["games"], "readonly")
      const store = transaction.objectStore("games")
      const request = store.get(gameId)

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to get offline game:", error)
      return null
    }
  }

  async saveGameProgress(progress: GameProgress): Promise<void> {
    try {
      if (!this.db) await this.init()

      progress.syncStatus = navigator.onLine ? "synced" : "pending"
      progress.lastPlayed = new Date()

      const transaction = this.db!.transaction(["progress"], "readwrite")
      const store = transaction.objectStore("progress")
      await store.put(progress)

      // If online, attempt to sync
      if (navigator.onLine) {
        this.syncProgressToServer(progress)
      }
    } catch (error) {
      console.error("Failed to save game progress:", error)
    }
  }

  async getGameProgress(gameId: string, userId: string): Promise<GameProgress | null> {
    try {
      if (!this.db) await this.init()

      const transaction = this.db!.transaction(["progress"], "readonly")
      const store = transaction.objectStore("progress")
      const request = store.get([gameId, userId])

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to get game progress:", error)
      return null
    }
  }

  async syncPendingProgress(): Promise<void> {
    try {
      if (!navigator.onLine || !this.db) return

      const transaction = this.db.transaction(["progress"], "readwrite")
      const store = transaction.objectStore("progress")
      const index = store.index("syncStatus")
      const request = index.getAll("pending")

      request.onsuccess = async () => {
        const pendingProgress = request.result
        for (const progress of pendingProgress) {
          try {
            await this.syncProgressToServer(progress)
            progress.syncStatus = "synced"
            await store.put(progress)
          } catch (error) {
            console.error("Failed to sync progress:", error)
          }
        }
      }
    } catch (error) {
      console.error("Failed to sync pending progress:", error)
    }
  }

  async cacheLeaderboard(leaderboardData: any): Promise<void> {
    try {
      if (!this.db) await this.init()

      const transaction = this.db.transaction(["leaderboard"], "readwrite")
      const store = transaction.objectStore("leaderboard")

      await store.put({
        id: "weekly",
        data: leaderboardData,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error("Failed to cache leaderboard:", error)
    }
  }

  async getCachedLeaderboard(): Promise<any | null> {
    try {
      if (!this.db) await this.init()

      const transaction = this.db.transaction(["leaderboard"], "readonly")
      const store = transaction.objectStore("leaderboard")
      const request = store.get("weekly")

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result
          if (result && this.isDataFresh(result.lastUpdated, 30 * 60 * 1000)) {
            // 30 minutes
            resolve(result.data)
          } else {
            resolve(null)
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to get cached leaderboard:", error)
      return null
    }
  }

  async getDownloadedGames(): Promise<GameData[]> {
    try {
      if (!this.db) await this.init()

      const transaction = this.db.transaction(["games"], "readonly")
      const store = transaction.objectStore("games")
      const request = store.getAll()

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to get downloaded games:", error)
      return []
    }
  }

  async deleteGame(gameId: string): Promise<void> {
    try {
      if (!this.db) await this.init()

      const transaction = this.db.transaction(["games", "assets"], "readwrite")
      const gameStore = transaction.objectStore("games")
      const assetStore = transaction.objectStore("assets")

      await gameStore.delete(gameId)

      // Delete associated assets
      const assetIndex = assetStore.index("gameId")
      const assetRequest = assetIndex.getAll(gameId)

      assetRequest.onsuccess = async () => {
        const assets = assetRequest.result
        for (const asset of assets) {
          await assetStore.delete(asset.url)
        }
      }
    } catch (error) {
      console.error("Failed to delete game:", error)
    }
  }

  private async syncProgressToServer(progress: GameProgress): Promise<void> {
    // Mock API call - in real app this would sync to server
    try {
      const response = await fetch("/api/sync-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      })

      if (!response.ok) {
        throw new Error("Failed to sync to server")
      }
    } catch (error) {
      console.error("Server sync failed:", error)
      throw error
    }
  }

  private isDataFresh(lastUpdated: Date, maxAge: number): boolean {
    return Date.now() - lastUpdated.getTime() < maxAge
  }

  private getGameDataByType(type: string): any {
    // Mock game data structures
    switch (type) {
      case "chemistry":
        return {
          elements: [
            { symbol: "H", name: "Hydrogen", atomicNumber: 1 },
            { symbol: "O", name: "Oxygen", atomicNumber: 8 },
            { symbol: "Na", name: "Sodium", atomicNumber: 11 },
          ],
          reactions: [{ reactants: ["H", "H", "O"], products: ["H2O"], points: 100 }],
        }
      case "math":
        return {
          quests: [
            {
              id: "basic-arithmetic",
              problem: "What is 15 + 27?",
              answer: 42,
              points: 100,
            },
          ],
        }
      case "physics":
        return {
          missions: [
            {
              id: "rescue-mission",
              objective: "Use physics to rescue the character",
              tools: ["block", "ramp", "spring"],
            },
          ],
        }
      case "biology":
        return {
          organisms: [{ id: "oak-tree", name: "Oak Tree", type: "plant", points: 100 }],
          experiments: [{ id: "cell-study", title: "Plant Cell Structure", points: 250 }],
        }
      default:
        return {}
    }
  }

  private getGameAssets(type: string): string[] {
    // Mock asset URLs - in real app these would be actual game assets
    const baseAssets = ["/game-icon.jpg", "/abstract-geometric-background.png"]

    switch (type) {
      case "chemistry":
        return [...baseAssets, "/element-icon.jpg"]
      case "math":
        return [...baseAssets, "/math-symbol.jpg"]
      case "physics":
        return [...baseAssets, "/physics-tool.jpg"]
      case "biology":
        return [...baseAssets, "/abstract-organism.png"]
      default:
        return baseAssets
    }
  }
}

export const offlineGameService = new OfflineGameService()
