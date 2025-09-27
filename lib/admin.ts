import type { SystemUser, ContentModeration, SystemStats, PlatformAnalytics, SystemSettings } from "@/types/admin"

export class AdminService {
  private static instance: AdminService

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService()
    }
    return AdminService.instance
  }

  // Mock data for demonstration
  getSystemUsers(): SystemUser[] {
    return [
      {
        id: "user-1",
        name: "Alex Chen",
        email: "alex.chen@school.edu",
        role: "student",
        grade: 8,
        school: "Rural High School",
        isActive: true,
        createdAt: new Date("2024-01-15"),
        lastLogin: new Date("2024-01-28"),
        totalPoints: 1250,
        level: 8,
      },
      {
        id: "user-2",
        name: "Dr. Sarah Johnson",
        email: "s.johnson@school.edu",
        role: "teacher",
        subjects: ["Physics", "Mathematics"],
        school: "Rural High School",
        isActive: true,
        createdAt: new Date("2024-01-10"),
        lastLogin: new Date("2024-01-28"),
      },
      {
        id: "user-3",
        name: "Maria Garcia",
        email: "maria.garcia@school.edu",
        role: "student",
        grade: 9,
        school: "Rural High School",
        isActive: false,
        createdAt: new Date("2024-01-20"),
        lastLogin: new Date("2024-01-25"),
        totalPoints: 890,
        level: 6,
      },
      {
        id: "user-4",
        name: "Admin User",
        email: "admin@school.edu",
        role: "admin",
        school: "Rural High School",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        lastLogin: new Date("2024-01-28"),
      },
    ]
  }

  getPendingContent(): ContentModeration[] {
    return [
      {
        id: "mod-1",
        contentId: "content-1",
        title: "Advanced Quantum Physics",
        author: "Dr. Sarah Johnson",
        subject: "Physics",
        type: "lesson",
        status: "pending",
        submittedAt: new Date("2024-01-25"),
      },
      {
        id: "mod-2",
        contentId: "content-2",
        title: "Chemical Reactions Quiz",
        author: "Prof. Mike Wilson",
        subject: "Chemistry",
        type: "quiz",
        status: "pending",
        submittedAt: new Date("2024-01-26"),
      },
      {
        id: "mod-3",
        contentId: "content-3",
        title: "Biology Cell Structure",
        author: "Dr. Lisa Brown",
        subject: "Biology",
        type: "simulation",
        status: "approved",
        submittedAt: new Date("2024-01-20"),
        reviewedAt: new Date("2024-01-22"),
        reviewedBy: "Admin User",
        reviewNotes: "Excellent content, approved for all grades",
      },
    ]
  }

  getSystemStats(): SystemStats {
    return {
      totalUsers: 1247,
      activeUsers: 892,
      totalStudents: 1050,
      totalTeachers: 45,
      totalContent: 234,
      pendingContent: 12,
      totalAssignments: 89,
      systemUptime: "99.8%",
      storageUsed: 2.4, // GB
      storageLimit: 10, // GB
    }
  }

  getPlatformAnalytics(): PlatformAnalytics {
    return {
      dailyActiveUsers: [
        { date: "2024-01-22", count: 145 },
        { date: "2024-01-23", count: 167 },
        { date: "2024-01-24", count: 189 },
        { date: "2024-01-25", count: 203 },
        { date: "2024-01-26", count: 178 },
        { date: "2024-01-27", count: 156 },
        { date: "2024-01-28", count: 192 },
      ],
      contentEngagement: [
        { subject: "Physics", views: 1234, completions: 892 },
        { subject: "Mathematics", views: 1567, completions: 1123 },
        { subject: "Chemistry", views: 987, completions: 743 },
        { subject: "Biology", views: 876, completions: 654 },
      ],
      userGrowth: [
        { month: "Oct 2023", students: 850, teachers: 38 },
        { month: "Nov 2023", students: 920, teachers: 41 },
        { month: "Dec 2023", students: 985, teachers: 43 },
        { month: "Jan 2024", students: 1050, teachers: 45 },
      ],
      topPerformingContent: [
        { title: "Introduction to Forces", subject: "Physics", rating: 4.8, completions: 234 },
        { title: "Algebra Basics", subject: "Mathematics", rating: 4.7, completions: 198 },
        { title: "Cell Biology", subject: "Biology", rating: 4.6, completions: 167 },
        { title: "Chemical Bonds", subject: "Chemistry", rating: 4.5, completions: 145 },
      ],
    }
  }

  getSystemSettings(): SystemSettings {
    return {
      platformName: "STEM Gamify",
      allowRegistration: true,
      requireEmailVerification: true,
      defaultLanguage: "English",
      supportedLanguages: ["English", "Hindi", "Tamil"],
      maxFileSize: 50, // MB
      enableOfflineMode: true,
      maintenanceMode: false,
      announcementMessage: "Welcome to the new STEM Gamify platform!",
    }
  }

  async createUser(userData: Omit<SystemUser, "id" | "createdAt">): Promise<SystemUser> {
    // Simulate user creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    }
  }

  async updateUser(userId: string, updates: Partial<SystemUser>): Promise<SystemUser> {
    // Simulate user update
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = this.getSystemUsers()
    const user = users.find((u) => u.id === userId)
    if (!user) throw new Error("User not found")

    return { ...user, ...updates }
  }

  async deleteUser(userId: string): Promise<void> {
    // Simulate user deletion
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  async moderateContent(
    contentId: string,
    status: "approved" | "rejected",
    reviewNotes?: string,
  ): Promise<ContentModeration> {
    // Simulate content moderation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const content = this.getPendingContent().find((c) => c.contentId === contentId)
    if (!content) throw new Error("Content not found")

    return {
      ...content,
      status,
      reviewedAt: new Date(),
      reviewedBy: "Admin User",
      reviewNotes,
    }
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    // Simulate settings update
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const currentSettings = this.getSystemSettings()
    return { ...currentSettings, ...settings }
  }
}
