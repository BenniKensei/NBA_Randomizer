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
- **Logo.tsx** - NBA logo component
- **SimplePlayerAutocomplete.tsx** - Static NBA player database autocomplete with dropdown

#### `/src/components/game/` - Game-Specific Components
Components specific to the NBA Draft game logic.
- **Game.tsx** - Main game controller with state management
- **StartScreen.tsx** - Welcome/intro screen with mode selection
- **EndScreen.tsx** - Results/comparison screen
- **SpinnerCard.tsx** - Team/Era randomizer interface
- **RosterDisplay.tsx** - Player roster visualization with team colors
- **MultiplayerSetup.tsx** - Online multiplayer game creation/joining interface

### `/src/constants/` - Static Data
Constant values used throughout the application.
- **gameData.ts** - NBA teams, eras, positions data
- **nbaPlayers.ts** - Static NBA player database (150+ players with positions, teams, colors, histories)

### `/src/types/` - TypeScript Definitions
Type definitions and interfaces.
- **index.ts** - Main type exports (Team, Player, Roster, SpinResult, etc.)
- **multiplayer.ts** - Multiplayer game state types and Firebase types

### `/src/lib/` - Utility Libraries
Third-party library wrappers and helpers.
- **animations.ts** - Anime.js animation helpers and presets
- **firebase.ts** - Firebase Realtime Database configuration

### `/src/utils/` - Utility Functions
Pure helper functions for various tasks.
- **gameLogic.ts** - Game state calculations and helpers
- **storage.ts** - LocalStorage management utilities
- **multiplayer.ts** - Firebase multiplayer operations (create, join, sync)
- **teamMapping.ts** - Team name to abbreviation mapping

### `/src/hooks/` - Custom React Hooks
Reusable React hooks for common patterns.
- **useGameHelpers.ts** - Game-related hooks (cleanup, localStorage)

### `/docs/` - Documentation
Project documentation and guides.
- **README.md** - Full project documentation
- **PROJECT_STRUCTURE.md** - This file
- **DEPLOYMENT.md** - Deployment guide
- **COPYRIGHT_FREE_RESOURCES.md** - Resource attributions
- **BUG_ANALYSIS.md** - Testing documentation and known issues

### `/public/` - Static Assets
Static files served directly by Next.js.
- **favicon.svg** - Site favicon
- **logo.png** - NBA logo
- Various diagram and image files

## 🔧 Configuration Files (Root Level)

- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **tsconfig.json** - TypeScript compiler configuration
- **.eslintrc.json** - ESLint configuration
- **package.json** - Dependencies and scripts
- **vercel.json** - Vercel deployment configuration

## 🔥 Firebase Files (Root Level)

- **firebase.json** - Firebase hosting/functions configuration
- **database.rules.json** - Firebase Realtime Database security rules
- **.firebaserc** - Firebase project configuration

## 📜 Deployment Scripts (Root Level)

- **deploy.ps1** - PowerShell deployment script
- **deploy.sh** - Bash deployment script

## 🗂️ Key Features by File

### Player Database & Validation
- **src/constants/nbaPlayers.ts** - 150+ player database, validation functions
- **src/utils/teamMapping.ts** - Team abbreviation conversion
- **src/components/ui/SimplePlayerAutocomplete.tsx** - Autocomplete UI with dropdown

### Multiplayer System
- **src/utils/multiplayer.ts** - Firebase CRUD operations
- **src/types/multiplayer.ts** - Type definitions
- **src/components/game/MultiplayerSetup.tsx** - UI for creating/joining games
- **src/lib/firebase.ts** - Firebase initialization

### Game Logic
- **src/components/game/Game.tsx** - Main controller (945 lines)
- **src/utils/gameLogic.ts** - Helper functions
- **src/components/game/SpinnerCard.tsx** - Draft interface
- **src/components/game/RosterDisplay.tsx** - Player display with colors

## 📦 Dependencies

### Core
- Next.js 14.2.33
- React 18
- TypeScript 5

### UI & Styling
- Tailwind CSS
- Lucide React (icons)
- Anime.js (animations)

### Backend
- Firebase Realtime Database
- Firebase SDK

## 🚀 Build & Development

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📝 Notes

- The app works fully offline in local multiplayer mode
- Firebase is only required for online multiplayer
- Static player database eliminates API dependencies
- All game state is managed in React with optional Firebase sync

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
