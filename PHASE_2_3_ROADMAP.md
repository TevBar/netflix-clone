# Netflix Clone - Phase 2 & 3 Implementation Roadmap
**Date:** May 9, 2026  
**Status:** Planning Phase  
**Target Audience:** Self-guided implementation with detailed instructions

---

## 🎯 Overview

After completing the 4 trailer enhancements (Phase 1 ✅), we're ready to tackle:
- **Phase 2: Movie Details Polish** (1-2 hours)
- **Phase 3: Navigation & Browsing** (2-3 hours)

---

## 📍 PHASE 2: Movie Details Polish

### Objective
Enhance the MovieDetails component to show more information and similar movies, creating a comprehensive movie detail experience like Netflix.

---

### **Feature 2.1: Cast & Crew Information**

**File to Modify:** `/src/pages/MovieDetails.tsx`  
**Time Estimate:** 30-45 minutes  
**Complexity:** ⭐⭐☆ Medium

#### What to Add:

1. **New TMDB API Call**
   - File: `/src/hooks/useMovieCredits.ts` (create new)
   - Endpoint: `/movie/{id}/credits`
   - Returns: Cast and crew data

2. **Create useMovieCredits Hook**
   ```typescript
   // /src/hooks/useMovieCredits.ts
   import { useQuery } from '@tanstack/react-query';
   import { getMovieCredits } from '../services/tmdbApi';

   export const useMovieCredits = (movieId: number) => {
     return useQuery({
       queryKey: ['movieCredits', movieId],
       queryFn: () => getMovieCredits(movieId),
       staleTime: 5 * 60 * 1000,
     });
   };
   ```

3. **Add API Function**
   - File: `/src/services/tmdbApi.ts`
   - Add: `getMovieCredits(movieId: number)` function
   - Returns: Cast (array of 10-15 actors), Crew (director, producer, writer)

4. **Display in MovieDetails**
   - Location: After overview section, before action buttons
   - Show: Director, top 5 cast members in a grid
   - Format: Actor photo + name + character (if available)

#### Key Implementation Points:

- **Director Display**: Find crew with `job === 'Director'`
- **Cast Display**: Show `results[0..4]` (first 5 cast members)
- **Images**: Use TMDB actor image URLs (with placeholder fallback)
- **Responsive**: Stack on mobile, grid on desktop

#### TMDB Response Structure:
```json
{
  "cast": [
    {
      "name": "Actor Name",
      "character": "Character Name",
      "profile_path": "/path/to/image.jpg"
    }
  ],
  "crew": [
    {
      "name": "Director Name",
      "job": "Director",
      "profile_path": "/path/to/image.jpg"
    }
  ]
}
```

---

### **Feature 2.2: Similar Movies Section**

**File to Modify:** `/src/pages/MovieDetails.tsx`  
**Time Estimate:** 45-60 minutes  
**Complexity:** ⭐⭐⭐ Hard

#### What to Add:

1. **New TMDB API Call**
   - File: `/src/hooks/useSimilarMovies.ts` (create new)
   - Endpoint: `/movie/{id}/similar`
   - Returns: Array of 20 similar movies

2. **Create useSimilarMovies Hook**
   ```typescript
   // /src/hooks/useSimilarMovies.ts
   import { useQuery } from '@tanstack/react-query';
   import { getSimilarMovies } from '../services/tmdbApi';

   export const useSimilarMovies = (movieId: number) => {
     return useQuery({
       queryKey: ['similarMovies', movieId],
       queryFn: () => getSimilarMovies(movieId),
       staleTime: 10 * 60 * 1000, // Cache longer
     });
   };
   ```

3. **Add API Function**
   - File: `/src/services/tmdbApi.ts`
   - Add: `getSimilarMovies(movieId: number)` function
   - Returns: Similar movies (by TMDB algorithm)

4. **Display in MovieDetails**
   - Location: End of page (after all details)
   - Show: Horizontal scrollable grid (like Netflix's "More Like This")
   - Items: 6-10 similar movies (posters)
   - Clickable: Should navigate to other movie details

#### Key Implementation Points:

- **Horizontal Scroll**: Use CSS `overflow-x-auto` or `react-intersection-observer`
- **Movie Cards**: Reuse `MovieCard` component from home page
- **Lazy Loading**: Show first 10, can scroll for more
- **Click Handling**: `onClick={() => navigate({ to: `/movie/${movie.id}` })}`

---

### **Feature 2.3: User Reviews Section**

**File to Modify:** `/src/pages/MovieDetails.tsx`  
**Time Estimate:** 30-45 minutes  
**Complexity:** ⭐⭐☆ Medium

#### What to Add:

1. **New TMDB API Call**
   - Endpoint: `/movie/{id}/reviews`
   - Returns: User reviews from TMDB

2. **Display Reviews**
   - Show: 3-5 top reviews
   - Display: Author, rating (if available), review text (truncated to 200 chars)
   - Option: "Read full review" link to TMDB

#### Optional: Local Reviews (for future database integration)
- Store user reviews in database
- Display alongside TMDB reviews
- Allow users to rate/review

---

## 📍 PHASE 3: Navigation & Browsing

### Objective
Improve navigation and content discovery with search refinement, genre filtering, and infinite scroll pagination.

---

### **Feature 3.1: Genre & Category Filters**

**Files to Modify:** `/src/pages/HomePage.tsx`, possibly create `/src/components/GenreFilter.tsx`  
**Time Estimate:** 1-1.5 hours  
**Complexity:** ⭐⭐⭐ Hard

#### What to Add:

1. **Genre List from TMDB**
   - New hook: `useGenres()` → calls `/genre/movie/list`
   - Returns: List of all movie genres (action, comedy, drama, etc.)

2. **Filter Component**
   - File: `/src/components/GenreFilter.tsx`
   - Props: `selectedGenre`, `onSelectGenre`
   - Shows: Horizontal scrollable genre pills
   - Active state: Highlighted pill for selected genre

3. **Integration**
   - Add filter above movie lists
   - Filter movies by selected genre
   - Update movie fetch queries with genre parameter

#### TMDB Genre Query:
```typescript
// Add parameter to existing queries:
discover/movie?with_genres=28 // Action
discover/movie?with_genres=35 // Comedy
discover/movie?with_genres=18 // Drama
```

---

### **Feature 3.2: Infinite Scroll Pagination**

**Files to Modify:** `/src/pages/HomePage.tsx`, `/src/components/MovieList.tsx`  
**Time Estimate:** 1-1.5 hours  
**Complexity:** ⭐⭐⭐ Hard

#### What to Add:

1. **Infinite Query Hook**
   - Install: `react-intersection-observer` (already in your package.json!)
   - Create: Hook for infinite scroll
   - Implementation: `useInfiniteQuery` from React Query

2. **Intersection Observer**
   - Detect when user scrolls near bottom
   - Auto-load next page of movies
   - Show loading state while fetching

3. **Pagination UI**
   - Loading spinner at bottom (like Netflix)
   - "Load More" button (optional fallback)
   - Auto-load on scroll (default behavior)

#### Code Pattern:
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['movies'],
  queryFn: ({ pageParam = 1 }) => fetchMovies(pageParam),
  getNextPageParam: (lastPage) => lastPage.page + 1,
});

// Then in JSX:
<div ref={ref}> {/* Intersection observer watches this */}
  {hasNextPage && <LoadingSpinner />}
</div>
```

---

### **Feature 3.3: Search Improvements**

**File to Modify:** `/src/assets/Components/Search.tsx`  
**Time Estimate:** 45-60 minutes  
**Complexity:** ⭐⭐☆ Medium

#### Current Issues (visible in error logs):
- Syntax error on line 54: `IF` (capital) should be `if` (lowercase)
- Semicolon missing after line 54
- Missing closing brace on line 65

#### What to Fix:

1. **Fix Syntax Errors**
   - Change `IF(` to `if (`
   - Add missing semicolons
   - Fix bracket matching

2. **Enhance Search**
   - Add debounce (300ms) - already in code
   - Show search results as dropdown (like Netflix)
   - Clear results button
   - "No results" message
   - Result count

3. **Search Features**
   - Search across: Movies, TV Shows (optional)
   - Filter by year (optional)
   - Sort by: Relevance, Rating, Release Date

---

### **Feature 3.4: Breadcrumb Navigation**

**Files to Create:** `/src/components/Breadcrumb.tsx`  
**Time Estimate:** 20-30 minutes  
**Complexity:** ⭐ Easy

#### What to Add:

1. **Breadcrumb Component**
   - Show: `Home > Genre > Movie Details`
   - Clickable: Each segment navigates
   - Location: Top of page near back button

2. **Implementation**
   - Use React Router `useLocation()`
   - Parse current route
   - Display breadcrumb path

---

## 🔄 Suggested Implementation Order

### Phase 2 (Movie Details Polish):
1. **Feature 2.1**: Cast & Crew (quick win, 30-45 min)
2. **Feature 2.2**: Similar Movies (rewarding, 45-60 min)
3. **Feature 2.3**: Reviews (nice-to-have, 30-45 min)

### Phase 3 (Navigation & Browsing):
1. **Feature 3.3**: Fix Search Errors (critical, 45-60 min)
2. **Feature 3.1**: Genre Filters (core feature, 1-1.5 hrs)
3. **Feature 3.2**: Infinite Scroll (polish, 1-1.5 hrs)
4. **Feature 3.4**: Breadcrumbs (optional, 20-30 min)

---

## 📊 Effort vs. Impact Matrix

| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| 2.1 Cast & Crew | ⭐⭐☆ | High | 1 |
| 2.2 Similar Movies | ⭐⭐⭐ | Very High | 2 |
| 2.3 Reviews | ⭐⭐☆ | Medium | 3 |
| 3.3 Fix Search | ⭐⭐☆ | High | 4 |
| 3.1 Genre Filters | ⭐⭐⭐ | Very High | 5 |
| 3.2 Infinite Scroll | ⭐⭐⭐ | High | 6 |
| 3.4 Breadcrumbs | ⭐☆☆ | Low | 7 |

---

## 🎯 Success Criteria

### Phase 2 Complete When:
- [ ] Cast & crew displays on movie details
- [ ] Director name shown prominently
- [ ] Top 5 cast members visible with photos
- [ ] Similar movies section loads
- [ ] Clicking similar movie navigates correctly
- [ ] Reviews section displays (if implemented)
- [ ] No console errors

### Phase 3 Complete When:
- [ ] Search syntax errors fixed
- [ ] Genre filter shows all genres
- [ ] Selecting genre filters movies
- [ ] Infinite scroll loads more movies
- [ ] Loading indicator shows during fetch
- [ ] No performance issues with large lists
- [ ] Breadcrumbs navigate correctly (if implemented)

---

## 🚀 Quick Start for Next Phase

### To Begin Phase 2.1 (Cast & Crew):

1. Create `/src/hooks/useMovieCredits.ts`
2. Add `getMovieCredits()` to `/src/services/tmdbApi.ts`
3. Import hook in `/src/pages/MovieDetails.tsx`
4. Add JSX section showing director and cast
5. Test with a known movie (e.g., Inception)

### Resources Needed:
- TMDB API docs: `/movie/{id}/credits`
- Component examples: Look at MovieCard.tsx for image patterns
- TailwindCSS: Grid classes for cast display

---

## 💡 Tips for Implementation

1. **Start with Phase 2.1** (Cast & Crew)
   - Smallest scope, quick feedback
   - Learn the pattern for TMDB API calls
   - Reusable for Phase 2.2

2. **Follow React Query Pattern**
   - Create hook → Create API function → Use in component
   - This pattern used 5x already, very familiar

3. **Reuse Existing Components**
   - MovieCard works for similar movies
   - Use same styling as existing buttons
   - No need to invent new patterns

4. **Test One Feature at a Time**
   - Implement feature completely
   - Test thoroughly before starting next
   - Commit to git between features

5. **Reference Existing Code**
   - MovieList.tsx (grid pattern)
   - MovieCard.tsx (styling, hover effects)
   - TrendingNow.tsx (scrollable section)

---

## 📚 Files You'll Create

### Phase 2:
- `/src/hooks/useMovieCredits.ts` (new)
- `/src/hooks/useSimilarMovies.ts` (new)
- `/src/hooks/useMovieReviews.ts` (new - optional)

### Phase 3:
- `/src/hooks/useGenres.ts` (new)
- `/src/hooks/useInfiniteMovies.ts` (new)
- `/src/components/GenreFilter.tsx` (new)
- `/src/components/Breadcrumb.tsx` (new - optional)

---

## 🔐 API Endpoints Summary

### Phase 2 Endpoints:
```
GET /movie/{id}/credits
GET /movie/{id}/similar
GET /movie/{id}/reviews
```

### Phase 3 Endpoints:
```
GET /genre/movie/list
GET /discover/movie?with_genres={genre_id}&page={page}
```

---

## ✅ Checklist for Next Phase Start

- [ ] Phase 1 (trailer enhancements) fully complete and tested
- [ ] All code committed to git
- [ ] TRAILER_ENHANCEMENTS_IMPLEMENTATION.md reviewed
- [ ] Ready to start Phase 2.1 (Cast & Crew)
- [ ] Have TMDB API docs available
- [ ] Test movie ready (Inception, Avatar, etc.)

---

## 📞 Common Questions

**Q: Do I need to modify MovieCard component?**  
A: No, it already works. Just pass similar movies data to it.

**Q: Should I add caching to these new hooks?**  
A: Yes, follow same pattern as useMovieVideos (5-10 min stale time).

**Q: What if TMDB has no data for a movie?**  
A: Use `?.results?.length > 0` checks, show nothing if empty.

**Q: Can I do all features at once?**  
A: Not recommended. One feature at a time, test between each.

**Q: How do I handle movies with no cast data?**  
A: Check `cast.length > 0` before rendering, show fallback message.

---

## 🎬 Next Steps

1. Review this document thoroughly
2. Choose which feature to start with (recommend 2.1)
3. Create the hooks file
4. Follow the API pattern from existing hooks
5. Add the API function to tmdbApi.ts
6. Implement JSX component
7. Test thoroughly
8. Move to next feature

---

**Status:** Ready for Phase 2 Implementation  
**Estimated Total Time:** Phase 2 (1-2 hrs) + Phase 3 (2-3 hrs) = 3-5 hours total  
**Difficulty:** Medium (pattern already established)  
**Support:** Existing code shows the pattern, follow it!

---

*This roadmap is meant as a guide. Adjust features or order based on your priorities. The important thing is following the established patterns and testing thoroughly.*
