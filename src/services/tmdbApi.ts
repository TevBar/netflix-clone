import { env, getImageUrl, getBackdropUrl } from '../config/environment';
import type { Movie, Genre } from '../assets/Components/types';

// TMDB API Response Types
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

// Custom Error Classes
export class TMDBApiError extends Error {
  public status?: number;
  public statusText?: string;
  
  constructor(
    message: string,
    status?: number,
    statusText?: string
  ) {
    super(message);
    this.name = 'TMDBApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

export class TMDBNetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'TMDBNetworkError';
  }
}

// API Configuration
const API_CONFIG = {
  baseUrl: env.tmdb.baseUrl,
  apiKey: env.tmdb.apiKey,
  timeout: 10000, // 10 seconds
} as const;

// Helper function to create API URLs
const createApiUrl = (endpoint: string, params: Record<string, string | number> = {}) => {
  const url = new URL(`${API_CONFIG.baseUrl}${endpoint}`);
  
  // Add API key
  url.searchParams.set('api_key', API_CONFIG.apiKey);
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  
  return url.toString();
};

// Generic fetch with error handling and timeout
const fetchWithErrorHandling = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    console.log('🌐 Fetching from TMDB API:', url.replace(API_CONFIG.apiKey, '[API_KEY_HIDDEN]'));
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = `TMDB API Error: ${response.status} ${response.statusText}`;
      console.error('❌', errorMessage);
      
      if (response.status === 401) {
        throw new TMDBApiError(
          'Invalid API key. Please check your TMDB API key in the .env file.',
          response.status,
          response.statusText
        );
      }
      
      if (response.status === 404) {
        throw new TMDBApiError(
          'Resource not found.',
          response.status,
          response.statusText
        );
      }
      
      throw new TMDBApiError(errorMessage, response.status, response.statusText);
    }

    const data = await response.json();
    console.log('✅ TMDB API response received successfully');
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof TMDBApiError) {
      throw error;
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TMDBNetworkError('Request timed out. Please check your internet connection.');
    }
    
    if (error instanceof TypeError) {
      throw new TMDBNetworkError('Network error. Please check your internet connection.');
    }
    
    throw new TMDBNetworkError(`Unexpected error: ${(error as Error).message}`);
  }
};

// Transform TMDB movie data to our Movie type
const transformTMDBMovie = (tmdbMovie: TMDBMovie): Movie => ({
  id: tmdbMovie.id,
  title: tmdbMovie.title,
  overview: tmdbMovie.overview,
  poster_path: tmdbMovie.poster_path ? getImageUrl(tmdbMovie.poster_path) : null,
  backdrop_path: tmdbMovie.backdrop_path ? getBackdropUrl(tmdbMovie.backdrop_path) : null,
  release_date: tmdbMovie.release_date,
  vote_average: tmdbMovie.vote_average,
  vote_count: tmdbMovie.vote_count,
  genre_ids: tmdbMovie.genre_ids,
});

// API Functions
export const tmdbApi = {
  // Fetch trending movies
  getTrending: async (timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> => {
    try {
      const url = createApiUrl(`/trending/movie/${timeWindow}`);
      const response = await fetchWithErrorHandling<TMDBResponse<TMDBMovie>>(url);
      
      return response.results.map(transformTMDBMovie);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<{ movies: Movie[]; totalPages: number }> => {
    try {
      if (!query.trim()) {
        return { movies: [], totalPages: 0 };
      }

      const url = createApiUrl('/search/movie', {
        query: encodeURIComponent(query.trim()),
        page,
        include_adult: 'false',
      });
      
      const response = await fetchWithErrorHandling<TMDBResponse<TMDBMovie>>(url);
      
      return {
        movies: response.results.map(transformTMDBMovie),
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Fetch movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<{ movies: Movie[]; totalPages: number }> => {
    try {
      const url = createApiUrl('/discover/movie', {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
        include_adult: 'false',
      });
      
      const response = await fetchWithErrorHandling<TMDBResponse<TMDBMovie>>(url);
      
      return {
        movies: response.results.map(transformTMDBMovie),
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // Fetch all available genres
  getGenres: async (): Promise<Genre[]> => {
    try {
      const url = createApiUrl('/genre/movie/list');
      const response = await fetchWithErrorHandling<TMDBGenresResponse>(url);
      
      return response.genres.map(genre => ({
        id: genre.id,
        name: genre.name,
      }));
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // Fetch popular movies
  getPopular: async (page: number = 1): Promise<{ movies: Movie[]; totalPages: number }> => {
    try {
      const url = createApiUrl('/movie/popular', { page });
      const response = await fetchWithErrorHandling<TMDBResponse<TMDBMovie>>(url);
      
      return {
        movies: response.results.map(transformTMDBMovie),
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Fetch now playing movies
  getNowPlaying: async (page: number = 1): Promise<{ movies: Movie[]; totalPages: number }> => {
    try {
      const url = createApiUrl('/movie/now_playing', { page });
      const response = await fetchWithErrorHandling<TMDBResponse<TMDBMovie>>(url);
      
      return {
        movies: response.results.map(transformTMDBMovie),
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  // Fetch top rated movies
  getTopRated: async (page: number = 1): Promise<{ movies: Movie[]; totalPages: number }> => {
    try {
      const url = createApiUrl('/movie/top_rated', { page });
      const response = await fetchWithErrorHandling<TMDBResponse<TMDBMovie>>(url);
      
      return {
        movies: response.results.map(transformTMDBMovie),
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },
};