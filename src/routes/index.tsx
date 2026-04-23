//  we are creating a route for the root path and using the existing home page component
//  this connects our existing home page to the tanstack router

import  { createFileRoute } from '@tanstack/react-router'
import Home from '../pages/Home'

export const Route = createFileRoute('/')({
  component: Home
})