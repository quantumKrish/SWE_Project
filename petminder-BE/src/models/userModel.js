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

    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findByUsername: async (name) => {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [name]);
      return rows;
    },

    searchByUsername: async (name) => {
      const [rows] = await db.query('SELECT * FROM users where username LIKE ?', [`%${name}%`]);
      return rows;
    },

    searchMinderByUsername: async(name) => {
      const [rows] = await db.query('SELECT * FROM users where username LIKE ? AND role = ?', [`%${name}%`, 'minder']);
      return rows;
    },

    createUser: async (username, email, password, role) => {
        const [rows] = await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, password, role]);
        return rows.insertId;
    },

    // Add new methods to userModel here
    };

module.exports = userModel;
