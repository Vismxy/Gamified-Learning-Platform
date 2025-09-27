"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { TeacherService } from "@/lib/teacher"
import { Users, BookOpen, Loader2 } from "lucide-react"
import type { ContentItem, Assignment, ClassData } from "@/types/teacher"

interface AssignmentCreatorProps {
  content: ContentItem[]
  classes: ClassData[]
  onAssignmentCreated: (assignment: Assignment) => void
}

export function AssignmentCreator({ content, classes, onAssignmentCreated }: AssignmentCreatorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentIds: [] as string[],
    assignedTo: [] as string[],
    dueDate: "",
    isActive: true,
  })
  const { toast } = useToast()
  const teacherService = TeacherService.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.description ||
      formData.contentIds.length === 0 ||
      formData.assignedTo.length === 0
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and select content and classes.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const assignment = await teacherService.createAssignment({
        ...formData,
        dueDate: new Date(formData.dueDate),
      })

      toast({
        title: "Assignment created!",
        description: `${formData.title} has been assigned successfully.`,
      })

      onAssignmentCreated(assignment)

      // Reset form
      setFormData({
        title: "",
        description: "",
        contentIds: [],
        assignedTo: [],
        dueDate: "",
        isActive: true,
      })
    } catch (error) {
      toast({
        title: "Assignment creation failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleContentSelect = (contentId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      contentIds: checked ? [...prev.contentIds, contentId] : prev.contentIds.filter((id) => id !== contentId),
    }))
  }

  const handleClassSelect = (classId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: checked ? [...prev.assignedTo, classId] : prev.assignedTo.filter((id) => id !== classId),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Create Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the assignment and expectations"
              rows={3}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Select Content *</Label>
            <div className="grid gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {content
                .filter((item) => item.isPublished)
                .map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`content-${item.id}`}
                      checked={formData.contentIds.includes(item.id)}
                      onCheckedChange={(checked) => handleContentSelect(item.id, checked as boolean)}
                    />
                    <Label htmlFor={`content-${item.id}`} className="text-sm flex-1 cursor-pointer">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-muted-foreground ml-2">
                        ({item.subject} • {item.type})
                      </span>
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Assign to Classes *</Label>
            <div className="grid gap-2">
              {classes.map((classData) => (
                <div key={classData.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${classData.id}`}
                    checked={formData.assignedTo.includes(classData.id)}
                    onCheckedChange={(checked) => handleClassSelect(classData.id, checked as boolean)}
                  />
                  <Label htmlFor={`class-${classData.id}`} className="text-sm flex-1 cursor-pointer">
                    <span className="font-medium">{classData.name}</span>
                    <span className="text-muted-foreground ml-2">({classData.studentCount} students)</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Assignment...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Create Assignment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
