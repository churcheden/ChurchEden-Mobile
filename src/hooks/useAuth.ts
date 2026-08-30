// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient, tokenStore, AppError } from '../lib/apiClient';
import type { User } from '../types/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await tokenStore.getAccess();
      if (!token) {
        setUser(null);
        return;
      }
      const res = await apiClient.get<any>('/auth/me');
      setUser(res.user || res.data?.user || res);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await tokenStore.getRefresh();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore network errors during logout
    } finally {
      await tokenStore.clearTokens();
      setUser(null);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    refetch: fetchUser,
    logout,
  };
}
