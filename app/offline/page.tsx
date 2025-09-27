"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, Home, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
            <WifiOff className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            It looks like you're not connected to the internet. Don't worry - you can still access your downloaded
            content and continue learning!
          </p>

          <div className="space-y-2">
            <Button onClick={handleGoHome} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleRetry} className="w-full bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">While Offline You Can:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Access downloaded lessons</li>
              <li>• Continue your learning progress</li>
              <li>• Take offline quizzes</li>
              <li>• View your achievements</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
