import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr_101',
    fullName: 'Pastor Samuel Eden',
    email: 'samuel@churcheden.app',
    role: 'Pastor',
    campus: 'Main Grace Cathedral',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  });
  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async () => {
      setIsLoading(true);
      // Simulate auth logic
      setIsLoading(false);
    },
    logout: async () => {
      setUser(null);
    }
  };
}
