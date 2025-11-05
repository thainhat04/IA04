import { useUser } from '../hooks/useUser';
import { useDashboardStats, useDashboardActivity } from '../hooks/useDashboard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import './Dashboard.css';

/**
 * Dashboard Page
 * Protected page showing user information and dashboard data
 */
const Dashboard = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const {
    data: activity,
    isLoading: activityLoading,
    error: activityError,
  } = useDashboardActivity();

  if (userLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name || user?.email}!</p>
      </div>

      {/* User Info Card */}
      <div className="dashboard-section">
        <h2>Your Profile</h2>
        <div className="card user-card">
          <div className="user-avatar">
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>{user?.name || 'User'}</h3>
            <p className="user-email">{user?.email}</p>
            {user?.role && (
              <span className="user-role">{user.role}</span>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-section">
        <h2>Statistics</h2>
        {statsLoading ? (
          <LoadingSpinner />
        ) : statsError ? (
          <div className="error-message">
            Failed to load statistics. This is expected if backend is not running.
          </div>
        ) : stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.totalUsers || 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>{stats.activeUsers || 0}</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-content">
                <h3>{stats.projects || 0}</h3>
                <p>Projects</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completed || 0}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No statistics available.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        {activityLoading ? (
          <LoadingSpinner />
        ) : activityError ? (
          <div className="error-message">
            Failed to load activity. This is expected if backend is not running.
          </div>
        ) : activity && activity.length > 0 ? (
          <div className="activity-list">
            {activity.map((item, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{item.icon || '📌'}</div>
                <div className="activity-content">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-time">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent activity.</p>
        )}
      </div>

      {/* Protected Content Demo */}
      <div className="dashboard-section">
        <h2>Protected Content</h2>
        <div className="card">
          <p>
            This content is only visible to authenticated users. Your access
            token is automatically attached to all API requests, and will be
            refreshed when it expires using your refresh token.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>JWT Access Token (In-Memory)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>JWT Refresh Token (LocalStorage)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Automatic Token Refresh</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>React Query State Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>React Hook Form Validation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
