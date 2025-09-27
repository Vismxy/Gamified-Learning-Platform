"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, BookOpen, Award, Clock, Target, Download } from "lucide-react"
import { analyticsService } from "@/lib/analytics"
import type { StudentAnalytics, ClassAnalytics, PlatformAnalytics } from "@/types/analytics"

interface AnalyticsDashboardProps {
  userRole: "student" | "teacher" | "admin"
  userId?: string
  classId?: string
}

export function AnalyticsDashboard({ userRole, userId, classId }: AnalyticsDashboardProps) {
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytics | null>(null)
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics | null>(null)
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null)
  const [dateRange, setDateRange] = useState("7d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [userRole, userId, classId, dateRange])

  const loadAnalytics = async () => {
    setLoading(true)
    const range = getDateRange(dateRange)

    try {
      if (userRole === "student" && userId) {
        const data = await analyticsService.getStudentAnalytics(userId, range)
        setStudentAnalytics(data)
      } else if (userRole === "teacher" && classId) {
        const data = await analyticsService.getClassAnalytics(classId, range)
        setClassAnalytics(data)
      } else if (userRole === "admin") {
        const data = await analyticsService.getPlatformAnalytics(range)
        setPlatformAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = (range: string) => {
    const end = new Date()
    const start = new Date()

    switch (range) {
      case "7d":
        start.setDate(end.getDate() - 7)
        break
      case "30d":
        start.setDate(end.getDate() - 30)
        break
      case "90d":
        start.setDate(end.getDate() - 90)
        break
      default:
        start.setDate(end.getDate() - 7)
    }

    return { start, end }
  }

  const generateReport = async () => {
    try {
      const range = getDateRange(dateRange)
      let reportId: string

      if (userRole === "student" && userId) {
        reportId = await analyticsService.generateReport("student", userId, range)
      } else if (userRole === "teacher" && classId) {
        reportId = await analyticsService.generateReport("class", classId, range)
      } else if (userRole === "admin") {
        reportId = await analyticsService.generateReport("platform", "platform", range)
      } else {
        return
      }

      // Download the report
      window.open(`/api/analytics/reports/${reportId}/download`, "_blank")
    } catch (error) {
      console.error("Failed to generate report:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track progress and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {userRole === "student" && studentAnalytics && <StudentAnalyticsView analytics={studentAnalytics} />}

      {userRole === "teacher" && classAnalytics && <ClassAnalyticsView analytics={classAnalytics} />}

      {userRole === "admin" && platformAnalytics && <PlatformAnalyticsView analytics={platformAnalytics} />}
    </div>
  )
}

function StudentAnalyticsView({ analytics }: { analytics: StudentAnalytics }) {
  const engagementScore = analyticsService.calculateEngagementScore(analytics)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(analytics.totalTimeSpent / 3600)}h</div>
          <p className="text-xs text-muted-foreground">Learning time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.lessonsCompleted}</div>
          <p className="text-xs text-muted-foreground">Lessons finished</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.averageScore}%</div>
          <p className="text-xs text-muted-foreground">Quiz performance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.streakDays}</div>
          <p className="text-xs text-muted-foreground">Days in a row</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>Your progress across different subjects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(analytics.subjectProgress).map(([subject, progress]) => (
            <div key={subject} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{subject}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Engagement Score</CardTitle>
          <CardDescription>Overall learning engagement metric</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-emerald-600">{engagementScore}</div>
            <div className="flex-1">
              <Progress value={engagementScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {engagementScore >= 80
                  ? "Excellent engagement!"
                  : engagementScore >= 60
                    ? "Good engagement"
                    : "Room for improvement"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClassAnalyticsView({ analytics }: { analytics: ClassAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Recently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageProgress}%</div>
            <p className="text-xs text-muted-foreground">Class progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Assignment completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analytics.subjectPerformance).map(([subject, score]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{subject}</span>
                    <span>{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPerformers.slice(0, 5).map((student, index) => (
                    <div key={student.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <span className="font-medium">Student {student.userId.slice(0, 8)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {student.level} • {student.averageScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students Needing Support</CardTitle>
                <CardDescription>Students who may need additional help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.strugglingStudents.slice(0, 5).map((student) => (
                    <div key={student.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">Student {student.userId.slice(0, 8)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.averageScore}% avg • {student.lessonsCompleted} lessons
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PlatformAnalyticsView({ analytics }: { analytics: PlatformAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Recently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.averageSessionTime / 60)}m</div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">7-day retention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Subjects</CardTitle>
            <CardDescription>Most engaged subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.popularSubjects.map((item, index) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{item.subject}</span>
                  <span>{item.engagement}% engagement</span>
                </div>
                <Progress value={item.engagement} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>Platform access by device type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics.deviceTypes).map(([device, count]) => (
              <div key={device} className="flex justify-between items-center">
                <span className="capitalize">{device}</span>
                <Badge variant="secondary">{count} users</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
