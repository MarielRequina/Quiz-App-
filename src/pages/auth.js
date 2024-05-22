import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase'; // Assuming you have firebase initialized

// Create a context for authentication
const AuthContext = createContext();

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your application with
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
