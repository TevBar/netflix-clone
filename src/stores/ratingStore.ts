import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RatingStore {
  ratings: Record<number, 'up' | 'down'>
  setRating: (movieId: number, rating: 'up' | 'down') => void
  removeRating: (movieId: number) => void
  getRating: (movieId: number) => 'up' | 'down' | null
}

export const useRatingStore = create<RatingStore>()(
  persist(
    (set, get) => ({
      ratings: {},

      // Clicking the same rating twice toggles it off
      setRating: (movieId, rating) =>
        set((state) => {
          if (state.ratings[movieId] === rating) {
            const { [movieId]: _removed, ...rest } = state.ratings
            return { ratings: rest }
          }
          return { ratings: { ...state.ratings, [movieId]: rating } }
        }),

      removeRating: (movieId) =>
        set((state) => {
          const { [movieId]: _removed, ...rest } = state.ratings
          return { ratings: rest }
        }),

      getRating: (movieId) => get().ratings[movieId] ?? null,
    }),
    {
      name: 'netflix-ratings',
      partialize: (state) => ({ ratings: state.ratings }),
    }
  )
)
