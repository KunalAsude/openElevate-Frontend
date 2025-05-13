import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GitPullRequest, MessageSquare, Star } from "lucide-react"

export function ActivityFeed({ extended = false }) {
  const activities = [
    {
      id: 1,
      type: "contribution",
      project: "React Component Library",
      time: "2 hours ago",
      icon: GitPullRequest,
      description: "Submitted a pull request",
    },
    {
      id: 2,
      type: "comment",
      project: "Node.js API Framework",
      time: "5 hours ago",
      icon: MessageSquare,
      description: "Commented on an issue",
    },
    {
      id: 3,
      type: "star",
      project: "CSS Animation Library",
      time: "1 day ago",
      icon: Star,
      description: "Starred a project",
    },
    {
      id: 4,
      type: "contribution",
      project: "TypeScript Utility Functions",
      time: "2 days ago",
      icon: GitPullRequest,
      description: "Submitted a pull request",
    },
    {
      id: 5,
      type: "comment",
      project: "React Component Library",
      time: "3 days ago",
      icon: MessageSquare,
      description: "Commented on a pull request",
    },
  ]

  const displayActivities = extended ? activities : activities.slice(0, 3)

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Activity" />
            <AvatarFallback>
              <activity.icon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{activity.description}</p>
            <p className="text-sm text-muted-foreground">{activity.project}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
