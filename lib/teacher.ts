import type { ContentItem, Assignment, StudentAnalytics, ClassData } from "@/types/teacher"

export class TeacherService {
  private static instance: TeacherService

  static getInstance(): TeacherService {
    if (!TeacherService.instance) {
      TeacherService.instance = new TeacherService()
    }
    return TeacherService.instance
  }

  // Mock data for demonstration
  getTeacherContent(teacherId: string): ContentItem[] {
    return [
      {
        id: "content-1",
        title: "Introduction to Forces",
        subject: "Physics",
        type: "lesson",
        description: "Basic concepts of forces and motion for grade 8 students",
        difficulty: "beginner",
        estimatedTime: 20,
        points: 50,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        isPublished: true,
        downloadCount: 45,
        averageRating: 4.2,
      },
      {
        id: "content-2",
        title: "Algebra Quiz - Linear Equations",
        subject: "Mathematics",
        type: "quiz",
        description: "Assessment quiz covering linear equations and graphing",
        difficulty: "intermediate",
        estimatedTime: 30,
        points: 75,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
        isPublished: true,
        downloadCount: 32,
        averageRating: 4.5,
      },
      {
        id: "content-3",
        title: "Chemical Reactions Simulation",
        subject: "Chemistry",
        type: "simulation",
        description: "Interactive simulation of basic chemical reactions",
        difficulty: "intermediate",
        estimatedTime: 25,
        points: 80,
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-25"),
        isPublished: false,
        downloadCount: 0,
        averageRating: 0,
      },
    ]
  }

  getAssignments(teacherId: string): Assignment[] {
    return [
      {
        id: "assign-1",
        title: "Physics Fundamentals Week 1",
        description: "Complete lessons on forces and motion, then take the quiz",
        contentIds: ["content-1", "quiz-forces"],
        assignedTo: ["class-8a", "class-8b"],
        dueDate: new Date("2024-02-15"),
        createdAt: new Date("2024-01-20"),
        isActive: true,
        completionRate: 68,
      },
      {
        id: "assign-2",
        title: "Algebra Practice Set",
        description: "Practice linear equations and submit solutions",
        contentIds: ["content-2"],
        assignedTo: ["class-9a"],
        dueDate: new Date("2024-02-10"),
        createdAt: new Date("2024-01-25"),
        isActive: true,
        completionRate: 45,
      },
    ]
  }

  getStudentAnalytics(teacherId: string): StudentAnalytics[] {
    return [
      {
        studentId: "student-1",
        studentName: "Alex Chen",
        grade: 8,
        totalPoints: 1250,
        level: 8,
        completedLessons: 15,
        averageScore: 87,
        timeSpent: 420,
        lastActivity: new Date("2024-01-28"),
        subjectProgress: {
          Physics: { completedLessons: 8, averageScore: 85, timeSpent: 180 },
          Mathematics: { completedLessons: 7, averageScore: 89, timeSpent: 240 },
        },
      },
      {
        studentId: "student-2",
        studentName: "Maria Garcia",
        grade: 8,
        totalPoints: 980,
        level: 6,
        completedLessons: 12,
        averageScore: 92,
        timeSpent: 360,
        lastActivity: new Date("2024-01-27"),
        subjectProgress: {
          Physics: { completedLessons: 6, averageScore: 94, timeSpent: 160 },
          Mathematics: { completedLessons: 6, averageScore: 90, timeSpent: 200 },
        },
      },
      {
        studentId: "student-3",
        studentName: "David Kim",
        grade: 8,
        totalPoints: 750,
        level: 5,
        completedLessons: 9,
        averageScore: 78,
        timeSpent: 280,
        lastActivity: new Date("2024-01-26"),
        subjectProgress: {
          Physics: { completedLessons: 4, averageScore: 75, timeSpent: 120 },
          Mathematics: { completedLessons: 5, averageScore: 81, timeSpent: 160 },
        },
      },
    ]
  }

  getClasses(teacherId: string): ClassData[] {
    const students = this.getStudentAnalytics(teacherId)
    return [
      {
        id: "class-8a",
        name: "Grade 8A - Physics & Math",
        grade: 8,
        subject: "Physics, Mathematics",
        studentCount: 25,
        students: students,
        averageProgress: 72,
        averageScore: 85,
      },
      {
        id: "class-8b",
        name: "Grade 8B - Physics & Math",
        grade: 8,
        subject: "Physics, Mathematics",
        studentCount: 23,
        students: students.slice(0, 2),
        averageProgress: 68,
        averageScore: 82,
      },
    ]
  }

  async uploadContent(
    content: Omit<ContentItem, "id" | "createdAt" | "updatedAt" | "downloadCount" | "averageRating">,
  ): Promise<ContentItem> {
    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      ...content,
      id: `content-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloadCount: 0,
      averageRating: 0,
    }
  }

  async createAssignment(assignment: Omit<Assignment, "id" | "createdAt" | "completionRate">): Promise<Assignment> {
    // Simulate assignment creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      ...assignment,
      id: `assign-${Date.now()}`,
      createdAt: new Date(),
      completionRate: 0,
    }
  }
}
