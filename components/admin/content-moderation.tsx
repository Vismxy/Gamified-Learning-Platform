"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { AdminService } from "@/lib/admin"
import { Shield, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import type { ContentModeration } from "@/types/admin"

interface ContentModerationProps {
  pendingContent: ContentModeration[]
  onContentModerated: (content: ContentModeration) => void
}

export function ContentModerationPanel({ pendingContent, onContentModerated }: ContentModerationProps) {
  const [reviewingContent, setReviewingContent] = useState<ContentModeration | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const { toast } = useToast()
  const adminService = AdminService.getInstance()

  const handleModerateContent = async (contentId: string, status: "approved" | "rejected") => {
    try {
      const moderatedContent = await adminService.moderateContent(contentId, status, reviewNotes)
      onContentModerated(moderatedContent)
      setReviewingContent(null)
      setReviewNotes("")
      toast({
        title: `Content ${status}`,
        description: `The content has been ${status} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Moderation failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingItems = pendingContent.filter((item) => item.status === "pending")
  const reviewedItems = pendingContent.filter((item) => item.status !== "pending")

  return (
    <div className="space-y-6">
      {/* Pending Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Content Moderation
            {pendingItems.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingItems.length} pending
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content pending review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        by {item.author} • {item.subject} • {item.type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted {item.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setReviewingContent(item)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Review Content: {item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-2 text-sm">
                            <div>
                              <strong>Author:</strong> {item.author}
                            </div>
                            <div>
                              <strong>Subject:</strong> {item.subject}
                            </div>
                            <div>
                              <strong>Type:</strong> {item.type}
                            </div>
                            <div>
                              <strong>Submitted:</strong> {item.submittedAt.toLocaleDateString()}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Review Notes (Optional)</label>
                            <Textarea
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              placeholder="Add any notes about your review decision..."
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => handleModerateContent(item.contentId, "approved")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleModerateContent(item.contentId, "rejected")}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      onClick={() => {
                        setReviewingContent(item)
                        handleModerateContent(item.contentId, "approved")
                      }}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Quick Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Reviewed */}
      {reviewedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewedItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h5 className="font-medium text-sm">{item.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      by {item.author} • Reviewed {item.reviewedAt?.toLocaleDateString()}
                    </p>
                    {item.reviewNotes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{item.reviewNotes}"</p>
                    )}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
