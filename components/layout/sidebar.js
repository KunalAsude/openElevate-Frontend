"use client"

import React, { useState, useEffect, useRef } from "react"
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
  const sidebarRef = useRef(null)

  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)


  // Use the external collapsed state if provided, otherwise use internal state
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed

  // Initialize component with saved state from localStorage and check screen size
  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)  // 768px is typical md breakpoint
      
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setInternalCollapsed(true)
        localStorage.setItem("sidebarCollapsed", "true")
      } else {
        // Try to get saved state from localStorage for larger screens
        const savedCollapsed = localStorage.getItem("sidebarCollapsed")
        if (savedCollapsed !== null) {
          setInternalCollapsed(savedCollapsed === "true")
        }
      }
    }
    
    // Initial check
    checkMobileView()
    
    // Add resize listener for responsive behavior
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  // Initialize internal state from localStorage on mount
  useEffect(() => {
    if (isCollapsed === undefined) {
      const savedCollapsed = localStorage.getItem("sidebarCollapsed")
      if (savedCollapsed !== null) {
        setInternalCollapsed(savedCollapsed === "true")
      }
    }
  }, [isCollapsed])
  
  // Notify the layout about width changes
  useEffect(() => {
    // Create a resize observer to notify layout of any size changes
    if (sidebarRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        // Dispatch resize event to trigger layout recalculations
        window.dispatchEvent(new Event('resize'));
        
        // Dispatch a custom event that parent components can listen for
        window.dispatchEvent(new CustomEvent('sidebarResized', {
          detail: { collapsed }
        }));
      });
      
      resizeObserver.observe(sidebarRef.current);
      
      return () => {
        if (sidebarRef.current) {
          resizeObserver.unobserve(sidebarRef.current);
        }
      };
    }
  }, [collapsed]);

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      // Use the external handler which will handle the state
      onToggleCollapse(!collapsed)
    } else {
      // Handle internal state
      const newCollapsed = !internalCollapsed
      setInternalCollapsed(newCollapsed)
      localStorage.setItem("sidebarCollapsed", String(newCollapsed))
      
      // Force layout recalculation
      document.documentElement.style.setProperty('--force-repaint', '0');
      // Force a reflow
      void document.documentElement.offsetHeight;
      // Reset the property
      document.documentElement.style.setProperty('--force-repaint', '1');
    }
  }

  const navItems = [
    {
      title: "",
      divider: true, // Adding divider above Dashboard section
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
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-12 z-40 h-[calc(100vh-48px)] bg-background flex flex-col sidebar-element",
        collapsed ? "w-[70px]" : "w-[250px]",
        className,
      )}
      style={{
        willChange: 'width',
        contain: 'layout style size',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        transition: 'width 200ms ease-out'
      }}
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
            <PanelRightClose className="h-10 w-10 mt-10 text-gray-500" />
          ) : (
            <PanelLeft className="h-10 w-10 mt-10 text-gray-500" />
          )}
        </div>
      </div>

      {/* Mobile overlay for when sidebar is expanded on mobile */}
      {!collapsed && isMobileView && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1]"
          onClick={toggleCollapse}
          aria-hidden="true"
        />
      )}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <div className="flex flex-col gap-1">
          {navItems.map((section, i) => (
            <div key={i} className="px-3">  {/* Consistent padding regardless of collapse state */}
              {!collapsed && section.title && (
                <h3 className="mb-1 px-2 text-base font-medium text-muted-foreground">{section.title}</h3>
              )}
              {!collapsed && section.divider && (
                <div className="h-[1px] bg-border mx-2 my-2"></div>
              )}
              {collapsed && section.divider && <div className="h-[1px] bg-border mx-1 mb-3"></div>}
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
        
        /* CSS variable for forced repaint */
        :root {
          --force-repaint: 1;
        }
      `}</style>
    </aside>
  )
})