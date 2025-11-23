# Project Structure Documentation

## 📁 Directory Overview

### `/src/app/` - Next.js App Router
Main application pages and layouts using Next.js 14 App Router.

- **layout.tsx** - Root layout with metadata and global providers
- **page.tsx** - Home page (entry point)
- **globals.css** - Global styles, Tailwind directives, custom animations

### `/src/components/` - React Components
Organized into UI components and game-specific components.

#### `/src/components/ui/` - Reusable UI Components
Generic, reusable components used throughout the app.
- **Button.tsx** - Animated button component with variants
- **Card.tsx** - Container card component

#### `/src/components/game/` - Game-Specific Components
Components specific to the NBA Draft game logic.
- **Game.tsx** - Main game controller with state management
- **StartScreen.tsx** - Welcome/intro screen
- **EndScreen.tsx** - Results/comparison screen
- **SpinnerCard.tsx** - Team/Era randomizer interface
- **RosterDisplay.tsx** - Player roster visualization

### `/src/constants/` - Static Data
Constant values used throughout the application.
- **gameData.ts** - NBA teams, eras, positions data

### `/src/types/` - TypeScript Definitions
Type definitions and interfaces.
- **index.ts** - Main type exports (Team, Player, Roster, etc.)

### `/src/lib/` - Utility Libraries
Third-party library wrappers and helpers.
- **animations.ts** - Anime.js animation helpers and presets

### `/src/utils/` - Utility Functions
Pure helper functions for various tasks.
- **gameLogic.ts** - Game state calculations and helpers
- **storage.ts** - LocalStorage management utilities

### `/src/hooks/` - Custom React Hooks
Reusable React hooks for common patterns.
- **useGameHelpers.ts** - Game-related hooks (cleanup, localStorage)

### `/docs/` - Documentation
Project documentation and guides.
- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Deployment instructions
- **SETUP_COMPLETE.md** - Setup guide
- **COPYRIGHT_FREE_RESOURCES.md** - Asset resources

### `/public/` - Static Assets
Public static files served directly.
- Images, icons, fonts (add as needed)

## 🔧 Configuration Files

### Root Level
- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript configuration
- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **.eslintrc.json** - ESLint rules
- **vercel.json** - Vercel deployment config
- **.gitignore** - Git ignore rules
- **.vercelignore** - Vercel ignore rules

### Deployment Scripts
- **deploy.sh** - Bash deployment script
- **deploy.ps1** - PowerShell deployment script

## 📦 Import Aliases

All imports use the `@/` alias for cleaner paths:

```typescript
// Instead of: import { Button } from '../../components/ui/Button'
import { Button } from '@/components/ui/Button';

// Works for all directories:
import { TEAMS } from '@/constants/gameData';
import { staggerFadeIn } from '@/lib/animations';
import { getCurrentPlayer } from '@/utils/gameLogic';
import { useCleanup } from '@/hooks/useGameHelpers';
```

## 🌊 Data Flow

```
User Action
    ↓
Game.tsx (State Management)
    ↓
Components (UI Rendering)
    ↓
Utils/Lib (Helper Functions)
    ↓
Constants/Types (Data)
```

## 🎯 Best Practices

1. **Components** - Keep components small and focused
2. **Utilities** - Extract reusable logic into utils/lib
3. **Types** - Define types in `/types` for reusability
4. **Hooks** - Use custom hooks for complex state logic
5. **Constants** - Store static data in `/constants`
6. **Documentation** - Update docs when adding features

## 🚀 Adding New Features

### New UI Component
1. Create in `/src/components/ui/`
2. Export from component file
3. Import using `@/components/ui/ComponentName`

### New Game Feature
1. Add component to `/src/components/game/`
2. Add types to `/src/types/index.ts`
3. Add constants to `/src/constants/gameData.ts`
4. Add utilities to `/src/utils/` if needed

### New Animation
1. Add animation helper to `/src/lib/animations.ts`
2. Import and use in components

### New Hook
1. Create in `/src/hooks/`
2. Follow `use*` naming convention
3. Export and import as needed

---

**This structure keeps the codebase organized, maintainable, and scalable!** 🎉
