"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GitHubIndicator } from "@/components/github/github-indicator"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LayoutDashboard, User, Settings, LogOut, KeyRound, Github, Mail, Code, GitPullRequest, Users, BookOpen, Trophy, Star, PanelLeft, PanelRightClose, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/layout/logo"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  // Get user data and check if logged in
  const [userData, setUserData] = React.useState(null)

  // Function to check authentication status
  const checkAuthStatus = () => {
    // Check for auth token in localStorage
    const authToken = localStorage.getItem('authToken')
    const userDataStr = localStorage.getItem('user')

    if (authToken && userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr)
        setUserData(parsedUserData)
        setIsLoggedIn(true)
        return true
      } catch (e) {
        console.error('Error parsing user data:', e)
        setIsLoggedIn(false)
        return false
      }
    } else {
      setIsLoggedIn(false)
      return false
    }
  }

  // Check auth status on component mount and pathname change
  React.useEffect(() => {
    checkAuthStatus()

    // Add event listener for storage changes (for cross-tab login/logout)
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [pathname])

  // Updated nav link styles with consistent hover and active states - preventing green background on click
  const navLinkStyle = "flex items-center px-3 py-2 text-[13px] font-medium transition-colors hover:text-primary focus:text-primary focus:bg-transparent relative focus:outline-none"
  const activeNavLinkStyle = "flex items-center px-3 py-2 text-[13px] font-medium text-primary relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full focus:bg-transparent focus:outline-none"

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-8xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className={pathname === "/" ? activeNavLinkStyle : navLinkStyle}>
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isLoggedIn && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard" className={pathname.startsWith("/dashboard") ? activeNavLinkStyle : navLinkStyle}>
                      <span className="flex items-center gap-1">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent hover:text-primary focus:text-primary">
                  <span className={pathname.startsWith("/project") ? activeNavLinkStyle : navLinkStyle}>Projects</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                          href="/projects"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">Explore Projects</div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover open source projects that match your skills and interests
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/projects/trending"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Trending</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Popular projects in the community
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/projects/new"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Submit Project</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Add your open source project to OpenElevate
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent hover:text-primary focus:text-primary">
                  <span className={pathname.includes("/mentorship") || pathname.includes("/learning-path") || pathname.includes("/leaderboard") || pathname.includes("/about") ? activeNavLinkStyle : navLinkStyle}>Resources</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/mentorship"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-primary focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Mentorship</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Connect with experienced mentors
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/ai/learning-path"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-primary focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Learning Paths</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Personalized learning recommendations
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/leaderboard"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-primary focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">Leaderboard</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Top contributors and projects
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/about"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-primary focus:text-primary"
                        >
                          <div className="text-sm font-medium leading-none">About Us</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about our mission and team
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/faq" className={pathname.startsWith("/faq") ? activeNavLinkStyle : navLinkStyle}>
                    FAQ
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <GitHubIndicator />
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <p
                    className={`flex items-center gap-2 rounded-md px-3 py-2 border border-border bg-background hover:bg-muted/50 hover:text-primary transition-colors ${isHovered ? 'text-primary bg-muted' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">{userData?.name ? userData.name.split(' ')[0] : 'Profile'}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border-border shadow-lg">
                  <div className="p-2 border-b border-border">
                    <div className="font-medium">{userData?.name || 'User'}</div>
                    <div className="text-xs text-muted-foreground truncate">{userData?.email || 'user@example.com'}</div>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem asChild className="py-2 px-3 cursor-pointer focus:bg-muted hover:bg-muted hover:text-primary">
                      <Link href="/dashboard" className="flex w-full items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2 px-3 cursor-pointer focus:bg-muted hover:bg-muted hover:text-primary">
                      <Link href="/profile" className="flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2 px-3 cursor-pointer focus:bg-muted hover:bg-muted hover:text-primary">
                      <Link href="/settings" className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2 px-3 cursor-pointer focus:bg-muted hover:bg-muted hover:text-primary">
                      <Link href="/reset-password" className="flex w-full items-center">
                        <KeyRound className="mr-2 h-4 w-4" />
                        <span>Reset Password</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <div className="border-t border-border p-1">
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                        setIsLoggedIn(false);
                        // Dispatch storage event to notify other tabs
                        window.dispatchEvent(new Event('storage'));
                        window.location.href = '/';
                      }}
                      className="py-2 px-3 cursor-pointer focus:bg-muted hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild className="hover:text-primary hover:bg-muted/50 focus:bg-muted/50 focus:text-primary active:bg-muted/50 transition-colors outline-none">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] sm:w-[300px]">
              <div className="flex flex-col h-full py-4">
                <div className="flex items-center mb-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Logo />
                  </Link>
                </div>

                {isLoggedIn && userData && (
                  <div className="px-1 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{userData.name}</p>
                        <p className="text-xs text-muted-foreground">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="space-y-0.5 mb-4">
                  <Link
                    href="/"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/" ? "text-primary" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/projects"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/projects" ? "text-primary" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/mentorship"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/mentorship" ? "text-primary" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Mentorship
                  </Link>
                  <Link
                    href="/leaderboard"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/leaderboard" ? "text-primary" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    href="/about"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/about" ? "text-primary" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/faq"
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/faq" ? "text-primary" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    FAQ
                  </Link>
                </nav>

                {isLoggedIn ? (
                  <div className="space-y-0.5">
                    <p className="px-2 text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Account</p>
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/dashboard" ? "text-primary" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/profile" ? "text-primary" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm ${pathname === "/settings" ? "text-primary" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Settings
                    </Link>
                    <button
                      className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md hover:text-primary text-sm text-left"
                      onClick={() => {
                        localStorage.removeItem('authToken')
                        localStorage.removeItem('user')
                        setUserData(null)
                        setIsLoggedIn(false)
                        // Dispatch storage event to notify other tabs
                        window.dispatchEvent(new Event('storage'))
                        setIsOpen(false)
                        window.location.href = '/'
                      }}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="mt-auto space-y-2 px-1">
                    <Button asChild className="w-full justify-start hover:text-primary" variant="outline" onClick={() => setIsOpen(false)}>
                      <Link href="/auth/login" className="flex items-center gap-2">
                        Log in
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <Link href="/auth/register" className="flex items-center gap-2">
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}