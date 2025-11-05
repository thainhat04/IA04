import logger from '../utils/logger.js';

/**
 * HTTP Request Logger Middleware
 * Logs all incoming HTTP requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log after response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(req.method, req.path, res.statusCode, duration);
  });

  next();
};

export default requestLogger;
