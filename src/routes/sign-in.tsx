import { createFileRoute } from '@tanstack/react-router'
import { MockSignIn } from '../contexts/MockAuthContext'

// Sign In page component
function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">NETFLIX</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>
        
        <MockSignIn />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})
