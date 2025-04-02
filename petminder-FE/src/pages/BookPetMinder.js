import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

function BookPetMinder() {
  const { id } = useParams();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [ownerID, setOwnerID] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    duration: '',
  });

  // Fetch pet details from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.roleDetails && userData.roleDetails.pets) {
        setPets(userData.roleDetails.pets);
        setOwnerID(userData.roleDetails.ownerID);
      }
    }
  }, []);

  // Handle Booking Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerID) {
      alert('Owner information not loaded yet.');
      return;
    }

    const bookingPayload = {
      ownerID: ownerID,
      minderID: parseInt(id), // Ensure minder ID is correctly set
      petID: selectedPetId ? parseInt(selectedPetId) : null,
      status: 'pending',
      timeSlot: `${bookingDetails.date} ${bookingDetails.time}`,
      checklist: '',
    };

    try {
      const res = await fetch('http://localhost:4000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Booking successful! ID: ' + data.bookingID);
      } else {
        alert('Booking failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h2>You're booking a session with minder ID: {id}</h2>
        <form onSubmit={handleSubmit}>
          {/* Pet Dropdown from Local Storage */}
          <div>
            <label>Choose Pet: </label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              required
            >
              <option value="">-- Select Pet --</option>
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <option key={pet.petID} value={pet.petID}>
                    {pet.name} ({pet.type})
                  </option>
                ))
              ) : (
                <option disabled>No pets found</option>
              )}
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label>Date: </label>
            <input
              type="date"
              value={bookingDetails.date}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, date: e.target.value })
              }
              required
            />
          </div>

          {/* Time Input */}
          <div>
            <label>Time: </label>
            <input
              type="time"
              value={bookingDetails.time}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, time: e.target.value })
              }
              required
            />
          </div>

          {/* Duration Input */}
          <div>
            <label>Duration (hours): </label>
            <input
              type="number"
              min="1"
              value={bookingDetails.duration}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, duration: e.target.value })
              }
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
