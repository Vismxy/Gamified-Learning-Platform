"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useNavigation } from "@/hooks/use-navigation"
import { useToast } from "@/hooks/use-toast"
import { GamificationService } from "@/lib/gamification"
import { getQuizzesBySubject } from "@/lib/quiz-data"
import { ArrowLeft, Play, CheckCircle, Clock, Award } from "lucide-react"
import type { Lesson } from "@/types/gamification"

interface LessonPageProps {
  params: {
    id: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const { navigateBack, navigateToDashboard, navigateToQuiz } = useNavigation()
  const { toast } = useToast()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const gamificationService = GamificationService.getInstance()

  useEffect(() => {
    // Load lesson data
    const allLessons = gamificationService.getLessons()
    const foundLesson = allLessons.find((l) => l.id === params.id)

    if (foundLesson) {
      setLesson(foundLesson)
      setIsCompleted(foundLesson.isCompleted)
    }
    setIsLoading(false)
  }, [params.id])

  const handleStartLesson = () => {
    if (!lesson) return

    // Simulate lesson progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsCompleted(true)
        toast({
          title: "Lesson Complete!",
          description: `You earned ${lesson.points} points!`,
        })
      }
    }, 500)
  }

  const handleTakeQuiz = () => {
    if (!lesson) return

    // Get quizzes for the lesson's subject
    const subjectQuizzes = getQuizzesBySubject(lesson.subject.toLowerCase() as "physics" | "chemistry" | "biology")

    // Find appropriate quiz based on lesson difficulty
    let targetQuiz = subjectQuizzes.find((quiz) => {
      if (lesson.difficulty === "beginner") return quiz.difficulty === "easy"
      if (lesson.difficulty === "intermediate") return quiz.difficulty === "medium"
      if (lesson.difficulty === "advanced") return quiz.difficulty === "hard"
      return quiz.difficulty === "easy" // fallback
    })

    // If no matching difficulty, get the first available quiz for the subject
    if (!targetQuiz && subjectQuizzes.length > 0) {
      targetQuiz = subjectQuizzes[0]
    }

    if (targetQuiz) {
      console.log("[v0] Navigating to quiz:", targetQuiz.id)
      navigateToQuiz(targetQuiz.id)
    } else {
      toast({
        title: "Quiz Not Available",
        description: "No quiz found for this lesson. Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Lesson not found</p>
            <Button onClick={navigateBack} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={navigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">{lesson.title}</h1>
              <p className="text-muted-foreground">{lesson.subject}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {lesson.estimatedTime} min
              </Badge>
            </div>
          </div>

          {/* Lesson Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Play className="h-5 w-5 text-primary" />
                )}
                Lesson Content
              </CardTitle>
              <p className="text-muted-foreground">{lesson.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Mock lesson content based on type */}
              {lesson.type === "video" && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Video Content</p>
                    <p className="text-sm text-muted-foreground">{lesson.title}</p>
                  </div>
                </div>
              )}

              {lesson.type === "interactive" && (
                <div className="p-6 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-4">Interactive Simulation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background rounded border">
                      <h4 className="font-medium mb-2">Concept 1</h4>
                      <p className="text-sm text-muted-foreground">
                        Interactive elements and simulations help you understand complex concepts.
                      </p>
                    </div>
                    <div className="p-4 bg-background rounded border">
                      <h4 className="font-medium mb-2">Concept 2</h4>
                      <p className="text-sm text-muted-foreground">Practice with real-world examples and scenarios.</p>
                    </div>
                  </div>
                </div>
              )}

              {lesson.type === "simulation" && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <h3 className="font-semibold mb-4">3D Simulation</h3>
                  <div className="aspect-video bg-background rounded border flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">3D Interactive Simulation</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isCompleted && progress === 0 && (
                  <Button onClick={handleStartLesson} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Lesson
                  </Button>
                )}

                {isCompleted && (
                  <>
                    <Button onClick={handleTakeQuiz} className="flex-1">
                      Take Quiz
                    </Button>
                    <Button variant="outline" onClick={navigateToDashboard}>
                      Continue Learning
                    </Button>
                  </>
                )}
              </div>

              {/* Lesson Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{lesson.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{lesson.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{isCompleted ? "100%" : "0%"}</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
