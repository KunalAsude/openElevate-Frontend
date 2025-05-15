import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, GitPullRequest, GitIssueOpened } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ContributionStats({ contributions, pullRequests, issues, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCommit className="h-4 w-4" />
            Commits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {contributions?.totalCommits?.toLocaleString() || 0}
          </div>
          {contributions?.contributionYears && (
            <p className="text-xs text-muted-foreground mt-1">
              Across {contributions.contributionYears.length} years
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitPullRequest className="h-4 w-4" />
            Pull Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pullRequests?.totalCount?.toLocaleString() || 0}
          </div>
          {pullRequests && (
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span className="text-green-500">{pullRequests.mergedCount || 0} merged</span>
              <span className="text-blue-500">{pullRequests.openCount || 0} open</span>
              <span>{pullRequests.closedCount || 0} closed</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitIssueOpened className="h-4 w-4" />
            Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {issues?.totalCount?.toLocaleString() || 0}
          </div>
          {issues && (
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span className="text-blue-500">{issues.openCount || 0} open</span>
              <span>{issues.closedCount || 0} closed</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
