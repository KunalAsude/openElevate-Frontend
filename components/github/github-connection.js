import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { loginWithGithub } from '@/lib/actions/auth-actions';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

const GitHubConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check GitHub connection status on component mount
  useEffect(() => {
    const checkGitHubConnection = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/github/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.user) {
          setIsConnected(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error checking GitHub connection:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkGitHubConnection();
  }, []);

  const disconnectGitHub = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await axios.post(`${API_BASE_URL}/github/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsConnected(false);
      setUser(null);
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
    }
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (isConnected && user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={disconnectGitHub}
              className="relative"
            >
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback>{user.login?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected to GitHub as {user.login}</p>
            <p className="text-xs text-gray-500">Click to disconnect</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={loginWithGithub}
      className="flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
      Connect GitHub
    </Button>
  );
};

export default GitHubConnection;
