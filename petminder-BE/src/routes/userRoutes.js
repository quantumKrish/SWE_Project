// Routes for user endpoints currently without authentication but will be added later
const express = require('express');
const userController = require('../controllers/userController');
const authentication = require('../middleware/authMiddleware');

const router = express.Router();

// Add routes here when added to the userController
router.get('/me', authentication.verifyToken, userController.getCurrentUser);
router.put('/me', authentication.verifyToken, userController.updateCurrentUser);
router.post('/:id', userController.getUserById);
router.put('/me/pet', authentication.verifyToken, userController.addPet);
// router.put('/me/pet/:petId', authentication.verifyToken, userController.updatePet);

module.exports = router;
