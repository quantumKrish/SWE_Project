// This file is used to create a connection pool to the MySQL database. The connection pool is created using the mysql2/promise package.

const mysql = require('mysql2/promise');

// placeholder values change when we have the database setup
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'petminder',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
