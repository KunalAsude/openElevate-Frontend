"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchUserProfile, updateUserProfile, changePassword } from '@/lib/actions/auth-actions'
import { GitHubIndicator } from "@/components/github/github-indicator"
import { AlertCircle, Github, Linkedin, Twitter, Globe, User, Mail, Code, Shield, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [userData, setUserData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    level: 'beginner',
    skills: [],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    }
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Skill input state
  const [skillInput, setSkillInput] = useState('')

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        // First check for user in localStorage
        const localUser = localStorage.getItem('user')
        
        if (localUser) {
          try {
            // Use localStorage data temporarily for faster loading
            const parsedUser = JSON.parse(localUser)
            setUserData(parsedUser)
            
            // Initialize the form with user data
            setProfileForm({
              name: parsedUser.name || '',
              bio: parsedUser.bio || '',
              level: parsedUser.level || 'beginner',
              skills: parsedUser.skills || [],
              socialLinks: {
                github: parsedUser.socialLinks?.github || '',
                linkedin: parsedUser.socialLinks?.linkedin || '',
                twitter: parsedUser.socialLinks?.twitter || '',
                website: parsedUser.socialLinks?.website || ''
              }
            })
          } catch (e) {
            console.error('Error parsing user from localStorage:', e)
          }
        }
        
        // Then fetch the latest data from API
        const response = await fetchUserProfile()
        
        if (response.success && response.data) {
          setUserData(response.data)
          
          // Update form with the most recent data
          setProfileForm({
            name: response.data.name || '',
            bio: response.data.bio || '',
            level: response.data.level || 'beginner',
            skills: response.data.skills || [],
            socialLinks: {
              github: response.data.socialLinks?.github || '',
              linkedin: response.data.socialLinks?.linkedin || '',
              twitter: response.data.socialLinks?.twitter || '',
              website: response.data.socialLinks?.website || ''
            }
          })
        } else {
          if (!localUser) {
            setErrorMessage('Failed to load profile data')
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setErrorMessage('Failed to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      // Handle nested socialLinks properties
      const [parent, child] = name.split('.')
      setProfileForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      // Handle top-level properties
      setProfileForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Handle level select change
  const handleLevelChange = (value) => {
    setProfileForm(prev => ({
      ...prev,
      level: value
    }))
  }

  // Handle adding skills
  const handleAddSkill = () => {
    if (skillInput.trim() && !profileForm.skills.includes(skillInput.trim())) {
      setProfileForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  // Handle removing skills
  const handleRemoveSkill = (skillToRemove) => {
    setProfileForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const response = await updateUserProfile(profileForm)
      
      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          duration: 3000
        })
      } else {
        setErrorMessage(response.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage(error.message || 'An error occurred while updating your profile')
    } finally {
      setSaving(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match')
      return
    }

    try {
      setChangingPassword(true)
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      if (response.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been successfully updated.",
          duration: 3000
        })
        // Reset password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setErrorMessage(response.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setErrorMessage(error.message || 'An error occurred while changing your password')
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container max-w-6xl py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage || 'Failed to load profile. Please try logging in again.'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push('/auth/login')}>
            Log In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-6 md:py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{userData.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{userData.email}</span>
              </div>
              {userData.role && (
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{userData.role}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profile Completeness</span>
              <span className="text-sm font-medium">{userData.profileCompleteness || 0}%</span>
            </div>
            <Progress value={userData.profileCompleteness || 0} className="h-2" />
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Your full name" 
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      placeholder="Tell us about yourself" 
                      value={profileForm.bio || ''}
                      onChange={handleProfileChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Experience Level</Label>
                    <Select 
                      value={profileForm.level} 
                      onValueChange={handleLevelChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="skillInput" 
                        placeholder="Add a skill" 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <Button type="button" onClick={handleAddSkill} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileForm.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center gap-1 py-1"
                        >
                          {skill}
                          <button 
                            className="ml-1 rounded-full hover:bg-destructive/10 p-0.5" 
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </Badge>
                      ))}
                      {profileForm.skills.length === 0 && (
                        <span className="text-sm text-muted-foreground">No skills added yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Connect your social profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                    <Github className="h-5 w-5" />
                    <Input 
                      name="socialLinks.github" 
                      placeholder="GitHub profile URL" 
                      value={profileForm.socialLinks.github}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                    <Linkedin className="h-5 w-5" />
                    <Input 
                      name="socialLinks.linkedin" 
                      placeholder="LinkedIn profile URL" 
                      value={profileForm.socialLinks.linkedin || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                    <Twitter className="h-5 w-5" />
                    <Input 
                      name="socialLinks.twitter" 
                      placeholder="Twitter profile URL" 
                      value={profileForm.socialLinks.twitter || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="grid grid-cols-[20px_1fr] items-center gap-4">
                    <Globe className="h-5 w-5" />
                    <Input 
                      name="socialLinks.website" 
                      placeholder="Personal website URL" 
                      value={profileForm.socialLinks.website || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Links"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GitHub Connection</CardTitle>
                <CardDescription>
                  Connect your GitHub account to unlock more features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    <div>
                      <p className="font-medium">GitHub Integration</p>
                      <p className="text-sm text-muted-foreground">Access repositories and track contributions</p>
                    </div>
                  </div>
                  <GitHubIndicator />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword" 
                      type="password" 
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleChangePassword} 
                  disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                >
                  {changingPassword ? "Updating..." : "Change Password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
