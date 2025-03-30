const express = require('express');
const router = express.Router();
const db = require('../config/db');
const petController = require('../controllers/petController');

// Get pets by ownerID 
router.get('/owner/:ownerID', async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const [rows] = await db.query('SELECT * FROM pets WHERE ownerID = ?', [ownerID]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userID', petController.getPetsByUserId);

module.exports = router;
