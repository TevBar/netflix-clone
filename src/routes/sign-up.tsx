import { createFileRoute } from '@tanstack/react-router'
import { MockSignUp } from '../contexts/MockAuthContext'

// Sign Up page component 
function SignUpPage(){
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-red-600 mb-2">NETFLIX</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>
                
                <MockSignUp />
            </div>
        </div>
    )
}


// Create and export the route
export const Route = createFileRoute('/sign-up')({
  component: SignUpPage
})
