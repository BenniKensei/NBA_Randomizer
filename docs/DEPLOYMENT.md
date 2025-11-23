# 🚀 Deployment Guide for Vercel

## Prerequisites

- A GitHub account
- A Vercel account (free at vercel.com)
- Git installed on your computer

## Method 1: Deploy via Vercel Website (Recommended for Beginners)

### Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - NBA Draft Randomizer"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nba-draft-randomizer.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"
6. Wait 2-3 minutes for the build to complete
7. Your app will be live at `https://your-project.vercel.app`!

## Method 2: Deploy via Vercel CLI (For Advanced Users)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# First deployment
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - Project name? nba-draft-randomizer (or your choice)
# - Directory? ./
# - Override settings? No
```

### Step 4: Deploy to Production

```bash
vercel --prod
```

## Method 3: Automatic Deployments

Once connected to GitHub via Vercel:

- Every push to `main` branch → Automatic production deployment
- Every push to other branches → Preview deployment
- Pull requests → Automatic preview deployments

## Environment Variables (If Needed)

If you add environment variables later:

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add variables for Development, Preview, and Production

## Custom Domain (Optional)

1. Go to your project on Vercel
2. Settings → Domains
3. Add your custom domain
4. Update DNS settings as instructed
5. SSL certificate is automatic!

## Build Settings

Vercel automatically detects these settings from your `package.json`:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Troubleshooting

### Build Fails

```bash
# Test the build locally first
npm run build

# If it works locally but fails on Vercel, check:
# 1. Node version (Vercel uses Node 18+)
# 2. All dependencies are in package.json
# 3. No hardcoded localhost URLs
```

### Deployment is Slow

- First deployment takes 2-3 minutes
- Subsequent deployments are faster (30-60 seconds)
- Vercel caches dependencies

### 404 Errors

- Ensure you're using Next.js App Router structure
- Check that `src/app/page.tsx` exists
- Verify routes match your file structure

## Performance Tips

Your app is already optimized with:

- ✅ Next.js 14 with App Router
- ✅ Automatic code splitting
- ✅ Optimized builds
- ✅ Static generation where possible
- ✅ Tailwind CSS purging

## Monitoring

After deployment:

- **Analytics**: Enable Vercel Analytics in project settings
- **Logs**: View real-time logs in Vercel dashboard
- **Performance**: Check Core Web Vitals in Vercel

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Your app should now be live! Share your URL and enjoy! 🎉**
