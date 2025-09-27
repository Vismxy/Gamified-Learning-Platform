"use client"

import { useState, useEffect } from "react"
import { i18n, type Language } from "@/lib/i18n"

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")

  useEffect(() => {
    // Initialize and get current language
    i18n.initialize()
    setCurrentLanguage(i18n.getLanguage())

    // Listen for language changes
    const handleLanguageChange = (language: Language) => {
      setCurrentLanguage(language)
    }

    i18n.addListener(handleLanguageChange)
    return () => i18n.removeListener(handleLanguageChange)
  }, [])

  return {
    currentLanguage,
    setLanguage: (language: Language) => i18n.setLanguage(language),
    t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
  }
}
