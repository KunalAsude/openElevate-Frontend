"use client"

import { useState, useEffect, useRef } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { cn } from "@/lib/utils"
import ProtectedRoute from "@/components/auth/protected-route"

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const mainContentRef = useRef(null)
  
  // Get sidebar state from localStorage to keep layout consistent
  useEffect(() => {
    const checkMobileView = () => {
      const isMobile = window.innerWidth < 768 // 768px is typical md breakpoint
      setIsMobileView(isMobile)
      
      // For mobile devices, we might want different default settings
      const savedCollapsed = localStorage.getItem('sidebarCollapsed')
      if (savedCollapsed !== null) {
        setSidebarCollapsed(savedCollapsed === 'true')
      } else if (isMobile) {
        // Default to collapsed on mobile if no preference saved
        setSidebarCollapsed(true)
      }
    }
    
    // Initial check
    checkMobileView()
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  // Listen for changes to the sidebar collapsed state
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed')
      if (savedCollapsed !== null) {
        setSidebarCollapsed(savedCollapsed === 'true')
      }
    }
    
    // Handle custom sidebar resize event
    const handleSidebarResize = (event) => {
      if (event.detail) {
        setSidebarCollapsed(event.detail.collapsed)
        
        // Force layout recalculation
        if (mainContentRef.current) {
          // Trigger a reflow
          void mainContentRef.current.offsetHeight
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('sidebarResized', handleSidebarResize)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebarResized', handleSidebarResize)
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <div 
          ref={mainContentRef}
          className={cn(
            "flex-1 overflow-auto main-content",
            // On mobile, take full width when sidebar is collapsed 
            isMobileView && sidebarCollapsed ? "ml-0 sm:ml-[70px]" : 
            // On mobile, take full width but push content right when expanded
            isMobileView && !sidebarCollapsed ? "ml-0" : 
            // On desktop, adjust based on sidebar state with reduced gap when not collapsed
            sidebarCollapsed ? "ml-[70px]" : "ml-[240px]" // Reduced from 250px to 220px
          )}
          style={{
            transition: 'margin-left 200ms ease-out',
            willChange: 'margin-left',
            transform: 'translateZ(0)',
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          <main className="flex-1">
            {/* Mobile Nav - visible only on mobile */}
            <div className="md:hidden flex items-center justify-between px-4 py-0 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
              <div className="flex items-center">
                <MobileNav />
                <div className="ml-3 font-medium tracking-tight">Dashboard</div>
              </div>
              <div className="flex items-center space-x-2">
                {/* This could be notifications or profile button */}
              </div>
            </div>
            
            <div className="p-2 pt-1 md:p-3 md:pt-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

