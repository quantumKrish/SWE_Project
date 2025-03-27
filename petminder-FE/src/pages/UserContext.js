import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    username: "",
    role: "owner",
    token: null, 
  });

  
  const login = async ({ email, password }) => {
    try {
      
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login request failed");
      }

      const data = await response.json();
      
      const { token, user: userInfo } = data;
      setUser({
        id: userInfo.id,
        username: userInfo.username,
        role: userInfo.role,
        token,
      });

      localStorage.setItem("token", token);

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser({ id: null, name: "", role: "owner", token: null });
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
