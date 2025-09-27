"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagement } from "./user-management"
import { ContentModerationPanel } from "./content-moderation"
import { SystemAnalytics } from "./system-analytics"
import { SystemSettingsPanel } from "./system-settings"
import { AdminService } from "@/lib/admin"
import type { User } from "@/types/user"
import type { SystemUser, SystemSettings } from "@/types/admin"
import { Users, Shield, BarChart3, Settings, AlertCircle, Gamepad2, Trophy, Target, Zap } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface AdminDashboardProps {
  user: User
}
interface ContentModeration {
  id: string
  contentId: string      // add this
  title: string          // add this
  author: string         // add this
  subject: string        // add this
  type: string           // add this
  submittedAt: Date      // add this
  reviewedAt?: Date
  status: "pending" | "approved" | "rejected" // include "pending"
  reviewNotes?: string
}



export function AdminDashboard({ user }: AdminDashboardProps) {
  const adminService = AdminService.getInstance()
  const [systemUsers, setSystemUsers] = useState(adminService.getSystemUsers())
  const [pendingContent, setPendingContent] = useState(adminService.getPendingContent())
  const [systemSettings, setSystemSettings] = useState(adminService.getSystemSettings())
  const stats = adminService.getSystemStats()
  const analytics = adminService.getPlatformAnalytics()

  const handleUserUpdated = async (updatedUser: SystemUser) => {
    try {
      const result = await adminService.updateUser(updatedUser.id, updatedUser)
      setSystemUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? result : u)))
      toast({
        title: "User updated",
        description: `${updatedUser.name} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUserDeleted = async (userId: string) => {
    const user = systemUsers.find((u) => u.id === userId)
    if (!user) return

    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(userId)
        setSystemUsers((prev) => prev.filter((u) => u.id !== userId))
        toast({
          title: "User deleted",
          description: `${user.name} has been removed from the system.`,
        })
      } catch (error) {
        toast({
          title: "Deletion failed",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUserCreated = async (newUser: SystemUser) => {
    try {
      const result = await adminService.createUser(newUser)
      setSystemUsers((prev) => [result, ...prev])
      toast({
        title: "User created",
        description: `${newUser.name} has been added to the system.`,
      })
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

const handleContentModerated = async (content: ContentModeration) => {
  const { contentId, status, reviewNotes } = content   // use contentId instead of id

  if (status === "pending") return

  try {
    const result = await adminService.moderateContent(contentId, status, reviewNotes)
    setPendingContent((prev) => prev.map((c) => (c.contentId === contentId ? result : c)))
    toast({
      title: `Content ${status}`,
      description: `The content has been ${status} successfully.`,
    })
  } catch (error) {
    toast({
      title: "Moderation failed",
      description: "Failed to moderate content. Please try again.",
      variant: "destructive",
    })
  }
}




  const handleSettingsUpdated = async (updatedSettings: SystemSettings) => {
    try {
      const result = await adminService.updateSystemSettings(updatedSettings)
      setSystemSettings(result)
      toast({
        title: "Settings updated",
        description: "System settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const pendingModerationCount = pendingContent.filter((item) => item.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">Admin Dashboard 🛡️</h2>
              <p className="text-muted-foreground mt-1">
                Manage users, moderate content, and configure system settings.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
              <p className="text-sm text-muted-foreground">{user.school}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      {(systemSettings.maintenanceMode || pendingModerationCount > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">System Alerts</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-orange-700">
              {systemSettings.maintenanceMode && <p>• Maintenance mode is currently enabled</p>}
              {pendingModerationCount > 0 && <p>• {pendingModerationCount} content items pending moderation</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Admin Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2 relative">
            <Shield className="h-4 w-4" />
            Moderation
            {pendingModerationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingModerationCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <SystemAnalytics stats={stats} analytics={analytics} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement
            users={systemUsers}
            onUserUpdated={handleUserUpdated}
            onUserDeleted={handleUserDeleted}
            onUserCreated={handleUserCreated}
          />
        </TabsContent>

        <TabsContent value="moderation">
          <ContentModerationPanel pendingContent={pendingContent} onContentModerated={handleContentModerated} />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettingsPanel settings={systemSettings} onSettingsUpdated={handleSettingsUpdated} />
        </TabsContent>

        <TabsContent value="games">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Platform Games Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">Manage all educational games across the platform</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Game Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Total Games</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">247</div>
                    <p className="text-xs text-muted-foreground">+12 this week</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Active Players</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">1,847</div>
                    <p className="text-xs text-muted-foreground">+156 today</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Avg Score</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">82%</div>
                    <p className="text-xs text-muted-foreground">+3% this month</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Sessions</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">5,234</div>
                    <p className="text-xs text-muted-foreground">+423 today</p>
                  </Card>
                </div>

                {/* Game Categories Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Game Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <h5 className="font-medium">Quiz Games</h5>
                            <p className="text-sm text-muted-foreground">89 games • 1,245 players</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <h5 className="font-medium">Memory Games</h5>
                            <p className="text-sm text-muted-foreground">67 games • 892 players</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <h5 className="font-medium">Word Puzzles</h5>
                            <p className="text-sm text-muted-foreground">45 games • 634 players</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <h5 className="font-medium">Math Challenges</h5>
                            <p className="text-sm text-muted-foreground">78 games • 1,156 players</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <h5 className="font-medium">Science Simulations</h5>
                            <p className="text-sm text-muted-foreground">34 games • 567 players</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <h5 className="font-medium">Logic Puzzles</h5>
                            <p className="text-sm text-muted-foreground">56 games • 723 players</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Game Moderation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Game Moderation Queue</CardTitle>
                    <p className="text-sm text-muted-foreground">Review and approve user-generated games</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div>
                          <h5 className="font-medium">Chemistry Lab Quiz</h5>
                          <p className="text-sm text-muted-foreground">Created by Ms. Sarah Johnson • Pending review</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div>
                          <h5 className="font-medium">Physics Word Search</h5>
                          <p className="text-sm text-muted-foreground">Created by Mr. David Chen • Pending review</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Game Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Game Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Allow user-generated games</span>
                          <Button size="sm" variant="outline">
                            Enabled
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Game difficulty scaling</span>
                          <Button size="sm" variant="outline">
                            Auto
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Leaderboard integration</span>
                          <Button size="sm" variant="outline">
                            Enabled
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Daily game challenges</span>
                          <Button size="sm" variant="outline">
                            Enabled
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Game analytics tracking</span>
                          <Button size="sm" variant="outline">
                            Full
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Multiplayer games</span>
                          <Button size="sm" variant="outline">
                            Beta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
