// creating the route definitions  and the outlet is where the child routes will render(page components)
// tanstackrouterdevtools is dev tools for debugging routes

import { createRootRoute, Outlet} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ErrorBoundary } from '../components/ErrorBoundary'
import '../App.css'

export const Route = createRootRoute({
    component: () => (
        <ErrorBoundary>
            <Outlet/>
            <TanStackRouterDevtools/>
        </ErrorBoundary>
    ),
})
