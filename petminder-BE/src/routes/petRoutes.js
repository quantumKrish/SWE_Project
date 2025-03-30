const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/', petController.createPet);                 
router.get('/:ownerID', petController.getPetsByOwner);     
router.get('/pet/:petID', petController.getPetById);       
router.delete('/pet/:petID', petController.deletePet);     

module.exports = router;
