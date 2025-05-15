"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDebounceValue } from "@/lib/hooks/use-debounce"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, SlidersHorizontal } from "lucide-react"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { fetchTrendingProjects, fetchRecommendedProjects, searchProjects } from "@/lib/services/project-service"

// Import project components
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectFilters } from "@/components/projects/project-filters"
import { ProjectsSidebar } from "@/components/projects/projects-sidebar"

// Skeleton for loading projects
function ProjectCardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div className="flex items-start space-x-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-12 w-full mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-3 mb-4">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}

function ProjectsContentInner() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [recommendedProjects, setRecommendedProjects] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Default to collapsed
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    language: searchParams.get("language") || "",
    minStars: Number(searchParams.get("minStars") || 0),
    maxIssues: Number(searchParams.get("maxIssues") || 0),
    topics: searchParams.get("topics")?.split(",") || [],
    issueLabels: searchParams.get("issueLabels")?.split(",") || [],
  })

  const [searchQuery, setSearchQuery] = useState(filters.query)
  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500)
  const [currentUser, setCurrentUser] = useState(null)

  // Load projects based on current filters
  const loadProjects = useCallback(async () => {
    setIsLoading(true)

    try {
      let projectData

      if (debouncedSearchQuery) {
        // Search with filters
        projectData = await searchProjects(debouncedSearchQuery, {
          language: filters.language,
          minStars: filters.minStars,
          maxIssues: filters.maxIssues,
        })
      } else {
        // Get trending projects
        projectData = await fetchTrendingProjects(filters.language)
      }

      setProjects(projectData)
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearchQuery, filters])

  // Load recommended projects for the user
  const loadRecommendedProjects = useCallback(async (userId) => {
    try {
      const recommendations = await fetchRecommendedProjects(userId)
      setRecommendedProjects(recommendations)
    } catch (error) {
      console.error("Error loading recommended projects:", error)
      setRecommendedProjects([])
    }
  }, [])

  // Check if user is logged in to show personalized recommendations
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)

      if (user) {
        loadRecommendedProjects(user.id)
      }
    }

    fetchUser()
    // Initial data loading
    loadProjects()
  }, [loadProjects, loadRecommendedProjects])

  // Reload projects when filters or search query change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      loadProjects()
    }
  }, [debouncedSearchQuery, filters, loadProjects])

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
    if (newFilters.query !== undefined) {
      setSearchQuery(newFilters.query)
    }
  }

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Desktop filter sidebar - styled like vertical navigation */}
      <ProjectsSidebar searchParams={searchParams} />


      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Open Source Projects</h1>
              <p className="text-muted-foreground text-sm">
                Discover and contribute to open source projects that match your skills
              </p>
            </div>

            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <div className="h-full overflow-y-auto py-4 px-1">
                  <ProjectFilters onFilterChange={handleFilterChange} isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              {currentUser && recommendedProjects.length > 0 && (
                <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
              )}
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <ProjectCardSkeleton key={`skeleton-${i}`} />
                    ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <h3 className="text-lg font-medium">No projects found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
                </div>
              )}
            </TabsContent>

            {currentUser && (
              <TabsContent value="recommended" className="mt-6">
                {recommendedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendedProjects.map((project) => (
                      <ProjectCard key={project.id} {...project} isRecommended={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <h3 className="text-lg font-medium">No recommendations yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Complete your profile and add skills to get personalized recommendations
                    </p>
                  </div>
                )}
              </TabsContent>
            )}

            <TabsContent value="trending" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <ProjectCardSkeleton key={`trending-skeleton-${i}`} />
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects
                    .sort((a, b) => b.stars - a.stars)
                    .slice(0, 6)
                    .map((project) => (
                      <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <ProjectCardSkeleton key={`new-skeleton-${i}`} />
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6)
                    .map((project) => (
                      <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Main content wrapper with suspense
function ProjectsContent() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    }>
      <ProjectsContentInner />
    </Suspense>
  )
}

// The main client component
export default function ProjectsClient() {
  return <ProjectsContent />
}
