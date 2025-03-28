import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "../CSS/login-page.css";

function LogIn() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { user, login } = useContext(UserContext);

  const handleLogin = async (e) => {

    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/Profile");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    }
  };

  return (
  <main class="login-page">
    <img
      src="https://cdn.builder.io/api/v1/image/assets/82d483615798456e8eba6eee5f39bef1/ca48325ce9badd3c8a8a395ed4e995ededa6d048?placeholderIfAbsent=true"
      alt="Minder Logo"
      class="logo"
    />

    <h1 class="welcome-heading">Welcome to Minder!</h1>
    <p class="access-text">Access your account</p>

    <form class="login-form" onSubmit={handleLogin}>
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
          <span class="input-icon" aria-hidden="true">🔒</span>
        </div>
      </div>

      <button type="submit" class="login-button">Login</button>
    </form>

    <Link to="/forgot-password" class="forgot-password">Forgot password?</Link>

    <div class="register-section">
      <p class="register-text">Don't have an account?</p>
      <Link to="/signup" class="register-link">Register!</Link>
    </div>
  </main>
  );
}

export default LogIn;