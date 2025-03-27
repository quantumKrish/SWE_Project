/*
const express = require('express');
const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes'); // Uncomment when ready
// const locationRoutes = require('./routes/locationRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
// app.use('/auth', authRoutes);
// app.use('/location', locationRoutes);
// app.use('/messages', messageRoutes);
// app.use('/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

*/

const WebSocket = require("ws");

// Create a WebSocket server on port 3001
const wss = new WebSocket.Server({ port: 3001 });

const minders = {}; // Store connected minders and their WebSocket connections
const owners = {};  // Store owners tracking specific minders

// Handle new WebSocket connections
wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message); // Parse incoming message
    console.log("📩 Received:", data);

    // If a minder registers, store their WebSocket connection
    if (data.type === "register") {
      if (data.userId) {
        minders[data.userId] = ws;
        console.log(`🔗 Registered minder: ${data.userId}`);
      } else {
        console.log("⚠️ Registration failed: No userId provided");
      }
    } 

    // Handle location updates from minders
    else if (data.type === "location") {
      if (data.userId && minders[data.userId]) {
        console.log(`📍 Minder ${data.userId} at ${data.latitude}, ${data.longitude}`);

        // Send location updates to all owners tracking this minder
        if (owners[data.userId]) {
          owners[data.userId].forEach(ownerWs => {
            if (ownerWs.readyState === WebSocket.OPEN) {
              ownerWs.send(JSON.stringify({
                type: "location",
                minderId: data.userId,
                latitude: data.latitude,
                longitude: data.longitude
              }));
            }
          });
        }
      } else {
        console.log("⚠️ Location update failed: Unregistered minder");
      }
    }

    // Handle tracking requests from owners
    else if (data.type === "track") {
      if (minders[data.minderId]) {
        if (!owners[data.minderId]) owners[data.minderId] = []; // Initialize if not exists
        owners[data.minderId].push(ws); // Add owner to the list of trackers
        console.log(`👀 Owner tracking minder: ${data.minderId}`);
      } else {
        console.log(`⚠️ Tracking failed: No active minder with ID ${data.minderId}`);
      }
    }
  });

  // Handle WebSocket disconnections
  ws.on("close", () => {
    console.log("❌ Client disconnected");

    // Remove disconnected minder from the minders list
    Object.keys(minders).forEach(id => {
      if (minders[id] === ws) {
        delete minders[id];
      }
    });

    // Remove the disconnected client from any owner tracking lists
    Object.keys(owners).forEach(minderId => {
      owners[minderId] = owners[minderId].filter(ownerWs => ownerWs !== ws);

      // If no owners are tracking this minder anymore, remove the entry
      if (owners[minderId].length === 0) {
        delete owners[minderId];
      }
    });
  });
});

console.log("🚀 WebSocket server running on ws://localhost:3001");
