"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  password: string
  setPassword: (password: string) => void
}

export function SignUpForm({ onSubmit, isLoading, password, setPassword }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-white font-medium flex items-center gap-2 text-base font-sans">
          <User className="w-4 h-4 text-[#8e8e93]" />
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          required
          className="bg-[#2c2c2e] border border-[#3a3a3c] text-white placeholder:text-[#8e8e93] focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 transition-all duration-200 rounded-2xl h-14 text-base font-sans"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="signup-email" className="text-white font-medium flex items-center gap-2 text-base font-sans">
          <Mail className="w-4 h-4 text-[#8e8e93]" />
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          required
          className="bg-[#2c2c2e] border border-[#3a3a3c] text-white placeholder:text-[#8e8e93] focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 transition-all duration-200 rounded-2xl h-14 text-base font-sans"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="signup-password" className="text-white font-medium flex items-center gap-2 text-base font-sans">
          <Lock className="w-4 h-4 text-[#8e8e93]" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#2c2c2e] border border-[#3a3a3c] text-white placeholder:text-[#8e8e93] focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 transition-all duration-200 rounded-2xl h-14 pr-14 text-base font-sans"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-4 text-[#8e8e93] hover:text-white hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#007aff] hover:bg-[#0056cc] text-white font-medium transition-all duration-200 transform hover:scale-[1.01] shadow-lg rounded-2xl h-14 mt-8 text-base font-sans"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </div>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
