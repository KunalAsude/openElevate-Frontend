"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getAuthToken } from '@/lib/actions/auth-actions';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const authToken = getAuthToken();
        if (authToken) {
          const userData = getCurrentUser();
          setUser(userData);
          setToken(authToken);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user && !!token;
  }, [user, token]);

  // Check if user has a specific role
  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  return {
    user,
    loading,
    error,
    token,
    isAuthenticated,
    hasRole,
  };
}

export default useAuth;