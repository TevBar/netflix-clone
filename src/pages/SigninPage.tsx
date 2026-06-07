import { SignIn } from '@clerk/react'

const SignInPage = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-md">
                <SignIn
                    path="sign-in"
                    routing="path"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/"
                    appearance={{
                        baseTheme:"dark",
                        variables: {   
                            colorPrimary: " #e50914",// Netflix red
                        }
                    }}
                />
            </div>
        </div>
    )
}


export default SignInPage