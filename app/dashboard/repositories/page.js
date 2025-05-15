'use client';

import { useState, useEffect } from 'react';
import { getGitHubAnalytics } from "@/lib/actions/github-actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { GitPullRequest, Star, Code, GitFork, Eye, ExternalLink, AlertCircle, Calendar } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper";

function RepositoriesContent() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("updated"); // Default sort by last updated

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);
        const data = await getGitHubAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to load GitHub repositories');
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  const sortRepositories = (repos) => {
    if (!repos) return [];
    
    switch (sortBy) {
      case "stars":
        return [...repos].sort((a, b) => b.stargazersCount - a.stargazersCount);
      case "name":
        return [...repos].sort((a, b) => a.name.localeCompare(b.name));
      case "updated":
      default:
        return [...repos].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
  };

  // Generate a random color for languages without predefined colors
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
    return colors[language] || 'bg-slate-500';
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const sortedRepos = analytics?.data?.repositories?.details 
    ? sortRepositories(analytics.data.repositories.details) 
    : [];

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Repositories" 
        text="View and manage your GitHub repositories."
      >
        <div className="flex items-center space-x-2">
          <Button 
            variant={sortBy === "updated" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortBy("updated")}
          >
            Latest
          </Button>
          <Button 
            variant={sortBy === "stars" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortBy("stars")}
          >
            Stars
          </Button>
          <Button 
            variant={sortBy === "name" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortBy("name")}
          >
            Name
          </Button>
        </div>
      </DashboardHeader>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-5 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : sortedRepos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedRepos.map((repo) => (
            <Card key={repo.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <a 
                    href={repo.htmlUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {repo.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  
                  <div className="flex gap-1">
                    {repo.visibility === 'private' && (
                      <Badge variant="outline">Private</Badge>
                    )}
                    {repo.fork && (
                      <Badge variant="outline">Fork</Badge>
                    )}
                  </div>
                </div>
                
                {repo.description && (
                  <CardDescription className="mt-1.5 line-clamp-2">
                    {repo.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="p-4 pt-2 flex-grow">
                <div className="space-y-3">
                  {/* Language indicator */}
                  {repo.language && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`h-3 w-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{repo.stargazersCount}</span>
                    </div>
                    
                    {repo.forksCount > 0 && (
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forksCount}</span>
                      </div>
                    )}
                    
                    {repo.watchersCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{repo.watchersCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t mt-auto">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Updated {formatDate(repo.updatedAt)}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No repositories found</CardTitle>
            <CardDescription>Connect your GitHub account to see your repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once connected, your GitHub repositories will appear here.
            </p>
            <Button asChild>
              <a href="/dashboard" className="inline-flex items-center">
                Return to Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && analytics?.data?.username && (
        <div className="mt-4 text-center">
          <a 
            href={`https://github.com/${analytics.data.username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View all repositories on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </DashboardShell>
  );
}

export default function RepositoriesPage() {
  return (
    <GitHubProtectionWrapper>
      <RepositoriesContent />
    </GitHubProtectionWrapper>
  );
}
