import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker issue (default markers may not show correctly)
// This ensures that the marker icon is properly displayed on the map
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41], // Standard Leaflet marker size
  iconAnchor: [12, 41], // Adjusts marker positioning
  popupAnchor: [1, -34], // Positions popup relative to marker
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41], // Ensures proper shadow rendering
});

// Component to update the map's view whenever the minder's location changes
const ChangeMapView = ({ coords }) => {
  const map = useMap(); // Access the Leaflet map instance

  useEffect(() => {
    if (coords.latitude && coords.longitude) {
      map.flyTo([coords.latitude, coords.longitude], 16); // Smooth transition to the new location
    }
  }, [coords, map]);

  return null; // This component does not render anything itself
};

const OwnerMap = ({ minderId }) => {
  const [socket, setSocket] = useState(null); // WebSocket connection state
  const [location, setLocation] = useState({ latitude: null, longitude: null }); // State to track minder's location
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    // Establish a WebSocket connection with the server
    const ws = new WebSocket("ws://localhost:3001");
    setSocket(ws);

    // When the connection is open, send a request to track the minder
    ws.onopen = () => {
      console.log("✅ Owner WebSocket connected");
      ws.send(JSON.stringify({ type: "track", minderId })); // Notify server to track this minder
    };

    // Listen for messages from the WebSocket
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // If the received data is a location update, update the state
      if (data.type === "location") {
        console.log("📩 Owner received location:", data);
        setLocation({ latitude: data.latitude, longitude: data.longitude });
      }

      if (data.type === "checklistUpdate") {
        console.log("📩 Owner received checklist update:", data.tasks);
        setChecklist(data.tasks);
      }
      
    };

    // Cleanup function to close the WebSocket when the component unmounts
    return () => ws.close();
  }, [minderId]);

  return (
    <div>
      <h2>Owner Tracking Minder</h2>
      {/* If location data is available, display the map */}
      {location.latitude && location.longitude ? (
        <MapContainer
          center={[location.latitude, location.longitude]} // Initial center of the map
          zoom={16} // Zoom level for a closer view
          style={{ height: "400px", width: "100%" }} // Set map size
        >
          {/* Updates the map's view when location changes */}
          <ChangeMapView coords={location} /> 
          {/* Load OpenStreetMap tiles */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Display a marker at the minder's current location */}
          <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
            <Popup>📍 Minder {minderId} is here</Popup>
          </Marker>
        </MapContainer>
      ) : (
        // Show this message while waiting for the minder's location
        <p>Waiting for minder location...</p>
      )}

      <h3>Checklist Status</h3>
      <ul>
        {checklist.map(task => (
          <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.text} {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerMap;
