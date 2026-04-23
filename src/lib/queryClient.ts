import { QueryClient } from '@tanstack/react-query'

// Create a query client with Netflix-level performance settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes (Netflix-style caching)
      staleTime: 5 * 60 * 1000,
      // Keep data in memory for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Don't refetch on window focus (avoids unnecessary API calls)
      refetchOnWindowFocus: false,
      // Auto-refetch in background every 5 minutes
      refetchInterval: 5 * 60 * 1000,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
})
