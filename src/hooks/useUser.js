import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { tokenManager } from '../utils/token';

/**
 * User Query Hook
 * Fetches current authenticated user data
 * Only runs when access token exists
 */
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!tokenManager.getAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      console.error('Failed to fetch user:', error);
      // Token is invalid, clear it
      tokenManager.clearAll();
    },
  });
};

export default useUser;
