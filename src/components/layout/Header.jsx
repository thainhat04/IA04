import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../hooks/useLogout';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';
import './Header.css';

/**
 * Header Component
 * Navigation bar with user info and logout button
 */
export const Header = () => {
  const { isAuthenticated } = useAuth();
  const { data: user } = useUser();
  const { mutate: logout, isLoading } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
        navigate('/login', { replace: true });
      },
      onError: () => {
        toast.error('Logout failed');
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>React JWT Auth</h1>
        </Link>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <div className="user-info">
                <span className="user-name">
                  {user?.name || user?.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="btn btn-logout"
                  aria-label="Logout"
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
