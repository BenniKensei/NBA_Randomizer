# Quick Deployment Script for Windows PowerShell

Write-Host "🚀 NBA Draft Randomizer - Quick Deploy to Vercel" -ForegroundColor Cyan
Write-Host ""

# Check if vercel is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "🔐 Logging in to Vercel..." -ForegroundColor Yellow
vercel login

Write-Host "📤 Deploying to production..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app is now live!" -ForegroundColor Green
