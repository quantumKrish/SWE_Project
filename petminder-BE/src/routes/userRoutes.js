const express = require('express');
const userController = require('../controllers/userController');
const authentication = require('../middleware/authMiddleware');

const router = express.Router();

// Authenticated user routes
router.get('/me', authentication.verifyToken, userController.getCurrentUser);
router.put('/me', authentication.verifyToken, userController.updateCurrentUser);
router.post('/:id', userController.getUserById);
router.put('/me/pet', authentication.verifyToken, userController.addPet);
router.delete('/:petID', userController.deletePet);
// router.put('/me/pet/:petId', authentication.verifyToken, userController.updatePet);

// Public routes
router.get('/minders', userController.getAllMinders);
router.get('/minder/:id', userController.getMinder);


router.get('/petowner/user/:userID', userController.getOwnerIdByUserId);

module.exports = router;
