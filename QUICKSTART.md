# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Backend Server

Open a terminal and run:

```bash
npm run backend
```

You should see:
```
🚀 Mock Backend Server running on http://localhost:3000

📋 Available endpoints:
   POST   /api/auth/login
   POST   /api/auth/register
   POST   /api/auth/refresh
   POST   /api/auth/logout
   GET    /api/auth/me
   GET    /api/dashboard/stats
   GET    /api/dashboard/activity

👤 Demo credentials:
   Email: demo@example.com
   Password: password123
```

### Step 3: Start Frontend App

Open a **NEW terminal** and run:

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 4: Open Browser

Navigate to: **http://localhost:5173**

---

## 🎯 Test the Application

### 1. Test Login Flow

1. Click "Get Started" or "Login"
2. Enter credentials:
   - Email: `demo@example.com`
   - Password: `password123`
3. Click "Login"
4. You should be redirected to the dashboard

### 2. Test Protected Routes

1. Once logged in, you're on `/dashboard`
2. Open DevTools → Application → Local Storage
3. You should see `refreshToken` stored
4. Refresh the page - you should stay logged in
5. Open DevTools → Console - no errors should appear

### 3. Test Token Refresh

The access token expires in 15 minutes. To test token refresh:

1. Login to the dashboard
2. Wait 15 minutes (or modify `ACCESS_TOKEN_EXPIRY` in `backend/server.js` to `'10s'`)
3. Navigate or perform an action
4. Token should automatically refresh
5. Check Network tab - you'll see `/api/auth/refresh` called

### 4. Test Logout

1. Click "Logout" button in header
2. Should redirect to login page
3. Check Local Storage - `refreshToken` should be cleared
4. Try accessing `/dashboard` directly - should redirect to login

### 5. Test Form Validation

1. Go to login page
2. Try submitting empty form - see validation errors
3. Enter invalid email - see email validation
4. Enter password less than 6 characters - see password validation

---

## 🔍 Development Tools

### React Query Devtools

- Automatically available in development mode
- Click the React Query icon in bottom-left corner
- Inspect queries, mutations, and cache

### Browser DevTools

**Network Tab:**
- See all API requests
- Check Authorization headers
- Monitor token refresh calls

**Application Tab:**
- Local Storage → `refreshToken`
- Console → No errors should appear

---

## 📝 Customize the App

### Change API URL

Edit `.env`:
```env
VITE_API_URL=https://your-backend-api.com/api
```

### Modify Token Expiration

Edit `backend/server.js`:
```javascript
const ACCESS_TOKEN_EXPIRY = '15m';  // Change to '1h', '30m', etc.
const REFRESH_TOKEN_EXPIRY = '7d';  // Change to '30d', '90d', etc.
```

### Add New Protected Routes

In `src/App.jsx`:
```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />  // Add new route
</Route>
```

### Add New API Endpoints

1. Add endpoint in `src/api/endpoints.js`
2. Add service method in `src/services/`
3. Create React Query hook in `src/hooks/`
4. Use in component

---

## 🐛 Troubleshooting

### Backend not starting?

```bash
cd backend
npm install express cors jsonwebtoken bcryptjs
cd ..
npm run backend
```

### Frontend not starting?

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use?

**Backend (3000):**
```bash
# Find process
lsof -ti:3000
# Kill process
kill -9 <PID>
```

**Frontend (5173):**
```bash
# Find process
lsof -ti:5173
# Kill process
kill -9 <PID>
```

### CORS errors?

- Make sure backend is running on port 3000
- Check `VITE_API_URL` in `.env`
- Restart both servers

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🚀 Deploy

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## ✅ Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can login with demo credentials
- [ ] Dashboard loads correctly
- [ ] Can logout successfully
- [ ] Page refresh keeps user logged in
- [ ] Form validation working
- [ ] No console errors

---

## 🎉 You're Ready!

Your JWT authentication system is now fully functional. Explore the code and customize it for your needs!

For more details, see the main [README.md](README.md)
