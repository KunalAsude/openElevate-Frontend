'use client'

import { Suspense } from 'react'
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { ArrowLeft } from "lucide-react"

function ResetPasswordContentInner() {
  // Safe to use useSearchParams here because this component is:
  // 1. Client component ('use client')
  // 2. Wrapped in Suspense
  // 3. Dynamically imported with ssr: false
  const searchParams = useSearchParams()
  
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <Link href="/auth/login" className="mb-8 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContentInner />
    </Suspense>
  )
}
