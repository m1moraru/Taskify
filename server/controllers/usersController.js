const bcrypt = require('bcrypt');
const users = require('../models/users'); // Importing the renamed users model

const usersController = {
  async createUser(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await users.createUser({
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });

      return res.status(201).json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already exists.' });
      }
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { first_name, last_name, email } = req.body;

      if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required.' });
      }

      const updatedUser = await users.updateUser(id, { first_name, last_name, email });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error in updateUser:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const deletedUser = await users.deleteUser(id);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await users.authenticateUser(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to log in.' });
        }
        return res.status(200).json({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        });
      });
    } catch (error) {
      console.error('Error in loginUser:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await users.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        createdAt: new Date(user.created_at).toISOString(),
      });
    } catch (error) {
      console.error('Error in getUser:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  async getMe(req, res) {
    try {
      const user = req.user; // User is attached by Passport middleware
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      return res.status(200).json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        createdAt: new Date(user.created_at).toISOString(),
      });
    } catch (error) {
      console.error('Error in getMe:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },  

  async redirectToHome(req, res) {
    try {
      if (req.isAuthenticated()) {
        const { password, ...userData } = req.user;
        return res.json({
          isAuthenticated: true,
          user: userData,
        });
      } else {
        return res.json({
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error in redirectToHome:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  },

  async getUserCreatedAt(req, res) {
    try {
      console.log('Received token:', req.headers.authorization);
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is missing' });
      }

      const createdAt = await users.getUserCreatedAt(userId);
      res.json({ created_at: createdAt });
    } catch (error) {
      console.error('Error fetching user created_at:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },
};

module.exports = usersController;
