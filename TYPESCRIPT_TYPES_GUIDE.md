# TypeScript Types Organization in React Projects

## What are TypeScript Types?

TypeScript types define the shape and structure of data in your application. They provide compile-time type checking and better developer experience with IntelliSense.

## Why Create a Separate `types.ts` File?

### Benefits:
1. **Single Source of Truth**: All type definitions in one place
2. **Reusability**: Types can be imported and used across multiple components
3. **Maintainability**: Easy to update types when API or data structure changes
4. **Consistency**: Ensures all components use the same type definitions
5. **API Integration**: Prepared for future API integrations with proper types

### Example Structure:
```typescript
// types.ts
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  // ... other properties
}

export interface MovieListProps {
  movies: Movie[];
}
```

### Usage in Components:
```typescript
// MovieList.tsx
import type { MovieListProps } from './types';

const MovieList = ({ movies }: MovieListProps) => {
  // Component logic
};
```

## Best Practices:

### 1. Use Type-Only Imports
```typescript
import type { MovieListProps } from './types';
```
This tells TypeScript the import is only for type checking, not runtime.

### 2. Name Interfaces Descriptively
- `Movie` - represents a single movie object
- `MovieListProps` - props for MovieList component
- `TMDBResponse` - API response from TMDB

### 3. Group Related Types
```typescript
// Data types
export interface Movie { ... }
export interface MovieCategory { ... }

// Component prop types
export interface MovieListProps { ... }

// API types
export interface TMDBResponse { ... }
```

### 4. Prepare for API Integration
```typescript
export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}
```

## File Organization:

```
src/
├── assets/
│   └── Components/
│       ├── types.ts          # ← All type definitions
│       ├── MovieList.tsx     # ← Uses types from types.ts
│       ├── TrendingNow.tsx   # ← Uses types from types.ts
│       └── ...other components
```

## When to Add New Types:

1. **New Components**: Add prop interfaces
2. **API Integration**: Add response/request types
3. **New Data Structures**: Add interface definitions
4. **State Management**: Add state shape types

## TypeScript Configuration Notes:

- `verbatimModuleSyntax` requires type-only imports for types
- Empty interfaces trigger ESLint warnings (comment them out until needed)
- Use `interface` for object shapes, `type` for unions/aliases

This organization makes your codebase more scalable and maintainable as your Netflix clone grows!
