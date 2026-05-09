# Netflix Clone - Next Implementation Steps Guide
**Format: Specific Line Numbers + Detailed Explanations**

---

## 📍 CURRENT STATE - Trailer Feature (COMPLETE ✅)

### What Was Implemented
The MovieDetails component now has full trailer functionality with:
1. Video data fetching from TMDB API
2. Trailer button in the action buttons section
3. YouTube embed modal overlay

---

## 🎯 NEXT STEPS - Future Features to Implement

### **STEP 1: Add Keyboard Escape Key Support to Close Modal**

**Purpose:** Improve UX by allowing users to press ESC to close the trailer modal instead of only clicking the X button.

**File:** `/src/pages/MovieDetails.tsx`

**Line Number to Add:** After line 48 (after the trailer variable declaration)

**Location Context:**
- Currently at line 48: `const trailer = videos?.results?.find(...)`
- You'll add the useEffect hook after this line

**Code to Add:**
```typescript
// Add this useEffect hook after line 48
useEffect(() => {
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showVideoModal) {
      setShowVideoModal(false);
    }
  };

  if (showVideoModal) {
    window.addEventListener('keydown', handleEscapeKey);
  }

  return () => {
    window.removeEventListener('keydown', handleEscapeKey);
  };
}, [showVideoModal]);
```

**Step-by-Step Explanation:**

1. **useEffect Hook (Line 49-64):**
   - Runs whenever `showVideoModal` state changes
   - Sets up keyboard event listener when modal is open

2. **Event Handler Function (Line 50-54):**
   - `handleEscapeKey` checks if pressed key is 'Escape'
   - Only closes modal if `showVideoModal` is true
   - Calls `setShowVideoModal(false)` to close

3. **Event Listener Setup (Line 56-58):**
   - `if (showVideoModal)` - only add listener when modal is visible
   - `window.addEventListener` - listens for keyboard events globally
   - Prevents memory leaks by checking condition

4. **Cleanup Function (Line 60-62):**
   - `return () => { ... }` - cleanup runs when component unmounts or effect re-runs
   - `window.removeEventListener` - removes the event listener
   - Prevents duplicate listeners from stacking up

5. **Dependency Array (Line 63):**
   - `[showVideoModal]` - re-runs effect when modal state changes
   - Automatically adds/removes listener as modal opens/closes

**Import Required:**
Already imported at top: `import { useEffect } from 'react'` ✅

**Testing Checklist:**
- [ ] Open a movie's trailer
- [ ] Press ESC key
- [ ] Modal should close
- [ ] Click X button still works
- [ ] No console errors

---

### **STEP 2: Add Loading Spinner While Video Initializes**

**Purpose:** Show user that video is loading before YouTube iframe displays.

**File:** `/src/pages/MovieDetails.tsx`

**Lines to Modify:**
- Line 27: Add new state (around line 27 with other useState calls)
- Line 232-247: Modify the modal JSX

**Step 1A - Add State (Line 27-28):**

**Current Code (Lines 24-28):**
```typescript
const [backdropLoading, setBackdropLoading] = useState(true)
const [posterLoading, setPosterLoading] = useState(true)  
const [posterError, setPosterError] = useState(false)
const [showVideoModal, setShowVideoModal] = useState(false);
```

**New Code (Add after line 28):**
```typescript
const [isVideoLoading, setIsVideoLoading] = useState(true);
```

**Explanation:**
- Creates state to track if YouTube video is still loading
- Initialized as `true` so spinner shows when modal opens
- Will be set to `false` when iframe `onLoad` event fires

---

**Step 1B - Modify Modal to Show Spinner (Lines 232-247):**

**Current Modal Code:**
```typescript
{/* Video Modal */}
{showVideoModal && trailer && (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div className="relative w-full max-w-4xl">
      <button 
        onClick={() => setShowVideoModal(false)} 
        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} />
      </button>
      <iframe
        width="100%"
        height="600"
        src={`https://www.youtube.com/embed/${trailer.key}`}
        title="Movie Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      />
    </div>
  </div>
)}
```

**New Modal Code (Replace entire block Lines 231-247):**
```typescript
{/* Video Modal */}
{showVideoModal && trailer && (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div className="relative w-full max-w-4xl">
      {/* Close Button */}
      <button 
        onClick={() => setShowVideoModal(false)} 
        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} />
      </button>
      
      {/* Loading Spinner */}
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300">Loading trailer...</p>
          </div>
        </div>
      )}
      
      {/* YouTube Player */}
      <iframe
        width="100%"
        height="600"
        src={`https://www.youtube.com/embed/${trailer.key}`}
        title="Movie Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsVideoLoading(false)}
        className="rounded-lg"
      />
    </div>
  </div>
)}
```

**Detailed Explanation of Changes:**

1. **Loading Spinner JSX (Lines 247-254):**
   - `{isVideoLoading && (...)}` - only shows when video is loading
   - `absolute inset-0` - covers entire iframe area
   - `bg-black` - dark background while loading
   - Spinner animation matches Netflix styling (yellow-600)
   - Loading text provides user feedback

2. **Spinner Animation (Line 251):**
   - `border-4 border-yellow-600` - yellow border (Netflix color)
   - `border-t-transparent` - top border transparent creates spinning effect
   - `animate-spin` - TailwindCSS animation
   - `w-12 h-12` - 48px square spinner

3. **iframe Changes (Line 256):**
   - Added `onLoad={() => setIsVideoLoading(false)}`
   - When iframe finishes loading, hides spinner
   - Triggers when video player is ready

**Testing Checklist:**
- [ ] Click "Trailer" button
- [ ] Loading spinner appears for ~2-3 seconds
- [ ] YouTube video appears
- [ ] Spinner disappears
- [ ] No console errors

---

### **STEP 3: Add Multiple Video Support (Trailers + Clips)**

**Purpose:** Show all available videos (trailers, clips, teasers) instead of just trailers.

**File:** `/src/pages/MovieDetails.tsx`

**Lines to Modify:**
- Line 27: Add new state for selected video
- Lines 44-47: Modify video selection logic
- Lines 213-221: Add video selector dropdown

**Step 1 - Add State (After line 28):**

**Add this line:**
```typescript
const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);
```

**Explanation:**
- Tracks which video the user selected
- Initially `null` (no video selected)
- `<string | null>` is TypeScript type annotation
- Allows switching between different available videos

---

**Step 2 - Modify Video Logic (Lines 44-47):**

**Current Code:**
```typescript
const { data: videos } = useMovieVideos(parseInt(id));
const trailer = videos?.results?.find(
  (video) => video.type === 'Trailer' && video.site === 'YouTube'
);
```

**New Code (Replace Lines 44-47):**
```typescript
const { data: videos } = useMovieVideos(parseInt(id));

// Find all YouTube videos (trailers, clips, teasers)
const youtubeVideos = videos?.results?.filter(
  (video) => video.site === 'YouTube'
) || [];

// Get the trailer or first available video
const trailer = youtubeVideos.find(
  (video) => video.type === 'Trailer'
) || youtubeVideos[0];

// Get selected video or fall back to trailer
const selectedVideo = selectedVideoKey 
  ? youtubeVideos.find(v => v.key === selectedVideoKey)
  : trailer;
```

**Explanation:**

1. **Filter All YouTube Videos (Line 47-49):**
   - `videos?.results?.filter(...)` - get ALL videos
   - `video.site === 'YouTube'` - only YouTube (not other platforms)
   - `|| []` - default to empty array if videos undefined

2. **Find Trailer (Line 52-55):**
   - First tries to find a video with type 'Trailer'
   - If no trailer, uses first available video `youtubeVideos[0]`
   - Ensures there's always a default video

3. **Select Video Based on State (Line 57-60):**
   - If `selectedVideoKey` exists, find that specific video
   - Otherwise use the trailer as default
   - Allows user selection to override

---

**Step 3 - Add Video Selector UI (Lines 213-221):**

**Current Trailer Button:**
```typescript
{/* Trailer Button */}
{trailer && (
  <button
    onClick={() => setShowVideoModal(true)}
    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-yellow-600 hover:bg-yellow-700 text-white"
  >
    <Play size={20} />
    Trailer
  </button>
)}
```

**New Code with Dropdown (Replace Lines 213-221):**
```typescript
{/* Videos Button with Dropdown */}
{youtubeVideos.length > 0 && (
  <div className="relative group">
    <button
      onClick={() => setShowVideoModal(true)}
      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-yellow-600 hover:bg-yellow-700 text-white"
    >
      <Play size={20} />
      {youtubeVideos.length > 1 ? 'Videos' : 'Trailer'}
    </button>
    
    {/* Dropdown Menu - shows on hover */}
    {youtubeVideos.length > 1 && (
      <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
        {youtubeVideos.map((video) => (
          <button
            key={video.key}
            onClick={() => {
              setSelectedVideoKey(video.key);
              setShowVideoModal(true);
            }}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow-600 first:rounded-t-lg last:rounded-b-lg transition-colors"
          >
            {video.type} • {video.name.substring(0, 30)}...
          </button>
        ))}
      </div>
    )}
  </div>
)}
```

**Detailed Explanation:**

1. **Conditional Rendering (Line 215):**
   - `{youtubeVideos.length > 0 && (` - only show if videos exist
   - Prevents showing button when no videos available

2. **Main Button (Lines 216-225):**
   - Same styling as before
   - Dynamic text: "Videos" if multiple, "Trailer" if single
   - Opens modal on click

3. **Dropdown Container (Line 227-229):**
   - `relative group` - enables hover effects
   - Hidden by default: `opacity-0 invisible`
   - Shows on hover: `group-hover:opacity-100 group-hover:visible`

4. **Dropdown Items (Lines 230-244):**
   - `youtubeVideos.map(...)` - renders button for each video
   - Clicking sets `selectedVideoKey` and opens modal
   - Shows video type and name (truncated to 30 chars)
   - Hover effect with yellow background

---

### **STEP 4: Update Modal to Show Selected Video**

**File:** `/src/pages/MovieDetails.tsx`

**Lines to Modify:** Lines 256-272 (the iframe section)

**Current Code:**
```typescript
<iframe
  width="100%"
  height="600"
  src={`https://www.youtube.com/embed/${trailer.key}`}
  title="Movie Trailer"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  onLoad={() => setIsVideoLoading(false)}
  className="rounded-lg"
/>
```

**New Code (Replace Lines 256-272):**
```typescript
{selectedVideo && (
  <iframe
    width="100%"
    height="600"
    src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
    title={selectedVideo.name}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    onLoad={() => setIsVideoLoading(false)}
    className="rounded-lg"
  />
)}
```

**Explanation:**

1. **selectedVideo Check (Line 256):**
   - Only renders iframe if `selectedVideo` exists
   - Prevents errors if video data missing

2. **Dynamic Video Key (Line 260):**
   - `${selectedVideo.key}?autoplay=1` - uses selected video
   - `?autoplay=1` - YouTube plays automatically

3. **Dynamic Title (Line 261):**
   - `title={selectedVideo.name}` - uses actual video name
   - Better accessibility and clarity

---

## 📊 Implementation Summary Table

| Step | Feature | File | Lines | Complexity | Estimated Time |
|------|---------|------|-------|-----------|-----------------|
| 1 | ESC Key Close | MovieDetails.tsx | 49-63 | ⭐☆☆ Easy | 5 min |
| 2 | Loading Spinner | MovieDetails.tsx | 28, 231-272 | ⭐⭐☆ Medium | 10 min |
| 3 | Multiple Videos | MovieDetails.tsx | 28, 44-60, 213-245 | ⭐⭐⭐ Hard | 20 min |
| 4 | Select Video | MovieDetails.tsx | 256-266 | ⭐☆☆ Easy | 5 min |

---

## 🔍 Visual Workflow

```
USER JOURNEY - Trailer Feature with All Steps:

1. Opens Movie Details Page
   ↓
2. Sees Video Button ("Trailer" or "Videos")
   ↓
3a. Hovers over button (if multiple videos)
    ↓
    Dropdown shows all available videos
    ↓
    Selects a video
   ↓
4. Clicks button → Modal opens
   ↓
5. Loading spinner displays (2-3 seconds)
   ↓
6. YouTube video loads and plays
   ↓
7a. User can press ESC to close
7b. User can click X to close
   ↓
8. Modal closes, returns to movie details
```

---

## ✅ Testing Checklist - All Steps

### Step 1: ESC Key
- [ ] Open trailer modal
- [ ] Press ESC key
- [ ] Modal closes
- [ ] Pressing ESC when modal closed does nothing
- [ ] Check browser console for errors

### Step 2: Loading Spinner
- [ ] Click "Trailer" button
- [ ] Spinner appears immediately
- [ ] Spinner shows for 2-3 seconds
- [ ] YouTube video appears
- [ ] Spinner disappears
- [ ] Video plays

### Step 3: Multiple Videos
- [ ] Check movie has multiple videos in TMDB
- [ ] Button shows "Videos" if multiple available
- [ ] Hover over button shows dropdown
- [ ] Each video in dropdown has correct type and name
- [ ] Clicking different videos opens them in modal

### Step 4: Select Video
- [ ] Select different video from dropdown
- [ ] Modal opens with selected video
- [ ] Selected video plays correctly
- [ ] Video title updates properly

---

## 🐛 Common Issues & Solutions

### Issue: Modal won't close with ESC
**Solution:** Check that `useEffect` dependencies include `[showVideoModal]`

### Issue: Loading spinner never disappears
**Solution:** Verify `onLoad={() => setIsVideoLoading(false)}` is on iframe element

### Issue: Dropdown menu doesn't appear
**Solution:** Ensure parent has `relative group` classes and items have `group-hover:` classes

### Issue: Selected video doesn't play
**Solution:** Check that `selectedVideoKey` is being set correctly, verify `selectedVideo` exists

---

## 📚 Code References

- **React Hooks:** https://react.dev/reference/react
- **TailwindCSS:** https://tailwindcss.com/docs
- **YouTube Embed:** https://developers.google.com/youtube/iframe_api_reference
- **TMDB API:** https://developer.themoviedb.org/reference

---

## 🎯 Priority Order

**Recommended Implementation Order:**
1. **Step 1** (ESC Key) - Quick win, improves UX
2. **Step 2** (Loading Spinner) - Better UX feedback
3. **Step 3** (Multiple Videos) - Core feature
4. **Step 4** (Select Video) - Completes Step 3

Or do them all at once if you prefer! Each step builds logically on the previous.

---

## 💡 Pro Tips

- Test each step individually before moving to the next
- Use browser DevTools to debug state changes
- Check React DevTools to see component re-renders
- Test on different movies to ensure robustness
- Make commits after each completed step

---

**Last Updated:** May 9, 2026  
**Status:** All 4 next steps ready for implementation ✅
