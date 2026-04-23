import { Search as SearchIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import mockData from '../../data/mockData.json';
import { useNavigate } from '@tanstack/react-router'

// Movie type for search results
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

// Use movies from our JSON file instead of hardcoded array
const SAMPLE_MOVIES: Movie[] = mockData.movies;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

  const handleIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Search filter function
  const filterMovies = (query: string) => {
    if (!query.trim()) return []; // Empty search = no results
    
    return SAMPLE_MOVIES.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.overview.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results for performance
  };

  // Debounced search effect - waits 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        const results = filterMovies(searchTerm);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms delay

    // Cleanup: cancel timer if searchTerm changes before 300ms
    return () => clearTimeout(timer);
  }, [searchTerm]); // Re-run when searchTerm changes

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the search is open AND click was outside our component
      if (isSearchOpen && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    // Add listener when search opens
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup: remove listener when component unmounts or search closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]); // Re-run effect when isSearchOpen changes

  // Helper function for movie poster URLs
  const getMoviePosterUrl = (posterPath: string | null): string => {
    if (!posterPath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjUxMyIgdmlld0JveD0iMCAwIDM0MiA1MTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNDIiIGhlaWdodD0iNTEzIiBmaWxsPSIjMWYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPk5vIFBvc3RlcjwvdGV4dD4KPHN2Zz4K';
    return `https://image.tmdb.org/t/p/w342${posterPath}`;
  };

  return (
    <div ref={searchRef} className="relative flex items-center gap-3">
      <SearchIcon 
        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-all duration-300"
        onClick={handleIconClick}
        aria-label={isSearchOpen ? "Close search" : "Open search"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleIconClick();
          }
        }}
      />
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'
      }`}>
        <input 
          type="text" 
          placeholder="Titles, Peoples , Genre..." 
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            // Search will be triggered by useEffect after 300ms delay
          }}
          className={`bg-black/40 border-2 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 w-48 ${
            isSearchOpen 
              ? 'border-red-500 shadow-red-500/50 shadow-lg focus:border-red-400 focus:shadow-red-400/60' 
              : 'border-gray-600'
          }`}
          autoFocus={isSearchOpen}
          aria-label="Search for movies, people, or genres"
          role="searchbox"
          aria-expanded={isSearchOpen}
          aria-haspopup="listbox"
          aria-describedby={searchResults.length > 0 ? "search-results" : undefined}
        />
      </div>
      
      {/* Search Results Dropdown */}
      {isSearchOpen && searchTerm && searchResults.length > 0 && (
        <div 
          id="search-results"
          className="absolute top-full left-0 mt-2 w-96 bg-black/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 max-h-80 overflow-y-auto z-50"
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.map((movie) => (
            <div 
              key={movie.id} 
              className="flex items-center gap-3 p-3 hover:bg-gray-800/50 cursor-pointer border-b border-gray-700/50 last:border-b-0 transition-colors"
              onClick={() => {
                // Navigate to search results page with the movie title as query
                navigate({ 
                    to: '/search', 
                    search: { q: movie.title } 
                });
                setIsSearchOpen(false);
                setSearchTerm('');
                setSearchResults([]);
                }}
              role="option"
              tabIndex={0}
              aria-selected="false"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  console.log('Selected movie:', movie.title);
                  setIsSearchOpen(false);
                  setSearchTerm('');
                  setSearchResults([]);
                }
              }}
            >
              <img 
                src={getMoviePosterUrl(movie.poster_path)} 
                alt={movie.title}
                className="w-12 h-16 object-cover rounded shadow-md"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMWYyOTM3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCI+Tm88L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{movie.title}</h4>
                <p className="text-gray-400 text-xs">{movie.release_date.split('-')[0]}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400 text-xs">★ {movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No Results Message */}
      {isSearchOpen && searchTerm && searchResults.length === 0 && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-black/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-4 z-50">
          <p className="text-gray-400 text-sm text-center">No movies found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Search;
