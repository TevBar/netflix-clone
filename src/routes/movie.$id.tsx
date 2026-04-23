import { createFileRoute } from '@tanstack/react-router'
import MovieDetails from '../pages/MovieDetails'

export const Route = createFileRoute('/movie/$id')({
    component: MovieDetails,
})


// handling dynamic routes with parameters.  creating a route with the parameter and recognizes the ID portion. 
// like saying a movie route like /movie/123