import { createFileRoute } from '@tanstack/react-router'
import SearchResultsPage from '../pages/SearchResultsPage'

export const Route = createFileRoute('/search')({
    component: SearchResultsPage,
})


// We are creating route definitions for all of our existing pages
// each route maps a URL path to the existing page components. 
// TanStack Router will automatically handle the routing logic.