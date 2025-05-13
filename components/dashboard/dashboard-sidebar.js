import  React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export function DashboardSidebar({ className }) {
  return (
    <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
      <DashboardNav className="p-4" />
    </aside>
  )
}
