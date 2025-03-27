import React from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "../CSS/verify-email.css";
import {useState} from 'react';

function VerifyEmail() {

    const navigate = useNavigate();
    const [userInput, setUserInput] = useState("");

    const resendCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        const email = localStorage.getItem("email");
        localStorage.setItem("code", code);

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

    const verifyCode = () => {
        const code = localStorage.getItem("code");

        if (userInput === code) {
            navigate("/set-new-password");
        } else {
            alert("Invalid code. Please try again.");
        }
    }

    return (
    <main class="verification-page">
      <h1 class="page-heading">Verify Your Email</h1>

      <div class="email-icon-container">
        <svg
          class="email-icon"
          width="165"
          height="165"
          viewBox="0 0 165 165"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="82.5" cy="82.5" r="82.5" fill="#E3F2FD"></circle>
          <rect
            x="37"
            y="52"
            width="91"
            height="61"
            rx="8"
            fill="#2196F3"
          ></rect>
          <path
            d="M37 60L80.0718 89.1056C81.8966 90.2952 84.1034 90.2952 85.9282 89.1056L129 60"
            stroke="white"
            stroke-width="8"
            stroke-linecap="round"
          ></path>
        </svg>
      </div>

      <h2 class="verification-title">Enter the code</h2>

      <div class="code-input-container">
        <input
          type="text"
          id="verification-code"
          class="code-input"
          placeholder="Enter the code"
          aria-label="Verification code input field"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>

      <div class="buttons-container">
        <button
          type="button"
          class="resend-button"
          aria-label="Resend verification code"
          onClick={resendCode}
        >
          <span class="button-text">Resend Code</span>
        </button>

        <button
          type="button"
          class="verify-button"
          aria-label="Verify email with entered code"
          onClick={verifyCode}
        >
          <span class="button-text">Verify</span>
        </button>
      </div>

      <Link to="/login" class="back-link">Back to Login</Link>
    </main>
    )
}

export default VerifyEmail;