import { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { tokenManager } from '../utils/token';

export const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Provides authentication state and methods to all child components
 * Listens to token changes and custom auth events
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!tokenManager.getAccessToken()
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();

    // If we have a refresh token but no access token, we're logged in but need to refresh
    // This handles page refresh scenarios
    if (refreshToken && !token) {
      setIsAuthenticated(true);
    }

    setIsInitialized(true);
  }, []);

  // Subscribe to token changes
  useEffect(() => {
    const unsubscribe = tokenManager.subscribe((token) => {
      setIsAuthenticated(!!token);
    });

    return unsubscribe;
  }, []);

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogoutEvent = () => {
      setIsAuthenticated(false);
      queryClient.clear();
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, [navigate, queryClient]);

  // Logout function
  const logout = useCallback(() => {
    tokenManager.clearAll();
    queryClient.clear();
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate, queryClient]);

  // Login function (sets auth state)
  const login = useCallback((accessToken, refreshToken) => {
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
    setIsAuthenticated(true);
  }, []);

  const value = {
    isAuthenticated,
    isInitialized,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
