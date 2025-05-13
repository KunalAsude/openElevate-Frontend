import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BadgeCard } from "@/components/badges/badge-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function BadgesPage() {
  const earnedBadges = [
    {
      id: 1,
      name: "First Contribution",
      description: "Made your first contribution to an open source project",
      icon: "🚀",
      earned: "2023-04-15",
      rarity: "common",
    },
    {
      id: 2,
      name: "Code Reviewer",
      description: "Reviewed 10 pull requests",
      icon: "🔍",
      earned: "2023-05-20",
      rarity: "uncommon",
    },
    {
      id: 3,
      name: "Bug Hunter",
      description: "Found and fixed 5 bugs",
      icon: "🐛",
      earned: "2023-06-10",
      rarity: "uncommon",
    },
    {
      id: 4,
      name: "Documentation Wizard",
      description: "Improved documentation in 3 projects",
      icon: "📚",
      earned: "2023-07-05",
      rarity: "rare",
    },
  ]

  const inProgressBadges = [
    {
      id: 5,
      name: "Open Source Advocate",
      description: "Contribute to 10 different projects",
      icon: "🌟",
      progress: 70,
      rarity: "epic",
    },
    {
      id: 6,
      name: "Mentor",
      description: "Help 5 new contributors with their first PR",
      icon: "👨‍🏫",
      progress: 40,
      rarity: "rare",
    },
    {
      id: 7,
      name: "Project Maintainer",
      description: "Maintain an open source project with 100+ stars",
      icon: "👑",
      progress: 25,
      rarity: "legendary",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Badges" text="Track your achievements and showcase your skills." />

      <Card>
        <CardHeader>
          <CardTitle>Badge Progress</CardTitle>
          <CardDescription>Your overall badge collection progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Badges Earned</span>
              <span className="text-sm text-muted-foreground">
                {earnedBadges.length} / {earnedBadges.length + inProgressBadges.length}
              </span>
            </div>
            <Progress value={(earnedBadges.length / (earnedBadges.length + inProgressBadges.length)) * 100} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earned">Earned Badges</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="earned" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgressBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
