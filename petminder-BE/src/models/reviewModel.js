const db = require('../config/db');

const reviewModel = {
  
  create: async (reviewData) => {
    const [result] = await db.query('INSERT INTO reviews SET ?', [reviewData]);
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    return rows[0];
  },

  
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0];
  },

  
  findByTarget: async (targetId) => {
    const [rows] = await db.query('SELECT * FROM reviews WHERE target = ?', [targetId]);
    return rows;
  },

  // Delete review
  delete: async (id) => {
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
  }
};

module.exports = reviewModel;
