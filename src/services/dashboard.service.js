import { axiosPrivate } from '../api/axios';
import endpoints from '../api/endpoints';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls (protected resources)
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} - Dashboard stats
   */
  getStats: async () => {
    const response = await axiosPrivate.get(endpoints.dashboard.stats);
    return response.data;
  },

  /**
   * Get user activity
   * @returns {Promise<Array>} - User activity list
   */
  getActivity: async () => {
    const response = await axiosPrivate.get(endpoints.dashboard.activity);
    return response.data;
  },
};

export default dashboardService;
