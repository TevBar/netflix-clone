import { createContext, useContext, useState, type ReactNode } from 'react'

interface MockAuthContextType {
  isSignedIn: boolean
  user: { firstName?: string; emailAddresses?: { emailAddress: string }[] } | null
  signIn: () => void
  signOut: () => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState<MockAuthContextType['user']>(null)

  const signIn = () => {
    setIsSignedIn(true)
    setUser({
      firstName: "Demo User",
      emailAddresses: [{ emailAddress: "demo@netflix.com" }]
    })
  }

  const signOut = () => {
    setIsSignedIn(false)
    setUser(null)
  }

  return (
    <MockAuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}

// Mock components to replace Clerk components temporarily
export function MockSignIn() {
  const { signIn } = useMockAuth()
  
  const handleSignIn = () => {
    signIn()
    // Redirect to home page after signing in
    window.location.href = '/'
  }
  
  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Demo Sign In</h2>
      <p className="text-gray-300 mb-4">Click to sign in as demo user</p>
      <button 
        onClick={handleSignIn}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Sign In as Demo User
      </button>
    </div>
  )
}

export function MockSignUp() {
  const { signIn } = useMockAuth()
  
  const handleSignUp = () => {
    signIn()
    // Redirect to home page after signing up
    window.location.href = '/'
  }
  
  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Demo Sign Up</h2>
      <p className="text-gray-300 mb-4">Click to create demo account</p>
      <button 
        onClick={handleSignUp}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Create Demo Account
      </button>
    </div>
  )
}

export function MockUserButton() {
  const { signOut, user } = useMockAuth()
  
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-300">
        {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
      </span>
      <button 
        onClick={signOut}
        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
      >
        Sign Out
      </button>
    </div>
  )
}
