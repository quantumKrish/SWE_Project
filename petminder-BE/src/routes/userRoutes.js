const express = require('express');
const userController = require('../controllers/userController');
const authentication = require('../middleware/authMiddleware');

const router = express.Router();

// Authenticated user routes
router.get('/me', authentication.verifyToken, userController.getCurrentUser);
router.put('/me', authentication.verifyToken, userController.updateCurrentUser);

// Public routes
router.get('/minders', userController.getAllMinders);


router.get('/petowner/user/:userID', userController.getOwnerIdByUserId);

module.exports = router;
