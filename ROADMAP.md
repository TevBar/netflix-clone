# Netflix Clone — Development Roadmap
**Last Updated:** May 30, 2026

---

## Current Status: Phase 4 of 6

---

## COMPLETED ✅

### Foundation (Phase 1)
- [x] Project setup: Vite + React 19 + TypeScript
- [x] TanStack Router (file-based routing)
- [x] TanStack Query v5 (data fetching + caching)
- [x] Tailwind CSS v4
- [x] Shadcn/ui component library
- [x] TMDB API integration with full type safety
- [x] Image URL transformation pipeline (`transformTMDBMovie`)
- [x] Global error boundary (`ErrorBoundary.tsx`)
- [x] Zustand store with localStorage persistence

### Core Pages (Phase 2)
- [x] Home page with Hero banner
- [x] MovieDetails page (backdrop, poster, cast, overview, ratings)
- [x] MyListPage (grid view, empty state — unified favorites + watchlist)
- [x] SearchResultsPage (genre filter, year filter, sort, infinite scroll)
- [x] BrowsePage (infinite scroll grid, Header included)
- [x] GenrePage (`/genre/:id` — infinite scroll, IntersectionObserver)
- [x] Sign In / Sign Up pages

### Authentication & Routing (Phase 3)
- [x] Clerk real authentication (replaces mock auth)
- [x] Protected routes (My List requires login)
- [x] `/favorites` and `/watchlist` redirect to `/my-list`
- [x] Sonner toast notifications for list/rating actions

### UI & Interactions (Phase 4 — current session)
- [x] Hero: left-aligned content, cinematic gradient, parallax scroll
- [x] Hero: Play opens trailer modal, More Info navigates to details
- [x] Hero: trailer autoplay (5-second delay, muted, 1.5s crossfade)
- [x] Hero: mute/unmute via YouTube postMessage (no iframe reload)
- [x] Netflix-style row carousel (hover expand, left/right arrows, page indicators)
- [x] MovieCard hover overlay fixed for landscape (lg) cards
- [x] MovieCard video preview on hover (1.5s delay, lazy fetch, lg cards only)
- [x] MovieCard watch progress bar
- [x] MovieCard rating badge (ThumbsUp/ThumbsDown in hover overlay)
- [x] Continue Watching row (persisted, sorted by last watched)
- [x] My List — unified favorites + watchlist, persisted in Zustand
- [x] Rating system — thumbs up/down on MovieDetails, badge on MovieCard
- [x] Genre browsing page with infinite scroll
- [x] Genre tags on MovieDetails are clickable (navigate to `/genre/:id`)
- [x] Top 10 in the US Today row with Netflix-style stroke numbers
- [x] Row badge chip (red "TOP 10" label)

### Technical Debt (Resolved)
- [x] Removed 7 unused source files (SearchResults, MovieList, TrendingNow, etc.)
- [x] Consolidated hook files — only `useNetflixQuery.ts` remains
- [x] Deleted duplicate `MockAuthContext.tsx`
- [x] Removed 10 stale markdown docs from root
- [x] Environment variables consolidated to single `.env.local`
- [x] Fixed Zustand selector infinite loop (stable reference pattern)
- [x] Fixed `div#root` 32px padding blocking full-width layout
- [x] Fixed Hero Play button invisible (CSS override removed)

---

## NOT STARTED — NEEDED FOR GREAT CLONE 🚀

### Visual / UX (High Impact)

1. **Proper footer component**
   - No footer exists anywhere in the app
   - Netflix has language selector, FAQ links, contact info, copyright
   - Low complexity, high polish

2. **Mobile responsiveness**
   - Header collapses to hamburger menu on small screens
   - MovieRow becomes properly swipeable on touch devices
   - Hero buttons stack vertically on mobile
   - MovieCard hover effects replaced with tap behavior on touch

3. **Recently viewed row**
   - Track which movies the user has clicked on
   - Show a "Recently Viewed" row on Home
   - Store in localStorage via a small Zustand slice

### Quality Gaps

4. **Inconsistent loading states**
   - Some pages use skeleton loaders, others use spinners, others use "Loading..." text
   - Standardize: all movie grids → skeleton cards, detail pages → shimmer skeletons

5. **SearchResultsPage genre filter uses string matching**
   - File: `src/pages/SearchResultsPage.tsx`
   - Problem: Genre filtering uses `movie.genre_ids` matched against genre names (fragile)
   - Fix: Filter using numeric genre IDs from the TMDB genres API

---

## NICE TO HAVE (Polish) ✨

- Keyboard shortcut `S` or `/` to focus the search bar (like Netflix)
- Smooth page transitions between routes (Framer Motion `AnimatePresence`)
- Share movie button (copy link to clipboard)
- Accessibility audit: WCAG AA color contrast, focus management between modals
- PWA manifest — install as home screen app
- Dark/light mode toggle (currently hardcoded dark)

---

## Priority Order for Next Sessions

| Order | Task | Impact | Effort |
|-------|------|--------|--------|
| 1 | Recently Viewed row | Medium | 45 min |
| 2 | Footer component | Medium | 30 min |
| 3 | Fix genre filter (numeric IDs) | Medium | 20 min |
| 4 | Standardize loading states | Low | 1 hour |
| 5 | Mobile responsiveness | High | 3–4 hours |
