"use client"

import { useI18n } from "./i18n-provider"
import type React from "react"

interface TranslationWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function TranslationWrapper({ children, fallback }: TranslationWrapperProps) {
  const { isLoading } = useI18n()

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )
    )
  }

  return <>{children}</>
}

// Higher-order component for wrapping components with translation support
export function withTranslation<P extends object>(Component: React.ComponentType<P>) {
  return function TranslatedComponent(props: P) {
    return (
      <TranslationWrapper>
        <Component {...props} />
      </TranslationWrapper>
    )
  }
}

// Component for rendering translated text with fallback
interface TranslatedTextProps {
  translationKey: string
  params?: Record<string, string | number>
  fallback?: string
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function TranslatedText({
  translationKey,
  params,
  fallback,
  className,
  as: Component = "span",
}: TranslatedTextProps) {
  const { t } = useI18n()

  const translatedText = t(translationKey, params)
  const displayText = translatedText === translationKey ? fallback || translationKey : translatedText

  return <Component className={className}>{displayText}</Component>
}
