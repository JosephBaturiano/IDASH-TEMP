import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for user information
export const UserContext = createContext();

// Define the UserProvider component
export const UserProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}users/me`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });
        setCurrentUserId(response.data.id); // Set the current user's ID
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUser();
  }, [apiBaseUrl, authUsername, authPassword]);

  return (
    <UserContext.Provider value={{ currentUserId }}>
      {children}
    </UserContext.Provider>
  );
};
