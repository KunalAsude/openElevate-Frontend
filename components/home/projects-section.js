import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star } from "lucide-react"

export function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "React Component Library",
      description: "A collection of reusable React components with TypeScript support.",
      tags: ["React", "TypeScript", "UI"],
      stars: 1245,
      forks: 234,
      difficulty: "Intermediate",
    },
    {
      id: 2,
      title: "Node.js API Framework",
      description: "Lightweight framework for building scalable Node.js APIs.",
      tags: ["Node.js", "JavaScript", "API"],
      stars: 876,
      forks: 123,
      difficulty: "Advanced",
    },
    {
      id: 3,
      title: "CSS Animation Library",
      description: "Pure CSS animations for modern web applications.",
      tags: ["CSS", "Animation", "Frontend"],
      stars: 543,
      forks: 87,
      difficulty: "Beginner",
    },
  ]

  return (
    <section className="bg-muted/30 py-16 md:py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-[800px] text-center">
          <Badge className="mb-4" variant="outline">
            Featured Projects
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Discover Open Source Projects</h2>
          <p className="mb-12 text-xl text-muted-foreground">
            Find projects that match your skills and interests, and start contributing today.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{project.difficulty}</Badge>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center">
                      <GitFork className="mr-1 h-4 w-4" />
                      <span>{project.forks}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-3">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild className="w-full">
                  <Link href={`/projects/${project.id}`}>View Project</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
