import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'

// Import TanStack Query for advanced data management
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'

// Import Mock authentication (temporary replacement for Clerk)
import { MockAuthProvider } from './contexts/MockAuthContext'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MockAuthProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </MockAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
