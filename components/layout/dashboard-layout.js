"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"
import { Menu, PanelLeft, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardLayout({ children }) {
  // Use state with a callback to ensure immediate UI updates
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed')
      return savedState === 'true'
    }
    return false
  })
  
  // This effect runs only once on component mount
  useEffect(() => {
    // Make sure the DOM is fully loaded
    const handleResize = () => {
      // Force redraw of the layout
      document.body.style.display = 'none'
      setTimeout(() => {
        document.body.style.display = ''
      }, 0)
    }
    
    // Handle the custom sidebarToggled event
    const handleSidebarToggle = (event) => {
      // Force a layout recalculation for the main content
      const mainContent = document.querySelector('.dashboard-content')
      if (mainContent) {
        // Apply a temporary class to trigger a reflow
        mainContent.classList.add('content-adjusting')
        
        // Force a reflow by accessing offsetHeight
        void mainContent.offsetHeight
        
        // Remove the class after a short delay
        setTimeout(() => {
          mainContent.classList.remove('content-adjusting')
        }, 300)
      }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('sidebarToggled', handleSidebarToggle)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('sidebarToggled', handleSidebarToggle)
    }
  }, [])

  // Handle sidebar toggle with immediate visual feedback
  const handleToggleSidebar = (newState) => {
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
    
    // Force immediate redraw
    document.body.classList.toggle('sidebar-collapsed', newState)
  }

  return (
    <div className="grid min-h-screen bg-background">
      {/* Top navbar - reduced height */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center">
            {/* Sidebar toggle button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12"
              onClick={() => handleToggleSidebar(!sidebarCollapsed)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            {/* Right side actions if needed */}
          </div>
        </div>
      </header>
      
      {/* Content area with sidebar and main content */}
      <div className="flex pt-12"> {/* Add padding top to account for navbar */}
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={handleToggleSidebar} 
          className="border-r border-border"
        />
        
        {/* Main content */}
        <div className={cn(
          "flex-1 overflow-auto transition-all duration-300 dashboard-content",
          sidebarCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}>
          {/* Floating sidebar toggle button */}
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground"
              onClick={() => handleToggleSidebar(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <PanelRightClose className="h-6 w-6" />
              ) : (
                <PanelLeft className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}