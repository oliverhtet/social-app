"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { useProfile, useLogin, useRegister, useLogout } from "@/hooks/useAuth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { email: string; password: string; name: string; username: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const isTokenPresent = !!token

  const [user, setUser] = useState<User | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()

  const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } = useProfile(isTokenPresent)

  // Update user state when profile is fetched
  useEffect(() => {
    if (!isProfileLoading && profile) {
      setUser(profile)
      setIsInitialLoading(false)
    } else if (!isProfileLoading && !profile) {
      setUser(null)
      setIsInitialLoading(false)
    }
  }, [profile, isProfileLoading])

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password })
      await refetchProfile()
      return { success: true }
    } catch (error) {
      localStorage.removeItem("token")
      setUser(null)
      return { success: false, error: "Invalid email or password" }
    }
  }

  const register = async (data: { email: string; password: string; name: string; username: string }) => {
    try {
      await registerMutation.mutateAsync(data)
      await refetchProfile()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed. Email might already be in use." }
    }
  }

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("token")
        setUser(null)
        refetchProfile()
      },
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isInitialLoading || isProfileLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to consume AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
