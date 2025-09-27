"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Clock, Star, Download } from "lucide-react"
import type { StudentAnalytics } from "@/types/teacher"

interface StudentAnalyticsProps {
  students: StudentAnalytics[]
  onGenerateReport: () => void
}

export function StudentAnalyticsView({ students, onGenerateReport }: StudentAnalyticsProps) {
  const totalStudents = students.length
  const averageScore = students.reduce((sum, student) => sum + student.averageScore, 0) / totalStudents
  const averageProgress = students.reduce((sum, student) => sum + student.completedLessons, 0) / totalStudents

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lessons</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={onGenerateReport} className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.studentId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {student.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.studentName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">Grade {student.grade}</Badge>
                        <Badge variant="secondary">Level {student.level}</Badge>
                        <span className="text-sm text-muted-foreground">{student.totalPoints} points</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">{student.averageScore}% avg</p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {student.lastActivity.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lessons Completed</span>
                      <span>{student.completedLessons}</span>
                    </div>
                    <Progress value={(student.completedLessons / 20) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Time spent: {Math.floor(student.timeSpent / 60)}h {student.timeSpent % 60}m
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <h5 className="text-sm font-medium mb-2">Subject Progress</h5>
                  <div className="grid gap-2 md:grid-cols-2">
                    {Object.entries(student.subjectProgress).map(([subject, progress]) => (
                      <div key={subject} className="text-sm">
                        <div className="flex justify-between">
                          <span>{subject}</span>
                          <span>{progress.averageScore}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {progress.completedLessons} lessons • {Math.floor(progress.timeSpent / 60)}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
