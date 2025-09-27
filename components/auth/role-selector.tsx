"use client"

import type { UserRole } from "@/types/user"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, Shield } from "lucide-react"

interface RoleSelectorProps {
  selectedRole: UserRole
  onRoleSelect: (role: UserRole) => void
}

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: "student" as UserRole,
      title: "Student",
      description: "Access learning modules, games, and track progress",
      icon: GraduationCap,
      color: "bg-primary",
    },
    {
      id: "teacher" as UserRole,
      title: "Teacher",
      description: "Upload content, assign tasks, and monitor analytics",
      icon: Users,
      color: "bg-secondary",
    },
    {
      id: "admin" as UserRole,
      title: "Admin",
      description: "Manage users, content approval, and system settings",
      icon: Shield,
      color: "bg-accent",
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground text-center">Select your role</h3>
      <div className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === role.id ? "ring-2 ring-primary border-primary" : ""
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${role.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{role.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{role.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
