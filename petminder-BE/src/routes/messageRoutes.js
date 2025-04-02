const express = require('express');
const router = express.Router();

const messageModel = require('../models/messageModel.js')

router.get('/:sender/:receiver', async (req, res) => {
  console.log("Get messages received!");
  const {sender, receiver} = req.params;
  data = await messageModel.findByID(sender, receiver);
  res.json(data);
});

router.post('/send/:sender/:receiver', async (req, res) => {
  console.log("Sending message");
  const {sender, receiver} = req.params;
  const {message} = req.body;
  console.log(message);
  data = await messageModel.insertByID(sender, receiver, message);
  res.json(data);
});

module.exports = router;
