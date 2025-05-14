'use client'

import { Suspense } from 'react'
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function NotFoundContent() {
  // Even though we may not be directly using searchParams,
  // Next.js is detecting it during build
  const searchParams = useSearchParams()
  
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">404 - Page Not Found</h1>
          <p className="text-sm text-muted-foreground">The page you are looking for might have been removed or is temporarily unavailable.</p>
        </div>
        <Link href="/" className="w-full text-center underline hover:text-foreground">
          Go Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}
