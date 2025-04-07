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
  findSenderByID: async(sendid) => {
    const [rows] = await db.query('SELECT * FROM messages WHERE send_id = ?', [sendid]);
    return rows;
  },
  findReceiverByID: async(receiverid) => {
    const [rows] = await db.query('SELECT * FROM messages WHERE receive_id = ?', [receiverid]);
    return rows;
  }
};

module.exports = messageModel;
