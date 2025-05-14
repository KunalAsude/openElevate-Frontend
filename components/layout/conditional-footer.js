"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/layout/footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  const isHomePage = pathname === '/' || pathname === '/home'
  
  if (!isHomePage) {
    return null
  }
  
  return <Footer className="mt-auto" />
}
