import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/review.css"; // Ensure this path is correct

const ReviewBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async () => {
    try {
      const payload = {
        reviewerID: user.id,
        reviewedUserID: booking.minderID,
        bookingID: booking.bookingID,
        rating,
        comment,
      };

      await axios.post("http://localhost:4000/reviews", payload);
      alert("Review submitted!");
      navigate("/home"); 
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(error.response?.data?.error || "Something went wrong.");
    }
  };

  if (!booking) return <p>Loading booking info...</p>;

  return (
    <div className="review-container">
      <h2 className="review-heading">Leave a Review</h2>
      <p className="booking-info">Booking ID: {booking.bookingID}</p>
      <p className="booking-info">Minder ID: {booking.minderID}</p>

      <label className="rating-label">Rating (1-5):</label>
      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="rating-input"
      />

      <br />

      <label className="comment-label">Comment:</label>
      <br />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        cols={40}
        placeholder="Write something nice!"
        className="comment-textarea"
      />

      <br />
      <button onClick={handleSubmit} className="submit-button">
        Submit Review
      </button>
    </div>
  );
};

export default ReviewBooking;
