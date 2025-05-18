'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/actions/auth-actions'
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
  Menu,
  X,
  Home,
  ChevronRight,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState(null)

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  
  // Get user data
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserData(user)
    }
  }, [])
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setOpen(false)
    window.location.href = '/'
  }

  const navItems = [
    {
      title: 'Dashboard',
      items: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          active: pathname === '/dashboard',
        },
        {
          href: '/dashboard/projects',
          label: 'Projects',
          icon: Code,
          active: pathname === '/dashboard/projects' || pathname?.startsWith('/dashboard/projects/'),
        },
        {
          href: '/dashboard/contributions',
          label: 'Contributions',
          icon: GitPullRequest,
          active: pathname === '/dashboard/contributions' || pathname?.startsWith('/dashboard/contributions/'),
        },
        {
          href: '/dashboard/badges',
          label: 'Badges',
          icon: Award,
          active: pathname === '/dashboard/badges',
        },
        {
          href: '/dashboard/analytics',
          label: 'Analytics',
          icon: BarChart2,
          active: pathname === '/dashboard/analytics',
        },
      ],
    },
    {
      title: 'Mentorship',
      items: [
        {
          href: '/mentorship',
          label: 'Overview',
          icon: Bookmark,
          active: pathname === '/mentorship',
        },
        {
          href: '/mentorship/sessions',
          label: 'Sessions',
          icon: MessagesSquare,
          active: pathname === '/mentorship/sessions',
        },
        {
          href: '/mentorship/requests',
          label: 'Requests',
          icon: UserPlus,
          active: pathname === '/mentorship/requests',
        },
      ],
    },
    {
      title: 'Explore',
      items: [
        {
          href: '/explorer',
          label: 'Projects Explorer',
          icon: Compass,
          active: pathname === '/explorer',
        },
        {
          href: '/leaderboard',
          label: 'Leaderboard',
          icon: Trophy,
          active: pathname === '/leaderboard',
        },
        {
          href: '/resources',
          label: 'Learning Resources',
          icon: BookOpen,
          active: pathname === '/resources',
        },
        {
          href: '/platform-analytics',
          label: 'Platform Analytics',
          icon: BarChart2,
          active: pathname === '/platform-analytics',
        },
      ],
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden" 
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 pt-0 z-[100] border-r top-0 mt-0">
        {/* Header with close button and logo */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Logo className="h-7 w-auto" />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* User profile section if logged in */}
        {userData && (
          <div className="px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="h-10 w-10 rounded-full" />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{userData.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{userData.email || 'user@example.com'}</p>
              </div>
              <Link href="/profile" className="text-muted-foreground hover:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
        
        {/* Main Navigation */}
        <div className="overflow-y-auto h-[calc(100vh-60px)] pb-safe-area-inset-bottom">
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 p-4 border-b">
            <Link 
              href="/" 
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-colors",
                pathname === "/" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted/40 hover:bg-muted hover:text-primary"
              )}
              onClick={() => setOpen(false)}
            >
              <Home className="h-5 w-5 mb-1 text-primary" />
              <span className="text-xs">Home</span>
            </Link>
            <Link 
              href="/dashboard" 
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-colors",
                pathname.startsWith("/dashboard") 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted/40 hover:bg-muted hover:text-primary"
              )}
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5 mb-1 text-primary" />
              <span className="text-xs">Dashboard</span>
            </Link>
          </div>
          
          {/* Main menu */}
          <nav className="p-4 space-y-6">
            {navItems.map((section, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground px-2">{section.title}</h3>
                <div className="space-y-1 rounded-lg overflow-hidden border border-border/60">
                  {section.items.map((item, j) => (
                    <Link
                      key={j}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                        item.active 
                          ? "bg-primary/10 text-primary border-l-2 border-primary" 
                          : "hover:bg-muted hover:text-primary"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Settings and logout */}
            {userData && (
              <div className="space-y-3 pt-4 mt-4 border-t">
                <h3 className="text-xs font-medium text-muted-foreground px-2">Account</h3>
                <div className="space-y-1">
                  <Link
                    href="/settings"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-md",
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted hover:text-primary"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-md hover:bg-muted/50 text-red-500 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
