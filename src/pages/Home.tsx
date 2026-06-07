import Header from '../assets/Components/Header'
import Hero from '../assets/Components/Hero'
import MovieRow from '../assets/Components/MovieRow'
import { useTrendingMovies, useInfiniteMovies, useMoviesByGenre } from '../hooks/useNetflixQuery'
import { useWatchProgressStore } from '../stores/watchProgressStore'
import { useRecentlyViewedStore } from '../stores/recentlyViewedStore'

function Home() {
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies('week')
  const { data: popularData,   isLoading: popularLoading }   = useInfiniteMovies('popular')
  const { data: topRatedData,  isLoading: topRatedLoading }  = useInfiniteMovies('top_rated')
  const { data: actionData,    isLoading: actionLoading }    = useMoviesByGenre(28)
  const { data: comedyData,    isLoading: comedyLoading }    = useMoviesByGenre(35)
  const { data: thrillerData,  isLoading: thrillerLoading }  = useMoviesByGenre(53)

  const viewed = useRecentlyViewedStore(state => state.viewed)

  // Read raw entries — stable reference, only changes when store updates
  const entries = useWatchProgressStore(state => state.entries)
  const watchEntries = [...entries].sort((a, b) => b.lastWatched - a.lastWatched)
  const continueWatchingMovies = watchEntries.map(e => e.movie)
  const watchProgressMap = Object.fromEntries(watchEntries.map(e => [e.movie.id, e.progress]))

  // Each hook type returns a different shape — unwrap once here so JSX stays clean
  // useTrendingMovies  → Movie[] directly
  // useInfiniteMovies  → { pages: [{ movies }] }
  // useMoviesByGenre   → { movies, totalPages }
  const trending = trendingMovies ?? []
  const popular  = popularData?.pages[0]?.movies  ?? []
  const topRated = topRatedData?.pages[0]?.movies ?? []
  const action   = actionData?.movies   ?? []
  const comedy   = comedyData?.movies   ?? []
  const thriller = thrillerData?.movies ?? []

  return (
    <>
      <Header />
      <Hero />

      {continueWatchingMovies.length > 0 && (
        <MovieRow
          title="Continue Watching"
          movies={continueWatchingMovies}
          isLoading={false}
          watchProgressMap={watchProgressMap}
        />
      )}

      {viewed.length > 0 && (
        <MovieRow
          title="Recently Viewed"
          movies={viewed}
          isLoading={false}
        />
      )}

      <MovieRow
        title="Top 10 in the US Today"
        movies={trending.slice(0, 10)}
        isLoading={trendingLoading}
        showTrendingNumbers
        badge="Top 10"
      />
      <MovieRow title="Trending This Week" movies={trending}  isLoading={trendingLoading} />
      <MovieRow title="Popular Right Now"  movies={popular}   isLoading={popularLoading} />
      <MovieRow title="Top Rated"          movies={topRated}  isLoading={topRatedLoading} />
      <MovieRow title="Action"             movies={action}    isLoading={actionLoading} />
      <MovieRow title="Comedy"             movies={comedy}    isLoading={comedyLoading} />
      <MovieRow title="Thriller"           movies={thriller}  isLoading={thrillerLoading} />
    </>
  )
}

export default Home
