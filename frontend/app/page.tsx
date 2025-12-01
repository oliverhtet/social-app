"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { MessageCircle } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex min-h-screen">
     

      {/* Right side - Auth Forms */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Social</span>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 text-center">
            {isLogin ? (
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <button onClick={() => setIsLogin(false)} className="font-medium text-primary hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="font-medium text-primary hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
