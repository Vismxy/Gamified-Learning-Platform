export interface ContentItem {
  id: string
  title: string
  subject: string
  type: "lesson" | "quiz" | "video" | "document" | "simulation"
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  points: number
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  downloadCount: number
  averageRating: number
}

export interface Assignment {
  id: string
  title: string
  description: string
  contentIds: string[]
  assignedTo: string[] // student IDs or class IDs
  dueDate: Date
  createdAt: Date
  isActive: boolean
  completionRate: number
}

export interface StudentAnalytics {
  studentId: string
  studentName: string
  grade: number
  totalPoints: number
  level: number
  completedLessons: number
  averageScore: number
  timeSpent: number
  lastActivity: Date
  subjectProgress: {
    [subject: string]: {
      completedLessons: number
      averageScore: number
      timeSpent: number
    }
  }
}

export interface ClassData {
  id: string
  name: string
  grade: number
  subject: string
  studentCount: number
  students: StudentAnalytics[]
  averageProgress: number
  averageScore: number
}
