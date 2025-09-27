export interface LearningEvent {
  id: string
  userId: string
  eventType:
    | "lesson_start"
    | "lesson_complete"
    | "quiz_attempt"
    | "quiz_complete"
    | "badge_earned"
    | "level_up"
    | "login"
    | "logout"
  subjectId: string
  lessonId?: string
  quizId?: string
  score?: number
  timeSpent?: number
  timestamp: Date
  metadata?: Record<string, any>
}

export interface StudentAnalytics {
  userId: string
  totalTimeSpent: number
  lessonsCompleted: number
  quizzesCompleted: number
  averageScore: number
  streakDays: number
  badgesEarned: number
  level: number
  subjectProgress: Record<string, number>
  weeklyActivity: number[]
  lastActive: Date
}

export interface ClassAnalytics {
  classId: string
  totalStudents: number
  activeStudents: number
  averageProgress: number
  averageScore: number
  completionRate: number
  engagementScore: number
  topPerformers: StudentAnalytics[]
  strugglingStudents: StudentAnalytics[]
  subjectPerformance: Record<string, number>
}

export interface PlatformAnalytics {
  totalUsers: number
  activeUsers: number
  totalLessons: number
  totalQuizzes: number
  averageSessionTime: number
  retentionRate: number
  popularSubjects: Array<{ subject: string; engagement: number }>
  deviceTypes: Record<string, number>
  geographicDistribution: Record<string, number>
}

export interface Report {
  id: string
  title: string
  type: "student" | "class" | "platform"
  generatedBy: string
  generatedAt: Date
  dateRange: { start: Date; end: Date }
  data: any
  format: "pdf" | "csv" | "json"
}
