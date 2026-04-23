import { create } from 'zustand'
import type { Movie } from '../assets/Components/types'

// User-specific store interface
interface UserMovieStore {
  favorites: Movie[]
  watchlist: Movie[]
  currentUserId: string | null
  
  // Actions
  setUser: (userId: string | null) => void
  loadUserData: (userId: string) => void
  
  // Movie actions (same as before, but user-specific)
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (movieId: number) => void
  addToWatchlist: (movie: Movie) => void
  removeFromWatchlist: (movieId: number) => void
  
  // Check if movie is in lists
  isFavorite: (movieId: number) => boolean
  isInWatchlist: (movieId: number) => boolean
} 

// create the store 

export const useUserMovieStore = create<UserMovieStore>((set, get) => ({
    favorites: [],
    watchlist: [],
    currentUserId: null, 

    setUser: (userId ) => { 
        set({ currentUserId: userId })
        if(userId) {
            get().loadUserData(userId)
        } else { 
            //  clear data when user signs out 
            set({ favorites: [], watchlist: [], currentUserId: null })
        }
    },

  loadUserData: (userId) => {
    // Load user-specific data from localStorage with userId prefix
    const userFavorites = localStorage.getItem(`user_${userId}_favorites`)
    const userWatchlist = localStorage.getItem(`user_${userId}_watchlist`)
    
    set({
      favorites: userFavorites ? JSON.parse(userFavorites) : [],
      watchlist: userWatchlist ? JSON.parse(userWatchlist) : []
    })
  },
    
  addToFavorites: (movie) => {
    const { currentUserId } = get()
    if (!currentUserId) return
    
    set((state) => {
      const newFavorites = [...state.favorites, movie]
      localStorage.setItem(`user_${currentUserId}_favorites`, JSON.stringify(newFavorites))
      return { favorites: newFavorites }
    })
  },

  removeFromFavorites: (movieId) => {
    const { currentUserId } = get()
    if (!currentUserId) return
    
    set((state) => {
      const newFavorites = state.favorites.filter(movie => movie.id !== movieId)
      localStorage.setItem(`user_${currentUserId}_favorites`, JSON.stringify(newFavorites))
      return { favorites: newFavorites }
    })
  },
  
  addToWatchlist: (movie) => {
    const { currentUserId } = get()
    if (!currentUserId) return
    
    set((state) => {
      const newWatchlist = [...state.watchlist, movie]
      localStorage.setItem(`user_${currentUserId}_watchlist`, JSON.stringify(newWatchlist))
      return { watchlist: newWatchlist }
    })
  },
  
  removeFromWatchlist: (movieId) => {
    const { currentUserId } = get()
    if (!currentUserId) return
    
    set((state) => {
      const newWatchlist = state.watchlist.filter(movie => movie.id !== movieId)
      localStorage.setItem(`user_${currentUserId}_watchlist`, JSON.stringify(newWatchlist))
      return { watchlist: newWatchlist }
    })
  },
  
  isFavorite: (movieId) => {
    return get().favorites.some(movie => movie.id === movieId)
  },
  
  isInWatchlist: (movieId) => {
    return get().watchlist.some(movie => movie.id === movieId)
  }
}))
