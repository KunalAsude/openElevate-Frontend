"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { changePassword, getCurrentUser } from '@/lib/actions/auth-actions'
import { AlertCircle, KeyRound } from "lucide-react"
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Load user data on component mount
  useEffect(() => {
    const user = getCurrentUser()
    setUserData(user)
    setLoading(false)
    
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/auth/login')
    }
  }, [router])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Reset password
  const handleResetPassword = async () => {
    // Clear previous errors
    setErrorMessage('')
    
    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match')
      return
    }
    
    // Validate password strength
    if (passwordForm.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long')
      return
    }

    try {
      setResetting(true)
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      if (response.success) {
        toast.success("Password has been successfully changed", {
          description: "You'll be redirected to dashboard shortly",
          duration: 3000
        })
        // Redirect to dashboard after successful reset
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        toast.error("Failed to reset password", {
          description: response.message || "Please try again",
          duration: 3000
        })
        setErrorMessage(response.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      toast.error("Error resetting password", {
        description: error.message || "Please try again later",
        duration: 3000
      })
      setErrorMessage(error.message || 'An error occurred while resetting your password')
    } finally {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-lg py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-lg py-10">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your current password and choose a new secure password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter your current password"
              value={passwordForm.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={passwordForm.newPassword}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={passwordForm.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Button 
              className="w-full" 
              onClick={handleResetPassword}
              disabled={resetting || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            >
              {resetting ? "Updating..." : "Reset Password"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
