import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login status

  const login = (userData) => {
    setUser(userData); // Save user data on login
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

