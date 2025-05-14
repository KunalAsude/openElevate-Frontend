"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Github, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { loginUser, saveAuthCredentials, loginWithGithub, loginWithGoogle } from "@/lib/actions/auth-actions"

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
  })
  const [error, setError] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleCheckboxChange = (checked) => {
    setRememberMe(checked)
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

    console.log(formData)
    
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return
    }
    

    setIsLoading(true)

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      })

      console.log("Login successful:", response)

      // Save credentials to localStorage
      if (response.success && response.token && response.user) {
        saveAuthCredentials(response)
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'))
        router.push('/dashboard')
      } else {
        setError("Something went wrong with login")
      }
    } catch (err) {
      console.error("Login failed:", err)
      // Use specific error message from backend if available
      if (err && err.message) {
        setError(err.message)
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/reset-password" className="text-sm text-muted-foreground hover:text-foreground">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <Checkbox id="remember" onCheckedChange={handleCheckboxChange} checked={rememberMe} />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </Label>
          </div> */}


          <Button className={'mt-4'} disabled={isLoading}>{isLoading ? "Signing in..." : "Sign in"}</Button>
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
