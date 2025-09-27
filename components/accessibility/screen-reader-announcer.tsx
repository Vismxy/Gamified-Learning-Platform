"use client"

import { useEffect, useRef } from "react"

interface ScreenReaderAnnouncerProps {
  message: string
  priority?: "polite" | "assertive"
  clearAfter?: number
}

export function ScreenReaderAnnouncer({ message, priority = "polite", clearAfter = 5000 }: ScreenReaderAnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && announcerRef.current) {
      announcerRef.current.textContent = message

      if (clearAfter > 0) {
        const timer = setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = ""
          }
        }, clearAfter)

        return () => clearTimeout(timer)
      }
    }
  }, [message, clearAfter])

  return <div ref={announcerRef} aria-live={priority} aria-atomic="true" className="sr-only" role="status" />
}

// Hook for announcing messages to screen readers
export function useScreenReaderAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null)

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (!announcerRef.current) {
      // Create announcer element if it doesn't exist
      const announcer = document.createElement("div")
      announcer.setAttribute("aria-live", priority)
      announcer.setAttribute("aria-atomic", "true")
      announcer.className = "sr-only"
      announcer.setAttribute("role", "status")
      document.body.appendChild(announcer)
      announcerRef.current = announcer
    }

    // Update the message
    announcerRef.current.textContent = message
    announcerRef.current.setAttribute("aria-live", priority)

    // Clear after 5 seconds
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = ""
      }
    }, 5000)
  }

  return { announce }
}
