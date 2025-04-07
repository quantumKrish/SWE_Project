const express = require('express');
const router = express.Router();

const reportModel = require('../models/reportModel.js')

router.post ('/:by/:to', async (req, res) => {
  console.log("Got Report");
  const {to, by, title, description} = req.body;
  const check = await reportModel.getReportsToAndBy(to, by);
  if (check == null) {
    await reportModel.newReport(to, by, title, description);
  } else {
    res.json("You have already submitted a report for this user!");
    return;
  }
  res.json("Report Succesfully Submitted!");
  return;
})

module.exports = router;
