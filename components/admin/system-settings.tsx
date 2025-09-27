"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AdminService } from "@/lib/admin"
import { Settings, Save, AlertTriangle } from "lucide-react"
import type { SystemSettings } from "@/types/admin"

interface SystemSettingsProps {
  settings: SystemSettings
  onSettingsUpdated: (settings: SystemSettings) => void
}

export function SystemSettingsPanel({ settings, onSettingsUpdated }: SystemSettingsProps) {
  const [formData, setFormData] = useState(settings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const adminService = AdminService.getInstance()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedSettings = await adminService.updateSystemSettings(formData)
      onSettingsUpdated(updatedSettings)
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Platform Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Platform Configuration</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={formData.platformName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, platformName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select
                  value={formData.defaultLanguage}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* User Registration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">User Registration</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowRegistration"
                  checked={formData.allowRegistration}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowRegistration: checked }))}
                />
                <Label htmlFor="allowRegistration">Allow new user registration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireEmailVerification"
                  checked={formData.requireEmailVerification}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requireEmailVerification: checked }))}
                />
                <Label htmlFor="requireEmailVerification">Require email verification</Label>
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Content Management</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min="1"
                  max="500"
                  value={formData.maxFileSize}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxFileSize: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="enableOfflineMode"
                  checked={formData.enableOfflineMode}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableOfflineMode: checked }))}
                />
                <Label htmlFor="enableOfflineMode">Enable offline mode</Label>
              </div>
            </div>
          </div>

          {/* System Maintenance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">System Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, maintenanceMode: checked }))}
                />
                <Label htmlFor="maintenanceMode" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Maintenance mode
                </Label>
              </div>
              {formData.maintenanceMode && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Warning: Enabling maintenance mode will prevent users from accessing the platform.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Announcements</h3>
            <div className="space-y-2">
              <Label htmlFor="announcementMessage">Platform Announcement</Label>
              <Textarea
                id="announcementMessage"
                value={formData.announcementMessage || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, announcementMessage: e.target.value }))}
                placeholder="Enter announcement message (optional)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This message will be displayed to all users on the platform.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
