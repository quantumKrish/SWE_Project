const reviewModel = require('../models/reviewModel');

const reviewController = {
  createReview: async (req, res) => {
    try {
      const reviewData = req.body;

      const review = await reviewModel.create(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(400).json({ error: error.message });
    }
  },

  getReviewById: async (req, res) => {
    try {
      const reviewID = req.params.id;
      const review = await reviewModel.findById(reviewID);

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getReviewsByTarget: async (req, res) => {
    try {
      const reviewerID = req.params.userId;
      const reviews = await reviewModel.findByReviewer(reviewerID);
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const reviewID = req.params.id;
      await reviewModel.delete(reviewID);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = reviewController;
