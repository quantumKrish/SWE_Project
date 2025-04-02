import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/add-pet.css";
import Navbar from "../components/Navbar";

function AddPet() {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState(0);
  const [petWeight, setPetWeight] = useState("");
  const [petDescription, setPetDescription] = useState("");
  const [petImage, setPetImage] = useState(null);
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user"));

  const goBack = () => {
    navigate("/profile");
  };

  const setUpdatedUser = async () => {
    try {
        const response = await fetch(`http://localhost:4000/users/me`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        data.token = user.token;
        localStorage.setItem('user', JSON.stringify(data));
        console.log('User data updated:', data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/users/me/pet`, {
        method: "PUT",
        headers: {
            'Content-Type': "application/json",
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: petName,
          type: petType,
          breed: petBreed,
          age: petAge,
          description: petDescription,
          // photo: petImage, // Uncomment if you want to handle file uploads
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add pet");
      }

      const data = await response.json();
      console.log("Pet added:", data);
      setUpdatedUser();
      navigate("/profile");
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  }

  return (
    <div class="app-container">
    <div class="scrollable-content">
      <div class="add-pet-page">
        <h1 class="page-title">Add a New Pet</h1>

        <form class="add-pet-form" id="addPetForm" onSubmit={handleSubmit}>
          <label>
            Pet Name
            <input type="text" onChange={(e)=>{setPetName(e.target.value)}} required />
          </label>

          <label>
            Type
            <select name="type" required onChange={(e)=>{setPetType(e.target.value)}}>
              <option value="">Select a type</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Breed
            <input type="text" name="breed" placeholder="e.g. Labrador, Siamese" required onChange={(e)=>{setPetBreed(e.target.value)}} />
          </label>

          <label>
            Age
            <input type="number" name="age" required onChange={(e)=>{setPetAge(e.target.value)}} />
          </label>

          <label>
            Notes (optional)
            <textarea name="notes" placeholder="Temperament, allergies, etc." onChange={(e)=>{setPetDescription(e.target.value)}}  ></textarea>
          </label>

          {/* <label class="file-upload">
            Upload Photo
            <input type="file" name="photo" accept="image/*" />
          </label> */}

          <div class="form-actions">
            <button type="button" class="cancel-button" onclick={goBack}>Cancel</button>
            <button type="submit" class="submit-button">Add Pet</button>
          </div>
        </form>
      </div>
    </div>
    <Navbar />
  </div>
  )}

  export default AddPet;