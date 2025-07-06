import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import SafeIcon from '../../common/SafeIcon';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notifications } = useWebSocket();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-secondary-200 fixed top-0 right-0 left-0 z-40"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 lg:hidden"
            >
              <SafeIcon icon={FiMenu} className="w-6 h-6" />
            </button>
            
            <Link to="/" className="ml-4 lg:ml-0">
              <h1 className="text-xl font-bold text-primary-600">
                ContentAI Pro
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-md">
                <SafeIcon icon={FiBell} className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="w-8 h-8 text-secondary-400" />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-md"
                title="Logout"
              >
                <SafeIcon icon={FiLogOut} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;