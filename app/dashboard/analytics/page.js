"use client"

import { useState, useEffect } from "react"
import { BarChart2, Code, GitPullRequest, Award, Users, ArrowRight, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { StatCard } from "@/components/analytics/stat-card"
import { ChartCard } from "@/components/analytics/chart-card"
import { ActivityHeatmap } from "@/components/analytics/activity-heatmap"
import { AnalyticsService } from "@/lib/services/analytics-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analyticsData, setAnalyticsData] = useState({
    contributions: {
      total: 0,
      change: "0%",
      prStatus: [],
      prSize: [],
      reviews: []
    },
    repositories: {
      total: 0,
      change: "0",
      mostActive: [],
      stars: []
    },
    activity: []
  })

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch user analytics
      const userData = await AnalyticsService.getUserAnalytics(user?.id)
      
      // Fetch contribution metrics
      const contributionMetrics = await AnalyticsService.getContributionMetrics()
      
      // Update state with fetched data
      setAnalyticsData({
        contributions: {
          total: userData.totalContributions || 0,
          change: userData.contributionChange || "0%",
          prStatus: userData.prStatus || [],
          prSize: userData.prSize || [],
          reviews: userData.monthlyReviews || []
        },
        repositories: {
          total: userData.repoCount || 0,
          change: userData.repoChange || "0",
          mostActive: userData.mostActiveRepos || [],
          stars: userData.repoStars || []
        },
        activity: contributionMetrics.activity || []
      })
    } catch (err) {
      console.error('Failed to fetch analytics data:', err)
      setError('Failed to load analytics data. Please try again later.')
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchAnalyticsData()
    }
  }, [user?.id])

  const handleRefresh = () => {
    fetchAnalyticsData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchAnalyticsData} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your contributions and project metrics
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Activity Heatmap */}
      <ActivityHeatmap 
        data={analyticsData.activity} 
        title="Contribution Activity"
        description="Your contribution heatmap over time"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contributions"
          value={analyticsData.contributions.total}
          change={analyticsData.contributions.change}
          icon={Code}
        />
        <StatCard
          title="Pull Requests"
          value={analyticsData.contributions.prStatus.reduce((acc, curr) => acc + curr.value, 0)}
          change="+12%"
          icon={GitPullRequest}
        />
        <StatCard
          title="Repositories"
          value={analyticsData.repositories.total}
          change={analyticsData.repositories.change}
          icon={Code}
        />
        <StatCard
          title="Code Reviews"
          value={analyticsData.contributions.reviews.reduce((acc, curr) => acc + curr.value, 0)}
          change="+8%"
          icon={Award}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="prs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="reviews">Code Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="PR Status"
              description="Distribution of your pull requests by status"
              data={analyticsData.contributions.prStatus}
              type="pie"
            />
            <ChartCard
              title="PR Size"
              description="Distribution of your pull requests by size"
              data={analyticsData.contributions.prSize}
              type="bar"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="repos" className="space-y-4">
          <div className="grid gap-4">
            <ChartCard
              title="Most Active Repositories"
              description="Your most active repositories by contributions"
              data={analyticsData.repositories.mostActive}
              type="bar"
            />
            <ChartCard
              title="Repository Stars"
              description="Stars across your repositories"
              data={analyticsData.repositories.stars}
              type="line"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <ChartCard
            title="Monthly Code Reviews"
            description="Your code review activity over time"
            data={analyticsData.contributions.reviews}
            type="line"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
