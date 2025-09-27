"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Github, Mail } from "lucide-react"

interface SocialLoginProps {
  onSocialLogin: (provider: string) => void
  type: "signin" | "signup"
}

export function SocialLogin({ onSocialLogin, type }: SocialLoginProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Separator className="bg-[#3a3a3c]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-[#1c1c1e] px-4 text-sm text-[#8e8e93] font-medium tracking-wide font-sans">
            {type === "signin" ? "OR CONTINUE WITH" : "OR SIGN UP WITH"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="bg-[#2c2c2e] border border-[#3a3a3c] text-white hover:bg-[#3a3a3c] hover:text-white hover:border-[#48484a] transition-all duration-200 rounded-2xl h-14 font-medium font-sans"
          onClick={() => onSocialLogin("Google")}
        >
          <Mail className="w-5 h-5 mr-2" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-[#2c2c2e] border border-[#3a3a3c] text-white hover:bg-[#3a3a3c] hover:text-white hover:border-[#48484a] transition-all duration-200 rounded-2xl h-14 font-medium font-sans"
          onClick={() => onSocialLogin("GitHub")}
        >
          <Github className="w-5 h-5 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  )
}
