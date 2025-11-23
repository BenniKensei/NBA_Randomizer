# NBA Draft Randomizer 🏀

An interactive NBA draft game where two players compete to build the best roster with random team and era constraints!

## 📚 Documentation

- [Full README](./docs/README.md) - Complete project documentation
- [Deployment Guide](./docs/DEPLOYMENT.md) - How to deploy to Vercel
- [Setup Guide](./docs/SETUP_COMPLETE.md) - Setup instructions
- [Copyright-Free Resources](./docs/COPYRIGHT_FREE_RESOURCES.md) - Where to find free assets

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 🎮 How to Play

1. **Start** - Click "Start Draft"
2. **Spin** - Get a random NBA team + era
3. **Choose** - Select any available position
4. **Draft** - Name a player from that team/era
5. **Repeat** - Alternate between players until all 6 positions filled
6. **Compare** - See who built the better squad!

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Anime.js
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📂 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── game/              # Game-specific components
│   │   ├── Game.tsx       # Main game logic
│   │   ├── StartScreen.tsx
│   │   ├── EndScreen.tsx
│   │   ├── SpinnerCard.tsx
│   │   └── RosterDisplay.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       └── Card.tsx
├── constants/             # Game data constants
│   └── gameData.ts        # Teams, eras, positions
├── hooks/                 # Custom React hooks
│   └── useGameHelpers.ts
├── lib/                   # Utility libraries
│   └── animations.ts      # Animation helpers
├── types/                 # TypeScript definitions
│   └── index.ts
└── utils/                 # Utility functions
    ├── gameLogic.ts       # Game logic helpers
    └── storage.ts         # LocalStorage helpers
```

## 📝 License

MIT License - Free to use!

---

**Built with ❤️ for NBA fans**
