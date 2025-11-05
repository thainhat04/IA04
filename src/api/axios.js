import axios from 'axios';
import { tokenManager } from '../utils/token';

// Get API base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Public Axios Instance
 * Used for requests that don't require authentication (login, refresh token)
 */
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Private Axios Instance
 * Used for authenticated requests - automatically attaches access token
 */
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor
 * Automatically attach access token to every request
 */
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle 401 errors and automatically refresh access token
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401, reject immediately
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop - if refresh already failed, logout
    if (originalRequest._retry) {
      tokenManager.clearAll();

      // Dispatch custom event for logout
      window.dispatchEvent(new CustomEvent('auth:logout'));

      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosPrivate(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Mark request as retried and start refresh process
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenManager.getRefreshToken();

    // No refresh token available - logout
    if (!refreshToken) {
      isRefreshing = false;
      tokenManager.clearAll();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(error);
    }

    try {
      // Call refresh endpoint using public axios to avoid interceptor loop
      const response = await axiosPublic.post('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Update tokens
      tokenManager.setAccessToken(accessToken);
      if (newRefreshToken) {
        tokenManager.setRefreshToken(newRefreshToken);
      }

      // Update authorization header for original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process queued requests
      processQueue(null, accessToken);
      isRefreshing = false;

      // Retry original request
      return axiosPrivate(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear tokens and logout
      processQueue(refreshError, null);
      isRefreshing = false;
      tokenManager.clearAll();

      // Dispatch custom event for logout
      window.dispatchEvent(new CustomEvent('auth:logout'));

      return Promise.reject(refreshError);
    }
  }
);

// Default export
export default axiosPrivate;
