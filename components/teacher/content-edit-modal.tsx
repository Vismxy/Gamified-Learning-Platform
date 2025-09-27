"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, X } from "lucide-react"
import type { ContentItem } from "@/types/teacher"

interface ContentEditModalProps {
  content: ContentItem
  onSave: (content: ContentItem) => void
  onCancel: () => void
}

const subjects = ["Physics", "Mathematics", "Chemistry", "Biology"]
const difficulties = ["beginner", "intermediate", "advanced"]

export function ContentEditModal({ content, onSave, onCancel }: ContentEditModalProps) {
  const [formData, setFormData] = useState({
    title: content.title,
    subject: content.subject,
    description: content.description,
    difficulty: content.difficulty,
    estimatedTime: content.estimatedTime,
    points: content.points,
    isPublished: content.isPublished,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedContent: ContentItem = {
      ...content,
      ...formData,
      updatedAt: new Date(),
    }

    onSave(updatedContent)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="edit-difficulty">Difficulty</Label>
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
              <Label htmlFor="edit-time">Time (minutes)</Label>
              <Input
                id="edit-time"
                type="number"
                min="5"
                max="120"
                value={formData.estimatedTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimatedTime: Number.parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-points">Points</Label>
              <Input
                id="edit-points"
                type="number"
                min="10"
                max="200"
                value={formData.points}
                onChange={(e) => setFormData((prev) => ({ ...prev, points: Number.parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-publish"
              checked={formData.isPublished}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked }))}
            />
            <Label htmlFor="edit-publish">Published</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
