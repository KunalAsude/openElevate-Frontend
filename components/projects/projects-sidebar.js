'use client';

import { useState } from 'react';
import { SlidersHorizontal, Filter, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectFilters } from '@/components/projects/project-filters';

export function ProjectsSidebar({ searchParams }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <aside 
      className={`hidden lg:flex flex-col border-r border-border bg-card overflow-y-auto transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
    >
      <div className="flex h-14 items-center px-3 relative border-b border-border">
        {/* Collapse button in the left corner */}
        <div 
          onClick={toggleSidebar}
          className="cursor-pointer hover:opacity-80 transition-opacity p-2 hover:bg-muted/60 rounded-md"
          tabIndex={0}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-8 w-8 text-primary" />
          ) : (
            <Menu className="h-8 w-8 text-primary" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 transition-all duration-300 ease-in-out">
        <ProjectFilters 
          collapsed={sidebarCollapsed}
          initialFilters={searchParams}
        />
      </div>
    </aside>
  );
}
