import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/ownerMap.css"; // Import the new CSS file

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const ChangeMapView = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords.latitude && coords.longitude) {
      map.flyTo([coords.latitude, coords.longitude], 16);
    }
  }, [coords, map]);

  return null;
};

const OwnerMap = ({ minderId }) => {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    setSocket(ws);
  
    ws.onopen = () => {
      console.log("✅ Owner WebSocket connected");
      ws.send(JSON.stringify({ type: "track", minderId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("👀 OwnerMap tracking minder ID:", data.minderId);

      if (data.type === "location") {
        setLocation({ latitude: data.latitude, longitude: data.longitude });
        console.log("📩 Owner received location:", data);

      } else if (data.type === "minder_disconnected") {
        console.warn("⚠️ Minder disconnected!");
        setShowDisconnectPopup(true);
      }
    };
  
    ws.onclose = () => {};

    return () => ws.close();
  }, [minderId]);

  return (
    <div className="owner-map-container">
      <h2>Tracking Minder</h2>

      {showDisconnectPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Connection Lost</h3>
            <p>The minder has disconnected. Please check with them or try refreshing the page.</p>
            <button onClick={() => setShowDisconnectPopup(false)}>Okay</button>
          </div>
        </div>
      )}

      {location.latitude && location.longitude ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          style={{ height: "400px", width: "900px" }}
        >
          <ChangeMapView coords={location} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
            <Popup>📍 Minder {minderId} is here</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Waiting for minder location...</p>
      )}

      <button onClick={() => navigate("/home")} className="back-to-home-btn">
        🔙 Back to Home
      </button>
    </div>
  );
};

export default OwnerMap;
