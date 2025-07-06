import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiTarget, 
  FiBarChart2, 
  FiSettings, 
  FiCreditCard,
  FiX 
} from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Campaigns', href: '/campaigns', icon: FiTarget },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/settings', icon: FiSettings },
    { name: 'Billing', href: '/billing', icon: FiCreditCard },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -320 }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary-600 bg-opacity-75 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200 lg:hidden">
          <h1 className="text-xl font-bold text-primary-600">ContentAI Pro</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`
              }
            >
              <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;