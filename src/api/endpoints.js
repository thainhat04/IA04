/**
 * API Endpoints
 * Centralized location for all API endpoint paths
 */

export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    register: '/auth/register',
  },

  // User
  user: {
    profile: '/user/profile',
    update: '/user/profile',
    changePassword: '/user/change-password',
  },

  // Protected resources (examples)
  dashboard: {
    stats: '/dashboard/stats',
    activity: '/dashboard/activity',
  },
};

export default endpoints;
