import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitFork, Star } from "lucide-react"

export function RecommendedProjects() {
  const projects = [
    {
      id: 1,
      title: "GraphQL Client Library",
      description: "A lightweight GraphQL client with TypeScript support.",
      tags: ["GraphQL", "TypeScript", "API"],
      stars: 876,
      forks: 123,
      difficulty: "Intermediate",
    },
    {
      id: 2,
      title: "React State Management",
      description: "Simple and efficient state management for React applications.",
      tags: ["React", "State Management", "Frontend"],
      stars: 543,
      forks: 87,
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "WebAssembly Toolkit",
      description: "Tools for working with WebAssembly in JavaScript applications.",
      tags: ["WebAssembly", "JavaScript", "Tooling"],
      stars: 321,
      forks: 45,
      difficulty: "Advanced",
    },
  ]

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="flex flex-col space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{project.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3" />
                <span>{project.stars}</span>
              </div>
              <div className="flex items-center">
                <GitFork className="mr-1 h-3 w-3" />
                <span>{project.forks}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline">{project.difficulty}</Badge>
            <Button asChild size="sm" variant="outline">
              <Link href={`/projects/${project.id}`}>View</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
