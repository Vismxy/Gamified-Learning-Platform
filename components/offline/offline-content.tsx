"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LessonCard } from "@/components/student/lesson-card"
import { offlineStorage } from "@/lib/offline-storage"
import { pwaUtils } from "@/lib/pwa-utils"
import { Download, Trash2, HardDrive } from "lucide-react"
import type { Lesson } from "@/types/gamification"

interface OfflineContentProps {
  availableLessons: Lesson[]
  onLessonStart: (lessonId: string) => void
}

export function OfflineContent({ availableLessons, onLessonStart }: OfflineContentProps) {
  const [downloadedLessons, setDownloadedLessons] = useState<Lesson[]>([])
  const [downloading, setDownloading] = useState<string[]>([])
  const [storageInfo, setStorageInfo] = useState<{ used: number; quota: number } | null>(null)

  useEffect(() => {
    loadDownloadedContent()
    loadStorageInfo()
  }, [])

  const loadDownloadedContent = async () => {
    try {
      const lessons = await offlineStorage.getLessons()
      setDownloadedLessons(lessons)
    } catch (error) {
      console.error("Failed to load downloaded content:", error)
    }
  }

  const loadStorageInfo = async () => {
    const info = await pwaUtils.getStorageUsage()
    setStorageInfo(info)
  }

  const downloadLesson = async (lesson: Lesson) => {
    if (downloading.includes(lesson.id)) return

    setDownloading((prev) => [...prev, lesson.id])
    try {
      // Simulate downloading lesson content
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store lesson in IndexedDB
      await offlineStorage.storeLessons([lesson])

      // Reload downloaded content
      await loadDownloadedContent()
      await loadStorageInfo()
    } catch (error) {
      console.error("Failed to download lesson:", error)
    } finally {
      setDownloading((prev) => prev.filter((id) => id !== lesson.id))
    }
  }

  const deleteLesson = async (lessonId: string) => {
    try {
      // This would remove the lesson from IndexedDB
      // For now, we'll just filter it out
      setDownloadedLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
      await loadStorageInfo()
    } catch (error) {
      console.error("Failed to delete lesson:", error)
    }
  }

  const clearAllContent = async () => {
    if (window.confirm("Are you sure you want to delete all downloaded content?")) {
      try {
        await pwaUtils.clearAppData()
        setDownloadedLessons([])
        await loadStorageInfo()
      } catch (error) {
        console.error("Failed to clear content:", error)
      }
    }
  }

  const isLessonDownloaded = (lessonId: string) => {
    return downloadedLessons.some((lesson) => lesson.id === lessonId)
  }

  const storagePercentage = storageInfo ? (storageInfo.used / storageInfo.quota) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Used Storage</span>
              <span>{storageInfo ? `${(storageInfo.used / 1024 / 1024).toFixed(1)} MB` : "Unknown"}</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{downloadedLessons.length} lessons downloaded</span>
              <Button variant="outline" size="sm" onClick={clearAllContent}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Content */}
      <Card>
        <CardHeader>
          <CardTitle>Downloaded Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          {downloadedLessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No lessons downloaded yet</p>
              <p className="text-sm">Download lessons below to access them offline</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {downloadedLessons.map((lesson) => (
                <div key={lesson.id} className="relative">
                  <LessonCard lesson={lesson} onStartLesson={onLessonStart} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => deleteLesson(lesson.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available for Download */}
      <Card>
        <CardHeader>
          <CardTitle>Available for Download</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availableLessons
              .filter((lesson) => !isLessonDownloaded(lesson.id))
              .map((lesson) => (
                <div key={lesson.id} className="relative">
                  <LessonCard lesson={lesson} onStartLesson={onLessonStart} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => downloadLesson(lesson)}
                    disabled={downloading.includes(lesson.id)}
                  >
                    {downloading.includes(lesson.id) ? (
                      <>
                        <div className="mr-1 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
