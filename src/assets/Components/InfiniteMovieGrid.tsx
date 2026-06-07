import { useInfiniteMovies } from '../../hooks/useNetflixQuery'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import MovieCard from './MovieCard'

interface InfiniteMovieGridProps {
    category: 'popular' | 'top_rated' | 'now_playing'
    title: string
}

export function InfiniteMovieGrid({ category, title }: InfiniteMovieGridProps) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteMovies(category)

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    if (isLoading) {
        return (
            <section className="px-8 py-16">
                <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-2/3 bg-gray-800 rounded-lg animate-pulse"
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

    const movies = data?.pages.flatMap(page => page.movies) ?? []

    return (
        <section className="px-8 py-16">
            <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
                {movies.map((movie, index) => (
                    <motion.div
                        key={movie.id}
                        initial={index < 20 ? { opacity: 0, y: 20 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index < 20 ? index * 0.04 : 0 }}
                    >
                        <MovieCard movie={movie} />
                    </motion.div>
                ))}
            </div>

            {isFetchingNextPage && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 mt-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-2/3 bg-gray-800 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            )}

            <div ref={ref} className="h-10" />

            {!hasNextPage && movies.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400">No more {title.toLowerCase()} to load</p>
                </div>
            )}
        </section>
    )
}
