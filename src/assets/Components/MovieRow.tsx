import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import type { Movie } from './types'

interface MovieRowProps {
  title: string
  movies: Movie[]
  isLoading: boolean
  watchProgressMap?: Record<number, number>
  showTrendingNumbers?: boolean
  badge?: string
}

const VISIBLE = 6
const SHIFT_PX = 38

// Shared badge + title header used in both loading and loaded states
function RowHeader({ title, badge, right }: { title: string; badge?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2 px-4 md:px-14">
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {badge}
          </span>
        )}
        <h2 className="text-base font-medium text-white tracking-wide">{title}</h2>
      </div>
      {right}
    </div>
  )
}

export function MovieRow({ title, movies, isLoading, watchProgressMap, showTrendingNumbers, badge }: MovieRowProps) {
  const [page, setPage] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  if (isLoading) {
    return (
      <section className="py-6">
        <RowHeader title={title} badge={badge} />
        {/* Mobile skeleton — portrait cards */}
        <div className="flex gap-2 md:hidden overflow-hidden px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-36 aspect-2/3 bg-gray-800 rounded animate-pulse shrink-0" />
          ))}
        </div>
        {/* Desktop skeleton — landscape cards */}
        <div className="hidden md:flex gap-1 px-14">
          {Array.from({ length: VISIBLE }).map((_, i) => (
            <div key={i} className="w-[calc((100vw-112px-20px)/6)] min-w-45 aspect-video bg-gray-800 rounded animate-pulse shrink-0" />
          ))}
        </div>
      </section>
    )
  }

  if (!movies?.length) return null

  const maxPage = Math.max(0, Math.ceil(movies.length / VISIBLE) - 1)
  const slice = movies.slice(page * VISIBLE, page * VISIBLE + VISIBLE)

  const getX = (i: number) => {
    if (hoveredIdx === null) return 0
    if (i < hoveredIdx) return -SHIFT_PX
    if (i > hoveredIdx) return SHIFT_PX
    return 0
  }

  return (
    <section className="py-6 relative group/row">
      <RowHeader
        title={title}
        badge={badge}
        right={
          // Page indicator dashes — desktop only, hidden on mobile
          maxPage > 0 ? (
            <div className="hidden md:flex gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
              {Array.from({ length: maxPage + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 w-3 transition-colors duration-200 ${i === page ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          ) : null
        }
      />

      {/*
        MOBILE: plain horizontal scroll with portrait cards.
        No JS pagination needed — CSS overflow + touch-action handles swiping natively.
        Using size="sm" gives compact 176px portrait cards that fit ~2.2 on a 390px screen,
        encouraging discovery through scrolling.
      */}
      <div className="md:hidden overflow-x-auto scrollbar-hide px-4 touch-pan-x">
        <div className="flex gap-2">
          {movies.map((movie, i) => (
            <div key={movie.id} className="shrink-0">
              <MovieCard
                movie={movie}
                size="sm"
                watchProgress={watchProgressMap?.[movie.id]}
                showTrendingNumber={showTrendingNumbers}
                trendingNumber={showTrendingNumbers ? i + 1 : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/*
        DESKTOP: paginated carousel with Framer Motion hover-expand.
        Hidden on mobile so touch devices get the scroll experience above.
      */}
      <div
        className="hidden md:block relative overflow-hidden px-14"
        style={{ paddingTop: '1.5rem', marginTop: '-1.5rem', paddingBottom: '1.5rem', marginBottom: '-1.5rem' }}
      >
        {/* Left arrow */}
        {page > 0 && (
          <button
            onClick={() => { setPage(p => p - 1); setHoveredIdx(null) }}
            aria-label="Previous"
            className="absolute left-0 inset-y-0 z-20 w-12 flex items-center justify-center bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:bg-black/80"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Right arrow */}
        {page < maxPage && (
          <button
            onClick={() => { setPage(p => p + 1); setHoveredIdx(null) }}
            aria-label="Next"
            className="absolute right-0 inset-y-0 z-20 w-12 flex items-center justify-center bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:bg-black/80"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}

        <div className="flex gap-1">
          {slice.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: getX(i),
                scale: hoveredIdx === i ? 1.3 : 1,
                zIndex: hoveredIdx === i ? 10 : 1,
              }}
              transition={{
                opacity: { duration: 0.25, delay: i * 0.04 },
                x: { type: 'spring', stiffness: 400, damping: 35 },
                scale: { type: 'spring', stiffness: 400, damping: 35 },
              }}
              className="shrink-0 relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <MovieCard
                movie={movie}
                size="lg"
                watchProgress={watchProgressMap?.[movie.id]}
                showTrendingNumber={showTrendingNumbers}
                trendingNumber={showTrendingNumbers ? page * VISIBLE + i + 1 : undefined}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MovieRow
