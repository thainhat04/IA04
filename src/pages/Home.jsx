import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css';

/**
 * Home Page
 * Landing page with information about the application
 */
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <h1>React JWT Authentication</h1>
        <p className="hero-subtitle">
          A complete implementation of JWT-based authentication with access and
          refresh tokens
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-large">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>JWT Authentication</h3>
            <p>
              Secure authentication using JSON Web Tokens with separate access
              and refresh tokens
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Automatic Token Refresh</h3>
            <p>
              Seamless token renewal when access tokens expire using Axios
              interceptors
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚛️</div>
            <h3>React Query</h3>
            <p>
              Efficient data fetching and caching with React Query for optimal
              performance
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>React Hook Form</h3>
            <p>
              Form validation and management with React Hook Form for better UX
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Protected Routes</h3>
            <p>
              Route-level authentication ensuring only authorized users can
              access protected pages
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Production Ready</h3>
            <p>
              Optimized build configuration and deployment setup for hosting
              platforms
            </p>
          </div>
        </div>
      </div>

      <div className="tech-stack">
        <h2>Built With</h2>
        <div className="tech-list">
          <span className="tech-badge">React 18</span>
          <span className="tech-badge">Vite</span>
          <span className="tech-badge">React Router</span>
          <span className="tech-badge">React Query</span>
          <span className="tech-badge">React Hook Form</span>
          <span className="tech-badge">Axios</span>
          <span className="tech-badge">JWT</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
