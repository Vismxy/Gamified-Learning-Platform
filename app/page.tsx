"use client"

import { useState, useEffect } from "react"
import { MultiRoleAuth } from "@/components/auth/multi-role-auth"
import { StudentDashboard } from "@/components/student/student-dashboard"
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { NetworkStatus } from "@/components/offline/network-status"
import { InstallPrompt } from "@/components/offline/install-prompt"
import { PWAProvider } from "@/components/pwa-provider"
import { Toaster } from "@/components/ui/toaster"
import { LanguageSelector } from "@/components/i18n/language-selector"
import { useI18n } from "@/components/i18n/i18n-provider"
import { AuthService } from "@/lib/auth"
import type { User } from "@/types/user"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authService = AuthService.getInstance()
  const { t, isLoading: i18nLoading } = useI18n()

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser)
  }

  const handleSignOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  if (isLoading || i18nLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <PWAProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-primary">STEM Gamify</h1>
                    <p className="text-muted-foreground mt-1">
                      {t("common.welcome")} {user.name}!
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <NetworkStatus />
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                      aria-label={t("common.logout")}
                    >
                      {t("common.logout")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Install Prompt */}
              <div className="mb-6">
                <InstallPrompt />
              </div>

              {/* Role-specific Dashboard */}
              {user.role === "student" && <StudentDashboard user={user} />}
              {user.role === "teacher" && <TeacherDashboard user={user} />}
              {user.role === "admin" && <AdminDashboard user={user} />}
            </div>
          </div>
          <Toaster />
        </div>
      </PWAProvider>
    )
  }

  return (
    <PWAProvider>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(5, 150, 105, 0.1) 100%)",
        }}
      >
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <MultiRoleAuth onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </div>
    </PWAProvider>
  )
}
