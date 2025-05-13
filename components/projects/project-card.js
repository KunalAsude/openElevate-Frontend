import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitPullRequest } from "lucide-react"

export function ProjectCard({ title, description, tags, contributions }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <GitPullRequest className="mr-1 h-4 w-4" />
          <span>{contributions} contributions</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-2 text-muted-foreground">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/projects/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
