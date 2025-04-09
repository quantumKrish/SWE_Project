import React from "react";
import "../CSS/landing-page.css";
import { useNavigate } from "react-router-dom";
import {useState} from 'react';

function LandingPage() {
    const navigate = useNavigate();
    const [isFading, setIsFading] = useState(false);
    const handleClick = () => {
        setIsFading(true);

        setTimeout(() => {
            navigate("/login");
        }, 500);
    };

    return (
    <div id="landing-container" className={isFading ? "fade-out" : ""}>
      <header class="brand-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/82d483615798456e8eba6eee5f39bef1/ca48325ce9badd3c8a8a395ed4e995ededa6d048?placeholderIfAbsent=true"
          alt="Minder Logo"
          class="logo-image"
        />
        <h1 class="brand-name">Minder</h1>
      </header>
      <div class="action-container">
        <button
          onClick={handleClick}
          class="action-button"
          aria-label="Get Started"
          id="login-button"
        >
          <i class="ti ti-arrow-right arrow-icon"></i>
        </button>
      </div>
    </div>
    );
}

export default LandingPage;