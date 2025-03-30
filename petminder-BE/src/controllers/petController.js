const db = require('../config/db');
const petModel = require('../models/petModel');

const petController = {
  // Create a pet
  createPet: async (req, res) => {
    try {
      const petData = req.body;
      const newPet = await petModel.create(petData);
      res.status(201).json(newPet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all pets for a specific user 
  getPetsByUserId: async (req, res) => {
    try {
      const { userID } = req.params;

      // Find the owner's ID for this user
      const [ownerRows] = await db.query('SELECT ownerID FROM petowner WHERE id = ?', [userID]);

      if (ownerRows.length === 0) {
        return res.status(404).json({ message: 'Pet owner not found' });
      }

      const ownerID = ownerRows[0].ownerID;

      // Get pets for this owner
      const [petRows] = await db.query('SELECT * FROM pets WHERE ownerID = ?', [ownerID]);

      res.status(200).json(petRows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get one pet by ID
  getPetById: async (req, res) => {
    try {
      const petID = req.params.petID;
      const pet = await petModel.findById(petID);
      if (!pet) return res.status(404).json({ message: 'Pet not found' });
      res.status(200).json(pet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a pet profile
  deletePet: async (req, res) => {
    try {
      const petID = req.params.petID;
      await petModel.delete(petID);
      res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = petController;
