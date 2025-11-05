import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * PublicRoute Component
 * Wraps public routes (like login) and redirects to dashboard if already authenticated
 * Prevents authenticated users from accessing login page
 */
export const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Not authenticated - render children
  return children;
};

export default PublicRoute;
