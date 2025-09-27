"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { i18n, type Language } from "@/lib/i18n"

interface I18nContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize i18n service
    i18n.initialize()
    setLanguageState(i18n.getLanguage())
    setIsLoading(false)

    const handleLanguageChange = (newLanguage: Language) => {
      setLanguageState(newLanguage)
    }

    i18n.addListener(handleLanguageChange)
    return () => i18n.removeListener(handleLanguageChange)
  }, [])

  const setLanguage = (newLanguage: Language) => {
    i18n.setLanguage(newLanguage)
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    return i18n.t(key, params)
  }

  return <I18nContext.Provider value={{ language, setLanguage, t, isLoading }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
