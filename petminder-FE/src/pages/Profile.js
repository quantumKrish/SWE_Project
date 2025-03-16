import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name || 'Guest'}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {/* 
        If role is "minder", display pet minders info (services, rates, etc.)
        If role is "owner", display owned pets, booking history, etc. 
      */}
      {/* Insert additional profile info or forms here */}
    </div>
  );
}

export default Profile;
