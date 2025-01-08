const SECRET_KEY = process.env.SECRET_KEY;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
}

module.exports = ensureAuthenticated;