"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function LoadingSpinner({ size = "md", className }) {
  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }

  return (
    <div className={cn("animate-spin", spinnerSizes[size], className)}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        className="text-primary"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}

export function RouteChangeSpinner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Track route changes to show and hide spinner
  useEffect(() => {
    let mounted = true;

    // Function to safely update state only if component is mounted
    const safeSetLoading = (value) => {
      if (mounted) setIsLoading(value);
    };

    // Show spinner immediately
    safeSetLoading(true);
    
    // Important: We need multiple timeouts to ensure it disappears
    const shortTimer = setTimeout(() => {
      safeSetLoading(false);
    }, 600);
    
    const backupTimer = setTimeout(() => {
      safeSetLoading(false);
    }, 1500);
    
    // Cleanup function runs when component unmounts or dependencies change
    return () => {
      mounted = false;
      clearTimeout(shortTimer);
      clearTimeout(backupTimer);
    };
  }, [pathname, searchParams]) // Dependencies ensure effect runs on route change

  if (!isLoading) return null
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" />
    </div>
  )
}
