# NBA Draft Randomizer 🏀

A fun and interactive NBA draft game where players compete to build the best roster with random team and era constraints!

## 🎮 How to Play

1. **Start the Game**: Two players compete locally
2. **Spin the Wheel**: Each turn, spin to get a random NBA team and era
3. **Draft Players**: Name a player from that team/era combination for the current position
4. **Build Your Roster**: Complete all 6 positions (PG, SG, SF, PF, C, 6th Man)
5. **Compare**: See who drafted the better squad!

## ✨ Features

- **30 NBA Teams**: All current NBA franchises
- **8 Different Eras**: From 1960s Dynasty Era to 2020s Modern Era
- **Auto-Save**: Your game progress is saved automatically
- **Responsive Design**: Works great on desktop and mobile
- **Beautiful UI**: Modern, animated interface with smooth transitions
- **TypeScript**: Fully typed for better development experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📦 Deployment to Vercel

This app is optimized for Vercel deployment:

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy!

### Option 3: Deploy Button

Click the button below to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_URL)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + localStorage
- **Deployment**: Vercel

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & animations
├── components/
│   ├── ui/
│   │   ├── Button.tsx      # Reusable button component
│   │   └── Card.tsx        # Reusable card component
│   └── game/
│       ├── Game.tsx        # Main game logic
│       ├── StartScreen.tsx # Initial screen
│       ├── EndScreen.tsx   # Results screen
│       ├── SpinnerCard.tsx # Randomizer interface
│       └── RosterDisplay.tsx # Player roster view
├── constants/
│   └── gameData.ts         # Teams, eras, positions data
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🎨 Customization

### Adding More Teams

Edit `src/constants/gameData.ts`:

```typescript
export const TEAMS: Team[] = [
  { name: "Your Team", color: "text-blue-500" },
  // ... more teams
];
```

### Adding More Eras

```typescript
export const ERAS: string[] = [
  "Your Era Name",
  // ... more eras
];
```

### Changing Positions

```typescript
export const POSITIONS: string[] = ["PG", "SG", "SF", "PF", "C", "6th Man"];
```

## 🐛 Known Issues

- Game state is stored in localStorage (clears if browser data is cleared)
- No player validation (players can name any player)
- Desktop view recommended for best experience

## 🚧 Future Improvements

- [ ] Add player validation against real NBA rosters
- [ ] Multiplayer via WebSockets
- [ ] AI opponent mode
- [ ] Sound effects and music
- [ ] Draft history/statistics
- [ ] Share results on social media
- [ ] Dark mode support

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

Built with ❤️ for NBA fans

---

**Enjoy the game and may the best drafter win!** 🏆
