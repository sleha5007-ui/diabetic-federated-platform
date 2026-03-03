"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  name: string
  hospital: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const login = useCallback(
    (email: string, password: string) => {
      // Dummy authentication
      if (email === "admin@hospital.com" && password === "password") {
        setUser({
          name: "Dr. Sarah Mitchell",
          hospital: "Metro Diabetic Center",
          role: "Hospital Admin",
        })
        router.push("/dashboard")
        return true
      }
      return false
    },
    [router],
  )

  const logout = useCallback(() => {
    setUser(null)
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
