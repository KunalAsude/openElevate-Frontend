"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const [status, setStatus] = useState('Processing authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Extract token from URL query params
    const token = searchParams?.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Also store login time (useful for tracking token expiry)
      localStorage.setItem('authTime', new Date().toISOString());
      
      setStatus('Authentication successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      // Handle error
      setStatus('Authentication failed');
      setTimeout(() => {
        router.push('/login?error=auth_failed');
      }, 1500);
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="text-lg font-medium">{status}</h2>
      <p className="text-sm text-muted-foreground">
        You&lsquo;ll be redirected to your dashboard in a moment...
      </p>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h2 className="text-lg font-medium">Loading...</h2>
            </div>
          }>
            <CallbackContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
