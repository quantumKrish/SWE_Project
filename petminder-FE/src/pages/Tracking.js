import React, { useEffect, useState } from "react";
import MinderTracking from "./MinderTracking";
import OwnerMap from "./OwnerMap";
import { useLocation } from "react-router-dom"; // Import to get URL parameters

const Tracking = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const bookingID = searchParams.get("bookingID"); // Get bookingID from URL
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [minderId, setMinderId] = useState(null);
    const [duration, setDuration] = useState(null);  // Added duration state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) {
                setError("No user data found, please log in.");
                return;
            }

            setUserRole(user.role);
            setUserId(user.roleDetails?.minderID || user.roleDetails?.ownerID);

            // Fetch the booking details to get the minderID and duration
            if (bookingID) {
                fetch(`http://localhost:4000/bookings/${bookingID}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data && data.minderID) {
                            setMinderId(data.minderID);
                            setDuration(data.duration); // Set duration here
                        } else {
                            setError("Minder ID not found for this booking.");
                        }
                    })
                    .catch((err) => {
                        console.error("Error fetching booking:", err);
                        setError("Failed to fetch booking data.");
                    })
                    .finally(() => setLoading(false));
            } else {
                setError("No booking ID provided.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error retrieving user data:", error);
            setError("Failed to retrieve user data.");
            setLoading(false);
        }
    }, [bookingID]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!userRole) return <p>User role not found.</p>;

    return (
        <div>
            <h2>Live Tracking - {userRole.toUpperCase()}</h2>
            {userRole === "minder" ? (
                <MinderTracking userId={userId} bookingID={bookingID} duration={duration} />
            ) : (
                <OwnerMap minderId={minderId} />
            )}
        </div>
    );
};

export default Tracking;
