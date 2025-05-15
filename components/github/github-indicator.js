"use client";

import { useState, useEffect } from 'react';
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { loginWithGithub } from "@/lib/actions/auth-actions";
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export function GitHubIndicator() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [githubUser, setGithubUser] = useState(null);

  // Check if GitHub is connected
  useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        
        // First check if we have explicitly marked GitHub as connected
        const isGithubConnected = localStorage.getItem('githubConnected') === 'true';
        
        // Then check if we have user data
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        
        if (isGithubConnected && user) {
          console.log('GitHub indicator: Connected based on localStorage flag');
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

        // If no localStorage flags, try the API
        console.log('GitHub indicator: Checking connection via API');
        const response = await axios.get(`${API_BASE_URL}/github/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.user) {
          setIsConnected(true);
          setGithubUser(response.data.user);
          // Also set the flag for future reference
          localStorage.setItem('githubConnected', 'true');
        }
      } catch (error) {
        console.log('GitHub indicator: Error checking connection', error.message);
        
        // If API fails but we have a flag saying we're connected, trust the flag
        if (localStorage.getItem('githubConnected') === 'true' && localStorage.getItem('user')) {
          try {
            const userData = JSON.parse(localStorage.getItem('user'));
            setIsConnected(true);
            setGithubUser({
              login: userData.github_username || userData.email?.split('@')[0] || 'github-user',
              avatar_url: userData.avatarUrl || userData.avatar_url || `https://avatars.githubusercontent.com/u/${userData.id}`,
              name: userData.name || 'GitHub User'
            });
          } catch (e) {
            setIsConnected(false);
          }
        } else {
          // 400 or 404 means not connected
          if (error.response && (error.response.status === 400 || error.response.status === 404)) {
            setIsConnected(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkGitHubConnection();
  }, []);

  const handleGitHubConnect = () => {
    loginWithGithub();
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled className="p-1">
        <Github className="h-6 w-6 text-muted-foreground animate-pulse" />
      </Button>
    );
  }

  if (isConnected && githubUser) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="relative p-1"
              onClick={() => window.location.href = '/dashboard/github'}
            >
              <div className="relative">
                <Avatar className="h-9 w-9 border-2 border-green-500 cursor-pointer">
                  <AvatarImage src={githubUser.avatar_url} alt={githubUser.login} />
                  <AvatarFallback>
                    <Github className="h-5 w-5 cursor-pointer" />
                  </AvatarFallback>
                </Avatar>
                {/* <span className="absolute bottom-3 left-2 h-3 w-3 rounded-full bg-green-500 border border-background"></span> */}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected to GitHub as {githubUser.login}</p>
            <p className="text-xs text-muted-foreground">Click to view GitHub dashboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGitHubConnect}
            className="relative p-1"
          >
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <Github className="h-8 w-8 text-slate-500 cursor-pointer" />
                <span className="absolute bottom-3 left-2 h-3 w-3 rounded-full bg-red-500 border border-background"></span>
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">GitHub not connected</p>
          <p className="text-xs text-muted-foreground">Click to connect</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
