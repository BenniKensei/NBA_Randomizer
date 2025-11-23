# 🏀 NBA Draft Randomizer - Online Multiplayer

## Quick Start

Online multiplayer functionality has been added! Here's what you need to do:

### ⚠️ Important: Firebase Setup Required

Before online multiplayer will work, you need to:

1. **Create a free Firebase account** at https://console.firebase.google.com/
2. **Set up a Realtime Database** (takes 2-3 minutes)
3. **Update the Firebase configuration** in `src/lib/firebase.ts`

**📖 Full instructions:** See `MULTIPLAYER_SETUP.md` for detailed step-by-step guide.

### Quick Firebase Setup (2-3 minutes)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Add "Realtime Database" → Start in test mode
4. Go to Project Settings → Your apps → Add web app
5. Copy the config and paste it into `src/lib/firebase.ts`

### How to Play Online

Once Firebase is configured:

1. **Player 1:**
   - Click "Online Multiplayer"
   - Click "Create Online Game"
   - Share the link or 6-digit code with your friend

2. **Player 2:**
   - Open the shared link OR
   - Click "Online Multiplayer" → Enter the 6-digit code

3. **Play!**
   - Game starts automatically when both players join
   - All actions sync in real-time
   - Works on any device!

### Features

✅ Real-time synchronization  
✅ Unique shareable game links  
✅ 6-digit join codes  
✅ Works on phones, tablets, computers  
✅ Same gameplay as local mode  
✅ Automatic game cleanup  

### Testing Locally

You can test locally:
```bash
npm run dev
```

Open two browser windows (or use your phone + computer) to test multiplayer!

### Deployment

```bash
# Push to GitHub
git add .
git commit -m "Add online multiplayer"
git push origin main
```

Your Vercel deployment will automatically update!

---

**Need help?** Check `MULTIPLAYER_SETUP.md` for troubleshooting and detailed instructions.
