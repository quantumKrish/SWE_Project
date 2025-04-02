require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Required for WebSocket integration
const WebSocket = require("ws");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
// Initialize the server, socket.io will need to be added later also authentication route once developed
require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging line

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const getUserRoute = require('./routes/getUserRoute');
const getMessageRoute = require('./routes/messageRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 


const app = express();
const port = process.env.PORT || 4000;

// Create an HTTP server to use with WebSockets
const server = http.createServer(app);

// Initialize WebSocket Server
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow only your frontend
  credentials: true // Allow cookies and authentication headers
}));
app.use(express.json());

app.get("/api/user/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});


app.use("/auth", authRoutes);
app.use("/users", userRoutes);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🔌 WebSocket server running on ws://localhost:${port}`);
});

const minders = {}; // Store connected minders and their WebSocket connections
const owners = {}; // Store owners tracking specific minders

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("📩 Received:", data);

    if (data.type === "register") {
      minders[data.userId] = ws;
      console.log(`🔗 Minder registered: ${data.userId}`);
    } 
    
    else if (data.type === "location") {
      if (minders[data.userId]) {
        console.log(`📍 Minder ${data.userId} at ${data.latitude}, ${data.longitude}`);
        
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
      }
    }

    else if (data.type === "track") {
      if (minders[data.minderId]) {
        if (!owners[data.minderId]) owners[data.minderId] = [];
        owners[data.minderId].push(ws);
        console.log(`👀 Owner tracking minder: ${data.minderId}`);
        console.log(`📝 Current owners tracking minder ${data.minderId}:`, owners[data.minderId].length);
      } else {
        console.log(`⚠️ Minder ${data.minderId} is not registered, owner cannot track`);
      }
    }
    
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");

    Object.keys(minders).forEach(id => {
      if (minders[id] === ws) delete minders[id];
    });

    Object.keys(owners).forEach(minderId => {
      owners[minderId] = owners[minderId].filter(ownerWs => ownerWs !== ws);
      if (owners[minderId].length === 0) delete owners[minderId];
    });
  });
});
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
// app.use('/location', locationRoutes); // to be added later
app.use('/getuser', getUserRoute); // to be added later
app.use('/message/', getMessageRoute);
app.use('/bookings', bookingRoutes); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// access endpoints in the frontend by using localhost with the port number and the endpoint so something like http://localhost:4000/location to access the location endpoint
