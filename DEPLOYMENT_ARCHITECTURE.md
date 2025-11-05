# Deployment Architecture

## 🏗️ Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                     │
└─────────────────────────────────────────────────────────────┘

                         Internet
                            │
                            │
            ┌───────────────┴───────────────┐
            │                               │
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │   FRONTEND    │              │    BACKEND    │
    │   (Netlify)   │◄────────────►│   (Railway)   │
    │               │     HTTPS    │               │
    │  React App    │     CORS     │  Express API  │
    │  Static Files │              │  JWT Auth     │
    └───────────────┘              └───────────────┘
         │                              │
         │                              │
         │ Serves HTML/JS/CSS           │ JWT Tokens
         │                              │ User Data
         │                              │
         ▼                              ▼
    User's Browser              In-Memory Storage
         │                              │
         │                              │
         └──────── API Requests ────────┘
              (with JWT tokens)
```

---

## 📦 Deployment Options Comparison

### Option 1: Separate Deployments ⭐ RECOMMENDED

```
┌──────────────┐         ┌──────────────┐
│   Railway    │         │   Netlify    │
│  (Backend)   │◄───────►│  (Frontend)  │
│   Node.js    │  HTTPS  │    React     │
└──────────────┘         └──────────────┘
```

**Pros:**
- ✅ Easy to set up
- ✅ Both have free tiers
- ✅ Automatic HTTPS
- ✅ No code changes needed
- ✅ Fast deploys
- ✅ Good for learning

**Cons:**
- ❌ Two separate deployments to manage
- ❌ Need to configure CORS

**Best For**: Beginners, portfolio projects, demos

---

### Option 2: Vercel Full-Stack

```
┌──────────────────────────┐
│        Vercel            │
│  ┌────────┐  ┌────────┐  │
│  │Frontend│  │Backend │  │
│  │ React  │  │  API   │  │
│  └────────┘  └────────┘  │
└──────────────────────────┘
```

**Pros:**
- ✅ Single deployment
- ✅ Serverless backend
- ✅ No CORS issues
- ✅ Fast global CDN

**Cons:**
- ❌ Backend needs restructuring
- ❌ Serverless limitations
- ❌ More complex setup

**Best For**: Advanced users, monorepo projects

---

### Option 3: Render Full-Stack

```
┌──────────────────────────┐
│         Render           │
│  ┌────────────────────┐  │
│  │   Static Site      │  │
│  │   (Frontend)       │  │
│  └────────────────────┘  │
│           +              │
│  ┌────────────────────┐  │
│  │   Web Service      │  │
│  │   (Backend)        │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Pros:**
- ✅ Traditional server (not serverless)
- ✅ Can deploy both on one platform
- ✅ Free tier available

**Cons:**
- ❌ Cold starts on free tier
- ❌ Slower than other options
- ❌ Still need CORS configuration

**Best For**: Apps needing traditional server, WebSocket apps

---

## 🔄 Request Flow in Production

### 1. Initial Page Load

```
User → Netlify CDN → React App → User's Browser
```

### 2. User Login

```
User → React Form → Netlify (static) → Railway API
                                           │
                                           ├─ Validate credentials
                                           ├─ Generate JWT tokens
                                           └─ Return tokens + user data
```

### 3. Protected API Calls

```
User → React App → Axios → Railway API
              │               │
              │               ├─ Check access token
              │               ├─ Return protected data
              │               └─ or 401 if expired
              │
              └─ If 401: Refresh token → Retry
```

### 4. Token Refresh Flow

```
Access Token Expired → Axios Interceptor
                         │
                         ├─ Send refresh token
                         ├─ Get new access token
                         ├─ Update memory storage
                         └─ Retry original request
```

---

## 🌐 Domain Setup (Optional)

### Add Custom Domain to Netlify

```
your-domain.com
       │
       ▼
Netlify DNS (automatic SSL)
       │
       ▼
Your React App
```

Steps:
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Netlify: Settings → Domain management → Add custom domain
3. Update DNS records at your registrar
4. Netlify automatically provisions SSL certificate

### Add Custom Domain to Railway

```
api.your-domain.com
       │
       ▼
Railway (automatic SSL)
       │
       ▼
Your Backend API
```

Steps:
1. In Railway: Settings → Domains → Add custom domain
2. Add CNAME record in your DNS:
   ```
   api.your-domain.com → your-app.railway.app
   ```

---

## 🔒 Security Architecture

### Token Storage Strategy

```
┌──────────────────────────────────────┐
│         User's Browser               │
│  ┌────────────────────────────────┐  │
│  │  Memory (Access Token)         │  │
│  │  • Cleared on page refresh     │  │
│  │  • 15 minutes expiry           │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  LocalStorage (Refresh Token)  │  │
│  │  • Persists across refreshes   │  │
│  │  • 7 days expiry               │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Why This Approach?

1. **Access Token in Memory**:
   - More secure (can't be stolen via XSS if code is compromised)
   - Short-lived (15 minutes)
   - Cleared on page refresh

2. **Refresh Token in LocalStorage**:
   - Allows "remember me" functionality
   - Longer-lived (7 days)
   - Can be invalidated on server

3. **Alternative** (More Secure):
   - Store refresh token in httpOnly cookie
   - Requires backend modifications
   - See `DEPLOYMENT_GUIDE.md` for implementation

---

## 📊 Performance Optimization

### Frontend (Netlify)

```
User Request → Netlify Edge CDN
                    │
                    ├─ Cache static assets
                    ├─ Gzip compression
                    ├─ HTTP/2
                    └─ Automatic SSL
```

**Optimizations:**
- ✅ Static asset caching (1 year)
- ✅ Gzip/Brotli compression
- ✅ Global CDN (fast worldwide)
- ✅ Automatic image optimization

### Backend (Railway)

```
API Request → Railway Servers
                   │
                   ├─ Keep-alive connections
                   ├─ JWT validation (fast)
                   └─ In-memory token storage
```

**Optimizations:**
- ✅ Always-on instances (no cold starts on paid tier)
- ✅ Fast JWT verification
- ✅ Efficient middleware stack
- ✅ Connection pooling

---

## 🔧 Environment Variables Flow

### Development

```
.env (local)
  ↓
VITE_API_URL=http://localhost:3000/api
  ↓
Vite Dev Server
  ↓
React App (localhost:5173)
```

### Production

```
.env.production (local)
  ↓
VITE_API_URL=https://your-backend.railway.app/api
  ↓
Netlify Build Process
  ↓
Static Files with env vars baked in
  ↓
Deployed to Netlify CDN
```

**Important**:
- Vite env vars are embedded at build time
- They are NOT secret (visible in browser)
- Never put secrets in VITE_ variables

---

## 🚀 CI/CD Flow

### Automatic Deployments

```
┌─────────────────────────────────────────────┐
│  GitHub Repository                          │
│  ├── main branch                            │
│  └── feature branches                       │
└────────────┬────────────────────────────────┘
             │
             ├─── Push to main
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
Railway           Netlify
    │                 │
    ├─ npm install    ├─ npm install
    ├─ node server.js ├─ npm run build
    └─ Deploy         └─ Deploy to CDN
```

**Setup**:
1. Connect GitHub repo to Railway
2. Connect GitHub repo to Netlify
3. Push to main → Auto-deploy both!

---

## 📈 Scaling Path

### Current Setup (Free Tier)
```
Users (< 1000/day) → Netlify + Railway → Works great!
```

### Growing App
```
Users (1000-10000/day) → Paid tiers → More resources
```

### Large Scale
```
Users (10000+/day) →
  ├── Frontend: Vercel/Cloudflare (multi-region)
  ├── Backend: Kubernetes/AWS (auto-scaling)
  ├── Database: PostgreSQL (replicated)
  └── Cache: Redis (distributed)
```

---

## 💡 Tips for Production

1. **Monitor Your Apps**:
   - Railway dashboard shows logs and metrics
   - Netlify shows bandwidth and build times

2. **Set Up Alerts**:
   - Railway can email you on errors
   - Netlify notifies on failed deploys

3. **Use Environment Variables**:
   - Never hardcode secrets
   - Different secrets for dev/prod

4. **Enable Analytics**:
   - Netlify Analytics (free tier available)
   - Add Google Analytics to frontend

5. **Backup Strategy**:
   - Code is in GitHub (backed up)
   - For real DB: regular backups

---

## 🎯 Summary

**For This Assignment - Recommended:**

```
Backend  → Railway (Free, Easy, Fast)
Frontend → Netlify (Free, Easy, Fast)
CORS     → Configure backend to allow frontend domain
Secrets  → Environment variables in hosting dashboards
```

**Time to Deploy**: ~5 minutes
**Cost**: $0
**Difficulty**: Easy
**Production-Ready**: Yes (for demos and portfolios)

---

**See `QUICK_DEPLOY.md` for step-by-step deployment instructions!**
