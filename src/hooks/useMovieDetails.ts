import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { tmdbApi } from '@/services/tmdbApi';
import type { MovieDetails } from '@/services/tmdbApi';


export const useMovieDetails = (movieId: number): UseQueryResult<MovieDetails> => {
    return useQuery({
        queryKey: ['movieDetails', movieId],
        queryFn: () => tmdbApi.getMovieDetails(movieId),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}