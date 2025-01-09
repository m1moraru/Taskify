// Import dependencies
require('dotenv').config(); // Load .env variables at the top
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const path = require('path'); // For serving static files
const passportConfig = require('./config/passportConfig');
const pool = require('./config/db'); // Import configured database pool
const userRoutes = require('./routes/usersRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.SERVER_PORT || 3001; // Use .env for port if defined

// Middleware
app.use(
  cors({
    origin: 'https://taskify-nuog.onrender.com', // Frontend URL on Render
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow cookies and other credentials
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
    ],
  })
);

// Initialize Passport
passportConfig(app);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Security feature to help prevent attacks
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 3600000, // Cookie expiration time (1 hour)
    },
  })
);

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React (serves React app for all non-API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on https://taskify-nuog.onrender.com`);
});

module.exports = app;

