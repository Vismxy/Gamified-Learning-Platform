"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { AdminService } from "@/lib/admin"
import { Users, UserPlus, Edit, Trash2, Search, Filter } from "lucide-react"
import type { SystemUser } from "@/types/admin"

interface UserManagementProps {
  users: SystemUser[]
  onUserUpdated: (user: SystemUser) => void
  onUserDeleted: (userId: string) => void
  onUserCreated: (user: SystemUser) => void
}

export function UserManagement({ users, onUserUpdated, onUserDeleted, onUserCreated }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as SystemUser["role"],
    grade: 6,
    subjects: [] as string[],
    school: "Rural High School",
    isActive: true,
  })
  const { toast } = useToast()
  const adminService = AdminService.getInstance()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleCreateUser = async () => {
    try {
      const createdUser = await adminService.createUser(newUser)
      onUserCreated(createdUser)
      setIsCreateDialogOpen(false)
      setNewUser({
        name: "",
        email: "",
        role: "student",
        grade: 6,
        subjects: [],
        school: "Rural High School",
        isActive: true,
      })
      toast({
        title: "User created",
        description: `${newUser.name} has been added to the system.`,
      })
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleToggleUserStatus = async (user: SystemUser) => {
    try {
      const updatedUser = await adminService.updateUser(user.id, { isActive: !user.isActive })
      onUserUpdated(updatedUser)
      toast({
        title: user.isActive ? "User deactivated" : "User activated",
        description: `${user.name} has been ${user.isActive ? "deactivated" : "activated"}.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (user: SystemUser) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await adminService.deleteUser(user.id)
        onUserDeleted(user.id)
        toast({
          title: "User deleted",
          description: `${user.name} has been removed from the system.`,
        })
      } catch (error) {
        toast({
          title: "Deletion failed",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "teacher":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: SystemUser["role"]) => setNewUser((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newUser.role === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select
                          value={newUser.grade.toString()}
                          onValueChange={(value) => setNewUser((prev) => ({ ...prev, grade: Number.parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                              <SelectItem key={grade} value={grade.toString()}>
                                Grade {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newUser.isActive}
                      onCheckedChange={(checked) => setNewUser((prev) => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="active">Active user</Label>
                  </div>
                  <Button onClick={handleCreateUser} className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className={`p-4 flex items-center justify-between ${
                  index !== filteredUsers.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                      {!user.isActive && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{user.school}</span>
                      {user.grade && <span>Grade {user.grade}</span>}
                      {user.subjects && <span>{user.subjects.join(", ")}</span>}
                      {user.lastLogin && <span>Last login: {user.lastLogin.toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user.role === "student" && user.totalPoints && (
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium">{user.totalPoints} pts</p>
                      <p className="text-xs text-muted-foreground">Level {user.level}</p>
                    </div>
                  )}
                  <Switch checked={user.isActive} onCheckedChange={() => handleToggleUserStatus(user)} />
                  <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
