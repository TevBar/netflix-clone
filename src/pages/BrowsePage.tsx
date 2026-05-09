//  import { infiniteMovieGrid } from '../assets/Components/InfiniteMovieGrid'

//  export default function BrowsePage() { 
//     return (
//         <div className ="min-h-screen bg-black">
//             <div className="pt-20>" {/* Account fort header height */}
//             <infinateMovieGrid
//                 category= "popular"
//                 title= "popular Movies"
//             />
//             <infinateMovieGrid
//                 category= "top_rated"
//                 title= "Top Rated Movies"
//             />
//             <infinateMovieGrid
//                 category= "now_playing"
//                 title= "Now Playing Movies"
//             />
//             <InfiniteMovieGrid 
//             category="now_playing" 
//             title="Now Playing" 
//             />
//             </div>
//         </div>
//     )
//  }

import { InfiniteMovieGrid } from '../assets/Components/InfiniteMovieGrid'

export default function BrowsePage() {
    return (
        <div className="min-h-screen bg-black">
           {/* Account for fixed header */}
           <div className="pt-20">
                <div className="space-y-16">
                 {/* Popular Movies Section */}
                 <InfiniteMovieGrid
                    category="popular"
                    title="Popular Movies"
                />

                {/* Top Rated Movies Section */}
                <InfiniteMovieGrid
                    category="top-rated"
                    title="Top Rated"
                />

                {/* Now Playing Movies Section */}
                <InfiniteMovieGrid
                    category="now-playing"
                    title="Now Playing"
                />
            </div>
            </div>
        </div>
    )
}