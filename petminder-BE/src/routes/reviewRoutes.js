const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');


router.post('/', reviewController.createReview);
router.get('/:id', reviewController.getReviewById);
router.get('/target/:targetId', reviewController.getReviewsByTarget);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
