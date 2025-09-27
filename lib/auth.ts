"use client"

import type { User, UserRole } from "@/types/user"

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signIn(email: string, password: string, role: UserRole): Promise<User> {
    // Simple validation for demo purposes
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // Mock authentication - in a real app, this would validate against a backend
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0],
      role,
      grade: role === "student" ? 9 : undefined,
      subjects: role === "teacher" ? ["Mathematics", "Science"] : undefined,
      school: "Rural High School",
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    this.currentUser = user

    // Store in localStorage for persistence
    localStorage.setItem("currentUser", JSON.stringify(user))

    return user
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    grade?: number,
  ): Promise<User> {
    // Simple validation
    if (!email || !password || !firstName || !lastName) {
      throw new Error("All fields are required")
    }

    // Mock user creation
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: `${firstName} ${lastName}`,
      role,
      grade: role === "student" ? grade : undefined,
      subjects: role === "teacher" ? ["Mathematics", "Science"] : undefined,
      school: "Rural High School",
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    this.currentUser = user

    // Store in localStorage for persistence
    localStorage.setItem("currentUser", JSON.stringify(user))

    return user
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    // Try to restore from localStorage
    try {
      const stored = localStorage.getItem("currentUser")
      if (stored) {
        const user = JSON.parse(stored)
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt)
        user.lastLogin = new Date(user.lastLogin)
        this.currentUser = user
        return user
      }
    } catch (error) {
      console.error("Error restoring user from localStorage:", error)
      localStorage.removeItem("currentUser")
    }

    return null
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error("No user logged in")
    }

    const updatedUser = {
      ...this.currentUser,
      ...updates,
      id: this.currentUser.id, // Preserve original ID
      createdAt: this.currentUser.createdAt, // Preserve creation date
      lastLogin: new Date(), // Update last login
    }

    this.currentUser = updatedUser
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    return updatedUser
  }
}
