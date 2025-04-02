import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

function SearchPetMinders() {

  const {username} = useParams();

  console.log(username);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect( () => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:4000/getuser/minder/username/${searchTerm}`);
        const data = await res.json();
        setResults(data);
      } catch(e) {
        throw e;
      }
    }
    if (username) {
      fetchData();
    }
  }, [username]);
    // TODO: Integrate API call to fetch pet minders by searchTerm
    // setResults(fetchedResults);

    // For now, just a placeholder
    /*setResults([
      { id: 11, name: 'John Doe', location: 'City Center' },
      { id: 2, name: 'Jane Smith', location: 'North Side' },
    ]);*/

  return (
    <div>
      <Navbar />
      <h2>Find a Pet Minder</h2>
      <input
        type="text"
        placeholder="Search by name, location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to={`/search/${searchTerm}`}>Search</Link>

      <div style={{ marginTop: '1rem' }}>
        {results.length > 0 ? (
          results.map((minder) => (
            <div key={minder.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
              <p><strong>Name:</strong> {minder.username}</p>
              <p><strong>Location:</strong> {minder.location}</p>
              {/* Possibly link to a detail page or booking page */}
              <Link to="/book/${searchTerm}" style={{ marginRight: '1rem' }}>Book</Link>
              <Link to={`/message/${minder.id}`} style={{ marginRight: '1rem' }}>Message</Link>
            </div>
          ))
        ) : (
          <p>No results yet. Try searching for a pet minder above.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPetMinders;
