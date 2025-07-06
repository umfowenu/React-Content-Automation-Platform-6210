import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for testing
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@contentai.com',
    password: 'password123',
    company: 'ContentAI Pro',
    website: 'https://contentai.com'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'demo@contentai.com',
    password: 'demo123',
    company: 'Demo Company',
    website: 'https://demo.com'
  },
  {
    id: '3',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test123',
    company: 'Test Company',
    website: 'https://test.com'
  }
];

// Always use mock mode for this demo
const shouldUseMock = () => {
  return true; // Force mock mode
};

export const authService = {
  async login(email, password) {
    console.log('Login attempt:', { email, password });
    
    if (shouldUseMock()) {
      // Mock authentication
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Checking mock users...', mockUsers);
          const user = mockUsers.find(u => u.email === email && u.password === password);
          console.log('Found user:', user);
          
          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            const response = {
              user: userWithoutPassword,
              token: 'mock-jwt-token-' + user.id
            };
            console.log('Login successful:', response);
            resolve(response);
          } else {
            console.log('Login failed: Invalid credentials');
            reject({ message: 'Invalid email or password' });
          }
        }, 800); // Simulate network delay
      });
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('API login error:', error);
      // Fallback to mock if API fails
      return this.login(email, password);
    }
  },

  async register(userData) {
    console.log('Register attempt:', userData);
    
    if (shouldUseMock()) {
      // Mock registration
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const existingUser = mockUsers.find(u => u.email === userData.email);
          if (existingUser) {
            reject({ message: 'Email already exists' });
          } else {
            const newUser = {
              id: Date.now().toString(),
              ...userData
            };
            // Add to mock users for future logins
            mockUsers.push(newUser);
            
            const { password: _, ...userWithoutPassword } = newUser;
            const response = {
              user: userWithoutPassword,
              token: 'mock-jwt-token-' + newUser.id
            };
            console.log('Registration successful:', response);
            resolve(response);
          }
        }, 800);
      });
    }

    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('API register error:', error);
      // Fallback to mock if API fails
      return this.register(userData);
    }
  },

  async getCurrentUser() {
    console.log('Getting current user...');
    
    if (shouldUseMock()) {
      // Mock get current user
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const token = Cookies.get('auth_token');
          console.log('Current token:', token);
          
          if (token && token.startsWith('mock-jwt-token-')) {
            const userId = token.replace('mock-jwt-token-', '');
            const user = mockUsers.find(u => u.id === userId);
            if (user) {
              const { password: _, ...userWithoutPassword } = user;
              console.log('Current user found:', userWithoutPassword);
              resolve(userWithoutPassword);
            } else {
              console.log('User not found for token');
              reject({ message: 'User not found' });
            }
          } else {
            console.log('Invalid or missing token');
            reject({ message: 'Invalid token' });
          }
        }, 300);
      });
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('API getCurrentUser error:', error);
      // Fallback to mock if API fails
      return this.getCurrentUser();
    }
  },

  async updateProfile(userData) {
    if (shouldUseMock()) {
      // Mock update profile
      return new Promise((resolve) => {
        setTimeout(() => {
          const token = Cookies.get('auth_token');
          if (token && token.startsWith('mock-jwt-token-')) {
            const userId = token.replace('mock-jwt-token-', '');
            const updatedUser = { ...userData, id: userId };
            console.log('Profile updated:', updatedUser);
            resolve(updatedUser);
          }
        }, 500);
      });
    }

    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('API updateProfile error:', error);
      return this.updateProfile(userData);
    }
  },

  async changePassword(oldPassword, newPassword) {
    if (shouldUseMock()) {
      // Mock change password
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // For demo purposes, accept any old password
          resolve({ message: 'Password changed successfully' });
        }, 500);
      });
    }

    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('API changePassword error:', error);
      return this.changePassword(oldPassword, newPassword);
    }
  },

  async forgotPassword(email) {
    if (shouldUseMock()) {
      // Mock forgot password
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Password reset email sent' });
        }, 500);
      });
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('API forgotPassword error:', error);
      return this.forgotPassword(email);
    }
  },

  async resetPassword(token, newPassword) {
    if (shouldUseMock()) {
      // Mock reset password
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Password reset successful' });
        }, 500);
      });
    }

    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('API resetPassword error:', error);
      return this.resetPassword(token, newPassword);
    }
  },

  logout() {
    console.log('Logging out...');
    Cookies.remove('auth_token');
  }
};