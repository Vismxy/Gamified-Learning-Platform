"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { BookOpen, Video, HelpCircle, FileText, Zap, Download, Star, Edit, Trash2 } from "lucide-react"
import type { ContentItem } from "@/types/teacher"

interface ContentLibraryProps {
  content: ContentItem[]
  onEditContent: (content: ContentItem) => void
  onDeleteContent: (contentId: string) => void
  onTogglePublish: (contentId: string, isPublished: boolean) => void
}

const typeIcons = {
  lesson: BookOpen,
  video: Video,
  quiz: HelpCircle,
  document: FileText,
  simulation: Zap,
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
}

export function ContentLibrary({ content, onEditContent, onDeleteContent, onTogglePublish }: ContentLibraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {content.map((item) => {
            const TypeIcon = typeIcons[item.type]

            return (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TypeIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{item.subject}</Badge>
                        <Badge className={difficultyColors[item.difficulty]}>{item.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.estimatedTime} min • {item.points} points
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isPublished}
                      onCheckedChange={(checked) => onTogglePublish(item.id, checked)}
                    />
                    <span className="text-xs text-muted-foreground">{item.isPublished ? "Published" : "Draft"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {item.downloadCount} downloads
                    </div>
                    {item.averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {item.averageRating.toFixed(1)}
                      </div>
                    )}
                    <span>Updated {item.updatedAt.toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditContent(item)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteContent(item.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
