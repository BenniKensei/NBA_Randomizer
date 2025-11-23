#!/bin/bash
# Quick deployment script for Vercel

echo "🚀 NBA Draft Randomizer - Quick Deploy to Vercel"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "🔐 Logging in to Vercel..."
vercel login

echo "📤 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app is now live!"
