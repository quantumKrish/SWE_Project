import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/register-page.css";

function SignUp() {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    

    if (password !== checkPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      alert("Registration successful!");

      navigate("/login");
    } catch (err) {
      console.error("Sign-up error:", err);
      alert("An error occurred during sign-up. Please try again.");
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowRolePopup(true);
  };

  const handleConfirmRole = () => {
    if (!selectedRole) {
      alert("Please select a role before confirming.");
      return;
    }
    setRole(selectedRole);
    setShowRolePopup(false);
    setShowUsernamePopup(true);
  };

  return (
    <main class="register-page">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/82d483615798456e8eba6eee5f39bef1/ca48325ce9badd3c8a8a395ed4e995ededa6d048?placeholderIfAbsent=true"
        alt="Minder Logo"
        class="logo"
      />

      <h1 class="welcome-heading">Welcome to Minder!</h1>
      <p class="create-account-text">Create your account</p>

      <form class="registration-form">
        <div class="input-container">
          <div class="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              class="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span class="input-icon" aria-hidden="true">✉️</span>
          </div>
        </div>

        <div class="input-container">
          <div class="input-wrapper">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              class="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <span class="input-icon" aria-hidden="true">🔒</span> */}
          </div>
        </div>

        <div class="input-container">
          <div class="input-wrapper">
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Re-enter Password"
              required
              class="form-input"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
            />
            {/* <span class="input-icon" aria-hidden="true">🔒</span> */}
          </div>
        </div>

        <button type="button" class="register-button" onClick={handleRegisterClick}>Register</button>
      </form>

      <div class="login-section">
        <p class="login-text">Already have an account?</p>
        <Link to="/login" class="login-link">Log in!</Link>
      </div>

      {showRolePopup && (
        <div className="role-popup">
          <div className="popup-content">
            <h2>Choose your role</h2>
            <div className="role-options">
              <label className="radio-container">
                <input
                  type="radio"
                  name="userRole"
                  value="owner"
                  checked={selectedRole === "owner"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <span className="custom-radio"></span>
                <span className="label-text">Pet Owner</span>
              </label>

              <label className="radio-container">
                <input
                  type="radio"
                  name="userRole"
                  value="minder"
                  checked={selectedRole === "minder"}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <span className="custom-radio"></span>
                <span className="label-text">Pet Minder</span>
              </label>
            </div>

            <button className="confirm-button" onClick={handleConfirmRole}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {showUsernamePopup && (
        <div className="role-popup">
          <div className="popup-content">
            <h2>Choose your username</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
            />
            <button
              className="confirm-button"
              onClick={function () {
                setShowUsernamePopup(false);
                handleSubmit();
              }
            }
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default SignUp;