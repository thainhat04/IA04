import config from '../config/config.js';
import logger from '../utils/logger.js';
import { AppError, ValidationError } from '../utils/errors.js';

/**
 * Error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(
    `${err.name}: ${err.message}`,
    config.server.isDevelopment ? err.stack : ''
  );

  // Validation errors
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Operational errors (known errors)
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Unknown errors (programming or system errors)
  return res.status(500).json({
    success: false,
    message: config.server.isDevelopment
      ? err.message
      : 'Internal server error',
    ...(config.server.isDevelopment && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  errorHandler,
  notFound,
  asyncHandler,
};
