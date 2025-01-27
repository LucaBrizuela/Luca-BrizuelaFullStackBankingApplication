import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Stores the logged-in user details
  const [token, setToken] = useState(null); // Stores the JWT token

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
