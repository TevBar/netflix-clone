import { type ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useMockAuth } from '../../contexts/MockAuthContext'

interface ProtectedRouteProps{
    children: ReactNode
    redirectTo?: string
}

export function ProtectedRoute({children, redirectTo='/sign-in'}: ProtectedRouteProps) {
    const {isSignedIn } = useMockAuth()

    if (!isSignedIn) {
        return <Navigate to={redirectTo} />
    }

    return <>{children}</>
}