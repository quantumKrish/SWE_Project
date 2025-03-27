import React from "react";
import { useSearchParams } from "react-router-dom";
import MinderTracking from "./MinderTracking"; 
import OwnerMap from "./OwnerMap"; 

const Tracking = () => {
  // Get URL parameters to determine the user's role (minder or owner)
  const [searchParams] = useSearchParams();
  const userRole = searchParams.get("role") || "minder"; // Default to 'minder' if no role is specified
  const userId = searchParams.get("id") || "testUser123"; // Temporary fallback

  return (
    <div>
      <h2>Live Tracking - {userRole.toUpperCase()}</h2>
      
      {/* Render the appropriate component based on user role */}
      {userRole === "minder" ? (
        <MinderTracking key="minder" userId={userId} />
      ) : (
        <OwnerMap key="owner" minderId={userId} />
      )}
    </div>
  );
};

export default Tracking;
