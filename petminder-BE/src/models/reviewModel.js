const db = require('../config/db');

const reviewModel = {
  create: async (reviewData) => {
    const { reviewerID, reviewedUserID, bookingID, rating, comment } = reviewData;

    const [bookingRows] = await db.query(
      'SELECT * FROM booking WHERE bookingID = ? AND status = "completed"',
      [bookingID]
    );

    if (bookingRows.length === 0) {
      throw new Error('Review cannot be left until booking is completed.');
    }

    const [existing] = await db.query(
      'SELECT * FROM reviews WHERE bookingID = ? AND reviewerID = ?',
      [bookingID, reviewerID]
    );
    if (existing.length > 0) {
      throw new Error('You have already submitted a review for this booking.');
    }

    const [result] = await db.query(
      'INSERT INTO reviews (reviewerID, reviewedUserID, bookingID, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [reviewerID, reviewedUserID, bookingID, rating, comment]
    );

    const [rows] = await db.query('SELECT * FROM reviews WHERE reviewID = ?', [result.insertId]);
    return rows[0];

    
  },

  findById: async (reviewID) => {
    const [rows] = await db.query('SELECT * FROM reviews WHERE reviewID = ?', [reviewID]);
    return rows[0];
  },

  findByReviewedUser: async (reviewedUserID) => {
    const [rows] = await db.query('SELECT * FROM reviews WHERE reviewedUserID = ?', [reviewedUserID]);
    return rows;
  },

  findByReviewer: async (reviewerID) => {
    const [rows] = await db.query('SELECT * FROM reviews WHERE reviewerID = ?', [reviewerID]);
    return rows;
  },

  delete: async (reviewID) => {
    await db.query('DELETE FROM reviews WHERE reviewID = ?', [reviewID]);
  }

};

module.exports = reviewModel;
