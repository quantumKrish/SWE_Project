import React, { useState } from 'react';

function BookPetMinder() {
  // For demonstration, we have a form with placeholder fields
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    duration: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate booking API
    console.log('Booking submitted:', bookingDetails);
    alert('Booking submitted (placeholder)!');
  };

  return (
    <div>
      <h2>Book a Pet Minder</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={bookingDetails.date}
            onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            value={bookingDetails.time}
            onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
          />
        </div>
        <div>
          <label>Duration (hours):</label>
          <input
            type="number"
            value={bookingDetails.duration}
            onChange={(e) => setBookingDetails({ ...bookingDetails, duration: e.target.value })}
          />
        </div>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default BookPetMinder;
