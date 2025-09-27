export type UserRole = "student" | "teacher" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  grade?: number // For students
  subjects?: string[] // For teachers
  school?: string
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
