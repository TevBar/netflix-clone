import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie } from '../assets/Components/types'

interface WatchEntry {
  movie: Movie
  progress: number      // 0–100 percentage
  lastWatched: number   // Date.now() — used to sort most-recent first
}

interface WatchProgressStore {
  entries: WatchEntry[]
  startWatching: (movie: Movie) => void
  updateProgress: (movieId: number, progress: number) => void
  removeFromWatching: (movieId: number) => void
}

export const useWatchProgressStore = create<WatchProgressStore>()(
  persist(
    (set) => ({
      entries: [],

      // Add movie at 0% if not already tracked; update lastWatched if it is
      startWatching: (movie: Movie) =>
        set((state) => {
          const exists = state.entries.find(e => e.movie.id === movie.id)
          if (exists) {
            return {
              entries: state.entries.map(e =>
                e.movie.id === movie.id
                  ? { ...e, lastWatched: Date.now() }
                  : e
              )
            }
          }
          return {
            entries: [{ movie, progress: 0, lastWatched: Date.now() }, ...state.entries]
          }
        }),

      // Update progress percentage for a tracked movie
      updateProgress: (movieId: number, progress: number) =>
        set((state) => ({
          entries: state.entries.map(e =>
            e.movie.id === movieId
              ? { ...e, progress: Math.min(100, Math.max(0, progress)), lastWatched: Date.now() }
              : e
          )
        })),

      // Remove a movie from the Continue Watching list
      removeFromWatching: (movieId: number) =>
        set((state) => ({
          entries: state.entries.filter(e => e.movie.id !== movieId)
        })),
    }),
    {
      name: 'netflix-watch-progress',
      partialize: (state) => ({ entries: state.entries }),
    }
  )
)
