import React from 'react';
import Navbar from '../components/Navbar';

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : "Guest";
  return (
    <div>
      <h1>Welcome {username} to PetMinder</h1>
      <p>Your one-stop solution for pet minding services.</p>
      <Navbar />
    </div>
  );
}

export default Home;
