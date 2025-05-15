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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Bell, UserCircle, Settings, LogOut, Home, Code, Users, Trophy, Info, HelpCircle, GitHub } from "lucide-react"
import { getCurrentUser, getAuthToken, loginWithGithub } from "@/lib/actions/auth-actions"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"

export function UserNav() {
  const [userData, setUserData] = useState(null)
  const [githubUser, setGithubUser] = useState(null)
  const [isConnectingGithub, setIsConnectingGithub] = useState(false)
  
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserData(user)
    }
    
    // Check if GitHub is connected
    const checkGitHubConnection = async () => {
      try {
        const token = getAuthToken()
        if (!token) return
        
        const response = await axios.get(`${API_BASE_URL}/github/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data && response.data.user) {
          setGithubUser(response.data.user)
        }
      } catch (error) {
        console.error('Error checking GitHub connection:', error)
      }
    }
    
    checkGitHubConnection()
  }, [])
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/'
  }
  
  // Handle GitHub connection
  const handleGitHubConnect = () => {
    setIsConnectingGithub(true)
    loginWithGithub()
  }
  
  // Handle GitHub disconnection
  const handleGitHubDisconnect = async () => {
    try {
      const token = getAuthToken()
      if (!token) return
      
      await axios.post(`${API_BASE_URL}/github/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setGithubUser(null)
    } catch (error) {
      console.error('Error disconnecting GitHub:', error)
    }
  }
  
  const userInitial = userData?.name ? userData.name[0] : 'U'
  
  return (
    <div className="flex items-center gap-4">
      {/* GitHub Connection Status */}
      {userData && (
        githubUser ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleGitHubDisconnect}
                  className="relative"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage src={githubUser.avatar_url} alt={githubUser.login} />
                    <AvatarFallback><GitHub className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connected to GitHub as {githubUser.login}</p>
                <p className="text-xs text-gray-500">Click to disconnect</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGitHubConnect}
            disabled={isConnectingGithub}
            className="flex items-center gap-2"
          >
            <GitHub className="h-4 w-4" />
            {isConnectingGithub ? 'Connecting...' : 'Connect GitHub'}
          </Button>
        )
      )}
      
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
