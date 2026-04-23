import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ArrowLeft , Heart, Bookmark } from 'lucide-react'
import Header from '../assets/Components/Header'
import mockData from '../data/mockData.json'
import type { Movie } from '../assets/Components/types'
import { useMovieStore } from '../stores/movieStore'

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
  const [movie, setMovie] = useState<Movie | null>(null)
  const [backdropLoading, setBackdropLoading] = useState(true)
  const [posterLoading, setPosterLoading] = useState(true)  
  const [posterError, setPosterError] = useState(false)


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

  useEffect(() => {
    if (id) {
      console.log('Looking for movie with ID:', id)
      const foundMovie = mockData.movies.find(m => m.id === parseInt(id))
      console.log('Found movie:', foundMovie)
      setMovie(foundMovie ? foundMovie as Movie : null)
    }
  }, [id])

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        <div className="relative">
          {movie ? (
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
                  <div className="flex-shrink-0 relative w-full lg:w-auto flex justify-center lg:justify-start">
                    {posterLoading && (
                      <div className="absolute inset-0 w-80 h-[480px] bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
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
                  <div className="flex-1">
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                    <p className="text-yellow-400 text-xl mb-2">★ {movie.vote_average}/10</p>
                    <p className="text-gray-300 mb-6">{movie.release_date}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-6">
                      {/* Favorites Button */}
                      <button
                        onClick={() => toggleFavorite(movie)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                          isFavorite(movie.id)
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <Heart 
                          size={20} 
                          className={isFavorite(movie.id) ? 'fill-current' : ''} 
                        />
                        {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>

                      {/* Watchlist Button */}
                      <button
                        onClick={() => toggleWatchlist(movie)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                          isInWatchlist(movie.id)
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <Bookmark 
                          size={20} 
                          className={isInWatchlist(movie.id) ? 'fill-current' : ''} 
                        />
                        {isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">Debug Info</h1>
              <p className="text-gray-400">URL ID: {id}</p>
              <p className="text-gray-400">Movie state: {movie ? 'Found' : 'Not found'}</p>
              <p className="text-gray-400">Total movies in data: {mockData.movies.length}</p>
              <p className="text-gray-400">First movie ID: {mockData.movies[0]?.id}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MovieDetails
