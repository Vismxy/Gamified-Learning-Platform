"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentUpload } from "./content-upload"
import { ContentLibrary } from "./content-library"
import { StudentAnalyticsView } from "./student-analytics"
import { AssignmentCreator } from "./assignment-creator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherService } from "@/lib/teacher"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/types/user"
import type { ContentItem, Assignment } from "@/types/teacher"
import { BookOpen, Users, BarChart3, Calendar, Upload, Library, Gamepad2, Target, Zap, Trophy } from "lucide-react"
import { ContentEditModal } from "./content-edit-modal"
import { Button } from "@/components/ui/button"

interface TeacherDashboardProps {
  user: User
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const teacherService = TeacherService.getInstance()
  const [content, setContent] = useState(teacherService.getTeacherContent(user.id))
  const [assignments, setAssignments] = useState(teacherService.getAssignments(user.id))
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const students = teacherService.getStudentAnalytics(user.id)
  const classes = teacherService.getClasses(user.id)
  const { toast } = useToast()

  const handleContentUploaded = (newContent: ContentItem) => {
    setContent((prev) => [newContent, ...prev])
  }

  const handleEditContent = (contentItem: ContentItem) => {
    setEditingContent(contentItem)
    setShowEditModal(true)
  }

  const handleSaveEdit = (updatedContent: ContentItem) => {
    setContent((prev) => prev.map((item) => (item.id === updatedContent.id ? updatedContent : item)))
    setShowEditModal(false)
    setEditingContent(null)
    toast({
      title: "Content updated",
      description: "Your content has been successfully updated.",
    })
  }

  const handleDeleteContent = (contentId: string) => {
    setContent((prev) => prev.filter((item) => item.id !== contentId))
    toast({
      title: "Content deleted",
      description: "The content has been removed from your library.",
    })
  }

  const handleTogglePublish = (contentId: string, isPublished: boolean) => {
    setContent((prev) => prev.map((item) => (item.id === contentId ? { ...item, isPublished } : item)))
    toast({
      title: isPublished ? "Content published" : "Content unpublished",
      description: `The content is now ${isPublished ? "visible" : "hidden"} to students.`,
    })
  }

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev])
  }

  const handleGenerateReport = async () => {
    toast({
      title: "Generating report...",
      description: "Please wait while we compile the student data.",
    })

    setTimeout(() => {
      const reportData = {
        totalStudents: students.length,
        averageScore: students.reduce((sum, s) => sum + s.averageScore, 0) / students.length,
        totalLessons: students.reduce((sum, s) => sum + s.completedLessons, 0),
        reportDate: new Date().toLocaleDateString(),
      }

      console.log("Generated report:", reportData)

      toast({
        title: "Report generated successfully!",
        description: "Student progress report is ready for download.",
      })
    }, 2000)
  }

  const totalStudents = students.length
  const totalContent = content.length
  const publishedContent = content.filter((item) => item.isPublished).length
  const activeAssignments = assignments.filter((assignment) => assignment.isActive).length

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">Welcome, {user.name}! 👨‍🏫</h2>
              <p className="text-muted-foreground mt-1">
                Manage your classes and create engaging STEM content for your students.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subjects: {user.subjects?.join(", ")}</p>
              <p className="text-sm text-muted-foreground">{user.school}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{publishedContent}</div>
            <p className="text-xs text-muted-foreground">{totalContent} total items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">
              {students.length > 0
                ? (students.reduce((sum, s) => sum + s.averageScore, 0) / students.length).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">class average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentLibrary
            content={content}
            onEditContent={handleEditContent}
            onDeleteContent={handleDeleteContent}
            onTogglePublish={handleTogglePublish}
          />
        </TabsContent>

        <TabsContent value="upload">
          <ContentUpload onContentUploaded={handleContentUploaded} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentCreator content={content} classes={classes} onAssignmentCreated={handleAssignmentCreated} />
        </TabsContent>

        <TabsContent value="analytics">
          <StudentAnalyticsView students={students} onGenerateReport={handleGenerateReport} />
        </TabsContent>

        <TabsContent value="games">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Educational Games Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">Create and manage educational games for your students</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Quiz Games
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create interactive quiz games from your content
                    </p>
                    <Button className="w-full">Create Quiz Game</Button>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Memory Games
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">Build memory matching games for key concepts</p>
                    <Button className="w-full">Create Memory Game</Button>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Word Games
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">Generate crosswords and word puzzles</p>
                    <Button className="w-full">Create Word Game</Button>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Game Analytics
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">View student performance in games</p>
                    <Button className="w-full bg-transparent" variant="outline">
                      View Analytics
                    </Button>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Games</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <h5 className="font-medium">Physics Quiz Challenge</h5>
                          <p className="text-sm text-muted-foreground">45 students played • Avg score: 78%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Stats
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <h5 className="font-medium">Chemistry Memory Match</h5>
                          <p className="text-sm text-muted-foreground">32 students played • Avg score: 85%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Stats
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

      {/* Edit Content Modal */}
      {showEditModal && editingContent && (
        <ContentEditModal
          content={editingContent}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false)
            setEditingContent(null)
          }}
        />
      )}
    </div>
  )
}
