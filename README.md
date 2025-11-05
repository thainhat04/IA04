# React JWT Authentication

A complete, production-ready implementation of JWT-based authentication with access and refresh tokens, built with React, Axios, React Query, and React Hook Form.

## 🚀 Quick Links

- **[Getting Started](GETTING_STARTED.md)** - Run locally in 3 steps
- **[Deploy in 5 Minutes](QUICK_DEPLOY.md)** ⭐ - Fast deployment guide (Railway + Netlify)
- **[Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** - All deployment options
- **[Requirements Checklist](REQUIREMENTS_CHECKLIST.md)** - Verify all requirements met
- **[Documentation Index](DOCS_INDEX.md)** - Find any documentation

## 🌐 Live Demo

**[View Live Application](#)** _(Add your deployment URL here after hosting)_

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `password123`

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Authentication

- ✅ **JWT Access & Refresh Tokens** - Dual token authentication system
- ✅ **Automatic Token Refresh** - Seamless token renewal via Axios interceptors
- ✅ **Secure Token Storage** - Access token in memory, refresh token in localStorage
- ✅ **Protected Routes** - Route-level authentication guards
- ✅ **Logout Functionality** - Complete token cleanup and state reset

### Form Management

- ✅ **React Hook Form** - Performant form validation
- ✅ **Real-time Validation** - Immediate user feedback
- ✅ **Error Handling** - Comprehensive error messages

### State Management

- ✅ **React Query** - Server state management with caching
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Automatic Retries** - Smart retry logic for failed requests

### User Experience

- ✅ **Loading States** - Clear loading indicators
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Toast Notifications** - User-friendly notifications
- ✅ **Responsive Design** - Mobile-first approach

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **React Query (TanStack Query)** | Server state management |
| **React Hook Form** | Form validation and management |
| **Axios** | HTTP client with interceptors |
| **JWT Decode** | JWT token parsing |
| **React Hot Toast** | Toast notifications |

## 🏗️ Architecture

### Token Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Authentication Flow                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User Login                                               │
│     └─> POST /api/auth/login                                │
│         └─> Returns: { accessToken, refreshToken, user }    │
│                                                              │
│  2. Token Storage                                            │
│     ├─> Access Token  → In-Memory (TokenManager)            │
│     └─> Refresh Token → localStorage                        │
│                                                              │
│  3. API Requests                                             │
│     └─> Axios Interceptor attaches access token             │
│         └─> Authorization: Bearer <accessToken>             │
│                                                              │
│  4. Token Expiration (401 Response)                          │
│     └─> Axios Interceptor catches 401                       │
│         └─> POST /api/auth/refresh                          │
│             ├─> Success: New tokens, retry original request │
│             └─> Failure: Logout user, redirect to login     │
│                                                              │
│  5. User Logout                                              │
│     └─> POST /api/auth/logout                               │
│         └─> Clear all tokens and cache                      │
│             └─> Redirect to login page                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
App
├── ErrorBoundary
├── QueryClientProvider (React Query)
├── BrowserRouter (React Router)
└── AuthProvider (Auth Context)
    └── Layout
        ├── Header (with logout)
        └── Routes
            ├── Public Routes
            │   ├── Home
            │   └── Login (PublicRoute wrapper)
            └── Protected Routes (ProtectedRoute wrapper)
                └── Dashboard
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd IA04
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=React JWT Auth
   ```

4. **Start the development servers**

   **Terminal 1 - Backend API:**
   ```bash
   npm run backend
   ```
   The backend server will start on `http://localhost:3000`

   **Terminal 2 - Frontend App:**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

5. **Open your browser**

   Navigate to `http://localhost:5173`

### Demo Credentials

```
Email: demo@example.com
Password: password123
```

Or create a new account using the registration feature.

## 📁 Project Structure

```
IA04/
├── backend/                    # Mock backend API server
│   ├── server.js              # Express server with JWT auth
│   └── package.json
│
├── src/
│   ├── api/                   # API configuration
│   │   ├── axios.js          # Axios instances & interceptors
│   │   └── endpoints.js      # API endpoint definitions
│   │
│   ├── components/
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   └── AuthForm.css
│   │   │
│   │   ├── common/           # Reusable components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   │
│   │   └── layout/           # Layout components
│   │       ├── Header.jsx
│   │       └── Layout.jsx
│   │
│   ├── contexts/             # React contexts
│   │   └── AuthContext.jsx   # Authentication context
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useLogin.js
│   │   ├── useLogout.js
│   │   ├── useUser.js
│   │   ├── useRegister.js
│   │   └── useDashboard.js
│   │
│   ├── pages/                # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/             # API service layer
│   │   ├── auth.service.js
│   │   └── dashboard.service.js
│   │
│   ├── styles/               # Global styles
│   │   └── index.css
│   │
│   ├── utils/                # Utility functions
│   │   ├── token.js          # Token management
│   │   ├── storage.js        # localStorage wrapper
│   │   └── error-handler.js  # Error handling utilities
│   │
│   ├── App.jsx               # Main app component
│   └── main.jsx              # App entry point
│
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel deployment config
├── netlify.toml              # Netlify deployment config
└── README.md
```

## 🔐 Authentication Flow

### 1. Login Process

```javascript
// User submits login form
LoginForm → useLogin hook → authService.login()
  ↓
Server validates credentials
  ↓
Returns: { accessToken, refreshToken, user }
  ↓
TokenManager stores tokens
  ↓
React Query caches user data
  ↓
Redirect to dashboard
```

### 2. Protected Route Access

```javascript
// User navigates to /dashboard
ProtectedRoute checks authentication
  ↓
useUser hook fetches current user
  ↓
Axios attaches access token to request
  ↓
If 401: Axios interceptor refreshes token
  ↓
Retry original request with new token
  ↓
Render protected content
```

### 3. Token Refresh Flow

```javascript
// Access token expires during API call
API request → 401 Unauthorized
  ↓
Axios response interceptor catches 401
  ↓
POST /api/auth/refresh with refresh token
  ↓
Success: Store new access token
  ↓
Retry original request
  ↓
If refresh fails: Logout and redirect
```

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login with credentials | ❌ |
| POST | `/api/auth/register` | Create new account | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/auth/logout` | Logout and invalidate tokens | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Dashboard (Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | ✅ |
| GET | `/api/dashboard/activity` | Get recent activity | ✅ |

## 📦 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables in Vercel dashboard**
   - `VITE_API_URL` - Your backend API URL

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Add environment variables in Netlify dashboard**

### Deploy Backend API

For production, you should deploy the backend separately:

- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **Render**: Deploy from GitHub
- **DigitalOcean App Platform**: Connect repository

**Important:** Update `VITE_API_URL` in your frontend environment variables to point to your deployed backend.

## 🔧 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=React JWT Auth
VITE_APP_VERSION=1.0.0
```

### Backend

For production, set these environment variables:

```env
PORT=3000
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
NODE_ENV=production
```

## 🎯 Best Practices Implemented

### Security

- ✅ Access tokens stored in memory (cleared on page refresh)
- ✅ Refresh tokens in httpOnly cookies (or localStorage as fallback)
- ✅ Automatic token refresh before expiration
- ✅ CSRF protection headers
- ✅ XSS protection
- ✅ Secure password hashing (bcrypt)

### Performance

- ✅ Code splitting with React.lazy
- ✅ React Query caching
- ✅ Optimized bundle size
- ✅ Image optimization
- ✅ Lazy loading

### Code Quality

- ✅ Clean, modular architecture
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Custom hooks for logic reuse
- ✅ Error boundaries
- ✅ TypeScript-ready structure

### User Experience

- ✅ Loading states for all async operations
- ✅ Error messages with user-friendly text
- ✅ Form validation with instant feedback
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Accessibility features (ARIA labels, keyboard navigation)

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start frontend dev server
npm run backend      # Start backend server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint (if configured)
```

## 🧪 Testing

To test the authentication flow:

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Click "Get Started" or "Login"
4. Use demo credentials: `demo@example.com` / `password123`
5. You should be redirected to the dashboard
6. Try refreshing the page (should stay logged in if refresh token is valid)
7. Click "Logout" to clear tokens

## 🐛 Troubleshooting

### Common Issues

**Issue: "Network Error" when logging in**
- Ensure backend server is running on port 3000
- Check VITE_API_URL in .env file

**Issue: "Access token expired" immediately**
- Clear browser localStorage
- Restart both servers

**Issue: Protected routes not working**
- Check if tokens are being stored correctly
- Open browser DevTools → Application → Local Storage

**Issue: CORS errors**
- Backend server has CORS enabled by default
- If deploying, ensure backend allows your frontend domain

## 📚 Learning Resources

- [JWT Introduction](https://jwt.io/introduction)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Axios Documentation](https://axios-http.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as part of an advanced web development course assignment.

## 🙏 Acknowledgments

- React team for the amazing framework
- TanStack for React Query
- All open source contributors

---

**Note:** This is a demo application for educational purposes. For production use, implement additional security measures such as:
- httpOnly cookies for refresh tokens
- Rate limiting
- CSRF tokens
- Security headers
- Input sanitization
- Database for user storage
- Redis for token management
- Proper secret key management
- SSL/TLS certificates
