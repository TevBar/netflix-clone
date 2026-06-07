import { createFileRoute } from '@tanstack/react-router'
import MyListPage from '../pages/MyListPage'
import { ProtectedRoute } from '../assets/Components/ProtectedRoute'

function ProtectedMyList() {
    return (
        <ProtectedRoute>
            <MyListPage />
        </ProtectedRoute>
    )
}

export const Route = createFileRoute('/my-list')({
    component: ProtectedMyList
})
