import { SignUp } from '@clerk/react'

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/"
          appearance={{
            baseTheme: "dark",
            variables: {
              colorPrimary: "#e50914", // Netflix red
            }
          }}
        />
      </div>
    </div>
  )
}

export default SignUpPage