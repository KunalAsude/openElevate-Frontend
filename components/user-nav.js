"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, UserCircle, Settings, LogOut, Home, Code, Users, Trophy, Info, HelpCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/auth-actions"

export function UserNav() {
  const [userData, setUserData] = useState(null)
  
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
    window.location.href = '/'
  }
  
  const userInitial = userData?.name ? userData.name[0] : 'U'
  
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={userData?.avatar || "/placeholder.svg?height=32&width=32"} alt="User" />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[260px] p-0" align="end" sideOffset={8}>
          {/* User info section */}
          <div className="p-3 flex items-start gap-3 border-b">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={userData?.avatar || "/placeholder.svg?height=48&width=48"} alt="User" />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{userData?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{userData?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Main navigation section */}
          <div className="py-2">
            <div className="px-3 py-1 text-xs font-medium text-muted-foreground">Pages</div>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/" className="flex items-center gap-2"> 
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/projects" className="flex items-center gap-2"> 
                <Code className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/mentorship" className="flex items-center gap-2"> 
                <Users className="h-4 w-4" />
                <span>Mentorship</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/leaderboard" className="flex items-center gap-2"> 
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/about" className="flex items-center gap-2"> 
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/faq" className="flex items-center gap-2"> 
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </Link>
            </DropdownMenuItem>
          </div>
          
          <DropdownMenuSeparator className="my-1" />
          
          {/* Account section */}
          <div className="py-2">
            <div className="px-3 py-1 text-xs font-medium text-muted-foreground">ACCOUNT</div>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/dashboard" className="flex items-center gap-2 font-medium"> 
                <span className="flex h-4 w-4 items-center justify-center rounded-sm border text-xs font-medium">D</span>
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/profile" className="flex items-center gap-2"> 
                <UserCircle className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2">
              <Link href="/settings" className="flex items-center gap-2"> 
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </div>
          
          <DropdownMenuSeparator className="my-1" />
          
          {/* Logout button */}
          <div className="p-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/20 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
