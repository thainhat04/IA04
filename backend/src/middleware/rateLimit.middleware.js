import config from '../config/config.js';
import { RateLimitError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Simple in-memory rate limiter
 * In production, use Redis or a dedicated rate limiting service
 */
class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();

    // Clean up old entries periodically
    setInterval(() => this.cleanup(), windowMs);
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Filter out old requests outside the window
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  /**
   * Get reset time
   */
  getResetTime(identifier) {
    const userRequests = this.requests.get(identifier) || [];
    if (userRequests.length === 0) return Date.now();

    const oldestRequest = Math.min(...userRequests);
    return oldestRequest + this.windowMs;
  }

  /**
   * Clean up old entries
   */
  cleanup() {
    const now = Date.now();
    for (const [identifier, timestamps] of this.requests.entries()) {
      const recentRequests = timestamps.filter(
        (timestamp) => now - timestamp < this.windowMs
      );

      if (recentRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, recentRequests);
      }
    }
  }
}

// Create rate limiter instance
const rateLimiter = new RateLimiter(
  config.rateLimit.windowMs,
  config.rateLimit.maxRequests
);

/**
 * Rate limiting middleware
 */
export const rateLimit = (req, res, next) => {
  try {
    // Use IP address as identifier
    const identifier = req.ip || req.connection.remoteAddress;

    if (!rateLimiter.isAllowed(identifier)) {
      const resetTime = rateLimiter.getResetTime(identifier);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      logger.warn(`Rate limit exceeded for ${identifier}`);

      res.set({
        'X-RateLimit-Limit': config.rateLimit.maxRequests,
        'X-RateLimit-Remaining': 0,
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
        'Retry-After': retryAfter,
      });

      throw new RateLimitError(
        'Too many requests, please try again later'
      );
    }

    // Set rate limit headers
    const remaining = rateLimiter.getRemaining(identifier);
    const resetTime = rateLimiter.getResetTime(identifier);

    res.set({
      'X-RateLimit-Limit': config.rateLimit.maxRequests,
      'X-RateLimit-Remaining': remaining,
      'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Strict rate limiter for sensitive endpoints (login, register)
 */
export const strictRateLimit = (req, res, next) => {
  const identifier = req.ip || req.connection.remoteAddress;
  const strictLimiter = new RateLimiter(900000, 5); // 5 requests per 15 minutes

  if (!strictLimiter.isAllowed(identifier)) {
    logger.warn(`Strict rate limit exceeded for ${identifier}`);
    return next(new RateLimitError('Too many authentication attempts'));
  }

  next();
};

export default {
  rateLimit,
  strictRateLimit,
};
