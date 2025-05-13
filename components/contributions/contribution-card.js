import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitPullRequest, AlertCircle, Calendar } from "lucide-react"



export function ContributionCard({ contribution }) {
  const statusColors = {
    open: "bg-accent text-accent-foreground",
    merged: "bg-primary text-primary-foreground",
    closed: "bg-muted text-muted-foreground",
  }

  const typeIcons = {
    "pull-request": <GitPullRequest className="h-4 w-4" />,
    issue: <AlertCircle className="h-4 w-4" />,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-1">
            {typeIcons[contribution.type]}
            {contribution.type === "pull-request" ? "Pull Request" : "Issue"}
          </Badge>
          <Badge className={statusColors[contribution.status]}>
            {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
          </Badge>
        </div>
        <CardTitle className="text-lg">{contribution.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Project: {contribution.project}</span>
          <div className="ml-auto flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{contribution.date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/contributions/${contribution.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
