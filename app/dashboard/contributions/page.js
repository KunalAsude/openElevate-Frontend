"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContributionCard } from "@/components/contributions/contribution-card"
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper"
import { Search, Loader2, Github } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"

function ContributionsContent() {
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('authToken')
        if (!token) {
          setLoading(false)
          return
        }

        const response = await axios.get(`${API_BASE_URL}/github/contributions`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data) {
          // Transform GitHub PRs and issues into our format
          const prs = (response.data.pullRequests || []).map(pr => ({
            id: pr.id,
            title: pr.title,
            project: pr.repository.name,
            status: pr.state.toLowerCase(),
            date: new Date(pr.createdAt).toISOString().split('T')[0],
            type: "pull-request",
            url: pr.url
          }))

          const issues = (response.data.issues || []).map(issue => ({
            id: issue.id,
            title: issue.title,
            project: issue.repository.name,
            status: issue.state.toLowerCase(),
            date: new Date(issue.createdAt).toISOString().split('T')[0],
            type: "issue",
            url: issue.url
          }))

          setContributions([...prs, ...issues].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          ))
        }
      } catch (error) {
        console.error('Error fetching contributions:', error)
        setError("Failed to load GitHub contributions")
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  // Filter contributions based on search query
  const filteredContributions = contributions.filter(contribution => 
    contribution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contribution.project.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Contributions" text="Track and manage your open source contributions." />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your GitHub contributions...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Contributions" text="Track and manage your open source contributions." />
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
            <Github className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">Could not load your GitHub contributions</p>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Contributions" text="Track and manage your open source contributions." />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search contributions..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contributions</CardTitle>
              <CardDescription>View all your contributions across projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContributions.length > 0 ? (
                  filteredContributions.map((contribution) => (
                    <ContributionCard key={contribution.id} contribution={contribution} />
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No contributions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pull-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pull Requests</CardTitle>
              <CardDescription>View all your pull requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContributions
                  .filter((c) => c.type === "pull-request")
                  .length > 0 ? (
                    filteredContributions
                      .filter((c) => c.type === "pull-request")
                      .map((contribution) => (
                        <ContributionCard key={contribution.id} contribution={contribution} />
                      ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No pull requests found</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issues</CardTitle>
              <CardDescription>View all your reported issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredContributions
                  .filter((c) => c.type === "issue")
                  .length > 0 ? (
                    filteredContributions
                      .filter((c) => c.type === "issue")
                      .map((contribution) => (
                        <ContributionCard key={contribution.id} contribution={contribution} />
                      ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No issues found</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

export default function ContributionsPage() {
  return (
    <GitHubProtectionWrapper>
      <ContributionsContent />
    </GitHubProtectionWrapper>
  )
}
