import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/react'

function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center mb-8 absolute top-8 w-full">
        <h1 className="text-3xl font-bold text-red-600">NETFLIX</h1>
      </div>
      <SignUp routing="path" path="/sign-up" />
    </div>
  )
}


// Create and export the route
export const Route = createFileRoute('/sign-up')({
  component: SignUpPage
})
