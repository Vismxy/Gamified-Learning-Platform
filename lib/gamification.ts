import type { StudentProgress, Badge, Achievement, Lesson, LeaderboardEntry } from "@/types/gamification"

export class GamificationService {
  private static instance: GamificationService

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService()
    }
    return GamificationService.instance
  }

  // Mock data for demonstration
  getStudentProgress(userId: string): StudentProgress {
    return {
      userId,
      totalPoints: 1250,
      level: 8,
      badges: this.getMockBadges().slice(0, 3),
      achievements: this.getMockAchievements().slice(0, 2),
      streak: {
        current: 7,
        longest: 12,
        lastActivity: new Date(),
      },
      subjectProgress: {
        Physics: {
          completedLessons: 8,
          totalLessons: 15,
          averageScore: 87,
          timeSpent: 240,
        },
        Mathematics: {
          completedLessons: 12,
          totalLessons: 20,
          averageScore: 92,
          timeSpent: 360,
        },
        Chemistry: {
          completedLessons: 5,
          totalLessons: 12,
          averageScore: 78,
          timeSpent: 180,
        },
        Biology: {
          completedLessons: 3,
          totalLessons: 10,
          averageScore: 85,
          timeSpent: 120,
        },
      },
    }
  }

  getMockBadges(): Badge[] {
    return [
      {
        id: "first-lesson",
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "🎯",
        color: "bg-primary",
        unlockedAt: new Date("2024-01-15"),
      },
      {
        id: "streak-7",
        name: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        icon: "🔥",
        color: "bg-orange-500",
        unlockedAt: new Date("2024-01-20"),
      },
      {
        id: "physics-master",
        name: "Physics Explorer",
        description: "Complete 5 physics lessons",
        icon: "⚛️",
        color: "bg-blue-500",
        unlockedAt: new Date("2024-01-25"),
      },
      {
        id: "quiz-ace",
        name: "Quiz Master",
        description: "Score 90+ on 5 quizzes",
        icon: "🏆",
        color: "bg-yellow-500",
      },
      {
        id: "math-genius",
        name: "Math Genius",
        description: "Complete all math modules",
        icon: "🧮",
        color: "bg-purple-500",
      },
    ]
  }

  getMockAchievements(): Achievement[] {
    return [
      {
        id: "first-100",
        title: "Century Club",
        description: "Earn your first 100 points",
        points: 100,
        completedAt: new Date("2024-01-16"),
      },
      {
        id: "perfect-week",
        title: "Perfect Week",
        description: "Complete lessons for 7 consecutive days",
        points: 200,
        completedAt: new Date("2024-01-22"),
      },
    ]
  }

  getLessons(subject?: string): Lesson[] {
    const allLessons: Lesson[] = [
      {
        id: "physics-1",
        title: "Introduction to Motion",
        subject: "Physics",
        difficulty: "beginner",
        estimatedTime: 15,
        points: 50,
        isLocked: false,
        isCompleted: true,
        description: "Learn the basics of motion and velocity",
        type: "video",
      },
      {
        id: "physics-2",
        title: "Forces and Newton's Laws",
        subject: "Physics",
        difficulty: "intermediate",
        estimatedTime: 20,
        points: 75,
        isLocked: false,
        isCompleted: true,
        description: "Explore the fundamental laws of motion",
        type: "interactive",
      },
      {
        id: "math-1",
        title: "Algebra Fundamentals",
        subject: "Mathematics",
        difficulty: "beginner",
        estimatedTime: 25,
        points: 60,
        isLocked: false,
        isCompleted: true,
        description: "Master basic algebraic operations",
        type: "quiz",
      },
      {
        id: "chemistry-1",
        title: "Atomic Structure",
        subject: "Chemistry",
        difficulty: "intermediate",
        estimatedTime: 30,
        points: 80,
        isLocked: false,
        isCompleted: false,
        description: "Understand the building blocks of matter",
        type: "simulation",
      },
      {
        id: "biology-1",
        title: "Cell Biology Basics",
        subject: "Biology",
        difficulty: "beginner",
        estimatedTime: 20,
        points: 55,
        isLocked: true,
        isCompleted: false,
        description: "Discover the fundamental unit of life",
        type: "video",
      },
    ]

    return subject ? allLessons.filter((lesson) => lesson.subject === subject) : allLessons
  }

  getCurrentChallenge() {
    return {
      id: "weekly-physics-challenge",
      title: "Physics Mastery Week",
      description: "Join students worldwide to complete 1000 physics lessons this week!",
      targetScore: 10000,
      currentScore: 7250,
      participants: 1247,
      timeLeft: "2 days 14 hours",
      isJoined: false,
      rewards: {
        points: 500,
        badge: "Physics Champion",
      },
    }
  }

  async joinChallenge(challengeId: string): Promise<boolean> {
    // Simulate API call
    console.log("[v0] Joining challenge:", challengeId)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  async contributeToChallenge(challengeId: string, points: number): Promise<boolean> {
    // Simulate API call
    console.log("[v0] Contributing to challenge:", challengeId, "points:", points)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  getLeaderboard(): LeaderboardEntry[] {
    return [
      { userId: "1", name: "Alex Chen", points: 2450, level: 12, rank: 1 },
      { userId: "2", name: "Maria Garcia", points: 2200, level: 11, rank: 2 },
      { userId: "3", name: "You", points: 1250, level: 8, rank: 3 },
      { userId: "4", name: "David Kim", points: 1100, level: 7, rank: 4 },
      { userId: "5", name: "Sarah Johnson", points: 950, level: 6, rank: 5 },
      { userId: "6", name: "Emma Wilson", points: 875, level: 6, rank: 6 },
      { userId: "7", name: "James Brown", points: 820, level: 5, rank: 7 },
      { userId: "8", name: "Lisa Zhang", points: 780, level: 5, rank: 8 },
    ]
  }

  calculateLevel(points: number): number {
    return Math.floor(points / 200) + 1
  }

  getPointsToNextLevel(points: number): number {
    const currentLevel = this.calculateLevel(points)
    const pointsForNextLevel = currentLevel * 200
    return pointsForNextLevel - points
  }
}
