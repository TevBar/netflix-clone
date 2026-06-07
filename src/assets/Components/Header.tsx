import { Link, useLocation } from '@tanstack/react-router';
import { useMovieStore } from '../../stores/movieStore';
import { ListPlus, Menu, X } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/react';
import Search from './Search';
import { useState } from 'react';

// NAV_LINKS drives both the desktop pill nav and the mobile drawer — single source of truth.
const NAV_LINKS = [
    { to: '/' as const,        label: 'Home' },
    { to: '/browse' as const,  label: 'Shows' },
    { to: '/browse' as const,  label: 'Movies' },
    { to: '/browse' as const,  label: 'New & Popular' },
    { to: '/my-list' as const, label: 'My List' },
    { to: '/browse' as const,  label: 'Browse by Languages' },
]

const Header = () => {
    const location = useLocation();
    const { myList } = useMovieStore();
    const { isSignedIn } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = (path: string) =>
        `text-sm transition-colors duration-200 ${
            location.pathname === path
                ? 'text-white font-medium'
                : 'text-gray-300 hover:text-white'
        }`

    return (
        <>
            {/* Skip Navigation Link for Keyboard Users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:z-50"
            >
                Skip to main content
            </a>

            <header className="bg-black/85 backdrop-blur-xl text-white px-4 py-3 sticky top-0 z-50 border-b border-white/8">
                <div className="flex items-center justify-between">

                    {/* Left: logo + desktop nav */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-2xl font-bold tracking-wider"
                            style={{ color: '#dc2626' }}
                            aria-label="Netflix Home"
                        >
                            NETFLIX
                        </Link>

                        {/* Desktop nav — hidden below md */}
                        <nav className="hidden md:flex items-center gap-6">
                            {NAV_LINKS.map(({ to, label }) => (
                                <Link
                                    key={label}
                                    to={to}
                                    className={`${navLinkClass(to)} ${to === '/my-list' ? 'flex items-center gap-1.5' : ''}`}
                                    aria-current={location.pathname === to ? 'page' : undefined}
                                    aria-label={to === '/my-list' ? `My List — ${myList.length} saved` : undefined}
                                >
                                    {to === '/my-list' && <ListPlus className="w-3.5 h-3.5" />}
                                    {label}
                                    {to === '/my-list' && myList.length > 0 && (
                                        <span className="ml-0.5 text-xs bg-white/20 rounded-full px-1.5 py-0.5 leading-none">
                                            {myList.length}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right: search + auth + hamburger */}
                    <div className="flex items-center gap-3">
                        <div role="search" aria-label="Movie search">
                            <Search />
                        </div>

                        {isSignedIn ? (
                            <UserButton />
                        ) : (
                            <div className="hidden sm:flex items-center gap-6">
                                <Link
                                    to="/sign-in"
                                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="text-sm text-white font-medium hover:text-gray-300 transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Hamburger — visible below md only */}
                        <button
                            className="md:hidden text-white p-1 rounded hover:bg-white/10 transition-colors"
                            onClick={() => setMobileMenuOpen(o => !o)}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile drawer — slides in below the header bar */}
                {mobileMenuOpen && (
                    <nav
                        className="md:hidden mt-3 pb-3 border-t border-white/10 pt-3 flex flex-col gap-2"
                        aria-label="Mobile navigation"
                    >
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    location.pathname === to
                                        ? 'bg-red-600 text-white'
                                        : 'text-gray-200 hover:bg-white/10'
                                }`}
                                aria-current={location.pathname === to ? 'page' : undefined}
                            >
                                {to === '/my-list' && <ListPlus className="w-4 h-4" />}
                                {label}
                                {to === '/my-list' && myList.length > 0 && (
                                    <span className="text-xs bg-white/20 rounded-full px-1.5 py-0.5 leading-none">
                                        {myList.length}
                                    </span>
                                )}
                            </Link>
                        ))}

                        {/* Auth buttons in drawer when not signed in on very small screens */}
                        {!isSignedIn && (
                            <div className="sm:hidden flex flex-col gap-2 mt-1 pt-3 border-t border-white/10">
                                <Link
                                    to="/sign-in"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center text-sm text-white font-medium hover:text-gray-300 transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                )}
            </header>
        </>
    );
};

export default Header;
