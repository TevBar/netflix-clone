import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tmdbApi } from '../services/tmdbApi'
import type { Movie } from '../assets/Components/types'

// Query keys for consistent caching
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    trending: (timeWindow: 'day' | 'week' = 'week') => ['movies', 'trending', timeWindow] as const,
    popular: ['movies', 'popular'] as const,
    nowPlaying: ['movies', 'now-playing'] as const,
    topRated: ['movies', 'top-rated'] as const,
    search: (query: string) => ['movies', 'search', query] as const,
    byGenre: (genreId: number) => ['movies', 'by-genre', genreId] as const,
  },
  genres: {
    all: ['genres'] as const,
  },
} as const

// 🚀 NETFLIX-LEVEL PERFORMANCE: Trending movies with caching
export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: queryKeys.movies.trending(timeWindow),
    queryFn: () => tmdbApi.getTrending(timeWindow),
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Cache for 10 minutes
  })
}

// 🚀 INFINITE SCROLL: Popular movies (Netflix-style browsing)
export function usePopularMoviesInfinite() {
  return useInfiniteQuery({
    queryKey: queryKeys.movies.popular,
    queryFn: ({ pageParam = 1 }) => tmdbApi.getPopular(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1
      return nextPage <= lastPage.totalPages ? nextPage : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 🚀 INSTANT SEARCH: Search with debounced queries
export function useMovieSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.movies.search(query),
    queryFn: () => tmdbApi.searchMovies(query),
    enabled: enabled && query.length > 2, // Only search if query is meaningful
    staleTime: 2 * 60 * 1000, // Search results cache for 2 minutes
  })
}

// 🚀 BACKGROUND SYNC: Now playing movies
export function useNowPlayingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.nowPlaying,
    queryFn: () => tmdbApi.getNowPlaying(),
    refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
    staleTime: 5 * 60 * 1000,
  })
}

// 🚀 TOP RATED: Cached top rated movies
export function useTopRatedMovies() {
  return useQuery({
    queryKey: queryKeys.movies.topRated,
    queryFn: () => tmdbApi.getTopRated(),
    staleTime: 30 * 60 * 1000, // Top rated changes slowly, cache longer
    gcTime: 60 * 60 * 1000,    // Keep in memory for 1 hour
  })
}

// 🚀 CACHED GENRES: Load once, use everywhere
export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres.all,
    queryFn: () => tmdbApi.getGenres(),
    staleTime: 60 * 60 * 1000, // Genres rarely change, cache for 1 hour
    gcTime: 2 * 60 * 60 * 1000, // Keep in memory for 2 hours
  })
}

// 🚀 OPTIMISTIC UPDATES: User favorites (Netflix responsiveness)
export function useFavoritesMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ movie, action }: { movie: Movie, action: 'add' | 'remove' }) => {
      // Simulate API call (replace with real endpoint when available)
      await new Promise(resolve => setTimeout(resolve, 500))
      return { movie, action }
    },
    onMutate: async ({ movie, action }) => {
      // Cancel outgoing refetches (prevents race conditions)
      await queryClient.cancelQueries({ queryKey: ['user', 'favorites'] })
      
      // Snapshot previous value for rollback
      const previousFavorites = queryClient.getQueryData(['user', 'favorites'])
      
      // Optimistically update favorites list
      queryClient.setQueryData(['user', 'favorites'], (old: Movie[] = []) => {
        if (action === 'add') {
          return old.find(m => m.id === movie.id) ? old : [...old, movie]
        } else {
          return old.filter(m => m.id !== movie.id)
        }
      })
      
      return { previousFavorites }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(['user', 'favorites'], context.previousFavorites)
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] })
    },
  })
}

// 🚀 PREFETCH STRATEGY: Preload movie data on hover (Netflix-style)
export function usePrefetchMovies() {
  const queryClient = useQueryClient()
  
  return {
    prefetchTrending: (timeWindow: 'day' | 'week' = 'week') => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.movies.trending(timeWindow),
        queryFn: () => tmdbApi.getTrending(timeWindow),
        staleTime: 5 * 60 * 1000,
      })
    },
    prefetchPopular: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.movies.popular,
        queryFn: () => tmdbApi.getPopular(),
        staleTime: 5 * 60 * 1000,
      })
    }
  }
}
