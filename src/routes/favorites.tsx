import { createFileRoute } from '@tanstack/react-router'
import FavoritesPage from '../pages/FavoritesPage'
import { ProtectedRoute } from '../assets/Components/ProtectedRoute'

// create wrapper component that combines protection + page 

function ProtectedFavorites() {
    return (
        <ProtectedRoute>
            <FavoritesPage />
        </ProtectedRoute>
    )
}

export const Route = createFileRoute('/favorites')({
    component: ProtectedFavorites
})

// Bottom line: TanStack eliminates tons of boilerplate code for data fetching, caching, synchronization, and state management.
//  Your code becomes cleaner, more maintainable, and your app feels faster because of smart caching.