"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Github } from "lucide-react";
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { loginWithGithub, disconnectGitHub, getAuthToken } from '@/lib/actions/auth-actions';

export function GitHubConnectToggle() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [githubUser, setGithubUser] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Check if GitHub is connected
  useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        console.log('GitHub connection check - Token exists:', !!token);
        
        if (!token) {
          console.log('No auth token found in localStorage or cookies');
          setLoading(false);
          return;
        }

        // First check if we have explicitly marked GitHub as connected
        const isGithubConnected = localStorage.getItem('githubConnected') === 'true';
        
        // Then check if we have user data
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        
        if (isGithubConnected && user) {
          console.log('GitHub is connected based on localStorage flag');
          setIsConnected(true);
          
          // Create a GitHub user object from the available user data
          setGithubUser({
            login: user.github_username || user.email?.split('@')[0] || 'github-user',
            avatar_url: user.avatarUrl || user.avatar_url || `https://avatars.githubusercontent.com/u/${user.id}`,
            name: user.name || 'GitHub User'
          });
          
          setLoading(false);
          return;
        }
        
        console.log('Making API request to check GitHub connection');
        const response = await axios.get(`${API_BASE_URL}/github/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('GitHub API response:', response.status, response.data?.user ? 'user exists' : 'no user data');
        
        // If we can fetch analytics, GitHub is connected
        if (response.data && response.data.user) {
          setIsConnected(true);
          setGithubUser(response.data.user);
        } else {
          console.log('No user data in response');
          setIsConnected(false);
        }
      } catch (error) {
        console.error('GitHub connection check error:', error.message);
        
        // 400 or 404 means not connected
        if (error.response && (error.response.status === 400 || error.response.status === 404)) {
          console.log('Got 400/404 response - Not connected');
          setIsConnected(false);
        } else {
          // For other errors, try to check if we at least have a token saved
          // This can help when backend is temporarily unavailable
          const hasToken = localStorage.getItem('authToken');
          const hasGithubFlag = localStorage.getItem('githubConnected');
          
          if (hasToken && hasGithubFlag === 'true') {
            console.log('Using fallback connection detection (localStorage flags)');
            setIsConnected(true);
            
            // Try to use saved user data if available
            const userJson = localStorage.getItem('user');
            if (userJson) {
              try {
                const userData = JSON.parse(userJson);
                if (userData) {
                  setGithubUser({
                    login: userData.github_username || userData.username || 'user',
                    avatar_url: userData.avatar_url || 'https://github.com/identicons/user',
                    name: userData.name || userData.github_username || 'GitHub User'
                  });
                }
              } catch (e) {
                console.error('Error parsing saved user data:', e);
              }
            }
          } else {
            setIsConnected(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkGitHubConnection();
  }, []);

  // Handle connect to GitHub
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Set a flag to indicate we're attempting GitHub connection
    localStorage.setItem('githubConnecting', 'true');
    
    // Call the login function
    loginWithGithub();
  };

  // Handle disconnect from GitHub
  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      
      await disconnectGitHub();
      
      setIsConnected(false);
      setGithubUser(null);
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Checking GitHub connection...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub
            </CardTitle>
            <CardDescription>
              {isConnected 
                ? 'Your GitHub account is connected. View your analytics in the dashboard.' 
                : 'Connect your GitHub account to see your contributions and analytics.'}
            </CardDescription>
          </div>
          {isConnected && githubUser && (
            <div className="flex items-center space-x-2 text-sm">
              <img 
                src={githubUser.avatar_url} 
                alt={githubUser.login}
                className="h-8 w-8 rounded-full"
              />
              <span className="font-medium">@{githubUser.login}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {isConnected ? (
            <div className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground">
                Connected as <span className="font-medium">{githubUser?.name || githubUser?.login}</span>
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/dashboard/github', '_self')}
                >
                  View GitHub Analytics
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect GitHub'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              {isConnecting ? 'Connecting...' : 'Connect GitHub'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
