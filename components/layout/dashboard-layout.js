"use client"

import { useState, useEffect, useRef } from 'react'
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Logo } from "@/components/layout/logo"
import { cn } from "@/lib/utils"
import { Menu, PanelLeft, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardLayout({ children }) {
  // Reference to main content for programmatic adjustments
  const contentRef = useRef(null);
  
  // Use state with a callback to ensure immediate UI updates
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed')
      return savedState === 'true'
    }
    return false
  })
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed))
    
    // Force layout recalculation after state change
    if (contentRef.current) {
      // Use RAF for better performance
      window.requestAnimationFrame(() => {
        // The following line forces a repaint
        void contentRef.current.offsetWidth;
      });
    }
  }, [sidebarCollapsed])
  
  // Use ResizeObserver to handle sidebar width changes
  useEffect(() => {
    // Get the sidebar element
    const sidebarElement = document.querySelector('.sidebar-element');
    
    if (!sidebarElement) return;
    
    // Create a resize observer to watch for width changes
    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current) {
        // Trigger a reflow
        contentRef.current.style.display = 'none';
        // Force reflow
        void contentRef.current.offsetHeight;
        // Restore display
        contentRef.current.style.display = '';
      }
    });
    
    // Start observing
    resizeObserver.observe(sidebarElement);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle sidebar toggle with manual layout adjustment for immediate feedback
  const handleToggleSidebar = (newState) => {
    setSidebarCollapsed(newState);
    
    // Immediate layout adjustment technique
    if (contentRef.current) {
      // Apply class immediately for visual feedback
      contentRef.current.style.marginLeft = newState ? '70px' : '250px';
    }
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
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
      <div className="flex pt-12 relative"> {/* Add padding top to account for navbar */}
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={handleToggleSidebar} 
          className="border-r border-border sidebar-element"
        />
        
        {/* Main content with reference for programmatic adjustment */}
        <div 
          ref={contentRef}
          className={cn(
            "flex-1 overflow-auto duration-200 ease-out dashboard-content",
            "will-change-[margin-left] transform-gpu"
          )}
          style={{
            marginLeft: sidebarCollapsed ? '70px' : '250px',
            transition: 'margin-left 200ms ease-out',
          }}
        >
          {/* Floating sidebar toggle button */}
          <div className="fixed top-4 right-4 z-50">
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground"
              onClick={() => handleToggleSidebar(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
      
      {/* Style tag to improve transitions */}
      <style jsx global>{`
        .dashboard-content {
          contain: layout style size;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Prevent layout thrashing during transitions */
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}