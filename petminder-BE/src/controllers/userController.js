// Example of controller for user routes this links to the methods in the user model
const userModel = require('../models/userModel');

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId);
    res.status(200).json(user);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}

// Update current user
exports.updateCurrentUser = async (req, res) => {
  try {
    const user = await userModel.updateUser(req.user.id, req.body);
    res.status(200).json(user);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}

// Add new methods to userController here when added to the userModel