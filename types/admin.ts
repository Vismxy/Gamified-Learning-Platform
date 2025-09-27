export interface SystemUser {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  grade?: number
  subjects?: string[]
  school: string
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
  totalPoints?: number
  level?: number
}

export interface ContentModeration {
  id: string
  contentId: string
  title: string
  author: string
  subject: string
  type: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalStudents: number
  totalTeachers: number
  totalContent: number
  pendingContent: number
  totalAssignments: number
  systemUptime: string
  storageUsed: number
  storageLimit: number
}

export interface PlatformAnalytics {
  dailyActiveUsers: { date: string; count: number }[]
  contentEngagement: { subject: string; views: number; completions: number }[]
  userGrowth: { month: string; students: number; teachers: number }[]
  topPerformingContent: { title: string; subject: string; rating: number; completions: number }[]
}

export interface SystemSettings {
  platformName: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  defaultLanguage: string
  supportedLanguages: string[]
  maxFileSize: number
  enableOfflineMode: boolean
  maintenanceMode: boolean
  announcementMessage?: string
}
