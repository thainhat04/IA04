# Complete Deployment Guide

This guide covers deploying both the **backend API** and **frontend React app** to production.

---

## 🎯 Deployment Strategy Overview

You have **3 main options**:

### Option 1: Separate Deployments (Recommended)
- **Backend**: Deploy to Railway/Render/Heroku
- **Frontend**: Deploy to Netlify/Vercel
- **Pros**: Easy, free tiers available, good performance
- **Cons**: Need to manage two deployments

### Option 2: Full-Stack on Vercel
- Deploy both backend and frontend on Vercel
- Backend becomes serverless functions
- **Pros**: Single deployment, easy setup
- **Cons**: Requires code restructuring

### Option 3: Full-Stack on Render
- Deploy both on Render Web Service
- **Pros**: Single deployment, traditional server
- **Cons**: Free tier has cold starts

---

## 📦 Option 1: Separate Deployments (EASIEST & RECOMMENDED)

This is the most straightforward approach and what most production apps use.

### Step 1: Deploy Backend to Railway (Free)

**Railway** is free, easy to use, and perfect for Node.js backends.

#### 1.1 Prepare Backend for Deployment

Create `backend/package.json` if not exists:

```json
{
  "name": "jwt-auth-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.3",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  }
}
```

#### 1.2 Deploy to Railway

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click** "New Project" → "Deploy from GitHub repo"
4. **Select** your repository
5. **Settings** → Set these:
   - **Root Directory**: `backend`
   - **Start Command**: `node server.js`
6. **Add Environment Variables**:
   ```
   PORT=3000
   ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this
   NODE_ENV=production
   ```
7. **Deploy** - Railway will give you a URL like `https://your-app.railway.app`

#### 1.3 Update Backend CORS

In `backend/server.js`, update CORS to allow your frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-app.netlify.app', // Add your frontend URL
  ],
  credentials: true
}));
```

---

### Step 2: Deploy Frontend to Netlify (Free)

#### 2.1 Update Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_APP_NAME=React JWT Auth
VITE_APP_VERSION=1.0.0
```

#### 2.2 Deploy to Netlify

**Method A: Using Netlify CLI (Recommended)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the app
npm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

When prompted:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

**Method B: Using Netlify Website**

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure:
   - **Base directory**: Leave empty (or just `/`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Environment variables** (Site settings → Environment variables):
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_APP_NAME=React JWT Auth
   ```
7. **Deploy**

#### 2.3 Update Backend CORS with Real Frontend URL

After getting your Netlify URL, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-actual-frontend.netlify.app', // Replace with real URL
  ],
  credentials: true
}));
```

Redeploy backend after this change.

---

## 📦 Option 2: Full-Stack on Vercel

Vercel can host both frontend and backend (as serverless functions).

### Step 1: Restructure Backend for Vercel

Create `api/server.js` (move from `backend/server.js`):

```javascript
// api/server.js
import express from 'express';
import cors from 'cors';
// ... rest of your backend code

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ... all your routes

// Export for Vercel
export default app;
```

### Step 2: Create `vercel.json`

Update `vercel.json` at root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

**Environment Variables on Vercel:**
```
VITE_API_URL=/api
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-secret
```

---

## 📦 Option 3: Full-Stack on Render

Render can host both frontend and backend together or separately.

### Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `jwt-auth-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Add Environment Variables (same as Railway)
7. Deploy

### Deploy Frontend to Render

1. Click "New" → "Static Site"
2. Connect your repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy

---

## 🆓 Best Free Hosting Options

### Backend Options:
| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Railway** | 500 hours/month | Easy, fast, recommended |
| **Render** | 750 hours/month | Good, but cold starts |
| **Fly.io** | 3 VMs free | Fast, global |
| **Cyclic.sh** | Unlimited | Good for Node.js |

### Frontend Options:
| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Netlify** | 100GB bandwidth/month | Best for React |
| **Vercel** | Unlimited | Fast, easy |
| **Cloudflare Pages** | Unlimited | Very fast |
| **GitHub Pages** | Unlimited | Simple, reliable |

---

## 🚀 Quick Deploy Scripts

### Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Get URL
railway domain
```

### Deploy Frontend to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## 🔒 Environment Variables Checklist

### Backend Environment Variables:
```env
PORT=3000
ACCESS_TOKEN_SECRET=<generate-random-string>
REFRESH_TOKEN_SECRET=<generate-random-string>
NODE_ENV=production
```

**Generate secrets:**
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend Environment Variables:
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=React JWT Auth
VITE_APP_VERSION=1.0.0
```

---

## ✅ Post-Deployment Checklist

After deploying both:

1. **Update Backend CORS**
   - Add your frontend URL to CORS allowed origins
   - Redeploy backend

2. **Test Authentication Flow**
   - Visit your frontend URL
   - Try to login with demo credentials
   - Check browser console for errors
   - Verify dashboard loads

3. **Test Token Refresh**
   - Login and wait (or modify token expiry)
   - Make API calls
   - Verify automatic refresh works

4. **Update README**
   - Add your live demo URL to README.md
   - Update deployment instructions if needed

---

## 🐛 Troubleshooting

### CORS Errors
**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: Update backend CORS to include your frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-frontend.netlify.app'],
  credentials: true
}));
```

### Environment Variables Not Working
**Problem**: API calls failing, undefined environment variables

**Solution**:
- Verify env vars in hosting dashboard
- For Vite, vars must start with `VITE_`
- Rebuild and redeploy after adding env vars

### Backend Not Responding
**Problem**: Network errors when calling API

**Solution**:
- Check backend logs on hosting platform
- Verify backend URL is correct in frontend
- Check if backend is sleeping (free tiers sleep after inactivity)

### Token Refresh Not Working
**Problem**: Getting logged out unexpectedly

**Solution**:
- Check if token secrets match between deployments
- Verify refresh endpoint is working
- Check browser console for errors

---

## 📝 Example: Complete Railway + Netlify Deployment

Here's a complete example deploying to Railway (backend) and Netlify (frontend):

### 1. Deploy Backend to Railway

```bash
# In your project root
cd backend

# Create Railway project
railway login
railway init
railway add

# Add environment variables
railway variables set ACCESS_TOKEN_SECRET=your-secret-here
railway variables set REFRESH_TOKEN_SECRET=your-secret-here
railway variables set NODE_ENV=production

# Deploy
railway up

# Get your backend URL
railway domain
# Example: https://jwt-auth-backend-production.up.railway.app
```

### 2. Update Frontend Environment

```bash
# Back to root
cd ..

# Create .env.production
echo "VITE_API_URL=https://jwt-auth-backend-production.up.railway.app/api" > .env.production
```

### 3. Deploy Frontend to Netlify

```bash
# Build with production env
npm run build

# Deploy to Netlify
netlify login
netlify init
netlify deploy --prod --dir=dist
```

### 4. Update Backend CORS

Edit `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app-name.netlify.app', // Your actual Netlify URL
  ],
  credentials: true
}));
```

Then redeploy backend:
```bash
cd backend
railway up
```

### 5. Test

Visit your Netlify URL and test the complete flow!

---

## 🎉 Success!

Your app is now live! Update your README with the live URLs:

```markdown
## 🌐 Live Demo

**Frontend**: https://your-app.netlify.app
**Backend API**: https://your-backend.railway.app

Demo Credentials:
- Email: demo@example.com
- Password: password123
```

---

## 💡 Tips for Production

1. **Use HTTPS**: Both hosting platforms provide free SSL
2. **Monitor**: Check logs regularly on hosting dashboards
3. **Secrets**: Use strong, random secrets in production
4. **Database**: For real apps, use PostgreSQL/MongoDB instead of in-memory storage
5. **Redis**: Use Redis for refresh token storage in production
6. **Rate Limiting**: Add rate limiting to prevent abuse
7. **Error Tracking**: Use Sentry or similar for error tracking

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Choose your preferred option and follow the steps above. Option 1 (Railway + Netlify) is recommended for beginners!**
