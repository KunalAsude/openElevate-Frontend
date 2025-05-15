import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GitPullRequest, MessageSquare, Star, GitCommit, Code } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"
import { getAuthToken } from "@/lib/actions/auth-actions"

export function ActivityFeed({ extended = false, userId = null }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGitHubActivities = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        
        if (!token) {
          setLoading(false)
          return
        }

        const endpoint = userId 
          ? `${API_BASE_URL}/github/analytics/${userId}` 
          : `${API_BASE_URL}/github/analytics`
        
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data && response.data.recentActivity) {
          // Transform GitHub activities to match our format
          const formattedActivities = response.data.recentActivity.map((activity, index) => {
            let icon = GitCommit
            let description = "Committed changes"
            
            if (activity.type === "pr") {
              icon = GitPullRequest
              description = "Submitted a pull request"
            } else if (activity.type === "issue") {
              icon = MessageSquare
              description = "Opened an issue"
            } else if (activity.type === "star") {
              icon = Star
              description = "Starred a repository"
            }
            
            return {
              id: index,
              type: activity.type,
              project: activity.repo,
              time: new Date(activity.date).toLocaleString(),
              icon,
              description,
              title: activity.title || activity.message,
              url: activity.url
            }
          })
          
          setActivities(formattedActivities)
        }
      } catch (error) {
        console.error('Error fetching GitHub activities:', error)
        setError("Failed to load GitHub activities")
        
      } finally {
        setLoading(false)
      }
    }
    
    fetchGitHubActivities()
  }, [userId])

  const displayActivities = extended ? activities : activities.slice(0, 3)

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 w-full">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error && activities.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-sm mt-2">Connect your GitHub account to see your activity.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayActivities.length > 0 ? (
        displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Activity" />
              <AvatarFallback>
                <activity.icon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              {activity.url ? (
                <a 
                  href={activity.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium leading-none text-primary hover:underline"
                >
                  {activity.title || activity.description}
                </a>
              ) : (
                <p className="text-sm font-medium leading-none">{activity.description}</p>
              )}
              <p className="text-sm text-muted-foreground">{activity.project}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No recent activity found.</p>
      )}
    </div>
  )
}
