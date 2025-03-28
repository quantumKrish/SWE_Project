import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected import
import MinderTracking from "./MinderTracking";
import OwnerMap from "./OwnerMap";

const Tracking = () => {
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No token found, please log in.");
            setLoading(false);
            return;
        }

        try {
            // Decode the JWT token correctly
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken); // Log to inspect the decoded token
            
            if (decodedToken) {
                setUserRole(decodedToken.role); // Assuming role is inside the token
                setUserId(decodedToken.id); // Assuming id is inside the token
            } else {
                setError("Token does not contain valid user data.");
            }
        } catch (error) {
            console.error("❌ Error decoding the token:", error);
            setError("Failed to decode the token.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array to run this only once on component mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!userRole) return <p>User role not found.</p>;

    return (
        <div>
            <h2>Live Tracking - {userRole.toUpperCase()}</h2>
            {userRole === "minder" ? (
                <MinderTracking userId={userId} />
            ) : (
                <OwnerMap minderId={5} />
            )}
        </div>
    );
};

export default Tracking;
