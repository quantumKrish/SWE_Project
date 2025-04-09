import react from 'react';
import { useState, useEffect, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import "../CSS/editprofile.css";

function EditProfile() {
    let user = JSON.parse(localStorage.getItem("user"));

    const [name, setName] = useState(user.name || '');
    const [address, setAddress] = useState(user.address || '');
    const [availability, setAvailability] = useState(user.roleDetails?.availability || '');
    const [bio, setBio] = useState(user.roleDetails?.description || '');
    const navigate = useNavigate();

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/users/me`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify({
            name,
            address,
            role: user.role,
            roleDetails: {
                availability,
                description: bio,
            },

            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        let updatedUser = await response.json();
        updatedUser.token = user.token;
        user.roleDetails.availability = availability;
        user.roleDetails.description = bio;
        user.name = name;
        user.address = address;
        updatedUser.roleDetails = user.roleDetails;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Profile updated:', updatedUser);

        } catch (error) {
        console.error('Error updating profile:', error);
        }
        navigate('/profile');
    }

    return (
    <div class="app-container">
        <h1 class="page-title">Edit Profile</h1>
        
        <form class="form-section" onSubmit={handleUpdateProfile}>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div class="form-group">
            <label>Location</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          {user.role === 'minder' && (
                <div class="form-group">
                    <label>Availability</label>
                    <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} />
                    <label>Bio</label>
                    <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
            )}

          <div class="button-group">
            <Link to="/profile" class="go-back-button">Go Back</Link>
            <button type="submit" class="save-button">Save Changes</button>
          </div>
          <Navbar />
        </form>
    </div>
    );
}

export default EditProfile;