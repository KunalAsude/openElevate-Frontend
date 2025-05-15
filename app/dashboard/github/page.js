"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCcw, Github, AlertCircle, LogOut, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GitHubProtectionWrapper } from "@/components/github/github-protection-wrapper";
import { useRouter } from "next/navigation";

// Import existing GitHub components
import GitHubAnalytics from '@/components/github/github-analytics';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { StatsCards } from '@/components/dashboard/stats-cards';

// Import GitHub actions
import { getGitHubAnalytics, refreshGitHubAnalytics, disconnectGitHub } from "@/lib/actions/auth-actions";
import { loginWithGithub } from "@/lib/actions/auth-actions";


function GitHubProfileContent() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);
  
  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await disconnectGitHub();
      
      // Clear GitHub connection flag
      localStorage.removeItem('githubConnected');
      
      // Redirect to dashboard after disconnection
      router.push('/dashboard');
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
      setError('Failed to disconnect GitHub account');
      setDisconnecting(false);
    }
  };
  
  // Error states other than 'not connected' since the wrapper handles that case
  if (error && !error.includes('GitHub account not connected')) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">GitHub Profile</h1>
        
        <Alert variant="warning">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">GitHub Profile</h1>
        
        <Button 
          onClick={handleDisconnect}
          disabled={disconnecting}
          variant="destructive"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          {disconnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Disconnecting...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Disconnect GitHub
            </>
          )}
        </Button>
      </div>
      
      {/* Use the existing GitHubAnalytics component */}
      <GitHubAnalytics />
      
      {/* Use the existing StatsCards component */}
      <div className="mt-6">
        <StatsCards />
      </div>
      
      {/* Use the existing ActivityFeed component */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent GitHub Activity</CardTitle>
            <CardDescription>Your latest commits, pull requests, and other activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed extended={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function GitHubProfilePage() {
  return (
    <GitHubProtectionWrapper>
      <GitHubProfileContent/>
    </GitHubProtectionWrapper>
  );
}
