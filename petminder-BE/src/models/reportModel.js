const db = require('../config/db');

const reportModel = {
  newReport: async (to, by, title, description) => {
    const sql = "INSERT INTO report (reportedBy, reportedUser, reason, description, status) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [by, to, title, description, "pending"]);
    return true;
  },
  getReportsToAndBy: async(to, by) => {
    const sql = "SELECT * FROM report WHERE reportedBy = ? AND reportedUser = ?";
    const [rows] = await db.query(sql, [by, to]);
    return rows[0];
  }
};

module.exports = reportModel;
