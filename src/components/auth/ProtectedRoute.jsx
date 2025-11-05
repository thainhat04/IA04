import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { tokenManager } from '../../utils/token';
import { LoadingSpinner } from '../common/LoadingSpinner';

/**
 * ProtectedRoute Component
 * Wraps protected routes and ensures user is authenticated
 * Redirects to login if not authenticated
 * Shows loading state while fetching user data
 */
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const location = useLocation();
  const hasToken = !!tokenManager.getAccessToken();
  const hasRefreshToken = !!tokenManager.getRefreshToken();

  // Check if user has any token
  const hasAnyToken = hasToken || hasRefreshToken;

  const { data: user, isLoading, error } = useUser();

  // No tokens at all - redirect immediately
  if (!hasAnyToken) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Loading user data
  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  // Error fetching user or no user data - redirect to login
  if (error || !user) {
    tokenManager.clearAll();
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User is authenticated - render children or outlet
  return children || <Outlet />;
};

export default ProtectedRoute;
