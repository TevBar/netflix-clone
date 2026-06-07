import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie } from '../assets/Components/types'

interface MovieStore {
  myList: Movie[]
  toggleMyList: (movie: Movie) => void
  isInMyList: (movieId: number) => boolean
  clearMyList: () => void
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      myList: [],

      toggleMyList: (movie: Movie) =>
        set((state) => {
          const exists = state.myList.find(m => m.id === movie.id)
          return {
            myList: exists
              ? state.myList.filter(m => m.id !== movie.id)
              : [...state.myList, movie]
          }
        }),

      isInMyList: (movieId: number) =>
        get().myList.some(m => m.id === movieId),

      clearMyList: () => set({ myList: [] }),
    }),
    {
      name: 'netflix-my-list',
      partialize: (state) => ({ myList: state.myList }),
    }
  )
)
