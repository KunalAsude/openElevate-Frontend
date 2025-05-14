"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Mail } from "lucide-react"
import { registerUser, saveAuthCredentials, loginWithGithub, loginWithGoogle } from "@/lib/actions/auth-actions"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = React.useState("")

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleGithubLogin = () => {
    setIsLoading(true)
    loginWithGithub()
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    loginWithGoogle()
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError("")
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required")
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    
      console.log("Registration successful:", response)
      
      // Save credentials to localStorage
      if (response.success && response.token && response.user) {
        saveAuthCredentials(response)
        router.push('/dashboard')
      } else {
        setError("Something went wrong with registration")
      }
      
    } catch (err) {
      console.error("Registration failed:", err)
      // Use specific error message from backend if available
      if (err && err.message) {
        setError(err.message)
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          {error && (
            <div className="bg-red-50 p-2 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            by clicking sign up, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              privacy policy
            </Link>
            .
          </p>
          
          <Button disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGithubLogin}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleLogin}>
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  )
}