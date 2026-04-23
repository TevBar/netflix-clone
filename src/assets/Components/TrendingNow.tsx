// Phase 13 Step 4: TrendingNow with TanStack Query - Educational Implementation
// This shows you how TanStack Query transforms your components!

// 🎓 LEARNING: Import our new TanStack Query hook instead of the old one
import { useTrendingMovies } from '../../hooks/useNetflixQueries';
import MovieCard from './MovieCard';

export const TrendingNow = () => {
  // 🎓 LEARNING: Notice how much cleaner this is with TanStack Query!
  // No more manual loading states, error handling, or useEffect cleanup
  const { data: movies, isLoading, error, isError } = useTrendingMovies('week');

  // 🎓 LEARNING: TanStack Query provides better loading state names
  // isLoading = true on first fetch, isFetching = true on background refetch
  if (isLoading) {
    return (
      <section aria-label="Trending movies section" className="text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" id="trending-heading">
            Trending Now
          </h2>
          <div 
            className="flex space-x-4 overflow-x-auto pb-4"
            aria-live="polite"
            aria-label="Loading trending movies"
          >
            {/* 🎓 LEARNING: Netflix-style skeleton loading */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="min-w-50 h-75 bg-gray-800 rounded-lg animate-pulse shrink-0"
                aria-label={`Loading movie ${index + 1} of 6`}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // 🎓 LEARNING: TanStack Query provides isError boolean and error object
  if (isError) {
    return (
      <section aria-label="Trending movies section" className="text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">
              {error?.message || 'Failed to load trending movies'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  // 🎓 LEARNING: TanStack Query automatically handles empty states
  if (!movies || movies.length === 0) {
    return (
      <section aria-label="Trending movies section" className="text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          <p className="text-gray-400">No trending movies available</p>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Trending movies section" className="text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6" id="trending-heading">
          Trending Now
        </h2>
        <div 
          className="flex space-x-4 overflow-x-auto pb-4"
          role="list"
          aria-labelledby="trending-heading"
        >
          {/* 🎓 LEARNING: Display cached movies - no trendingPosition needed for now */}
          {movies.slice(0, 6).map((movie) => (
            <div key={movie.id} role="listitem">
              <MovieCard 
                movie={movie}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingNow;