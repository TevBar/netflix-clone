// TypeScript type definitions for Netflix Clone
// This file centralizes all type definitions used across the application

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;  // Can be null if no poster available
  backdrop_path?: string | null;  // Made optional and can be null
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count?: number;  // Made optional for compatibility with mockData
  genre_ids?: number[];  // Made optional for compatibility with mockData
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieCategory {
  title: string;
  movies: Movie[];
}

export interface MovieListProps {
  movies: Movie[];
  showTrendingNumbers?: boolean;
}

// Future API types for TMDB integration
export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface APIError {
  status_code: number;
  status_message: string;
  success: boolean;
}

// Component prop types (placeholder for future expansion)
// export interface HeaderProps {
//   // Add header-specific props when needed
// }

// export interface HeroProps {
//   // Add hero-specific props when needed
// }

// export interface TrendingNowProps {
//   // Add trending now-specific props when needed
// }
