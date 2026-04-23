// Phase 13 Step 3: TanStack Query Hooks - Educational Implementation
// These hooks replace your existing useNetflixData hooks with Netflix-level performance

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tmdbApi } from '../services/tmdbApi'
import type { Movie } from '../assets/Components/types'

// 🎓 EDUCATIONAL SECTION: Understanding Query Keys
// Query keys are like "addresses" for your cached data
// Netflix uses similar systems to organize cached content
const QUERY_KEYS = {
  // Trending movies cached by time window ('day' or 'week')
  trending: (timeWindow: 'day' | 'week') => ['movies', 'trending', timeWindow],
  // Popular movies cached with pagination
  popular: (page: number = 1) => ['movies', 'popular', page],
  // Movie search results cached by query and page
  search: (query: string, page: number = 1) => ['movies', 'search', query, page],
  // Individual movie details cached by ID
  movie: (id: number) => ['movie', id],
  // All movie genres (rarely changes, cache for long time)
  genres: () => ['genres'],
} as const

// 🎯 LEARNING HOOK 1: Basic Query (Replaces useTrendingMovies)
// This is your first step into TanStack Query - notice how simple it becomes!
export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    // 🎓 LEARNING: queryKey identifies this data in the cache
    queryKey: QUERY_KEYS.trending(timeWindow),
    
    // 🎓 LEARNING: queryFn is the function that fetches the data
    queryFn: () => tmdbApi.getTrending(timeWindow),
    
    // 🎓 LEARNING: These options control caching behavior
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    gcTime: 15 * 60 * 1000, // Keep in memory for 15 minutes (v5 uses gcTime instead of cacheTime)
    
    // 🎓 LEARNING: Enable background refetching for fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
}

// 🎯 LEARNING HOOK 2: Search with Debouncing (Replaces useMovieSearch)
// Netflix doesn't search on every keystroke - it waits for you to stop typing
export function useMovieSearch(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.search(query, 1),
    
    // 🎓 LEARNING: v5 requires initialPageParam for infinite queries
    initialPageParam: 1,
    
    queryFn: ({ pageParam }: { pageParam: number }) => tmdbApi.searchMovies(query, pageParam),
    
    // 🎓 LEARNING: enabled controls when the query runs
    // Only search if query has 3+ characters and enabled is true
    enabled: enabled && query.length >= 3,
    
    // 🎓 LEARNING: getNextPageParam for infinite search results
    getNextPageParam: (lastPage: { results: Movie[]; total_pages: number }, allPages: unknown[]) => {
      const currentPage = allPages.length
      const totalPages = lastPage.total_pages || 20 // TMDB default
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    
    // 🎓 LEARNING: Keep search results fresh for 2 minutes
    staleTime: 2 * 60 * 1000,
  })
}

// 🎯 LEARNING HOOK 3: Infinite Scrolling (Netflix's Endless Browse)
// This is where your app becomes like real Netflix - infinite content!
export function useInfiniteMovies(category: 'popular' | 'top_rated' | 'now_playing' = 'popular') {
  return useInfiniteQuery({
    queryKey: ['movies', category, 'infinite'],
    
    // 🎓 LEARNING: v5 requires initialPageParam
    initialPageParam: 1,
    
    // 🎓 LEARNING: pageParam starts at 1, increments automatically  
    queryFn: ({ pageParam }: { pageParam: number }) => {
      switch (category) {
        case 'popular':
          return tmdbApi.getPopular(pageParam)
        case 'top_rated':
          return tmdbApi.getTopRated(pageParam)
        case 'now_playing':
          return tmdbApi.getNowPlaying(pageParam)
        default:
          return tmdbApi.getPopular(pageParam)
      }
    },
    
    // 🎓 LEARNING: getNextPageParam determines if there's a next page
    getNextPageParam: (lastPage: { movies: Movie[]; totalPages: number }, allPages: unknown[]) => {
      const currentPage = allPages.length
      const totalPages = lastPage.totalPages || 20 // TMDB default
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    
    // 🎓 LEARNING: Keep infinite scroll data fresh
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// 🎯 LEARNING HOOK 4: Movies by Genre (Category-based Netflix Browse)
export function useMoviesByGenre(genreId: number, page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'genre', genreId, page],
    queryFn: () => tmdbApi.getMoviesByGenre(genreId, page),
    
    // 🎓 LEARNING: Genre-based movies can be cached longer
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes in memory
    
    // 🎓 LEARNING: Only fetch if we have a valid genreId
    enabled: !!genreId && genreId > 0,
  })
}

// 🎯 LEARNING HOOK 5: Genres (Cache for Long Time)
export function useGenres() {
  return useQuery({
    queryKey: QUERY_KEYS.genres(),
    queryFn: () => tmdbApi.getGenres(),
    
    // 🎓 LEARNING: Genres rarely change, cache for 1 hour
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours in memory (v5 uses gcTime instead of cacheTime)
  })
}

// 🎯 LEARNING HOOK 6: Optimistic Favorites (Netflix Instant Response)
// This is where your app feels as responsive as real Netflix!
export function useFavoritesMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ movie, action }: { movie: Movie; action: 'add' | 'remove' }) => {
      // 🎓 LEARNING: This would be your API call to save favorites
      // For now, we'll use localStorage through your store
      const { useUserMovieStore } = await import('../stores/userMovieStore')
      const store = useUserMovieStore.getState()
      
      if (action === 'add') {
        store.addToFavorites(movie)
      } else {
        store.removeFromFavorites(movie.id)
      }
      
      return { movie, action }
    },
    
    // 🎓 LEARNING: onMutate runs immediately (optimistic update)
    onMutate: async ({ movie, action }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      
      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(['favorites'])
      
      // Optimistically update the cache
      queryClient.setQueryData(['favorites'], (old: Movie[] = []) => {
        return action === 'add' 
          ? [...old, movie]
          : old.filter(m => m.id !== movie.id)
      })
      
      // Return context with previous data for rollback
      return { previousFavorites }
    },
    
    // 🎓 LEARNING: onError rolls back on failure  
    onError: (_err, _variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites)
      }
    },
    
    // 🎓 LEARNING: onSettled runs after success or error
    onSettled: () => {
      // Refetch favorites to sync with server
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

// 🎓 EDUCATIONAL SUMMARY:
// 
// What you just learned:
// 1. Query Keys: How TanStack Query organizes cached data
// 2. Basic Queries: Simple API calls with automatic caching
// 3. Enabled Queries: Conditional data fetching 
// 4. Infinite Queries: Netflix-style endless scrolling
// 5. Optimistic Updates: Instant UI responses like real Netflix
// 6. Cache Management: How to keep data fresh and synchronized
//
// Next Step: Replace your existing components to use these hooks!
