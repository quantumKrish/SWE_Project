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

    getUserByEmail: async (email) => {
        const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = userRows[0];

        if (user.role === 'owner') {
            const [rows] = await db.query('SELECT * FROM petOwner WHERE id = ?', [user.id]);
            user.roleDetails = rows[0];
        }
        else if (user.role === 'minder') {
            const [rows] = await db.query('SELECT * FROM petMinder WHERE id = ?', [user.id]);
            user.roleDetails = rows[0];
        }
        return user;
    },

    createUser: async (username, email, password, role) => {
        const [rows] = await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, password, role]);
        return rows.insertId;
    },

    createOwnerRow: async (userId) => {
        await db.query('INSERT INTO petOwner (id) VALUES (?)', [userId]);
    },

    createMinderRow: async (userId) => {
        await db.query('INSERT INTO petMinder (id) VALUES (?)', [userId]);
    },

    // Add new methods to userModel here

    getAllMinders: async () => {
        const [rows] = await db.query(`
        SELECT users.id AS userID, users.username, users.email, petminder.minderID
        FROM users
        INNER JOIN petminder ON petminder.id = users.id
        WHERE users.role = 'minder'
        `);
        return rows;
      },
      
    
    };

module.exports = userModel;