const express = require('express');
const usersController = require('../controllers/usersController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated'); 
const router = express.Router();

router.post('/register', usersController.createUser); 
router.post('/login', usersController.loginUser); 

router.get('/me', ensureAuthenticated, usersController.getMe);
router.get('/created_at', ensureAuthenticated, usersController.getUserCreatedAt); 
router.get('/:id', ensureAuthenticated, usersController.getUser); 
router.put('/:id', ensureAuthenticated, usersController.updateUser);
router.delete('/:id', ensureAuthenticated, usersController.deleteUser);

module.exports = router;
