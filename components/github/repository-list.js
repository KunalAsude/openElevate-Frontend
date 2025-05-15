import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Eye, Code } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function RepositoryList({ repositories, loading }) {
  const [sortBy, setSortBy] = useState('stars');
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex gap-4 mt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (!repositories || !repositories.details || repositories.details.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
          <CardDescription>No repositories found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No public repositories available for this account.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Sort repositories based on selected criteria
  const sortedRepos = [...repositories.details].sort((a, b) => {
    if (sortBy === 'stars') return b.stargazersCount - a.stargazersCount;
    if (sortBy === 'forks') return b.forksCount - a.forksCount;
    if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
    if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Repositories</CardTitle>
          <CardDescription>
            {repositories.totalCount} repositories ({repositories.publicCount} public, {repositories.privateCount} private)
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="text-xs border rounded p-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedRepos.slice(0, 5).map((repo) => (
          <div key={repo.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <a 
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {repo.name}
                </a>
                {repo.fork && (
                  <Badge variant="outline" className="text-xs">Fork</Badge>
                )}
                {repo.visibility === 'private' && (
                  <Badge variant="secondary" className="text-xs">Private</Badge>
                )}
              </div>
              
              {repo.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {repo.language}
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stargazersCount}
                </div>
                
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {repo.forksCount}
                </div>
                
                {repo.watchersCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {repo.watchersCount}
                  </div>
                )}
                
                <div>
                  Updated {new Date(repo.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {repositories.details.length > 5 && (
          <div className="text-center pt-2">
            <a 
              href="https://github.com/?tab=repositories" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View all {repositories.totalCount} repositories
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
