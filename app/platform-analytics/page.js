"use client"

import { useState, useEffect } from "react"
import { BarChart2, Users, GitPullRequest, Award, Code, Globe, RefreshCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/analytics/stat-card"
import { ChartCard } from "@/components/analytics/chart-card"
import { AnalyticsService } from "@/lib/services/analytics-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PlatformAnalyticsPage() {
  const [platformData, setPlatformData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data for platform analytics
  const mockPlatformData = {
    regions: {
      topCountries: [
        { name: "United States", value: 3200 },
        { name: "India", value: 1850 },
        { name: "Germany", value: 950 },
        { name: "United Kingdom", value: 850 },
        { name: "Canada", value: 680 },
        { name: "Brazil", value: 620 },
        { name: "China", value: 580 },
        { name: "France", value: 520 },
        { name: "Australia", value: 480 },
        { name: "Japan", value: 420 }
      ],
      regionalActivity: [
        { name: "Jan", North_America: 1800, Europe: 1250, Asia: 950, Other: 350 },
        { name: "Feb", North_America: 1950, Europe: 1350, Asia: 1050, Other: 420 },
        { name: "Mar", North_America: 2100, Europe: 1480, Asia: 1150, Other: 450 },
        { name: "Apr", North_America: 2250, Europe: 1580, Asia: 1250, Other: 520 },
        { name: "May", North_America: 2400, Europe: 1680, Asia: 1380, Other: 580 },
        { name: "Jun", North_America: 2550, Europe: 1780, Asia: 1480, Other: 620 }
      ],
      growthByRegion: [
        { region: "North America", growth: 18, users: 4800 },
        { region: "Europe", growth: 22, users: 3450 },
        { region: "Asia", growth: 35, users: 2650 },
        { region: "South America", growth: 28, users: 820 },
        { region: "Africa", growth: 42, users: 480 },
        { region: "Oceania", growth: 15, users: 300 }
      ]
    },
    users: {
      total: 1245,
      active: 842,
      newThisMonth: 143,
      growth: 12.5,
      byCountry: [
        { name: "United States", value: 342 },
        { name: "India", value: 287 },
        { name: "Germany", value: 156 },
        { name: "United Kingdom", value: 132 },
        { name: "Canada", value: 98 },
        { name: "Other", value: 230 }
      ]
    },
    projects: {
      total: 356,
      public: 278,
      private: 78,
      newThisMonth: 42,
      byLanguage: [
        { name: "JavaScript", value: 124 },
        { name: "Python", value: 98 },
        { name: "TypeScript", value: 76 },
        { name: "Java", value: 45 },
        { name: "Go", value: 39 },
        { name: "Other", value: 64 }
      ]
    },
    contributions: {
      total: 12457,
      thisMonth: 1243,
      lastMonth: 987,
      change: 25.9,
      byType: [
        { name: "Code Commits", value: 45 },
        { name: "Pull Requests", value: 28 },
        { name: "Issues", value: 17 },
        { name: "Code Reviews", value: 10 }
      ]
    },
    badges: {
      total: 1245,
      awardedThisMonth: 143,
      mostCommon: [
        { name: "First PR", value: 342 },
        { name: "Bug Hunter", value: 287 },
        { name: "Code Reviewer", value: 156 },
        { name: "Mentor", value: 132 },
        { name: "Documentation", value: 98 },
        { name: "Other", value: 230 }
      ]
    },
    activity: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 100) + 50
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        week: i + 1,
        commits: Math.floor(Math.random() * 500) + 200,
        prs: Math.floor(Math.random() * 150) + 50,
        issues: Math.floor(Math.random() * 100) + 30
      }))
    }
  };

  // Load platform analytics data
  const [usingMockData, setUsingMockData] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch real data first
        const data = await AnalyticsService.getPlatformMetrics();
        setPlatformData(data);
        setUsingMockData(false);
      } catch (error) {
        console.warn("Using mock data for platform analytics. Backend not available:", error);
        setPlatformData(mockPlatformData);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  // Handle refresh analytics
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (!usingMockData) {
        try {
          // Only try to refresh if we're using real data
          await AnalyticsService.refreshAnalytics();
          const data = await AnalyticsService.getPlatformMetrics();
          setPlatformData(data);
          setUsingMockData(false);
        } catch (error) {
          if (error.message.includes('No authentication token') || error.response?.status === 401) {
            // If we get an auth error, switch to mock data and show a message
            console.warn("Authentication failed, switching to mock data");
            setPlatformData(mockPlatformData);
            setUsingMockData(true);
            // Optionally show a toast notification to the user
            // toast.error("Session expired. Using demo data. Please log in for real-time analytics.");
          } else {
            // For other errors, fall back to mock data
            console.warn("Error refreshing analytics, using mock data:", error);
            setPlatformData(mockPlatformData);
            setUsingMockData(true);
          }
        }
      } else {
        // If already using mock data, just simulate a refresh with new random data
        setPlatformData({
          ...mockPlatformData,
          activity: {
            daily: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              count: Math.floor(Math.random() * 100) + 50
            })),
            weekly: Array.from({ length: 12 }, (_, i) => ({
              week: i + 1,
              commits: Math.floor(Math.random() * 500) + 200,
              prs: Math.floor(Math.random() * 150) + 50,
              issues: Math.floor(Math.random() * 100) + 30
            }))
          }
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  if (loading || !platformData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading platform analytics...</p>
        </div>
      </div>
    )
  }
  
  // Ensure we have data before rendering
  if (!platformData.users || !platformData.projects || !platformData.contributions || !platformData.badges) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Failed to load analytics data</h2>
          <p className="text-muted-foreground">Please try refreshing the page or check your connection.</p>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </Button>
        </div>
      </div>
    )
  }

  // Use mock data if real data is not available
  const data = platformData || {
    users: {
      total: 12500,
      active: 8750,
      growth: "+12%"
    },
    projects: {
      total: 3200,
      active: 2800,
      growth: "+8%"
    },
    contributions: {
      total: 45800,
      monthly: 6500,
      growth: "+15%"
    },
    badges: {
      total: 28700,
      awarded: 2300,
      growth: "+10%"
    },
    activity: {
      monthly: [
        { name: "Jan", value: 4200 },
        { name: "Feb", value: 4800 },
        { name: "Mar", value: 5100 },
        { name: "Apr", value: 5800 },
        { name: "May", value: 6300 },
        { name: "Jun", value: 6500 }
      ],
      byType: [
        { name: "Pull Requests", value: 42 },
        { name: "Issues", value: 28 },
        { name: "Reviews", value: 18 },
        { name: "Comments", value: 12 }
      ]
    },
    languages: [
      { name: "JavaScript", value: 32 },
      { name: "Python", value: 24 },
      { name: "TypeScript", value: 18 },
      { name: "Java", value: 12 },
      { name: "Go", value: 8 },
      { name: "Other", value: 6 }
    ],
    geographic: {
      regions: [
        { name: "North America", value: 38 },
        { name: "Europe", value: 28 },
        { name: "Asia", value: 22 },
        { name: "South America", value: 6 },
        { name: "Africa", value: 4 },
        { name: "Oceania", value: 2 }
      ]
    },
    topProjects: [
      {
        name: "Web Framework",
        description: "Modern web framework for building applications",
        stars: 15200,
        contributors: 245,
        language: "TypeScript"
      },
      {
        name: "Data Processing Library",
        description: "Efficient data processing for big data",
        stars: 12800,
        contributors: 184,
        language: "Python"
      },
      {
        name: "Mobile SDK",
        description: "Cross-platform mobile development toolkit",
        stars: 9600,
        contributors: 152,
        language: "JavaScript"
      },
      {
        name: "API Gateway",
        description: "Scalable API gateway for microservices",
        stars: 8500,
        contributors: 126,
        language: "Go"
      }
    ]
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Mock Data Notification */}
      {usingMockData && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Demo Data</AlertTitle>
          <AlertDescription>
            The platform analytics are currently showing demo data. Connect to the backend to see real analytics.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground">
            Insights and metrics about the OpenElevate platform
            {usingMockData && ' (Demo Data)'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={platformData.users?.total?.toLocaleString() || '0'}
              description={`${platformData.users?.active?.toLocaleString() || '0'} active users`}
              icon={Users}
              change={data.users.growth}
              changeType="increase"
            />
            <StatCard
              title="Total Projects"
              value={platformData.projects?.total?.toLocaleString() || '0'}
              description={`${platformData.projects?.public?.toLocaleString() || '0'} public projects`}
              icon={Code}
              change={data.projects.growth}
              changeType="increase"
            />
            <StatCard
              title="Contributions"
              value={platformData.contributions?.total?.toLocaleString() || '0'}
              description={`${platformData.contributions?.thisMonth?.toLocaleString() || '0'} this month`}
              icon={GitPullRequest}
              change={data.contributions.growth}
              changeType="increase"
            />
            <StatCard
              title="Badges Awarded"
              value={platformData.badges?.total?.toLocaleString() || '0'}
              description={`${platformData.badges?.awardedThisMonth?.toLocaleString() || '0'} this month`}
              icon={Award}
              change={data.badges.growth}
              changeType="increase"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Platform Activity"
              description="Monthly contribution activity across the platform"
              type="area"
              data={data.activity.monthly}
            />
            
            <ChartCard
              title="Contribution Types"
              description="Breakdown of contribution types"
              type="pie"
              data={data.activity.byType}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Most Popular Languages"
              description="Languages used across projects"
              type="bar"
              data={data.languages}
            />
            
            <ChartCard
              title="Geographic Distribution"
              description="User distribution by region"
              type="pie"
              data={data.geographic.regions}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Projects</CardTitle>
              <CardDescription>Most popular projects on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProjects.map((project, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-4">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {project.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>⭐ {project.stars.toLocaleString()}</span>
                          <span>👥 {project.contributors.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {project.language}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ChartCard
              title="Project Growth"
              description="New projects over time"
              type="line"
              data={[
                { name: "Jan", value: 180 },
                { name: "Feb", value: 210 },
                { name: "Mar", value: 245 },
                { name: "Apr", value: 275 },
                { name: "May", value: 310 },
                { name: "Jun", value: 340 }
              ]}
            />
            
            <ChartCard
              title="Project Activity"
              description="Contributions per project category"
              type="bar"
              data={[
                { name: "Web", value: 1250 },
                { name: "Mobile", value: 850 },
                { name: "Data", value: 980 },
                { name: "DevOps", value: 720 },
                { name: "AI/ML", value: 1080 }
              ]}
            />
            
            <ChartCard
              title="Project Popularity"
              description="Distribution of stars across projects"
              type="pie"
              data={[
                { name: "1-10 stars", value: 45 },
                { name: "10-100 stars", value: 30 },
                { name: "100-1K stars", value: 18 },
                { name: "1K-10K stars", value: 5 },
                { name: "10K+ stars", value: 2 }
              ]}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects by Category</CardTitle>
              <CardDescription>Distribution of projects across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "Web Development", count: 1250, percentage: 38 },
                  { name: "Data Science", count: 850, percentage: 26 },
                  { name: "Mobile Development", count: 650, percentage: 20 },
                  { name: "DevOps & Infrastructure", count: 450, percentage: 16 }
                ].map((category, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{category.count.toLocaleString()} projects</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">{category.percentage}% of all projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ChartCard
              title="User Growth"
              description="New users over time"
              type="line"
              data={[
                { name: "Jan", value: 850 },
                { name: "Feb", value: 920 },
                { name: "Mar", value: 980 },
                { name: "Apr", value: 1050 },
                { name: "May", value: 1120 },
                { name: "Jun", value: 1200 }
              ]}
            />
            
            <ChartCard
              title="User Activity"
              description="User activity levels"
              type="pie"
              data={[
                { name: "Highly Active", value: 25 },
                { name: "Active", value: 45 },
                { name: "Occasional", value: 20 },
                { name: "Inactive", value: 10 }
              ]}
            />
            
            <ChartCard
              title="User Roles"
              description="User distribution by primary role"
              type="bar"
              data={[
                { name: "Developer", value: 65 },
                { name: "Designer", value: 12 },
                { name: "DevOps", value: 15 },
                { name: "Product", value: 8 }
              ]}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Experience Level</CardTitle>
                <CardDescription>Users by experience level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    { level: "Beginner", count: 3750, percentage: 30 },
                    { level: "Intermediate", count: 5000, percentage: 40 },
                    { level: "Advanced", count: 2500, percentage: 20 },
                    { level: "Expert", count: 1250, percentage: 10 }
                  ].map((level, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{level.level}</span>
                        <span className="text-sm text-muted-foreground">{level.count.toLocaleString()} users</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${level.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">{level.percentage}% of all users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Badge Distribution</CardTitle>
                <CardDescription>Users by badge achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartCard
                  title=""
                  description=""
                  type="bar"
                  data={[
                    { name: "0 badges", value: 3500 },
                    { name: "1-5 badges", value: 4800 },
                    { name: "6-10 badges", value: 2500 },
                    { name: "11-20 badges", value: 1200 },
                    { name: "21+ badges", value: 500 }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-4">
          {!platformData?.regions ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground">Loading geographic data...</p>
              </div>
            </div>
          ) : (
            <>
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Global Distribution</CardTitle>
                  <CardDescription>User distribution around the world</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center space-y-4">
                      <Globe className="h-16 w-16 mx-auto text-primary/50" />
                      <div>
                        <h3 className="text-lg font-medium">World Map Visualization</h3>
                        <p className="text-sm text-muted-foreground">
                          Interactive world map showing user distribution would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 md:grid-cols-2">
                <ChartCard
                  title="Top Countries"
                  description="Countries with most users"
                  type="bar"
                  data={platformData.regions?.topCountries || []}
                />
                
                <ChartCard
                  title="Regional Activity"
                  description="Contribution activity by region"
                  type="line"
                  data={platformData.regions?.regionalActivity || []}
                  categories={["North_America", "Europe", "Asia", "Other"]}
                />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Growth by Region</CardTitle>
                  <CardDescription>User growth rate by geographic region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {(platformData.regions?.growthByRegion || []).map((region, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{region.region}</p>
                          <p className="text-xs text-muted-foreground">{region.users.toLocaleString()} users</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-500">+{region.growth}% growth</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
