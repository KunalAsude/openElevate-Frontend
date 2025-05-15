import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCcw, GitCommit, GitPullRequest, Star, Code } from 'lucide-react';
import { loginWithGithub } from '@/lib/actions/auth-actions';

const GitHubAnalytics = ({ userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const endpoint = userId 
        ? `${API_BASE_URL}/github/analytics/${userId}`
        : `${API_BASE_URL}/github/analytics`;
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching GitHub analytics:', error);
      setError(error.response?.data?.message || 'Failed to load GitHub analytics');
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      await axios.post(`${API_BASE_URL}/github/analytics/refresh`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch updated analytics after refreshing
      await fetchAnalytics();
    } catch (error) {
      console.error('Error refreshing GitHub analytics:', error);
      setError(error.response?.data?.message || 'Failed to refresh GitHub analytics');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  if (error && error.includes('GitHub account not connected')) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={loginWithGithub} className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Connect with GitHub
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill().map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(5).fill().map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Alert>
        <AlertDescription>
          No GitHub analytics data available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        
        <Button 
          onClick={refreshAnalytics} 
          disabled={refreshing} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <GitCommit className="h-4 w-4" />
              Commits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.data?.contributions?.totalCommits || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <GitPullRequest className="h-4 w-4" />
              Pull Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.data?.pullRequests?.totalCount || 0}</div>
            {analytics.data?.pullRequests && (
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">{analytics.data.pullRequests.mergedCount} merged</span> · 
                <span className="text-blue-500">{analytics.data.pullRequests.openCount} open</span> · 
                <span>{analytics.data.pullRequests.closedCount} closed</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Code className="h-4 w-4" />
              Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.data?.repositories?.totalCount || 0}</div>
            {analytics.data?.repositories && (
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.data.repositories.publicCount} public · 
                {analytics.data.repositories.privateCount} private
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4" />
              Stars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.data?.repositories?.stargazersCount || 0}</div>
            {analytics.data?.stars && (
              <div className="text-xs text-muted-foreground mt-1">
                {analytics.data.stars.totalGiven} stars given
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Repositories */}
      {analytics.data?.repositories?.details && analytics.data.repositories.details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Repositories</CardTitle>
            <CardDescription>Your most starred and active repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.data.repositories.details.slice(0, 5).map((repo) => (
                <div key={repo.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <a 
                        href={repo.htmlUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold"
                      >
                        {repo.name}
                      </a>
                      {repo.visibility === 'private' && (
                        <span className="text-xs bg-muted py-0.5 px-2 rounded-full">Private</span>
                      )}
                      {repo.fork && (
                        <span className="text-xs bg-muted py-0.5 px-2 rounded-full ml-1">Fork</span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <span className="block w-2 h-2 rounded-full bg-primary" />
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{repo.stargazersCount}</span>
                      </div>
                      {repo.forksCount > 0 && (
                        <div className="flex items-center gap-1">
                          <GitPullRequest className="h-3 w-3" />
                          <span>{repo.forksCount}</span>
                        </div>
                      )}
                      <div>
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {analytics.data.repositories.details.length > 5 && (
                <div className="text-center pt-2">
                  <a 
                    href={`https://github.com/${analytics.data.username}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View all {analytics.data.repositories.totalCount} repositories
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Language Distribution */}
      {analytics.data?.repositories?.languageDistribution && Object.keys(analytics.data.repositories.languageDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Languages used across your repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(analytics.data.repositories.languageDistribution).map(([lang, count]) => {
                // Calculate percentage based on total repositories
                const percentage = (count / analytics.data.repositories.totalCount) * 100;
                return (
                  <div key={lang} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{lang}</span>
                      <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity - Contribution Calendar */}
      {analytics.data?.contributions?.contributionCalendar && Object.keys(analytics.data.contributions.contributionCalendar).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
            <CardDescription>Your recent GitHub activity</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
      
      {/* Footer with last updated timestamp */}
      <div className="text-xs text-center text-muted-foreground mt-6">
        Last updated: {analytics.data?.lastUpdated ? new Date(analytics.data.lastUpdated).toLocaleString() : 'Unknown'}
      </div>
    </div>
  );
};

export default GitHubAnalytics;
