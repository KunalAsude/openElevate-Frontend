"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Get sidebar state from localStorage to keep layout consistent
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === 'true')
    }
  }, [])

  // Handle sidebar toggle and persist state
  const handleToggleSidebar = (newState) => {
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={handleToggleSidebar} 
      />
      <div 
        className={cn(
          "flex-1 transition-all duration-300 overflow-auto",
          sidebarCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}
      >
        <main className="flex-1">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
