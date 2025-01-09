// Import dependencies
require('dotenv').config(); // Load .env variables at the top
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./config/passportConfig');
const pool = require('./config/db'); // Import configured database pool
const userRoutes = require('./routes/usersRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.SERVER_PORT || 3001; // Use .env for port if defined

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Security feature to help prevent attacks
    secure: false,  // Set this to true if using HTTPS
    maxAge: 3600000, // Cookie expiration time (1 hour)
  }
}));

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Root route to handle requests to "/"
app.get('/', (req, res) => {
  res.send('Welcome to the Taskify API! Available routes: /api/users, /api/tasks');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Catch-all route for undefined paths
app.use((req, res, next) => {
  res.status(404).send('API route not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
