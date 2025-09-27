"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, Lock, CheckCircle, Play, BookOpen, Zap, HelpCircle } from "lucide-react"
import type { Lesson } from "@/types/gamification"

interface LessonCardProps {
  lesson: Lesson
  onStartLesson: (lessonId: string) => void
}

const typeIcons = {
  video: Play,
  interactive: Zap,
  quiz: HelpCircle,
  simulation: BookOpen,
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
}

export function LessonCard({ lesson, onStartLesson }: LessonCardProps) {
  const TypeIcon = typeIcons[lesson.type]

  return (
    <Card className={`transition-all hover:shadow-md ${lesson.isLocked ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">{lesson.title}</CardTitle>
          </div>
          {lesson.isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
          {lesson.isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className={difficultyColors[lesson.difficulty]}>
            {lesson.difficulty}
          </Badge>
          <Badge variant="outline">{lesson.subject}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{lesson.description}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{lesson.estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>{lesson.points} points</span>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={lesson.isLocked}
          variant={lesson.isCompleted ? "outline" : "default"}
          onClick={() => onStartLesson(lesson.id)}
        >
          {lesson.isLocked
            ? "Locked"
            : lesson.isCompleted
              ? "Review"
              : lesson.type === "quiz"
                ? "Take Quiz"
                : "Start Lesson"}
        </Button>
      </CardContent>
    </Card>
  )
}
