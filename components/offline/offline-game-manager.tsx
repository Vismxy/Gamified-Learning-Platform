"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Trash2, Play, Wifi, WifiOff, RefreshCw, HardDrive } from "lucide-react"
import { offlineGameService } from "@/lib/offline-game-service"
import { useToast } from "@/hooks/use-toast"

interface DownloadedGame {
  id: string
  type: "chemistry" | "math" | "physics" | "biology"
  name: string
  icon: string
  size: string
  lastUpdated: Date
  version: string
}

interface OfflineGameManagerProps {
  userId: string
}

export function OfflineGameManager({ userId }: OfflineGameManagerProps) {
  const [downloadedGames, setDownloadedGames] = useState<DownloadedGame[]>([])
  const [downloading, setDownloading] = useState<Set<string>>(new Set())
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({})
  const [showSyncDialog, setShowSyncDialog] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { toast } = useToast()

  const availableGames = [
    {
      id: "element-explorer",
      type: "chemistry" as const,
      name: "Element Explorer",
      icon: "🧪",
      description: "Interactive chemistry lab simulation",
    },
    {
      id: "number-quest",
      type: "math" as const,
      name: "Number Quest",
      icon: "📐",
      description: "Mathematical adventure game",
    },
    {
      id: "force-builder",
      type: "physics" as const,
      name: "Force Builder",
      icon: "⚛️",
      description: "Physics simulation and building",
    },
    {
      id: "life-lab",
      type: "biology" as const,
      name: "Life Lab",
      icon: "🧬",
      description: "Biology exploration and experiments",
    },
  ]

  useEffect(() => {
    loadDownloadedGames()

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingData()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadDownloadedGames = async () => {
    try {
      const games = await offlineGameService.getDownloadedGames()
      const mappedGames: DownloadedGame[] = games.map((game) => ({
        id: game.id,
        type: game.type,
        name: availableGames.find((g) => g.id === game.id)?.name || game.id,
        icon: availableGames.find((g) => g.id === game.id)?.icon || "🎮",
        size: "~5 MB", // Mock size
        lastUpdated: game.lastUpdated,
        version: game.version,
      }))
      setDownloadedGames(mappedGames)
    } catch (error) {
      console.error("Failed to load downloaded games:", error)
    }
  }

  const downloadGame = async (gameId: string, gameType: "chemistry" | "math" | "physics" | "biology") => {
    if (downloading.has(gameId)) return

    setDownloading((prev) => new Set(prev).add(gameId))
    setDownloadProgress((prev) => ({ ...prev, [gameId]: 0 }))

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          const current = prev[gameId] || 0
          if (current >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [gameId]: current + 10 }
        })
      }, 200)

      const success = await offlineGameService.downloadGame(gameId, gameType)

      clearInterval(progressInterval)
      setDownloadProgress((prev) => ({ ...prev, [gameId]: 100 }))

      if (success) {
        toast({
          title: "Download Complete",
          description: `${availableGames.find((g) => g.id === gameId)?.name} is now available offline!`,
        })
        await loadDownloadedGames()
      } else {
        toast({
          title: "Download Failed",
          description: "Please check your connection and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Download Error",
        description: "An error occurred while downloading the game.",
        variant: "destructive",
      })
    } finally {
      setDownloading((prev) => {
        const newSet = new Set(prev)
        newSet.delete(gameId)
        return newSet
      })
      setTimeout(() => {
        setDownloadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[gameId]
          return newProgress
        })
      }, 2000)
    }
  }

  const deleteGame = async (gameId: string) => {
    try {
      await offlineGameService.deleteGame(gameId)
      toast({
        title: "Game Deleted",
        description: "The game has been removed from offline storage.",
      })
      await loadDownloadedGames()
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the game.",
        variant: "destructive",
      })
    }
  }

  const syncPendingData = async () => {
    if (!isOnline) return

    setSyncStatus("syncing")
    try {
      await offlineGameService.syncPendingProgress()
      setSyncStatus("success")
      toast({
        title: "Sync Complete",
        description: "Your offline progress has been synced to the cloud.",
      })
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "Sync Failed",
        description: "Failed to sync offline progress. Will retry automatically.",
        variant: "destructive",
      })
    }

    setTimeout(() => setSyncStatus("idle"), 3000)
  }

  const getTotalStorageUsed = () => {
    return `${downloadedGames.length * 5} MB` // Mock calculation
  }

  const getStorageIcon = () => {
    const used = downloadedGames.length * 5
    if (used > 50) return "🔴"
    if (used > 20) return "🟡"
    return "🟢"
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-orange-500" />
                )}
                <span className="font-medium">{isOnline ? "Online" : "Offline Mode"}</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Storage: {getTotalStorageUsed()} {getStorageIcon()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isOnline && (
                <Button variant="outline" size="sm" onClick={syncPendingData} disabled={syncStatus === "syncing"}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                  {syncStatus === "syncing" ? "Syncing..." : "Sync Data"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Games */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Downloaded Games ({downloadedGames.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">Games available for offline play</p>
        </CardHeader>
        <CardContent>
          {downloadedGames.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-muted-foreground">No games downloaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">Download games below to play offline</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {downloadedGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <h3 className="font-medium">{game.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{game.size}</span>
                        <span>•</span>
                        <span>v{game.version}</span>
                        <span>•</span>
                        <span>{game.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => window.open(`/games/${game.id}`, "_blank")}>
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteGame(game.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available for Download */}
      <Card>
        <CardHeader>
          <CardTitle>Available Games</CardTitle>
          <p className="text-sm text-muted-foreground">Download games to play offline</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availableGames.map((game) => {
              const isDownloaded = downloadedGames.some((d) => d.id === game.id)
              const isDownloading = downloading.has(game.id)
              const progress = downloadProgress[game.id] || 0

              return (
                <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <h3 className="font-medium">{game.name}</h3>
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          ~5 MB
                        </Badge>
                        {isDownloaded && (
                          <Badge variant="secondary" className="text-xs">
                            Downloaded
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isDownloading ? (
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Downloading</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant={isDownloaded ? "outline" : "default"}
                        onClick={() => downloadGame(game.id, game.type)}
                        disabled={isDownloaded || !isOnline}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {isDownloaded ? "Downloaded" : "Download"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sync Dialog */}
      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sync Offline Data
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your offline progress will be synced to the cloud when you're back online. This ensures your achievements
              and scores are saved across all devices.
            </p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Pending sync items: 3</span>
            </div>
            <Button className="w-full" onClick={() => setShowSyncDialog(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
