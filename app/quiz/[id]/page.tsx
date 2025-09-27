"use client"

import { QuizComponent } from "@/components/quiz/quiz-component"
import { useNavigation } from "@/hooks/use-navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface QuizPageProps {
  params: {
    id: string
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  const { navigateBack } = useNavigation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={navigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-primary">Quiz</h1>
          </div>

          {/* Quiz Component */}
          <QuizComponent quizId={params.id} />
        </div>
      </div>
    </div>
  )
}
