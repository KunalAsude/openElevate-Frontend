"use client"

import React, { useState, useEffect } from "react"
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
  ChevronRight,
  PanelLeft,
  PanelRightClose,
} from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"


export const Sidebar = React.memo(function Sidebar({ isCollapsed, onToggleCollapse, className }) {
  const pathname = usePathname()

  const [internalCollapsed, setInternalCollapsed] = useState(false)

  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed

  useEffect(() => {
    if (isCollapsed === undefined) {
      const savedCollapsed = localStorage.getItem("sidebarCollapsed")
      if (savedCollapsed !== null) {
        setInternalCollapsed(savedCollapsed === "true")
      }
    }
  }, [isCollapsed])

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      // Use the external handler which will handle the state
      onToggleCollapse(!collapsed)
    } else {
      // Handle internal state
      const newCollapsed = !internalCollapsed
      setInternalCollapsed(newCollapsed)
      localStorage.setItem("sidebarCollapsed", String(newCollapsed))
      
      // Force immediate redraw
      document.body.classList.toggle('sidebar-collapsed', newCollapsed)
      
      // Force browser to recalculate layout immediately
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'))
      })
      
      // Add a timeout to reload the main content after 1 second
      setTimeout(() => {
        // Force a layout recalculation
        const mainContent = document.querySelector('main')
        if (mainContent) {
          // Temporarily adjust the display to force a reflow
          const originalDisplay = mainContent.style.display
          mainContent.style.display = 'none'
          
          // Force a reflow by accessing offsetHeight
          void mainContent.offsetHeight
          
          // Restore the original display
          mainContent.style.display = originalDisplay
        }
        
        // Dispatch a custom event that can be listened to by other components
        window.dispatchEvent(new CustomEvent('sidebarToggled', { detail: { collapsed: newCollapsed } }))
        
        // Force another resize event for good measure
        window.dispatchEvent(new Event('resize'))
      }, 1000)
    }
  }

  const navItems = [
    {
      title: "",
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
      title: "",
      divider: true,
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
      title: "",
      divider: true,
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
        "fixed left-0 top-12 z-40 h-[calc(100vh-48px)] bg-background transition-all duration-300 flex flex-col",
        collapsed ? "w-[70px]" : "w-[250px]",
        className,
      )}
    >
      <div className="flex h-16 items-center px-3 relative">
        {/* Collapse button in the left corner */}
        <div 
          onClick={toggleCollapse}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          role="button"
          tabIndex={0}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelRightClose variant="ghost" className="h-10 w-10 mt-5 text-gray-400" />
          ) : (
            <PanelLeft variant="ghost" className="h-10 w-10 mt-5 text-gray-400" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <div className="flex flex-col gap-4">
          {navItems.map((section, i) => (
            <div key={i} className={cn(collapsed ? "px-2" : "px-3")}>
              {!collapsed && section.title && (
                <h3 className="mb-1 px-2 text-base font-medium text-muted-foreground">{section.title}</h3>
              )}
              {!collapsed && section.divider && (
                <div className="h-[1px] bg-border mx-2 my-2"></div>
              )}
              {collapsed && <div className="h-[1px] bg-border mx-1 mb-3"></div>}
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <Link
                    key={j}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md transition-colors",
                      pathname === item.href && "bg-primary text-primary-foreground font-medium",
                      item.active
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed ? "justify-center h-12 w-full p-2 tooltip-wrapper" : "w-full gap-4 px-4 py-3",
                    )}
                  >
                    <item.icon className={cn(collapsed ? "h-6 w-6" : "h-6 w-6", collapsed ? "mx-0" : "mr-2")} />
                    {collapsed && <span className="tooltip">{item.label}</span>}
                    {!collapsed && <span className="text-base">{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border p-3 mt-auto",
          collapsed ? "flex justify-center" : "",
        )}
      >
      </div>

      {/* Tooltip styles */}
      <style jsx global>{`
        .tooltip-wrapper {
          position: relative;
        }
        .tooltip-wrapper .tooltip {
          visibility: hidden;
          position: absolute;
          left: 100%;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          text-align: center;
          border-radius: 6px;
          padding: 5px 10px;
          margin-left: 10px;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid hsl(var(--border));
          font-size: 12px;
          white-space: nowrap;
        }
        .tooltip-wrapper:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
        
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </aside>
  )
})