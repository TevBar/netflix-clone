
import type { MovieListProps } from './types';
import MovieCard from './MovieCard';

const MovieList = ({ movies, showTrendingNumbers = false }: MovieListProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {movies?.map((movie, index) => (
        <MovieCard 
          key={movie.id}
          movie={movie}
          trendingNumber={showTrendingNumbers ? index + 1 : undefined}
          showTrendingNumber={showTrendingNumbers}
        />
      ))}
    </div>
  );
};

export default MovieList;
