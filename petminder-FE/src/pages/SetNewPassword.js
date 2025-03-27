import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/set-new-password.css";
import {useState} from 'react';

function SetNewPassword() {

    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const response = fetch("http://localhost:4000/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            password: password,
          }),
        });
        navigate("/password-success");
    };

    return (
    <main class="password-reset-page">
      <h1 class="page-heading">Set New Password</h1>

      <div class="lock-icon-container">
        <span class="lock-icon" aria-hidden="true">🔒</span>
      </div>

      <form
        class="password-reset-form"
        onSubmit={handleSubmit}
      >
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
            {/* <span class="input-icon" aria-hidden="true">🔑</span> */}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* <span class="input-icon" aria-hidden="true">🔑</span> */}
          </div>
        </div>

        <div class="form-actions">
          <Link to="/login" class="back-link">Back to Login</Link>
          <button type="submit" class="submit-button">Set Password</button>
        </div>
      </form>
    </main>
    )
}

export default SetNewPassword;