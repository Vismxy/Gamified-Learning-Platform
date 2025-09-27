"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { TeacherService } from "@/lib/teacher"
import { Upload, FileText, Video, HelpCircle, Zap, BookOpen, Loader2 } from "lucide-react"
import type { ContentItem } from "@/types/teacher"

interface ContentUploadProps {
  onContentUploaded: (content: ContentItem) => void
}

const contentTypes = [
  { value: "lesson", label: "Lesson", icon: BookOpen },
  { value: "quiz", label: "Quiz", icon: HelpCircle },
  { value: "video", label: "Video", icon: Video },
  { value: "document", label: "Document", icon: FileText },
  { value: "simulation", label: "Simulation", icon: Zap },
]

const subjects = ["Physics", "Mathematics", "Chemistry", "Biology"]
const difficulties = ["beginner", "intermediate", "advanced"]

export function ContentUpload({ onContentUploaded }: ContentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "lesson" as ContentItem["type"],
    description: "",
    difficulty: "beginner" as ContentItem["difficulty"],
    estimatedTime: 15,
    points: 50,
    isPublished: false,
  })
  const { toast } = useToast()
  const teacherService = TeacherService.getInstance()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.subject || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const content = await teacherService.uploadContent(formData)
      toast({
        title: "Content uploaded!",
        description: `${formData.title} has been uploaded successfully.`,
      })
      onContentUploaded(content)

      // Reset form
      setFormData({
        title: "",
        subject: "",
        type: "lesson",
        description: "",
        difficulty: "beginner",
        estimatedTime: 15,
        points: 50,
        isPublished: false,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ContentItem["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: ContentItem["difficulty"]) =>
                  setFormData((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      <span className="capitalize">{difficulty}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Time (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="5"
                max="120"
                value={formData.estimatedTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimatedTime: Number.parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the content and learning objectives"
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="points">Points Reward</Label>
              <Input
                id="points"
                type="number"
                min="10"
                max="200"
                value={formData.points}
                onChange={(e) => setFormData((prev) => ({ ...prev, points: Number.parseInt(e.target.value) }))}
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="publish"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked }))}
              />
              <Label htmlFor="publish">Publish immediately</Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
