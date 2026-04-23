import { Link, useLocation } from '@tanstack/react-router';
import { useMovieStore } from '../../stores/movieStore';
import { Heart, Bookmark } from 'lucide-react';
import { useMockAuth, MockUserButton } from '../../contexts/MockAuthContext';
import Search from './Search';

const Header = () => {
    const location = useLocation();
    const { favorites, watchlist } = useMovieStore();
    const { isSignedIn, user } = useMockAuth();

    return (
        <>
            {/* Skip Navigation Link for Keyboard Users */}
            <a 
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:z-50"
            >
                Skip to main content
            </a>
            <header className="bg-black text-white p-4 sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Link 
                            to="/" 
                            className="text-2xl font-bold text-red-600 no-underline"
                            style={{ color: '#dc2626' }}
                            aria-label="Netflix Home"
                        >
                            NETFLIX
                        </Link>
                        <nav className="flex space-x-4">
                            <Link 
                                to="/" 
                                className={`px-3 py-1 rounded ${location.pathname === '/' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                                aria-current={location.pathname === '/' ? 'page' : undefined}
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                className={`px-3 py-1 rounded ${location.pathname === '/browse' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                                aria-current={location.pathname === '/browse' ? 'page' : undefined}
                            >
                                Browse
                            </Link>
                            <Link 
                                to="/favorites" 
                                className={`flex items-center space-x-1 px-3 py-1 rounded ${location.pathname === '/favorites' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                                aria-current={location.pathname === '/favorites' ? 'page' : undefined}
                                aria-label={`Favorites - ${favorites.length} movies saved`}
                            >
                                <Heart className="w-4 h-4" />
                                <span>Favorites ({favorites.length})</span>
                            </Link>
                            <Link 
                                to="/watchlist" 
                                className={`flex items-center space-x-1 px-3 py-1 rounded ${location.pathname === '/watchlist' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                                aria-current={location.pathname === '/watchlist' ? 'page' : undefined}
                                aria-label={`Watchlist - ${watchlist.length} movies to watch`}
                            >
                                <Bookmark className="w-4 h-4" />
                                <span>Watchlist ({watchlist.length})</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Accessible Search Component Wrapper */}
                        <div role="search" aria-label="Movie search">
                            <Search />
                        </div>
                        
                        {/* Authentication UI */}
                        {isSignedIn ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-300">
                                    Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
                                </span>
                                <MockUserButton />
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link 
                                    to="/sign-in"
                                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/sign-up"
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
