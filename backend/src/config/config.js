import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Application Configuration
 * Centralized configuration management with validation
 */
const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // JWT Configuration
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
  },
};

/**
 * Validate required configuration
 */
const validateConfig = () => {
  const required = [
    'jwt.accessTokenSecret',
    'jwt.refreshTokenSecret',
  ];

  const missing = [];

  required.forEach((key) => {
    const keys = key.split('.');
    let value = config;

    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        missing.push(key);
        break;
      }
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(', ')}\n` +
      'Please set these environment variables.'
    );
  }

  // Validate token secrets length
  if (config.jwt.accessTokenSecret.length < 32) {
    console.warn('⚠️  Warning: ACCESS_TOKEN_SECRET should be at least 32 characters');
  }

  if (config.jwt.refreshTokenSecret.length < 32) {
    console.warn('⚠️  Warning: REFRESH_TOKEN_SECRET should be at least 32 characters');
  }
};

// Validate configuration on load
validateConfig();

export default config;
