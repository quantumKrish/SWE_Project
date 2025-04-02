const db = require('../config/db');

const messageModel = {
  findByID: async (sendid, receiveid) => {
    const [rows] = await db.query('SELECT * FROM messages WHERE send_id = ? AND receive_id = ?', [sendid, receiveid]);
    return rows;
  },
  insertByID: async (sendid, receiveid, message) => {
    const sql = "INSERT INTO messages (send_id, receive_id, message) VALUES (?, ?, ?)";
    await db.query(sql, [sendid, receiveid, message]);
    return {success: true};
  },
};

module.exports = messageModel;
