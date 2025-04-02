const userModel = require('../models/userModel');
const db = require('../config/db');

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await userModel.findById(userId);
    console.log(user);
    user = await userModel.getUserByEmail(user.email);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const user = await userModel.updateUser(req.user.userId, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMinders = async (req, res) => {
  try {
    const minders = await userModel.getAllMinders();
    res.status(200).json(minders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getOwnerIdByUserId = async (req, res) => {
  try {
    const { userID } = req.params;
    const [rows] = await db.query('SELECT ownerID FROM petowner WHERE id = ?', [userID]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pet owner not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    res.status(200).json(user);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}

exports.addPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const pet = req.body;
    const updatedUser = await userModel.addPet(userId, pet);
    res.status(200).json(updatedUser);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}

// Add new methods to userController here when added to the userModel
