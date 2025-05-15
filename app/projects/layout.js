"use client"

import ProtectedRoute from "@/components/auth/protected-route"

export default function ProjectsLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
