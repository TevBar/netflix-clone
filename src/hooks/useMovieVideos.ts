import { useQuery } from '@tanstack/react-query';
import { getMovieVideos } from '../services/tmdbApi';
import type { TMDBVideos } from '../services/tmdbApi';

export const useMovieVideos = (movieId: number, enabled = true) => {
  return useQuery<TMDBVideos>({
    queryKey: ['movieVideos', movieId],
    queryFn: () => getMovieVideos(movieId),
    staleTime: 5 * 60 * 1000,
    enabled: movieId > 0 && enabled,
  });
};
