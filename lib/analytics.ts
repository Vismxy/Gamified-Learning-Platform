import type { LearningEvent, StudentAnalytics, ClassAnalytics, PlatformAnalytics } from "@/types/analytics"

class AnalyticsService {
  private static instance: AnalyticsService

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // Track learning events
  async trackEvent(event: Omit<LearningEvent, "id" | "timestamp">): Promise<void> {
    const learningEvent: LearningEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    // Store in IndexedDB for offline support
    try {
      const { offlineStorage } = await import("./offline-storage")
      await offlineStorage.storeAnalyticsEvent(learningEvent)

      // Also try to send to server if online
      if (navigator.onLine) {
        await this.sendEventToServer(learningEvent)
      }
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  // Send event to server
  private async sendEventToServer(event: LearningEvent): Promise<void> {
    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Failed to send event to server:", error)
    }
  }

  // Get student analytics
  async getStudentAnalytics(userId: string, dateRange?: { start: Date; end: Date }): Promise<StudentAnalytics> {
    try {
      const params = new URLSearchParams({ userId })
      if (dateRange) {
        params.append("start", dateRange.start.toISOString())
        params.append("end", dateRange.end.toISOString())
      }

      const response = await fetch(`/api/analytics/student?${params}`)
      return await response.json()
    } catch (error) {
      console.error("Failed to get student analytics:", error)
      return this.getDefaultStudentAnalytics(userId)
    }
  }

  // Get class analytics
  async getClassAnalytics(classId: string, dateRange?: { start: Date; end: Date }): Promise<ClassAnalytics> {
    try {
      const params = new URLSearchParams({ classId })
      if (dateRange) {
        params.append("start", dateRange.start.toISOString())
        params.append("end", dateRange.end.toISOString())
      }

      const response = await fetch(`/api/analytics/class?${params}`)
      return await response.json()
    } catch (error) {
      console.error("Failed to get class analytics:", error)
      return this.getDefaultClassAnalytics(classId)
    }
  }

  // Get platform analytics
  async getPlatformAnalytics(dateRange?: { start: Date; end: Date }): Promise<PlatformAnalytics> {
    try {
      const params = new URLSearchParams()
      if (dateRange) {
        params.append("start", dateRange.start.toISOString())
        params.append("end", dateRange.end.toISOString())
      }

      const response = await fetch(`/api/analytics/platform?${params}`)
      return await response.json()
    } catch (error) {
      console.error("Failed to get platform analytics:", error)
      return this.getDefaultPlatformAnalytics()
    }
  }

  // Generate report
  async generateReport(
    type: "student" | "class" | "platform",
    targetId: string,
    dateRange: { start: Date; end: Date },
    format: "pdf" | "csv" | "json" = "pdf",
  ): Promise<string> {
    try {
      const response = await fetch("/api/analytics/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, targetId, dateRange, format }),
      })

      const { reportId } = await response.json()
      return reportId
    } catch (error) {
      console.error("Failed to generate report:", error)
      throw error
    }
  }

  // Calculate engagement score
  calculateEngagementScore(analytics: StudentAnalytics): number {
    const factors = {
      timeSpent: Math.min(analytics.totalTimeSpent / 3600, 10) * 0.3, // Max 10 hours
      completion: (analytics.lessonsCompleted / 50) * 0.25, // Assume 50 lessons total
      performance: (analytics.averageScore / 100) * 0.25,
      consistency: Math.min(analytics.streakDays / 30, 1) * 0.2, // Max 30 days
    }

    return Math.round((factors.timeSpent + factors.completion + factors.performance + factors.consistency) * 100)
  }

  // Default analytics for offline/error scenarios
  private getDefaultStudentAnalytics(userId: string): StudentAnalytics {
    return {
      userId,
      totalTimeSpent: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      averageScore: 0,
      streakDays: 0,
      badgesEarned: 0,
      level: 1,
      subjectProgress: {},
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
      lastActive: new Date(),
    }
  }

  private getDefaultClassAnalytics(classId: string): ClassAnalytics {
    return {
      classId,
      totalStudents: 0,
      activeStudents: 0,
      averageProgress: 0,
      averageScore: 0,
      completionRate: 0,
      engagementScore: 0,
      topPerformers: [],
      strugglingStudents: [],
      subjectPerformance: {},
    }
  }

  private getDefaultPlatformAnalytics(): PlatformAnalytics {
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      averageSessionTime: 0,
      retentionRate: 0,
      popularSubjects: [],
      deviceTypes: {},
      geographicDistribution: {},
    }
  }
}

export const analyticsService = AnalyticsService.getInstance()

// Convenience functions for common tracking
export const trackLessonStart = (userId: string, subjectId: string, lessonId: string) => {
  analyticsService.trackEvent({
    userId,
    eventType: "lesson_start",
    subjectId,
    lessonId,
  })
}

export const trackLessonComplete = (userId: string, subjectId: string, lessonId: string, timeSpent: number) => {
  analyticsService.trackEvent({
    userId,
    eventType: "lesson_complete",
    subjectId,
    lessonId,
    timeSpent,
  })
}

export const trackQuizComplete = (
  userId: string,
  subjectId: string,
  quizId: string,
  score: number,
  timeSpent: number,
) => {
  analyticsService.trackEvent({
    userId,
    eventType: "quiz_complete",
    subjectId,
    quizId,
    score,
    timeSpent,
  })
}

export const trackBadgeEarned = (userId: string, subjectId: string, badgeId: string) => {
  analyticsService.trackEvent({
    userId,
    eventType: "badge_earned",
    subjectId,
    metadata: { badgeId },
  })
}
