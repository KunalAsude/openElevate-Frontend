import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitFork, Star, Github, Loader2 } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"
import { getAuthToken, loginWithGithub } from "@/lib/actions/auth-actions"

export function RecommendedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecommendedRepos = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        
        if (!token) {
          setLoading(false)
          return
        }

        const response = await axios.get(`${API_BASE_URL}/github/recommended`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data && response.data.repositories) {
          // Transform the repositories into our format
          const formattedProjects = response.data.repositories.map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'No description available',
            url: repo.html_url,
            tags: repo.topics || repo.languages || [],
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            difficulty: getDifficulty(repo.size, repo.stargazers_count)
          }))
          
          setProjects(formattedProjects)
        }
      } catch (error) {
        console.error('Error fetching recommended repos:', error)
        setError("Failed to load recommended projects")
        
        // If we can't get real recommendations, fall back to API-based recommendations
        try {
          // Try to fetch trending repositories as fallback
          const fallbackResponse = await axios.get('https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=3')
          
          if (fallbackResponse.data && fallbackResponse.data.items) {
            const fallbackProjects = fallbackResponse.data.items.map(repo => ({
              id: repo.id,
              title: repo.name,
              description: repo.description || 'No description available',
              url: repo.html_url,
              tags: repo.topics || [],
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              difficulty: getDifficulty(repo.size, repo.stargazers_count)
            }))
            
            setProjects(fallbackProjects)
            setError(null) // Clear error if fallback succeeds
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }
    
    // Helper function to determine project difficulty
    const getDifficulty = (size, stars) => {
      if (size > 10000 || stars > 5000) return "Advanced"
      if (size > 3000 || stars > 1000) return "Intermediate"
      return "Beginner"
    }
    
    fetchRecommendedRepos()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="flex items-center space-x-2">
                <div className="h-3 w-10 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-3 bg-muted rounded animate-pulse w-full mt-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/4 mt-1" />
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
        <Github className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">Couldn't load recommended projects</p>
          <p className="text-sm text-muted-foreground mt-1">Connect your GitHub account to see personalized project recommendations</p>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center rounded-lg border border-dashed">
        <Github className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">No projects found</p>
          <p className="text-sm text-muted-foreground mt-1">We couldn't find any recommended projects based on your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="flex flex-col space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{project.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3" />
                <span>{project.stars}</span>
              </div>
              <div className="flex items-center">
                <GitFork className="mr-1 h-3 w-3" />
                <span>{project.forks}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.length > 0 ? (
              project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              project.language && (
                <Badge variant="secondary" className="text-xs">
                  {project.language}
                </Badge>
              )
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline">{project.difficulty}</Badge>
            <Button asChild size="sm" variant="outline">
              <Link href={project.url} target="_blank" rel="noopener noreferrer">View</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
