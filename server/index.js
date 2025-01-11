require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const passportConfig = require('./config/passportConfig');
const pool = require('./config/db');
const userRoutes = require('./routes/usersRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware for CORS
app.use(cors({
  origin: 'https://taskify-nuog.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  credentials: true, 
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Credentials',
  ],
}));

// Initialize Passport
passportConfig(app);
app.use(passport.initialize());
app.use(passport.session());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session for authentication
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 3600000, // 1 hour
  },
}));

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Serve React static files from the "build" directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve React's index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at https://taskify-nuog.onrender.com`);
});

module.exports = app;


