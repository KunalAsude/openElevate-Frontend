"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Code, 
  GitPullRequest,
  Award,
  BarChart2,
  Bookmark,
  MessagesSquare,
  UserPlus,
  Compass,
  Trophy,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Use React.memo to prevent unnecessary re-renders
export const Sidebar = React.memo(function Sidebar({ 
  isCollapsed, 
  onToggleCollapse,
  className
}) {
  const pathname = usePathname()
  // Use internal state if no external control is provided
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  
  // Determine if we're using external or internal state
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed
  
  // Preserve collapsed state across page reloads (only if using internal state)
  useEffect(() => {
    // Only initialize from localStorage if we're using internal state
    if (isCollapsed === undefined) {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed')
      if (savedCollapsed !== null) {
        setInternalCollapsed(savedCollapsed === 'true')
      }
    }
  }, [])

  const toggleCollapse = () => {
    // If external control is provided, use that
    if (onToggleCollapse) {
      onToggleCollapse(!collapsed)
    } else {
      // Otherwise use internal state
      const newCollapsed = !internalCollapsed
      setInternalCollapsed(newCollapsed)
      localStorage.setItem('sidebarCollapsed', String(newCollapsed))
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          active: pathname === "/dashboard",
        },
        {
          href: "/dashboard/projects",
          label: "Projects",
          icon: Code,
          active: pathname === "/dashboard/projects" || pathname?.startsWith("/dashboard/projects/"),
        },
        {
          href: "/dashboard/contributions",
          label: "Contributions",
          icon: GitPullRequest,
          active: pathname === "/dashboard/contributions" || pathname?.startsWith("/dashboard/contributions/"),
        },
        {
          href: "/dashboard/badges",
          label: "Badges",
          icon: Award,
          active: pathname === "/dashboard/badges",
        },
        {
          href: "/dashboard/analytics",
          label: "Analytics",
          icon: BarChart2,
          active: pathname === "/dashboard/analytics",
        },
      ],
    },
    {
      title: "Mentorship",
      items: [
        {
          href: "/mentorship",
          label: "Overview",
          icon: Bookmark,
          active: pathname === "/mentorship",
        },
        {
          href: "/mentorship/sessions",
          label: "Sessions",
          icon: MessagesSquare,
          active: pathname === "/mentorship/sessions",
        },
        {
          href: "/mentorship/requests",
          label: "Requests",
          icon: UserPlus,
          active: pathname === "/mentorship/requests",
        },
      ],
    },
    {
      title: "Explore",
      items: [
        {
          href: "/explorer",
          label: "Projects Explorer",
          icon: Compass,
          active: pathname === "/explorer",
        },
        {
          href: "/leaderboard",
          label: "Leaderboard",
          icon: Trophy,
          active: pathname === "/leaderboard",
        },
        {
          href: "/resources",
          label: "Learning Resources",
          icon: BookOpen,
          active: pathname === "/resources",
        },
      ],
    },
  ]

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-3">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold">OpenElevate</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <Logo />
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("absolute -right-3 top-5 h-7 w-7 bg-background border border-border rounded-full shadow-sm hover:bg-accent", 
            collapsed ? "rotate-180 transform transition-transform duration-300" : "transition-transform duration-300"
          )}
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-6 py-4">
        {navItems.map((section, i) => (
          <div key={i} className={cn(collapsed ? "px-2" : "px-3")}>
            {!collapsed && (
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                {section.title}
              </h3>
            )}
            {collapsed && (
              <div className="h-[1px] bg-border mx-2 mb-4"></div>
            )}
            <div className="space-y-1">
              {section.items.map((item, j) => (
                <Link 
                  key={j}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md text-sm font-medium transition-colors",
                    item.active 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed 
                      ? "justify-center h-10 w-10 mx-auto p-0 tooltip-wrapper" 
                      : "w-full gap-3 px-2 py-2"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5", 
                    collapsed ? "mx-0" : "mr-1"
                  )} />
                  {collapsed && (
                    <span className="tooltip">{item.label}</span>
                  )}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 border-t border-border p-4",
        collapsed ? "flex justify-center" : ""
      )}>
        <div className={cn(
          "flex items-center",
          collapsed ? "flex-col gap-2" : "gap-3"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">User</span>
              <span className="text-xs text-muted-foreground">user@example.com</span>
            </div>
          )}
          {!collapsed && (
            <Link href="/settings" className="ml-auto">
              <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
})
