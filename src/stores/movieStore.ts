import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie } from '../assets/Components/types'

// Define the store's state and actions
interface MovieStore {
  // State
  favorites: Movie[]
  watchlist: Movie[]
  
  // Actions
  toggleFavorite: (movie: Movie) => void
  toggleWatchlist: (movie: Movie) => void
  isFavorite: (movieId: number) => boolean
  isInWatchlist: (movieId: number) => boolean
  clearFavorites: () => void
  clearWatchlist: () => void
}

// Create the store with persistence (saves to localStorage)
export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      watchlist: [],

      // Toggle favorite: add if not present, remove if present
      toggleFavorite: (movie: Movie) =>
        set((state) => {
          const exists = state.favorites.find((fav) => fav.id === movie.id)
          return {
            favorites: exists
              ? state.favorites.filter((fav) => fav.id !== movie.id) // Remove
              : [...state.favorites, movie] // Add
          }
        }),

      // Toggle watchlist: add if not present, remove if present  
      toggleWatchlist: (movie: Movie) =>
        set((state) => {
          const exists = state.watchlist.find((item) => item.id === movie.id)
          return {
            watchlist: exists
              ? state.watchlist.filter((item) => item.id !== movie.id) // Remove
              : [...state.watchlist, movie] // Add
          }
        }),

      // Check if movie is in favorites
      isFavorite: (movieId: number) => {
        const state = get()
        return state.favorites.some((fav) => fav.id === movieId)
      },

      // Check if movie is in watchlist
      isInWatchlist: (movieId: number) => {
        const state = get()
        return state.watchlist.some((item) => item.id === movieId)
      },

      // Clear all favorites
      clearFavorites: () => set({ favorites: [] }),

      // Clear watchlist
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    {
      name: 'netflix-movie-storage', // localStorage key
      // Only persist the arrays, not the functions
      partialize: (state) => ({
        favorites: state.favorites,
        watchlist: state.watchlist,
      }),
    }
  )
)
