import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top

const MinderTracking = ({ userId, bookingID, duration }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60 * 60); // Convert hours to seconds
  const [checklist, setChecklist] = useState([]); // Stores checklist items
  const [checkedItems, setCheckedItems] = useState([]); // Tracks checked items
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
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

  // Countdown Timer
  useEffect(() => {
    if (!sessionActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, timeLeft]);

  useEffect(() => {
    // Fetch the checklist from the booking details
    const fetchChecklist = async () => {
      try {
        const res = await fetch(`http://localhost:4000/bookings/${bookingID}`);
        const data = await res.json();

        if (res.ok && data.checklist) {
          // Convert checklist string into an array (split by commas and trim spaces)
          const checklistArray = data.checklist.split(",").map((item) => item.trim());
          setChecklist(checklistArray);
          setCheckedItems(new Array(checklistArray.length).fill(false)); // Initialize all as unchecked
        } else {
          console.error("❌ Error fetching checklist:", data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch checklist:", error);
      }
    };

    if (bookingID) fetchChecklist();
  }, [bookingID]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Handle checklist item toggle
  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  // Check if all checklist items are checked
  const allItemsChecked = checkedItems.every((item) => item);

  const handleEndSession = async () => {
    if (!allItemsChecked) {
      alert("⚠️ Please complete all checklist tasks before ending the session!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/bookings/${bookingID}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Session ended successfully!");
        navigate("/home");
      } else {
        alert("❌ Error ending session: " + data.error);
      }
    } catch (error) {
      console.error("❌ Failed to end session:", error);
      alert("❌ Failed to end session.");
    }
  };

  return (
    <div>
      <h2>Minder Tracking</h2>
      {!sessionActive ? (
        <button onClick={() => setSessionActive(true)}>Start Session</button>
      ) : (
        <>
          <p>Session Active ✅</p>
          <p>Time Remaining: {timeLeft !== null ? formatTime(timeLeft) : "Calculating..."}</p>
          {location.latitude && location.longitude ? (
            <p>📍 Latitude: {location.latitude}, Longitude: {location.longitude}</p>
          ) : (
            <p>Waiting for location data...</p>
          )}

          {/* Checklist Section */}
          <h3>Checklist 📝</h3>
          <ul>
            {checklist.map((item, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={checkedItems[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
                {item}
              </li>
            ))}
          </ul>

          {/* End Session Button (Disabled until all items checked) */}
          <button onClick={handleEndSession} disabled={!allItemsChecked}>
            End Session
          </button>
        </>
      )}
    </div>
  );
};

export default MinderTracking;
