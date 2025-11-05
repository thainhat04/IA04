import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3000;

// Secrets for JWT (In production, use environment variables)
const ACCESS_TOKEN_SECRET = 'your-access-token-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret-key-change-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Middleware
// CORS Configuration - Allow specific origins
const allowedOrigins = [
  'http://localhost:5173',           // Local development
  'http://localhost:3000',           // Local backend
  'https://jwt-auth-backend-production.up.railway.app', // Your Railway backend
  'https://ia-04-ecru.vercel.app',
  // Add your Netlify/Vercel frontend URL here when deployed
  // 'https://your-frontend.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory user database (for demo purposes)
const users = [
  {
    id: 1,
    email: 'demo@example.com',
    password: bcrypt.hashSync('password123', 10),
    name: 'Demo User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    name: 'Test User',
    role: 'user',
  },
];

// In-memory refresh token storage (In production, use Redis or database)
const refreshTokens = new Set();

/**
 * Generate Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Middleware to verify access token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    req.user = user;
    next();
  });
};

/**
 * Root endpoint - helps verify server is running
 */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Express API Server is running',
    endpoints: {
      health: '/api/health',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout',
      me: 'GET /api/auth/me',
      dashboard: {
        stats: 'GET /api/dashboard/stats',
        activity: 'GET /api/dashboard/activity',
      },
    },
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

/**
 * Login endpoint - handle OPTIONS for CORS preflight
 */
app.options('/api/auth/login', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

/**
 * Login endpoint - POST handler
 */
app.post('/api/auth/login', async (req, res) => {
  console.log('Login endpoint hit - Method:', req.method, 'Path:', req.path);
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token
  refreshTokens.add(refreshToken);

  // Return user data and tokens
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * Refresh token endpoint
 */
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  // Check if refresh token exists in storage
  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  // Verify refresh token
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      refreshTokens.delete(refreshToken);
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // Find user
    const foundUser = users.find((u) => u.id === user.id);
    if (!foundUser) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(foundUser);

    // Optionally generate new refresh token (rotate refresh tokens)
    const newRefreshToken = generateRefreshToken(foundUser);
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  });
});

/**
 * Logout endpoint
 */
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  res.json({ message: 'Logged out successfully' });
});

/**
 * Get current user endpoint (protected)
 */
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

/**
 * Dashboard stats endpoint (protected)
 */
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  res.json({
    totalUsers: 1250,
    activeUsers: 856,
    projects: 42,
    completed: 38,
  });
});

/**
 * Dashboard activity endpoint (protected)
 */
app.get('/api/dashboard/activity', authenticateToken, (req, res) => {
  res.json([
    {
      icon: '✅',
      title: 'Completed project deployment',
      time: '2 hours ago',
    },
    {
      icon: '📝',
      title: 'Updated user documentation',
      time: '5 hours ago',
    },
    {
      icon: '🎉',
      title: 'New feature released',
      time: '1 day ago',
    },
    {
      icon: '🔧',
      title: 'Fixed critical bug',
      time: '2 days ago',
    },
    {
      icon: '📊',
      title: 'Generated monthly report',
      time: '3 days ago',
    },
  ]);
});

/**
 * Register endpoint (optional)
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password: await bcrypt.hash(password, 10),
    name,
    role: 'user',
  };

  users.push(newUser);

  // Generate tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  // Store refresh token
  refreshTokens.add(refreshToken);

  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`\n🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   POST   /api/auth/logout`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/dashboard/stats`);
  console.log(`   GET    /api/dashboard/activity`);
  console.log(`\n👤 Demo credentials:`);
  console.log(`   Email: demo@example.com`);
  console.log(`   Password: password123\n`);
});

export default app;
