import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ArrowLeft , Heart, Bookmark } from 'lucide-react'
import Header from '../assets/Components/Header'
import { useMovieDetails } from '../hooks/useMovieDetails'  
import { useMovieStore } from '../stores/movieStore'
import { Play, X } from 'lucide-react';  // Add Play and X icons
import { useMovieVideos } from '../hooks/useMovieVideos';

// TMDB configuration
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const BACKDROP_SIZE = 'w1280'
const POSTER_SIZE = 'w500'

function getImageUrl(path: string | null, size: string): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

const MovieDetails = () => {
  const { id } = useParams({ from: '/movie/$id' })
  const navigate = useNavigate()
  const [backdropLoading, setBackdropLoading] = useState(true)
  const [posterLoading, setPosterLoading] = useState(true)  
  const [posterError, setPosterError] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null)

  // Calculate responsive iframe height (16:9 aspect ratio)
  const getIframeHeight = () => {
    if (typeof window === 'undefined') return 600
    const maxWidth = Math.min(window.innerWidth - 32, 896) // max-w-4xl with padding
    return Math.round((maxWidth * 9) / 16) // 16:9 aspect ratio
  }
  const [iframeHeight, setIframeHeight] = useState(getIframeHeight())


  // Zustand store for favorites and watchlist
  const { 
    toggleFavorite,
    toggleWatchlist,
    isFavorite,
    isInWatchlist
  } = useMovieStore()


  const handleBackClick = () => {
    navigate({ to: '/' })
  }

  const { data: movie, isLoading, error } = useMovieDetails(parseInt(id));
  const { data: videos } = useMovieVideos(parseInt(id));

  // Find all YouTube videos (trailers, clips, teasers)
  const youtubeVideos = videos?.results?.filter(
    (video) => video.site === 'YouTube'
  ) || [];

  // Get the trailer or first available video
  const trailer = youtubeVideos.find(
    (video) => video.type === 'Trailer'
  ) || youtubeVideos[0];

  // Get selected video or fall back to trailer
  const selectedVideo = selectedVideoKey 
    ? youtubeVideos.find(v => v.key === selectedVideoKey)
    : trailer;

  // Handle window resize for responsive iframe height
  useEffect(() => {
    const handleResize = () => {
      setIframeHeight(getIframeHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ESC key handler to close modal (STEP 1)
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideoModal) {
        setShowVideoModal(false);
      }
    };

    if (showVideoModal) {
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showVideoModal]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              </div>
              <p className="text-gray-400 text-lg">Loading movie details...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Movie</h1>
              <p className="text-gray-400 mb-6">{error?.message || 'Failed to fetch movie details. Please try again.'}</p>
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors mx-auto"
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {movie && !isLoading && !error && (
          <div className="relative">
            <div className="relative min-h-screen">
              {/* Backdrop Image */}
              {/* Background Image */}
            {movie.backdrop_path && (
            <div className="absolute inset-0">
                {backdropLoading && (
                <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
                    <div className="text-gray-400">Loading backdrop...</div>
                </div>
                )}
                <img 
                src={getImageUrl(movie.backdrop_path, BACKDROP_SIZE) || ''}
                alt={`${movie.title} backdrop`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    backdropLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setBackdropLoading(false)}
                onError={() => {
                    // Handle backdrop loading error
                    setBackdropLoading(false)
                }}
                />
            </div>
            )}
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/70" />
              
              {/* Content */}
              <div className="relative z-10 p-8">
                <button 
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg mb-6 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Home
                </button>
                
                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                  {/* Movie Poster */}
                  <div className="shrink-0 relative w-full lg:w-auto flex justify-center lg:justify-start">
                    {posterLoading && (
                      <div className="absolute inset-0 w-80 h-120 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                        <div className="text-gray-400 text-sm">Loading poster...</div>
                      </div>
                    )}
                    <img
                      src={posterError ? '/placeholder-poster.jpg' : getImageUrl(movie.poster_path, POSTER_SIZE) || '/placeholder-poster.jpg'}
                    alt={movie.title}
                    className={`w-64 sm:w-72 lg:w-80 rounded-lg shadow-2xl transition-opacity duration-300 ${
                        posterLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setPosterLoading(false)}
                    onError={() => {
                        setPosterError(true)
                        setPosterLoading(false)
                    }}
                    />

                  </div>
                  
                  {/* Movie Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Title, Rating, Release Date */}
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                    <div className="flex items-center gap-6 mb-6">
                      <span className="text-yellow-400 text-xl font-semibold">★ {movie.vote_average}/10</span>
                      <span className="text-gray-400">{movie.release_date}</span>
                    </div>

                    {/* Overview */}
                    <p className="text-gray-300 leading-relaxed max-w-2xl mb-8 text-base">{movie.overview}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {/* Favorites Button */}
                      <button
                        onClick={() => toggleFavorite(movie)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                          isFavorite(movie.id)
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <Heart 
                          size={20} 
                          className={isFavorite(movie.id) ? 'fill-current' : ''} 
                        />
                        {isFavorite(movie.id) ? 'Favorited' : 'Favorite'}
                      </button>

                      {/* Watchlist Button */}
                      <button
                        onClick={() => toggleWatchlist(movie)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                          isInWatchlist(movie.id)
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <Bookmark 
                          size={20} 
                          className={isInWatchlist(movie.id) ? 'fill-current' : ''} 
                        />
                        {isInWatchlist(movie.id) ? 'Saved' : 'Save'}
                      </button>

                      {/* Trailer Button with Dropdown (STEP 3) */}
                      {youtubeVideos.length > 0 && (
                        <div className="relative group">
                          <button
                            onClick={() => setShowVideoModal(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Play size={20} />
                            {youtubeVideos.length > 1 ? 'Videos' : 'Trailer'}
                          </button>
                          
                          {/* Dropdown Menu - shows on hover (STEP 3) */}
                          {youtubeVideos.length > 1 && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40 max-h-64 overflow-y-auto md:max-h-96">
                              {youtubeVideos.map((video) => (
                                <button
                                  key={video.key}
                                  onClick={() => {
                                    setSelectedVideoKey(video.key);
                                    setIsVideoLoading(true);
                                    setShowVideoModal(true);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-yellow-600 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                  title={video.name}
                                >
                                  <div className="font-semibold">{video.type}</div>
                                  <div className="text-gray-300 text-xs truncate">{video.name.length > 35 ? video.name.substring(0, 32) + '...' : video.name}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal with Loading Spinner (STEP 2) and Selected Video (STEP 4) */}
        {showVideoModal && selectedVideo && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl">
              <button 
                onClick={() => {
                  setShowVideoModal(false);
                  setSelectedVideoKey(null);
                  setIsVideoLoading(true);
                }} 
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              
              {/* Loading Spinner (STEP 2) */}
              {isVideoLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-yellow-600 font-semibold">Loading video...</p>
                  </div>
                </div>
              )}
              
              {/* YouTube iframe (STEP 4 - uses selectedVideo) */}
              {selectedVideo && (
                <iframe
                  width="100%"
                  height="600"
                  src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                  title={selectedVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsVideoLoading(false)}
                  className="rounded-lg"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MovieDetails
