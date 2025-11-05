import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { tokenManager } from '../utils/token';

/**
 * Logout Hook
 * Handles user logout with React Query mutation
 * Clears tokens and all cached queries
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear tokens
      tokenManager.clearAll();

      // Clear all React Query cache
      queryClient.clear();
    },
    onError: (error) => {
      // Even if request fails, clear local tokens
      console.error('Logout request failed:', error);
    },
    onSettled: () => {
      // Always clear tokens and cache, even on error
      tokenManager.clearAll();
      queryClient.clear();
    },
  });
};

export default useLogout;
