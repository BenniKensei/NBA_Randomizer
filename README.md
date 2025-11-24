# NBA Draft Randomizer 🏀

An interactive web application for conducting randomized NBA draft games with friends - play locally on one device or online in real-time!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://nba-randomizer.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange)](https://firebase.google.com/)

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
- Draft authentic NBA players from the selected team/era combination
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

Open [[https://nba-randomizer.vercel.app](https://nba-randomizer.vercel.app)] to start playing!

## 📖 How to Play

### Local Multiplayer
1. Click **"Local Multiplayer"** on the start screen
2. Configure game settings (optional Skip/Move abilities)
3. Click **"Start Game"**
4. Players alternate turns:
   - Click **"SPIN"** to randomize team and era
   - Select a position for your pick
   - Enter the player's name and submit

### Online Multiplayer
1. Click **"Online Multiplayer"** on the start screen
2. **Enter your name** in the name field
3. Choose your action:
   - **Create Game**: Click "Create Online Game" → Share the 6-digit code
   - **Join Game**: Enter the 6-digit code → Click "Join"
4. Wait for both players to connect
5. Take turns drafting (only active player can spin/draft)
6. Use **"Play Again"** after the game to rematch with swapped starting player

## 🔧 Firebase Setup (Required for Online Multiplayer)

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

6. (Optional) Create `.env.local` for environment variables - see `.env.example`

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📂 Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page (game entry point)
│   └── globals.css              # Global styles
├── components/
│   ├── game/                    # Game components
│   │   ├── Game.tsx             # Main game controller & logic
│   │   ├── StartScreen.tsx      # Mode selection & configuration
│   │   ├── SpinnerCard.tsx      # Team/era randomizer UI
│   │   ├── EndScreen.tsx        # Game results display
│   │   ├── RosterDisplay.tsx    # Player roster with move functionality
│   │   └── MultiplayerSetup.tsx # Online game creation/joining
│   └── ui/                      # Reusable UI components
│       ├── Button.tsx           # Styled button component
│       ├── Card.tsx             # Card container
│       └── Logo.tsx             # NBA logo component
├── constants/
│   └── gameData.ts              # NBA teams and era definitions
├── lib/
│   ├── animations.ts            # Animation utilities
│   └── firebase.ts              # Firebase configuration
├── types/
│   ├── index.ts                 # Core type definitions
│   └── multiplayer.ts           # Multiplayer game state types
└── utils/
    ├── gameLogic.ts             # Draft logic and spin mechanics
    ├── multiplayer.ts           # Firebase multiplayer operations
    └── storage.ts               # LocalStorage utilities
```

## 🎯 Key Features Implementation

### Player Roster Protection
In online multiplayer, players can only interact with their own roster during the Move action. Opponent rosters are locked to prevent accidental or malicious interference.

### Alternating Starting Player
After a rematch, the starting player alternates automatically, ensuring fair gameplay across multiple games.

### Real-Time Synchronization
Firebase Realtime Database ensures both players see the same game state instantly. Action IDs prevent sync loops and duplicate updates.

### Session Management
Clean transitions between creating, joining, and leaving games. State is properly reset to prevent carryover issues.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com/)
3. Add Firebase environment variables (if using `.env.local`)
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

---

**Built with ❤️ for NBA fans**

[Live Demo](https://nba-randomizer.vercel.app) | [Report Bug](https://github.com/backbenni88-ai/NBA_Randomizer/issues) | [Request Feature](https://github.com/backbenni88-ai/NBA_Randomizer/issues)
