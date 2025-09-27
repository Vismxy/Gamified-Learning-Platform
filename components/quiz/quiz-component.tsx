"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, XCircle, Award, RotateCcw } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { useNavigation } from "@/hooks/use-navigation"
import { getQuizById, getQuizzesBySubject } from "@/lib/quiz-data"
import type { Quiz, QuizAttempt, QuizResult } from "@/types/quiz"

interface QuizComponentProps {
  quizId?: string
  subject?: "physics" | "chemistry" | "biology" | "mathematics"
  difficulty?: "easy" | "medium" | "hard"
  onComplete?: (result: QuizResult) => void
}

export function QuizComponent({ quizId, subject, difficulty, onComplete }: QuizComponentProps) {
  const { t } = useTranslation()
  const { navigateBack, navigateToDashboard } = useNavigation()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    console.log("[v0] Loading quiz with:", { quizId, subject, difficulty })

    // Load quiz data
    if (quizId) {
      console.log("[v0] Loading quiz by ID:", quizId)
      const loadedQuiz = getQuizById(quizId)
      console.log("[v0] Found quiz:", loadedQuiz)
      setQuiz(loadedQuiz || null)
    } else if (subject) {
      console.log("[v0] Loading quiz by subject:", subject)
      const quizzes = getQuizzesBySubject(subject)
      console.log("[v0] Available quizzes for subject:", quizzes.length)
      const filteredQuizzes = difficulty ? quizzes.filter((q) => q.difficulty === difficulty) : quizzes

      if (filteredQuizzes.length > 0) {
        // Select random quiz from filtered results
        const randomQuiz = filteredQuizzes[Math.floor(Math.random() * filteredQuizzes.length)]
        console.log("[v0] Selected random quiz:", randomQuiz)
        setQuiz(randomQuiz)
      } else {
        console.log("[v0] No quizzes found for criteria")
        setQuiz(null)
      }
    }

    setTimeout(() => setIsLoading(false), 500)
  }, [quizId, subject, difficulty])

  useEffect(() => {
    if (quiz && !startTime) {
      setStartTime(new Date())
      setTimeLeft(quiz.timeLimit * 60) // Convert minutes to seconds
    }
  }, [quiz, startTime])

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmitQuiz()
    }
  }, [timeLeft, isCompleted])

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = () => {
    if (!quiz || !startTime) return

    const endTime = new Date()
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    let correctAnswers = 0
    let totalPoints = 0
    const questionResults = quiz.questions.map((question) => {
      const userAnswer = answers[question.id] ?? -1
      const isCorrect = userAnswer === question.correctAnswer
      const pointsEarned = isCorrect ? question.points : 0

      if (isCorrect) correctAnswers++
      totalPoints += pointsEarned

      return {
        question,
        userAnswer,
        isCorrect,
        pointsEarned,
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      userId: "current-user", // In real app, get from auth context
      answers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent,
      completedAt: endTime,
      passed,
    }

    const quizResult: QuizResult = {
      attempt,
      quiz,
      questionResults,
    }

    setResult(quizResult)
    setIsCompleted(true)
    onComplete?.(quizResult)
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeLeft(quiz?.timeLimit ? quiz.timeLimit * 60 : 0)
    setIsCompleted(false)
    setResult(null)
    setStartTime(new Date())
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (isLoading || !quiz) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="flex gap-2 justify-center">
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>

          {!isLoading && !quiz && (
            <div className="mt-6 space-y-4">
              <p className="text-muted-foreground">
                {quizId ? `Quiz "${quizId}" not found` : `No ${subject} quiz available`}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try these available quizzes:</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/quiz/physics-easy-1")}>
                    Physics Quiz
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/quiz/chemistry-easy-1")}>
                    Chemistry Quiz
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/quiz/biology-easy-1")}>
                    Biology Quiz
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/quiz/mathematics-easy-1")}
                  >
                    Math Quiz
                  </Button>
                </div>
                <Button variant="outline" onClick={navigateBack} className="mt-4 bg-transparent">
                  Go Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isCompleted && result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result.attempt.passed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{result.attempt.score}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-secondary">{result.attempt.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-accent">{formatTime(result.attempt.timeSpent)}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {result.questionResults.reduce((sum, q) => sum + q.pointsEarned, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
          </div>

          {result.attempt.passed && (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-green-800 dark:text-green-200">Congratulations! You passed the quiz!</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">Question Review</h3>
            {result.questionResults.map((questionResult, index) => (
              <Card key={questionResult.question.id} className="p-4">
                <div className="flex items-start gap-3">
                  {questionResult.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      {index + 1}. {questionResult.question.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Your answer:</span>{" "}
                        {questionResult.userAnswer >= 0
                          ? questionResult.question.options[questionResult.userAnswer]
                          : "No answer"}
                      </p>
                      {!questionResult.isCorrect && (
                        <p>
                          <span className="font-medium text-green-600">Correct answer:</span>{" "}
                          {questionResult.question.options[questionResult.question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-muted-foreground">{questionResult.question.explanation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={questionResult.isCorrect ? "default" : "secondary"}>
                      {questionResult.pointsEarned}/{questionResult.question.points}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRetakeQuiz} variant="outline" className="flex-1 bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={navigateToDashboard} className="flex-1">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, Number.parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length === 0}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} disabled={answers[currentQuestion.id] === undefined}>
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
