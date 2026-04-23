import { useMovieStore } from '../stores/movieStore'
import { Link } from '@tanstack/react-router'
import { Bookmark, ArrowLeft } from 'lucide-react'
import Header from '../assets/Components/Header'
import MovieCard from '../assets/Components/MovieCard'

const WatchlistPage = () => {
  // Get watchlist from our Zustand store
  const { watchlist } = useMovieStore()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Bookmark className="text-blue-500 fill-current" size={32} />
            <h1 className="text-4xl font-bold">My Watchlist</h1>
            <span className="text-gray-400 text-lg">({watchlist.length} movies)</span>
          </div>

          {/* Content Area */}
          {watchlist.length > 0 ? (
            /* Movies Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {watchlist.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bookmark size={64} className="text-gray-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-300">No movies in watchlist</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Save movies you want to watch later by clicking the bookmark icon!
              </p>
              <Link 
                to="/" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Discover Movies
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default WatchlistPage
