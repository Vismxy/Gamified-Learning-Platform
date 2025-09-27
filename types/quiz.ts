export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  subject: "physics" | "chemistry" | "biology" | "mathematics"
  topic: string
  points: number
}

export interface Quiz {
  id: string
  title: string
  subject: "physics" | "chemistry" | "biology" | "mathematics"
  difficulty: "easy" | "medium" | "hard"
  questions: QuizQuestion[]
  timeLimit: number // in minutes
  passingScore: number
  totalPoints: number
  description: string
  prerequisites?: string[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answers: Record<string, number>
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  completedAt: Date
  passed: boolean
}

export interface QuizResult {
  attempt: QuizAttempt
  quiz: Quiz
  questionResults: Array<{
    question: QuizQuestion
    userAnswer: number
    isCorrect: boolean
    pointsEarned: number
  }>
}
