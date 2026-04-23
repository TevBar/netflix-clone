import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { Movie } from './types';

// Props interface
interface MovieCardProps {
  movie: Movie;
  showTrendingNumber?: boolean;  // Updated prop name for consistency  
  trendingNumber?: number;       // The actual trending number
}

// TMDB Image Configuration
const TMDB_BASE_URL = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w342';

// Helper function to build TMDB image URLs
const getMoviePosterUrl = (posterPath: string | null): string => {
  if (!posterPath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjUxMyIgdmlld0JveD0iMCAwIDM0MiA1MTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNDIiIGhlaWdodD0iNTEzIiBmaWxsPSIjMWYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPk5vIFBvc3RlcjwvdGV4dD4KPHN2Zz4K';
  return `${TMDB_BASE_URL}${POSTER_SIZE}${posterPath}`;
};

const MovieCard = ({ movie, showTrendingNumber, trendingNumber }: MovieCardProps) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate({ to: `/movie/${movie.id}` });
  };

  // Keyboard accessibility handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}, rated ${movie.vote_average}/10, released ${movie.release_date}`}
      className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-50 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
    >
      <CardContent className="p-0 relative">
        <div className="relative aspect-2/3 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          <img
            src={imageError ? '/placeholder-poster.jpg' : getMoviePosterUrl(movie.poster_path)}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />

          {/* Trending number overlay - Netflix style */}
          {showTrendingNumber && trendingNumber && (
            <div className="absolute bottom-2 left-2">
              <div className="text-white font-black text-6xl leading-none drop-shadow-2xl" 
                   style={{ 
                     textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                     fontFamily: 'Arial Black, sans-serif'
                   }}>
                {trendingNumber}
              </div>
            </div>
          )}

          {/* Movie info overlay - only for non-trending movies */}
          {!showTrendingNumber && (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-4">
              <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{movie.title}</h3>
              <div className="flex items-center justify-between text-xs">
                <Badge variant="secondary" className="text-xs">
                  {movie.vote_average}/10
                </Badge>
                <span className="text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-white p-3 shadow-2xl transition-transform duration-200 hover:scale-110">
              <Play className="h-6 w-6 text-black fill-current" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MovieCard


