const reviewModel = require('../models/reviewModel');

const reviewController = {
 
  createReview: async (req, res) => {
    try {
      const reviewData = req.body;
      const newReview = await reviewModel.create(reviewData);
      res.status(201).json(newReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  getReviewById: async (req, res) => {
    try {
      const id = req.params.id;
      const review = await reviewModel.findById(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.status(200).json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  getReviewsByTarget: async (req, res) => {
    try {
      const targetId = req.params.targetId;
      const reviews = await reviewModel.findByTarget(targetId);
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

 
  deleteReview: async (req, res) => {
    try {
      const id = req.params.id;
      await reviewModel.delete(id);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = reviewController;
