# Getting Started - React JWT Authentication

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Backend Server
```bash
# Terminal 1
npm run backend
```
The backend will start on `http://localhost:3000`

### Step 3: Start the Frontend App
```bash
# Terminal 2
npm run dev
```
The frontend will start on `http://localhost:5173`

---

## Test the Application

### Demo Credentials
```
Email: demo@example.com
Password: password123
```

Or use:
```
Email: user@example.com
Password: password123
```

### Testing Flow

1. **Visit the app**: Open `http://localhost:5173`
2. **Login**: Click "Get Started" and enter demo credentials
3. **Dashboard**: View your protected dashboard with user info and stats
4. **Logout**: Click the logout button to clear tokens
5. **Protected Routes**: Try accessing `/dashboard` while logged out

---

## File Structure Overview

```
IA04/
├── backend/              # Mock backend server
│   └── server.js        # Express API with JWT
│
├── src/
│   ├── api/             # Axios configuration
│   ├── components/      # React components
│   ├── contexts/        # Auth context
│   ├── hooks/           # Custom hooks (useLogin, useLogout, etc.)
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── utils/           # Utilities (token manager, error handler)
│
└── README.md            # Full documentation
```

---

## Key Features Demonstrated

### 1. JWT Authentication
- Access token (15 min) stored in memory
- Refresh token (7 days) stored in localStorage
- Automatic token refresh on expiration

### 2. Axios Interceptors
- Auto-attach access token to requests
- Catch 401 errors and refresh token
- Queue requests during token refresh
- Logout on refresh failure

### 3. React Query
- Mutations for login/logout
- Queries for user data and dashboard
- Automatic cache invalidation
- Optimized refetching

### 4. React Hook Form
- Email and password validation
- Real-time error messages
- Accessible form with ARIA labels
- Integration with React Query mutations

### 5. Protected Routes
- Route guards for authenticated pages
- Automatic redirect to login
- Preserve intended destination
- Loading states during auth check

---

## Available Scripts

```bash
# Development
npm run dev          # Start frontend (Vite)
npm run backend      # Start backend API

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Environment Variables

The app uses `.env` for configuration (see `.env.example`):

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=React JWT Auth
VITE_APP_VERSION=1.0.0
```

---

## Troubleshooting

**Issue: "Network Error"**
- Ensure backend is running: `npm run backend`
- Check backend is on port 3000

**Issue: "Cannot find module"**
- Delete `node_modules` and run `npm install`

**Issue: Protected routes not working**
- Check browser console for errors
- Verify tokens in DevTools → Application → Local Storage

---

## Next Steps

1. ✅ Review `README.md` for detailed documentation
2. ✅ Check `REQUIREMENTS_CHECKLIST.md` to see all implemented features
3. ✅ Explore the code starting with `src/App.jsx`
4. ✅ Deploy to Netlify or Vercel (see deployment section in README)

---

## Deployment

### Quick Deploy to Netlify

```bash
# Build the app
npm run build

# Deploy (if Netlify CLI is installed)
netlify deploy --prod --dir=dist
```

Or use the Netlify web interface:
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Environment Variables for Production

Don't forget to set `VITE_API_URL` to your production backend URL!

---

## Questions?

See the full `README.md` for:
- Complete architecture diagrams
- API endpoint documentation
- Security best practices
- Deployment guides
- Learning resources

---

**Happy Coding!** 🚀
