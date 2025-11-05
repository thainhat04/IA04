import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { tokenManager } from '../utils/token';

/**
 * Register Hook
 * Handles user registration with React Query mutation
 * Stores tokens and sets user data in cache on success
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (data) => {
      // Store tokens
      tokenManager.setAccessToken(data.accessToken);
      tokenManager.setRefreshToken(data.refreshToken);

      // Set user data in cache
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

export default useRegister;
