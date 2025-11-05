import { jwtDecode } from 'jwt-decode';

/**
 * Token Manager Class
 * Manages access and refresh tokens with observer pattern
 * Access token: In-memory storage (secure, cleared on page refresh)
 * Refresh token: localStorage (persistent across sessions)
 */
class TokenManager {
  constructor() {
    this.accessToken = null;
    this.listeners = new Set();
  }

  // Access Token Management (In-Memory)
  setAccessToken(token) {
    this.accessToken = token;
    this.notifyListeners();
  }

  getAccessToken() {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
    this.notifyListeners();
  }

  // Refresh Token Management (Persistent Storage)
  setRefreshToken(token) {
    try {
      localStorage.setItem('refreshToken', token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  getRefreshToken() {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  clearRefreshToken() {
    try {
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
  }

  // Clear All Tokens
  clearAll() {
    this.clearAccessToken();
    this.clearRefreshToken();
  }

  // Observer Pattern for Token Changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.accessToken));
  }
}

// Singleton instance
export const tokenManager = new TokenManager();

/**
 * Check if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired or invalid
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Add 30 second buffer before expiration
    return decoded.exp < currentTime + 30;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
};

/**
 * Get token expiration time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} - Expiration time or null if invalid
 */
export const getTokenExpirationTime = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Failed to get token expiration:', error);
    return null;
  }
};

/**
 * Decode JWT token payload
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
