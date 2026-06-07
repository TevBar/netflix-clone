import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie } from '../assets/Components/types'

// Capped at 20 entries — oldest entries fall off the back.
// Deduplication: clicking the same movie twice moves it to the front rather than adding a duplicate.
const MAX = 20

interface RecentlyViewedStore {
  viewed: Movie[]
  addViewed: (movie: Movie) => void
  clearViewed: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      viewed: [],

      addViewed: (movie) =>
        set((state) => {
          const deduped = state.viewed.filter(m => m.id !== movie.id)
          return { viewed: [movie, ...deduped].slice(0, MAX) }
        }),

      clearViewed: () => set({ viewed: [] }),
    }),
    {
      name: 'netflix-recently-viewed',
      partialize: (state) => ({ viewed: state.viewed }),
    }
  )
)
