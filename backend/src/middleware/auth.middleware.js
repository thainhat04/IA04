import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { AuthenticationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Authenticate JWT Token Middleware
 * Verifies the access token from Authorization header
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Verify token
    jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new AuthenticationError('Access token expired');
        } else if (err.name === 'JsonWebTokenError') {
          throw new AuthenticationError('Invalid access token');
        } else {
          throw new AuthenticationError('Token verification failed');
        }
      }

      // Attach user info to request
      req.user = decoded;
      logger.debug(`User authenticated: ${decoded.email}`);
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't fail if missing
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
      next();
    });
  } catch (error) {
    next();
  }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(
        new AuthorizationError('Insufficient permissions for this resource')
      );
    }

    next();
  };
};

export default {
  authenticateToken,
  optionalAuth,
  authorize,
};
