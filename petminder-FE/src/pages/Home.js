import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../CSS/home.css";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : "Guest";

  const [bookings, setBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]); // ✅

  const userRole = user?.role;
  const userID = user?.roleDetails?.minderID || user?.roleDetails?.ownerID;

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

  const canStartSession = (timeSlot) => {
    const now = new Date();
    const bookingTime = new Date(timeSlot);
    const timeDiff = (bookingTime - now) / (1000 * 60);
    return timeDiff <= 10;
  };

  // ✅ Fetch bookings
  useEffect(() => {
    if (!userID) return;

    const fetchBookings = async () => {
      const endpoint =
        userRole === "owner"
          ? `http://localhost:4000/bookings/owner/${userID}`
          : `http://localhost:4000/bookings/minder/${userID}`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();

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

  // ✅ Fetch user's reviews if owner
  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await fetch(`http://localhost:4000/reviews/user/${user.id}`);
        const data = await res.json();
        setUserReviews(data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    if (user?.id && user?.role === "owner") {
      fetchUserReviews();
    }
  }, [user]);

  // ✅ Helper to check if review exists for a booking
  const getReviewForBooking = (bookingID) => {
    return userReviews.find((r) => r.bookingID === bookingID);
  };

  const handleBookingAction = async (bookingID, action) => {
    const endpoint = `http://localhost:4000/bookings/${bookingID}/${action}`;
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Booking ${action}ed successfully!`);
        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
    }
  };

  return (
    <div className="container">
      <h1>Welcome {username} to PetMinder</h1>
      <p>Your one-stop solution for pet minding services.</p>
      <Navbar />

      {/* Owner View */}
      {userRole === "owner" && (
        <div>
          <h2>Your Bookings</h2>
          <button onClick={() => window.location.href = "/search"} className="book-minder-btn">
            Book a Minder
          </button>
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
                  <th>Minder ID</th>
                  <th>Pet ID</th>
                  <th>Checklist</th>
                  <th>Action</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const review = getReviewForBooking(booking.bookingID);

                  return (
                    <tr key={booking.bookingID}>
                      <td>{booking.bookingID}</td>
                      <td className={`status ${booking.status.toLowerCase()}`}>{booking.status}</td>
                      <td>{formatDateTime(booking.timeSlot)}</td>
                      <td>{booking.duration} hours</td>
                      <td>{booking.minderID}</td>
                      <td>{booking.petID}</td>
                      <td>{booking.checklist || "No checklist provided"}</td>
                      <td>
                        {booking.status === "confirmed" ? (
                          <>
                            <button onClick={() => handleBookingAction(booking.bookingID, "cancel")}>Cancel</button>
                            {canStartSession(booking.timeSlot) && (
                              <button onClick={() => window.location.href = `/tracking?bookingID=${booking.bookingID}`}>
                                View Session
                              </button>
                            )}
                          </>
                        ) : (
                          <span>{booking.status}</span>
                        )}
                      </td>
                      <td>
                        {booking.status === "completed" ? (
                          review ? (
                            <div>
                              <span style={{ color: "green", fontWeight: "bold" }}>✓ Reviewed</span>
                              <br />
                              <span>{review.rating}/5</span>
                              <br />
                              <em>"{review.comment}"</em>
                            </div>
                          ) : (
                            <button
                              onClick={() => navigate(`/review/${booking.bookingID}`)}
                              className="review-btn"
                            >
                              Leave Review
                            </button>
                          )
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Minder View */}
      {userRole === "minder" && (
        <div>
          <h2>Assigned Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings assigned.</p>
          ) : (
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Status</th>
                  <th>Time Slot</th>
                  <th>Duration</th>
                  <th>Owner ID</th>
                  <th>Pet ID</th>
                  <th>Checklist</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingID}>
                    <td>{booking.bookingID}</td>
                    <td className={`status ${booking.status.toLowerCase()}`}>{booking.status}</td>
                    <td>{formatDateTime(booking.timeSlot)}</td>
                    <td>{booking.duration} hours</td>
                    <td>{booking.ownerID}</td>
                    <td>{booking.petID}</td>
                    <td>{booking.checklist || "No checklist provided"}</td>
                    <td>
                      {booking.status === "pending" ? (
                        <>
                          <button onClick={() => handleBookingAction(booking.bookingID, "accept")}>Accept</button>
                          <button onClick={() => handleBookingAction(booking.bookingID, "reject")}>Reject</button>
                        </>
                      ) : booking.status === "confirmed" ? (
                        <>
                          <button onClick={() => handleBookingAction(booking.bookingID, "cancel")}>Cancel</button>
                          {canStartSession(booking.timeSlot) && (
                            <button onClick={() => window.location.href = `/tracking?bookingID=${booking.bookingID}`}>
                              Start Session
                            </button>
                          )}
                        </>
                      ) : (
                        <span>{booking.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
