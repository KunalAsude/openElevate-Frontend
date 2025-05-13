import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectCard } from "@/components/projects/project-card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const myProjects = [
    {
      id: 1,
      title: "React Component Library",
      description: "A collection of reusable React components with TypeScript support.",
      tags: ["React", "TypeScript", "UI"],
      contributions: 8,
    },
    {
      id: 2,
      title: "Node.js API Framework",
      description: "Lightweight framework for building scalable Node.js APIs.",
      tags: ["Node.js", "JavaScript", "API"],
      contributions: 5,
    },
    {
      id: 3,
      title: "CSS Animation Library",
      description: "Pure CSS animations for modern web applications.",
      tags: ["CSS", "Animation", "Frontend"],
      contributions: 3,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage your projects and contributions.">
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </DashboardHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="my-projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="contributed">Contributed</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                contributions={project.contributions}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="contributed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects You've Contributed To</CardTitle>
              <CardDescription>View all projects you've made contributions to.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myProjects.slice(0, 2).map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    contributions={project.contributions}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="starred" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Starred Projects</CardTitle>
              <CardDescription>Projects you've starred for later reference.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myProjects.slice(1, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    contributions={project.contributions}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
