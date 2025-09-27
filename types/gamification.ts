export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  unlockedAt?: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  badge?: Badge
  completedAt?: Date
}

export interface LearningStreak {
  current: number
  longest: number
  lastActivity: Date
}

export interface StudentProgress {
  userId: string
  totalPoints: number
  level: number
  badges: Badge[]
  achievements: Achievement[]
  streak: LearningStreak
  subjectProgress: {
    [subject: string]: {
      completedLessons: number
      totalLessons: number
      averageScore: number
      timeSpent: number // in minutes
    }
  }
}

export interface Lesson {
  id: string
  title: string
  subject: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number // in minutes
  points: number
  isLocked: boolean
  isCompleted: boolean
  description: string
  type: "video" | "interactive" | "quiz" | "simulation"
}

export interface LeaderboardEntry {
  userId: string
  name: string
  points: number
  level: number
  rank: number
  avatar?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  targetScore: number
  currentScore: number
  participants: number
  timeLeft: string
  isJoined?: boolean
  rewards: {
    points: number
    badge?: string
  }
  startDate: Date
  endDate: Date
  type: "weekly" | "monthly" | "special"
  subjects?: string[]
}

export interface CommunityStats {
  totalParticipants: number
  activeUsers: number
  completedChallenges: number
  averageScore: number
  topCountries: string[]
}
