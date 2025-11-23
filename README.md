# NBA Draft Randomizer 🏀

An interactive web application for conducting randomized NBA draft games with friends - both locally and online!

## ✨ Features

### 🏠 Local Multiplayer (1v1)
- Two players share one device
- Turn-based drafting system
- 6 rounds of picks per player
- Position randomizer (PG, SG, SF, PF, C)
- Team and era randomization
- Skip abilities for team or era (once per player)
- Move players between positions (once per player)

### 🌐 Online Multiplayer
- Play against friends remotely in real-time
- Real-time synchronization via Firebase
- Shareable game codes (6-digit codes)
- Direct URL sharing for instant joining
- Turn-based control - only active player can interact
- Disconnection detection and notifications
- Pause/resume game support
- Rematch functionality

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

Open [http://localhost:3000](http://localhost:3000](https://nba-randomizer-lxn31p0tb-bennis-projects-9f13139c.vercel.app)) to play!

## 📖 How to Play

### Local Multiplayer
1. Click "Local Multiplayer" on the start screen
2. Configure game settings (enable/disable Skip and Move abilities)
3. Click "Start Game"
4. Players alternate turns:
   - Click "SPIN" to randomize team and era
   - Select a position for your drafted player
   - Enter player name and submit

### Online Multiplayer
1. Click "Online Multiplayer" on the start screen
2. Choose to create or join a game:
   - **Create Game**: Share the game code or URL with your friend
   - **Join Game**: Enter the 6-digit code or use the shared URL
3. Wait for both players to join
4. Host configures game settings and starts the game
5. Take turns drafting (only active player can interact)
6. Use "Menu" to pause and "Continue Online Draft" to resume
7. Use "Rematch" to start a new game with the same opponent

## 🎮 Game Rules

- Each player drafts 6 players (one for each position: PG, SG, SF, PF, C)
- The randomizer selects a team and era for each pick
- Players must pick from that team and era combination
- Optional abilities:
  - **Skip Team/Era**: Use once per game to get a new random team or era
  - **Move Player**: Use once per game to swap a player's position

## 🔥 Firebase Setup (for Online Multiplayer)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database
3. Set database rules:
```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```
4. Copy your Firebase configuration
5. Update `src/lib/firebase.ts` with your credentials
6. (Optional) Create `.env.local` file - see `.env.example`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time Database**: Firebase Realtime Database
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📂 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── game/              # Game-specific components
│   │   ├── Game.tsx       # Main game controller
│   │   ├── StartScreen.tsx # Mode selection & config
│   │   ├── SpinnerCard.tsx # Randomizer UI
│   │   ├── EndScreen.tsx  # Game results
│   │   ├── RosterDisplay.tsx # Roster display
│   │   └── MultiplayerSetup.tsx # Online game setup
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       └── Card.tsx
├── data/                  # NBA teams and eras data
├── lib/                   # Firebase configuration
│   └── firebase.ts
├── types/                 # TypeScript definitions
│   ├── index.ts
│   └── multiplayer.ts
└── utils/                 # Utility functions
    └── multiplayer.ts     # Multiplayer game logic
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - Free to use!

## 🙏 Acknowledgments

- NBA team data and logos
- Lucide React for icons
- Firebase for real-time multiplayer capabilities

---

**Built with ❤️ for NBA fans by backbenni88-ai**
