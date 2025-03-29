import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import Navbar from '../components/Navbar';

function Profile() {
  const { user } = useContext(UserContext);
  console.log("User in Profile:", user);

  if (!user) {
    return (
      <div>
        <Navbar />
        <h2>Profile</h2>
        <p>You are not logged in. Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h2>Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.username || 'Guest'}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Verified:</strong> {user.verified}</p>
      <p><strong>Rating:</strong> {user.roleDetails.ratings}</p>
      {user.role === 'minder' && (
        <>
          <p><strong>Availability:</strong> {user.roleDetails.availability}</p>
          <p><strong>Services:</strong> {user.roleDetails.description}</p> 
        </>  
      )}
      {/* Insert additional profile info or forms here */}
    </div>
  );
}

export default Profile;