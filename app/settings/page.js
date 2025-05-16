"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { fetchSettings, getCurrentUser } from "@/lib/actions/auth-actions"
import { AlertCircle, SettingsIcon, Monitor, Moon, Sun, Github } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState(null)
  const [settingsData, setSettingsData] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState("account")

  // User preferences form state
  const [userPreferences, setUserPreferences] = useState({
    theme: "system",
    notifications: {
      email: true,
      browser: true,
      mentorship: true,
      projectUpdates: true,
      marketing: false,
    },
    privacy: {
      showEmail: false,
      showGithubStats: true,
      showContributions: true,
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
    },
  })

  // Load user data and settings
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Get user from localStorage
        const user = getCurrentUser()
        if (user) {
          setUserData(user)
        } else {
          // Redirect to login if not authenticated
          router.push("/auth/login")
          return
        }

        // Fetch settings
        const response = await fetchSettings()
        if (response.success && response.data) {
          setSettingsData(response.data)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        setErrorMessage("Failed to load settings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Handle theme change
  const handleThemeChange = (value) => {
    setUserPreferences((prev) => ({
      ...prev,
      theme: value,
    }))
  }

  // Handle switch toggle
  const handleSwitchChange = (section, key, checked) => {
    setUserPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: checked,
      },
    }))
  }

  // Save user preferences
  const handleSavePreferences = async () => {
    try {
      setSaving(true)

      // In a real implementation, we would call updateUserSettings here
      // const response = await updateUserSettings(userPreferences)

      // Simulate successful update for now
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      setErrorMessage(error.message || "An error occurred while saving your settings")
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // Group settings by category
  const groupedSettings = settingsData.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = []
    }
    acc[setting.category].push(setting)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen overflow-auto bg-background">
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Configure your account and application preferences</p>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <TabsList className="mb-4 w-full h-13 grid grid-cols-5 gap-1 bg-muted/30 p-0.5 text-xs">
            <TabsTrigger
              value="account"
              className="text-xs py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-xs py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="text-xs py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="text-xs py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Privacy
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="text-xs py-1.5 h-8 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">Account Information</CardTitle>
                <CardDescription className="text-xs">Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-3 space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-small">Account Type</h5>
                      <p className="text-sm text-muted-foreground">Your current account level</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{userData?.role || "Developer"}</span>
                      <Badge
                        variant="outline"
                        className="text-xs font-normal px-2 py-0.5 capitalize bg-primary/10 text-primary border-none"
                      >
                        {userData?.level || "Beginner"}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-small">Email Verification</h5>
                      <p className="text-sm text-muted-foreground">Status of your email verification</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {userData?.emailVerified ? (
                        <Badge
                          variant="outline"
                          className="text-xs font-normal px-2 py-0.5 bg-green-500/10 text-green-500 border-none"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-normal px-2 py-0.5 bg-amber-500/10 text-amber-500 border-none"
                          >
                            Unverified
                          </Badge>
                          <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">
                            Resend verification
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-small">Connected Accounts</h5>
                      <p className="text-sm text-muted-foreground">External accounts connected to your profile</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          <span className="text-sm">GitHub</span>
                        </div>
                        {userData?.oauth?.github ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs font-normal px-2 py-0.5 bg-green-500/10 text-green-500 border-none"
                            >
                              Connected
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Disconnect
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">Danger Zone</CardTitle>
                <CardDescription className="text-xs">Irreversible actions for your account</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-3 space-y-4 text-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md border border-destructive/20 bg-destructive/5">
                  <div>
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription className="text-xs">Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-3 space-y-4 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.email}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "email", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Browser Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications in your web browser</p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.browser}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "browser", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Mentorship Updates</Label>
                      <p className="text-xs text-muted-foreground">Notifications about mentorship activities</p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.mentorship}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "mentorship", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Project Updates</Label>
                      <p className="text-xs text-muted-foreground">Notifications about project activities</p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.projectUpdates}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "projectUpdates", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Receive occasional newsletters and announcements</p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.marketing}
                      onCheckedChange={(checked) => handleSwitchChange("notifications", "marketing", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3">
                <Button onClick={handleSavePreferences} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">Theme Settings</CardTitle>
                <CardDescription className="text-xs">Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-3 space-y-4 text-sm">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Theme Mode</Label>
                    <RadioGroup
                      defaultValue={userPreferences.theme}
                      onValueChange={handleThemeChange}
                      className="flex flex-col space-y-1 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm">Accessibility Settings</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reduced-motion" className="text-sm">
                            Reduced Motion
                          </Label>
                          <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                        </div>
                        <Switch
                          id="reduced-motion"
                          checked={userPreferences.accessibility.reducedMotion}
                          onCheckedChange={(checked) => handleSwitchChange("accessibility", "reducedMotion", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="high-contrast" className="text-sm">
                            High Contrast
                          </Label>
                          <p className="text-xs text-muted-foreground">Increase visual contrast</p>
                        </div>
                        <Switch
                          id="high-contrast"
                          checked={userPreferences.accessibility.highContrast}
                          onCheckedChange={(checked) => handleSwitchChange("accessibility", "highContrast", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="large-text" className="text-sm">
                            Large Text
                          </Label>
                          <p className="text-xs text-muted-foreground">Increase text size across the application</p>
                        </div>
                        <Switch
                          id="large-text"
                          checked={userPreferences.accessibility.largeText}
                          onCheckedChange={(checked) => handleSwitchChange("accessibility", "largeText", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3">
                <Button onClick={handleSavePreferences} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">Privacy Settings</CardTitle>
                <CardDescription className="text-xs">Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-3 space-y-4 text-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Show Email Address</Label>
                      <p className="text-xs text-muted-foreground">Allow other users to see your email address</p>
                    </div>
                    <Switch
                      checked={userPreferences.privacy.showEmail}
                      onCheckedChange={(checked) => handleSwitchChange("privacy", "showEmail", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Show GitHub Statistics</Label>
                      <p className="text-xs text-muted-foreground">Display your GitHub activity on your profile</p>
                    </div>
                    <Switch
                      checked={userPreferences.privacy.showGithubStats}
                      onCheckedChange={(checked) => handleSwitchChange("privacy", "showGithubStats", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Show Contributions</Label>
                      <p className="text-xs text-muted-foreground">Display your contributions on your profile</p>
                    </div>
                    <Switch
                      checked={userPreferences.privacy.showContributions}
                      onCheckedChange={(checked) => handleSwitchChange("privacy", "showContributions", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3">
                <Button onClick={handleSavePreferences} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base">Application Settings</CardTitle>
                <CardDescription className="text-xs">Global application settings and configuration</CardDescription>
              </CardHeader>
              <CardContent className="px-4 py-3 space-y-4 text-sm">
                {Object.entries(groupedSettings).map(([category, settings]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-sm font-medium capitalize">{category}</h3>
                    <div className="space-y-4">
                      {settings.map((setting) => (
                        <div
                          key={setting._id}
                          className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row"
                        >
                          <div className="space-y-0.5">
                            <Label className="text-sm">{setting.key}</Label>
                            <p className="text-xs text-muted-foreground">{setting.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {typeof setting.value === "boolean" ? (
                              <Badge
                                variant="outline"
                                className={`text-xs font-normal px-2 py-0.5 ${setting.value ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"} border-none`}
                              >
                                {setting.value ? "Enabled" : "Disabled"}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs font-normal px-2 py-0.5 bg-primary/10 text-primary border-none"
                              >
                                {typeof setting.value === "object"
                                  ? JSON.stringify(setting.value)
                                  : setting.value.toString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {Object.entries(groupedSettings).length > 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Badge component since it's used in this file but might not be imported from ui yet
const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const baseStyles =
    "inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input",
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
