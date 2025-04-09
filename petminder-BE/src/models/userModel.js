// Initialize userModel used to interact with the user table in the database, create methods that query here.
const db = require('../config/db');

const userModel = {
    // Get user by id
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    // Get user by id 
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Update user by id
    updateUser: async (id, user) => {
        const userData = {
            name: user.name,
            address: user.address,

        };
        await db.query('UPDATE users SET ? WHERE id = ?', [userData, id]);

        if (user.role === 'minder'){
            await db.query('UPDATE petMinder SET ? WHERE id = ?', [user.roleDetails, id]);
        }
        return userModel.findById(id);
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

    getUserByEmail: async (email) => {
        const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = userRows[0];

        if (user.role === 'owner') {
            const [rows] = await db.query('SELECT * FROM petOwner WHERE id = ?', [user.id]);
            user.roleDetails = rows[0];
            const [pets] = await db.query('SELECT * FROM pet WHERE ownerID = ?', [user.id]);
            user.roleDetails.pets = pets;
        }
        else if (user.role === 'minder') {
            const [rows] = await db.query('SELECT * FROM petMinder WHERE id = ?', [user.id]);
            user.roleDetails = rows[0];

            const [reviews] = await db.query('SELECT * FROM reviews WHERE reviewedUserID = ?', [user.roleDetails.minderID]);
            user.roleDetails.reviews = reviews;
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

    addPet: async (userId, pet) => {
        console.log('Received pet object:', pet);
        const petData = {
            name: pet.name,
            type: pet.type,
            breed: pet.breed,
            age: pet.age,
            description: pet.description,
            ownerID: userId,
        };
        await db.query('INSERT INTO pet SET ?', [petData]);
        const [rows] = await db.query('SELECT * FROM pet WHERE ownerID = ?', [userId]);
        return rows;
    },

    deletePet: async (petID) => {
        await db.query('DELETE FROM pet WHERE petID = ?', [petID]);
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
