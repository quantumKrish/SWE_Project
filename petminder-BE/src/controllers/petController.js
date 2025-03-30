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

  // Get all pets for a specific owner
  getPetsByOwner: async (req, res) => {
    try {
      const ownerID = req.params.ownerID;
      const pets = await petModel.findAllByOwner(ownerID);
      res.status(200).json(pets);
    } catch (err) {
      res.status(500).json({ error: err.message });
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
