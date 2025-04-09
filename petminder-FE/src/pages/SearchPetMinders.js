import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/profile.css'
function SearchPetMinders() {
  const { username } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:4000/getuser/minder/username/${searchTerm}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      }
    }
    if (username) {
      fetchData();
    }
  }, [username]);

  return (
    <div className="app-container">
      <Navbar />
      <div className="scrollable-content profile-page">

        <h2 className="section-title" style={{ alignSelf: 'flex-start' }}>
          Find a Pet Minder
        </h2>

        <input
          type="text"
          placeholder="Search by name, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            fontSize: '14px',
            fontFamily: 'Rowdies, sans-serif'
          }}
        />

        <Link
          to={`/search/${searchTerm}`}
          className="search-button"
          style={{ marginBottom: '20px' }}
        >
          Go
        </Link>

        <div className="reviews-section">
          {results.length > 0 ? (
            results.map((minder) => (
              <div key={minder.id} className="review-card">
                <p className="reviewer-name">Name: <Link to={`/minder/${minder.id}`}>{minder.username}</Link></p>
                <p className="location">Location: {minder.address}</p>
                <div style={{ marginTop: '8px' }}>
                  <Link to={`/book/${minder.id}`} className="edit-button" style={{ marginRight: '10px' }}>
                    Book
                  </Link>
                  <Link to={`/message/${minder.id}`} className="edit-button" style={{ marginRight: '10px' }}>
                    Message
                  </Link>
                  <Link to={`/report/${minder.id}`} className="logout-button">
                    Report
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="review-text">No results yet. Try searching for a pet minder above.</p>
          )}
        </div>

        <div className="nav-spacer" />
      </div>
    </div>
  );
}

export default SearchPetMinders;
