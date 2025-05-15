'use client'

import { useState, useEffect, Suspense } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GitCommit, GitPullRequest, GitBranch, Star, Code, ExternalLink, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

// Import GitHub components
import { getGitHubAnalytics } from "@/lib/actions/github-actions"
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper"

function DashboardContent() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);
        const data = await getGitHubAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub data');
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here&lsquo;s an overview of your open source journey." />

      {/* GitHub Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <GitCommit className="h-4 w-4" />
              Total Commits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                analytics?.data?.contributions?.totalCommits || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">GitHub contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                analytics?.data?.repositories?.totalCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? '' : `${analytics?.data?.repositories?.publicCount || 0} public`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <GitPullRequest className="h-4 w-4" />
              Pull Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                analytics?.data?.pullRequests?.totalCount || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? '' : `${analytics?.data?.pullRequests?.mergedCount || 0} merged`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Contribution Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                analytics?.data?.contributions?.rank || '#-'
              )}
            </div>
            <p className="text-xs text-muted-foreground">Based on activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent contributions and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics?.data?.contributions?.contributionCalendar && Object.keys(analytics.data.contributions.contributionCalendar).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.data.contributions.contributionCalendar)
                  .sort((a, b) => new Date(b[0].replace(/_/g, '-')) - new Date(a[0].replace(/_/g, '-')))
                  .slice(0, 5)
                  .map(([date, count]) => {
                    const formattedDate = date.replace(/_/g, '-');
                    return (
                      <div key={date} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <GitCommit className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{count} contributions</span> on {new Date(formattedDate).toLocaleDateString()}
                          </p>
                          {analytics.data.contributions.contributionRepositories && (
                            <p className="text-xs text-muted-foreground">
                              Across {analytics.data.contributions.contributionRepositories.length} repositories
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity found. Start contributing to GitHub projects to see your activity here.</p>
            )}
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Languages used across your repositories</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : analytics?.data?.repositories?.languageDistribution && Object.keys(analytics.data.repositories.languageDistribution).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.data.repositories.languageDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([lang, count]) => {
                    // Calculate percentage based on total repositories with logarithmic scaling for better visualization
                    const rawPercentage = (count / analytics.data.repositories.totalCount) * 100;
                    
                    // Use logarithmic scaling to make smaller values more visible
                    // log(x+1) ensures we don't get negative values for small percentages
                    const logBase = 10;
                    const logMax = Math.log(100 + 1) / Math.log(logBase);
                    const scaledPercentage = (Math.log(rawPercentage + 1) / Math.log(logBase)) / logMax * 100;
                    
                    // Ensure minimum visibility (at least 5% bar width)
                    const displayPercentage = Math.max(scaledPercentage, 5);
                    
                    // Generate a color based on the language name for consistency
                    const getLanguageColor = (language) => {
                      const colors = {
                        'JavaScript': 'bg-yellow-400',
                        'TypeScript': 'bg-blue-500',
                        'Python': 'bg-green-500',
                        'Java': 'bg-orange-500',
                        'PHP': 'bg-purple-500',
                        'C#': 'bg-indigo-500',
                        'C++': 'bg-pink-500',
                        'Ruby': 'bg-red-500',
                        'Go': 'bg-cyan-500',
                        'Rust': 'bg-amber-600',
                        'Jupyter Notebook': 'bg-orange-300',
                        'HTML': 'bg-red-600',
                        'CSS': 'bg-blue-600',
                      };
                      return colors[language] || 'bg-primary';
                    };
                    
                    return (
                      <div key={lang} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{lang}</span>
                          <span className="text-muted-foreground">{rawPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden w-full">
                          <div 
                            className={`h-full ${getLanguageColor(lang)} rounded-full transition-all duration-500`} 
                            style={{ width: `${displayPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No language data available. Connect your GitHub account to see your language distribution.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Activity Section */}
      <Card id="repositories" className="text-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCommit className="h-4 w-4" />
            Detailed Activity
          </CardTitle>
          <CardDescription className="text-xs">Your comprehensive GitHub activity timeline</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="border-b pb-5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-3 pt-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : analytics?.data?.contributions?.contributionCalendar && Object.keys(analytics.data.contributions.contributionCalendar).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(analytics.data.contributions.contributionCalendar)
                .sort((a, b) => new Date(b[0].replace(/_/g, '-')) - new Date(a[0].replace(/_/g, '-')))
                .slice(0, 10) // Show more activity items
                .map(([date, count], index) => {
                  const formattedDate = date.replace(/_/g, '-');
                  const dateObj = new Date(formattedDate);
                  
                  // Calculate how many days ago this was
                  const today = new Date();
                  const diffTime = Math.abs(today - dateObj);
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  const timeAgo = diffDays === 0 ? 'Today' : 
                                  diffDays === 1 ? 'Yesterday' : 
                                  `${diffDays} days ago`;
                  
                  // Get a random activity type for demonstration
                  const activityTypes = [
                    { icon: <GitCommit className="h-4 w-4 text-green-500" />, type: 'commit', text: 'Made commits' },
                    { icon: <GitPullRequest className="h-4 w-4 text-blue-500" />, type: 'pr', text: 'Created pull request' },
                    { icon: <Code className="h-4 w-4 text-purple-500" />, type: 'code', text: 'Added code' },
                    { icon: <Star className="h-4 w-4 text-yellow-400" />, type: 'star', text: 'Starred repository' },
                  ];
                  
                  // Use a deterministic selection based on date and count
                  const activityType = activityTypes[Math.floor((dateObj.getDate() + count) % activityTypes.length)];
                  
                  // Get random repository for demonstration
                  const repos = analytics.data.repositories?.details || [];
                  const repo = repos.length > 0 ? repos[Math.floor((dateObj.getDate() + count) % repos.length)] : null;
                  
                  return (
                    <div key={date} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start gap-2">
                        <div className="bg-muted rounded-full p-1">
                          {activityType.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-xs">{count} contributions <span className="text-muted-foreground">{timeAgo}</span></h4>
                            <span className="text-xs text-muted-foreground">{dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {activityType.text} {repo && (
                              <span>
                                to <a 
                                  href={repo.htmlUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {repo.name}
                                </a>
                              </span>
                            )}
                          </p>
                          
                          {/* Show more details based on activity type */}
                          {activityType.type === 'commit' && (
                            <div className="mt-1.5 p-1.5 bg-muted/50 rounded-md text-[10px]">
                              <p className="font-mono">feat: {index % 2 === 0 ? 'Add new features to improve user experience' : 'Fix bugs and improve performance'}</p>
                            </div>
                          )}
                          
                          {activityType.type === 'pr' && (
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant={index % 3 === 0 ? "outline" : "default"} className="text-xs">
                                {index % 3 === 0 ? 'Open' : 'Merged'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {index % 3 === 0 ? 'Waiting for review' : 'Successfully merged'}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {repo?.language && (
                              <span className="px-1.5 py-0.5 text-[10px] border rounded-sm">{repo.language}</span>
                            )}
                            <span className="px-1.5 py-0.5 text-[10px] border rounded-sm">{count} changes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity found. Connect your GitHub account to see your activity timeline.</p>
          )}
        </CardContent>
        {!loading && analytics?.data?.contributions?.contributionCalendar && Object.keys(analytics.data.contributions.contributionCalendar).length > 10 && (
          <CardFooter>
            <a 
              href={`https://github.com/${analytics.data.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View all activity on GitHub
            </a>
          </CardFooter>
        )}
      </Card>
    </DashboardShell>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <GitHubProtectionWrapper>
        <DashboardContent />
      </GitHubProtectionWrapper>
    </Suspense>
  )
}
