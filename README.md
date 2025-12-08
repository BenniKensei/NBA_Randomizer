# NBA Draft Randomizer 🏀

An interactive web application for conducting randomized NBA draft games with friends - play locally on one device or online in real-time!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://nba-randomizer.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange)](https://firebase.google.com/)

**🌐 Play Now:** [https://nba-randomizer.vercel.app](https://nba-randomizer.vercel.app)

## ✨ Features

### 🏠 Local Multiplayer
- **Hot Seat Mode**: Two players share one device
- Turn-based drafting system with 6 rounds per player
- Randomized NBA teams and historical eras
- Strategic abilities:
  - **Skip** (once per player): Re-roll team or era
  - **Move** (once per player): Swap drafted players between positions

### 🌐 Online Multiplayer
- **Real-Time Sync**: Play with friends remotely via Firebase
- **6-Digit Game Codes**: Simple and secure game joining
- **Player Names**: Personalized multiplayer experience
- **Turn Control**: Only the active player can interact
- **Smart State Management**: Prevents opponent roster interaction
- **Rematch System**: Play again with alternating starting player
- **Session Management**: Clean game creation, joining, and leaving

### 🎮 Game Mechanics
- Draft one player for each position: **PG, SG, SF, PF, C, 6th Man**
- Each pick randomizes to a specific **NBA team** and **historical era**
- **Static NBA Player Database**: 150+ NBA legends and current stars (1960s-2025)
  - Instant autocomplete suggestions as you type
  - Includes positions, team colors, and complete team histories
  - No API rate limits or delays
- Validation ensures players match their team assignment
- Duplicate player prevention across both rosters
- Optional Skip and Move abilities for strategic gameplay

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/backbenni88-ai/NBA_Randomizer.git
cd NBA_Randomizer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [https://nba-randomizer.vercel.app](https://nba-randomizer.vercel.app) to start playing!

## 📖 How to Play

### Local Multiplayer
1. Click **"Local Multiplayer"** on the start screen
2. Configure game settings (optional Skip/Move abilities)
3. Click **"Start Game"**
4. Players alternate turns:
   - Click **"SPIN"** to randomize team and era
   - Enter player name (autocomplete suggests valid players)
   - Select a position for your pick
   - Click **"Lock In Pick"**

### Online Multiplayer
1. Click **"Online Multiplayer"** on the start screen
2. **Enter your name** in the name field
3. Choose your action:
   - **Create Game**: Click "Create Online Game" → Share the 6-digit code
   - **Join Game**: Enter the 6-digit code → Click "Join"
4. Wait for both players to connect
5. Take turns drafting (only active player can spin/draft)
6. Use **"Play Again"** after the game to rematch with swapped starting player

## 🔧 Firebase Setup (Required for Online Multiplayer Only)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

2. Enable **Realtime Database** in your Firebase project

3. Set up database security rules:
```json
{
  "rules": {
    "games": {
      ".read": true,
      "$gameId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

4. Get your Firebase configuration from Project Settings

5. Update `src/lib/firebase.ts` with your credentials:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

6. (Optional) Create `.env.local` for environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note**: Local multiplayer works without Firebase configuration!

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) (Online mode only)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Animations**: [Anime.js](https://animejs.com/)

## 📂 Project Structure

```
NBA_Randomizer/
├── docs/                        # Documentation
│   ├── BUG_ANALYSIS.md
│   ├── COPYRIGHT_FREE_RESOURCES.md
│   ├── DEPLOYMENT.md
│   ├── PROJECT_STRUCTURE.md
│   └── README.md
├── public/                      # Static assets
├── scripts/                     # Deployment scripts
│   ├── deploy.ps1               # Windows deployment
│   └── deploy.sh                # Unix deployment
├── src/                         # Source code
│   ├── app/                     # Next.js app directory
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Home page (game entry point)
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── game/                # Game components
│   │   │   ├── Game.tsx         # Main game controller & logic
│   │   │   ├── StartScreen.tsx  # Mode selection & configuration
│   │   │   ├── SpinnerCard.tsx  # Team/era randomizer UI
│   │   │   ├── EndScreen.tsx    # Game results display
│   │   │   ├── RosterDisplay.tsx # Player roster with team colors
│   │   │   └── MultiplayerSetup.tsx # Online game creation/joining
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.tsx       # Styled button component
│   │       ├── Card.tsx         # Card container
│   │       ├── Logo.tsx         # NBA logo component
│   │       └── SimplePlayerAutocomplete.tsx # Player autocomplete
│   ├── constants/
│   │   ├── gameData.ts          # NBA teams and era definitions
│   │   └── nbaPlayers.ts        # Static NBA player database (1011 players)
│   ├── hooks/
│   │   └── useGameHelpers.ts    # Custom React hooks
│   ├── lib/
│   │   ├── animations.ts        # Animation utilities
│   │   └── firebase.ts          # Firebase configuration
│   ├── types/
│   │   ├── index.ts             # Core type definitions
│   │   └── multiplayer.ts       # Multiplayer game state types
│   └── utils/
│       ├── gameLogic.ts         # Draft logic and spin mechanics
│       ├── multiplayer.ts       # Firebase multiplayer operations
│       ├── storage.ts           # LocalStorage utilities
│       └── teamMapping.ts       # Team name to abbreviation mapping
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── database.rules.json          # Firebase security rules
├── firebase.json                # Firebase configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── README.md                    # This file
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── vercel.json                  # Vercel deployment config
```

## 🎯 Key Features Implementation

### Static NBA Player Database
The app uses a curated database of **1011+ NBA players** spanning from the 1960s to 2025, including:
- **Franchise Legends**: Lakers (Magic, Kobe, Shaq), Celtics (Bird, Pierce, KG), Bulls (Jordan, Pippen, Rodman)
- **Modern Stars**: LeBron, Durant, Curry, Giannis, Jokic, Embiid, Tatum, Luka
- **Complete Team Histories**: Multi-team careers tracked (e.g., LeBron: CLE/MIA/LAL)
- **Historical Players**: 60s-90s legends including Wilt, Kareem, Dr. J, Hakeem
- **Position Data**: Accurate position assignments for each player
- **Team Colors**: Visual indicators using official NBA team colors
- **Instant Filtering**: No API delays or rate limits

### Player Validation System
- Validates player-team matchups using historical team data
- Prevents duplicate player picks across both rosters
- Only allows players from the database (no typos or invalid entries)
- Clear error messages for invalid selections

### Player Roster Protection
In online multiplayer, players can only interact with their own roster during the Move action. Opponent rosters are locked to prevent accidental or malicious interference.

### Alternating Starting Player
After a rematch, the starting player alternates automatically, ensuring fair gameplay across multiple games.

### Real-Time Synchronization
Firebase Realtime Database ensures both players see the same game state instantly. Action IDs prevent sync loops and duplicate updates.

## 🚢 Deployment

### Live Demo on Vercel
The application is deployed and accessible at: **[https://nba-randomizer.vercel.app](https://nba-randomizer.vercel.app)**

### Deploy Your Own Version

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com/)
3. Add Firebase environment variables (only for online multiplayer)
4. Deploy!

Vercel automatically deploys on every push to the main branch.

### Build for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NBA team data and historical eras
- [Lucide](https://lucide.dev/) for beautiful icons
- [Firebase](https://firebase.google.com/) for real-time multiplayer capabilities
- [Vercel](https://vercel.com/) for seamless deployment
- [Anime.js](https://animejs.com/) for smooth animations

---

**Built with ❤️ for NBA fans**

**[🎮 Play Live on Vercel](https://nba-randomizer.vercel.app)** | [Report Bug](https://github.com/backbenni88-ai/NBA_Randomizer/issues) | [Request Feature](https://github.com/backbenni88-ai/NBA_Randomizer/issues)
