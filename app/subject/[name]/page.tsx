"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigation } from "@/hooks/use-navigation"
import { GamificationService } from "@/lib/gamification"
import { LessonCard } from "@/components/student/lesson-card"
import { ArrowLeft, BookOpen } from "lucide-react"
import type { Lesson } from "@/types/gamification"

interface SubjectPageProps {
  params: {
    name: string
  }
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const { navigateBack, navigateToLesson } = useNavigation()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [subjectProgress, setSubjectProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const gamificationService = GamificationService.getInstance()
  const subjectName = decodeURIComponent(params.name)

  useEffect(() => {
    // Load subject lessons and progress
    const allLessons = gamificationService.getLessons(subjectName)
    const progress = gamificationService.getStudentProgress("current-user")

    setLessons(allLessons)
    setSubjectProgress(progress.subjectProgress[subjectName])
    setIsLoading(false)
  }, [subjectName])

  const handleStartLesson = (lessonId: string) => {
    navigateToLesson(lessonId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const completionPercentage = subjectProgress
    ? Math.round((subjectProgress.completedLessons / subjectProgress.totalLessons) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={navigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">{subjectName}</h1>
              <p className="text-muted-foreground">Explore lessons and master the concepts</p>
            </div>
          </div>

          {/* Subject Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subject Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{lessons.length}</div>
                  <div className="text-sm text-muted-foreground">Total Lessons</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{subjectProgress?.completedLessons || 0}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent">{subjectProgress?.averageScore || 0}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-chart-1">{subjectProgress?.timeSpent || 0}</div>
                  <div className="text-sm text-muted-foreground">Minutes Spent</div>
                </div>
              </div>

              {subjectProgress && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lessons Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Lessons</h2>

            {lessons.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No lessons available for this subject yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} onStartLesson={handleStartLesson} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
