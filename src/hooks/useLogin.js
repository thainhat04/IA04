import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { tokenManager } from '../utils/token';

/**
 * Login Hook
 * Handles user login with React Query mutation
 * Stores tokens and sets user data in cache on success
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Store tokens
      tokenManager.setAccessToken(data.accessToken);
      tokenManager.setRefreshToken(data.refreshToken);

      // Set user data in cache
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export default useLogin;
