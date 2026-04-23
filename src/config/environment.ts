// Environment Configuration
// This file centralizes all environment variable access with type safety and validation

interface EnvironmentConfig {
  tmdb: {
    apiKey: string;
    baseUrl: string;
    imageBaseUrl: string;
  };
  development: {
    enableDevTools: boolean;
  };
}

// Validate that required environment variables are present
const validateEnvironment = (): EnvironmentConfig => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      '🔑 TMDB API Key is missing!\n\n' +
      'Please:\n' +
      '1. Create a .env file in the project root\n' +
      '2. Add: VITE_TMDB_API_KEY=your_actual_api_key\n' +
      '3. Get your API key from: https://www.themoviedb.org/settings/api'
    );
  }

  return {
    tmdb: {
      apiKey,
      baseUrl: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
      imageBaseUrl: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
    },
    development: {
      enableDevTools: import.meta.env.DEV === true,
    },
  };
};

// Export validated configuration
export const env = validateEnvironment();

// Helper functions for common image URLs
export const getImageUrl = (path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return '/placeholder-image.jpg'; // Fallback for missing images
  return `${env.tmdb.imageBaseUrl}/${size}${path}`;
};

// Helper function to get backdrop image URLs
export const getBackdropUrl = (path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!path) return '/hero-background.jpg'; // Fallback to our hero background
  return `${env.tmdb.imageBaseUrl}/${size}${path}`;
};
