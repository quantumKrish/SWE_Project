import react from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/code-sent-page.css";

function CodeSent() {
    const navigate = useNavigate();
    const redirectToVerifyEmail = () => {
        navigate("/verify-email");
    };

    return (
    <main class="confirmation-page">
        <h1 class="page-heading">Forgot Password</h1>
  
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
            <circle cx="82.5" cy="82.5" r="82.5" fill="#E3F2FD" />
            <rect x="37" y="52" width="91" height="61" rx="8" fill="#2196F3" />
            <path
              d="M37 60L80.0718 89.1056C81.8966 90.2952 84.1034 90.2952 85.9282 89.1056L129 60"
              stroke="white"
              stroke-width="8"
              stroke-linecap="round"
            />
          </svg>
        </div>
  
        <h2 class="confirmation-title">Code Sent!</h2>
        <p class="confirmation-message">Please check your email</p>
  
        <button
          class="proceed-button"
          aria-label="Proceed to next step"
          onClick={redirectToVerifyEmail}
        >
          <span class="button-text">Proceed</span>
        </button>
  
        <Link to="/login" class="back-link">Back to Login</Link>
      </main>
    )
}

export default CodeSent;