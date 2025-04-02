import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';
import { useContext } from 'react';
import '../CSS/profile.css';

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate("/login");
  }

  return (
    <nav class="bottom-navigation">
      <div class="nav-background"></div>
      <div class="nav-icons">

        <Link to="/home" aria-label="Home">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/700457b31836db1d0b395fea39fb88c8c67be541" class="nav-icon" alt="Home" />
        </Link>
        <Link to="/home" aria-label="Messages">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/90c0fa9386108cc4b6b2d22a3755f8429b1df731" class="nav-icon" alt="Messages" />
        </Link>

        {user && user.role === 'owner' && (
          <>
            <Link to="/search" class="search-button" aria-label="Search">🔍</Link>
            {/* <Link to="/tracking" style={{ marginRight: '1rem' }}>Tracking</Link> */}
          </>
        )}

        <Link to="/home" aria-label="Settings">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b7ab3e93b6956692a7a790f3b78eaeb88398c90" class="nav-icon-large" alt="Settings" />
        </Link>
        <Link to="/profile" aria-label="Profile">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5b95812132a4e335c2892d2eed0e35d70aa6271" class="nav-icon active-icon" alt="Profile" />
        </Link>
        
        {user &&(
          <button class="logout-button" onClick={handleLogout}>Logout</button>
        )}

        {!user && (
          <>
            <Link to="/login" style={{marginRight: '1rem'}}>Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
