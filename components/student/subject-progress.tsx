"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, TrendingUp, Target } from "lucide-react"
import { useNavigation } from "@/hooks/use-navigation"
import type { StudentProgress } from "@/types/gamification"

interface SubjectProgressProps {
  progress: StudentProgress
  onSubjectClick: (subject: string) => void
}

const subjectIcons: { [key: string]: string } = {
  Physics: "⚛️",
  Mathematics: "🧮",
  Chemistry: "🧪",
  Biology: "🧬",
}

const subjectColors: { [key: string]: string } = {
  Physics: "bg-blue-500",
  Mathematics: "bg-purple-500",
  Chemistry: "bg-green-500",
  Biology: "bg-orange-500",
}

export function SubjectProgress({ progress, onSubjectClick }: SubjectProgressProps) {
  const { navigateToQuiz } = useNavigation()

  const handleQuizClick = (subject: string) => {
    const quizId = `${subject.toLowerCase()}-easy-1`
    navigateToQuiz(quizId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Subject Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(progress.subjectProgress).map(([subject, data]) => {
            const completionPercentage = (data.completedLessons / data.totalLessons) * 100

            return (
              <div key={subject} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{subjectIcons[subject]}</span>
                    <h4 className="font-medium">{subject}</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuizClick(subject)}
                      className="flex items-center gap-1"
                    >
                      <Target className="h-3 w-3" />
                      Quiz
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onSubjectClick(subject)}>
                      Continue
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {data.completedLessons}/{data.totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Avg Score:</span>
                    <span className="font-medium">{data.averageScore}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {Math.floor(data.timeSpent / 60)}h {data.timeSpent % 60}m
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
