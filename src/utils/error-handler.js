/**
 * Custom Authentication Error
 */
export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - Error object from API call
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  // Network error - no response received
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your internet connection.';
  }

  if (!error.response) {
    return 'Unable to connect to server. Please try again later.';
  }

  // Server responded with error
  const { status, data } = error.response;

  // Return custom error message from server if available
  if (data?.message) {
    return data.message;
  }

  // Default messages based on status code
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid credentials. Please try again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'This resource already exists.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Get error status code
 * @param {Error} error - Error object
 * @returns {number|null} - Status code or null
 */
export const getErrorStatus = (error) => {
  return error.response?.status || null;
};

/**
 * Check if error is authentication related
 * @param {Error} error - Error object
 * @returns {boolean} - True if auth error
 */
export const isAuthError = (error) => {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
};

/**
 * Check if error is network related
 * @param {Error} error - Error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    !error.response
  );
};

/**
 * Format validation errors from server
 * @param {Error} error - Error object
 * @returns {Object} - Formatted validation errors
 */
export const formatValidationErrors = (error) => {
  const errors = error.response?.data?.errors;

  if (!errors || typeof errors !== 'object') {
    return {};
  }

  // Convert array of errors to object keyed by field name
  if (Array.isArray(errors)) {
    return errors.reduce((acc, err) => {
      if (err.field && err.message) {
        acc[err.field] = err.message;
      }
      return acc;
    }, {});
  }

  return errors;
};
