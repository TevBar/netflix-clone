import { useMovieStore } from '../stores/movieStore'
import { Link } from '@tanstack/react-router'
import { ListPlus, ArrowLeft } from 'lucide-react'
import Header from '../assets/Components/Header'
import MovieCard from '../assets/Components/MovieCard'

const MyListPage = () => {
  const { myList } = useMovieStore()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
            <ListPlus className="text-red-500" size={32} />
            <h1 className="text-4xl font-bold">My List</h1>
            <span className="text-gray-400 text-lg">({myList.length} {myList.length === 1 ? 'movie' : 'movies'})</span>
          </div>

          {myList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {myList.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ListPlus size={64} className="text-gray-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-300">Your list is empty</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Add movies to your list by clicking <strong className="text-white">+ My List</strong> on any movie.
              </p>
              <Link
                to="/"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyListPage
