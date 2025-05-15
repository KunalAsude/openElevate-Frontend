'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth-actions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * ProtectedRoute component that checks if a user is authenticated
 * and redirects to login if not
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      if (!user) {
        // User is not authenticated, redirect to login
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return false;
      }
      return true;
    };

    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
  }, [pathname, router]);

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show children only if authenticated
  return isAuthenticated ? children : null;
}
