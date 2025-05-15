"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Extract token from URL query params
    const token = searchParams?.get('token');
    const provider = searchParams?.get('provider') || 'github'; // Default to GitHub if not specified
    
    if (token) {
      console.log('OAuth callback received token:', token.substring(0, 5) + '...');
      
      // Store token in localStorage using the name 'authToken' to match existing components
      localStorage.setItem('authToken', token);
      
      // Set explicit flag for GitHub connection status
      localStorage.setItem('githubConnected', 'true');
      
      // Clear the connecting flag if it was set
      localStorage.removeItem('githubConnecting');
      
      // Also store login time (useful for tracking token expiry)
      localStorage.setItem('authTime', new Date().toISOString());
      
      // Try to extract user info from token if it's a JWT
      if (token.split('.').length === 3) {
        try {
          const tokenParts = token.split('.');
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          
          if (tokenPayload.user) {
            console.log('Extracted user data from token');
            localStorage.setItem('user', JSON.stringify(tokenPayload.user));
          }
        } catch (e) {
          console.error('Failed to parse token payload:', e);
        }
      }
      
      setStatus('Authentication successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      // Handle error
      console.error('No token found in OAuth callback');
      localStorage.removeItem('githubConnecting'); // Clear connecting state
      
      setStatus('Authentication failed');
      setTimeout(() => {
        router.push('/login?error=auth_failed');
      }, 1500);
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-lg font-medium">{status}</h2>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to your dashboard in a moment...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
