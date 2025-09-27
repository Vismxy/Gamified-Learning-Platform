"use client"

import { useEffect } from "react"
import { useTranslation } from "@/lib/i18n"

export function DynamicHtmlLang() {
  const { language } = useTranslation()

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  return null
}
