import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // ✅ import it directly

function BookPetMinder() {
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    duration: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingPayload = {
      ownerID: 1,
      minderID: 2,
      petID: 3,
      status: 'pending',
      timeSlot: `${bookingDetails.date} ${bookingDetails.time}`,
      checklist: '',
    };

    try {
      const res = await fetch('http://localhost:4000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Booking successful! ID: ' + data.bookingID);
      } else {
        alert('❌ Booking failed: ' + data.error);
      }
    } catch (err) {
      alert('❌ Booking failed: ' + err.message);
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Navbar just for this page */}
      <div style={{ padding: '1rem' }}>
        <h2>Book a Pet Minder</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={bookingDetails.date}
              onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Time:</label>
            <input
              type="time"
              value={bookingDetails.time}
              onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Duration (hours):</label>
            <input
              type="number"
              value={bookingDetails.duration}
              onChange={(e) => setBookingDetails({ ...bookingDetails, duration: e.target.value })}
              required
            />
          </div>
          <button type="submit">Book Now</button>
        </form>
      </div>
    </>
  );
}

export default BookPetMinder;
