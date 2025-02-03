const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const db = require('./db');
require('dotenv').config();

module.exports = (app) => {

    app.use(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: true,
          cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, 
          },
        })
      );
    
      // Initialize Passport and session
      app.use(passport.initialize());
      app.use(passport.session());
    
      // Serialize user to store only the user ID in the session
      passport.serializeUser((user, done) => {
        console.log('Serializing user:', user);
        done(null, user.id); // Serialize only the user ID
      });
    
      // Deserialize user to retrieve user details from the database
      passport.deserializeUser(async (id, done) => {
        try {
          const result = await db.query('SELECT id, first_name FROM users WHERE id = $1', [id]);
          if (result.rows.length) {
            done(null, result.rows[0]); // Attach user object to session
          } else {
            done(new Error('User not found'), null);
          }
        } catch (err) {
          done(err, null);
        }
      });
    
    // Local Strategy (used for email/password authentication)
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
          try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            
            if (!user) {
              return done(null, false, { message: 'Incorrect email or password.' });
            }
      
            // Compare hashed password here (use bcrypt or similar)
            const match = await bcrypt.compare(password, user.password);
            
            if (match) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect email or password.' });
            }
          } catch (error) {
            return done(error);
          }
        }
    ));

    return passport;
      
}