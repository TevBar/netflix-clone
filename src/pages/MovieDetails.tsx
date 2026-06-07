import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Check, ThumbsUp, ThumbsDown } from 'lucide-react'
import { toast } from 'sonner'
import Header from '../assets/Components/Header'
import MovieCard from '../assets/Components/MovieCard'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { useSimilarMovies } from '../hooks/useNetflixQuery'
import { useMovieStore } from '../stores/movieStore'
import { useWatchProgressStore } from '../stores/watchProgressStore'
import { useRatingStore } from '../stores/ratingStore'
import { Play, X } from 'lucide-react';
import { useMovieVideos } from '../hooks/useMovieVideos';


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


  const { toggleMyList, isInMyList } = useMovieStore()
  const { startWatching, updateProgress } = useWatchProgressStore()
  const setRating = useRatingStore(state => state.setRating)
  const getRating = useRatingStore(state => state.getRating)


  const handleBackClick = () => {
    navigate({ to: '/' })
  }

  const { data: movie, isLoading, error } = useMovieDetails(parseInt(id));
  const { data: videos } = useMovieVideos(parseInt(id));
  const { data: similarData } = useSimilarMovies(parseInt(id));

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

  // Record this movie as "started" the moment its data arrives
  useEffect(() => {
    if (!movie) return
    startWatching({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    })
  }, [movie?.id])

  // ESC key + body scroll lock for video modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowVideoModal(false);
      }
    };

    if (showVideoModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showVideoModal]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        {/* Loading State */}
        {isLoading && (
          <div className="animate-pulse">
            <div className="w-full h-[50vh] bg-gray-800" />
            <div className="p-8 mt-8 flex flex-col lg:flex-row gap-8">
              <div className="shrink-0 w-64 sm:w-72 lg:w-80 h-120 bg-gray-800 rounded-lg" />
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="h-10 bg-gray-800 rounded w-2/3" />
                <div className="h-6 bg-gray-800 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-800 rounded w-5/6" />
                  <div className="h-4 bg-gray-800 rounded w-4/6" />
                </div>
              </div>
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
                <div className="absolute inset-0 bg-gray-900 animate-pulse" />
                )}
                <img
                src={movie.backdrop_path || ''}
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
                      <div className="absolute inset-0 w-80 h-120 bg-gray-800 animate-pulse rounded-lg" />
                    )}
                    <img
                      src={posterError ? '/placeholder-poster.jpg' : (movie.poster_path || '/placeholder-poster.jpg')}
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
                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

                    {/* Rating + Year + Runtime */}
                    <div className="flex items-center gap-6 mb-3">
                      <span className="text-yellow-400 text-xl font-semibold">
                        ★ {movie.vote_average.toFixed(1)}/10
                      </span>
                      <span className="text-gray-400">
                        {movie.release_date?.split('-')[0] ?? 'Unknown'}
                      </span>
                      {movie.runtime > 0 && (
                        <span className="text-gray-400">
                          {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                        </span>
                      )}
                    </div>

                    {/* Genres */}
                    {movie.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {movie.genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() => navigate({ to: '/genre/$id', params: { id: String(genre.id) } })}
                            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
                          >
                            {genre.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Overview */}
                    <p className="text-gray-300 leading-relaxed max-w-2xl mb-8 text-base">{movie.overview}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {/* My List Button */}
                      <button
                        onClick={() => {
                          const wasInList = isInMyList(movie.id)
                          toggleMyList(movie)
                          toast.success(
                            wasInList
                              ? `Removed from My List`
                              : `${movie.title} added to My List!`
                          )
                        }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                          isInMyList(movie.id)
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <motion.div
                          whileTap={{ scale: 1.4 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          {isInMyList(movie.id)
                            ? <Check size={20} />
                            : <Plus size={20} />}
                        </motion.div>
                        {isInMyList(movie.id) ? 'In My List' : '+ My List'}
                      </button>

                      {/* Rating Buttons */}
                      {movie && (
                        <>
                          <button
                            onClick={() => {
                              const prev = getRating(movie.id)
                              setRating(movie.id, 'up')
                              toast.success(prev === 'up' ? 'Rating removed' : 'Rated thumbs up!')
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                              getRating(movie.id) === 'up'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                            title="Thumbs up"
                          >
                            <ThumbsUp size={20} />
                          </button>
                          <button
                            onClick={() => {
                              const prev = getRating(movie.id)
                              setRating(movie.id, 'down')
                              toast.success(prev === 'down' ? 'Rating removed' : 'Rated thumbs down')
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                              getRating(movie.id) === 'down'
                                ? 'bg-gray-500 hover:bg-gray-400 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                            title="Thumbs down"
                          >
                            <ThumbsDown size={20} />
                          </button>
                        </>
                      )}

                      {/* Trailer Button with Dropdown (STEP 3) */}
                      {youtubeVideos.length > 0 && (
                        <div className="relative group">
                          <button
                            onClick={() => {
                              setShowVideoModal(true)
                              updateProgress(movie.id, 5)
                            }}
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

                    {/* Director */}
                    {movie.credits?.crew?.find(m => m.job === 'Director') && (
                      <p className="mt-6 text-sm text-gray-400">
                        Directed by{' '}
                        <span className="text-white font-medium">
                          {movie.credits.crew.find(m => m.job === 'Director')?.name}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Cast Section */}
                {movie.credits?.cast?.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {movie.credits.cast.slice(0, 12).map((actor) => (
                        <div key={actor.name} className="shrink-0 w-28 text-center">
                          <div className="w-28 h-36 rounded-lg overflow-hidden bg-gray-800 mb-2">
                            {actor.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                                ?
                              </div>
                            )}
                          </div>
                          <p className="text-white text-xs font-medium leading-tight">{actor.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5 leading-tight truncate" title={actor.character}>
                            {actor.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* More Like This */}
                {(similarData?.movies?.length ?? 0) > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {similarData!.movies.slice(0, 12).map((similarMovie) => (
                        <div key={similarMovie.id} className="shrink-0">
                          <MovieCard movie={similarMovie} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  height={iframeHeight}
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
