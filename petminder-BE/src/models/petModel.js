const db = require('../config/db');

const petModel = {
  
  create: async (petData) => {
    const [result] = await db.query('INSERT INTO pets SET ?', [petData]);
    const [rows] = await db.query('SELECT * FROM pets WHERE petID = ?', [result.insertId]);
    return rows[0];
  },

  
  findAllByOwner: async (ownerID) => {
    const [rows] = await db.query('SELECT * FROM pets WHERE ownerID = ?', [ownerID]);
    return rows;
  },


  findById: async (petID) => {
    const [rows] = await db.query('SELECT * FROM pets WHERE petID = ?', [petID]);
    return rows[0];
  },

  
  delete: async (petID) => {
    await db.query('DELETE FROM pets WHERE petID = ?', [petID]);
  }
};

module.exports = petModel;
