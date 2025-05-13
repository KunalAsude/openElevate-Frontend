import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContributionCard } from "@/components/contributions/contribution-card"
import { Search } from "lucide-react"

export default function ContributionsPage() {
  const contributions = [
    {
      id: 1,
      title: "Fix button component styling",
      project: "React Component Library",
      status: "merged",
      date: "2023-05-15",
      type: "pull-request",
    },
    {
      id: 2,
      title: "Add TypeScript types for API responses",
      project: "Node.js API Framework",
      status: "open",
      date: "2023-05-10",
      type: "pull-request",
    },
    {
      id: 3,
      title: "Documentation update for animation modules",
      project: "CSS Animation Library",
      status: "merged",
      date: "2023-05-05",
      type: "pull-request",
    },
    {
      id: 4,
      title: "Bug in dropdown component",
      project: "React Component Library",
      status: "open",
      date: "2023-05-02",
      type: "issue",
    },
    {
      id: 5,
      title: "Performance optimization for large datasets",
      project: "Node.js API Framework",
      status: "closed",
      date: "2023-04-28",
      type: "issue",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Contributions" text="Track and manage your open source contributions." />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search contributions..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contributions</CardTitle>
              <CardDescription>View all your contributions across projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributions.map((contribution) => (
                  <ContributionCard key={contribution.id} contribution={contribution} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pull-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pull Requests</CardTitle>
              <CardDescription>View all your pull requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributions
                  .filter((c) => c.type === "pull-request")
                  .map((contribution) => (
                    <ContributionCard key={contribution.id} contribution={contribution} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issues</CardTitle>
              <CardDescription>View all your reported issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributions
                  .filter((c) => c.type === "issue")
                  .map((contribution) => (
                    <ContributionCard key={contribution.id} contribution={contribution} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
