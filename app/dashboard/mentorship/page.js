import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MentorCard } from "@/components/mentorship/mentor-card"
import { SessionCard } from "@/components/mentorship/session-card"
import { CalendarDays, Plus } from "lucide-react"
import Link from "next/link"

export default function MentorshipPage() {
  const mentors = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Senior Frontend Developer",
      company: "TechCorp",
      skills: ["React", "TypeScript", "CSS"],
      availability: "2-4 hours/week",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "DevHub",
      skills: ["Node.js", "React", "MongoDB"],
      availability: "1-2 hours/week",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Miguel Rodriguez",
      role: "Backend Developer",
      company: "CodeLabs",
      skills: ["Python", "Django", "PostgreSQL"],
      availability: "3-5 hours/week",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const sessions = [
    {
      id: 1,
      mentor: "Alex Johnson",
      date: "2023-06-15",
      time: "14:00 - 15:00",
      topic: "React Component Architecture",
      status: "upcoming",
    },
    {
      id: 2,
      mentor: "Sarah Chen",
      date: "2023-06-10",
      time: "10:00 - 11:00",
      topic: "Building RESTful APIs with Node.js",
      status: "completed",
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Mentorship" text="Connect with mentors and schedule sessions.">
        <Button asChild>
          <Link href="/mentorship/apply">
            <Plus className="mr-2 h-4 w-4" /> Apply as Mentor
          </Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="find-mentors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="find-mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="find-mentors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Mentors</CardTitle>
              <CardDescription>Connect with experienced developers who can guide you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Mentors
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="my-sessions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled mentorship sessions.</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendar View
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions
                  .filter((session) => session.status === "upcoming")
                  .map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                {sessions.filter((session) => session.status === "upcoming").length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No upcoming sessions</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don&apos;t have any scheduled mentorship sessions.
                    </p>
                    <Button className="mt-4">Schedule a Session</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Sessions</CardTitle>
              <CardDescription>Review your completed mentorship sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions
                  .filter((session) => session.status === "completed")
                  .map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
