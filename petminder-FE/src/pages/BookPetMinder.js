import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { UserContext } from './UserContext';

function BookPetMinder() {
  const { user } = useContext(UserContext);

  const [pets, setPets] = useState([]);
  const [minders, setMinders] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedMinderId, setSelectedMinderId] = useState('');
  const [ownerID, setOwnerID] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    duration: ''
  });

  // Fetch owner's pets and ownerID 
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:4000/users/petowner/user/${user.id}`)
        .then(res => res.json())
        .then(owner => {
          setOwnerID(owner.ownerID);
          return fetch(`http://localhost:4000/pets/owner/${owner.ownerID}`);
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);  // Log the data
          setPets(Array.isArray(data) ? data : [])
        })  


        .catch(err => console.error('Error fetching pets:', err));
    }
  }, [user]);

  // Fetch available minders
  useEffect(() => {
    fetch('http://localhost:4000/users/minders')
      .then(res => res.json())
      .then(data => setMinders(data))
      .catch(err => console.error('Error fetching minders:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Safety check before submission
    if (!ownerID) {
      alert('Owner information not loaded yet.');
      return;
    }

    const bookingPayload = {
      ownerID: ownerID,
      minderID: selectedMinderId ? parseInt(selectedMinderId) : null,
      petID: selectedPetId ? parseInt(selectedPetId) : null,
      status: 'pending',
      timeSlot: `${bookingDetails.date} ${bookingDetails.time}`,
      checklist: ''
    };

    try {
      const res = await fetch('http://localhost:4000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Booking successful! ID: ' + data.bookingID);
      } else {
        const errorMsg = data.error || data.message || 'Unknown error';
        alert('Booking failed: ' + errorMsg);
      }
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h2>Book a Pet Minder</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Pet Dropdown */}
          <div>
            <label>Choose Pet: </label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              required
            >
              <option value="">-- Select Pet --</option>
              {pets.map((pet) => (
                <option key={pet.petID} value={pet.petID}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          
          <div>
            <label>Choose Minder: </label>
            <select
              value={selectedMinderId}
              onChange={(e) => setSelectedMinderId(e.target.value)}
              required
            >
              <option value="">-- Select Minder --</option>
              {minders.map((minder) => (
                <option key={minder.minderID} value={minder.minderID}>
                  {minder.username}
                </option>
              ))}
            </select>
          </div>

          
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
