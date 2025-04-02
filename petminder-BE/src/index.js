require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging line

const express = require("express");
const cors = require("cors");
const http = require("http"); // Required for WebSocket integration
const WebSocket = require("ws");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const getUserRoute = require("./routes/getUserRoute");
const getMessageRoute = require("./routes/messageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const expressPort = process.env.PORT || 4000; // API server
const wsPort = 4001; // WebSocket server

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/getuser", getUserRoute);
app.use("/message/", getMessageRoute);
app.use("/bookings", bookingRoutes);

app.get("/api/user/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

// Start Express API server
app.listen(expressPort, () => {
  console.log(`🚀 Server running at http://localhost:${expressPort}`);
});

// Create an HTTP server for WebSocket
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store connected minders and owners tracking them
const minders = {};
const owners = {};

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("📩 Received:", data);

    if (data.type === "register") {
      minders[data.userId] = ws;
      console.log(`🔗 Minder registered: ${data.userId}`);
    } else if (data.type === "location") {
      if (minders[data.userId]) {
        console.log(
          `📍 Minder ${data.userId} at ${data.latitude}, ${data.longitude}`
        );

        if (owners[data.userId]) {
          owners[data.userId].forEach((ownerWs) => {
            if (ownerWs.readyState === WebSocket.OPEN) {
              ownerWs.send(
                JSON.stringify({
                  type: "location",
                  minderId: data.userId,
                  latitude: data.latitude,
                  longitude: data.longitude,
                })
              );
            }
          });
        }
      }
    } else if (data.type === "track") {
      if (minders[data.minderId]) {
        if (!owners[data.minderId]) owners[data.minderId] = [];
        owners[data.minderId].push(ws);
        console.log(`👀 Owner tracking minder: ${data.minderId}`);
        console.log(
          `📝 Current owners tracking minder ${data.minderId}:`,
          owners[data.minderId].length
        );
      } else {
        console.log(
          `⚠️ Minder ${data.minderId} is not registered, owner cannot track`
        );
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");

    Object.keys(minders).forEach((id) => {
      if (minders[id] === ws) delete minders[id];
    });

    Object.keys(owners).forEach((minderId) => {
      owners[minderId] = owners[minderId].filter((ownerWs) => ownerWs !== ws);
      if (owners[minderId].length === 0) delete owners[minderId];
    });
  });
});

// Start WebSocket server
server.listen(wsPort, () => {
  console.log(`🔌 WebSocket server running on ws://localhost:${wsPort}`);
});
