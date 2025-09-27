"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LanguageSelectorProps {
  variant?: "select" | "dropdown"
  showLabel?: boolean
}

export function LanguageSelector({ variant = "dropdown", showLabel = true }: LanguageSelectorProps) {
  const { language, setLanguage, availableLanguages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = availableLanguages.find((lang) => lang.code === language)

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  if (variant === "select") {
    return (
      <div className="flex items-center space-x-2">
        {showLabel && <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-40" aria-label="Select language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center space-x-2">
                  <span>{lang.nativeName}</span>
                  {lang.code === language && <Check className="h-3 w-3 text-emerald-600" aria-hidden="true" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
          aria-label={`Current language: ${currentLanguage?.nativeName}. Click to change language`}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          {showLabel && <span>{currentLanguage?.nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {lang.code === language && <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
