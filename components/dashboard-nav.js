"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, Code, GitPullRequest, Home, Settings, Star, Users } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: Code,
      active: pathname === "/dashboard/projects",
    },
    {
      href: "/dashboard/contributions",
      label: "Contributions",
      icon: GitPullRequest,
      active: pathname === "/dashboard/contributions",
    },
    {
      href: "/dashboard/community",
      label: "Community",
      icon: Users,
      active: pathname === "/dashboard/community",
    },
    {
      href: "/dashboard/achievements",
      label: "Achievements",
      icon: Star,
      active: pathname === "/dashboard/achievements",
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: BarChart,
      active: pathname === "/dashboard/analytics",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <nav className="grid items-start gap-2 py-4">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "secondary" : "ghost"}
          className={cn("justify-start", route.active ? "bg-muted font-medium" : "font-normal")}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
