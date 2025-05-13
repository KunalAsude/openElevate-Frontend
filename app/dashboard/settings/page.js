import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and preferences." />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and how others see you on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="johndoe" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself"
                    defaultValue="Full stack developer passionate about open source and building accessible web applications."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://johndoe.dev" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
              <CardDescription>Add your skills and interests to help us match you with projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" defaultValue="React, TypeScript, Node.js, GraphQL" />
                <p className="text-sm text-muted-foreground">Separate skills with commas</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interests">Interests</Label>
                <Input id="interests" defaultValue="Web Development, UI/UX, Accessibility, Performance" />
                <p className="text-sm text-muted-foreground">Separate interests with commas</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and email preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-verified" checked disabled />
                <Label htmlFor="email-verified">Email verified</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Change Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all of your content from the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Delete Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-contributions" className="flex-1">
                    Contribution updates
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive updates about your contributions
                    </p>
                  </Label>
                  <Switch id="email-contributions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-mentions" className="flex-1">
                    Mentions
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive notifications when you're mentioned
                    </p>
                  </Label>
                  <Switch id="email-mentions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-newsletter" className="flex-1">
                    Newsletter
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive our monthly newsletter with updates
                    </p>
                  </Label>
                  <Switch id="email-newsletter" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-contributions" className="flex-1">
                    Contribution updates
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive updates about your contributions
                    </p>
                  </Label>
                  <Switch id="push-contributions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-mentions" className="flex-1">
                    Mentions
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive notifications when you're mentioned
                    </p>
                  </Label>
                  <Switch id="push-mentions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-messages" className="flex-1">
                    Direct messages
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive notifications for direct messages
                    </p>
                  </Label>
                  <Switch id="push-messages" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-mentorship" className="flex-1">
                    Mentorship requests
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive notifications for mentorship requests
                    </p>
                  </Label>
                  <Switch id="push-mentorship" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-newsletter" className="flex-1">
                    Newsletter
                    <p className="text-sm font-normal text-muted-foreground">
                      Receive our monthly newsletter with updates
                    </p>
                  </Label>
                  <Switch id="push-newsletter" />  
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect your account with third-party services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" defaultValue="johndoe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue="@johndoe" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Apps</CardTitle>
              <CardDescription>Manage your connected applications and their permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* List of connected apps */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>API Tokens</CardTitle>
              <CardDescription>Manage your API tokens for third-party integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* List of API tokens */}
            </CardContent>
            <CardFooter>
              <Button>Generate New Token</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

export default SettingsPage;