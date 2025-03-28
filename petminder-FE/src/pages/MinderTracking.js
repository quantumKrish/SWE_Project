import React, { useEffect, useState } from "react";

const MinderTracking = ({ userId }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [retryCount, setRetryCount] = useState(0); // Track retry attempts
  const [tasks, setTasks] = useState([
    { id: 1, text: "Pick up the pet", completed: false },
    { id: 2, text: "Walk the pet", completed: false },
    { id: 3, text: "Give water", completed: false },
    { id: 4, text: "Return pet home", completed: false },
  ]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    setSocket(ws);

    ws.onopen = () => {
      console.log("✅ Minder WebSocket connected");
      ws.send(JSON.stringify({ type: "register", userId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Minder received:", data);
    };

    return () => ws.close();
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    let watchId;
    let retries = 0;
    
    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      console.log("✅ Location Data:", {
        latitude,
        longitude,
        accuracy,
        source: accuracy < 100 ? "GPS" : "Possibly IP-based",
      });

      // Accept GPS data if accuracy is good OR retry limit reached
      if (accuracy < 100 || retries >= 5) {
        setLocation({ latitude, longitude });

        socket.send(JSON.stringify({
          type: "location",
          userId,
          latitude,
          longitude,
        }));

        console.log("📡 Sent updated location:", latitude, longitude);
        return; // Stop retrying if we got a good fix
      }

      // Retry up to 5 times if accuracy is bad
      retries++;
      console.warn(`⚠️ Low accuracy (${accuracy}m), retrying (${retries}/5)...`);
    };

    const handleError = (error) => {
      console.error("⚠️ Geolocation error:", error);
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      console.error("❌ Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userId]);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    if (socket) {
      socket.send(JSON.stringify({
        type: "checklistUpdate",
        userId,
        tasks: updatedTasks,
      }));
    }
  };

  return (
    <div>
      <h2>Tracking Minder Location</h2>
      {location.latitude && location.longitude ? (
        <p>📍 Latitude: {location.latitude}, Longitude: {location.longitude}</p>
      ) : (
        <p>Waiting for location data...</p>
      )}
      
      <h3>Checklist</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MinderTracking;
