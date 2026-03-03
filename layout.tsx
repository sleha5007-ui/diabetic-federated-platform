"use client"

import { AuthProvider } from "@/lib/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <MobileNav />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
