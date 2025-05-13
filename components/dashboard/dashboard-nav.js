"use client"

import  React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, Code, GitPullRequest, Home, Settings, Star, Users, BookOpen, MessageSquare } from "lucide-react"



export function DashboardNav({ className, ...props }) {
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
      active: pathname === "/dashboard/projects" || pathname?.startsWith("/dashboard/projects/"),
    },
    {
      href: "/dashboard/contributions",
      label: "Contributions",
      icon: GitPullRequest,
      active: pathname === "/dashboard/contributions" || pathname?.startsWith("/dashboard/contributions/"),
    },
    {
      href: "/dashboard/badges",
      label: "Badges",
      icon: Star,
      active: pathname === "/dashboard/badges",
    },
    {
      href: "/dashboard/mentorship",
      label: "Mentorship",
      icon: BookOpen,
      active: pathname === "/dashboard/mentorship" || pathname?.startsWith("/dashboard/mentorship/"),
    },
    {
      href: "/dashboard/community",
      label: "Community",
      icon: Users,
      active: pathname === "/dashboard/community",
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname === "/dashboard/messages",
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
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
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
