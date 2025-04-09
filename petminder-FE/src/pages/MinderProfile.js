import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/profile.css'; // Ensure this is styled to match the design
import ReviewerName from '../components/ReviewerName'; // Assuming you have a component to fetch reviewer names

function MinderProfile() {
  // Extract the id parameter from the URL
  const { id } = useParams();
  const [minderData, setMinderData] = useState(null);

  useEffect(() => {
    // Fetch the data for this specific minder using the id
    async function fetchMinderData() {
      try {
        const response = await fetch(`http://localhost:4000/users/minder/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // If needed, include auth headers
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch minder data');
        }
        const data = await response.json();
        setMinderData(data);
      } catch (error) {
        console.error('Error fetching minder data:', error);
      }
    }

    fetchMinderData();
  }, [id]);

  // Optional: show a loading indicator while fetching data
  if (!minderData) {
    return <div>Loading Minder Profile...</div>;
  }

  return (
    <div class="fade-in">
    <div class="app-container">
      <div class="scrollable-content">
        <div class="profile-page">

          <section class="profile-header">
            {/* <img src="https://via.placeholder.com/100" alt="Profile picture" class="profile-picture" /> */}
            <h2 class="username">@{minderData.username}</h2>
            <p class="full-name">{minderData.name}</p>
            <p class="location">📍 {minderData.address}</p>
            <p class="verified-status">Verified: {minderData.verified}</p>
            {minderData.role === 'minder' && (
              <>
                <p class="bio">Bio: {minderData.roleDetails.description}</p>
                <p class="availability">Availability: {minderData.roleDetails.availability}</p>
              </>
            )}
          </section>
              <section className="reviews-section">
                <h3 className="section-title">Reviews</h3>
                <div id="reviewsContainer" aria-live="polite">
                  {minderData.roleDetails.reviews.map((review) => (
                    <div key={review.reviewID} className="review-card">
                      <p>
                        <ReviewerName reviewerID={review.reviewerID} />
                      </p>
                      <div class="rating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                      <p class="review-text">{review.comment}</p>
                      <p className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                <Navbar />
              </section>
            
            </div>
          </div>
        </div>
    </div>       
  );
}

export default MinderProfile;
