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
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Featured Projects</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover open source projects looking for contributors like you.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center">
                    <GitFork className="mr-1 h-4 w-4" />
                    <span>{project.forks}</span>
                  </div>
                  <Badge variant="outline">{project.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/projects/${project.id}`}>View Project</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
