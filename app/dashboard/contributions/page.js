"use client";

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContributionCard } from "@/components/contributions/contribution-card"
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper"
import { Search, Loader2, Github, Filter, X, Code } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { searchProjects } from "@/lib/services/project-service"

function ContributionsContent() {
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [languageFilter, setLanguageFilter] = useState(null)
  const [languages, setLanguages] = useState([])
  const [loadingLanguages, setLoadingLanguages] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize filters from URL on first load
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['all', 'pull-requests', 'issues'].includes(tab)) {
      setActiveTab(tab)
    }
    
    const language = searchParams.get('language')
    if (language) {
      setLanguageFilter(language)
    }
    
    // This will trigger the data fetch via dependency array
  }, [])

  // Fetch available languages first
  useEffect(() => {
    async function fetchLanguages() {
      try {
        setLoadingLanguages(true)
        const token = localStorage.getItem('authToken')
        if (!token) return
        
        const response = await axios.get(`${API_BASE_URL}/github/languages`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data?.languages) {
          setLanguages(response.data.languages)
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
      } finally {
        setLoadingLanguages(false)
      }
    }
    
    fetchLanguages()
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (activeTab && activeTab !== 'all') {
      params.set('tab', activeTab)
    } else {
      params.delete('tab')
    }
    
    if (languageFilter) {
      params.set('language', languageFilter)
    } else {
      params.delete('language')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(newUrl, { scroll: false })
  }, [activeTab, languageFilter, router, searchParams])

  // Main function to fetch contributions with filters
  const fetchContributions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      if (!token) {
        setLoading(false)
        return
      }

      // Build query parameters for filtering
      let apiUrl = `${API_BASE_URL}/github/contributions`
      const queryParams = []
      
      if (activeTab === 'pull-requests') {
        queryParams.push('type=pr')
      } else if (activeTab === 'issues') {
        queryParams.push('type=issue')
      }
      
      if (languageFilter) {
        queryParams.push(`language=${encodeURIComponent(languageFilter)}`)
      }
      
      if (queryParams.length > 0) {
        apiUrl += `?${queryParams.join('&')}`
      }
      
      console.log('[OpenElevate] Fetching contributions with URL:', apiUrl)
      
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        // Transform GitHub PRs and issues into our format
        const prs = (response.data.pullRequests || []).map(pr => ({
          id: pr.id,
          title: pr.title,
          project: pr.repository.name,
          language: pr.repository.primaryLanguage?.name || 'Unknown',
          status: pr.state.toLowerCase(),
          date: new Date(pr.createdAt).toISOString().split('T')[0],
          type: "pull-request",
          url: pr.url
        }))

        const issues = (response.data.issues || []).map(issue => ({
          id: issue.id,
          title: issue.title,
          project: issue.repository.name,
          language: issue.repository.primaryLanguage?.name || 'Unknown',
          status: issue.state.toLowerCase(),
          date: new Date(issue.createdAt).toISOString().split('T')[0],
          type: "issue",
          url: issue.url
        }))

        const allContributions = [...prs, ...issues].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        )

        setContributions(allContributions)
      }
    } catch (error) {
      console.error('Error fetching contributions:', error)
      setError("Failed to load GitHub contributions")
    } finally {
      setLoading(false)
    }
  }

  // Only fetch data on initial load and tab changes
  // (Language filter handling is done directly in click handlers for immediate feedback)
  useEffect(() => {
    // Only refetch when tab changes, since language filter has its own handler
    if (!languageFilter) {
      fetchContributions();
    }
  }, [activeTab])

  // Client-side search filtering (only applies to already fetched data)
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
            <p className="text-sm text-muted-foreground">
              {languageFilter ? 
                `Loading contributions filtered by ${languageFilter}...` : 
                "Loading your GitHub contributions..."}
            </p>
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
            placeholder="Search within results..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="default" 
          onClick={async () => {
            console.log('⚡ APPLYING FILTERS - FORCE REFRESH');
            // Force clear any existing data
            setLoading(true);
            setContributions([]);
            setError(null);
            
            // Get all current params from URL
            const currentParams = Object.fromEntries(searchParams.entries());
            console.log('Current URL params:', currentParams);
            
            try {
              // Get current filters from URL
              const tabFilter = currentParams.tab || 'all';
              const langFilter = currentParams.language || null;
              
              // Set local filter state to match URL
              setActiveTab(tabFilter);
              setLanguageFilter(langFilter);
              
              // Build query based on current tab
              let query = '';
              if (tabFilter === 'pull-requests') {
                query = 'is:pr author:me';
              } else if (tabFilter === 'issues') {
                query = 'is:issue author:me';
              } else {
                // For 'all' tab we need to do separate queries
                const allResults = [];
                
                // First get pull requests
                console.log('Fetching PRs with filters:', langFilter ? { language: langFilter } : {});
                const prRepos = await searchProjects('is:pr author:me', 
                  langFilter ? { language: langFilter } : {});
                
                if (prRepos && prRepos.length > 0) {
                  console.log(`Found ${prRepos.length} PR results`);
                  const prs = prRepos.map(repo => ({
                    id: `pr-${repo.id}`,
                    title: repo.name,
                    project: repo.fullName?.split('/')[1] || repo.name,
                    language: repo.language || langFilter || 'Unknown',
                    status: 'open',
                    date: new Date(repo.createdAt).toISOString().split('T')[0],
                    type: 'pull-request',
                    url: repo.url
                  }));
                  allResults.push(...prs);
                }
                
                // Then get issues
                console.log('Fetching issues with filters:', langFilter ? { language: langFilter } : {});
                const issueRepos = await searchProjects('is:issue author:me', 
                  langFilter ? { language: langFilter } : {});
                
                if (issueRepos && issueRepos.length > 0) {
                  console.log(`Found ${issueRepos.length} issue results`);
                  const issues = issueRepos.map(repo => ({
                    id: `issue-${repo.id}`,
                    title: repo.name,
                    project: repo.fullName?.split('/')[1] || repo.name,
                    language: repo.language || langFilter || 'Unknown',
                    status: 'open',
                    date: new Date(repo.createdAt).toISOString().split('T')[0],
                    type: 'issue',
                    url: repo.url
                  }));
                  allResults.push(...issues);
                }
                
                // Sort and update state
                const sortedResults = allResults.sort((a, b) => new Date(b.date) - new Date(a.date));
                console.log(`Setting ${sortedResults.length} combined results`);
                setContributions(sortedResults);
                setLoading(false);
                return; // Early return since we've handled the 'all' tab case
              }
              
              // For single tab types (PR or Issues)
              console.log(`Making direct API call with query: ${query}`);
              console.log('Applied filters:', langFilter ? { language: langFilter } : {});
              
              // Fetch data from GitHub API directly
              const repos = await searchProjects(query, langFilter ? { language: langFilter } : {});
              console.log(`API returned ${repos?.length || 0} results`);
              
              if (!repos || repos.length === 0) {
                console.log('No results found, setting empty array');
                setContributions([]);
              } else {
                // Transform the results
                const results = repos.map(repo => ({
                  id: repo.id,
                  title: repo.name,
                  project: repo.fullName?.split('/')[1] || repo.name,
                  language: repo.language || langFilter || 'Unknown',
                  status: 'open',
                  date: new Date(repo.createdAt).toISOString().split('T')[0],
                  type: query.includes('pr') ? 'pull-request' : 'issue',
                  url: repo.url
                })).sort((a, b) => new Date(b.date) - new Date(a.date));
                
                console.log(`Setting ${results.length} results to state`);
                // Update state with filtered results
                setContributions(results);
              }
            } catch (error) {
              console.error('Error applying filters:', error);
              setError(`Failed to refresh data: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }}
        >
          Apply Filters
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2" disabled={loadingLanguages || languages.length === 0}>
              <Code className="h-4 w-4" /> 
              {loadingLanguages ? "Loading..." : languageFilter ? languageFilter : "Filter by Language"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
            {loadingLanguages ? (
              <div className="p-2 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                {languages.map(language => (
                  <DropdownMenuItem 
                    key={language} 
                    onClick={() => {
                      console.log('Setting language filter to:', language);
                      
                      // Update URL immediately without navigating
                      const params = new URLSearchParams(searchParams.toString());
                      if (activeTab !== 'all') {
                        params.set('tab', activeTab);
                      }
                      params.set('language', language);
                      const newUrl = `?${params.toString()}`;
                      router.push(newUrl, { scroll: false });
                      
                      // Just update state - don't make API call yet
                      setLanguageFilter(language);
                      console.log('Updated URL with language filter. Click Apply Filters to reload data.');
                    }}
                    className={languageFilter === language ? "bg-muted" : ""}
                  >
                    {language}
                  </DropdownMenuItem>
                ))}
                {languages.length === 0 && (
                  <DropdownMenuItem disabled>No languages available</DropdownMenuItem>
                )}
                {languageFilter && (
                  <DropdownMenuItem 
                    onClick={() => {
                      console.log('Clearing language filter');
                      
                      // Clear the language filter state
                      setLanguageFilter(null);
                      
                      // Update URL immediately without navigating
                      const params = new URLSearchParams(searchParams.toString());
                      if (activeTab !== 'all') {
                        params.set('tab', activeTab);
                      }
                      params.delete('language');
                      const newUrl = params.toString() ? `?${params.toString()}` : '';
                      router.push(newUrl, { scroll: false });
                    }}
                    className="text-destructive hover:text-destructive border-t mt-1 pt-1"
                  >
                    <X className="h-4 w-4 mr-2" /> Clear filter
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {languageFilter && (
        <div className="flex items-center mt-2">
          <span className="text-sm text-muted-foreground mr-2">Filtered by language:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Code className="h-3 w-3 mr-1" />
            {languageFilter}
            <button 
              onClick={() => {
                console.log('Clearing language filter from badge');
                
                // Just update the state and URL - don't make API call
                setLanguageFilter(null);
                
                // Update URL only
                const params = new URLSearchParams(searchParams.toString());
                if (activeTab !== 'all') {
                  params.set('tab', activeTab);
                }
                params.delete('language');
                const newUrl = params.toString() ? `?${params.toString()}` : '';
                router.push(newUrl, { scroll: false });
              }} 
              className="ml-1 rounded-full hover:bg-muted p-0.5"
              aria-label="Remove language filter"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        defaultValue="all" 
        className="space-y-4 mt-4">
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
