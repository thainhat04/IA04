# Quick Deploy Guide - 5 Minutes to Live App

This guide will get your app deployed in about 5 minutes using free hosting.

---

## 🎯 What You'll Deploy

- **Backend**: Railway.app (Free tier - 500 hours/month)
- **Frontend**: Netlify (Free tier - Unlimited)

Both are free, don't require credit cards, and are production-ready.

---

## 📋 Prerequisites

- GitHub account
- Your code pushed to a GitHub repository
- Node.js installed locally

---

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend (2 minutes)

#### 1. Push Backend to GitHub

Make sure your backend code is in the `backend/` folder and pushed to GitHub.

#### 2. Deploy to Railway

1. **Go to**: https://railway.app
2. **Click**: "Start a New Project"
3. **Login**: with GitHub
4. **Click**: "Deploy from GitHub repo"
5. **Select**: Your repository
6. **Click**: Settings (after initial deploy)
7. **Set Root Directory**:
   - Go to "Settings" tab
   - Find "Root Directory"
   - Enter: `backend`
   - Save
8. **Add Environment Variables**:
   - Go to "Variables" tab
   - Click "New Variable" for each:
   ```
   ACCESS_TOKEN_SECRET=<click "Generate" button to create random secret>
   REFRESH_TOKEN_SECRET=<click "Generate" button to create random secret>
   NODE_ENV=production
   PORT=3000
   ```
9. **Get Your Backend URL**:
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://jwt-auth-backend-production.up.railway.app`)
   - **SAVE THIS URL** - you'll need it next!

✅ **Backend is now live!**

---

### Part 2: Deploy Frontend (3 minutes)

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Update Frontend Environment

Edit `.env.production` file:

```env
VITE_API_URL=https://YOUR-RAILWAY-URL-HERE.railway.app/api
VITE_APP_NAME=React JWT Auth
```

**Replace** `YOUR-RAILWAY-URL-HERE` with your actual Railway URL from Part 1.

#### 3. Build and Deploy

```bash
# Login to Netlify
netlify login

# Build the app
npm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

When prompted:
- **Create & configure a new site**: Yes
- **Team**: Choose your team
- **Site name**: Enter a unique name (or leave blank for random)

✅ **Frontend is now live!**

You'll get a URL like: `https://your-app-name.netlify.app`

---

### Part 3: Update Backend CORS (1 minute)

Now that you have your frontend URL, update backend CORS:

#### 1. Edit Backend CORS

In `backend/server.js`, find the CORS configuration (around line 18):

```javascript
app.use(cors());
```

Replace it with:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app-name.netlify.app', // Replace with your actual Netlify URL
  ],
  credentials: true
}));
```

#### 2. Commit and Push

```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Railway will automatically redeploy with the new CORS settings.

---

## ✅ Test Your Deployment

1. Visit your Netlify URL: `https://your-app-name.netlify.app`
2. Click "Get Started"
3. Login with:
   - Email: `demo@example.com`
   - Password: `password123`
4. You should see the dashboard!

---

## 🎉 You're Live!

### Update Your README

Add your live URLs to `README.md`:

```markdown
## 🌐 Live Demo

**Frontend**: https://your-app-name.netlify.app
**Backend**: https://your-backend.railway.app

Demo Credentials:
- Email: demo@example.com
- Password: password123
```

---

## 🐛 Troubleshooting

### "Network Error" on Login

**Problem**: Frontend can't reach backend

**Fix**:
1. Check if you updated `VITE_API_URL` in `.env.production`
2. Rebuild: `npm run build`
3. Redeploy: `netlify deploy --prod --dir=dist`

### "CORS Error" in Console

**Problem**: Backend doesn't allow your frontend domain

**Fix**:
1. Update `backend/server.js` with your Netlify URL
2. Push changes to GitHub
3. Railway will auto-redeploy

### Backend Sleeping

**Problem**: First request is slow

**Fix**: This is normal on free tier - backends "sleep" after inactivity. First request wakes it up (takes ~10-30 seconds).

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Railway (Backend) | Free | $0 | 500 hours/month (~21 days) |
| Netlify (Frontend) | Free | $0 | 100GB bandwidth/month |
| **Total** | | **$0/month** | More than enough for demo/portfolio |

---

## 🔄 Updating Your App

### Update Frontend
```bash
# Make changes to your code
npm run build
netlify deploy --prod --dir=dist
```

### Update Backend
```bash
# Make changes to backend code
git add .
git commit -m "Your changes"
git push
# Railway auto-deploys!
```

---

## 📱 Alternative: Deploy Using Web Interface Only

### Backend (Railway)
1. Go to railway.app
2. "New Project" → "Deploy from GitHub"
3. Select repo
4. Add environment variables
5. Done!

### Frontend (Netlify)
1. Go to netlify.com
2. "Add new site" → "Import an existing project"
3. Connect GitHub
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variable: `VITE_API_URL`
7. Done!

---

## 🎓 Next Steps

1. ✅ Test your deployed app
2. ✅ Share your live URL
3. ✅ Add custom domain (optional)
4. ✅ Set up continuous deployment
5. ✅ Monitor with Railway/Netlify dashboards

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **Full Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for more options

---

**That's it! Your app is live and accessible to anyone on the internet.** 🎉
