import { useState, useEffect, useCallback } from 'react';
import { tmdbApi, TMDBApiError, TMDBNetworkError } from '../services/tmdbApi';
import type { Movie, Genre } from '../assets/Components/types';

// Loading state type
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic hook for API operations with loading states
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Hook for fetching trending movies
export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'week'): UseApiState<Movie[]> => {
  const [state, setState] = useState<{
    data: Movie[] | null;
    loading: boolean;
    error: string | null;
    loadingState: LoadingState;
  }>({
    data: null,
    loading: true,
    error: null,
    loadingState: 'idle',
  });

  // Separate the fetch logic from useCallback to avoid dependency issues
  useEffect(() => {
    let cancelled = false;

    const fetchTrending = async () => {
      setState(prev => ({ ...prev, loading: true, error: null, loadingState: 'loading' }));

      try {
        console.log('📈 Fetching trending movies...');
        const movies = await tmdbApi.getTrending(timeWindow);
        
        if (!cancelled) {
          setState({
            data: movies,
            loading: false,
            error: null,
            loadingState: 'success',
          });
          console.log(`✅ Fetched ${movies.length} trending movies`);
        }
      } catch (error) {
        if (!cancelled) {
          const errorMessage = error instanceof TMDBApiError || error instanceof TMDBNetworkError 
            ? error.message 
            : 'Failed to fetch trending movies';

          setState({
            data: null,
            loading: false,
            error: errorMessage,
            loadingState: 'error',
          });
          
          console.error('❌ Error fetching trending movies:', errorMessage);
        }
      }
    };

    void fetchTrending();

    return () => {
      cancelled = true;
    };
  }, [timeWindow]);

  const refetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, loadingState: 'loading' }));

    try {
      console.log('🔄 Refetching trending movies...');
      const movies = await tmdbApi.getTrending(timeWindow);
      
      setState({
        data: movies,
        loading: false,
        error: null,
        loadingState: 'success',
      });
      
      console.log(`✅ Refetched ${movies.length} trending movies`);
    } catch (error) {
      const errorMessage = error instanceof TMDBApiError || error instanceof TMDBNetworkError 
        ? error.message 
        : 'Failed to fetch trending movies';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        loadingState: 'error',
      });
      
      console.error('❌ Error refetching trending movies:', errorMessage);
    }
  }, [timeWindow]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
};

// Hook for searching movies
export const useMovieSearch = () => {
  const [state, setState] = useState<{
    data: Movie[] | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
  }>({
    data: null,
    loading: false,
    error: null,
    totalPages: 0,
  });

  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setState({
        data: [],
        loading: false,
        error: null,
        totalPages: 0,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`🔍 Searching movies: "${query}" (page ${page})`);
      const result = await tmdbApi.searchMovies(query, page);
      
      setState({
        data: result.movies,
        loading: false,
        error: null,
        totalPages: result.totalPages,
      });
      
      console.log(`✅ Found ${result.movies.length} movies for "${query}"`);
    } catch (error) {
      const errorMessage = error instanceof TMDBApiError || error instanceof TMDBNetworkError 
        ? error.message 
        : 'Failed to search movies';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        totalPages: 0,
      });
      
      console.error('❌ Error searching movies:', errorMessage);
    }
  }, []);

  return {
    ...state,
    searchMovies,
  };
};

// Hook for fetching movies by genre
export const useMoviesByGenre = () => {
  const [state, setState] = useState<{
    data: Movie[] | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
  }>({
    data: null,
    loading: false,
    error: null,
    totalPages: 0,
  });

  const fetchByGenre = useCallback(async (genreId: number, page: number = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`🎭 Fetching movies by genre ${genreId} (page ${page})`);
      const result = await tmdbApi.getMoviesByGenre(genreId, page);
      
      setState({
        data: result.movies,
        loading: false,
        error: null,
        totalPages: result.totalPages,
      });
      
      console.log(`✅ Found ${result.movies.length} movies for genre ${genreId}`);
    } catch (error) {
      const errorMessage = error instanceof TMDBApiError || error instanceof TMDBNetworkError 
        ? error.message 
        : 'Failed to fetch movies by genre';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        totalPages: 0,
      });
      
      console.error('❌ Error fetching movies by genre:', errorMessage);
    }
  }, []);

  return {
    ...state,
    fetchByGenre,
  };
};

// Hook for fetching genres
export const useGenres = (): UseApiState<Genre[]> => {
  const [state, setState] = useState<{
    data: Genre[] | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchGenres = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🎬 Fetching movie genres...');
      const genres = await tmdbApi.getGenres();
      
      setState({
        data: genres,
        loading: false,
        error: null,
      });
      
      console.log(`✅ Fetched ${genres.length} genres`);
    } catch (error) {
      const errorMessage = error instanceof TMDBApiError || error instanceof TMDBNetworkError 
        ? error.message 
        : 'Failed to fetch genres';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      console.error('❌ Error fetching genres:', errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchGenres,
  };
};

// Hook for fetching multiple movie categories
export const useMovieCategories = () => {
  const [state, setState] = useState<{
    popular: Movie[] | null;
    nowPlaying: Movie[] | null;
    topRated: Movie[] | null;
    loading: boolean;
    error: string | null;
  }>({
    popular: null,
    nowPlaying: null,
    topRated: null,
    loading: true,
    error: null,
  });

  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📚 Fetching movie categories...');
      
      // Fetch all categories in parallel
      const [popularResult, nowPlayingResult, topRatedResult] = await Promise.all([
        tmdbApi.getPopular(),
        tmdbApi.getNowPlaying(),
        tmdbApi.getTopRated(),
      ]);

      setState({
        popular: popularResult.movies,
        nowPlaying: nowPlayingResult.movies,
        topRated: topRatedResult.movies,
        loading: false,
        error: null,
      });
      
      console.log('✅ Fetched all movie categories');
    } catch (error) {
      const errorMessage = error instanceof TMDBApiError || error instanceof TMDBNetworkError 
        ? error.message 
        : 'Failed to fetch movie categories';

      setState({
        popular: null,
        nowPlaying: null,
        topRated: null,
        loading: false,
        error: errorMessage,
      });
      
      console.error('❌ Error fetching movie categories:', errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    refetch: fetchCategories,
  };
};
