import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitPullRequest, MessageSquare, Star, GitCommit, Code, GitMerge, GitBranch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getGitHubAnalytics } from "@/lib/actions/github-actions";

export function ActivityFeed({ extended = false, userId = null }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubActivities = async () => {
      try {
        setLoading(true);
        
        const data = await getGitHubAnalytics(userId);
        
        // Extract activities from the GitHub data
        // This is a simplified example - you would need to adapt this
        // based on your actual API response structure
        const extractedActivities = [];
        
        // Add commit activities
        if (data.contributions?.recentCommits) {
          data.contributions.recentCommits.forEach(commit => {
            extractedActivities.push({
              id: commit.id || `commit-${extractedActivities.length}`,
              type: 'commit',
              repository: commit.repository || 'Unknown repository',
              time: commit.date || new Date().toISOString(),
              icon: GitCommit,
              description: commit.message || 'Commit',
              url: commit.url,
              branch: commit.branch
            });
          });
        }
        
        // Add PR activities
        if (data.pullRequests?.recent) {
          data.pullRequests.recent.forEach(pr => {
            extractedActivities.push({
              id: pr.id || `pr-${extractedActivities.length}`,
              type: 'pull-request',
              repository: pr.repository || 'Unknown repository',
              time: pr.createdAt || new Date().toISOString(),
              icon: GitPullRequest,
              description: pr.title || 'Pull request',
              url: pr.url,
              status: pr.state
            });
          });
        }
        
        // Add issue activities
        if (data.issues?.recent) {
          data.issues.recent.forEach(issue => {
            extractedActivities.push({
              id: issue.id || `issue-${extractedActivities.length}`,
              type: 'issue',
              repository: issue.repository || 'Unknown repository',
              time: issue.createdAt || new Date().toISOString(),
              icon: GitIssueOpened,
              description: issue.title || 'Issue',
              url: issue.url,
              status: issue.state
            });
          });
        }
        
        // Sort by date (most recent first)
        extractedActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // If no real activities are available, use mock data for demonstration
        if (extractedActivities.length === 0) {
          setActivities(getMockActivities());
        } else {
          setActivities(extractedActivities);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching GitHub activities:', error);
        setError('Failed to load GitHub activities');
        setActivities(getMockActivities());
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubActivities();
  }, [userId]);

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffDay > 30) {
        return date.toLocaleDateString();
      } else if (diffDay > 0) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
      } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
      } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (e) {
      return dateString;
    }
  };

  const getIconForActivity = (activity) => {
    const IconComponent = activity.icon || GitCommit;
    
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <IconComponent className="h-5 w-5 text-primary" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(extended ? 5 : 3).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !activities.length) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.slice(0, extended ? 10 : 5).map((activity) => (
        <div key={activity.id} className="flex gap-4">
          {getIconForActivity(activity)}
          
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.description}</span>
              {activity.repository && (
                <> in <span className="font-medium">{activity.repository}</span></>
              )}
              {activity.branch && (
                <> on <span className="text-muted-foreground">{activity.branch}</span></>
              )}
            </p>
            
            <p className="text-xs text-muted-foreground">
              {formatTimeAgo(activity.time)}
              {activity.status && (
                <> · <span className={
                  activity.status === 'open' ? 'text-blue-500' : 
                  activity.status === 'merged' ? 'text-purple-500' : 
                  activity.status === 'closed' ? 'text-red-500' : ''
                }>
                  {activity.status}
                </span></>
              )}
            </p>
          </div>
          
          {activity.url && (
            <a 
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              View
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// Mock data for demonstration when real data is not available
function getMockActivities() {
  return [
    {
      id: 1,
      type: 'commit',
      repository: 'open-elevate/frontend',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: GitCommit,
      description: 'Added GitHub analytics dashboard',
      branch: 'main'
    },
    {
      id: 2,
      type: 'pull-request',
      repository: 'open-elevate/backend',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      icon: GitPullRequest,
      description: 'Implemented GitHub OAuth integration',
      status: 'merged'
    },
    {
      id: 3,
      type: 'issue',
      repository: 'open-elevate/docs',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      icon: MessageSquare,
      description: 'Documentation for GitHub integration',
      status: 'open'
    },
    {
      id: 4,
      type: 'star',
      repository: 'facebook/react',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      icon: Star,
      description: 'Starred repository'
    },
    {
      id: 5,
      type: 'fork',
      repository: 'vercel/next.js',
      time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      icon: GitBranch,
      description: 'Forked repository'
    }
  ];
}

// Missing GitIssueOpened icon
function GitIssueOpened(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M20 12h2" />
      <path d="M2 12h2" />
    </svg>
  );
}
