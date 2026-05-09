import { useQuery } from '@tanstack/react-query';
import { getMovieVideos } from '../services/tmdbApi';
import type { TMDBVideos } from '../services/tmdbApi';

export const useMovieVideos = (movieId: number) => {
  return useQuery<TMDBVideos>({
    queryKey: ['movieVideos', movieId],
    queryFn: () => getMovieVideos(movieId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
