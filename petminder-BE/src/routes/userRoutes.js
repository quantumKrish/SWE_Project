// Routes for user endpoints currently without authentication but will be added later
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Add routes here when added to the userController
router.get('/me', userController.getCurrentUser);
router.put('/me', userController.updateCurrentUser);

module.exports = router;
