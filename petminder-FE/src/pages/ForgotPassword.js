import React, {useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/forgot-password.css";
import {useState} from 'react';
import emailjs from "@emailjs/browser";

function ForgotPassword() {
    const navigate = useNavigate();
    const [isFading, setIsFading] = useState(false);
    const [email, setEmail] = useState("");
    
    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsFading(true);
        
        const code = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem("code", code);
        localStorage.setItem("email", email);
        
        emailjs.send("service_6345qzi","template_9e2gqld", {passcode: code, email: email}, "q97nIhsvlt3b0KQuC").then((result) => {
            console.log(result.text);
        }
        ).catch((error) => {
            console.log(error.text);
        });

        setTimeout(() => {
            navigate("/code-sent");
        }, 500);
    };

    return (
    <main id="forgot-password-page" className={isFading ? "fade-out" : ""}>
      <h1 class="page-heading">Forgot Password</h1>

      <div class="lock-icon-container">
        <span class="lock-icon" aria-hidden="true">🔒</span>
      </div>

      <p class="instruction-text">Enter Email Address</p>

      <form class="password-reset-form" onSubmit={handleForgotPassword}>
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

        <button type="submit" class="submit-button">Send Code</button>
      </form>

      <Link to="/login" class="back-link">Back to Login</Link>
    </main>
    )
}

export default ForgotPassword;