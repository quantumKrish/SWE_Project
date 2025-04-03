import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import '../CSS/home.css';


function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : "Guest";

  const [bookings, setBookings] = useState([]);
  const userRole = user?.role;
  const userID = user?.roleDetails?.ownerID || user?.roleDetails?.minderID;

  // Function to format date & time nicely
  const formatDateTime = (dateTimeStr) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(dateTimeStr).toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    if (!userID) return;

    const fetchBookings = async () => {
      const endpoint =
        userRole === "owner"
          ? `http://localhost:4000/bookings/owner/${userID}`
          : `http://localhost:4000/bookings/minder/${userID}`;

      console.log(`Fetching bookings from: ${endpoint}`);

      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        console.log("Received booking data:", data);

        if (res.ok) {
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userID, userRole]);

  return (
    <div className="container">
      <h1>Welcome {username} to PetMinder</h1>
      <p>Your one-stop solution for pet minding services.</p>
      <Navbar />

      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Status</th>
              <th>Time Slot</th>
              <th>Duration</th>
              <th>Owner ID</th>
              <th>Minder ID</th>
              <th>Pet ID</th>
              <th>Checklist</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingID}>
                <td>{booking.bookingID}</td>
                <td
                  className={`status ${booking.status.toLowerCase()}`} // Add a class for styling
                >
                  {booking.status}
                </td>
                <td>{formatDateTime(booking.timeSlot)}</td>
                <td>{booking.duration}</td>
                <td>{booking.ownerID}</td>
                <td>{booking.minderID}</td>
                <td>{booking.petID}</td>
                <td>{booking.checklist || "No checklist provided"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;
