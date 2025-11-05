import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// Global styles
import './styles/index.css';

/**
 * React Query Client Configuration
 * Optimized for JWT authentication flow
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

/**
 * Root Component
 * Sets up all providers and wrappers
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>

        {/* React Query Devtools - only in development */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
