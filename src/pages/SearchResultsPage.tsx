import { useState, useEffect, useMemo } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import {Search, Filter, ArrowLeft, Loader2} from 'lucide-react'
import Header from '../assets/Components/Header'
import MovieCard from '../assets/Components/MovieCard'
import { useMovieSearch} from '../hooks/useNetflixQueries'
import type { Movie} from '../assets/Components/types'
import { useInView } from 'react-intersection-observer'



const SearchResultsPage = () => { 
    // Get the search query from URL parameters
    const searchParams = useSearch({ from: '/search'})
    const query = (searchParams as any)?.q || ''

    // State for filters  
    const [selectedGenre, setSelectedGenre] = useState<string>('all')
    const [selectedYear, setSelectedYear] = useState<string>('all')
    const [showTopTen, setShowTopTen] = useState<boolean>(false)
    const yearOptions= ['all', '2024', '2023', '2022', '2020']
    const sortOptions = ['popularity', 'rating', 'newest', 'oldest']
    const [sortBy, setSortBy] = useState<string>('popularity')

    // Use TanStack Query for real TMDB data
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useMovieSearch(query, query.length >= 3)

    // Intersection observer for infinite scroll
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    })

    // Get all movies from pages
    const allMovies: Movie[] = data?.pages?.flatMap(page => page.movies) || []
    
    // Available genres
    const genres = ['all', 'action', 'comedy', 'drama', 'thriller', 'sci-fi']

//  State for filtered movies

const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])

// Enhanced filtering with multiple criteria
useEffect(() => {
    let filtered = allMovies

    // Apply genre filter
    if (selectedGenre !== 'all') { 
        filtered = filtered.filter(movie => { 
            const title = movie.title.toLowerCase()
            switch (selectedGenre) {
                case 'action': 
                    return title.includes('action') || title.includes('fighter') || title.includes('war')
                case 'sci-fi':
                    return title.includes('sci-fi') || title.includes('space') || title.includes('alien')
                case 'drama':
                    return title.includes('drama') || title.includes('love') || title.includes('life')
                default:
                    return true
            }
        })
    }

    // Apply year filter
    if (selectedYear !== 'all') {
        filtered = filtered.filter(movie => {
            const movieYear = new Date(movie.release_date).getFullYear().toString()
            return movieYear === selectedYear
        })
    }

    // Apply top 10 filter (highest rated movies)
    if (showTopTen) {
        filtered = filtered
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, 10)
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.vote_average - a.vote_average
            case 'newest':
                return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
            case 'oldest':
                return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
            case 'popularity':
            default:
                return b.vote_average - a.vote_average  // Use vote_average as popularity measure
        }
    })

    setFilteredMovies(filtered)
}, [allMovies, selectedGenre, selectedYear, showTopTen, sortBy])

//  trigger infinate scroll when user scrolls to bottom
useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
    }
}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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

                {/* Search Info */}
                <div className="flex items-center gap-3 mb-8">
                    <Search className="text-gray-400" size={32} />
                    <h1 className="text-4xl font-bold">
                        {query ? `Search Results for "${query}"` : 'Browse All Movies'}
                    </h1>
                    <span className="text-gray-400 text-lg">({filteredMovies.length} movies found)</span>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-lg">
                    <div className = "flex items-center gap-2">
                        <Filter className="text-gray-400" size={20} />
                        <span className="text-gray-300 font-medium">Filter by Genre:</span>
                    </div>

                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                selectedGenre === genre
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </button>
                    ))}
                </div>
                {/* Secondary Filters Row */}
                <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-800/30 rounded-lg">
                    {/* Year Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Year:</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>
                                    {year === 'all' ? 'All Years' : year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                        >
                            {sortOptions.map(option => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Top 10 Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTopTen(!showTopTen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                showTopTen
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            🏆 {showTopTen ? 'Showing Top 10' : 'Show Top 10'}
                        </button>
                    </div>
                </div>
                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-red-600" size={48} />
                    </div>
                )}

                {/* Movies Grid */}
                {!isLoading && filteredMovies.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {filteredMovies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                        
                        {/* Infinite Scroll Trigger */}
                        {hasNextPage && (
                            <div ref={ref} className="flex justify-center py-8">
                                {isFetchingNextPage && (
                                    <Loader2 className="animate-spin text-red-600" size={32} />
                                )}
                            </div>
                        )}
                    </>
                ) : !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Search size={64} className="text-gray-600 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2 text-gray-300">No movies found</h2>
                        <p className = "text-gray-500 mb-6 max-w-md">
                            {query
                            ? `No results found for "${query}" with the selected filters`
                            : "Try searching for something else."}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    </>
  )
}

export default SearchResultsPage