"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Search,
  Bell,
  LayoutDashboard,
  Users,
  FileIcon as FileTemplate,
  BarChart3,
  CheckSquare,
  MessageSquare,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react"
import { Suspense } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { Toaster } from "sonner"
import { NotificationDropdown } from "@/components/notification-dropdown"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Templates", href: "/dashboard/templates", icon: FileTemplate },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Upgrade Plan", href: "/dashboard/upgrade", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const getUserInitials = () => {
    if (!user) return "U"
    
    const email = user.email || ""
    const name = user.user_metadata?.full_name || user.user_metadata?.name || ""
    
    if (name) {
      const nameParts = name.split(" ")
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      }
      return nameParts[0][0].toUpperCase()
    }
    
    return email[0]?.toUpperCase() || "U"
  }

  const getUserDisplayName = () => {
    if (!user) return "User"
    
    const name = user.user_metadata?.full_name || user.user_metadata?.name
    if (name) {
      // Capitalize first and last names
      return name.split(" ")
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ")
    }
    
    const email = user.email || ""
    const emailName = email.split("@")[0] || "User"
    // Capitalize email-based name
    return emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-lg">PlankPort</div>
              <div className="text-sm text-muted-foreground">Agency Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search clients, tasks, or templates..." className="pl-10" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <NotificationDropdown />
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{getUserDisplayName()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="ml-2"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </Suspense>
      </div>
      <Toaster />
    </ProtectedRoute>
  )
}
