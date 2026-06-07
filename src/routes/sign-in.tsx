import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/react'

function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center mb-8 absolute top-8 w-full">
        <h1 className="text-3xl font-bold text-red-600">NETFLIX</h1>
      </div>
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})
