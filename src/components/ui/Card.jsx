import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-secondary-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  const CardComponent = onClick ? motion.div : 'div';

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;