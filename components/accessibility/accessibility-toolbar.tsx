"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Accessibility,
  Type,
  Eye,
  Volume2,
  Keyboard,
  MousePointer,
  Contrast,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  textSize: number
}

export function AccessibilityToolbar() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    focusIndicators: true,
    textSize: 100,
  })

  useEffect(() => {
    // Load accessibility settings from localStorage
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings))
    applySettings(newSettings)
  }

  const applySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement

    // High contrast mode
    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Large text
    if (settings.largeText) {
      root.classList.add("large-text")
    } else {
      root.classList.remove("large-text")
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Screen reader optimizations
    if (settings.screenReader) {
      root.classList.add("screen-reader-mode")
    } else {
      root.classList.remove("screen-reader-mode")
    }

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add("keyboard-navigation")
    } else {
      root.classList.remove("keyboard-navigation")
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add("enhanced-focus")
    } else {
      root.classList.remove("enhanced-focus")
    }

    // Text size
    root.style.fontSize = `${settings.textSize}%`
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false,
      focusIndicators: true,
      textSize: 100,
    }
    setSettings(defaultSettings)
    localStorage.setItem("accessibility-settings", JSON.stringify(defaultSettings))
    applySettings(defaultSettings)
  }

  const increaseTextSize = () => {
    const newSize = Math.min(settings.textSize + 10, 150)
    updateSetting("textSize", newSize)
  }

  const decreaseTextSize = () => {
    const newSize = Math.max(settings.textSize - 10, 80)
    updateSetting("textSize", newSize)
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        {t("accessibility.skipToContent")}
      </a>

      {/* Accessibility toolbar toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-40 bg-white shadow-lg"
        aria-label={t("accessibility.toggleTheme")}
        aria-expanded={isOpen}
      >
        <Accessibility className="h-4 w-4" />
        <span className="sr-only">Accessibility Options</span>
      </Button>

      {/* Accessibility panel */}
      {isOpen && (
        <Card className="fixed top-16 right-4 z-40 w-80 max-h-96 overflow-y-auto shadow-xl">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Accessibility Options</h3>
              <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" aria-label={t("common.close")}>
                ×
              </Button>
            </div>

            <Separator />

            {/* Text size controls */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Size ({settings.textSize}%)</Label>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={decreaseTextSize}
                  variant="outline"
                  size="sm"
                  disabled={settings.textSize <= 80}
                  aria-label={t("accessibility.decreaseTextSize")}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  onClick={increaseTextSize}
                  variant="outline"
                  size="sm"
                  disabled={settings.textSize >= 150}
                  aria-label={t("accessibility.increaseTextSize")}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Accessibility toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Contrast className="h-4 w-4" />
                  <Label htmlFor="high-contrast" className="text-sm">
                    {t("accessibility.highContrast")}
                  </Label>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="large-text" className="text-sm">
                    Large Text
                  </Label>
                </div>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => updateSetting("largeText", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <Label htmlFor="reduced-motion" className="text-sm">
                    Reduce Motion
                  </Label>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Label htmlFor="screen-reader" className="text-sm">
                    {t("accessibility.screenReader")}
                  </Label>
                </div>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Keyboard className="h-4 w-4" />
                  <Label htmlFor="keyboard-nav" className="text-sm">
                    {t("accessibility.keyboardNavigation")}
                  </Label>
                </div>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MousePointer className="h-4 w-4" />
                  <Label htmlFor="focus-indicators" className="text-sm">
                    Enhanced Focus
                  </Label>
                </div>
                <Switch
                  id="focus-indicators"
                  checked={settings.focusIndicators}
                  onCheckedChange={(checked) => updateSetting("focusIndicators", checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Reset button */}
            <Button onClick={resetSettings} variant="outline" size="sm" className="w-full bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
