// Initialize userModel used to interact with the user table in the database, create methods that query here.
const db = require('../config/db');

const userModel = {
    // Get user by id
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },
    // Update user by id
    updateUser: async (id, user) => {
        await db.query('UPDATE users SET ? WHERE id = ?', [user, id]);
        return userModel.findById(id);
    },
    // Add new methods to userModel here
    };

module.exports = userModel;