import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';
import { useContext } from 'react';

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/home" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/search" style={{ marginRight: '1rem' }}>Search</Link>
      <Link to="/tracking" style={{ marginRight: '1rem' }}>Tracking</Link>
      <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
      <button onClick={handLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;