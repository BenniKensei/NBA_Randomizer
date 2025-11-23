# Online Multiplayer Setup Guide

This NBA Draft Randomizer now supports online multiplayer! Follow these steps to set up Firebase for real-time multiplayer functionality.

## Firebase Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "NBA Randomizer")
4. Follow the setup wizard (you can disable Google Analytics if not needed)

### 2. Set Up Realtime Database

1. In your Firebase project, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (select the closest to your users)
4. Start in **test mode** for development (you can set up security rules later)
5. Click "Enable"

### 3. Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "NBA Randomizer Web")
6. Copy the `firebaseConfig` object

### 4. Update Your Project

Open `src/lib/firebase.ts` and replace the configuration with your actual Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Set Up Security Rules (Important for Production!)

In the Realtime Database, click on the "Rules" tab and update with these security rules:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

For production, you should implement more restrictive rules based on authentication.

### 6. Deploy Your App

Deploy your app to Vercel or your preferred hosting platform:

```bash
# Build the production version
npm run build

# Push to GitHub (if using Vercel)
git add .
git commit -m "Add online multiplayer with Firebase"
git push origin main
```

## How Online Multiplayer Works

1. **Create Game**: Player 1 selects "Online Multiplayer" → "Create Online Game"
2. **Share Link**: A unique game link is generated (e.g., `https://your-app.com/?game=ABC123`)
3. **Join Game**: Player 2 opens the link or enters the 6-digit game code
4. **Play Together**: Both players see real-time updates as each makes their picks

## Features

- Real-time synchronization across devices
- Unique 6-digit game codes
- Automatic game cleanup after 24 hours
- Same game mechanics as local multiplayer
- Works on any device with a web browser

## Troubleshooting

### "Could not join game" error
- Check that the game code is correct
- Ensure the game hasn't already started with 2 players
- Verify Firebase is properly configured

### Changes not syncing
- Check your Firebase Realtime Database rules
- Ensure both players have internet connection
- Check browser console for errors

### Firebase quota exceeded
- Firebase free tier includes 1GB storage and 10GB/month bandwidth
- For high traffic, consider upgrading to Firebase Blaze plan
- Implement game cleanup to remove old games

## Environment Variables (Optional)

For better security, you can store Firebase config in environment variables:

Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then update `src/lib/firebase.ts` to use these variables.

## Support

For issues or questions about Firebase setup, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database/web/start)
