import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitPullRequest, Star, Trophy, Users, GitCommit, Code } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"
import { getAuthToken } from "@/lib/actions/auth-actions"

export function StatsCards({ userId = null }) {
  const [stats, setStats] = useState({
    totalCommits: 0,
    totalRepos: 0,
    totalStars: 0,
    contributionRank: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGitHubStats = async () => {
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
        
        if (response.data) {
          setStats({
            totalCommits: response.data.contributions?.totalCommits || 0,
            totalRepos: response.data.repositories?.totalCount || 0,
            totalStars: response.data.repositories?.totalStars || 0,
            contributionRank: response.data.rank || 0
          })
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error)
        setError("Failed to load GitHub statistics")
      } finally {
        setLoading(false)
      }
    }
    
    fetchGitHubStats()
  }, [userId])

  // Loading skeleton for stats cards
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCommits}</div>
          <p className="text-xs text-muted-foreground">GitHub contributions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Repositories</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRepos}</div>
          <p className="text-xs text-muted-foreground">Public repositories</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stars Earned</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStars}</div>
          <p className="text-xs text-muted-foreground">Across all repositories</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contribution Rank</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{stats.contributionRank || '-'}</div>
          <p className="text-xs text-muted-foreground">Based on activity</p>
        </CardContent>
      </Card>
    </div>
  )
}
