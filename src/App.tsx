// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
// import MovieDetails from './pages/MovieDetails'
// import FavoritesPage from './pages/FavoritesPage'
// import WatchlistPage from './pages/WatchlistPage'
// import SearchResultsPage from './pages/SearchResultsPage'
// import './App.css'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/movie/:id" element={<MovieDetails />} />
//         <Route path="/favorites" element={<FavoritesPage />} />
//         <Route path="/watchlist" element={<WatchlistPage />} />
//         <Route path="/search" element={<SearchResultsPage />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App


import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

export default App