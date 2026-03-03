"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Activity as ActivityIcon, LayoutDashboard, Brain, LogOut, Shield, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Federated Training", href: "/training", icon: Brain },
  { label: "Predict", href: "/predict", icon: Stethoscope },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <ActivityIcon className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">FedDiab</span>
      </div>

      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ActivityIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-base">FedDiab</SheetTitle>
                <SheetDescription className="text-xs">
                  FL Platform
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex flex-1 flex-col px-3 py-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6">
              <div className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-2.5">
                <Shield className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Differential Privacy
                  </p>
                  <p className="text-xs text-accent">Enabled</p>
                </div>
              </div>
            </div>
          </nav>

          <div className="mt-auto border-t border-border px-4 py-4">
            {user && (
              <div className="mb-3 px-2">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.hospital}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
