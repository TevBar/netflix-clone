import { InfiniteMovieGrid } from '../assets/Components/InfiniteMovieGrid'
import Header from '../assets/Components/Header'

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-black">
           <Header />
           <div className="pt-20">
                <div className="space-y-16">
                 {/* Popular Movies Section */}
                 <InfiniteMovieGrid
                    category="popular"
                    title="Popular Movies"
                />

                {/* Top Rated Movies Section */}
                <InfiniteMovieGrid
                    category="top_rated"
                    title="Top Rated"
                />

                {/* Now Playing Movies Section */}
                <InfiniteMovieGrid
                    category="now_playing"
                    title="Now Playing"
                />
            </div>
            </div>
        </div>
    )
}