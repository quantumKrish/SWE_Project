const db = require('../config/db');

const bookingModel = {
  
  create: async (bookingData) => {
    const [result] = await db.query('INSERT INTO bookings SET ?', [bookingData]);
    const [rows] = await db.query('SELECT * FROM bookings WHERE bookingID = ?', [result.insertId]);
    return rows[0];
  },

  findById: async (bookingID) => {
    const [rows] = await db.query('SELECT * FROM bookings WHERE bookingID = ?', [bookingID]);
    return rows[0];
  },

  updateStatus: async (bookingID, newStatus) => {
    await db.query('UPDATE bookings SET status = ? WHERE bookingID = ?', [newStatus, bookingID]);
    return bookingModel.findById(bookingID);
  },

  sendBookingRequest: async (bookingData) => {
    return bookingModel.create(bookingData);
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM bookings');
    return rows;
  },

  delete: async (bookingID) => {
    await db.query('DELETE FROM bookings WHERE bookingID = ?', [bookingID]);
  }
};

module.exports = bookingModel;
