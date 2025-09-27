"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, HardDrive, Activity, Star } from "lucide-react"
import type { SystemStats, PlatformAnalytics } from "@/types/admin"

interface SystemAnalyticsProps {
  stats: SystemStats
  analytics: PlatformAnalytics
}

export function SystemAnalytics({ stats, analytics }: SystemAnalyticsProps) {
  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active ({((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingContent} pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storageUsed.toFixed(1)} GB</div>
            <Progress value={storagePercentage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">{stats.storageLimit} GB total</p>
          </CardContent>
        </Card>
      </div>

      {/* User Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Students</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{stats.totalStudents}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({((stats.totalStudents / stats.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Teachers</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{stats.totalTeachers}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({((stats.totalTeachers / stats.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Admins</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{stats.totalUsers - stats.totalStudents - stats.totalTeachers}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (
                    {(
                      ((stats.totalUsers - stats.totalStudents - stats.totalTeachers) / stats.totalUsers) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.contentEngagement.map((subject) => {
                const completionRate = (subject.completions / subject.views) * 100
                return (
                  <div key={subject.subject}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-xs text-muted-foreground">{completionRate.toFixed(1)}% completion</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{subject.views} views</span>
                      <span>{subject.completions} completions</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topPerformingContent.map((content, index) => (
              <div key={content.title} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <h5 className="font-medium text-sm">{content.title}</h5>
                    <p className="text-xs text-muted-foreground">{content.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{content.rating}</span>
                  </div>
                  <div className="text-muted-foreground">{content.completions} completions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Active Users Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Active Users (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.dailyActiveUsers.map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(day.count / 250) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{day.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
