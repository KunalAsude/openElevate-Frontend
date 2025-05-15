"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectCard } from "@/components/projects/project-card"
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper"
import { Plus, Search, Loader2, Github } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"

function ProjectsContent() {
  const [myProjects, setMyProjects] = useState([])
  const [contributedProjects, setContributedProjects] = useState([])
  const [starredProjects, setStarredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('authToken')
        if (!token) {
          setLoading(false)
          return
        }

        // Fetch repositories
        const response = await axios.get(`${API_BASE_URL}/github/repositories`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data) {
          // Separate repositories into different categories
          const owned = (response.data.ownedRepos || []).map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'No description available',
            url: repo.html_url,
            tags: repo.topics || [repo.language].filter(Boolean),
            contributions: repo.contributions_count || 0,
            stars: repo.stargazers_count,
            language: repo.language
          }))

          const contributed = (response.data.contributedRepos || []).map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'No description available',
            url: repo.html_url,
            tags: repo.topics || [repo.language].filter(Boolean),
            contributions: repo.contributions_count || 0,
            stars: repo.stargazers_count,
            language: repo.language
          }))

          const starred = (response.data.starredRepos || []).map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'No description available',
            url: repo.html_url,
            tags: repo.topics || [repo.language].filter(Boolean),
            contributions: repo.contributions_count || 0,
            stars: repo.stargazers_count,
            language: repo.language
          }))

          setMyProjects(owned)
          setContributedProjects(contributed)
          setStarredProjects(starred)
        }
      } catch (error) {
        console.error('Error fetching GitHub projects:', error)
        setError("Failed to load GitHub projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search query
  const filterProjects = (projects) => {
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  const filteredMyProjects = filterProjects(myProjects)
  const filteredContributedProjects = filterProjects(contributedProjects)
  const filteredStarredProjects = filterProjects(starredProjects)

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Projects" text="Manage your projects and contributions." />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your GitHub projects...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Projects" text="Manage your projects and contributions." />
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
            <Github className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">Could not load your GitHub projects</p>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage your projects and contributions.">
        <Button asChild>
          <Link href="https://github.com/new" target="_blank" rel="noopener noreferrer">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </DashboardHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search projects..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="my-projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="contributed">Contributed</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects" className="space-y-4">
          {filteredMyProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMyProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  contributions={project.contributions}
                  url={project.url}
                  stars={project.stars}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
              <Github className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">No personal projects found</p>
                <p className="text-sm text-muted-foreground mt-1">Create a new project on GitHub to see it here</p>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="contributed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects You&apos;ve Contributed To</CardTitle>
              <CardDescription>View all projects you&apos;ve made contributions to.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredContributedProjects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredContributedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      title={project.title}
                      description={project.description}
                      tags={project.tags}
                      contributions={project.contributions}
                      url={project.url}
                      stars={project.stars}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
                  <Github className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">No contributed projects found</p>
                    <p className="text-sm text-muted-foreground mt-1">Your contributions to other repositories will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="starred" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Starred Projects</CardTitle>
              <CardDescription>Projects you&apos;ve starred for later reference.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredStarredProjects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredStarredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      title={project.title}
                      description={project.description}
                      tags={project.tags}
                      contributions={project.contributions}
                      url={project.url}
                      stars={project.stars}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
                  <Github className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">No starred projects found</p>
                    <p className="text-sm text-muted-foreground mt-1">Star repositories on GitHub to see them here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

export default function ProjectsPage() {
  return (
    <GitHubProtectionWrapper>
      <ProjectsContent />
    </GitHubProtectionWrapper>
  )
}
