import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/password-success.css";
import { useState } from 'react';

function PasswordSuccess() {

    const navigate = useNavigate();

    const handleButtonClick = (e) => {
        e.preventDefault();
        navigate("/login");
    }

    return (
    <main class="password-reset-success">
      <section class="success-container">
        <span class="success-icon" aria-hidden="true">✅</span>
        <h1 class="success-heading">Successfully<br />Set New Password!</h1>
        <p class="success-message">
          You can now sign in with your new password
        </p>
        <button
          class="sign-in-button"
          role="button"
          onClick={handleButtonClick}
        >Back to Sign In</button>
      </section>
    </main>
    )
}

export default PasswordSuccess;