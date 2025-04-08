import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top
import "../CSS/minderTracking.css"; // Import the updated CSS file


const MinderTracking = ({ userId, bookingID, duration }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60 * 60); // Convert hours to seconds
  const [checklist, setChecklist] = useState([]); // Stores checklist items
  const [checkedItems, setCheckedItems] = useState([]); // Tracks checked items
  const navigate = useNavigate(); // Initialize navigation
  const [showTerms, setShowTerms] = useState(false);

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

  // Auto end session if time is up
  useEffect(() => {
    if (timeLeft <= 0 && sessionActive) {
      alert("⏰ Time's up! Session has ended automatically.");
      handleEndSession(); // auto-end the session
    }
  }, [timeLeft, sessionActive]);

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
    <div className="minder-tracking">
      <h2>Minder Tracking</h2>

      {!sessionActive ? (
        <>
          <button className="start-session-btn" onClick={() => setShowTerms(true)}>Start Session</button>

          {showTerms && (
            <div className="modal">
              <div className="modal-content">
                <h3>🚨 Terms & Conditions</h3>
                <p>
                  By starting this session, you agree to:
                </p>
                <ul>
                  <li>You must keep your device’s location services turned ON at all times.</li>
                  <li>Disabling or faking your location may result in serious consequences, including:
                    <ul>
                      <li>⚠️ Fines up to £1,000</li>
                      <li>⚠️ Legal action including jail time</li>
                    </ul>
                  </li>
                  <li>You must complete all checklist items before ending the session.</li>
                </ul>
                <div className="modal-actions">
                  <button onClick={() => { setShowTerms(false); setSessionActive(true); }}>✅ I Accept</button>
                  <button onClick={() => setShowTerms(false)} style={{ marginLeft: "10px" }}>❌ Decline</button>
                </div>
              </div>
            </div>
          )}
        </>
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

          <button onClick={handleEndSession} disabled={!allItemsChecked} className="end-session-btn">
            End Session
          </button>
        </>
      )}
    </div>
  );
};

export default MinderTracking;
