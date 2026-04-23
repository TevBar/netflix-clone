import { useInfinateMovies } from '../../hooks/useNetflixQueries'
import { useEffect } from 'react'
import { useInView} from 'react'
import MovieCard from './MovieCard'


interface InfinteMovieGridGroups { 
    category: 'popular' | 'top_rated' | 'now_playing'
    title: string
}

export function InfinateMovieGrid({ category, title }: InfinateMovieGridProps) { 
    const {
        data, 
        fetchNextPage,
        hasNextPage, 
        isFetchingNextPage,
        isLoading,
        isError, 
    } = useInfinateMovies(category)


    const { ref, inView} = useInview({
        threshold: 0,
        rootMargin: '100px',
    })


      // Trigger loading next page when user scrolls near bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
  
  if (isLoading) {
    return (
      <section className="px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    )
  }

    if (isError) {
    return (
      <section className="px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Failed to load {title.toLowerCase()}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }


// Flatten all pages into single array
  const movies = data?.pages.flatMap(page => page.movies) ?? []
  
  return (
    <section className="px-8 py-16">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}
      
      {/* Invisible trigger for infinite scroll */}
      <div ref={ref} className="h-10" />
      
      {/* End message */}
      {!hasNextPage && movies.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No more {title.toLowerCase()} to load</p>
        </div>
      )}
    </section>
  )
}