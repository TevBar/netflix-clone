import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tmdbApi } from '../services/tmdbApi'
import type { Movie } from '../assets/Components/types'

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

export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: queryKeys.movies.trending(timeWindow),
    queryFn: () => tmdbApi.getTrending(timeWindow),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

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

export function useInfiniteMovies(category: 'popular' | 'top_rated' | 'now_playing' = 'popular') {
  return useInfiniteQuery({
    queryKey: ['movies', category, 'infinite'],
    initialPageParam: 1,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      switch (category) {
        case 'popular': return tmdbApi.getPopular(pageParam)
        case 'top_rated': return tmdbApi.getTopRated(pageParam)
        case 'now_playing': return tmdbApi.getNowPlaying(pageParam)
        default: return tmdbApi.getPopular(pageParam)
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length
      const totalPages = lastPage.totalPages || 20
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useMovieSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.movies.search(query),
    queryFn: () => tmdbApi.searchMovies(query),
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}

export function useMovieSearchInfinite(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.movies.search(query), 'infinite'],
    queryFn: ({ pageParam }: { pageParam: number }) => tmdbApi.searchMovies(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    enabled: enabled && query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}

export function useNowPlayingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.nowPlaying,
    queryFn: () => tmdbApi.getNowPlaying(),
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTopRatedMovies() {
  return useQuery({
    queryKey: queryKeys.movies.topRated,
    queryFn: () => tmdbApi.getTopRated(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ['movies', 'similar', movieId],
    queryFn: () => tmdbApi.getSimilarMovies(movieId),
    staleTime: 10 * 60 * 1000,
    enabled: !!movieId && movieId > 0,
  })
}

export function useMoviesByGenre(genreId: number, page: number = 1) {
  return useQuery({
    queryKey: ['movies', 'by-genre', genreId, page],
    queryFn: () => tmdbApi.getMoviesByGenre(genreId, page),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!genreId && genreId > 0,
  })
}

export function useMoviesByGenreInfinite(genreId: number) {
  return useInfiniteQuery({
    queryKey: ['movies', 'by-genre', genreId, 'infinite'],
    queryFn: ({ pageParam }: { pageParam: number }) => tmdbApi.getMoviesByGenre(genreId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1
      return nextPage <= lastPage.totalPages ? nextPage : undefined
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: genreId > 0,
  })
}

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres.all,
    queryFn: () => tmdbApi.getGenres(),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  })
}

export function useFavoritesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ movie, action }: { movie: Movie, action: 'add' | 'remove' }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { movie, action }
    },
    onMutate: async ({ movie, action }) => {
      await queryClient.cancelQueries({ queryKey: ['user', 'favorites'] })
      const previousFavorites = queryClient.getQueryData(['user', 'favorites'])
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
      if (context?.previousFavorites) {
        queryClient.setQueryData(['user', 'favorites'], context.previousFavorites)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] })
    },
  })
}

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