import { axiosPublic, axiosPrivate } from '../api/axios';
import endpoints from '../api/endpoints';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} - User data and tokens
   */
  login: async (credentials) => {
    const response = await axiosPublic.post(endpoints.auth.login, credentials);
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} - User data and tokens
   */
  register: async (userData) => {
    const response = await axiosPublic.post(endpoints.auth.register, userData);
    return response.data;
  },

  /**
   * Logout user
   * Sends request to invalidate refresh token on server
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await axiosPrivate.post(endpoints.auth.logout);
    } catch (error) {
      // Still proceed with logout even if request fails
      console.error('Logout request failed:', error);
    }
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - New access token and optionally new refresh token
   */
  refreshToken: async (refreshToken) => {
    const response = await axiosPublic.post(endpoints.auth.refresh, {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} - User data
   */
  getCurrentUser: async () => {
    const response = await axiosPrivate.get(endpoints.auth.me);
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Updated user data
   */
  updateProfile: async (userData) => {
    const response = await axiosPrivate.put(endpoints.user.update, userData);
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} - Success message
   */
  changePassword: async (passwordData) => {
    const response = await axiosPrivate.post(
      endpoints.user.changePassword,
      passwordData
    );
    return response.data;
  },
};

export default authService;
