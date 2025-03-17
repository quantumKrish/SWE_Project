import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/search" style={{ marginRight: '1rem' }}>Search</Link>
      <Link to="/tracking" style={{ marginRight: '1rem' }}>Tracking</Link>
      <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
    </nav>
  );
}

export default Navbar;
