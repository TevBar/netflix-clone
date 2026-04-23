import { createFileRoute } from '@tanstack/react-router'
import WatchlistPage from '../pages/WatchlistPage'
import { ProtectedRoute } from '../assets/Components/ProtectedRoute'

// create wrapper component that combines protection + page

function ProtectedWatchlist() {
    return (
        <ProtectedRoute>
            <WatchlistPage />
        </ProtectedRoute>
    )
}

export const Route = createFileRoute('/watchlist')({
    component: ProtectedWatchlist
})