import { type ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/react'

interface ProtectedRouteProps {
    children: ReactNode
    redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/sign-in' }: ProtectedRouteProps) {
    const { isSignedIn } = useAuth()

    if (!isSignedIn) {
        return <Navigate to={redirectTo} />
    }

    return <>{children}</>
}