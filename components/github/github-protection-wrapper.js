"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, CheckCircle, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { loginWithGithub } from "@/lib/actions/auth-actions";
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export function GitHubProtectionWrapper({ children, redirectOnConnect = false }) {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('Protection wrapper: No auth token found');
          setLoading(false);
          return;
        }
        
        // First check if we have explicitly marked GitHub as connected
        const isGithubConnected = localStorage.getItem('githubConnected') === 'true';
        const hasUser = !!localStorage.getItem('user');
        
        if (isGithubConnected && hasUser) {
          console.log('Protection wrapper: GitHub connected based on localStorage flags');
          setIsConnected(true);
          
          // Redirect to GitHub dashboard if needed
          if (redirectOnConnect) {
            window.location.href = '/dashboard/github';
          }
          
          setLoading(false);
          return;
        }

        console.log('Protection wrapper: Checking GitHub connection via API');
        const response = await axios.get(`${API_BASE_URL}/github/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // If we can fetch analytics, GitHub is connected
        if (response.data && response.data.user) {
          console.log('Protection wrapper: API confirms GitHub connected');
          setIsConnected(true);
          localStorage.setItem('githubConnected', 'true');
          
          // Redirect to GitHub dashboard if needed
          if (redirectOnConnect) {
            window.location.href = '/dashboard/github';
          }
        } else {
          console.log('Protection wrapper: API response missing user data');
          setIsConnected(false);
        }
      } catch (error) {
        console.log('Protection wrapper: Error checking connection', error.message);
        
        // If API fails but we have flags saying we're connected, trust the flags
        if (localStorage.getItem('githubConnected') === 'true') {
          console.log('Protection wrapper: Using fallback connection detection');
          setIsConnected(true);
          
          // Redirect to GitHub dashboard if needed
          if (redirectOnConnect) {
            window.location.href = '/dashboard/github';
          }
        } else {
          // 400 or 404 means not connected
          if (error.response && (error.response.status === 400 || error.response.status === 404)) {
            console.log('Protection wrapper: Got 400/404 - Not connected');
            setIsConnected(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkGitHubConnection();
  }, [redirectOnConnect]);

  const handleGitHubConnect = () => {
    setIsConnecting(true);
    loginWithGithub();
  };

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-medium">Checking GitHub connection...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Github className="h-6 w-6" />
              Connect Your GitHub Account
            </CardTitle>
            <CardDescription className="text-base max-w-lg mx-auto">
              Connect your GitHub account to view your contributions, repositories, and analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">View Your Stats</h3>
                  <p className="text-sm text-muted-foreground">See your commits, repos, and more in a single dashboard</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Track Contributions</h3>
                  <p className="text-sm text-muted-foreground">Monitor your open source contributions over time</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Showcase Your Work</h3>
                  <p className="text-sm text-muted-foreground">Display your GitHub achievements in your profile</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4 mt-4">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleGitHubConnect}
                  disabled={isConnecting}
                >
                  <Github className="h-5 w-5" />
                  {isConnecting ? 'Connecting...' : 'Connect with GitHub'}
                  {!isConnecting && <ChevronRight className="h-4 w-4" />}
                </Button>
                
                <p className="text-xs text-muted-foreground max-w-md text-center">
                  We only request read access to your public repositories and profile information. 
                  You can disconnect at any time from your settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If connected, render the actual content
  return children;
}
