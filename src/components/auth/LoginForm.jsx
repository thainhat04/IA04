import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { handleApiError } from '../../utils/error-handler';
import './AuthForm.css';

/**
 * LoginForm Component
 * Handles user login with React Hook Form validation
 */
export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isLoading } = useLogin();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
      onError: (error) => {
        const errorMessage = handleApiError(error);
        const status = error.response?.status;

        // Set field-specific error for invalid credentials
        if (status === 401 || status === 400) {
          setError('root.credentials', {
            type: 'manual',
            message: 'Invalid email or password',
          });
        } else {
          // Set general server error
          setError('root.server', {
            type: 'manual',
            message: errorMessage,
          });
        }
      },
    });
  };

  const isFormLoading = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={errors.email ? 'error' : ''}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isFormLoading}
          placeholder="Enter your email"
        />
        {errors.email && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className={errors.password ? 'error' : ''}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
          disabled={isFormLoading}
          placeholder="Enter your password"
        />
        {errors.password && (
          <span id="password-error" className="error-message" role="alert">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Display root errors */}
      {errors.root?.credentials && (
        <div className="alert alert-error" role="alert">
          {errors.root.credentials.message}
        </div>
      )}
      {errors.root?.server && (
        <div className="alert alert-error" role="alert">
          {errors.root.server.message}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isFormLoading}
        aria-label="Submit login form"
      >
        {isFormLoading ? (
          <span className="btn-loading">
            <span className="spinner"></span>
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
