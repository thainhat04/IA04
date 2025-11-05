import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Reusable loading spinner with accessibility support
 */
export const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className={`loading-spinner ${size}`} role="status" aria-label={message}>
      <div className="spinner"></div>
      <span className="sr-only">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
