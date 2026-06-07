import { Card, CardContent } from "@/components/ui/card";
import { Play, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRatingStore } from '../../stores/ratingStore';
import { useRecentlyViewedStore } from '../../stores/recentlyViewedStore';
import { useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { useMovieVideos } from '../../hooks/useMovieVideos'
import type { Movie } from './types';

interface MovieCardProps {
  movie: Movie;
  showTrendingNumber?: boolean;
  trendingNumber?: number;
  size?: 'sm' | 'md' | 'lg';
  watchProgress?: number;
}

const PLACEHOLDER_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjUxMyIgdmlld0JveD0iMCAwIDM0MiA1MTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNDIiIGhlaWdodD0iNTEzIiBmaWxsPSIjMWYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPk5vIFBvc3RlcjwvdGV4dD4KPHN2Zz4K'

const getPosterSrc = (movie: Movie): string => movie.poster_path || PLACEHOLDER_SVG
const getBackdropSrc = (movie: Movie): string => movie.backdrop_path || movie.poster_path || PLACEHOLDER_SVG

const MovieCard = ({ movie, showTrendingNumber, trendingNumber, size = 'md', watchProgress }: MovieCardProps) => {
  const navigate = useNavigate()
  const userRating = useRatingStore(state => state.ratings[movie.id] ?? null)
  const addViewed = useRecentlyViewedStore(state => state.addViewed)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [previewActive, setPreviewActive] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only fetch video when hovering an lg card for 1.5s — avoids N fetches on page load
  const { data: videoData } = useMovieVideos(movie.id, previewActive && size === 'lg')
  const previewKey = videoData?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
  const showPreview = previewActive && !!previewKey

  // Clear timer on unmount so no stale state update fires after the card is gone
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current)
    }
  }, [])

  const handleCardClick = () => {
    addViewed(movie)
    navigate({ to: `/movie/${movie.id}` })
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  const handleMouseEnter = () => {
    if (size !== 'lg') return
    hoverTimer.current = setTimeout(() => setPreviewActive(true), 1500)
  }

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setPreviewActive(false)
  }

  const isLandscape = size === 'lg'
  const widthClass = size === 'lg' ? 'w-[calc((100vw-112px-20px)/6)] min-w-[180px]' : size === 'sm' ? 'w-44' : 'w-50'
  const aspectClass = isLandscape ? 'aspect-video' : 'aspect-2/3'
  const imageSrc = imageError ? PLACEHOLDER_SVG : (isLandscape ? getBackdropSrc(movie) : getPosterSrc(movie))

  return (
    <Card
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}, rated ${movie.vote_average}/10, released ${movie.release_date}`}
      className={`group relative overflow-hidden rounded-none transition-all duration-300 ${size !== 'lg' ? 'hover:scale-110 hover:shadow-2xl hover:z-10' : ''} active:scale-95 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${widthClass}`}
    >
      <CardContent className="p-0 relative">
        <div className={`relative ${aspectClass} overflow-hidden rounded-none`}>
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}

          {/* Static poster/backdrop */}
          <img
            src={imageSrc}
            alt={movie.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />

          {/* Video preview — mounts on hover intent, fades in once key is ready */}
          {size === 'lg' && previewActive && (
            <iframe
              src={`https://www.youtube.com/embed/${previewKey ?? ''}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1`}
              title={`${movie.title} preview`}
              allow="autoplay; encrypted-media"
              className="absolute inset-0 w-full h-full"
              style={{
                border: 'none',
                pointerEvents: 'none',
                zIndex: 5,
                opacity: showPreview ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />
          )}

          {/* Trending number overlay — Netflix-style dark fill with gray stroke */}
          {showTrendingNumber && trendingNumber !== undefined && (
            <div
              className="absolute bottom-0 left-0 pointer-events-none select-none"
              style={{ zIndex: 15 }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif',
                  fontWeight: 900,
                  fontSize: '5.5rem',
                  lineHeight: 0.82,
                  color: '#141414',
                  WebkitTextStroke: '2.5px rgba(160, 160, 160, 0.85)',
                  letterSpacing: '-0.02em',
                }}
              >
                {trendingNumber}
              </span>
            </div>
          )}

          {/* Hover info overlay */}
          {!showTrendingNumber && (
            <div
              className={`absolute inset-x-0 bottom-0 h-0 opacity-0 overflow-hidden transition-all duration-300 ${isLandscape ? 'group-hover:h-2/5' : 'group-hover:h-2/3'} group-hover:opacity-100`}
              style={{ zIndex: 10 }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xs">★ {movie.vote_average.toFixed(1)}</span>
                  {userRating === 'up' && <ThumbsUp size={11} className="text-green-400" />}
                  {userRating === 'down' && <ThumbsDown size={11} className="text-gray-400" />}
                </div>
              </div>
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ zIndex: 10 }}>
            <div className="rounded-full bg-white p-3 shadow-2xl transition-transform duration-200 hover:scale-110">
              <Play className="h-6 w-6 text-black fill-current" />
            </div>
          </div>

          {/* Watch progress bar — only shown when watchProgress > 0 */}
          {watchProgress !== undefined && watchProgress > 0 && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-600" style={{ zIndex: 20 }}>
              <div
                className="h-full bg-red-600"
                style={{ width: `${Math.min(100, watchProgress)}%` }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MovieCard
