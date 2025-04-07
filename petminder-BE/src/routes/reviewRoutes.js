const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.get('/:id', reviewController.getReviewById);
router.get('/user/:userId', reviewController.getReviewsByTarget);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
