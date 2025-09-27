"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useNavigation() {
  const router = useRouter()

  const navigateToLesson = useCallback(
    (lessonId: string) => {
      router.push(`/lesson/${lessonId}`)
    },
    [router],
  )

  const navigateToQuiz = useCallback(
    (quizId: string) => {
      router.push(`/quiz/${quizId}`)
    },
    [router],
  )

  const navigateToSubject = useCallback(
    (subject: string) => {
      router.push(`/subject/${subject}`)
    },
    [router],
  )

  const navigateBack = useCallback(() => {
    router.back()
  }, [router])

  const navigateToDashboard = useCallback(() => {
    router.push("/")
  }, [router])

  return {
    navigateToLesson,
    navigateToQuiz,
    navigateToSubject,
    navigateBack,
    navigateToDashboard,
  }
}
