const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel.js')

router.get ('/minder/username/:name', async (req, res) => {
  console.log("Get username response received");
  try {
  const {name} = req.params;
  const user = await userModel.searchMinderByUsername(name);
  if (!user) {
    return res.status(404).json({error: "User Array not found"});
  }
  res.json(user);
  } catch(e) {
    console.error("catch messasge array error");
    res.status(500).json({ error: "Error sending USER array response!"});
  }
});

router.get ('/id/:id', async (req, res) => {
  try {
  const {id} = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({error: "user not found"});
  }
  res.json(user);
  } catch(e) {
    console.error("catch messasge error");
    res.status(500).json({ error: "Error sending response!"});
  }
});

module.exports = router;
