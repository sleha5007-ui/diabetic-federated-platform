"use client"

import { AuthProvider } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
