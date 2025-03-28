import React, { useEffect, useState } from "react";

const MinderTracking = ({ userId }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [sessionActive, setSessionActive] = useState(false); // Track session state

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setSocket(ws);

    ws.onopen = () => {
      console.log("✅ Minder WebSocket connected");
      ws.send(JSON.stringify({ type: "register", userId }));
    };

    ws.onmessage = (event) => {
      console.log("📩 Minder received:", JSON.parse(event.data));
    };

    return () => ws.close();
  }, [userId]);

  useEffect(() => {
    if (!socket || !sessionActive) return;

    let watchId;

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });

      socket.send(JSON.stringify({
        type: "location",
        userId,
        latitude,
        longitude,
      }));

      console.log("📡 Sent updated location:", latitude, longitude);
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
  }, [socket, userId, sessionActive]);

  return (
    <div>
      <h2>Minder Tracking</h2>
      {!sessionActive ? (
        <button onClick={() => setSessionActive(true)}>Start Session</button>
      ) : (
        <>
          <p>Session Active ✅</p>
          {location.latitude && location.longitude ? (
            <p>📍 Latitude: {location.latitude}, Longitude: {location.longitude}</p>
          ) : (
            <p>Waiting for location data...</p>
          )}
        </>
      )}
    </div>
  );
};

export default MinderTracking;
