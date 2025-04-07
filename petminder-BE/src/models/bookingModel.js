const db = require('../config/db');

const bookingModel = {
  
  create: async (bookingData) => {
    try {
      // Query to fetch the correct minderID from the 'petminder' table based on some criteria
      const [minderRows] = await db.query('SELECT minderID FROM petMinder WHERE id = ?', [bookingData.minderID]);
  
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

  findByMinderId: async (minderID) => {
    console.log(`Querying database for minderID: ${minderID}`); // Debugging log
    const [rows] = await db.query('SELECT * FROM booking WHERE minderID = ?', [minderID]);
    console.log('Database returned:', rows); // Log DB results
    return rows; // Return all rows
  },
  
  findByOwnerId: async (ownerID) => {
    console.log(`Querying database for ownerID: ${ownerID}`); // Debugging log
    const [rows] = await db.query('SELECT * FROM booking WHERE ownerID = ?', [ownerID]);
    console.log('Database returned:', rows); // Log DB results
    return rows; // Return all rows
  },

  // Update booking status
  updateStatus: async (bookingID, status) => {
    const [result] = await db.query("UPDATE booking SET status = ? WHERE bookingID = ?", [status, bookingID]);
    return result.affectedRows > 0;
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
