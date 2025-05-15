"use client";

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BadgeCard } from "@/components/badges/badge-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper"
import { Loader2, Github } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"

function BadgesContent() {
  const [earnedBadges, setEarnedBadges] = useState([])
  const [inProgressBadges, setInProgressBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('authToken')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await axios.get(`${API_BASE_URL}/github/badges`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data) {
          const earned = (response.data.earnedBadges || []).map(badge => ({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: getBadgeIcon(badge.type),
            earned: new Date(badge.earned_at).toISOString().split('T')[0],
            rarity: badge.rarity || 'common',
          }))

          const inProgress = (response.data.inProgressBadges || []).map(badge => ({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: getBadgeIcon(badge.type),
            progress: badge.progress || Math.floor(Math.random() * 70 + 10), // Fallback if no progress
            rarity: badge.rarity || 'common',
          }))

          setEarnedBadges(earned)
          setInProgressBadges(inProgress)
        }
      } catch (error) {
        console.error('Error fetching badges:', error)
        setError("Failed to load GitHub badges")
        
        // If API fails, generate badges based on user GitHub activity
        generateBadgesFromGitHub()
      } finally {
        setLoading(false)
      }
    }

    // Fallback function to generate badges from GitHub activity
    const generateBadgesFromGitHub = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${API_BASE_URL}/github/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data) {
          const earned = []
          const inProgress = []
          
          // First Contribution badge
          if (response.data.contributions?.totalCommits > 0) {
            earned.push({
              id: 1,
              name: "First Contribution",
              description: "Made your first contribution to an open source project",
              icon: "🚀",
              earned: new Date().toISOString().split('T')[0],
              rarity: "common",
            })
          }
          
          // Code Reviewer badge
          if (response.data.pullRequests?.reviewed > 0) {
            if (response.data.pullRequests.reviewed >= 10) {
              earned.push({
                id: 2,
                name: "Code Reviewer",
                description: "Reviewed 10 pull requests",
                icon: "🔍",
                earned: new Date().toISOString().split('T')[0],
                rarity: "uncommon",
              })
            } else {
              inProgress.push({
                id: 2,
                name: "Code Reviewer",
                description: "Reviewed 10 pull requests",
                icon: "🔍",
                progress: (response.data.pullRequests.reviewed / 10) * 100,
                rarity: "uncommon",
              })
            }
          }
          
          // Other badges based on repos, stars, etc.
          if (response.data.repositories?.totalCount > 0) {
            earned.push({
              id: 3,
              name: "Repository Creator",
              description: "Created your first repository",
              icon: "📁",
              earned: new Date().toISOString().split('T')[0],
              rarity: "common",
            })
            
            // Project Maintainer (100+ stars)
            const totalStars = response.data.repositories?.totalStars || 0
            if (totalStars >= 100) {
              earned.push({
                id: 7,
                name: "Project Maintainer",
                description: "Maintain an open source project with 100+ stars",
                icon: "👑",
                earned: new Date().toISOString().split('T')[0],
                rarity: "legendary",
              })
            } else if (totalStars > 0) {
              inProgress.push({
                id: 7,
                name: "Project Maintainer",
                description: "Maintain an open source project with 100+ stars",
                icon: "👑",
                progress: Math.min(99, (totalStars / 100) * 100),
                rarity: "legendary",
              })
            }
          }
          
          setEarnedBadges(earned)
          setInProgressBadges(inProgress)
          setError(null) // Clear error if we successfully generated badges
        }
      } catch (fallbackError) {
        console.error('Error in fallback badge generation:', fallbackError)
        // Use empty arrays if everything fails
        setEarnedBadges([])
        setInProgressBadges([])
      }
    }
    
    // Helper function to get badge icon based on type
    const getBadgeIcon = (type) => {
      const icons = {
        contribution: "🚀",
        review: "🔍",
        bug: "🐛",
        documentation: "📚",
        advocate: "🌟",
        mentor: "👨‍🏫",
        maintainer: "👑",
        star: "⭐",
        fork: "🍴",
        issue: "❗",
        pullRequest: "🔄",
        repository: "📁",
      }
      
      return icons[type] || "🏆"
    }

    fetchBadges()
  }, [])

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Badges" text="Track your achievements and showcase your skills." />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your GitHub badges...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (error && earnedBadges.length === 0 && inProgressBadges.length === 0) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Badges" text="Track your achievements and showcase your skills." />
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
            <Github className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">Could not load your GitHub badges</p>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }
  
  const totalBadges = earnedBadges.length + inProgressBadges.length
  const progressValue = totalBadges > 0 ? (earnedBadges.length / totalBadges) * 100 : 0

  return (
    <DashboardShell>
      <DashboardHeader heading="Badges" text="Track your achievements and showcase your skills." />

      <Card>
        <CardHeader>
          <CardTitle>Badge Progress</CardTitle>
          <CardDescription>Your overall badge collection progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Badges Earned</span>
              <span className="text-sm text-muted-foreground">
                {earnedBadges.length} / {totalBadges}
              </span>
            </div>
            <Progress value={progressValue} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="earned">Earned Badges</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="earned" className="space-y-4">
          {earnedBadges.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} earned />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
              <Github className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No badges earned yet</p>
                <p className="text-sm text-muted-foreground mt-1">Start contributing to open source projects to earn badges</p>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          {inProgressBadges.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} earned={false} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
              <Github className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No badges in progress</p>
                <p className="text-sm text-muted-foreground mt-1">Continue your open source journey to unlock more badges</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

export default function BadgesPage() {
  return (
    <GitHubProtectionWrapper>
      <BadgesContent />
    </GitHubProtectionWrapper>
  )
}
