import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RecommendedProjects } from "@/components/dashboard/recommended-projects"
import { StatsCards } from "@/components/dashboard/stats-cards"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here&rsquos an overview of your open source journey." />

      <StatsCards />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recommended Projects</CardTitle>
                <CardDescription>Projects that match your skills and interests.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedProjects />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent contributions and interactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
              <CardDescription>Projects you&apos;ve contributed to or created.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You have no projects yet.</p>
              <Button className="mt-4">Create a Project</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Your complete activity history.</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed extended />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
