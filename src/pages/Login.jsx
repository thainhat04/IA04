import { LoginForm } from '../components/auth/LoginForm';
import './Login.css';

/**
 * Login Page
 * Displays login form for user authentication
 */
const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <LoginForm />

        <div className="login-footer">
          <p>
            Demo credentials: <strong>demo@example.com</strong> / <strong>password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
