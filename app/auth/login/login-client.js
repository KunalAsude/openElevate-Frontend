'use client'

import { Suspense } from 'react'
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ArrowLeft } from "lucide-react"

function LoginContentInner() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      {/* <Link href="/" className="mb-8 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link> */}
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="underline underline-offset-4 hover:text-foreground">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
      <LoginContentInner />
    </Suspense>
  )
}
