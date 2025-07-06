import React from 'react';
import { motion } from 'framer-motion';

const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200';
  const errorClasses = error ? 'border-error-500 focus:ring-error-500' : '';
  const disabledClasses = disabled ? 'bg-secondary-50 cursor-not-allowed' : '';

  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <motion.input
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;