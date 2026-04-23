// Clerk Authentication Configuration
// This file sets up Clerk for our Netflix clone

export const clerkConfig = {
  // Your actual publishable key
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_aG90LWd1cHB5LTY4LmNsZXJrLmFjY291bnRzLmRldiQ",
  
  // Appearance customization to match Netflix theme
  appearance: {
    baseTheme: "dark",
    variables: {
      colorPrimary: "#e50914", // Netflix red
      colorBackground: "#000000", // Netflix black
      colorInputBackground: "#333333",
      colorInputText: "#ffffff",
      colorText: "#ffffff",
      colorTextSecondary: "#b3b3b3",
    },
    elements: {
      formButtonPrimary: {
        backgroundColor: "#e50914",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#f40612",
        },
      },
      card: {
        backgroundColor: "#181818",
        border: "1px solid #333333",
      },
      headerTitle: {
        color: "#ffffff",
      },
      socialButtonsBlockButton: {
        backgroundColor: "#333333",
        border: "1px solid #555555",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#404040",
        },
      },
    },
  },
  
  // Sign-in/sign-up configuration
  signIn: {
    routing: "path",
    path: "/sign-in",
    appearance: {
      elements: {
        rootBox: {
          width: "100%",
          maxWidth: "400px",
        },
      },
    },
  },
  
  signUp: {
    routing: "path", 
    path: "/sign-up",
    appearance: {
      elements: {
        rootBox: {
          width: "100%",
          maxWidth: "400px",
        },
      },
    },
  },
  
  // User profile configuration
  userProfile: {
    routing: "path",
    path: "/profile",
    appearance: {
      elements: {
        rootBox: {
          width: "100%",
          maxWidth: "600px",
        },
      },
    },
  },
};
