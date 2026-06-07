// creating the route definitions  and the outlet is where the child routes will render(page components)
// tanstackrouterdevtools is dev tools for debugging routes

import { createRootRoute, Outlet} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '../components/ErrorBoundary'
import Footer from '../assets/Components/Footer'
import '../App.css'

export const Route = createRootRoute({
    component: () => (
        <ErrorBoundary>
            <Outlet/>
            <Footer />
            <TanStackRouterDevtools/>
            <Toaster position="bottom-right" theme="dark" richColors />
        </ErrorBoundary>
    ),
})
