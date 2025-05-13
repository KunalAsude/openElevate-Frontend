import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star } from "lucide-react"



export function ProjectGrid({ filter = "all" }) {
  // This would normally come from an API based on the filter
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
    {
      id: 4,
      title: "GraphQL Client Library",
      description: "A lightweight GraphQL client with TypeScript support.",
      tags: ["GraphQL", "TypeScript", "API"],
      stars: 876,
      forks: 123,
      difficulty: "Intermediate",
    },
    {
      id: 5,
      title: "React State Management",
      description: "Simple and efficient state management for React applications.",
      tags: ["React", "State Management", "Frontend"],
      stars: 543,
      forks: 87,
      difficulty: "Intermediate",
    },
    {
      id: 6,
      title: "WebAssembly Toolkit",
      description: "Tools for working with WebAssembly in JavaScript applications.",
      tags: ["WebAssembly", "JavaScript", "Tooling"],
      stars: 321,
      forks: 45,
      difficulty: "Advanced",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  )
}
