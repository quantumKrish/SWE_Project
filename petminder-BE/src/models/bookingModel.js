const db = require('../config/db');

const bookingModel = {
  
  create: async (bookingData) => {
    try {
      // Query to fetch the correct minderID from the 'petminder' table based on some criteria
      const [minderRows] = await db.query('SELECT minderID FROM petminder WHERE id = ?', [bookingData.minderID]);
  
      if (minderRows.length === 0) {
        throw new Error(`Minder with ID ${bookingData.minderID} not found`);
      }
  
      const minderID = minderRows[0].minderID;
  
      // Now insert the booking with the correct minderID
      const [result] = await db.query('INSERT INTO booking SET ?', [
        { ...bookingData, minderID } // Add the correct minderID to the booking data
      ]);
  
      // Fetch and return the created booking
      const [rows] = await db.query('SELECT * FROM booking WHERE bookingID = ?', [result.insertId]);
      return rows[0];
    } catch (error) {
      console.error('Error during booking creation:', error.message);
      throw error;
    }
  },
  

  findById: async (bookingID) => {
    const [rows] = await db.query('SELECT * FROM booking WHERE bookingID = ?', [bookingID]);
    return rows[0];
  },

  updateStatus: async (bookingID, newStatus) => {
    await db.query('UPDATE booking SET status = ? WHERE bookingID = ?', [newStatus, bookingID]);
    return bookingModel.findById(bookingID);
  },

  sendBookingRequest: async (bookingData) => {
    return bookingModel.create(bookingData);
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM booking');
    return rows;
  },

  delete: async (bookingID) => {
    await db.query('DELETE FROM booking WHERE bookingID = ?', [bookingID]);
  }
};

module.exports = bookingModel;
