import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
        auth: {
          userId: user.id,
          token: user.token
        }
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('WebSocket connected');
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('WebSocket disconnected');
      });

      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 49)]);
      });

      newSocket.on('campaign_update', (data) => {
        // Handle campaign updates
        console.log('Campaign update:', data);
      });

      newSocket.on('content_generated', (data) => {
        // Handle content generation completion
        console.log('Content generated:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const emitEvent = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    connected,
    notifications,
    emitEvent,
    clearNotifications
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};