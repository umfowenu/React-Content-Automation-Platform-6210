import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...');
      const token = Cookies.get('auth_token');
      console.log('Found token:', token);
      
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('User data loaded:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to load user:', error);
          Cookies.remove('auth_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No token found');
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext: Login attempt', { email });
    try {
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response', response);
      
      setUser(response.user);
      setIsAuthenticated(true);
      Cookies.set('auth_token', response.token, { expires: 7 });
      
      console.log('AuthContext: Login successful');
      return response;
    } catch (error) {
      console.error('AuthContext: Login failed', error);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('AuthContext: Register attempt', userData);
    try {
      const response = await authService.register(userData);
      console.log('AuthContext: Register response', response);
      
      setUser(response.user);
      setIsAuthenticated(true);
      Cookies.set('auth_token', response.token, { expires: 7 });
      
      console.log('AuthContext: Registration successful');
      return response;
    } catch (error) {
      console.error('AuthContext: Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('auth_token');
    authService.logout();
  };

  const updateUser = (userData) => {
    console.log('AuthContext: Updating user', userData);
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};