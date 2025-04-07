const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel.js')
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

router.post('/list/', async (req, res) => {
  console.log("Getting message list");
  const {user_ID} = req.body;
  sendData = await messageModel.findSenderByID(user_ID);
  receiveData = await messageModel.findReceiverByID(user_ID);
  const sorted_logs = [];

  let i = 0;
  let j = 0;

  const all_users = [];

  while (i < sendData.length && j < receiveData.length) {
    if (sendData[i].id <= receiveData[j].id) {
      sorted_logs.push(sendData[i]);
      i += 1;
    } else {
      sorted_logs.push(receiveData[j]);
      j += 1;
    }/*
    sorted_logs.push(sendData[i]);
    console.log("pushing: ", sendData[i]);
    i += 1;*/
  }

  while (i < sendData.length) {
    sorted_logs.push(sendData[i]);
    i += 1;
  }

  while (j < receiveData.length) {
    sorted_logs.push(receiveData[j]);
    j += 1;
  }

  for (let x = 0; x < sorted_logs.length; x++) {
    let insert = true;
    if (sorted_logs[x].send_id == user_ID) {
      for (let y = 0; y < all_users.length; y++) {
        if (sorted_logs[x].receive_id == all_users[y]) {
          insert = false;
        }
      }
      if (insert == true) {
        all_users.push(sorted_logs[x].receive_id);
      }
    } else if(sorted_logs[x].receive_id == user_ID) {
      for (let y = 0; y < all_users.length; y++) {
        if (sorted_logs[x].send_id == all_users[y]) {
          insert = false;
        }
      }
      if (insert == true) {
        all_users.push(sorted_logs[x].send_id);
      }
    }
  }

  const result = [];

  for (let x = 0; x < all_users.length; x++) {
    result.push(await userModel.findById(all_users[x]));
  }

  console.log(result);

  res.json(result);
});

module.exports = router;
