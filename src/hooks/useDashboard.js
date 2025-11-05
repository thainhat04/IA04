import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

/**
 * Dashboard Stats Hook
 * Fetches dashboard statistics (protected resource)
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

/**
 * Dashboard Activity Hook
 * Fetches user activity (protected resource)
 */
export const useDashboardActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => dashboardService.getActivity(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
};
