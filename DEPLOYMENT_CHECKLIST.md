# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## ✅ Pre-Deployment Checklist

### Code Ready
- [ ] All code committed to Git
- [ ] Code pushed to GitHub repository
- [ ] Backend is in `backend/` folder
- [ ] Frontend is in root folder
- [ ] `npm run build` works without errors
- [ ] Backend starts with `npm run backend`

### Configuration Files
- [ ] `backend/package.json` has all dependencies
- [ ] `.env.example` exists with all variables
- [ ] `.gitignore` excludes `.env` and `node_modules`
- [ ] `netlify.toml` exists (for Netlify)
- [ ] `vercel.json` exists (if using Vercel)

### Testing
- [ ] Login works locally
- [ ] Logout works locally
- [ ] Token refresh works locally
- [ ] Protected routes work locally
- [ ] Dashboard loads data locally

---

## 🚀 Backend Deployment (Railway)

### Setup
- [ ] Created Railway account
- [ ] Connected GitHub account to Railway
- [ ] Created new project from GitHub repo

### Configuration
- [ ] Set root directory to `backend`
- [ ] Added `ACCESS_TOKEN_SECRET` environment variable
- [ ] Added `REFRESH_TOKEN_SECRET` environment variable
- [ ] Added `NODE_ENV=production` environment variable
- [ ] Generated custom domain
- [ ] **Saved backend URL**: `____________________________`

### Testing
- [ ] Backend deployment successful
- [ ] Backend URL accessible: `https://your-backend.railway.app`
- [ ] Health check works: `https://your-backend.railway.app/api/health`
- [ ] Can access backend logs in Railway dashboard

---

## 🎨 Frontend Deployment (Netlify)

### Setup
- [ ] Created Netlify account
- [ ] Installed Netlify CLI: `npm install -g netlify-cli`
- [ ] Logged in: `netlify login`

### Configuration
- [ ] Updated `.env.production` with backend URL
- [ ] Backend URL in `.env.production`: `VITE_API_URL=https://...`
- [ ] Built app: `npm run build`
- [ ] Verified `dist/` folder created

### Deployment
- [ ] Deployed: `netlify deploy --prod --dir=dist`
- [ ] Got Netlify URL: `____________________________`
- [ ] Site is accessible
- [ ] No console errors on homepage

---

## 🔧 CORS Configuration

### Backend Update
- [ ] Opened `backend/server.js`
- [ ] Updated CORS configuration with Netlify URL:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-netlify-url.netlify.app', // Added this
  ],
  credentials: true
}));
```
- [ ] Committed changes
- [ ] Pushed to GitHub
- [ ] Railway auto-deployed with new CORS

---

## ✅ Post-Deployment Testing

### Basic Functionality
- [ ] Visit frontend URL
- [ ] Homepage loads correctly
- [ ] Click "Get Started" button
- [ ] Login page loads
- [ ] No CORS errors in console

### Authentication Flow
- [ ] Can login with demo credentials:
  - Email: `demo@example.com`
  - Password: `password123`
- [ ] Redirected to dashboard after login
- [ ] User info displays correctly
- [ ] Dashboard stats load (or shows error message if expected)
- [ ] No console errors

### Protected Routes
- [ ] Open new incognito window
- [ ] Try accessing `/dashboard` directly
- [ ] Gets redirected to `/login`
- [ ] After login, redirected back to `/dashboard`

### Token Management
- [ ] After login, refresh the page
- [ ] Should stay logged in (if refresh token is valid)
- [ ] Click logout button
- [ ] Tokens cleared
- [ ] Redirected to login/home

### Cross-Browser Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] Mobile responsive (test on phone or DevTools)

---

## 📝 Documentation Updates

### README Updates
- [ ] Added live demo URL to README
- [ ] Updated deployment section if needed
- [ ] Added screenshots (optional)
- [ ] Verified all links work

### Final Commit
- [ ] All documentation updated
- [ ] Changes committed
- [ ] Pushed to GitHub

---

## 🐛 Troubleshooting

If something doesn't work, check:

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify `VITE_API_URL` in deployed app
- [ ] Check Netlify build logs
- [ ] Rebuild and redeploy if needed

### Backend Issues
- [ ] Check Railway logs for errors
- [ ] Verify environment variables set correctly
- [ ] Test backend directly: `https://your-backend.railway.app/api/health`
- [ ] Check CORS configuration

### CORS Issues
- [ ] Backend CORS includes frontend URL
- [ ] No trailing slashes in URLs
- [ ] Both URLs use HTTPS in production

### Auth Issues
- [ ] Token secrets are set in Railway
- [ ] Secrets match between deployments
- [ ] Check Network tab for failed requests

---

## 📊 Monitoring Setup

### Railway
- [ ] Bookmarked Railway dashboard
- [ ] Enabled email notifications (Settings → Notifications)
- [ ] Checked current usage (free tier limits)

### Netlify
- [ ] Bookmarked Netlify dashboard
- [ ] Enabled deployment notifications
- [ ] Checked bandwidth usage

---

## 🎉 Final Steps

### Share Your Work
- [ ] Added live URLs to README.md
- [ ] Tested all URLs one final time
- [ ] Shared with instructor/team
- [ ] Added to portfolio (optional)

### Optional Enhancements
- [ ] Set up custom domain
- [ ] Add Google Analytics
- [ ] Enable Netlify Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Add deployment badges to README

---

## 📋 Submission Checklist

For assignment submission:

- [ ] Live frontend URL: `____________________________`
- [ ] Live backend URL: `____________________________`
- [ ] GitHub repository URL: `____________________________`
- [ ] README includes deployment URLs
- [ ] All features working in production
- [ ] Demo credentials provided in README
- [ ] Documentation complete

---

## 🆘 Quick Reference

### Frontend URL (Netlify)
```
https://____________________________
```

### Backend URL (Railway)
```
https://____________________________
```

### Demo Credentials
```
Email: demo@example.com
Password: password123
```

### Important Commands
```bash
# Rebuild frontend
npm run build

# Redeploy frontend
netlify deploy --prod --dir=dist

# View Railway logs
railway logs

# View Netlify logs
netlify logs
```

---

## ✅ Deployment Status

**Backend**: [ ] Deployed [ ] Tested [ ] Working
**Frontend**: [ ] Deployed [ ] Tested [ ] Working
**Authentication**: [ ] Tested [ ] Working
**Protected Routes**: [ ] Tested [ ] Working
**Documentation**: [ ] Updated [ ] Complete

**Overall Status**: [ ] Ready for Submission

---

**Date Deployed**: ___________
**Deployed By**: ___________
**Notes**:
```
_____________________________________________
_____________________________________________
_____________________________________________
```

---

🎉 **Congratulations! Your app is deployed and live!** 🎉
