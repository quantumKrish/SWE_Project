import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    // Placeholder user data
    id: null,
    name: '',
    role: 'owner', // "owner" or "minder"
  });

  // Placeholder login/logout functions
  const login = (userData) => {
    // TODO: add login logic or API calls here
    setUser(userData);
  };

  const logout = () => {
    // TODO: add logout logic
    setUser({ id: null, name: '', role: 'owner' });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
