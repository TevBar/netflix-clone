import { useParams, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from '../assets/Components/Header'
import MovieCard from '../assets/Components/MovieCard'
import { useMoviesByGenreInfinite, useGenres } from '../hooks/useNetflixQuery'

const GenrePage = () => {
  const { id } = useParams({ from: '/genre/$id' })
  const navigate = useNavigate()
  const genreId = parseInt(id)
  const loaderRef = useRef<HTMLDivElement>(null)

  const { data: genres } = useGenres()
  const genreName = genres?.find(g => g.id === genreId)?.name ?? 'Genre'

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useMoviesByGenreInfinite(genreId)

  const movies = data?.pages.flatMap(page => page.movies) ?? []

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-24 px-8 pb-16">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold mb-2">{genreName}</h1>
        <p className="text-gray-400 mb-8">
          {movies.length > 0 ? `${movies.length}+ movies` : ''}
        </p>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl mb-4">Failed to load movies</p>
            <p className="text-sm">Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && movies.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl">No movies found for this genre.</p>
          </div>
        )}

        {movies.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} size="md" />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel — fetchNextPage triggers when this enters viewport */}
        <div ref={loaderRef} className="h-12 mt-8 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {!hasNextPage && movies.length > 0 && !isLoading && (
          <p className="text-center text-gray-600 text-sm mt-4">
            All {genreName} movies loaded
          </p>
        )}
      </div>
    </>
  )
}

export default GenrePage
