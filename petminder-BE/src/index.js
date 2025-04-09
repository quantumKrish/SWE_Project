require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging line

const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const getUserRoute = require("./routes/getUserRoute");
const getMessageRoute = require("./routes/messageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const reportRoutes = require("./routes/reportRoutes");
const petRoutes = require("./routes/petRoutes");

const app = express();
const expressPort = process.env.PORT || 4000;
const wsPort = 4001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/getuser", getUserRoute);
app.use("/message/", getMessageRoute);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/report/", reportRoutes);
app.use("/pets", petRoutes);

app.get("/api/user/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

// Start Express server
app.listen(expressPort, () => {
  console.log(`🚀 Server running at http://localhost:${expressPort}`);
});

// WebSocket setup
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const minders = new Map(); // minderId -> ws
const trackingOwners = new Map(); // minderId -> Set<ws>

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("📩 Received:", data);

    if (data.type === "register") {
      const minderId = data.userId;
      ws.userId = minderId;
      ws.role = "minder";

      minders.set(minderId, ws);
      console.log(`🔗 Minder registered: ${minderId}`);
    }

    else if (data.type === "location") {
      const { userId, latitude, longitude } = data;
      if (minders.has(userId)) {
        console.log(`📍 Minder ${userId} at ${latitude}, ${longitude}`);

        const owners = trackingOwners.get(userId);
        if (owners) {
          owners.forEach((ownerWs) => {
            if (ownerWs.readyState === WebSocket.OPEN) {
              ownerWs.send(JSON.stringify({
                type: "location",
                minderId: userId,
                latitude,
                longitude,
              }));
            }
          });
        }
      }
    }

    else if (data.type === "track") {
      const minderId = data.minderId;
      ws.role = "owner";

      if (!trackingOwners.has(minderId)) {
        trackingOwners.set(minderId, new Set());
      }

      trackingOwners.get(minderId).add(ws);
      console.log(`👀 Owner tracking minder: ${minderId}`);
      console.log(`📝 Current owners tracking minder ${minderId}: ${trackingOwners.get(minderId).size}`);
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");

    if (ws.role === "minder") {
      const minderId = ws.userId;
      minders.delete(minderId);

      const owners = trackingOwners.get(minderId);
      if (owners) {
        owners.forEach((ownerWs) => {
          if (ownerWs.readyState === WebSocket.OPEN) {
            ownerWs.send(JSON.stringify({
              type: "minder_disconnected",
              minderId,
            }));
          }
        });
        trackingOwners.delete(minderId);
      }

      console.log(`🚫 Minder ${minderId} disconnected, owners notified.`);
    }

    // Optional: clean up owners
    if (ws.role === "owner") {
      for (const [minderId, ownerSet] of trackingOwners.entries()) {
        ownerSet.delete(ws);
        if (ownerSet.size === 0) {
          trackingOwners.delete(minderId);
        }
      }
    }
  });
});

// Start WebSocket server
server.listen(wsPort, () => {
  console.log(`🔌 WebSocket server running on ws://localhost:${wsPort}`);
});
