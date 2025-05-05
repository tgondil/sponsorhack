import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Google Client ID
const GOOGLE_CLIENT_ID = '366694381799-aukid3rtlhbgljckmtdpk3uecukd6861.apps.googleusercontent.com';

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Google Sign-In
  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuthStatus = async () => {
      try {
        // Set withCredentials to true to include cookies in the request
        const response = await axios.get('/api/user', { withCredentials: true });
        
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Initialize Google Sign-In
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      // If Google API is not loaded yet, wait for it
      window.addEventListener('load', () => {
        if (window.google && window.google.accounts) {
          initializeGoogleSignIn();
        }
      });
    }
  }, []);

  const initializeGoogleSignIn = () => {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      auto_select: false
    });
  };

  // Handle Google Sign-In callback
  const handleGoogleSignIn = async (response) => {
    try {
      const token = response.credential;
      
      // Decode JWT token to get user information (in a real app, verify on server)
      const decodedToken = parseJwt(token);
      
      // Send token to backend to verify and create session
      const serverResponse = await axios.post('/api/auth/verify-token', {
        token,
        email: decodedToken.email,
        name: decodedToken.name
      }, { withCredentials: true });
      
      if (serverResponse.data.success) {
        setUser({
          name: decodedToken.name,
          email: decodedToken.email
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  // Helper function to decode JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Login function - render the Google Sign-In button
  const login = (buttonRef) => {
    if (window.google && window.google.accounts && buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 250
      });
      
      // Also display the One Tap dialog
      window.google.accounts.id.prompt();
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/auth/logout', { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      
      // Also sign out from Google
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 