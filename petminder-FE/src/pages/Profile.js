import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/profile.css";
import ReviewerName from '../components/ReviewerName';

function Profile() {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user"));
  let verified = "No";
  if(user && user.verified == 1) {
    verified = "Yes";
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <h2>Profile</h2>
        <p>You are not logged in. Please log in to view your profile.</p>
      </div>
    );
  }

  const handleAddPet = () => {
    navigate('/add-pet');
  }

  async function deletePet(petID) {
    console.log("Deleting pet with ID:", petID);
    try {
      const response = await fetch(`http://localhost:4000/users/${petID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      user.roleDetails.pets = user.roleDetails.pets.filter(pet => pet.petID !== petID);
      localStorage.setItem('user', JSON.stringify(user));

    } catch (error) {
      console.error('Error deleting pet:', error);
    }
    navigate('/profile');
  }
  

  return (
  <div class="fade-in">
    <div class="app-container">
      <div class="scrollable-content">
        <div class="profile-page">

          <section class="profile-header">
            {/* <img src="https://via.placeholder.com/100" alt="Profile picture" class="profile-picture" /> */}
            <h2 class="username">@{user.username}</h2>
            <p class="full-name">{user.name}</p>
            <p class="location">📍 {user.address}</p>
            <p class="verified-status">Verified: {verified}</p>
            {user.role === 'minder' && (
              <>
                <p class="bio">Bio: {user.roleDetails.description}</p>
                <p class="availability">Availability: {user.roleDetails.availability}</p>
              </>
            )}
          </section>
          <Link to="/edit-profile" class="edit-button" aria-label="Edit Profile">Edit Profile</Link>

          {user.role === 'minder' && user.roleDetails && user.roleDetails.reviews && (
              <section className="reviews-section">
                <h3 className="section-title">Reviews</h3>
                <div id="reviewsContainer" aria-live="polite">
                  {user.roleDetails.reviews.map((review) => (
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
              </section>
            )}

          { user.role === 'owner' && (
            <section className="reviews-section">
            <h3 className="section-title">Pets</h3>
            <div id="reviewsContainer" aria-live="polite">
              {user.roleDetails.pets.map((pet) => (
                <>
                <div key={pet.petID} className="review-card">
                  <p><strong>Name: </strong>  {pet.name} </p>
                  <p><strong>Breed: </strong> {pet.breed}</p>
                  <p><strong>Age: </strong> {pet.age}</p>
                  <p><strong>Notes: </strong> {pet.description}</p>
                </div>
                <button className="delete-pet-button" onClick={() => deletePet(pet.petID)}>Delete</button>
                </>
              ))}
            </div>
            <button className="add-pet-button" onClick={handleAddPet}>Add Pet</button>
          </section>
          )}
          <div class="nav-spacer"></div>
        </div>
      </div>
    </div>
    <Navbar />
  </div>

  );
}

export default Profile;
