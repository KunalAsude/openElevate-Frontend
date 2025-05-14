"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle" // Import your ThemeToggle component

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      {/* 404 Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto animate-fadeIn">
        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-primary">404</h1>
        
        {/* Error Message */}
        <h2 className="mt-6 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/">
              Return Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
        
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Decorative Elements */}
      {/* <div className="absolute bottom-8 flex flex-col items-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Your Company</p>
      </div> */}
    </div>
  )
}