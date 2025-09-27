"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Download, Smartphone } from "lucide-react"
import { pwaUtils } from "@/lib/pwa-utils"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Check if app can be installed and is not already installed
    if (pwaUtils.canInstall() && !pwaUtils.isInstalled()) {
      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        ;(window as any).deferredPrompt = e
        setShowPrompt(true)
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const installed = await pwaUtils.installApp()
      if (installed) {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error("Installation failed:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    ;(window as any).deferredPrompt = null
  }

  if (!showPrompt) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-primary">Install STEM Gamify</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Install our app for better offline access and a native experience on your device.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleInstall} disabled={isInstalling}>
                {isInstalling ? (
                  <>
                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-2" />
                    Install App
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                Not Now
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
